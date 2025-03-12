/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResourceModel } from "@/types/models/resource.model";
import { serverApi } from "../axiosConfig";

export const getResources = async(): Promise<ResourceModel[]> => {
    try {
        const response = await serverApi.get<ResourceModel[]>(
            `/api/v1/get-resources`
        )
        return response.data;
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}