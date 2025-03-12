export interface CategoryBaseModel {
  description: string;
  updated_at: string;
  id: number;
  updated_by: number;
  name: string;
  created_at: string;
  created_by: number;
}

export interface CreateCategoryDtoModel {
  name: string;
  description: string;
  user_id: number;
}

export interface UpdateCategoryDtoModel {
  user_id: number;
  category_id: number;
  name: string;
  description?: string
}