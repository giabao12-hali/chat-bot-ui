/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { updateCategory } from '@/api/category/category.service'
import { AutosizeTextarea } from '@/components/ui/autosize-textarea'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CategoryBaseModel } from '@/types/models/category.model'
import { getRememberMe } from '@/utils/cookie'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

const formSchema = z.object({
    category_id: z.string({
        required_error: 'Thông tin bắt buộc'
    }),
    name: z.string().min(2, {
        message: 'Thông tin bắt buộc'
    }),
    description: z.string().optional(),
})

interface FormEditCategoryProps {
    category: CategoryBaseModel[]
    selectedCategory: CategoryBaseModel | null
    onClose: () => void;
}

export default function FormEditCategory({ category, selectedCategory, onClose }: FormEditCategoryProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category_id: selectedCategory ? selectedCategory.id.toString() : '',
            name: selectedCategory ? selectedCategory.name : '',
            description: selectedCategory ? selectedCategory.description : '',
        }
    })

    useEffect(() => {
        if (selectedCategory) {
            form.reset({
                category_id: selectedCategory.id.toString(),
                name: selectedCategory.name,
                description: selectedCategory.description || "",
            });
        }
    }, [selectedCategory, form]);


    function onSubmit(data: z.infer<typeof formSchema>) {
        const user = getRememberMe();
        const userId = user ? user.id : 1;
        const requestData = {
            name: data.name,
            description: data.description,
            category_id: selectedCategory?.id || 0,
            user_id: userId
        }

        toast.promise(
            updateCategory(requestData)
                .then(() => {
                    onClose();
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }),
            {
                loading: 'Đang cập nhật danh mục...',
                success: 'Cập nhật danh mục thành công!',
                error: (error: any) => error.message || 'Cập nhật thất bại, vui lòng thử lại!'
            }
        );
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Tên danh mục <span className='text-destructive-foreground'>(*)</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder='Tên danh mục'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Mô tả danh mục
                                </FormLabel>
                                <FormControl>
                                    <AutosizeTextarea
                                        {...field}
                                        placeholder='Mô tả danh mục'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='category_id'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Danh mục <span className='text-destructive-foreground'>(*)</span>
                                </FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} disabled>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder={selectedCategory?.name || "Chọn danh mục"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {category.map((item, index) => (
                                                    <SelectItem key={index} value={item.id.toString()}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className='w-full' variant={"outline"}>Cập nhật</Button>
                </form>
            </Form>
        </div>
    )
}
