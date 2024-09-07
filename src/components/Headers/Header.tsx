"use client";

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { AccountIcon, BagIcon } from "../Icons/Icons";




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
              console.log("click outside")
            }
          };
      
          document.addEventListener("mousedown", handleClickOutside);
      
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
    }, []);
    return(
        <header className="header w-full h-24 border-b border-gray-400">
            <div className="flex justify-between h-full">
                <div className="flex gap-2">
                    <div className="logo w-20 flex items-center">
                        <Link href='/'>
                            <img src="/images/appIcon.png" alt="" />
                        </Link>
                    </div>

                    <nav className={"flex items-center"} ref={menuRef}>
                        <ul className={showMenu? "flex justify-between gap-8 desktop-menu menu-show border-b border-gray-400" : "flex justify-between gap-8 desktop-menu"}>
                            <li><a href="/">Accueil</a></li>
                            <li><a href="/shop">Shop</a></li>
                            <li><a href="/about">A propos</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                        <div className="mobile-menu flex justify-center items-center pr-4 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#16a34a" height={50} width={50} onClick={collapseMenu} className="burger">
                                <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/>
                            </svg>
                        </div>
                    </nav>
                </div>
                <div className="flex items-center gap-2 pr-4">
                    <AccountIcon/>
                    <BagIcon/>
                </div>
            </div>
        </header>
    )
}