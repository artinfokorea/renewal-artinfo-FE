import { ApplyMethod, CompetitionPhase } from "@/types/competitions"
import { ListRequest } from "."

export interface CompetitionsRequest extends ListRequest {
  phases?: CompetitionPhase[]
  divisions?: string[]
  areas?: string[]
}

export interface CompetitionPayload {
  title: string
  host: string
  organizer?: string
  area: string
  venue?: string
  divisions: string[]
  ages: string[]
  openAt: string
  closeAt: string
  heldAt?: string
  resultAt?: string
  fee?: string
  applyMethod: ApplyMethod
  applyLink?: string
  tel?: string
  email?: string
  prize?: string
  description?: string
  posterUrl?: string
  documentUrl?: string
  contentImages?: string[]
}
