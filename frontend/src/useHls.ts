import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

export interface HlsLevel {
  index: number
  label: string
}

export function useHls(src: string | null, videoRef: React.RefObject<HTMLVideoElement | null>) {
  const hlsRef = useRef<Hls | null>(null)
  const [levels, setLevels] = useState<HlsLevel[]>([])

  useEffect(() => {
    const video = videoRef.current
    setLevels([])

    if (!video || !src) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hlsRef.current = hls
      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const lvls: HlsLevel[] = data.levels.map((l, i) => ({
          index: i,
          label: l.height ? `${l.height}p` : `${Math.round(l.bitrate / 1000)}k`,
        }))
        setLevels(lvls)
      })

      return () => {
        hls.destroy()
        hlsRef.current = null
        setLevels([])
      }
    }

    // Safari: native HLS via ManagedMediaSource or canPlayType
    const canNative =
      'ManagedMediaSource' in window ||
      video.canPlayType('application/vnd.apple.mpegurl') !== ''
    if (canNative) {
      video.src = src
    }
  }, [src, videoRef])

  return { hlsRef, levels }
}
