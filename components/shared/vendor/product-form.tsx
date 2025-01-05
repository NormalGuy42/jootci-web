'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createVendorProduct, updateVendorProduct} from '../../../lib/actions/vendor.actions'
import { productDefaultValues } from '../../../lib/constants'
import { insertProductSchema, updateProductSchema} from '../../../lib/validator'
import { AllowedProduct, ProductFormData } from '../../../types/customTypes'
import { useToast } from '../../ui/use-toast'
import { Button } from '../../ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../ui/form'
import { Textarea } from '../../ui/textarea'
import { Input } from '../../ui/input'
import { auth } from '../../../auth'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { useEffect, useState } from 'react'
import { getAllAllowedProducts } from '../../../lib/actions/product.actions'
import { useSession } from 'next-auth/react'

export default function ProductForm({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update'
  product?: ProductFormData
  productId?: string
}) {
  const [allowedProducts, setAllowedProducts] = useState<AllowedProduct[]>([])
  const router = useRouter()
  
  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver:
      type === 'Update'
        ? zodResolver(updateProductSchema)
        : zodResolver(insertProductSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchAllowedProducts = async () => {
      const result = await getAllAllowedProducts({ page: 1 });
      if (result.data) {
        setAllowedProducts(result.data);
      }
    };
    fetchAllowedProducts();
  }, []);
  
  async function onSubmit(values: z.infer<typeof insertProductSchema>) {
    const vendorId = ''
    
    if (type === 'Create') {
      if (!values.allowedProductId) {
        toast({
          variant: 'destructive',
          description: 'Please select a product',
        })
        return
      }

      const res = await createVendorProduct(
        values.allowedProductId,
        vendorId,
        {
          price: Number(values.price),
          stock: Number(values.stock),
          description: values.description
        }
      )

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        toast({
          description: res.message,
        })
        router.push(`/vendor/products`)
      }
    }
    if (type === 'Update' && productId) {
      const res = await updateVendorProduct(
        productId,
        vendorId,
        {
          price: Number(values.price),
          stock: Number(values.stock),
          description: values.description
        }
      )

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        toast({
          description: res.message,
        })
        router.push(`/vendor/products`)
      }
    }
  }
  
  return (
    <Form {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {type === 'Create' && (
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="allowedProductId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Select Product</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allowedProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex flex-col gap-5 md:flex-row">
        <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="Enter product price"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter product stock"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
            className="button col-span-2 w-full"
          >
            {form.formState.isSubmitting ? 'Submitting...' : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  )
}