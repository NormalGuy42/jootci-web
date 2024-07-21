import Link from "next/link"


function UserIcon(){
    return(
        <Link href={'user/login'}>
            <div className="flex flex-col items-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height={32} width={32}>
                    <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/>
                </svg>
                <p>Compte</p>
            </div>
        </Link>
    )
}
function BagIcon(){
    return(
        <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="32px" width="32px" version="1.1" id="Capa_1" viewBox="0 0 483.1 483.1">
                <g>
                    <path d="M434.55,418.7l-27.8-313.3c-0.5-6.2-5.7-10.9-12-10.9h-58.6c-0.1-52.1-42.5-94.5-94.6-94.5s-94.5,42.4-94.6,94.5h-58.6   c-6.2,0-11.4,4.7-12,10.9l-27.8,313.3c0,0.4,0,0.7,0,1.1c0,34.9,32.1,63.3,71.5,63.3h243c39.4,0,71.5-28.4,71.5-63.3   C434.55,419.4,434.55,419.1,434.55,418.7z M241.55,24c38.9,0,70.5,31.6,70.6,70.5h-141.2C171.05,55.6,202.65,24,241.55,24z    M363.05,459h-243c-26,0-47.2-17.3-47.5-38.8l26.8-301.7h47.6v42.1c0,6.6,5.4,12,12,12s12-5.4,12-12v-42.1h141.2v42.1   c0,6.6,5.4,12,12,12s12-5.4,12-12v-42.1h47.6l26.8,301.8C410.25,441.7,389.05,459,363.05,459z"/>
                </g>
            </svg>
            <p>Panier</p>
        </div>
    )
}
export default function Header(){
    return(
        <header className="header w-full h-24 border-b border-gray-400">
            <div className="flex justify-between h-full">
                <div className="flex gap-4">
                    <div className="logo bg-green-600 w-20">
                        <Link href='/'>
                            <img src="/images/appIcon.png" alt="" />
                        </Link>
                    </div>

                    <nav className="flex items-center desktop-menu">
                        <ul className="flex justify-between gap-8">
                            <li>Accueil</li>
                            <li>Shop</li>
                            <li>A propos</li>
                            <li>Contact</li>
                        </ul>
                    </nav>
                    <div className="mobile-menu flex justify-center items-center pr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="green" height={50} width={50}>
                            <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/>
                        </svg>
                    </div>
                </div>
                <div className="flex items-center gap-2 pr-4">
                    <UserIcon/>
                    <BagIcon/>
                </div>
            </div>
        </header>
    )
}