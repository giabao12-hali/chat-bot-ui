export interface KnowledgeBaseModel {
  created_at: string;
  title: string;
  id: number;
  url: string;
  resource_id: number;
  created_by: number;
  category_id: number;
  is_active: number;
}

export interface CreateKnowledgeDtoModel {
  title: string;
  content: string;
  resource_id: number;
  category_id: number;
  created_by: number;
}

export interface CreateKnowledgeUrlDtoModel {
  url: string;
  resource_id: number;
  category: number;
  created_by: number;
}

export interface GetKnowledgeResourceDtoModel {
  category_id: number;
  is_active: number;
  created_at: string;
  title: string;
  id: number;
  url: string;
  resource_id: number;
  created_by: number;
}

export interface GetKnowledgeResourceDetailDtoModel {
  knowledge_resource_id: number;
  content: string;
  embedding: string;
  vector_id: string;
  id: number;
  extra_metadata: string;
  created_at: string;
}