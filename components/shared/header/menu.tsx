"use client"

import { useEffect, useRef, useState } from "react";
import { BurgerIcon } from "../../icons/Icons";
import { usePathname } from "next/navigation";

const links = [
    {
        title: 'Accueil',
        url: '/'
    },
    {
        title: 'Shop',
        url: '/search'
    },
    {
        title: 'A propos',
        url: '/about'
    },
    {
        title: 'Contact',
        url: '/contact'
    }
]

export function Nav(){
    const pathname = usePathname()

    return(
        <ul className={"flex justify-between gap-8 desktop-menu"}>
            {links.map(link=>(
                <li><a href={link.url} className={pathname == link.url ? 'main-green-text' : pathname}>{link.title}</a></li>
            ))}
        </ul>
    )
}
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
                <Nav/>
            </ul>
            <BurgerIcon function={collapseMenu}/>
        </div>
    )
}