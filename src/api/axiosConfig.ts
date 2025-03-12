import axios from "axios";
import { API } from "./api";

const baseConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

const serverApi = axios.create({
  baseURL: API.SERVER,
  ...baseConfig,
});

const chatbotApi = axios.create({
  baseURL: API.CHATBOT,
  ...baseConfig,
})

export { serverApi, chatbotApi };
