'use client'

import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function FaqPage() {
    return (
        <div className='container mx-auto p-4 space-y-4'>
            <div>
                <h1 className='md:text-xl sm:text-lg font-bold'>Khám Phá Du Lịch Với Chatbot: Những Câu Hỏi Thú Vị Bạn Cần Biết!</h1>
                <p className='mt-2 text-sm text-muted-foreground'>Bạn muốn du lịch mà không muốn tốn thời gian tìm kiếm thông tin? Hãy để chatbot của Vietravel giúp bạn! Cùng tìm hiểu những câu hỏi thú vị và hữu ích để bạn có chuyến đi hoàn hảo ngay tại đây!</p>
            </div>
            <Separator />
            <section className='space-y-4'>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Chatbot UI du lịch là gì?</AccordionTrigger>
                        <AccordionContent>
                            Chatbot UI du lịch là một giao diện người dùng của chatbot được thiết kế để cung cấp thông tin và hỗ trợ người dùng trong các lĩnh vực liên quan đến du lịch, như tìm kiếm điểm đến, đặt vé, gợi ý lịch trình, cung cấp thông tin về khách sạn, phương tiện di chuyển và các dịch vụ du lịch khác.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Chatbot UI du lịch có thể giúp tôi những gì?</AccordionTrigger>
                        <AccordionContent>
                            Chatbot UI du lịch có thể giúp bạn:
                            <ul className='list-disc list-inside'>
                                <li>
                                    Tìm kiếm điểm đến du lịch nổi bật.
                                </li>
                                <li>
                                    Gợi ý các tour du lịch hoặc lịch trình phù hợp.
                                </li>
                                <li>
                                    Cung cấp thông tin về các khách sạn, nhà hàng và các dịch vụ du lịch khác.
                                </li>
                                <li>
                                    Hỗ trợ đặt vé máy bay, tàu, xe, và các phương tiện khác.
                                </li>
                                <li>
                                    Cung cấp thông tin thời tiết, visa, văn hóa và các mẹo du lịch tại điểm đến.
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Làm sao chatbot UI có thể đưa ra các gợi ý du lịch chính xác?</AccordionTrigger>
                        <AccordionContent>
                            Chatbot UI có thể sử dụng các thuật toán học máy và cơ sở dữ liệu lớn về các điểm đến, sở thích của người dùng, thời gian và ngân sách để đưa ra các gợi ý du lịch chính xác và cá nhân hóa. Càng sử dụng lâu, chatbot sẽ học hỏi thêm về thói quen và nhu cầu của người dùng để cải thiện các gợi ý.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>Chatbot UI có thể cung cấp thông tin về các điểm đến du lịch như thế nào?</AccordionTrigger>
                        <AccordionContent>
                            Chatbot UI du lịch có thể cung cấp các thông tin chi tiết về điểm đến như:
                            <ul className='list-disc list-inside'>
                                <li>
                                    Các địa điểm tham quan nổi tiếng.
                                </li>
                                <li>
                                    Thông tin về văn hóa, ẩm thực và các hoạt động giải trí.
                                </li>
                                <li>
                                    Cung cấp thông tin về các khách sạn, nhà hàng và các dịch vụ du lịch khác.
                                </li>
                                <li>
                                    Thời tiết và mùa du lịch tốt nhất.
                                </li>
                                <li>
                                    Lịch sử, truyền thống và các sự kiện đặc biệt của khu vực đó.
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger>Làm thế nào để đảm bảo thông tin du lịch từ chatbot là chính xác và cập nhật?</AccordionTrigger>
                        <AccordionContent>
                            Được phát triển bởi đội ngũ Công Nghệ Thông Tin của Vietravel, chúng tôi tin chắc rằng thông tin du lịch từ Chatbot luôn là những thông tin cập nhật mới nhất và chính xác nhất. Và bạn cũng có thể cập nhật thông tin du lịch từ các nguồn khác như website, fanpage, hoặc hotline của Vietravel <Link href={'/knowledge'} className='font-bold hover:underline'>tại đây</Link>.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger>Chatbot UI có thể giúp tôi với các câu hỏi về đặc sản và ẩm thực địa phương không?</AccordionTrigger>
                        <AccordionContent>
                            Có, chatbot UI du lịch có thể cung cấp thông tin về các món ăn đặc sản, các nhà hàng nổi tiếng và các khu chợ ẩm thực tại điểm đến du lịch.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-7">
                        <AccordionTrigger>Làm thế nào để chatbot UI du lịch hiểu được yêu cầu của tôi?</AccordionTrigger>
                        <AccordionContent>
                            Chatbot UI du lịch sử dụng công nghệ xử lý ngôn ngữ tự nhiên (NLP) để hiểu các câu hỏi và yêu cầu của bạn. Bạn có thể yêu cầu thông tin bằng cách hỏi trực tiếp hoặc cung cấp dữ liệu (như điểm đến, ngày tháng, ngân sách), và chatbot sẽ phân tích yêu cầu của bạn để đưa ra những câu trả lời hoặc gợi ý phù hợp.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    )
}
