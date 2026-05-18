import { User } from '../lib/supabase'
import { FieldGroup, ReadonlyDisplay } from './ui'

interface GuarantorCardProps {
  num: 1 | 2
  users: User[]
  selectedId: string
  onSelect: (id: string) => void
  displayName: string
}

function prefix(num: 1 | 2) {
  return `mdhamini_${num}`
}

export function GuarantorCard({ num, users, selectedId, onSelect, displayName }: GuarantorCardProps) {
  const p = prefix(num)
  return (
    <div className="guarantor-card">
      <div className="guarantor-header">Mdhamini {num}</div>

      <div className="field-grid cols-2">
        <FieldGroup label="Chagua Mdhamini">
          <select
            name={`${p}_id`}
            value={selectedId}
            onChange={e => onSelect(e.target.value)}
          >
            <option value="">— Chagua mwanachama —</option>
            {users.map(u => (
              <option key={u.id} value={String(u.id)}>
                {u.jina_kamili} {u.namba_mwanachama ? `(${u.namba_mwanachama})` : ''}
              </option>
            ))}
          </select>
        </FieldGroup>
        <FieldGroup label="Jina la Mdhamini">
          <ReadonlyDisplay>{displayName || '—'}</ReadonlyDisplay>
        </FieldGroup>
      </div>

      <div className="field-grid cols-3" style={{ marginTop: 14 }}>
        <FieldGroup label="Hisa – Kiasi">
          <input type="number" name={`${p}_hisa_kiasi`} placeholder="Kiasi" min="0" />
        </FieldGroup>
        <FieldGroup label="Jumla Thamani (Tshs)">
          <input type="number" name={`${p}_hisa_thamani`} placeholder="@ 5,000/=" min="0" />
        </FieldGroup>
        <FieldGroup label="Akiba (Tshs)">
          <input type="number" name={`${p}_akiba`} placeholder="Tshs" min="0" />
        </FieldGroup>
      </div>

      <div className="field-grid cols-2" style={{ marginTop: 14 }}>
        <FieldGroup label="Ninamdhamini kwa Kiasi cha Shs">
          <input type="number" name={`${p}_kiasi`} placeholder="Tshs" min="0" />
        </FieldGroup>
        <FieldGroup label="Amana (Tshs)">
          <input type="number" name={`${p}_amana`} placeholder="Tshs" min="0" />
        </FieldGroup>
      </div>

      <div className="field-grid cols-2" style={{ marginTop: 14 }}>
        <FieldGroup label="Namba ya Simu">
          <input type="tel" name={`${p}_simu`} placeholder="0712 000 000" />
        </FieldGroup>
        <FieldGroup label="Tarehe">
          <input type="date" name={`${p}_tarehe`} />
        </FieldGroup>
      </div>
    </div>
  )
}
