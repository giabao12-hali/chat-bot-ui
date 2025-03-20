/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { getKnowledgeByKnowledgeResourceId } from '@/api/knowledge/knowledge.service';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GetKnowledgeResourceDetailDtoModel } from '@/types/models/knowledge.model'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function KnowledgeDetails() {
    const { id } = useParams();

    const [knowledgeDetails, setKnowledgeDetails] = React.useState<GetKnowledgeResourceDetailDtoModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchKnowledgeDetails = async () => {
            try {
                setLoading(true);
                const data = await getKnowledgeByKnowledgeResourceId(Number(id));
                setKnowledgeDetails(data);
            } catch (error) {
                console.error("Error fetching knowledge details", error);
                setError("Error fetching knowledge details");
            } finally {
                setLoading(false);
            }
        }
        fetchKnowledgeDetails();
    }, [id]);

    const parseJsonContent = (jsonString: string) => {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            return jsonString; // Return the original string if parsing fails
        }
    };

    // Function to parse the special metadata format
    // It handles the Python-like dictionary format with single quotes
    const parseMetadata = (metadataString: string) => {
        try {
            // Replace single quotes with double quotes to make it valid JSON
            // But first handle the nested single quotes in values
            const jsonReadyString = metadataString
                .replace(/'/g, '"')
                // Fix double quotes around keys and values that might have been created
                .replace(/"([^"]+)":/g, '"$1":')
                // Fix any escaped quotes that might need attention
                .replace(/\\"/g, '\\"');

            return JSON.parse(jsonReadyString);
        } catch (error) {
            // If parsing fails, try to create a more readable format
            try {
                // Create a simple object by extracting key-value pairs
                const result: Record<string, string> = {};
                const keyValuePairs = metadataString
                    .replace(/^{|}$/g, '') // Remove outer braces
                    .split(', ');

                keyValuePairs.forEach(pair => {
                    const [key, value] = pair.split(': ');
                    if (key && value) {
                        // Remove quotes from key and value
                        const cleanKey = key.replace(/^'|'$/g, '');
                        const cleanValue = value.replace(/^'|'$/g, '');
                        result[cleanKey] = cleanValue;
                    }
                });

                return result;
            } catch {
                // If all else fails, return the original string
                return metadataString;
            }
        }
    };

    // Function to render content in a readable format
    const renderContent = (content: any, isMetadata = false) => {
        if (typeof content === 'object' && content !== null) {
            return (
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                    {JSON.stringify(content, null, 2)}
                </pre>
            );
        } else if (isMetadata && typeof content === 'string') {
            // For metadata that couldn't be parsed as JSON
            const parsed = parseMetadata(content);
            if (typeof parsed === 'object') {
                return (
                    <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
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
                    <div className='w-full'>
                        <h1 className='font-semibold text-center text-lg md:text-2xl'>Danh sách chi tiết kiến thức</h1>
                        {knowledgeDetails.map((knowledge, index) => (
                            <div className="border rounded-lg p-4 shadow-sm" key={index}>
                                <h2 className="text-lg font-medium mb-2">{index + 1}</h2>

                                <div className="mb-4">
                                    <h3 className="text-md font-medium mb-1">Nội dung:</h3>
                                    {renderContent(parseJsonContent(knowledge.content))}
                                </div>

                                <div>
                                    <h3 className="text-md font-medium mb-1">Các thông tin khác:</h3>
                                    {renderContent(knowledge.extra_metadata, true)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
