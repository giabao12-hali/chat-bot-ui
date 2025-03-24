'use client'

import { Separator } from '@/components/ui/separator'
import { itTeamMembers } from '@/types/mock/navbar-items'
import React from 'react'

export default function SupportPage() {
    return (
        <div className='min-h-screen flex flex-col container mx-auto p-4 space-y-4'>
            <div className='flex-1'>
                <h1 className='md:text-xl sm:text-lg font-bold'>Gặp một chút khó khăn trong quá trình sử dụng? Liên lạc ngay đây, hỗ trợ liền tay.</h1>
                <p className='mt-2 text-sm text-muted-foreground'>Trong quá trình sử dụng, nếu bạn có <span className='font-semibold'>góp ý / vấn đề</span> xảy ra ở <span className='font-semibold'>giao diện / hệ thống</span> thì đội ngũ Công Nghệ Thông Tin của Vietravel luôn ở bên bạn khắc phục những vấn đề không đáng có trong quá trình sử dụng.</p>
            </div>
            <Separator />
            <section className='space-y-4 py-6'>
                <h1 className='font-semibold'>
                    Danh sách những thành viên tham gia quá trình phát triển:
                </h1>
                <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                    {itTeamMembers.map((member, index) => (
                        <div key={index} className='rounded-xl border border-solid border-muted-foreground/50 p-4'>
                            <p className='font-semibold'>
                                {member.name} - <span className='text-muted-foreground'>{member.role}</span>
                            </p>
                            <p className='text-muted-foreground'>
                                Số điện thoại: {member.phoneNumber}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <Separator />
            <div className="mt-auto text-center text-sm text-muted-foreground py-4">Và một lần nữa, đội ngũ chúng tôi xin lỗi và cảm ơn bạn rất nhiều trong quá trình gặp sự cố không ý muốn.</div>
        </div>
    )
}
