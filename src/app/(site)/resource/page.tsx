/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { getResources } from '@/api/resource/resource.service';
import { ResourceModel } from '@/types/models/resource.model'
import React, { useEffect, useState } from 'react'

export default function ResourcePage() {
    const [resources, setResources] = useState<ResourceModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const getResource = async () => {
            try {
                setLoading(true);
                const response = await getResources();
                setResources(response);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        getResource();
    }, []);

    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4">
                {loading ? (
                    <div className='flex justify-center items-center md:mt-56'>
                        <div className="flex items-center space-x-2">
                            <div className="size-4 animate-bounce rounded-full bg-foreground [animation-delay:-0.3s]"></div>
                            <div className="size-4 animate-bounce rounded-full bg-foreground [animation-delay:-0.13s]"></div>
                            <div className="size-4 animate-bounce rounded-full bg-foreground"></div>
                        </div>
                    </div>
                ) : error ? (
                    <div className='flex justify-center items-center'>
                        <p>
                            Đã có lỗi xảy ra, vui lòng thử lại sau
                        </p>
                    </div>
                ) : (
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        {resources.map((resource, index) => (
                            <div key={index}>
                                <div className="rounded-xl border border-solid border-foreground/50 p-4 space-y-2">
                                    <div className="space-y-0.5">
                                        <h1 className='font-semibold'>
                                            {resource.name}
                                        </h1>
                                        <h2 className='text-muted-foreground text-xs'>
                                            {resource.description}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div >
        </>
    )
}
