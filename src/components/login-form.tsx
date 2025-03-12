/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { cn } from "@/lib/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import toast from "react-hot-toast"
import { login } from "@/api/[auth]/login/login.service"
import { useEffect, useState } from "react"
import { getRememberMe, removeRememberMe, setRememberMe } from "@/utils/cookie"
import { useRouter } from "next/navigation"
import { LoginResponse } from "@/types/models/login.model"

const formSchema = z.object({
    username: z.string().min(3, {
        message: "Thông tin bắt buộc"
    }),
    password: z.string().min(6, {
        message: "Mật khẩu phải chứa ít nhất 6 ký tự"
    }),
})

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [rememberMe, setRememberMeState] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    })

    useEffect(() => {
        const savedData = getRememberMe();
        if (savedData) {
            form.setValue("username", savedData.username);
            form.setValue("password", savedData.password);
            setRememberMeState(true);
        }
    }, [form]);

    function onSubmit(data: z.infer<typeof formSchema>) {
        toast.promise(
            login(data)
                .then((response: LoginResponse) => {
                    if (rememberMe) {
                        setRememberMe({
                            id: response.id,
                            username: response.username,
                            password: data.password
                        });
                    } else {
                        removeRememberMe();
                    }
                    setTimeout(() => {
                        router.push("/home");
                    }, 3000);
                    return response;
                }),
            {
                loading: "Đang đăng nhập...",
                success: "Đăng nhập thành công!",
                error: (error: any) => error.message || "Đăng nhập thất bại!"
            }
        );
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Chào mừng trở lại</CardTitle>
                    <CardDescription>
                        Đăng nhập vào tài khoản của bạn
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên đăng nhập</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nhập tên đăng nhập"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mật khẩu</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="********"
                                                {...field}
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMeState(checked === true)}
                                />
                                <label
                                    htmlFor="rememberMe"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Nhớ mật khẩu
                                </label>
                            </div>
                            <Button type="submit">Đăng nhập</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
