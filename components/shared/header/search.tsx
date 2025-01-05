import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"
import { SearchIcon } from "lucide-react"
import { getAllProductCategories } from "../../../lib/actions/product.actions"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"



export default async function Search() {
    const categories = await getAllProductCategories()
    return (
      <form action="/search" method="GET">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Select name="category">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={'All'} value={'all'}>
                All
              </SelectItem>
              {categories.map((category: { name: string }) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            name="q"
            type="text"
            placeholder="Search..."
            className="md:w-[100px] lg:w-[300px]"
          />
          <Button>
            <SearchIcon />
          </Button>
        </div>
      </form>
    )
  }