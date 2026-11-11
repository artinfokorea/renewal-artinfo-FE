export interface InquiryPayload {
  title: string;
  email: string;
  contents: string;
  /** 스팸 방지 허니팟 — 사람은 비워 둔다 */
  website?: string;
  /** 스팸 방지 — 폼을 연 시각 (epoch ms) */
  startedAt?: number;
}
