'use client'

import React, { useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { MenuIcon } from 'lucide-react';
import { Separator } from '../ui/separator';
import { navBarItems } from '@/types/mock/navbar-items';

export default function MobileNav() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <MenuIcon />
                </Button>
            </SheetTrigger>

            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle>
                        Menu
                    </SheetTitle>
                    <SheetDescription>
                        Main navigation
                    </SheetDescription>
                </SheetHeader>
                <Separator />
                <div className="flex flex-col items-start">
                    {navBarItems.map((item, index) => (
                        <Button
                            key={index}
                            variant="link"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            {item}
                        </Button>
                    ))}
                </div>
            </SheetContent>

        </Sheet>
    )
}
