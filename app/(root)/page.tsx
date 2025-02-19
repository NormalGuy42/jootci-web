// "use client";

import Link from "next/link";
import BlogCard from "../../components/cards/BlogCard";
import CategoryCard from "../../components/cards/CategoryCard";
import ProductCard from "../../components/cards/ProductCard";
import ProductList from "../../components/shared/product/product-list";
import { getAllProductCategories, getLatestProducts } from "../../lib/actions/product.actions";
import { BlogCardData, Category, CategoryCardData, ProductCardData } from "../../types/customTypes"
import { getAllCategories, getCategories } from "../../lib/actions/category.action";

const BlogSection = () =>{
  
  const blogs = [
    {"imageUrl":"/blog1.avif","date":"Janvier 20 2024","title":"Blog","text":""},
    {"imageUrl":"/blog2.avif","date":"Janvier 22 2024","title":"Blog","text":""},
    {"imageUrl":"/blog3.jpg","date":"Janvier 30 2024","title":"Blog","text":""},
  ]

  return(
    <div>
      <h1 className="title text-center pt-32 pb-12">Dernières mises à jour & articles</h1>
      <div className="main-section flex gap-4 justify-between blog-section">
          {blogs.map((blog:BlogCardData,index)=><BlogCard key={index} imageUrl={blog.imageUrl} title={blog.title} text={blog.text} date={blog.date} />)}
      </div>
    </div>
  )
}

const FillerSection = () =>{
  return(
    <div className="pt-32">
      <div className="relative h-[400px]">
        <img src="/bg2.jpg" alt="" className="w-full h-full object-cover opacity-50 absolute"/>
        <div className="content text-center w-full h-full absolute flex flex-col justify-center">
          <div className="main-section flex flex-col justify-center items-center">
            <h1 className="title py-8">Vivre Sain</h1>
            <p className="pb-6">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid sed nihil obcaecati? Distinctio odio aperiam quis cupiditate, eum porro facere.</p>
            <button className="secondary-btn w-60">Explorez nos produits</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const OurProducts = () => {
  const products = [
    {'name':'Ananas','type':'Fruit','price':'3000','imageUrl':'/images/ananas.png'},
    {'name':'Pomme','type':'Fruit','price':'5000','imageUrl':'/images/pomme.png'},
    {'name':'Tomate','type':'Legume','price':'3000','imageUrl':'/images/tomate.png'},
    {'name':'Laitue','type':'Legume','price':'2000','imageUrl':'/images/laitue.png'},
    {'name':'Raisins','type':'Fruit','price':'9000','imageUrl':'/images/raisins.png'},
    {'name':'Patate','type':'Legume','price':'1000','imageUrl':'/images/patate.png'},
  ]

  return(
    <div className="main-section pt-32">
      <h1 className="title text-center py-8">Produits populaires</h1>
      <div className="grid grid-cols-3 justify-center justify-items-center gap-8 products-section">
        {products.map((product:ProductCardData,index)=><ProductCard key={index} price={product.price} name={product.name} imageUrl={product.imageUrl}  />)}
      </div>
    </div>
  )
}

const FewReasons = () => {
  const StatBox = (props:{text:string, number:string,url:string}) =>{
    return(
      <div className="flex">
        <img src={props.url} alt="" className="block h-16 W-16"/>
        <div>
          <h3 className="text-white text-4xl">{props.number}</h3>
          <p className="light-green-text">{props.text}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="pt-32">
      <div className="py-32 bg-dark-green">
          <div className="main-section">
            <h1 className="title text-white pb-8">Pourquoi choisir Tibb-Jox</h1>
            <p className="text-balance text-white pb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque itaque cupiditate asperiores necessitatibus quidem voluptates nulla distinctio accusamus ad. In aspernatur error voluptate natus totam iste mollitia nemo assumenda ea.</p>
            <button className="secondary-btn">Explorez</button>
          </div>
      </div>
      <div className="bg-light-green relative">
        <img src="/bg-img-drawings.png" alt="" className="block absolute opacity-10 h-full w-full object-cover" />
        <div className="grid grid-cols-4 justify-between py-20 main-section stat-section">
          <StatBox text="Clients satisfaits" number="142" url="stars.svg" />
          <StatBox text="Agriculteurs experts" number="124" url="farmer.svg" />
          <StatBox text="Produits" number="109" url="wheat.svg" />
          <StatBox text="Commandes" number="189" url="cart.svg" />
        </div>
      </div>
    </div>
  )
}

const BannerSection = () => {
  const Banner = (props:{text:string,overlayColor:string,}) => {
    return(
      <div className="w-1/2 h-80 relative rounded-lg border banner-section-item">
        <div className={"overlay"+ props.overlayColor +" absolute z-10 h-full w-full"}></div>
        <img src="/images/banner-1.jpeg" alt="" className="absolute h-full w-full object-cover" />
        <div className="absolute z-20 h-full flex flex-col justify-center p-4">
          <span className="text-white">100% Organique</span>
          <h2 className="text-white sub-title py-6">{props.text}</h2>
          <button className="secondary-btn-yellow w-24">Achetez</button>
        </div>
      </div>
    )
  }
  return(
    <div className="main-section banner-section flex justify-between gap-20 pt-32">
      <Banner text="Produits frais tous les jours" overlayColor=""/>
      <Banner text="Qualite garantie" overlayColor="-dark"/>
    </div>
  )
}

const OurCategories = ({ categories }: {categories: Array<Category>}) => {

  return(
    <div className="main-section">
      <h1 className="title text-center p-8">Nos Categories</h1>
      <div className="grid grid-cols-4 items-center justify-between category-section">
        {categories.map((category:Category,index)=><CategoryCard key={index}  title={category.name} imagePath={category.image} url={category.slug} />)}
      </div>
    </div>
  )
}


const FeatureSection = () => {

  const FeatureItem = (props:{title:string, url:string ,text:string}) =>{
    return(
      <div className="flex justify-center feature-section-item">
        <img src={"/icons/"+props.url} alt="" height={60} width={60} className="block"/>
        <div>
          <h3 className="font-bold">{props.title}</h3>
          <span>{props.text}</span>
        </div>
      </div>
    )
  }
  return(
    <div className="feature-section grid grid-cols-4 items-center feature-section main-section border border-gray-300 py-5 rounded-lg shadow">
      <FeatureItem title="Paiement Securises" text="Vos paiements sont 100% securises" url="card.svg"/>
      <FeatureItem title="Localisateur de magasin" text="Trouvez le magasin le plus proche" url="store.svg"/>
    </div>
  )
}

const HeroSection = () => {
  return (
    <div className="hero h-[90vh] w-full relative">
      <img src="/bg.avif" alt="" className="h-full w-full absolute object-cover opacity-90" />
      
      <div className="main-section">
      <div className="tagline absolute top-1/3 ">
        <div className="">
          <h1 className="main-title">Produits sains et organiques</h1>
          <Link href="/search">
            <button className="main-btn">Achetez maintenant</button>
          </Link>
        </div>
      </div>
      </div>
    </div>
  )
};



export default async function Home() {

  const latestProducts = await getLatestProducts()
  const categories = await getCategories()

  return (
    <div>
      <HeroSection/>

      <OurCategories categories={categories}/>

      <div className="space-y-8">
        <h1 className="title text-center p-8">Nouveautes</h1>
        <ProductList data={latestProducts} />
      </div>

      {/* <BannerSection/>
      
      <FewReasons/> */}
      
      {/* <FillerSection/> */}
      {/* <BlogSection/> */}
   </div>
  );
}
