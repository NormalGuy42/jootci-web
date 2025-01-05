import { Product } from '../../../types/customTypes';
import ProductCard from './product-card'

const ProductList = ({ data }: { data: Product[] }) => {
  return (
    <>
      {data.length > 0 ? (
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <p>No product found</p>
        </div>
      )}
    </>
  )
}

export default ProductList