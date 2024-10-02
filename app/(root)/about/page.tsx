
const AboutSection = () => {
    return(
      <div className="main-section pt-32">
        <div className="flex about-section gap-4">
          <img src="/deliveryPerson.avif" alt="" className="block  about-section-item w-1/2 max-h-[650px] object-cover"/>
          <div className="about-section-item w-1/2">
            <h1 className="title py-8"> A propos</h1>
            <p className="pb-6">Tibb - Jox est une application révolutionnaire de commande gratuite qui comble le fossé entre les entre les agriculteurs et l'industrie
              l'industrie de l'alimentation et des boissons. Nous
              nous mettons en relation les restaurants,
              supermarchés et les hôtels
              avec les agriculteurs locaux, ce qui facilite
              facile de s'approvisionner en produits
              produits les plus frais et de la meilleure
              de la plus haute qualité. <br /> <br /> 
              Notre plateforme
              conviviale rationalise le
              processus de commande, garantissant
              une livraison dans les délais et
              et permet aux acheteurs et aux vendeurs
              et les vendeurs de la chaîne d'approvisionnement
              d'approvisionnement agricole
  
              </p>
            <button className="secondary-btn">Explorez</button>
          </div>
        </div>
      </div>
    )
}

export default function AboutPage(){
    return(
        <div>
          <AboutSection/>
        </div>
    )
}