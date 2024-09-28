import React from "react"
const LetterIcon = () => {
  return(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height={72} width={72} fill="white"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>
  )
}

const LocationIcon = () => {
  return(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="white" height={32} width={32}>
      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
    </svg>
  )
}

const PhoneIcon = () => {
  return(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="white" height={32} width={32}>
      <path d="M16 64C16 28.7 44.7 0 80 0L304 0c35.3 0 64 28.7 64 64l0 384c0 35.3-28.7 64-64 64L80 512c-35.3 0-64-28.7-64-64L16 64zM224 448a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM304 64L80 64l0 320 224 0 0-320z"/>
    </svg>
  )
}

const Newsletter = () => {
  return(
    <div className="flex justify-center">
      <div className="newsletter bg-light-green w-[80vw] p-8 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-2 newsletter-title">
          <LetterIcon/>
          <h2 className="sub-title">Abonnez vous a notre newsletter</h2>
        </div>
        <div className="flex bg-white w-[300px] p-1 h-14 rounded-lg" >
          <input type="text" placeholder="Adresse Email" className="w-[320px]"/>
          <button className="secondary-btn-yellow p-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height={24} width={24} fill="white">
              <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}


const Footer = () => {
  return (
    <div className="pt-32 footer">
      {/* <Newsletter/> */}
      <div className="bg-dark-green py-8">
        <div className="main-section flex justify-between footer-section">
          <div>
            <img src="/images/appIcon.png" alt="" height={120} width={120} className="pb-4"/>
            <p>Nous fournissons les particuliers avec des produits frais</p>
          </div>
          <div>
            <h3 className="sub-title-section pb-4">Explorez</h3>
            <ul className="sub-section">
              <li><a href="">A propos</a></li>
              <li><a href="">Nos Produits</a></li>
              <li><a href="">Devenir un vendeur</a></li>
              <li><a href="">FAQ</a></li>
              <li><a href="">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="sub-title-section pb-4">Contact</h3>
            <p className="light-grey-text">Pour toute question, contactez nous a info@jootci.com</p>
            <div className="flex py-4 items-center">
              <LocationIcon />
              <p className="max-h-16 light-grey-text">1 rue El Hadji Amadou Assane Ndoye, Dakar,</p>
            </div>
            <div className="flex pb-4 items-center">
              <PhoneIcon/>
              <p className="light-grey-text">70 07 30 08</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Footer;
