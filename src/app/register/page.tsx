import { GoogleBtn, FacebookBtn } from "@/components/buttons/SocialLoginBtns";
import UserHeader from "@/components/Headers/UserHeader";
import { AccountIcon, BagIcon } from "@/components/Icons/Icons";
import Link from "next/link";

const Register = () => {
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
            <div className="py-32">
                <form action="" className="w-[380px] shadow-md mx-auto border rounded border-gray-400 pb-8">
                    <h2 className="sub-title text-center py-8">Creation de compte</h2>
                    <div className="flex flex-col pt-2 items-center">
                        <div className="flex flex-col pb-4">
                            <label htmlFor="#email">Email</label>
                            <input type="text" placeholder="Entrez votre email" id="email" className="p-3 border border-gray-400 w-[280px]"/>
                            <label htmlFor="#password" className="pt-4">Mot de passe</label>
                            <input type="password" placeholder="Entrez votre mot de passe" className="p-3 border border-gray-400 w-[280px]"/>
                            <label htmlFor="#password" className="pt-4">Numero de telephone</label>
                            <input type="password" placeholder="Entrez votre numero de telephone" className="p-3 border border-gray-400 w-[280px]"/>
                            <label htmlFor="#password" className="pt-4">Type de compte</label>
                            <select name="" id="" className="p-3 border border-gray-400 w-[280px]">
                                <option value="">Utilisateur</option>
                                <option value="">Vendeur</option>
                                <option value="">Livreur</option>
                            </select>
                        </div>
                        <button className="secondary-btn w-[280px]">Connectez vous</button>
                        <div className="flex justify-evenly p-4 w-full">
                            <GoogleBtn/>
                            <FacebookBtn/>
                        </div>
                        <Link href="login" className="pt-2">Vous avez deja un compte?</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;