/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryBaseModel, CreateCategoryDtoModel, UpdateCategoryDtoModel } from "@/types/models/category.model";
import { serverApi } from "../axiosConfig";

export const getCategories = async(): Promise<CategoryBaseModel[]> => {
    try {
        const response = await serverApi.get<CategoryBaseModel[]>(
            `/api/v1/get-categories`
        )
        return (await response).data
    } catch (error: any) {
        console.error(error)
        throw new Error(error)
    }
}

export const insertCategory = async(data: CreateCategoryDtoModel): Promise<CategoryBaseModel> => {
    try {
        const response = await serverApi.post<CategoryBaseModel>(
            `/api/v1/insert-category`,
            {},
            {
                params: data
            }
        )
        return response.data
    } catch (error: any) {
        console.error(error)
        throw new Error(error)
    }
}

export const updateCategory = async(data: UpdateCategoryDtoModel): Promise<CategoryBaseModel> => {
    try {
        const response = await serverApi.put<CategoryBaseModel>(
            `/api/v1/update-category`,
            {},
            {
                params: data
            }
        )
        return response.data
    } catch (error: any) {
        console.error(error)
        throw new Error(error)
    }
}

export const deleteByCategoryId = async(category_id: number): Promise<number> => {
    try {
        const response = await serverApi.delete<number>(
            `/api/v1/delete-by-category-id`,
            {
                params: {
                    category_id
                }
            }
        )
        return response.data;
    } catch (error: any) {
        console.error(error)
        throw new Error(error)
    }
}