export interface PaginationParams {
  page: number;
  size: number;
  sortBy: 'start' | 'end';
  direction: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}
