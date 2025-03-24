"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { chatAISm } from "@/api/chat/chat.service";
import ReactMarkdown from "react-markdown";
import { AutosizeTextarea, AutosizeTextAreaRef } from "@/components/ui/autosize-textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CopyIcon } from "@/components/ui/copy";
import { UpvoteIcon } from "@/components/ui/upvote";
import { DownvoteIcon } from "@/components/ui/downvote";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import { ArrowRightIcon } from "@/components/ui/arrow-right";
import { motion } from "motion/react";
import { ArrowDownIcon } from "@/components/ui/arrow-down";

interface Message {
    id: number;
    sender: "user" | "bot";
    text: string;
    timestamp: string
    img?: string;
}

export default function ChatPage() {

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isBotTyping, setIsBotTyping] = useState(false);

    const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
    const [showScrollButton, setShowScrollButton] = useState(false); // State cho nút scroll

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<AutosizeTextAreaRef | null>(null);

    // ✅ Hàm cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // ✅ Gửi tin nhắn
    const sendMessage = async () => {
        if (!input.trim() || loading) return; // Không gửi nếu input trống hoặc đang chờ phản hồi

        setShowWelcomeMessage(false);

        const timestamp = new Date().toLocaleString();

        const userMessage: Message = {
            id: messages.length + 1,
            sender: "user",
            text: input.trim(),
            timestamp,
        };

        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput("");
        setLoading(true); // Đánh dấu đang chờ phản hồi
        setIsBotTyping(true);

        try {
            const response = await chatAISm(userMessage.text);
            const botMessage: Message = {
                id: messages.length + 2,
                sender: "bot",
                text: response.reply || "Lỗi: Không có phản hồi từ AI",
                timestamp: new Date().toLocaleString(),
            };

            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Lỗi khi gửi tin nhắn:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: messages.length + 2, sender: "bot", text: "Lỗi khi nhận phản hồi từ AI", timestamp: new Date().toLocaleString() },
            ]);
        } finally {
            setLoading(false); // Kết thúc trạng thái chờ
            setIsBotTyping(false);
            scrollToBottom(); // Cuộn xuống cuối

            if (textareaRef.current) {
                textareaRef.current.textArea.focus();
            }
        };
    }

    useEffect(() => {
        if (messages.length > 0 && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        const handleScroll = () => {
            // ✅ Kiểm tra nếu người dùng cuộn lên (cách bottom 50px)
            const isScrolled = window.innerHeight + window.scrollY < document.body.scrollHeight - 50;
            setShowScrollButton(isScrolled);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col h-screen p-4">
            <div className="bg-background z-10 sticky top-0">
                <h1 className="text-center text-2xl font-semibold my-2">Chat với AI</h1>
            </div>

            <div className="w-full flex-1 p-4 flex flex-col relative" ref={scrollRef}>
                {showWelcomeMessage && messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center p-6 rounded-lg bg-gray-100 dark:bg-gray-800 max-w-md">
                            <Avatar className="mx-auto mb-4">
                                <AvatarImage src="/icon.svg" />
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-semibold mb-2">Hôm nay mình có thể giúp được gì cho bạn?</h2>
                            <p className="text-muted-foreground">Hãy nhập câu hỏi của bạn vào ô bên dưới để bắt đầu cuộc trò chuyện.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col justify-end">
                        <div className="space-y-8">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "user" ? "flex-row-reverse" : "justify-start"} px-4 gap-4`}
                                >
                                    {isDesktop ? (
                                        <>
                                            {
                                                msg.sender === "bot" && (
                                                    <Avatar>
                                                        <AvatarImage src="/icon.svg" />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>

                                                )
                                            }
                                            {msg.sender === "user" && (
                                                <Avatar>
                                                    <AvatarImage src="/user.png" />
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div>
                                                <div
                                                    className={`p-3 max-w-sm ${msg.sender === "user"
                                                        ? "bg-blue-500 text-white rounded-s-lg rounded-br-lg"
                                                        : "bg-gray-300 text-black dark:bg-gray-700 dark:text-white rounded-e-lg rounded-bl-lg"
                                                        }`}
                                                >
                                                    {msg.sender === "bot" ? (
                                                        <>
                                                            <p className="font-semibold text-sm">Vietravel - Chatbot AI</p>
                                                            <ReactMarkdown>
                                                                {msg.text}
                                                            </ReactMarkdown>
                                                        </>
                                                    ) : (
                                                        msg.text
                                                    )}
                                                </div>
                                                {msg.sender === "bot" && (
                                                    <div className="flex justify-start items-center mt-2">
                                                        <Tooltip>
                                                            <TooltipProvider>
                                                                <TooltipTrigger
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(msg.text);
                                                                        toast.success("Đã sao chép tin nhắn!");
                                                                    }}
                                                                >
                                                                    <CopyIcon size={14} />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    Sao chép tin nhắn
                                                                </TooltipContent>
                                                            </TooltipProvider>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <TooltipProvider>
                                                                <TooltipTrigger
                                                                    onClick={() => {
                                                                        toast.success("Cảm ơn bạn đã phản hồi!");
                                                                    }}
                                                                >
                                                                    <UpvoteIcon size={14} />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    Phản hồi tốt
                                                                </TooltipContent>
                                                            </TooltipProvider>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <TooltipProvider>
                                                                <TooltipTrigger
                                                                    onClick={() => {
                                                                        toast.success("Cảm ơn bạn đã phản hồi!");
                                                                    }}>
                                                                    <DownvoteIcon size={14} />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    Phản hồi không tốt
                                                                </TooltipContent>
                                                            </TooltipProvider>
                                                        </Tooltip>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground mb-1">{msg.timestamp}</div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <div
                                                    className={`p-3 max-w-sm ${msg.sender === "user"
                                                        ? "bg-blue-500 text-white rounded-s-lg rounded-br-lg"
                                                        : "bg-gray-300 text-black dark:bg-gray-700 dark:text-white rounded-e-lg rounded-bl-lg"
                                                        }`}
                                                >
                                                    {msg.sender === "bot" ? (
                                                        <>
                                                            <p className="font-semibold text-sm">Vietravel - Chatbot AI</p>
                                                            <ReactMarkdown>
                                                                {msg.text}
                                                            </ReactMarkdown>
                                                        </>
                                                    ) : (
                                                        msg.text
                                                    )}
                                                </div>
                                                {msg.sender === "bot" && (
                                                    <div className="flex justify-start items-center mt-2">
                                                        <Tooltip>
                                                            <TooltipProvider>
                                                                <TooltipTrigger>
                                                                    <CopyIcon size={14} />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    Sao chép tin nhắn
                                                                </TooltipContent>
                                                            </TooltipProvider>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <TooltipProvider>
                                                                <TooltipTrigger>
                                                                    <UpvoteIcon size={14} />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    Phản hồi tốt
                                                                </TooltipContent>
                                                            </TooltipProvider>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <TooltipProvider>
                                                                <TooltipTrigger>
                                                                    <DownvoteIcon size={14} />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    Phản hồi không tốt
                                                                </TooltipContent>
                                                            </TooltipProvider>
                                                        </Tooltip>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                            {isBotTyping && (
                                <div className="flex items-center space-x-2">
                                    <div className="size-2 animate-bounce rounded-full bg-foreground [animation-delay:-0.3s]"></div>
                                    <div className="size-2 animate-bounce rounded-full bg-foreground [animation-delay:-0.13s]"></div>
                                    <div className="size-2 animate-bounce rounded-full bg-foreground"></div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                )}

                {showScrollButton && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-0 w-full flex justify-center items-center z-50 sr-only"
                    >
                        <Tooltip>
                            <TooltipProvider>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={scrollToBottom}
                                        size="icon"
                                        className="rounded-full shadow-md"
                                    >
                                        <ArrowDownIcon className="hover:bg-transparent" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Cuộn xuống cuối
                                </TooltipContent>
                            </TooltipProvider>
                        </Tooltip>
                    </motion.div>
                )}
            </div>

            <div className="sticky bottom-0 left-0 right-0 bg-background p-4 flex items-center space-x-2 border-t">
                <AutosizeTextarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    // disabled={loading}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !loading) {
                            e.preventDefault(); // Ngăn chặn xuống dòng khi nhấn Enter
                            sendMessage();
                        }
                    }}
                />
                <Button onClick={sendMessage} disabled={loading} size={'icon'}>
                    {loading ? (
                        <div className="flex items-center justify-center space-x-1">
                            {[...Array(3)].map((_, index) => (
                                <motion.div
                                    key={index}
                                    className="h-3 w-1 rounded-full bg-white"
                                    animate={{
                                        scaleY: [0.5, 1.5, 0.5],
                                        scaleX: [1, 0.8, 1],
                                        translateY: ['0%', '-15%', '0%'],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        delay: index * 0.1,
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <ArrowRightIcon className="hover:bg-transparent" />
                    )}
                </Button>
            </div>
        </div>
    );
}