/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { AutosizeTextarea } from '@/components/ui/autosize-textarea';
import { Button } from '@/components/ui/button';
import { getRememberMe } from '@/utils/cookie';
import { CreateCategoryDtoModel } from '@/types/models/category.model';
import toast from 'react-hot-toast';
import { insertCategory } from '@/api/category/category.service';

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Thông tin bắt buộc"
    }),
    description: z.string().min(2, {
        message: "Thông tin bắt buộc"
    })
})

export default function FormCategory() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: ''
        }
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        const user = getRememberMe();
        const userId = user ? user.id : 1;
        const requestData: CreateCategoryDtoModel = {
            name: data.name,
            description: data.description,
            user_id: userId
        }

        toast.promise(
            insertCategory(requestData),
            {
                loading: "Đang thêm mới danh mục",
                success: "Thêm mới danh mục thành công",
                error: (error: any) => error.message || "Thêm mới danh mục thất bại, vui lòng thử lại sau"
            }
        )
    }

    return (
        <div className='w-full'>
            <Card>
                <CardContent className='space-y-2'>
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
                                                placeholder='Nhập tên danh mục'
                                                {...field}
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
                                            Mô tả<span className='text-destructive-foreground'>(*)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <AutosizeTextarea
                                                {...field}
                                                placeholder='Nhập mô tả'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' className='w-full'>Thêm mới</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
