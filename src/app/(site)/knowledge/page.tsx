/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { activeKnowledge, deleteKnowledgeReourceId, getKnowledgeResource, getKnowledgeResourceAll } from '@/api/knowledge/knowledge.service'
import { Button } from '@/components/ui/button'
import { DeleteIcon } from '@/components/ui/delete'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { KnowledgeBaseModel } from '@/types/models/knowledge.model'
import React, { useEffect, useState } from 'react'
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
import toast from 'react-hot-toast'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import Link from 'next/link'
import { categoryEnums } from '@/types/enums/category.enums'
import { Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import FormKnowledge from './components/form_knowledge'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { CheckIcon } from '@/components/ui/check'
import { Separator } from '@/components/ui/separator'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SearchIcon } from '@/components/ui/search'
import { Checkbox } from '@/components/ui/checkbox'
import { CategoryBaseModel } from '@/types/models/category.model'
import { ResourceModel } from '@/types/models/resource.model'
import { getCategories } from '@/api/category/category.service'
import { getResources } from '@/api/resource/resource.service'
import { useRouter } from 'next/navigation'




export default function KnowledgePage() {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')

    const [knowledge, setKnowledge] = useState<KnowledgeBaseModel[]>([])
    const [categories, setCategories] = useState<CategoryBaseModel[]>([])
    const [resources, setResources] = useState<ResourceModel[]>([]);

    const [searchParams, setSearchParams] = useState({
        resource_id: "",
        categories_id: "",
        is_active: false
    })

    const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false)
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const router = useRouter();

    useEffect(() => {
        const getDatas = async () => {
            try {
                setLoading(true)
                const [knowledgeRes, categoryRes, resourceRes] = await Promise.all([
                    getKnowledgeResourceAll(),
                    getCategories(),
                    getResources(),
                ]);

                setKnowledge(knowledgeRes);
                setCategories(categoryRes);
                setResources(resourceRes);
            } catch (error: any) {
                setError(error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau')
            } finally {
                setLoading(false)
            }
        }
        getDatas()
    }, [])

    const handleDeleteKnowledge = async () => {
        if (selectedId === null) return;

        toast.promise(
            deleteKnowledgeReourceId(selectedId)
                .then(() => {
                    setKnowledge((prev) => prev.filter((item) => item.id !== selectedId));
                    setOpenAlertDialog(false);
                }),
            {
                loading: "Đang xóa dữ liệu...",
                success: "Xóa thành công!",
                error: (error: any) => error.message || "Xóa thất bại! Vui lòng thử lại sau",
            }
        );
    };

    const handleActiveKnowledge = async (id: number) => {
        toast.promise(
            activeKnowledge(id)
                .then(() => {
                    setKnowledge((prev) =>
                        prev.map((item) =>
                            item.id === id ? { ...item, is_active: 1 } : item
                        )
                    );
                }),
            {
                loading: "Đang kích hoạt...",
                success: "Kích hoạt thành công!",
                error: "Kích hoạt thất bại, vui lòng thử lại!",
            }
        );
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            // ✅ Chỉ gửi params nếu có giá trị hợp lệ
            const response = await getKnowledgeResource(
                searchParams.resource_id ? parseInt(searchParams.resource_id) : undefined,
                searchParams.categories_id ? parseInt(searchParams.categories_id) : undefined,
                searchParams.is_active ? true : undefined
            );

            console.log("🔍 Kết quả API:", response);
            setKnowledge(response.length > 0 ? response : []);
        } catch (error: any) {
            console.error("❌ Lỗi khi gọi API:", error);
            setError(error.message || "Lỗi khi tìm kiếm!");
        } finally {
            setLoading(false);
        }
    };

    const handleKnowledgeDetail = async (id: number) => {
        router.push(`/knowledge/${id}`)
    }



    //#region Phân trang
    // ✅ Tính toán số trang
    const totalPages = Math.ceil(knowledge.length / itemsPerPage);

    // ✅ Lấy dữ liệu của trang hiện tại
    const paginatedData = knowledge.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    //#endregion

    return (
        <>
            <div className="flex flex-col gap-4 p-4">
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
                        <section className='flex items-center justify-between'>
                            <h1 className='text-xl font-semibold'>Danh sách kiến thức</h1>
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
                                                Thêm mới kiến thức
                                            </DialogTitle>
                                            <DialogDescription>
                                                Hãy thêm mới kiến thức thông qua thêm bằng thủ công hoặc nhập từ đường dẫn
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex justify-center">
                                            <FormKnowledge />
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
                                                Thêm mới kiến thức
                                            </DrawerTitle>
                                            <DrawerDescription>
                                                Hãy thêm mới kiến thức thông qua thêm bằng thủ công hoặc nhập từ đường dẫn
                                            </DrawerDescription>
                                        </DrawerHeader>
                                        <div className="flex justify-center">
                                            <FormKnowledge />
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            )}
                        </section>
                        <Separator />
                        <section className='space-y-6'>
                            <div className='flex items-center justify-center gap-4 flex-col md:flex-row'>
                                <Select
                                    onValueChange={(value) =>
                                        setSearchParams((prev: any) => ({
                                            ...prev,
                                            categories_id: value
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-52">
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value='0'>--Tất cả--</SelectItem>
                                            {categories.map((category, index) => (
                                                <SelectItem key={index} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Select onValueChange={(value) => setSearchParams((prev: any) => ({ ...prev, resource_id: value }))}>
                                    <SelectTrigger className="w-52">
                                        <SelectValue placeholder="Chọn nguồn kiến thức" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value='0'>
                                                --Tất cả--
                                            </SelectItem>
                                            {resources.map((resource, index) => (
                                                <SelectItem key={index} value={resource.id.toString()}>
                                                    {resource.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="active"
                                        checked={searchParams.is_active}
                                        onCheckedChange={(checked) => setSearchParams((prev: any) => ({ ...prev, is_active: checked === true }))}
                                    />
                                    <label
                                        htmlFor="active"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Kích hoạt
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-center items-center">
                                <Button size={'sm'} variant={'outline'} className='cursor-pointer' onClick={handleSearch}>
                                    <SearchIcon className='hover:bg-transparent' />
                                    Tìm kiếm
                                </Button>
                            </div>
                        </section>
                        <div className="grid auto-rows-min gap-4 md:grid-cols-3 grid-cols-1">
                            {paginatedData.map((item, index) => (
                                <div className='cursor-pointer' key={index}>
                                    <div
                                        className="rounded-xl border border-solid border-foreground/50 p-4 space-y-2 transition-all ease-in-out hover:shadow-xl hover:border-foreground hover:-translate-1.5"
                                    >
                                        <div className='space-y-0.5'>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger className='cursor-pointer'>
                                                        <h1 className='font-semibold text-foreground' onClick={() => handleKnowledgeDetail(item.id)}>
                                                            {item.title}
                                                        </h1>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Xem chi tiết</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <h2 className='text-muted-foreground text-xs truncate'>
                                                Đường dẫn: {' '}
                                                {item.url ? (
                                                    <Link href={item.url} target='_blank' className='hover:text-blue-500 transition-all ease-in-out'>
                                                        {item.url}
                                                    </Link>
                                                ) : (
                                                    <span className="text-muted-foreground">Không có đường dẫn</span>
                                                )}
                                            </h2>
                                            <p className='text-muted-foreground text-xs'>
                                                Kiến thức thuộc danh mục:&nbsp;
                                                {
                                                    categoryEnums.find((category) => category.id === item.category_id)?.name || "Không xác định"
                                                }
                                            </p>
                                            <p className='text-muted-foreground text-xs'>
                                                Trạng thái:&nbsp;
                                                <span className={`${item.is_active ? 'text-green-500' : 'text-red-500'}`}>
                                                    {item.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="flex justify-end items-center space-x-2">
                                            {item.is_active === 0 && (
                                                <Tooltip>
                                                    <TooltipProvider>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size={'icon'}
                                                                variant={'outline'}
                                                                onClick={() => handleActiveKnowledge(item.id)}
                                                            >
                                                                <CheckIcon />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Kích hoạt kiến thức</p>
                                                        </TooltipContent>
                                                    </TooltipProvider>
                                                </Tooltip>
                                            )}
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
                        <Pagination className="mt-6">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentPage((prev) => Math.max(prev - 1, 1));
                                        }}
                                        style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto', opacity: currentPage === 1 ? 0.5 : 1 }}
                                    />
                                </PaginationItem>

                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentPage(1);
                                        }}
                                        isActive={currentPage === 1}
                                    >
                                        1
                                    </PaginationLink>
                                </PaginationItem>

                                {currentPage > 3 && (
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )}

                                {Array.from({ length: totalPages }, (_, index) => index + 1)
                                    .filter(
                                        (page) =>
                                            page !== 1 &&
                                            page !== totalPages &&
                                            page >= currentPage - 1 &&
                                            page <= currentPage + 1
                                    )
                                    .map((page) => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentPage(page);
                                                }}
                                                isActive={currentPage === page}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                {currentPage < totalPages - 2 && (
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )}

                                {totalPages > 1 && (
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(totalPages);
                                            }}
                                            isActive={currentPage === totalPages}
                                        >
                                            {totalPages}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                                        }}
                                        style={{ pointerEvents: currentPage === totalPages ? 'none' : 'auto', opacity: currentPage === totalPages ? 0.5 : 1 }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>

                    </>
                )}
            </div>
            <AlertDialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc không?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc muốn xóa kiến thức này không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteKnowledge}>Xóa</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
