import React from 'react'
import MainNav from './mainnav'
import MobileNav from './mobilenav'

export default function SiteHeader() {
    return (
        <header className="w-full border-b">
            <div className="flex h-14 items-center px-4">
                <MainNav />
                <MobileNav />
            </div>
        </header>
    )
}
