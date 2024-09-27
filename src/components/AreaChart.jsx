import { useEffect, useRef } from "react";
import * as d3 from "d3";
import Loading from "./Loading";

const AreaChart = ({ data, filter, showLoading }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const tooltipRef = useRef();
  const colorCode = "#BC9645";

  useEffect(() => {
    if (!Array.isArray(data)) {
      d3.select(svgRef.current).selectAll("*").remove();
      const svg = d3
        .select(svgRef.current)
        .attr("width", "100%")
        .attr("height", 400)
        .attr("class", "flex items-center justify-center") 
        .append("g")
        .attr("transform", `translate(${wrapperRef.current.clientWidth / 2}, 200)`); 

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .text("No Data Found")
        .style("font-size", "16px")
        .style("fill", "#BC9645");

      return;
    } else {
      const margin = { top: 20, right: 30, bottom: 50, left: 40 },
        width = wrapperRef.current.clientWidth - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      d3.select(svgRef.current).selectAll("*").remove();

      const svg = d3
        .select(svgRef.current)
        .attr("width", "100%")
        .attr("height", height + margin.top + margin.bottom)
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`
        )
        .attr("preserveAspectRatio", "xMidYMid meet");

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const parseTime = filter === "yes" ? d3.timeParse("%Y") : d3.timeParse("%b %Y");

      data.forEach((d) => {
        d.date = parseTime(d.period);
        d.value = d.total_rent_collected;
      });

      // Sort the data by date (year or month/year)
      data.sort((a, b) => a.date - b.date);

      const x = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.date))
        .range([0, width]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .range([height, 0]);

      const area = d3
        .area()
        .x((d) => x(d.date))
        .y0(height)
        .y1((d) => y(d.value));

      const line = d3
        .line()
        .x((d) => x(d.date))
        .y((d) => y(d.value));

      svg
        .append("defs")
        .append("linearGradient")
        .attr("id", "area-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", y(0))
        .attr("x2", 0)
        .attr("y2", y(d3.max(data, (d) => d.value)))
        .selectAll("stop")
        .data([
          { offset: "0%", color: "rgba(188, 150, 69, 0.1)" },
          { offset: "100%", color: "rgba(188, 150, 69, 0.8)" },
        ])
        .enter()
        .append("stop")
        .attr("offset", (d) => d.offset)
        .attr("stop-color", (d) => d.color);

      g.append("path")
        .datum(data)
        .attr("fill", "url(#area-gradient)")
        .attr("d", area);

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", colorCode)
        .attr("stroke-width", 2)
        .attr("d", line);

      const xAxis = g.append("g").attr("transform", `translate(0,${height})`);

      if (filter === "yes") {
        xAxis.call(
          d3.axisBottom(x)
            .ticks(d3.timeYear.every(1))
            .tickFormat(d3.timeFormat("%Y"))
        );
      } else {
        xAxis.call(
          d3.axisBottom(x)
            .ticks(d3.timeMonth.every(1))
            .tickFormat(d3.timeFormat("%b %Y"))
            .tickSize(10)
        );
      }

      g.append("g")
        .attr("class", "y-axis")
        .call(
          d3.axisLeft(y)
            .ticks(6)
            .tickFormat((d) => `$${d / 1000}k`)
        )
        .selectAll("g.tick")
        .append("line")
        .attr("class", "grid-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("stroke", "#D0D5DD")
        .attr("stroke-dasharray", "3,3");

      const tooltip = d3.select(tooltipRef.current);

      g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.date))
        .attr("cy", (d) => y(d.value))
        .attr("r", 3)
        .attr("fill", colorCode)
        .on("mouseover", (event, d) => {
          tooltip
            .style("opacity", 1)
            .html(
              `<strong>Period:</strong> ${
                d.period
              }<br/><strong>Rent Collected:</strong> $${d.value.toLocaleString()}`
            )
            .style("left", event.pageX + 5 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", event.pageX + 5 + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });
    }
  }, [data, filter]);

  return (
    <>
      {showLoading === true ? (
        <Loading />
      ) : (
        <div className="" ref={wrapperRef}>
          <svg ref={svgRef}></svg>
          <div
            ref={tooltipRef}
            className="absolute text-sm p-2 bg-white border border-gray-400 rounded shadow-lg opacity-0 pointer-events-none"
          ></div>
        </div>
      )}
    </>
  );
};

export default AreaChart;
