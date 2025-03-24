'use client'

import React from 'react'
import NotFoundAnimation from "@/components/presentation/animations/not-found.animation.json"

import dynamic from 'next/dynamic'
import Link from 'next/link'
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });



export default function Custom404() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: NotFoundAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-dvh space-y-4">
            <Lottie
                options={defaultOptions}
                height={300}
                width={300}
            />
            <p className="text-2xl font-bold text-center">Trang bạn tìm kiếm hiện tại không tồn tại.</p>
            <Link href={"/home"} className="underline text-muted-foreground">
                Nhấn vào đây để quay về.
            </Link>
        </div>
    )
}
