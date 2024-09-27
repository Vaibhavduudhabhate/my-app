"use client"

import { useState } from "react";
import PropertyTab from "./PropertyTab";

const DailyReportTabBox = ({summaryTab,summaryTabContent}) => {
    const [activeTabKey, setActiveTabKey] = useState("collections");
    const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="tabs">
          <ul className="flex pb-6">
            {summaryTab.map((tab, index) => (
              // console.log(index)
              <li
                key={index}
                className={`mr-8 border-b-2 text-lg leading-7 cursor-pointer ${
                  activeTab === index
                    ? "border-22222E text-22222E"
                    : "border-white text-667085"
                }`}
                onClick={() => {
                  setActiveTab(index); // First state update
                  setActiveTabKey(tab.key); // Second state update (this should probably be a different state setter function)
                }}
              >
                {tab.name}
              </li>
            ))}
          </ul>
          <div>
            {/* {propertyTab != undefined && ( */}
              <PropertyTab data={summaryTabContent} activeKey={activeTabKey} />
          </div>
        </div>
  )
}

export default DailyReportTabBox
