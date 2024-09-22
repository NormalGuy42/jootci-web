"use client";

import Link from "next/link"
import { CreditCardIcon, FavoriteIcon, HomeIcon, NotificationIcon, ProfileIcon, ReceiptIcons, SettingsIcon } from "../icons/Icons"
import { useState, useRef, useEffect } from "react";

export function NavBarItem(props:{url:string,text:string,icon:React.ReactElement}){
    return(
        <div className="nav-bar-item">
            <Link href={props.url}>
                {props.icon}
                <p>{props.text}</p>
            </Link>
        </div>
    )
}


export function UserNavBar(){
    const [navOpen,setNavOpen] = useState(false);
    const sideNavRef = useRef<HTMLDivElement | null>(null);
    
    const collapseMenu = ()=>{
        setNavOpen(!navOpen)
    }

    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sideNavRef.current && !sideNavRef.current.contains(event.target as Node)) {
                setNavOpen(false); // Hide nav if clicking outside
            }
          };
      
          document.addEventListener("mousedown", handleClickOutside);
      
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
    }, []);
    
    return(
        <div ref={sideNavRef}>
            <div className="sidenav-upper flex gap-3 fixed top-2 z-10">
                <div className="logo w-20">
                    <Link href='/'>
                        <img src="/images/appIcon.png" alt="" />
                    </Link>
                </div>

                <div className="mobile-menu flex justify-center items-center pr-4 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#16a34a" height={50} width={50} onClick={collapseMenu} className="burger">
                        <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/>
                    </svg>
                </div>
            </div>
            <ul className={navOpen? "sidenav sidenav-show" : "sidenav"}>
                <li>
                    <NavBarItem url="/user/home" text="Acceuil" icon={<HomeIcon/>} />                
                </li>
                <li>
                    <NavBarItem url="/user/profile" text="Profile" icon={<ProfileIcon/>} />                
                </li>
                <li>
                    <NavBarItem url="/user/favorite" text="Favoris" icon={<FavoriteIcon/>} />                
                </li>
                <li>
                    <NavBarItem url="/user/payment-methods" text="Paiements" icon={<CreditCardIcon/>} />                
                </li>
                <li>
                    <NavBarItem url="/user/orders" text="Commandes" icon={<ReceiptIcons/>} />                
                </li>
                <li>
                    <NavBarItem url="/user/notification" text="Notification" icon={<NotificationIcon/>} />                
                </li>
                <li>
                    <NavBarItem url="/user/settings" text="Parametres" icon={<SettingsIcon/>} />                
                </li>
            </ul>
        </div>
    )
}