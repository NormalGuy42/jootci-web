
import React from "react"
import { capitalize } from "../../lib/utils";
import Link from "next/link";

const CategoryCard = (props:{title:string,imagePath:string, url:string}) => {
  return (
    <Link href={`search?q=all&category=${capitalize(props.title)}`}>
      <div className="flex flex-col justify-center items-center rounded-md p-8 border border-gray-300 w-64 cursor-pointer light-green-bg">
      <img src={props.imagePath} alt="" className="block h-32 w-32 object-cover" />
      <span className="text-lg text-center p-2 font-semibold">{capitalize(props.title)}</span>
    </div>
    </Link>
  )
};

export default CategoryCard;
