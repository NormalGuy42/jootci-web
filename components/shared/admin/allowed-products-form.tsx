'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createAllowedProduct, updateAllowedProduct } from '../../../lib/actions/product.actions'
import { allowedProductDefaultValues } from '../../../lib/constants'
import { insertAllowedProductSchema, updateAllowedProductSchema } from '../../../lib/validator'
import { AllowedProduct,  } from '../../../types/customTypes'
import { useToast } from '../../ui/use-toast'
import { UploadButton } from '../../../lib/uploadthing'
import { Button } from '../../ui/button'
import { Card, CardContent } from '../../ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../ui/form'
import { Input } from '../../ui/input'

export default function AllowedProductForm({
  type,
  allowedProduct,
  productId,
}: {
  type: 'Create' | 'Update'
  allowedProduct?: AllowedProduct
  productId?: string
}) {
  const router = useRouter()
  const form = useForm<z.infer<typeof insertAllowedProductSchema>>({
    resolver:
      type === 'Update'
        ? zodResolver(updateAllowedProductSchema)
        : zodResolver(insertAllowedProductSchema),
    defaultValues:
    allowedProduct && type === 'Update' ? allowedProduct : allowedProductDefaultValues,
  })
  const { toast } = useToast()
  async function onSubmit(values: z.infer<typeof insertAllowedProductSchema>) {
    if (type === 'Create') {
      console.log(values)
      const res = await createAllowedProduct(values)
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
        
      } else {
        toast({
          description: res.message,
        })
        router.push(`/admin/products`)
      }
    }
    if (type === 'Update') {
      if (!productId) {
        router.push(`/admin/products`)
        return
      }
      const res = await updateAllowedProduct({ ...values, id: productId })
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        router.push(`/admin/products`)
      }
    }
  }
  const images = form.watch('images')
 
  console.log(form.formState.errors)
  
  return (
    <Form {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="stockType"
            render={({ field }: { field: any }) => (
              <FormItem className="w-full">
                <FormLabel>Stock Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Stock Type" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {images!.map((image: string) => (
                        <img
                          key={image}
                          src={image}
                          alt="product image"
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={100}
                          height={100}
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: any) => {
                            form.setValue('images', [...images!, res[0].url])
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: 'destructive',
                              description: `ERROR! ${error.message}`,
                            })
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
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
            {form.formState.isSubmitting ? 'Submitting...' : `${type} Product `}
          </Button>
        </div>
      </form>
    </Form>
  )
}