import { useSignaturePad } from '../hooks/useSignaturePad'

interface SignaturePadProps {
  onRef: (getDataUrl: () => string | null) => void
}

export function SignaturePad({ onRef }: SignaturePadProps) {
  const { canvasRef, hasSig, clear, getDataUrl } = useSignaturePad()

  // Expose getDataUrl to parent
  onRef(getDataUrl)

  return (
    <div className="sig-wrapper">
      <div className="sig-label">Sahihi ya Mkopaji — Weka sahihi yako hapa kwa kidole</div>
      <div className="sig-canvas-wrap">
        <canvas ref={canvasRef} id="sig-canvas" />
        <div
          className="sig-placeholder"
          id="sig-placeholder"
          style={{ opacity: hasSig ? 0 : 1 }}
        >
          ≈ Weka sahihi yako hapa
        </div>
      </div>
      <div className="sig-controls">
        <button type="button" className="btn-clear-sig" onClick={clear}>
          Futa Sahihi
        </button>
      </div>
    </div>
  )
}
