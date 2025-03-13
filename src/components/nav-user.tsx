"use client"

import {
    ChevronsUpDown,
    Cpu,
    LogOut,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { removeToken } from "@/utils/auth"
import { ModeToggle } from "./ui/theme-toggle"
import { useEffect, useState } from "react"
import Cookies from "js-cookie";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import confetti from "canvas-confetti"


export function NavUser({
    user,
}: {
    user: {
        name: string
        email: string
        avatar: string
    }
}) {
    const [username, setUsername] = useState<string | null>(null);
    const [isDevMode, setIsDevMode] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const secretMessage = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    const [secretIndex, setSecretMessage] = useState(0);
    const [foundSecret, setFoundSecret] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    const router = useRouter();

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === secretMessage[secretIndex]) {
                setSecretMessage((prev) => prev + 1);
                if (secretIndex + 1 === secretMessage.length) {
                    handleClick();
                    setSecretMessage(0);
                }
            } else {
                setSecretMessage(0);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [secretIndex]);

    useEffect(() => {
        if (foundSecret) {
            setCountdown(5);
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) {
                        clearInterval(interval);
                        router.push("/dev");
                    }
                    return prev ? prev - 1 : null;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [foundSecret, router]);


    const handleClick = () => {
        const end = Date.now() + 3 * 1000; // 3 seconds
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

        const frame = () => {
            if (Date.now() > end) return;

            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: { x: 0, y: 0.5 },
                colors: colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.5 },
                colors: colors,
            });

            requestAnimationFrame(frame);
        };

        frame();
        setFoundSecret(true);
    };


    useEffect(() => {
        const storedData = Cookies.get("rememberMe");
        if (storedData) {
            try {
                const parsedData = JSON.parse(decodeURIComponent(storedData));
                setUsername(parsedData.username);

                if (parsedData.username === 'baong') {
                    setIsDevMode(true);
                }
            } catch (error) {
                console.error("Lỗi khi giải mã cookie:", error);
            }
        }
    }, []);

    const { isMobile } = useSidebar()

    const handleLogout = () => {
        removeToken();
        router.push("/login");
    }

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="rounded-lg">{username}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{username}</span>
                                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="rounded-lg">{username}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{username}</span>
                                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="flex justify-between">
                                <p>Đổi theme</p>
                                <ModeToggle />
                            </DropdownMenuItem>
                            {isDevMode && (
                                <DropdownMenuItem onClick={() => {
                                    setOpenDialog(true);
                                }}>
                                    <Cpu />
                                    <p>Dev Mode</p>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut />
                                Đăng xuất
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Nhập mã truy cập để vào chế độ dev mode
                        </DialogTitle>
                    </DialogHeader>
                    <Separator />
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Mã truy cập</Label>
                            <Input
                                placeholder="Nhập mã truy cập"
                            />
                        </div>
                        <Button className="w-full" variant={'outline'}>Gửi mã</Button>
                    </div>
                    {foundSecret ? (
                        <p className="text-center text-xs text-green-500">
                            You know what it does, right? 😉 {countdown !== null && `(${countdown}s)`}
                        </p>
                    ) : (
                        <p className="text-muted-foreground text-xs text-center">
                            Do you know? The game Contra by Konami is one of the childhood games of the developers in this project.
                        </p>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
