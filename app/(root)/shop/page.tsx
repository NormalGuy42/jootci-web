'use server'


import ProductList from "../../../components/shared/product/product-list"
import { getLatestProducts } from "../../../lib/actions/product.actions"



export default async function Shop(){
    const latestProducts = await getLatestProducts()
    
    return(
        <div>
            <h2 className="title text-center py-8">Latest Products</h2>
            <ProductList title="" data={latestProducts} />
        </div>
    )
}