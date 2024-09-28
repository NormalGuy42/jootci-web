import UserHeader from "../../components/shared/header/UserHeader";
import { UserNavBar } from "../../components/navbars/UserNavbar"
import MainNav from "./main-nav";
import Link from "next/link";
import { Menu } from "../../components/shared/header/menu";

export const metadata = {
    title: "Tibb-Jox",
    description: 'Generated by Next.js',
  }
  
  export default function UserDashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div>
        {/* <UserHeader/>
        <UserNavBar /> */}
         <>
        <div className="flex flex-col">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <Link href="/" className="w-36">
                <img
                  src="/images/appIcon.png"
                  width={48}
                  height={48}
                  alt={`Tibb-Jox logo`}
                />
              </Link>
              <MainNav className="mx-6" />
              <div className="ml-auto flex items-center space-x-4">
                <Menu />
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
        </div>
      </>
      </div>
    )
  }