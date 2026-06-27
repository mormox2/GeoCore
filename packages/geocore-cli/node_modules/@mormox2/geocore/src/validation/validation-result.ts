export type ValidationSeverity = "info" | "warning" | "error" | "critical";

export interface ValidationIssue {
  id: string;
  severity: ValidationSeverity;
  code: string;
  message: string;
  objectId?: string;
  field?: string;
  recommendation?: string;
}

export interface ValidationResult {
  valid: boolean;
  publishable: boolean;
  issues: ValidationIssue[];
  checkedAt: string;
}
