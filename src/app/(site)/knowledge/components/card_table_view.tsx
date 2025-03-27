'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem
} from "@/components/ui/select";
import {
    IdCard,
    TableProperties,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from 'next/link';
import { KnowledgeBaseModel } from '@/types/models/knowledge.model';
import { CategoryBaseModel } from '@/types/models/category.model';
import { CheckIcon } from '@/components/ui/check';
import { DeleteIcon } from '@/components/ui/delete';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface KnowledgeViewSwitcherProps {
    paginatedData: KnowledgeBaseModel[];
    categories: CategoryBaseModel[];
    handleKnowledgeDetail: (id: number) => void;
    handleActiveKnowledge: (id: number) => void;
    setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
    setOpenAlertDialog: React.Dispatch<React.SetStateAction<boolean>>;
    loading?: boolean;
    error?: string;
}

const KnowledgeViewSwitcher: React.FC<KnowledgeViewSwitcherProps> = ({
    paginatedData,
    categories,
    handleKnowledgeDetail,
    handleActiveKnowledge,
    setSelectedId,
    setOpenAlertDialog
}) => {
    const [viewMode, setViewMode] = useState('card');

    const viewVariants = {
        card: {
            initial: { opacity: 0, scale: 0.95 },
            animate: {
                opacity: 1,
                scale: 1,
                transition: {
                    type: "tween",
                    duration: 0.3
                }
            },
            exit: {
                opacity: 0,
                scale: 0.95,
                transition: {
                    type: "tween",
                    duration: 0.2
                }
            }
        },
        table: {
            initial: { opacity: 0, y: 20 },
            animate: {
                opacity: 1,
                y: 0,
                transition: {
                    type: "tween",
                    duration: 0.3
                }
            },
            exit: {
                opacity: 0,
                y: 20,
                transition: {
                    type: "tween",
                    duration: 0.2
                }
            }
        }
    };

    const CardView = () => (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={viewVariants.card}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {paginatedData.map((item, index) => (
                <div key={index} className='cursor-pointer'>
                    <div className="rounded-xl border border-solid border-foreground/50 p-4 space-y-2 transition-all ease-in-out hover:shadow-xl hover:border-foreground hover:-translate-y-1.5">
                        <div className='space-y-0.5'>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className='cursor-pointer'>
                                        <h1
                                            className='font-semibold text-foreground text-left'
                                            onClick={() => handleKnowledgeDetail(item.id)}
                                        >
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
                                {categories.find((category) => category.id === item.category_id)?.name || "Không xác định"}
                            </p>
                            <p className='text-muted-foreground text-xs'>
                                Trạng thái:&nbsp;
                                <span className={`${item.is_active ? 'text-green-500' : 'text-red-500'}`}>
                                    {item.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
                                </span>
                            </p>
                        </div>
                        <div className="flex justify-end items-center space-x-2">
                            {!item.is_active && (
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
        </motion.div>
    );

    const TableView = () => (
        <motion.div
            variants={viewVariants.table}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className="grid grid-cols-1">
                <Table className='relative'>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tiêu đề</TableHead>
                            <TableHead>Đường dẫn</TableHead>
                            <TableHead>Danh mục</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className='text-right'>Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <span className='text-foreground hover:underline cursor-pointer'
                                        onClick={() => handleKnowledgeDetail(item.id)}
                                    >
                                        {item.title}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {item.url ? (
                                        <Link href={item.url} target='_blank' className='text-blue-500 hover:underline'>
                                            {item.url}
                                        </Link>
                                    ) : (
                                        <span className="text-muted-foreground">Không có đường dẫn</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {categories.find((category) => category.id === item.category_id)?.name || "Không xác định"}
                                </TableCell>
                                <TableCell>
                                    <span className={`${item.is_active ? 'text-green-500' : 'text-red-500'}`}>
                                        {item.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
                                    </span>
                                </TableCell>
                                <TableCell className='flex justify-end space-x-2'>
                                    {!item.is_active && (
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
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-4">
            <div className="mb-4 space-y-1">
                <Select value={viewMode} onValueChange={setViewMode}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Hiển thị" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="card">
                                <div className="flex items-center">
                                    <IdCard className='mr-2 size-4' />
                                    <p>Thẻ</p>
                                </div>
                            </SelectItem>
                            <SelectItem value="grid">
                                <div className='flex items-center'>
                                    <TableProperties className='mr-2 size-4' />
                                    <p>Bảng</p>
                                </div>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'card' ? <CardView key="card" /> : <TableView key="table" />}
            </AnimatePresence>
        </div>
    );
};

export default KnowledgeViewSwitcher;