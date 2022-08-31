export interface ApiResponse<T> {
  message?: string;
  errors?: any;
  status: boolean;
  data: T;
}
