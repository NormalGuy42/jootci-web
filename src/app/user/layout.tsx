import UserHeader from "@/components/Headers/UserHeader";
import { UserNavBar } from "@/components/Navbars/UserNavbar"

export const metadata = {
    title: "Joot-Ci",
    description: 'Generated by Next.js',
  }
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div>
        <UserHeader/>
        <UserNavBar />
        {children}
      </div>
    )
  }