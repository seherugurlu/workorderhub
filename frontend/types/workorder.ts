export type Department = "FACILITIES" | "IT" | "SECURITY" | "HR";
export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type Status = "NEW" | "IN_PROGRESS" | "BLOCKED" | "DONE";

export type WorkOrder = {
  id: string;
  title: string;
  description: string;
  department: Department;
  priority: Priority;
  status: Status;
  requesterName: string;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiError = {
  code: string;
  message: string;
  details?: unknown[];
};

export type ApiResult<T> =
  | { ok: true; requestId: string; data: T }
  | { ok: false; requestId: string; error: ApiError };