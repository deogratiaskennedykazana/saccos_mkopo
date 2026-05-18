import React from 'react'

interface FieldGroupProps {
  label: string
  children: React.ReactNode
  className?: string
}

export function FieldGroup({ label, children, className = '' }: FieldGroupProps) {
  return (
    <div className={`field-group ${className}`}>
      <label>{label}</label>
      {children}
    </div>
  )
}

interface ReadonlyDisplayProps {
  children: React.ReactNode
  badge?: boolean
}

export function ReadonlyDisplay({ children, badge }: ReadonlyDisplayProps) {
  return (
    <div className="readonly-display">
      {badge ? <span className="badge">{children}</span> : children}
    </div>
  )
}

interface SectionProps {
  letter: string
  title: string
  children: React.ReactNode
  gold?: boolean
  officeBanner?: string
}

export function Section({ letter, title, children, gold, officeBanner }: SectionProps) {
  return (
    <div className="section">
      {officeBanner && (
        <div className="office-banner" style={{ margin: '-24px -32px 20px', padding: '8px 32px' }}>
          {officeBanner}
        </div>
      )}
      <div className="section-title">
        <div className="section-letter" style={gold ? { background: 'var(--gold)' } : {}}>
          {letter}
        </div>
        <h4>{title}</h4>
        <div className="divider" />
      </div>
      {children}
    </div>
  )
}
