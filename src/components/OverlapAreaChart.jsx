import { useEffect, useRef } from "react";
import * as d3 from "d3";
import Loading from "./Loading";

const OverlapAreaChart = ({ data, showLoading }) => {
  
  const svgRef = useRef();
  const wrapperRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    // Check if data is available
    if (!data || !data.current_month || !data.previous_month) {
      d3.select(svgRef.current).selectAll("*").remove();
      const svg = d3
  .select(svgRef.current)
  .attr("width", "100%")
  .attr("height", 400)
  .attr("class", "flex items-center justify-center") // Flexbox centering with Tailwind classes
  .append("g")
  .attr("transform", `translate(${wrapperRef.current.clientWidth / 2}, 200)`); // Center horizontally

svg
  .append("text")
  .attr("text-anchor", "middle") // Center the text horizontally
  .text("No Data Found")
  .style("font-size", "16px")
  .style("fill", "#BC9645");
      return;
    }

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

    // Define gradients for the current and previous months
    const defs = svg.append("defs");

    defs.append("linearGradient")
      .attr("id", "gradient-previous")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", "0%").attr("y1", "100%")
      .attr("x2", "0%").attr("y2", "0%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "rgba(188, 150, 69, 0.1)" },
        { offset: "100%", color: "rgba(188, 150, 69, 0.8)" },
      ])
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    defs.append("linearGradient")
      .attr("id", "gradient-current")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", "0%").attr("y1", "100%")
      .attr("x2", "0%").attr("y2", "0%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "rgba(34, 34, 46, 0.1)" },
        { offset: "100%", color: "rgba(34, 34, 46, 0.8)" },
      ])
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    // Parse the date / time
    const parseTime = d3.timeParse("%Y-%m-%d");

    // Parse and sort the data
    const currentMonthData = data.current_month
      .map((d) => ({
        ...d,
        date: parseTime(d.period),
        day: new Date(parseTime(d.period)).getDate(), // Extract day of the month
      }))
      .sort((a, b) => a.date - b.date); // Sort by date

    const previousMonthData = data.previous_month
      .map((d) => ({
        ...d,
        date: parseTime(d.period),
        day: new Date(parseTime(d.period)).getDate(), // Extract day of the month
      }))
      .sort((a, b) => a.date - b.date); // Sort by date

    // Set up the x-scale using days of the month
    const x = d3
      .scaleBand()
      .domain(d3.range(1, 32)) // Days from 1 to 31
      .range([0, width])
      .padding(0.2);

    // Set up the y-scale using the max value across both datasets
    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max([
          d3.max(currentMonthData, (d) => d.total_rent_collected),
          d3.max(previousMonthData, (d) => d.total_rent_collected),
        ]),
      ])
      .range([height, 0]);

    // Define the area generators for both datasets
    const areaCurrentMonth = d3
      .area()
      .x((d) => x(d.day) + x.bandwidth() / 2)
      .y0(height)
      .y1((d) => y(d.total_rent_collected));

    const areaPreviousMonth = d3
      .area()
      .x((d) => x(d.day) + x.bandwidth() / 2)
      .y0(height)
      .y1((d) => y(d.total_rent_collected));

    // Draw the area for the previous month
    g.append("path")
      .datum(previousMonthData)
      .attr("fill", "url(#gradient-previous)") // Use gradient for previous month
      .attr("stroke", "none")
      .attr("d", areaPreviousMonth);

    // Draw the area for the current month
    g.append("path")
      .datum(currentMonthData)
      .attr("fill", "url(#gradient-current)") // Use gradient for current month
      .attr("stroke", "none")
      .attr("d", areaCurrentMonth);

    // Add dots for the previous month
    g.selectAll(".dot-previous")
      .data(previousMonthData)
      .enter()
      .append("circle")
      .attr("class", "dot-previous")
      .attr("cx", (d) => x(d.day) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.total_rent_collected))
      .attr("r", 5)
      .attr("fill", "#BC9645")
      .on("mouseover", (event, d) => {
        d3.select(tooltipRef.current)
          .style("opacity", 1)
          .html(
            `<strong>Previous Month</strong><br/><strong>Date:</strong> ${d.period}<br/><strong>Rent Collected:</strong> $${d.total_rent_collected.toLocaleString()}`
          )
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mousemove", (event) => {
        d3.select(tooltipRef.current)
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        d3.select(tooltipRef.current).style("opacity", 0);
      });

    // Add dots for the current month
    g.selectAll(".dot-current")
      .data(currentMonthData)
      .enter()
      .append("circle")
      .attr("class", "dot-current")
      .attr("cx", (d) => x(d.day) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.total_rent_collected))
      .attr("r", 5)
      .attr("fill", "#2A2C3D")
      .on("mouseover", (event, d) => {
        d3.select(tooltipRef.current)
          .style("opacity", 1)
          .html(
            `<strong>Current Month</strong><br/><strong>Date:</strong> ${d.period}<br/><strong>Rent Collected:</strong> $${d.total_rent_collected.toLocaleString()}`
          )
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mousemove", (event) => {
        d3.select(tooltipRef.current)
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        d3.select(tooltipRef.current).style("opacity", 0);
      });

    // Add x-axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3.axisBottom(x)
          .tickValues(d3.range(1, 32)) // Display days 1 to 31
          .tickFormat(d => d)
      );

    // Add y-axis
    g.append("g").call(d3.axisLeft(y));
  }, [data]);

  return (
    <>
        {
            showLoading === true ? (
                <Loading />
              ) : (
                <div ref={wrapperRef} className="w-full">
                <svg ref={svgRef}></svg>
                <div
                    ref={tooltipRef}
                    className="absolute text-sm p-2 bg-white border border-gray-300 rounded shadow-lg"
                    style={{ opacity: 0 }}
                ></div>
                </div>
              )
        }
    </>
  );
};

export default OverlapAreaChart;
