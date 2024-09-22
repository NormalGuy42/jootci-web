"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AccountIcon, BagIcon } from "./Header";

export default function Header(){
    const [showMenu,setShowMenu] = useState(false);
    const menuRef = useRef<HTMLUListElement | null>(null);
    
    const collapseMenu = ()=>{
        setShowMenu(!showMenu)
    }

    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
              setShowMenu(false); // Hide nav if clicking outside
            }
          };
      
          document.addEventListener("mousedown", handleClickOutside);
      
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
    }, []);
    return(
        <header className="header w-full h-24 border-b border-gray-400">
            <div className="flex justify-end h-full">
                <div className="flex items-center justify-end gap-2 pr-4">
                    <AccountIcon/>
                    <BagIcon/>
                </div>
            </div>
        </header>
    )
}