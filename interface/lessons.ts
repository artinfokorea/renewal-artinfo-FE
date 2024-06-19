export interface LessonsRequest {
  page?: number;
  size: number;
  keyword?: string;
  majorIds?: number[];
  provinceIds?: number[];
}

export interface LessonPayload {
  imageUrl: string;
  pay: number;
  areas: string[];
  introduction: string;
  career: string;
}
