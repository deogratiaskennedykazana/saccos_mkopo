import { useEffect, useRef, useState, useCallback } from 'react'

export function useSignaturePad() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasSig, setHasSig] = useState(false)
  const isDrawing = useRef(false)

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.parentElement!.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = 120 * dpr
    ctx.scale(dpr, dpr)
    ctx.strokeStyle = '#1a1410'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [resize])

  const getPos = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const src = 'touches' in e ? e.touches[0] : e
    return { x: src.clientX - rect.left, y: src.clientY - rect.top }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDrawing.current = true
      const p = getPos(e)
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
    }
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing.current) return
      if ('touches' in e) e.preventDefault()
      const p = getPos(e)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      setHasSig(true)
    }
    const onUp = () => { isDrawing.current = false }

    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseup', onUp)
    canvas.addEventListener('mouseleave', onUp)
    canvas.addEventListener('touchstart', onDown as EventListener, { passive: false })
    canvas.addEventListener('touchmove', onMove as EventListener, { passive: false })
    canvas.addEventListener('touchend', onUp)

    return () => {
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('mouseleave', onUp)
      canvas.removeEventListener('touchstart', onDown as EventListener)
      canvas.removeEventListener('touchmove', onMove as EventListener)
      canvas.removeEventListener('touchend', onUp)
    }
  }, [])

  const clear = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSig(false)
  }, [])

  const getDataUrl = useCallback(() => {
    if (!hasSig || !canvasRef.current) return null
    return canvasRef.current.toDataURL('image/png')
  }, [hasSig])

  return { canvasRef, hasSig, clear, getDataUrl }
}
