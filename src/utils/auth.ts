import { NextRequest } from "next/server";
import Cookies from "js-cookie";

/**
 * Lấy token từ cookie trong request (Middleware)
 */
export const getToken = (req: NextRequest): string | null => {
  const token = req.cookies.get("token")?.value || null;
  return token;
};

/**
 * Lưu token vào cookie (dành cho khi đăng nhập thành công)
 */
export const setToken = (token: string) => {
  Cookies.set("token", token, { expires: 3 }); // Lưu trong 3 ngày
};

/**
 * Xóa token khỏi cookie (Đăng xuất)
 */
export const removeToken = () => {
  Cookies.remove("token");
  Cookies.remove("rememberMe");
  localStorage.clear();
  sessionStorage.clear();
};
