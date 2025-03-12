/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverApi } from "@/api/axiosConfig";
import { LoginParams, LoginResponse } from "@/types/models/login.model";

export const login = async(data: LoginParams): Promise<LoginResponse> => {
    try {
        const response = await serverApi.post<LoginResponse>(
            `/api/v1/login`,
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