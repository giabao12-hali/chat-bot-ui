/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateKnowledgeDtoModel, CreateKnowledgeUrlDtoModel, GetKnowledgeResourceDtoModel, KnowledgeBaseModel } from "@/types/models/knowledge.model";
import { serverApi } from "../axiosConfig";

export const getKnowledgeResourceAll = async (): Promise<KnowledgeBaseModel[]> => {
    try {
        const response = serverApi.get<KnowledgeBaseModel[]>(
            `/api/v1/get-knowledge-resource-all`
        );
        return (await response).data
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}

export const deleteKnowledgeReourceId = async (id: number): Promise<number> => {
    try {
        const response = serverApi.delete<number>(
            `/api/v1/delete-by-knowledge-resource-id`,
            {
                params: {
                    id
                }
            }
        )
        return (await response).data
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}

export const insertByText = async(data: CreateKnowledgeDtoModel): Promise<KnowledgeBaseModel> => {
    try {
        const response = await serverApi.post<KnowledgeBaseModel>(
            `/api/v1/insert-by-text`,
            {},
            {
                params: data
            }
        )
        return response.data;
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}

export const postByUrl = async(data: CreateKnowledgeUrlDtoModel): Promise<KnowledgeBaseModel> => {
    try {
        const response = await serverApi.post<KnowledgeBaseModel>(
            `/api/v1/post-by-url`,
            {},
            {
                params: data
            }
        )
        return response.data;
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}

export const activeKnowledge = async(knowledge_resource_id: number): Promise<number> => {
    try {
        const response = await serverApi.post<number>(
            `/api/v1/active-knowledge`,
            {},
            {
                params: {
                    knowledge_resource_id
                }
            }
        )
        return response.data;
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}

export const getKnowledgeResource = async(resource_id?: number, category_id?: number, is_active?: boolean): Promise<GetKnowledgeResourceDtoModel[]> => {
    try {
        const params: Record<string, any> = {};

        if (resource_id && resource_id > 0) params.resource_id = resource_id;
        if (category_id && category_id > 0) params.category_id = category_id;
        if (is_active !== undefined) params.is_active = is_active;

        console.log("📤 Gửi request với params:", params);

        const response = await serverApi.get<GetKnowledgeResourceDtoModel[]>(
            `/api/v1/get-knowledge-resource`,
            { params }
        )
        return response.data;
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}