
import React from "react"

const CategoryCard = (props:{title:string,imagePath:string, url:string}) => {
  return (
    <div className="flex flex-col justify-center items-center rounded p-8 border border-gray-300 w-64 cursor-pointer">
      <img src={props.imagePath} alt="" className="block h-32 w-32 object-cover rounded-full" />
      <span className="text-lg text-center p-2 font-semibold">{props.title}</span>
    </div>
  )
};

export default CategoryCard;
