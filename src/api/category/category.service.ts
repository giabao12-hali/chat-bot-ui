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

        if (error.response) {
            // Nếu có detail từ API
            if (error.response.data && error.response.data.detail) {
                const detailMessage = error.response.data.detail;
                // Trích xuất chỉ phần message từ chuỗi detail
                const messageMatch = detailMessage.match(/message='([^']+)'/);
                if (messageMatch && messageMatch[1]) {
                    throw new Error(messageMatch[1]);
                }
                // Nếu không tìm thấy định dạng message, trả về toàn bộ detail
                throw new Error(detailMessage);
            }
            // Nếu là lỗi 500 (Internal Server Error)
            if (error.response.status === 500) {
                throw new Error("Hệ thống đang cập nhật, vui lòng thử lại sau");
            }
        }

        throw new Error("Đã xảy ra lỗi, vui lòng thử lại sau");
    }
}

export const getByCategoryId = async(category_id: number): Promise<CategoryBaseModel> => {
    try {
        const response = await serverApi.get<CategoryBaseModel>(
            `/api/v1/get-by-category-id`,
            {
                params: {
                    category_id
                }
            }
        )
        return response.data
    } catch (error: any) {
        console.error(error)
        throw new Error(error)
    }
}