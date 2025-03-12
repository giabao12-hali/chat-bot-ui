import Cookies from "js-cookie"

const COOKIE_NAME = "rememberMe";
const EXPIRE_DAYS = 3;

export const setRememberMe = (data: {id: number; username: string; password: string}) => {
    Cookies.set(COOKIE_NAME, JSON.stringify(data), { expires: EXPIRE_DAYS });
}

export const getRememberMe = (): {id: number; username: string; password: string} | null => {
    const data = Cookies.get(COOKIE_NAME);
    return data ? JSON.parse(data) : null;
}

export const removeRememberMe = () => {
    Cookies.remove(COOKIE_NAME);
}