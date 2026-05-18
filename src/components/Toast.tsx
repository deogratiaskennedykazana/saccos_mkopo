import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | ''

interface ToastState {
  msg: string
  type: ToastType
  visible: boolean
}

let _setToast: ((s: ToastState) => void) | null = null

export function showToast(msg: string, type: ToastType = '') {
  _setToast?.({ msg, type, visible: true })
  setTimeout(() => _setToast?.({ msg: '', type: '', visible: false }), 3500)
}

export function Toast() {
  const [state, setState] = useState<ToastState>({ msg: '', type: '', visible: false })

  useEffect(() => {
    _setToast = setState
    return () => { _setToast = null }
  }, [])

  return (
    <div
      id="toast"
      className={[state.visible ? 'show' : '', state.type].filter(Boolean).join(' ')}
    >
      {state.msg}
    </div>
  )
}
