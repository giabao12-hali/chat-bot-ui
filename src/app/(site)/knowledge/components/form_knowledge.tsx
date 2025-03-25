/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SquarePenIcon } from '@/components/ui/square-pen'
import { LinkIcon } from '@/components/ui/link'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CategoryBaseModel } from '@/types/models/category.model'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ResourceModel } from '@/types/models/resource.model'
import { getResources } from '@/api/resource/resource.service'
import { getCategories } from '@/api/category/category.service'
import toast from 'react-hot-toast'
import { CreateKnowledgeDtoModel, CreateKnowledgeUrlDtoModel } from '../../../../types/models/knowledge.model';
import { insertByText, postByUrl } from '@/api/knowledge/knowledge.service'
import { getRememberMe } from '@/utils/cookie'
import { AutosizeTextarea } from '@/components/ui/autosize-textarea'

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Thông tin bắt buộc'
    }),
    content: z.string().min(2, {
        message: 'Nội dung bắt buộc'
    }),
    resource_id: z.string({
        required_error: "Thông tin bắt buộc"
    }),
    category_id: z.string({
        required_error: "Thông tin bắt buộc"
    }),
})

const urlSchema = z.object({
    url: z.string().url({
        message: 'Đường dẫn không hợp lệ'
    }),
    resource_id: z.string({
        required_error: "Thông tin bắt buộc"
    }),
    category: z.string({
        required_error: "Thông tin bắt buộc"
    }),
})

export default function FormKnowledge() {
    const [categories, setCategories] = useState<CategoryBaseModel[]>([])
    const [resources, setResources] = useState<ResourceModel[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            content: '',
            resource_id: '',
            category_id: '',
        }
    })

    const formUrl = useForm<z.infer<typeof urlSchema>>({
        resolver: zodResolver(urlSchema),
        defaultValues: {
            url: '',
            resource_id: '',
            category: '',
        }
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resourceRes, categoryRes] = await Promise.all([
                    getResources(),
                    getCategories(),
                ]);

                setResources(resourceRes);
                setCategories(categoryRes);
            } catch (error: any) {
                throw new Error(error.message);
            }
        };

        fetchData();
    }, []);


    function onSubmit(data: z.infer<typeof formSchema>) {
        const user = getRememberMe();
        const userId = user ? user.id : 1;
        const requestData: CreateKnowledgeDtoModel = {
            title: data.title,
            content: data.content,
            resource_id: parseInt(data.resource_id),
            category_id: parseInt(data.category_id),
            created_by: userId,
        }

        toast.promise(
            insertByText(requestData),
            {
                loading: "Đang thêm kiến thức...",
                success: "Thêm kiến thức thành công!",
                error: (error: any) => error.message || "Thêm mới thất bại, vui lòng thử lại sau",
            }
        );
    }

    function onSubmitUrl(data: z.infer<typeof urlSchema>) {
        const user = getRememberMe();
        const userId = user ? user.id : 1;
        const requestData: CreateKnowledgeUrlDtoModel = {
            url: data.url,
            resource_id: parseInt(data.resource_id),
            category: parseInt(data.category),
            created_by: userId,
        }

        toast.promise(
            postByUrl(requestData),
            {
                loading: "Đang thêm kiến thức",
                success: "Thêm kiến thức thành công!",
                error: (error: any) => error.message || "Thêm mới thất bại, vui lòng thử lại sau",
            }
        )
    }

    return (
        <>
            <Tabs defaultValue="hands" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2 h-full">
                    <TabsTrigger value="hands" className='h-full cursor-pointer'>
                        <SquarePenIcon className='hover:bg-transparent' />
                        Thủ công
                    </TabsTrigger>
                    <TabsTrigger value="url" className='h-full cursor-pointer'>
                        <LinkIcon className='hover:bg-transparent' />
                        Đường dẫn
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="hands">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thêm thủ công</CardTitle>
                            <CardDescription>
                                Hãy điền những thông tin sau để thêm mới:
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                                    <FormField
                                        control={form.control}
                                        name='title'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Tiêu đề <span className='text-destructive-foreground'>(*)</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='Nhập tiêu đề'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='content'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Nội dung <span className='text-destructive-foreground'>(*)</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <AutosizeTextarea
                                                        maxHeight={200}
                                                        placeholder='Nhập nội dung'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='resource_id'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Nguồn thông tin <span className='text-destructive-foreground'>(*)</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Chọn nguồn thông tin" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {resources.map((resource, index) => (
                                                                    <SelectItem key={index} value={resource.id.toString()}>
                                                                        {resource.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
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
                                                    <Select onValueChange={field.onChange}>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder="Chọn danh mục" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {categories.map((category, index) => (
                                                                    <SelectItem key={index} value={category.id.toString()}>
                                                                        {category.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='submit' className='w-full'>Thêm mới</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="url">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thêm bằng đường dẫn</CardTitle>
                            <CardDescription>
                                Hãy điền những thông tin sau để thêm mới:
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Form {...formUrl}>
                                <form onSubmit={formUrl.handleSubmit(onSubmitUrl)} className='space-y-4'>
                                    <FormField
                                        control={formUrl.control}
                                        name='url'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Đường dẫn liên kết <span className='text-destructive-foreground'>(*)</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='Nhập đường dẫn liên kết'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formUrl.control}
                                        name='resource_id'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Nguồn thông tin <span className='text-destructive-foreground'>(*)</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Chọn nguồn thông tin" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {resources.map((resource, index) => (
                                                                    <SelectItem key={index} value={resource.id.toString()}>
                                                                        {resource.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formUrl.control}
                                        name='category'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Danh mục <span className='text-destructive-foreground'>(*)</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select onValueChange={field.onChange}>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder="Chọn danh mục" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {categories.map((category, index) => (
                                                                    <SelectItem key={index} value={category.id.toString()}>
                                                                        {category.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='submit' className='w-full'>Thêm mới</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    )
}

