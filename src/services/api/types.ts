export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

export interface PmProcess {
  PmGuid: string;
  PmOrder: number;
  PmCreationDate: string;
  PmDescription: string;
}

export interface TaskData {
  class_name: string;
  formValues: Array<{
    name: string;
    value: any;
  }>;
  lockVersion: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}