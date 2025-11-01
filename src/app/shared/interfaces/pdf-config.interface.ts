export interface PdfSection {
  title: string;
  fields: Array<{ label: string; value: string | number | null }>;
}

export interface PdfDocumentData {
  title: string;
  sections: PdfSection[];
  signature?: string;
}