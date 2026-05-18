export function generateFormNumber(): string {
  const ts = Date.now().toString(36).toUpperCase()
  return 'AR.' + ts
}

export function today(): string {
  return new Date().toISOString().split('T')[0]
}

export function n(val: string): number | null {
  const v = parseFloat(val)
  return isNaN(v) ? null : v
}

export function ni(val: string): number | null {
  const v = parseInt(val)
  return isNaN(v) ? null : v
}
