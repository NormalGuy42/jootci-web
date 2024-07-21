import Footer from "@/components/Footer"
import Header from "@/components/Header"
import Link from "next/link";

const Register = () => {
    return(
        <div>
            <Header/>
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
                        <Link href="login">Vous avez deja un compte?</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;