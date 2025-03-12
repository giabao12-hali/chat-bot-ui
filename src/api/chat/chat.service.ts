/* eslint-disable @typescript-eslint/no-explicit-any */
import { chatbotApi } from "../axiosConfig"

export const chatAISm = async(message: string) => {
    try {
        const response = await chatbotApi.get(
            `/api/v1/chat-ai-sm`,
            {
                params: {
                    message
                },
                responseType: "text"
            }
        )

        const parsedResponse = typeof response.data === "string" ? { reply: response.data } : response.data;

        return parsedResponse;
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}