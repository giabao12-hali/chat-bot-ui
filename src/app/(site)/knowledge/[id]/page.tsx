/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { getKnowledgeByKnowledgeResourceId } from '@/api/knowledge/knowledge.service';
import { ArrowLeftIcon } from '@/components/ui/arrow-left';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GetKnowledgeResourceDetailDtoModel } from '@/types/models/knowledge.model'
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react'

export default function KnowledgeDetails() {
    const { id: rawId } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const id = useMemo(() => (rawId ? Number(rawId) : null), [rawId]);

    const [knowledgeDetails, setKnowledgeDetails] = useState<GetKnowledgeResourceDetailDtoModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchKnowledgeDetails = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await getKnowledgeByKnowledgeResourceId(Number(id));
            setKnowledgeDetails(data);
        } catch (error) {
            setError("Không thể tải chi tiết kiến thức");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchKnowledgeDetails();
    }, [fetchKnowledgeDetails])

    const parseJsonContent = (jsonString: string) => {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            return jsonString; // Return the original string if parsing fails
        }
    };

    const parseMetadata = (metadataString: string) => {
        try {
            const jsonReadyString = metadataString
                .replace(/'/g, '"')
                .replace(/"([^"]+)":/g, '"$1":')
                .replace(/\\"/g, '\\"');

            return JSON.parse(jsonReadyString);
        } catch (error) {
            try {
                const result: Record<string, string> = {};
                const keyValuePairs = metadataString
                    .replace(/^{|}$/g, '')
                    .split(', ');

                keyValuePairs.forEach(pair => {
                    const [key, value] = pair.split(': ');
                    if (key && value) {
                        const cleanKey = key.replace(/^'|'$/g, '');
                        const cleanValue = value.replace(/^'|'$/g, '');
                        result[cleanKey] = cleanValue;
                    }
                });

                return result;
            } catch {
                return metadataString;
            }
        }
    };

    const renderContent = (content: any, isMetadata = false) => {
        if (typeof content === 'object' && content !== null) {
            return (
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                    {JSON.stringify(content, null, 2)}
                </pre>
            );
        } else if (isMetadata && typeof content === 'string') {
            const parsed = parseMetadata(content);
            if (typeof parsed === 'object') {
                return (
                    <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-black">
                        {JSON.stringify(parsed, null, 2)}
                    </pre>
                );
            }
        }
        return <p className="break-words">{content}</p>;
    };

    return (
        <>
            <div className="flex flex-col gap-4 p-4">
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
                    <div className='w-full space-y-4 relative'>
                        <div className="flex items-center w-full relative">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size={'icon'}
                                            variant={'secondary'}
                                            className="absolute left-0"
                                            onClick={() => {
                                                router.push(`/knowledge?${searchParams.toString()}`);
                                            }}
                                        >
                                            <ArrowLeftIcon />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Quay về</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <div className="flex-grow text-center">
                                <h1 className='font-semibold text-lg md:text-2xl'>Danh sách chi tiết kiến thức</h1>
                            </div>
                        </div>
                        {knowledgeDetails.map((knowledge, index) => (
                            <div className="border rounded-lg p-4 shadow-sm" key={index}>
                                <h2 className="text-lg font-medium mb-2">{index + 1}</h2>

                                <div className="mb-4">
                                    <h3 className="text-md font-medium mb-1">Nội dung:</h3>
                                    {renderContent(parseJsonContent(knowledge.content))}
                                </div>

                                {index === 0 && (
                                    <div>
                                        <h3 className="text-md font-medium mb-1">Các thông tin khác:</h3>
                                        {renderContent(knowledge.extra_metadata, true)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
