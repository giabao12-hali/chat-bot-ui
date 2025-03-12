"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatAISm } from "@/api/chat/chat.service";
import ReactMarkdown from "react-markdown";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "@/hooks/use-media-query";

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
    const [loading, setLoading] = useState(false); // Trạng thái đang chờ phản hồi
    const [isBotTyping, setIsBotTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    // ✅ Hàm cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        requestAnimationFrame(() => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
            });
        });
    };

    // ✅ Gửi tin nhắn
    const sendMessage = async () => {
        if (!input.trim() || loading) return; // Không gửi nếu input trống hoặc đang chờ phản hồi

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
        }
    };

    // ✅ Tự động cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col p-4 h-dvh max-h-screen">
            <h1 className="text-center text-2xl font-semibold mb-4">Chat với AI</h1>

            <ScrollArea
                ref={scrollRef}
                className="flex-1 p-4 "
                style={{ maxHeight: "calc(100vh - 120px)" }}
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "flex-row-reverse" : "justify-start"} mb-8 px-4 gap-4`}
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
                                <div className="text-xs text-muted-foreground mb-1">{msg.timestamp}</div>
                            </>
                        ) : (
                            <>
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
            </ScrollArea>

            <div className="sticky bottom-0 left-0 right-0 bg-background p-4 flex items-center space-x-2 border-t">
                <AutosizeTextarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    disabled={loading}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !loading) {
                            e.preventDefault(); // Ngăn chặn xuống dòng khi nhấn Enter
                            sendMessage();
                        }
                    }}
                />
                <Button onClick={sendMessage} disabled={loading}>
                    {loading ? "Đang gửi..." : "Gửi"}
                </Button>
            </div>
        </div>
    );
}
