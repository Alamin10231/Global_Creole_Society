import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { HiMiniCalendarDateRange } from "react-icons/hi2";
import { MdOutlineWork } from "react-icons/md";
import { SlLocationPin } from "react-icons/sl";
import { data } from "react-router-dom";

const AboutMe = ({ handleEditAboutPopup, data }) => {
  return (
    <div className="relative">
      <section>
        <div className="flex justify-between text-lg font-semibold space-y-3">
          <h3 className="font-bold text-xl">About Me </h3>
          <BsThreeDots
            size={20}
            className="cursor-pointer hover:scale-105"
            onClick={handleEditAboutPopup} // trigger modal open
          />
        </div>
        <div className="flex flex-col opacity-70 space-y-1">
          <div className="flex justify-between">
            <SlLocationPin size={20} />
            <p className="text-lg">
              {data?.about?.location || "Unknown location"}
            </p>
          </div>
          <div className="flex justify-between">
            <HiMiniCalendarDateRange size={20} />
            <p className="text-lg">{data?.about?.joined}</p>
          </div>
          <div className="flex justify-between truncate">
            <MdOutlineWork size={20} />
            <p className="text-lg">
              {data?.about?.workplace || "backend doesn't added data"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutMe;
