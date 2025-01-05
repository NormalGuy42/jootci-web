'use server'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '../../../../lib/actions/product.actions'
import ProductImages from '../../../../components/shared/product/product-images'
import ProductPrice from '../../../../components/shared/product/product-price'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'
import { Card, CardContent } from '../../../../components/ui/card'
import AddToCart from '../../../../components/shared/product/add-to-cart'
import { round2 } from '../../../../lib/utils'
import { getMyCart } from '../../../../lib/actions/cart.actions'
import ReviewList from './review-list'
import { auth } from '../../../../auth'


export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return { title: 'Product not found' }
  }

  return {
    title: `${product.name} - Tibb-Jox`,
    description: product.description,
  }
}

export default  async function ProductDetail ({
  params: { slug },
}: {
  params: { slug: string }
  searchParams: { page: string; color: string; size: string }
}) {
  
  const product = await getProductBySlug(slug)

  if (!product) notFound()
  const cart = await getMyCart()
  const session = await auth()


  return (
    <>
      <section className='p-4'>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages images={product.images!} />
          </div>
          <div className="col-span-2 flex flex-col w-full  gap-8 p-5">
            <div className="flex flex-col gap-6">
              <p className="p-medium-16 rounded-full bg-grey-500/10   text-grey-500">
               {product.category}
              </p>
              <h1 className="title">{product.name}</h1>
              <p>
                {product.rating} of {product.numReviews} reviews
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <ProductPrice
                    value={Number(product.price)}
                    className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700"
                  />
                </div>
              </div>
            </div>
            <div>
              <p>Description:</p>
              <p>{product.description}</p>
            </div>
          </div>
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.stock! > 0 ? (
                    <Badge variant="outline">In stock</Badge>
                  ) : (
                    <Badge variant="destructive">Unavailable</Badge>
                  )}
                </div>
                {product.stock !== 0 && (
                  <div className=" flex-center">
                  <AddToCart
                    cart={cart}
                    item={{
                      productId: product.id,
                      vendorID: product.vendorID,
                      name: product.name,
                      slug: product.slug,
                      price: round2(product.price!),
                      qty: 1,
                      image: product.images![0],
                    }}
                  />
                </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="h2-bold  mb-5">Customer Reviews</h2>
        <ReviewList
          productId={product.id}
          productSlug={product.slug}
          userId={session?.user.id!}
        />
      </section>
    </>
  )
}
