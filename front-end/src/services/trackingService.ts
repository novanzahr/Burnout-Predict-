/**
 * trackingService.ts
 * Handles Check-In and Journal data.
 *
 * Behaviour is controlled by VITE_USE_MOCK_API:
 *   true  → read/write from localStorage (existing historyService data intact)
 *   false → call backend tracking endpoints via apiClient
 *
 * Adapters (normalizeCheckIn / normalizeJournal) insulate the UI from
 * backend response shape changes.
 */

import { apiClient, isMockMode } from './apiClient'
import {
  getHistoryList,
  saveHistoryItem,
  getJournalList,
  saveJournalEntry,
  getJournalsByDate,
  getLocalDateString,
  analyzeJournalText,
} from './historyService'
import type { CheckIn, CreateCheckInPayload, Journal, CreateJournalPayload } from '../types/tracking'

// ─── Adapters ─────────────────────────────────────────────────────────────────

function parseLocalDateString(rawDate: unknown, rawCreatedAt: unknown): string {
  if (typeof rawDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    return rawDate
  }
  const timestamp = typeof rawDate === 'string' ? rawDate : (typeof rawCreatedAt === 'string' ? rawCreatedAt : null)
  if (timestamp) {
    const d = new Date(timestamp)
    if (!isNaN(d.getTime())) {
      try {
        return new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Jakarta",
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }).format(d)
      } catch {
        const yyyy = d.getFullYear()
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        return `${yyyy}-${mm}-${dd}`
      }
    }
  }
  return getLocalDateString()
}

function normalizeCheckInResponse(raw: unknown): CheckIn | null {
  if (!raw || typeof raw !== 'object') return null
  let r = raw as Record<string, unknown>
  if (r.status === 'success' && r.data && typeof r.data === 'object') {
    r = r.data as Record<string, unknown>
  }
  
  const id = r.id !== undefined && r.id !== null ? String(r.id) : undefined
  const date = parseLocalDateString(r.date, r.created_at || r.createdAt)
  const sleep_hours = r.sleep_hours !== undefined && r.sleep_hours !== null ? parseFloat(String(r.sleep_hours)) : 0
  const work_hours = r.work_hours !== undefined && r.work_hours !== null ? parseFloat(String(r.work_hours)) : undefined
  
  const scoreVal = r.final_burnout_score !== undefined ? r.final_burnout_score : (r.score_assessment !== undefined ? r.score_assessment : r.burnout_score)
  const burnoutScore = typeof scoreVal === 'number' ? scoreVal : (typeof scoreVal === 'string' ? parseFloat(scoreVal) : undefined)
  
  const levelVal = r.final_burnout_level || r.risk_level
  let riskLevel: string | undefined = undefined
  if (typeof levelVal === 'string') {
    const l = levelVal.toLowerCase()
    if (l === 'low' || l === 'rendah') riskLevel = 'Rendah'
    else if (l === 'moderate' || l === 'sedang') riskLevel = 'Sedang'
    else if (l === 'high' || l === 'tinggi') riskLevel = 'Tinggi'
    else {
      riskLevel = levelVal
    }
  }
  if (burnoutScore !== undefined && !riskLevel) {
    riskLevel = burnoutScore > 70 ? 'Tinggi' : burnoutScore >= 40 ? 'Sedang' : 'Rendah'
  }
  
  const scoreAssessmentVal = r.score_assessment !== undefined ? r.score_assessment : undefined
  const score_assessment = typeof scoreAssessmentVal === 'number' ? scoreAssessmentVal : (typeof scoreAssessmentVal === 'string' ? parseFloat(scoreAssessmentVal) : undefined)

  const note = typeof r.note === 'string' ? r.note : undefined
  const warning = typeof r.warning === 'string' ? r.warning : undefined
  const dashboardRecommendation = typeof r.dashboard_recommendation === 'string' ? r.dashboard_recommendation : undefined
  const createdAt = typeof r.created_at === 'string' ? r.created_at : undefined
  
  return {
    id,
    date,
    sleep_hours,
    work_hours,
    burnoutScore,
    score_assessment,
    riskLevel,
    note,
    warning,
    dashboardRecommendation,
    createdAt,
  }
}

export function normalizeEmotion(raw: string | undefined | null): string {
  if (!raw) return 'neutral'
  const val = raw.toLowerCase().trim()
  if (['anger', 'angry', 'marah', 'stress', 'stres'].includes(val)) {
    return 'anger'
  }
  if (['happy', 'senang', 'bahagia', 'joy'].includes(val)) {
    return 'happy'
  }
  if (['sadness', 'sad', 'sedih', 'lelah', 'tired'].includes(val)) {
    return 'sadness'
  }
  if (['love', 'cinta', 'sayang'].includes(val)) {
    return 'love'
  }
  if (['fear', 'takut', 'cemas', 'anxiety', 'anxious'].includes(val)) {
    return 'fear'
  }
  return 'neutral'
}

function normalizeJournalResponse(raw: unknown): Journal | null {
  if (!raw || typeof raw !== 'object') return null
  
  let r = raw as Record<string, unknown>
  if (r.status === 'success' && r.data && typeof r.data === 'object') {
    r = r.data as Record<string, unknown>
  }
  
  const id = r.id !== undefined && r.id !== null ? String(r.id) : undefined
  const date = parseLocalDateString(r.date, r.created_at || r.createdAt)
  const content = typeof r.content === 'string' ? r.content : ''
  
  let mood = r.mood_expression || r.detected_emotion || r.detectedEmotion || r.emotion
  if (r.emotions && typeof r.emotions === 'object') {
    const emotionsMap = r.emotions as Record<string, number>
    let maxEmotion = ''
    let maxVal = -1
    for (const [em, val] of Object.entries(emotionsMap)) {
      if (val > maxVal) {
        maxVal = val
        maxEmotion = em
      }
    }
    if (maxEmotion) {
      mood = maxEmotion
    }
  }

  const detectedEmotion = normalizeEmotion(typeof mood === 'string' ? mood : '')

  let insight = typeof r.insight === 'string' ? r.insight : undefined
  let recommendation = typeof r.recommendation === 'string' ? r.recommendation : undefined
  
  if (Array.isArray(r.motivations) && r.motivations.length > 0) {
    const firstMotiv = r.motivations[0] as Record<string, unknown> | undefined
    if (firstMotiv && typeof firstMotiv.message === 'string') {
      insight = firstMotiv.message
    }
    const secondMotiv = r.motivations[1] as Record<string, unknown> | undefined
    if (secondMotiv && typeof secondMotiv.message === 'string') {
      recommendation = secondMotiv.message
    } else {
      recommendation = 'Lanjutkan mengekspresikan perasaan Anda dan jaga keseimbangan aktivitas Anda.'
    }
  }

  const createdAt = typeof r.created_at === 'string' ? r.created_at
    : typeof r.createdAt === 'string' ? r.createdAt : undefined

  return {
    id,
    date,
    content,
    detectedEmotion,
    insight,
    recommendation,
    createdAt,
  }
}

function unwrapArray<T>(payload: unknown, normalizer: (raw: unknown) => T | null): T[] {
  const arr = Array.isArray(payload) ? payload
    : Array.isArray((payload as Record<string, unknown>)?.data)
      ? (payload as Record<string, unknown>).data as unknown[]
      : []
  return arr.map(normalizer).filter((x): x is T => x !== null)
}

// ─── Check-In ─────────────────────────────────────────────────────────────────

export async function createCheckIn(payload: CreateCheckInPayload): Promise<CheckIn> {
  if (isMockMode) {
    // Persist via existing historyService
    saveHistoryItem({
      date: payload.date,
      journal: '',
      emotion: 'sadness',
      burnoutScore: 0,      // caller should compute score before calling
      riskLevel: 'Rendah',
    })
    // Also persist the raw check-in key used by Dashboard
    const stored = {
      sleepHours: payload.sleep_hours,
      workHours: payload.work_hours ?? 0,
      score: 0,
      risk: 'Rendah',
    }
    localStorage.setItem('today_checkin', JSON.stringify(stored))
    return {
      date: payload.date,
      sleep_hours: payload.sleep_hours,
      work_hours: payload.work_hours,
    }
  }

  const res = await apiClient.post<unknown>('/predict', payload)
  return normalizeCheckInResponse(res) ?? { date: payload.date, sleep_hours: payload.sleep_hours }
}

export async function getCheckIns(): Promise<CheckIn[]> {
  if (isMockMode) {
    const history = getHistoryList()
    return history.map((h) => ({
      date: h.date,
      sleep_hours: 0,
      burnoutScore: h.burnoutScore,
      riskLevel: h.riskLevel,
    }))
  }

  try {
    const res = await apiClient.get<unknown>('/predict')
    return unwrapArray(res, normalizeCheckInResponse)
  } catch {
    return []
  }
}

// ─── Journal ──────────────────────────────────────────────────────────────────

export async function createJournal(payload: CreateJournalPayload): Promise<Journal> {
  if (isMockMode) {
    const analysis = analyzeJournalText(payload.content)
    const entry = saveJournalEntry(
      payload.content,
      payload.detectedEmotion ?? analysis.emotion,
      payload.insight ?? analysis.insight,
      payload.recommendation ?? analysis.recommendation,
    )
    return {
      id: entry.id,
      date: entry.date,
      content: entry.content,
      detectedEmotion: normalizeEmotion(entry.detectedEmotion),
      insight: entry.insight,
      recommendation: entry.recommendation,
      createdAt: entry.createdAt,
    }
  }

  const res = await apiClient.post<unknown>('/journal', payload)
  return normalizeJournalResponse(res) ?? { date: payload.date, content: payload.content }
}

export async function getJournals(dateStr?: string): Promise<Journal[]> {
  if (isMockMode) {
    const list = dateStr ? getJournalsByDate(dateStr) : getJournalList()
    return list.map((j) => ({
      id: j.id,
      date: j.date,
      content: j.content,
      detectedEmotion: normalizeEmotion(j.detectedEmotion),
      insight: j.insight,
      recommendation: j.recommendation,
      createdAt: j.createdAt,
    }))
  }

  try {
    const path = dateStr ? `/journal?date=${dateStr}` : '/journal'
    const res = await apiClient.get<unknown>(path)
    return unwrapArray(res, normalizeJournalResponse)
  } catch {
    return []
  }
}

export { analyzeJournalText, getLocalDateString }
