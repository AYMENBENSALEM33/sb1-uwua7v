export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationContext {
  source: string;
  timestamp: string;
  data?: any;
}