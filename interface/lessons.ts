export interface LessonsRequest {
  page?: number;
  size: number;
  keyword?: string;
  majorIds?: number[];
  provinceIds?: number[];
}
