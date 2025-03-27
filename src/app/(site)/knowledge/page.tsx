/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { activeKnowledge, deleteKnowledgeReourceId, getKnowledgeResource } from '@/api/knowledge/knowledge.service'
import { Button } from '@/components/ui/button'
import { KnowledgeBaseModel } from '@/types/models/knowledge.model'
import React, { Suspense, useEffect, useMemo, useState } from 'react'
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
import { BadgeMinus, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import FormKnowledge from './components/form_knowledge'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
// import { SearchIcon } from '@/components/ui/search'
import { CategoryBaseModel } from '@/types/models/category.model'
import { ResourceModel } from '@/types/models/resource.model'
import { getCategories } from '@/api/category/category.service'
import { getResources } from '@/api/resource/resource.service'
import { useRouter, useSearchParams } from 'next/navigation'

import noDataAnimation from '@/components/presentation/animations/no-data.animation.json'
import dynamic from 'next/dynamic'
import KnowledgeViewSwitcher from './components/card_table_view'
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });


function KnowledgePageContent() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: noDataAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    const isDesktop = useMediaQuery("(min-width: 768px)")

    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>('')

    const [knowledge, setKnowledge] = useState<KnowledgeBaseModel[]>([])
    const [categories, setCategories] = useState<CategoryBaseModel[]>([])
    const [resources, setResources] = useState<ResourceModel[]>([]);


    const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false)
    const [selectedId, setSelectedId] = useState<number | null>(null);


    const [currentPage, setCurrentPage] = useState(() => {
        if (typeof window !== "undefined") {
            return parseInt(sessionStorage.getItem("knowledgeCurrentPage") || "1", 10);
        }
        return 1;
    });

    const itemsPerPage = 9;

    const router = useRouter();

    const searchParams = useSearchParams();
    const [searchParamsState, setSearchParamsState] = useState<{
        resource_id: string;
        categories_id: string;
        is_active: boolean | null;
    }>({
        resource_id: "",
        categories_id: "",
        is_active: null,
    });


    useEffect(() => {
        setSearchParamsState({
            resource_id: searchParams.get("resource_id") || "",
            categories_id: searchParams.get("categories_id") || "",
            is_active: searchParams.get("is_active") === "true" ? true
                : searchParams.get("is_active") === "false" ? false
                    : null
        });
    }, [searchParams]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            sessionStorage.setItem("knowledgeCurrentPage", currentPage.toString());
            sessionStorage.setItem("knowledgeSearchParams", JSON.stringify(searchParamsState));
        }
    }, [currentPage, searchParamsState]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [knowledgeRes, categoryRes, resourceRes] = await Promise.all([
                    getKnowledgeResource(
                        searchParamsState.resource_id ? parseInt(searchParamsState.resource_id) : undefined,
                        searchParamsState.categories_id ? parseInt(searchParamsState.categories_id) : undefined,
                        searchParamsState.is_active !== null ? searchParamsState.is_active : undefined
                    ),
                    getCategories(),
                    getResources()
                ]);
                setKnowledge(knowledgeRes);
                setCategories(categoryRes);
                setResources(resourceRes);
            } catch (error: any) {
                setError(error.message || "Đã có lỗi xảy ra, vui lòng thử lại sau");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [searchParamsState]);


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

    const handleKnowledgeDetail = (id: number) => {
        router.push(`/knowledge/${id}?${searchParams.toString()}`);
    };


    //#region Phân trang
    const sortedKnowledge = useMemo(() =>
        knowledge.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
        [knowledge]
    );
    // ✅ Tính toán số trang
    const totalPages = Math.ceil(sortedKnowledge.length / itemsPerPage);

    // ✅ Lấy dữ liệu của trang hiện tại
    const paginatedData = useMemo(() =>
        sortedKnowledge.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        ),
        [sortedKnowledge, currentPage, itemsPerPage]
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
                                    value={searchParamsState.categories_id.toString()}
                                    onValueChange={(value) => {
                                        setSearchParamsState((prev) => ({
                                            ...prev,
                                            categories_id: value
                                        }));

                                        const updatedParams = new URLSearchParams(searchParams);
                                        updatedParams.set("categories_id", value);
                                        router.push(`/knowledge?${updatedParams.toString()}`);
                                    }}
                                >
                                    <SelectTrigger className="w-52">
                                        <SelectValue placeholder="Chọn loại kiến thức" />
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
                                <Select
                                    value={searchParamsState.resource_id.toString()}
                                    onValueChange={(value) => {
                                        setSearchParamsState((prev) => ({
                                            ...prev,
                                            resource_id: value
                                        }));

                                        const updatedParams = new URLSearchParams(searchParams);
                                        updatedParams.set("resource_id", value);
                                        router.push(`/knowledge?${updatedParams.toString()}`);
                                    }}
                                >
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
                                <Select
                                    value={searchParamsState.is_active !== null ? searchParamsState.is_active.toString() : "null"} // Không truyền ""
                                    onValueChange={(value) => {
                                        setSearchParamsState((prev) => ({
                                            ...prev,
                                            is_active: value === "true" ? true : value === "false" ? false : null
                                        }));

                                        const updatedParams = new URLSearchParams(searchParams);
                                        if (value === "true" || value === "false") {
                                            updatedParams.set("is_active", value);
                                        } else {
                                            updatedParams.delete("is_active"); // Xóa nếu chọn "--Tất cả--"
                                        }
                                        router.push(`/knowledge?${updatedParams.toString()}`);
                                    }}
                                >
                                    <SelectTrigger className="w-52">
                                        <SelectValue placeholder="Kích hoạt" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="null">--Tất cả--</SelectItem>
                                            <SelectItem value="true">Kích hoạt</SelectItem>
                                            <SelectItem value="false">Chưa kích hoạt</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Button
                                    size={"sm"}
                                    variant={'outline'}
                                    onClick={() => {
                                        setSearchParamsState({
                                            resource_id: "",
                                            categories_id: "",
                                            is_active: null
                                        });

                                        router.push(`/knowledge`);
                                    }}
                                >
                                    <BadgeMinus />
                                    Xóa bộ lọc
                                </Button>

                            </div>
                        </section>
                        <KnowledgeViewSwitcher
                            paginatedData={paginatedData}
                            categories={categories}
                            handleKnowledgeDetail={handleKnowledgeDetail}
                            handleActiveKnowledge={handleActiveKnowledge}
                            setSelectedId={setSelectedId}
                            setOpenAlertDialog={setOpenAlertDialog}
                        />
                        {paginatedData.length === 0 && (
                            <>
                                <Lottie
                                    options={defaultOptions}
                                    width={600}
                                    height={400}
                                />
                                <div className='text-center'>
                                    <h2 className='text-lg font-semibold'>Dữ liệu bạn tìm kiếm hiện tại không tồn tại</h2>
                                    <p className='text-sm text-muted-foreground'>
                                        Thay vào đó bạn hãy đứng dậy uống miếng, nước ăn miếng bánh thì sao?
                                    </p>
                                </div>
                            </>
                        )}
                        {paginatedData.length > 0 && (
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
                        )}
                    </>
                )}
            </div >
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

export default function KnowledgePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <KnowledgePageContent />
        </Suspense>
    );
}