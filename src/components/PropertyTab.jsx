const PropertyTab = ({data, activeKey}) => {
  console.log("data", data[activeKey], activeKey);
  return (
    <div className="flex flex-wrap md:flex-nowrap gap-x-3 mb-4">
        {data[activeKey].map(({price, label}) => (
        <div className="flex-1 bg-theme_primary_bg p-4 mb-3 md:mb-0" key={label}>
            <h3 className="text-E9E9EA font-semibold text-text-40px leading-11.5 mb-3">{price}</h3>
            <p className="text-A4A4A9 text-lg font-normal">{label}</p>
        </div>
        ))}
    </div>
  )
}

export default PropertyTab