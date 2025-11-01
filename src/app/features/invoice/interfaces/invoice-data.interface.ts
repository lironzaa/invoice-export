export interface InvoiceFormData {
  fullName: string;
  email: string;
  phone: string | null;
  invoiceNumber: string;
  amount: number;
  date: string;
  signature: string;
}

export interface InvoiceSubmissionResponse {
  success: boolean;
  message: string;
  invoiceId?: string;
}