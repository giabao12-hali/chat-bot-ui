import React from 'react'
import { Toaster } from 'react-hot-toast'

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Toaster />
            <div className='bg-muted'>
                {children}
            </div>
        </>
    )
}
