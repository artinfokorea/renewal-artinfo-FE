export interface InquiryPayload {
  title: string;
  email: string;
  contents: string;
}

export interface PerformanceInquiryPayload {
  name: string;
  phone: string;
  email: string;
  ensembleType: string;
  provinceIds: number[];
  contents: string;
}
