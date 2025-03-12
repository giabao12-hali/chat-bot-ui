/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { deleteByCategoryId, getCategories } from '@/api/category/category.service'
import { useMediaQuery } from '@/hooks/use-media-query'
import { CategoryBaseModel } from '@/types/models/category.model'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import FormCategory from './components/form_category'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DeleteIcon } from '@/components/ui/delete'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SquarePenIcon } from '@/components/ui/square-pen'
import FormEditCategory from './components/form_edit_category'

export default function CategoryPage() {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')

    const [categories, setCategories] = useState<CategoryBaseModel[]>([])

    const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false)
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        const getCategory = async () => {
            try {
                const response = await getCategories();
                setCategories(response)
            } catch (error: any) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        getCategory();
    }, [])

    const handleDeleteCategory = async () => {
        if (selectedId === null) return;

        toast.promise(
            deleteByCategoryId(selectedId)
                .then(() => {
                    setCategories((prev) => prev.filter((item) => item.id !== selectedId));
                    setOpenAlertDialog(false);
                }),
            {
                loading: "Đang xóa danh mục...",
                success: "Xóa danh mục thành công",
                error: (error: any) => error.message || "Xóa thất bại, vui lòng thử lại sau"
            }
        )
    }

    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4">
                {loading ? (
                    <div className='flex justify-center items-center md:mt-56'>
                        <div className="flex items-center space-x-2">
                            <div className="size-4 animate-bounce rounded-full bg-foreground [animation-delay:-0.3s]"></div>
                            <div className="size-4 animate-bounce rounded-full bg-foreground [animation-delay:-0.13s]"></div>
                            <div className="size-4 animate-bounce rounded-full bg-foreground"></div>
                        </div>
                    </div>
                ) : error ? (
                    <div className='flex justify-center items-center'>
                        <p>
                            Đã có lỗi xảy ra, vui lòng thử lại sau
                        </p>
                    </div>
                ) : (
                    <>
                        <div>
                            {isDesktop ? (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size={"sm"} className=''>
                                            <Plus />
                                            Thêm mới
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Thêm mới danh mục
                                            </DialogTitle>
                                            <DialogDescription>
                                                Thêm mới danh mục bằng cách điền các thông tin dưới đây:
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex justify-center">
                                            <FormCategory />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            ) : (
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button size={"sm"} className=''>
                                            <Plus />
                                            Thêm mới
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader>
                                            <DrawerTitle>
                                                Thêm mới danh mục
                                            </DrawerTitle>
                                            <DrawerDescription>
                                                Hãy thêm mới danh mục thông qua thêm bằng thủ công hoặc nhập từ đường dẫn
                                            </DrawerDescription>
                                        </DrawerHeader>
                                        <div className="flex justify-center">
                                            <FormCategory />
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            )}
                        </div>
                        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                            {categories.map((item) => (
                                <div key={item.id}>
                                    <div className="rounded-xl border border-solid border-foreground/50 p-4">
                                        <div className="space-y-0.5">

                                            {item.name}
                                        </div>
                                        <div className="flex justify-end items-center space-x-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            size={"icon"}
                                                            onClick={() => {
                                                                setOpenEditDialog(true);
                                                            }}
                                                        >
                                                            <SquarePenIcon />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Chỉnh sửa</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant={'destructive'}
                                                            size={"icon"}
                                                            onClick={() => {
                                                                setSelectedId(item.id);
                                                                setOpenAlertDialog(true);
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Xóa</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Chỉnh sửa danh mục
                        </DialogTitle>
                        <DialogDescription>
                            Chỉnh sửa thông tin danh mục bằng cách điền các thông tin dưới đây:
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <FormEditCategory category={categories}/>
                    </div>
                </DialogContent>
            </Dialog>
            <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc không?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc muốn xóa danh mục này không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteCategory}>Xóa</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
