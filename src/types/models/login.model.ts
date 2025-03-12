export interface LoginParams {
    username: string;
    password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  role_id: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  is_active: boolean;
}