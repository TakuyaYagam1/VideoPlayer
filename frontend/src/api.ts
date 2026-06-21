import type { Video } from './types'

export async function getVideos(): Promise<Video[]> {
  const res = await fetch('/api/videos')
  if (!res.ok) throw new Error('Failed to fetch videos')
  return res.json()
}

export async function recordView(id: number): Promise<{ views: number }> {
  const res = await fetch(`/api/videos/${id}/view`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to record view')
  return res.json()
}
