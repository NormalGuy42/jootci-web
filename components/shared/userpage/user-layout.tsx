"use client"

import Link from "next/link"
import AdminUserButton from "../admin/admin-user-button"
import { useState, useRef, useEffect } from "react";
import { BurgerIcon } from "../../icons/Icons";
import { cn } from "../../../lib/utils";
import { usePathname } from "next/navigation";
import { SideNavLink } from "../../../types/customTypes";


export default function UserPageLayout({
    children,
    links,
    ...props
  }: {
    children: React.ReactNode,
    links: Array<SideNavLink>
  }) {
    const [showMenu,setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const burgerRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname()
    
    const collapseMenu = ()=>{
        setShowMenu(!showMenu)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && !burgerRef.current?.contains(event.target as Node)) {
                setShowMenu(false); // Hide nav if clicking outside  
            }
            };
        
            document.addEventListener("mousedown", handleClickOutside);
        
            return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            };
    }, []);
    return (
        <div className="flex flex-col ">
          <div className="border-b z-10 bg-white header_container flex items-center justify-between">
            <div className="flex h-16 items-center px-4">
              <Link href="/" className="pr-2">
                <img
                  src="/images/appIcon.png"
                  width={80}
                  height={80}
                  alt={`Tibb-Jox logo`}
                />
              </Link>
              <div ref={burgerRef}>
                  <BurgerIcon function={collapseMenu}/>
              </div>
            </div>
            {/* <AdminUserButton/> */}
          </div>
          <div className="flex-1 space-y-4 relative flex">
                <nav
                    ref={menuRef}
                    className={cn('flex items-center space-x-4 lg:space-x-6 main-green-bg sidenav ',  showMenu? 'show-sidenav':'')}
                    {...props}
                >
                <ul>
                {links.map((item) => (
                <li key={item.href} onClick={collapseMenu}>
                    <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                    'text-sm text-white font-medium transition-colors hover:text-white',
                    pathname.includes(item.href) ? 'active-sidenav-item' : ''
                    )}
                >
                    {item.icon}
                    {item.title}
                </Link>
                </li>
                ))}
                </ul>
            </nav>
            <div className='dashboard-content w-full max-w-4xl mx-auto px-3'>
                {children}
            </div>
          </div>
        </div>
    )
  }