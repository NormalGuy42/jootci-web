import Pagination from "../../../components/shared/pagination"
import { Button } from "../../../components/ui/button"
import { getAllProductCategories, getAllProducts } from "../../../lib/actions/product.actions"
import { APP_NAME } from "../../../lib/constants"
import ProductCard from "../../../components/shared/product/product-card"
import Link from "next/link"
import { FilterIcon } from "../../../components/icons/Icons"

const sortOrders = ['newest', 'lowest', 'highest', 'rating']
const prices = [
  {
    name: '1 FCFA to 1000 FCFA',
    value: '1-1000',
  },
  {
    name: '1001 FCFA to 5000 FCFA',
    value: '1001-5000',
  },
  {
    name: '5001 FCFA to 10000 FCFA',
    value: '5001-1-000',
  },
]
const ratings = [4, 3, 2, 1]

export async function generateMetadata({
  searchParams: { q = 'all', category = 'all', price = 'all', rating = 'all' },
}: {
  searchParams: {
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
  }
}) {
  if (
    (q !== 'all' && q !== '') ||
    category !== 'all' ||
    rating !== 'all' ||
    price !== 'all'
  ) {
    return {
      title: `Search ${q !== 'all' ? q : ''}
                 ${category !== 'all' ? ` : Category ${category}` : ''}
                 ${price !== 'all' ? ` : Price ${price}` : ''}
                 ${
                   rating !== 'all' ? ` : Rating ${rating}` : ''
                 } - ${APP_NAME}`,
    }
  } else {
    return {
      title: `Search Products - ${APP_NAME}`,
    }
  }
}
export default async function SearchPage({
  searchParams: {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  },
}: {
  searchParams: {
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
  }
}) {
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string
    s?: string
    p?: string
    r?: string
    pg?: string
  }) => {
    const params = { q, category, price, rating, sort, page }
    if (c) params.category = c
    if (p) params.price = p
    if (r) params.rating = r
    if (pg) params.page = pg
    if (s) params.sort = s
    return `/search?${new URLSearchParams(params).toString()}`
  }
  const categories = await getAllProductCategories()
  const products = await getAllProducts({
    category,
    query: q,
    price,
    rating,
    page: Number(page),
    sort,
  })
  return (
    <div className="grid justify-center md:gap-5 mb-12">
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {/* {data.length === 0 ? 'No' : countProducts} Results */}
            {q !== 'all' && q !== '' && 'Query : ' + q}
            {category !== 'all' &&
              category !== '' &&
              '   Category : ' + category}
            {price !== 'all' && '    Price: ' + price}
            {rating !== 'all' && '    Rating: ' + rating + ' & up'}
            &nbsp;
            {(q !== 'all' && q !== '') ||
            (category !== 'all' && category !== '') ||
            rating !== 'all' ||
            price !== 'all' ? (
              <Button variant={'link'} asChild>
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>
          <div className="flex justify-between">
            <div>
                Sort by{' '}
                {sortOrders.map((s) => (
                  <Link
                    key={s}
                    className={`mx-2   ${sort == s && ' text-green-500'} `}
                    href={getFilterUrl({ s })}
                  >
                    {s}
                  </Link>
                ))}
              </div>
              <div className="group relative">
                <div className="filterBtn icon-btn cursor-pointer rounded-xl">
                  <FilterIcon/>
                </div>
              <div className="sort-options hidden group-hover:block">
              <div className="text-xl pt-3">Categories</div>
              <div>
                <ul>
                  <li>
                    <Link
                      className={`${
                        ('all' === category || '' === category) && 'text-green-500'
                      }`}
                      href={getFilterUrl({ c: 'all' })}
                    >
                      Any
                    </Link>
                  </li>
                  {categories.map((c: { name: string }) => (
                    <li key={c.name}>
                      <Link
                        className={`${c.name === category && 'text-green-500'}`}
                        href={getFilterUrl({ c: c.name })}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xl pt-3">Price</div>
                <ul>
                  <li>
                    <Link
                      className={`  ${'all' === price && 'text-green-500'}`}
                      href={getFilterUrl({ p: 'all' })}
                    >
                      Any
                    </Link>
                  </li>
                  {prices.map((p) => (
                    <li key={p.value}>
                      <Link
                        href={getFilterUrl({ p: p.value })}
                        className={`  ${p.value === price && 'text-green-500'}`}
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xl pt-3">Customer Review</div>
                <ul>
                  <li>
                    <Link
                      href={getFilterUrl({ r: 'all' })}
                      className={`  ${'all' === rating && 'text-green-500'}`}
                    >
                      Any
                    </Link>
                  </li>
                  {ratings.map((r) => (
                    <li key={r}>
                      <Link
                        href={getFilterUrl({ r: `${r}` })}
                        className={`${r.toString() === rating && 'text-green-500'}`}
                      >
                        {`${r} stars & up`}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            </div>
          </div>
          </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3  ">
          {products!.data.length === 0 && <div>No product found</div>}
          {products!.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products!.totalPages! > 1 && (
          <Pagination page={page} totalPages={products!.totalPages} />
        )}
      </div>
    </div>
  )
}