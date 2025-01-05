'use client'

import slugify from 'slugify'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { categoryDefaultValues } from '../../../lib/constants'
import { insertCategorySchema, updateCategorySchema } from '../../../lib/validator'
import { Category } from '../../../types/customTypes'
import { useToast } from '../../ui/use-toast'
import { UploadButton } from '../../../lib/uploadthing'
import { Button } from '../../ui/button'
import { Card, CardContent } from '../../ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../ui/form'
import { Textarea } from '../../ui/textarea'
import { Input } from '../../ui/input'
import { createCategory, updateCategory } from '../../../lib/actions/category.action'
import { useEffect } from 'react'

// export default function CategoryForm({
//   type,
//   category,
//   categoryId,
// }: {
//   type: 'Create' | 'Update'
//   category?: Category
//   categoryId?: string
// }) {
//   const router = useRouter()
//   const form = useForm<z.infer<typeof insertCategorySchema>>({
//     resolver:
//       type === 'Update'
//         ? zodResolver(updateCategorySchema)
//         : zodResolver(insertCategorySchema),
//     defaultValues:
//       category && type === 'Update' ? category : categoryDefaultValues,
//   })
//   const { toast } = useToast()
//   async function onSubmit(values: z.infer<typeof insertCategorySchema>) {
//     if (type === 'Create') {
//       const res = await createCategory(values)
//       if (!res.success) {
//         toast({
//           variant: 'destructive',
//           description: res.message,
//         })
//       } else {
//         toast({
//           description: res.message,
//         })
//         router.push(`/admin/categories`)
//       }
//     }
//     if (type === 'Update') {
//       if (!categoryId) {
//         router.push(`/admin/categories`)
//         return
//       }
//       const res = await updateCategory({ ...values, id: categoryId })
//       if (!res.success) {
//         toast({
//           variant: 'destructive',
//           description: res.message,
//         })
//       } else {
//         router.push(`/admin/categories`)
//       }
//     }
//   }
//   const image = form.watch('image')
 
//   console.log(form.formState.errors)
  
//   return (
//     <Form {...form}>
//       <form
//         method="post"
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="space-y-8"
//       >
//         <div className="flex flex-col gap-5 md:flex-row">
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }: { field: any }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter category name" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="slug"
//             render={({ field }: { field: any }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Slug</FormLabel>
//                 <FormControl>
//                   <div className="relative">
//                     <Input
//                       placeholder="Enter category url"
//                       className="pl-8"
//                       {...field}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => {
//                         form.setValue(
//                           'slug',
//                           slugify(form.getValues('name'), { lower: true })
//                         )
//                       }}
//                     >
//                       Generate
//                     </button>
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
          
//         <div className="flex flex-col gap-5 md:flex-row">
//           <FormField
//             control={form.control}
//             name="image"
//             render={() => (
//               <FormItem className="w-full">
//                 <FormLabel>Images</FormLabel>
//                 <Card>
//                   <CardContent className="space-y-2 mt-2 min-h-48">
//                     <div className="flex-start space-x-2">
//                         {image && 
//                         <img
//                           key={image}
//                           src={image}
//                           alt="category image"
//                           className="w-20 h-20 object-cover object-center rounded-sm"
//                           width={100}
//                           height={100}
//                         />}
//                       <FormControl>
//                         <UploadButton
//                           endpoint="imageUploader"
//                           onClientUploadComplete={(res) => {
//                             form.setValue('image', res[0].url)
//                           }}
//                           onUploadError={(error: Error) => {
//                             toast({
//                               variant: 'destructive',
//                               description: `ERROR! ${error.message}`,
//                             })
//                           }}
//                         />
//                       </FormControl>
//                     </div>
//                   </CardContent>
//                 </Card>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div>
//           <FormField
//             control={form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem className="w-full">
//                 <FormLabel>Description</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     placeholder="Enter category description"
//                     className="resize-none"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <div>
//           <Button
//             type="submit"
//             size="lg"
//             disabled={form.formState.isSubmitting}
//             className="button col-span-2 w-full"
//           >
//             {form.formState.isSubmitting ? 'Submitting...' : `${type} Category `}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }



export default function CategoryForm({
  type,
  category,
  categoryId,
}: {
  type: 'Create' | 'Update'
  category?: Category
  categoryId?: string
}) {
  const router = useRouter()
  const form = useForm<z.infer<typeof insertCategorySchema>>({
    resolver:
      type === 'Update'
        ? zodResolver(updateCategorySchema)
        : zodResolver(insertCategorySchema),
    defaultValues:
      category && type === 'Update' ? category : categoryDefaultValues,
  })
  const { toast } = useToast()

  // Watch the name field
  const name = form.watch('name')

  // Update slug whenever name changes
  useEffect(() => {
    const slug = slugify(name || '', { lower: true, strict: true })
    form.setValue('slug', slug)
  }, [name, form])

  async function onSubmit(values: z.infer<typeof insertCategorySchema>) {
    if (type === 'Create') {
      const res = await createCategory({
        ...values,
        slug: slugify(values.name, { lower: true, strict: true })
      })
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        toast({
          description: res.message,
        })
        router.push(`/admin/categories`)
      }
    }
    if (type === 'Update') {
      if (!categoryId) {
        router.push(`/admin/categories`)
        return
      }
      const res = await updateCategory({
        ...values,
        id: categoryId,
        slug: slugify(values.name, { lower: true, strict: true })
      })
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        router.push(`/admin/categories`)
      }
    }
  }
  const image = form.watch('image')
  
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
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter category name" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled
                    placeholder="Generated from name"
                    className="bg-gray-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                        {image && 
                        <img
                          key={image}
                          src={image}
                          alt="category image"
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={100}
                          height={100}
                        />}
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            form.setValue('image', res[0].url)
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter category description"
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
            {form.formState.isSubmitting ? 'Submitting...' : `${type} Category `}
          </Button>
        </div>

      </form>
    </Form>
  )
}