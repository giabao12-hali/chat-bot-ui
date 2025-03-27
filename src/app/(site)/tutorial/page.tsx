'use client'

import React, { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator';
import { Hash } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

interface ShareSectionProps {
    id: string;
    title: string;
    children?: React.ReactNode;
}

const ShareableSection: React.FC<ShareSectionProps> = ({
    id,
    title,
    children
}) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLinkCopied, setIsLinkCopied] = useState(false);

    // Hàm copy link section động
    const copySectionLink = () => {
        // Lấy URL hiện tại và thêm hash của section
        const sectionLink = `${window.location.origin}${window.location.pathname}#${id}`;

        // Copy link vào clipboard
        navigator.clipboard.writeText(sectionLink).then(() => {
            setIsLinkCopied(true);
            toast.success('Đã sao chép đường dẫn');

            // Reset trạng thái sau 3 giây
            setTimeout(() => {
                setIsLinkCopied(false);
            }, 3000);
        }).catch(err => {
            toast.error('Không thể sao chép link');
            console.error('Copy link error:', err);
        });
    };

    // Effect để cuộn tới section khi có hash trong URL
    useEffect(() => {
        const { hash } = window.location;
        if (hash === `#${id}`) {
            const section = document.getElementById(id);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                section.classList.add('highlight-section');

                // Loại bỏ highlight sau 2 giây
                const highlightTimeout = setTimeout(() => {
                    section.classList.remove('highlight-section');
                }, 2000);

                // Cleanup timeout khi component unmount
                return () => clearTimeout(highlightTimeout);
            }
        }
    }, [id]);

    return (
        <section id={id} className="mb-6">
            <div className='flex items-center mb-4 gap-2 group cursor-pointer'
                onClick={copySectionLink}
            >
                <h1 className='text-lg font-bold'>{title}</h1>
                <Hash className='hidden group-hover:block transition-all ease-in-out' />
            </div>

            {children}
            <style jsx>{`
          .highlight-section {
            animation: highlight 2s ease;
          }
          @keyframes highlight {
            0% { background-color: transparent; }
            50% { background-color: rgba(255, 255, 0, 0.2); }
            100% { background-color: transparent; }
          }
        `}</style>
        </section>
    );
};


export default function TutorialPage() {
    const currentDate = new Date();
    const updateDate = new Date(currentDate.setDate(currentDate.getDate() - 5));
    const formattedDate = updateDate.toLocaleDateString('vi-VN');

    return (
        <div className='min-h-screen flex flex-col container mx-auto p-4 space-y-4'>
            <div>
                <h1 className='md:text-xl sm:text-lg font-bold'>Hướng dẫn sử dụng Chatbot UI</h1>
                <p className='mt-2 text-sm text-muted-foreground'>Bài viết được cập nhật mới nhất vào ngày: {formattedDate}</p>
                <p className='mt-2 text-sm text-muted-foreground'>Đây là tài liệu hướng dẫn sử dụng Chatbot UI được viết bởi Gia Bảo - Đội ngũ thiết kế giao diện</p>
            </div>
            <Separator />
            <section>
                <h1 className='font-normal'>Xin chào, mình là Gia Bảo từ Đội ngũ phát triển Giao diện của Chatbot UI, dưới đây là các bước hướng dẫn để mọi người có thể dễ dàng thao tác hơn trong quá trình sử dụng.</h1>
            </section>
            <ShareableSection
                id="login"
                title="1. Giao diện đăng nhập"
            >
                <div className="space-y-2">
                    <p className='text-justify'>Khi bạn bắt đầu vào trang đăng nhập thì sẽ bắt đầu đăng nhập vào trang, nếu bạn chưa có tài khoản thì hãy <span className='font-bold'>liên hệ đến ITC</span> để được cung cấp tài khoản sử dụng.</p>
                    <div className="flex justify-center items-center">
                        <Zoom>
                            <Image
                                src='/login/1.png'
                                alt='Login screen'
                                width={1920}
                                height={1080}
                                className='rounded-xl w-full'
                                loading='lazy'
                                placeholder='blur'
                                blurDataURL='/login/1.png'
                            />
                        </Zoom>
                    </div>
                </div>
            </ShareableSection>
            <ShareableSection
                id='knowledge'
                title='2. Giao diện kiến thức'
            >
                <p>Hướng dẫn chi tiết về giao diện kiến thức.</p>
            </ShareableSection>
        </div>
    )
}
