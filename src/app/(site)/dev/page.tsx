/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        Dosbox: any;
    }
}

// ✅ Hàm tải script từ CDN trước khi chạy game
const loadScript = (src: string, callback: () => void) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = callback;
    document.body.appendChild(script);
};

export default function DevPage() {
    const dosRef = useRef<HTMLDivElement>(null);
    const [dosbox, setDosbox] = useState<any>(null);

    useEffect(() => {
        loadScript("https://js-dos.com/cdn/js-dos-api.js", () => {
            if (window.Dosbox && dosRef.current) {
                const newDosbox = new window.Dosbox({
                    id: "dosbox",
                    onload: function (dosboxInstance: any) {
                        dosboxInstance.run("https://js-dos.com/cdn/upload/DOOM-@evilution.zip", "./DOOM/DOOM.EXE");
                    },
                    onrun: function (_dosbox: any, app: string) {
                        console.log("Chạy ứng dụng:", app);
                    },
                });
                setDosbox(newDosbox);
            } else {
                console.error("Dosbox không tìm thấy!");
            }
        });
    }, []);

    return (
        <div className="container mx-auto p-4 flex flex-col justify-center items-center h-dvh space-y-4">
            <div id="dosbox" ref={dosRef} />
            <Button
                onClick={() => dosbox?.requestFullScreen()}
                // onClick={() => {
                //     if (dosbox) {
                //         if (document.documentElement.requestFullscreen) {
                //             document.documentElement.requestFullscreen(); // ✅ Full toàn màn hình
                //         } else {
                //             alert("Trình duyệt không hỗ trợ fullscreen.");
                //         }
                //     }
                // }}
                variant={'outline'}
            >
                Chơi fullscreen
            </Button>
        </div>
    );
}
