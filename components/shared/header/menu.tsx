"use client"

import { useEffect, useRef, useState } from "react";

export function Menu(){
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
        <div>

            <ul className={showMenu? "flex justify-between gap-8 mobile-menu menu-show border-b border-gray-400" : "flex justify-between gap-8 mobile-menu"} ref={menuRef}>
                <li><a href="/">Accueil</a></li>
                <li><a href="/shop">Shop</a></li>
                <li><a href="/about">A propos</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
            <div className="flex justify-center items-center pr-4 cursor-pointer burger-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#16a34a" height={50} width={50} className="burger" onClick={collapseMenu}>
                    <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/>
                </svg>
            </div>
        </div>
    )
}