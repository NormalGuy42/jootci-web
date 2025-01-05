"use client"

import { useEffect, useRef, useState } from "react";
import { BurgerIcon } from "../../icons/Icons";

export function Menu(){
    const [showMenu,setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    
    const collapseMenu = ()=>{
        setShowMenu(!showMenu)
    }

    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) ) {
              setShowMenu(false); // Hide nav if clicking outside
            }
          };
      
          document.addEventListener("mousedown", handleClickOutside);
      
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
    }, []);
    return(
        <div ref={menuRef}>

            <ul className={showMenu? "flex justify-between gap-8 mobile-menu menu-show border-b border-gray-400" : "flex justify-between gap-8 mobile-menu"}>
                <li><a href="/">Accueil</a></li>
                <li><a href="/shop">Shop</a></li>
                <li><a href="/about">A propos</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
            <BurgerIcon function={collapseMenu}/>
        </div>
    )
}