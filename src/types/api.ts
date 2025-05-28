// Common API types
export interface ApiResponse<T = any> {
  data: T | null;
  success: boolean;
  message?: string;
  errors?: string[];
  status?: number;
}

export interface PaginatedRequest {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}