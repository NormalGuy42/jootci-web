"use client";

import UserHeader from "@/components/Headers/UserHeader";
import { AccountIcon, BagIcon } from "@/components/Icons/Icons";
import Link from "next/link";

const Login = () => {
    return(
        <div>
            <header className="header w-full h-24 border-b border-gray-400">
                <div className="flex justify-between h-full">
                    <div className="flex gap-4">
                        <div className="logo w-20">
                            <Link href='/'>
                                <img src="/images/appIcon.png" alt="" />
                            </Link>
                        </div>

                    </div>
                    <div className="flex items-center gap-2 pr-4">
                        <AccountIcon/>
                        <BagIcon/>
                    </div>
                </div>
            </header>
            <div className="pt-32">
                <form action="" className="w-[380px] shadow-md mx-auto border rounded border-gray-400 pb-8">
                    <h2 className="sub-title text-center py-8">Bienvenue</h2>
                    <div className="flex flex-col pt-2 items-center">
                        <div className="flex flex-col pb-4">
                            <label htmlFor="#email">Email</label>
                            <input type="text" placeholder="Entrez votre email" id="email" className="p-3 border border-gray-400 w-[280px]"/>
                            <label htmlFor="#password" className="pt-4">Mot de passe</label>
                            <input type="password" placeholder="Entrez votre votre mot de passe" className="p-3 border border-gray-400 w-[280px]"/>
                        </div>
                        <button className="secondary-btn w-[280px] py-2" type="button" onClick={()=>window.location.href="/user"}>Connectez vous</button>
                        <Link href="register" className="pt-2">Creez votre compte</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;