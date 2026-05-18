import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase, User, LoanPayload } from '../lib/supabase'
import { generateFormNumber, today, n, ni } from '../lib/utils'
import { showToast } from './Toast'
import { SignaturePad } from './SignaturePad'
import { GuarantorCard } from './GuarantorCard'
import { Section, FieldGroup, ReadonlyDisplay } from './ui'

export function LoanForm() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [userNotFound, setUserNotFound] = useState(false)

  const [formNumber] = useState(generateFormNumber)
  const [applicant, setApplicant] = useState<User | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>([])

  const [g1Id, setG1Id] = useState('')
  const [g2Id, setG2Id] = useState('')

  // Synced display fields
  const [kiasi, setKiasi] = useState('')
  const [rejesho, setRejesho] = useState('')

  const sigGetDataUrl = useRef<() => string | null>(() => null)

  // Load users & applicant from URL
  useEffect(() => {
    async function init() {
      const { data: usersData } = await supabase
        .from('users')
        .select('id, jina_kamili, namba_mwanachama, simu, anuani_posta, kata, mtaa, namba_nyumba')
      setAllUsers(usersData || [])

      const params = new URLSearchParams(window.location.search)
      const userId = params.get('id')

      if (userId) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        if (error || !data) {
          setUserNotFound(true)
        } else {
          setApplicant(data)
        }
      }

      setLoading(false)
    }
    init()
  }, [])

  const g1Name = allUsers.find(u => String(u.id) === g1Id)?.jina_kamili || ''
  const g2Name = allUsers.find(u => String(u.id) === g2Id)?.jina_kamili || ''

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!applicant) {
      showToast('⚠ Hakuna mwanachama aliyepatikana. Angalia kiungo.', 'error')
      return
    }
    if (!g1Id || !g2Id) {
      showToast('⚠ Tafadhali chagua wadhamini wawili (2).', 'error')
      return
    }
    if (g1Id === g2Id) {
      showToast('⚠ Wadhamini wawili lazima wawe tofauti.', 'error')
      return
    }
    if (g1Id === String(applicant.id) || g2Id === String(applicant.id)) {
      showToast('⚠ Mkopaji hawezi kuwa mdhamini wake mwenyewe.', 'error')
      return
    }

    setSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const g = (key: string) => fd.get(key) as string || ''

    const payload: LoanPayload = {
      form_number: formNumber,
      applicant_id: applicant.id,
      anuani_posta: g('anuani_posta'),
      namba_simu: g('namba_simu'),
      kata: g('kata'),
      mtaa: g('mtaa'),
      namba_nyumba: g('namba_nyumba'),
      idadi_wategemezi: ni(g('idadi_wategemezi')),
      kiasi_tarakimu: n(g('kiasi_tarakimu')),
      kiasi_maneno: g('kiasi_maneno'),
      riba_asilimia: n(g('riba_asilimia')),
      riba_tshs: n(g('riba_tshs')),
      muda_miezi: ni(g('muda_miezi')),
      rejesho_mwezi: n(g('rejesho_mwezi')),
      madhumuni_1: g('madhumuni_1'),
      madhumuni_2: g('madhumuni_2'),
      madhumuni_3: g('madhumuni_3'),
      dhamana_hisa_kiasi: ni(g('dhamana_hisa_kiasi')),
      dhamana_hisa_thamani: n(g('dhamana_hisa_thamani')),
      dhamana_akiba: n(g('dhamana_akiba')),
      dhamana_mali_zingine: g('dhamana_mali_zingine'),
      ana_akaunti: g('ana_akaunti'),
      benki_1_jina: g('benki_1_jina'), benki_1_ac: g('benki_1_ac'),
      benki_2_jina: g('benki_2_jina'), benki_2_ac: g('benki_2_ac'),
      benki_3_jina: g('benki_3_jina'), benki_3_ac: g('benki_3_ac'),
      ana_mkopo_benki: g('ana_mkopo_benki'),
      prev_mikopo: [
        { benki: g('prev_benki_1'), kiasi: g('prev_kiasi_1'), muda: g('prev_muda_1'), makato: g('prev_makato_1'), baki: g('prev_baki_1') },
        { benki: g('prev_benki_2'), kiasi: g('prev_kiasi_2'), muda: g('prev_muda_2'), makato: g('prev_makato_2'), baki: g('prev_baki_2') },
      ],
      mdhamini_1_id: parseInt(g1Id),
      mdhamini_1_hisa_kiasi: ni(g('mdhamini_1_hisa_kiasi')),
      mdhamini_1_hisa_thamani: n(g('mdhamini_1_hisa_thamani')),
      mdhamini_1_akiba: n(g('mdhamini_1_akiba')),
      mdhamini_1_kiasi: n(g('mdhamini_1_kiasi')),
      mdhamini_1_amana: n(g('mdhamini_1_amana')),
      mdhamini_1_simu: g('mdhamini_1_simu'),
      mdhamini_1_tarehe: g('mdhamini_1_tarehe') || null,
      mdhamini_2_id: parseInt(g2Id),
      mdhamini_2_hisa_kiasi: ni(g('mdhamini_2_hisa_kiasi')),
      mdhamini_2_hisa_thamani: n(g('mdhamini_2_hisa_thamani')),
      mdhamini_2_akiba: n(g('mdhamini_2_akiba')),
      mdhamini_2_kiasi: n(g('mdhamini_2_kiasi')),
      mdhamini_2_amana: n(g('mdhamini_2_amana')),
      mdhamini_2_simu: g('mdhamini_2_simu'),
      mdhamini_2_tarehe: g('mdhamini_2_tarehe') || null,
      tarehe_fungu_kwanza: g('tarehe_fungu_kwanza') || null,
      tarehe_mwisho: g('tarehe_mwisho') || null,
      sahihi_data: sigGetDataUrl.current(),
      tarehe_kusaini: g('tarehe_kusaini') || null,
      tarehe_kupokea: g('tarehe_kupokea') || null,
      off_kiasi_kuombwa: n(g('off_kiasi_kuombwa')),
      off_kiasi_pendekezwa: n(g('off_kiasi_pendekezwa')),
      off_muda_miezi: ni(g('off_muda_miezi')),
      off_tarehe_kuanzia: g('off_tarehe_kuanzia') || null,
      off_tarehe_hadi: g('off_tarehe_hadi') || null,
      off_riba: n(g('off_riba')),
      off_rejesho_mwezi: n(g('off_rejesho_mwezi')),
      off_afisa_sahihi: g('off_afisa_sahihi'),
      off_afisa_simu: g('off_afisa_simu'),
      off_afisa_tarehe: g('off_afisa_tarehe') || null,
      kamati_kiasi: n(g('kamati_kiasi')),
      kamati_tarehe: g('kamati_tarehe') || null,
      kamati_muda: ni(g('kamati_muda')),
      kamati_riba: n(g('kamati_riba')),
      kamati_rejesho: n(g('kamati_rejesho')),
      status_kukubaliwa: fd.get('status_kukubaliwa') === 'on',
      status_kukataliwa: fd.get('status_kukataliwa') === 'on',
      status_kuahirishwa: fd.get('status_kuahirishwa') === 'on',
      kamati_maoni: g('kamati_maoni'),
      ap_jina_1: g('ap_jina_1'), ap_sahihi_1: g('ap_sahihi_1'),
      ap_jina_2: g('ap_jina_2'), ap_sahihi_2: g('ap_sahihi_2'),
      ap_jina_3: g('ap_jina_3'), ap_sahihi_3: g('ap_sahihi_3'),
      ap_jina_4: g('ap_jina_4'), ap_sahihi_4: g('ap_sahihi_4'),
      ap_jina_5: g('ap_jina_5'), ap_sahihi_5: g('ap_sahihi_5'),
      hati_malipo_na: g('hati_malipo_na'),
      hundi_na: g('hundi_na'),
      saini_mhasibu: g('saini_mhasibu'),
      created_at: new Date().toISOString(),
      status: 'pending',
    }

    try {
      console.log('📤 Submitting payload:', payload)
      
      // Use the correct Supabase insert method WITHOUT columns parameter
      const { data, error } = await supabase
        .from('loan_applications')
        .insert([payload])
      
      if (error) {
        console.error('❌ Supabase error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        })
        throw error
      }
      
      console.log('✅ Submission successful:', data)
      showToast('✓ Maombi yako ya mkopo yamewasilishwa!', 'success')
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Jaribu tena.'
      console.error('❌ Error details:', err)
      showToast('✗ Hitilafu: ' + msg, 'error')
    } finally {
      setSubmitting(false)
    }
  }, [applicant, formNumber, g1Id, g2Id])

  if (loading) return null // Overlay handles it

  return (
    <form id="loan-form" className="form-body" autoComplete="off" onSubmit={handleSubmit}>
      <input type="hidden" name="form_number" value={formNumber} readOnly />

      {/* ─── SECTION A ─── */}
      <Section letter="A" title="Masharti ya Mkopo">
        <ul className="conditions-list">
          {[
            'Mkopaji awe mwanachama wa St. John Njiro SACCOS Limited.',
            'Mkopaji asiwe na deni lolote katika chama.',
            'Mkopo urudishwe siku halali au tarehe kamili na si vinginevyo.',
            'Ukizidisha siku unatakiwa ulipe na faini.',
            'Mkopo hauendani na matatizo yaliyoko nyumbani.',
            'Mkopaji akifa mrithi analazimika kulipa deni hilo.',
            'Mkopaji lazima awe na wadhamini wasiopungua wawili (2).',
            'Mkopaji akishindwa kulipa mkopo, chini ya usimamizi wa wadhamini wake atachukuliwa kitu chake cha thamani kulingana na ule mkopo.',
            'Mdhamini haruhusiwi kujitoa kwenye chama hadi yule mwanachama aliyemdhamini kwenye mkopo amemaliza mkopo wake.',
          ].map((cond, i) => (
            <li key={i}>
              <span className="cond-letter">({String.fromCharCode(97 + i)})</span>
              {cond}
            </li>
          ))}
        </ul>
      </Section>

      {/* ─── SECTION B ─── */}
      <Section letter="B" title="Maelezo Binafsi">
        {userNotFound && (
          <div className="user-not-found" style={{ display: 'block' }}>
            ⚠ Mtumiaji hakupatikana. Tafadhali hakikisha kiungo kina ID sahihi.
          </div>
        )}
        {submitted && (
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 4, padding: '12px 16px', color: '#166534', fontSize: 14, marginBottom: 12 }}>
            ✓ Maombi ya mkopo yamewasilishwa kwa mafanikio!
          </div>
        )}

        <div className="field-grid">
          <FieldGroup label="Jina Kamili">
            <ReadonlyDisplay>{applicant?.jina_kamili || '—'}</ReadonlyDisplay>
          </FieldGroup>
          <FieldGroup label="Namba ya Mwanachama">
            <ReadonlyDisplay badge>
              {applicant?.namba_mwanachama || applicant?.id || '—'}
            </ReadonlyDisplay>
          </FieldGroup>
        </div>

        <div className="field-grid cols-2" style={{ marginTop: 14 }}>
          <FieldGroup label="Anuani ya Posta">
            <input type="text" name="anuani_posta" placeholder="S.L.P. …" defaultValue={applicant?.anuani_posta || ''} />
          </FieldGroup>
          <FieldGroup label="Namba ya Simu">
            <input type="tel" name="namba_simu" placeholder="0712 000 000" defaultValue={applicant?.simu || ''} />
          </FieldGroup>
        </div>

        <div className="field-grid cols-3" style={{ marginTop: 14 }}>
          <FieldGroup label="Kata">
            <input type="text" name="kata" placeholder="Kata…" defaultValue={applicant?.kata || ''} />
          </FieldGroup>
          <FieldGroup label="Mtaa">
            <input type="text" name="mtaa" placeholder="Mtaa…" defaultValue={applicant?.mtaa || ''} />
          </FieldGroup>
          <FieldGroup label="Na. Nyumba">
            <input type="text" name="namba_nyumba" placeholder="Namba…" defaultValue={applicant?.namba_nyumba || ''} />
          </FieldGroup>
        </div>

        <div className="field-grid cols-2" style={{ marginTop: 14 }}>
          <FieldGroup label="Idadi ya Watu Wanaokutegemea">
            <input type="number" name="idadi_wategemezi" min="0" placeholder="0" />
          </FieldGroup>
        </div>
      </Section>

      {/* ─── SECTION C ─── */}
      <Section letter="C" title="Maelezo ya Maombi ya Mkopo">
        <div className="field-grid cols-2">
          <FieldGroup label="Kiasi Kinachoombwa (Tshs – Tarakimu)">
            <input type="number" name="kiasi_tarakimu" placeholder="0" min="0"
              value={kiasi} onChange={e => setKiasi(e.target.value)} />
          </FieldGroup>
          <FieldGroup label="Kiasi Kinachoombwa (Tshs – Maneno)">
            <input type="text" name="kiasi_maneno" placeholder="Shilingi …" />
          </FieldGroup>
        </div>
        <div className="field-grid cols-3" style={{ marginTop: 14 }}>
          <FieldGroup label="Riba (%)">
            <input type="number" name="riba_asilimia" placeholder="%" min="0" step="0.1" />
          </FieldGroup>
          <FieldGroup label="Riba Sawa na Tshs">
            <input type="number" name="riba_tshs" placeholder="Tshs" min="0" />
          </FieldGroup>
          <FieldGroup label="Muda wa Marejesho (Miezi)">
            <input type="number" name="muda_miezi" placeholder="Miezi" min="1" />
          </FieldGroup>
        </div>
        <div className="field-grid cols-2" style={{ marginTop: 14 }}>
          <FieldGroup label="Rejesho kwa Mwezi (Tshs)">
            <input type="number" name="rejesho_mwezi" placeholder="Tshs" min="0"
              value={rejesho} onChange={e => setRejesho(e.target.value)} />
          </FieldGroup>
        </div>
        <div className="field-grid" style={{ marginTop: 14 }}>
          <FieldGroup label="Madhumuni ya Mkopo 1">
            <input type="text" name="madhumuni_1" placeholder="Kusudi la kwanza…" />
          </FieldGroup>
          <FieldGroup label="Madhumuni ya Mkopo 2">
            <input type="text" name="madhumuni_2" placeholder="Kusudi la pili…" />
          </FieldGroup>
          <FieldGroup label="Madhumuni ya Mkopo 3">
            <input type="text" name="madhumuni_3" placeholder="Kusudi la tatu…" />
          </FieldGroup>
        </div>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px dashed var(--border)' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 12 }}>
            Dhamana ya Mkopo Huu
          </p>
          <div className="field-grid cols-3">
            <FieldGroup label="Hisa – Kiasi">
              <input type="number" name="dhamana_hisa_kiasi" placeholder="Kiasi" min="0" />
            </FieldGroup>
            <FieldGroup label="Jumla ya Thamani Yake (Tshs)">
              <input type="number" name="dhamana_hisa_thamani" placeholder="@ 5,000/= kila moja" min="0" />
            </FieldGroup>
            <FieldGroup label="Akiba (Tshs)">
              <input type="number" name="dhamana_akiba" placeholder="Tshs" min="0" />
            </FieldGroup>
          </div>
          <FieldGroup label="Mali Zingine" className="mt-10">
            <input type="text" name="dhamana_mali_zingine" placeholder="Elezea mali nyingine…" style={{ marginTop: 10 }} />
          </FieldGroup>
        </div>
      </Section>

      {/* ─── SECTION D-1: MABENKI ─── */}
      <Section letter="D" title="Uhusiano na Mabenki / Taasisi za Fedha">
        <p style={{ fontSize: 14, marginBottom: 12 }}>Je, una akaunti ya benki au Taasisi nyingine za fedha?</p>
        <div className="radio-group" style={{ marginBottom: 16 }}>
          <label><input type="radio" name="ana_akaunti" value="NDIYO" /> NDIYO</label>
          <label><input type="radio" name="ana_akaunti" value="HAPANA" defaultChecked /> HAPANA</label>
        </div>

        <p style={{ fontSize: 12, color: 'var(--ink-light)', marginBottom: 8, fontStyle: 'italic' }}>Kama ndiyo, orodhesha:</p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Na.</th>
              <th>Jina la Benki / Taasisi</th>
              <th>Namba ya Akaunti (A/C No)</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map(i => (
              <tr key={i}>
                <th style={{ padding: '8px 10px', background: 'var(--section-bg)' }}>{i}</th>
                <td><input type="text" name={`benki_${i}_jina`} placeholder="Jina la Benki…" /></td>
                <td><input type="text" name={`benki_${i}_ac`} placeholder="A/C No…" /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={{ fontSize: 14, margin: '18px 0 12px' }}>Ulishawai kukopa au una mkopo katika Benki/Taasisi yoyote ya fedha?</p>
        <div className="radio-group" style={{ marginBottom: 16 }}>
          <label><input type="radio" name="ana_mkopo_benki" value="NDIYO" /> NDIYO</label>
          <label><input type="radio" name="ana_mkopo_benki" value="HAPANA" defaultChecked /> HAPANA</label>
        </div>

        <p style={{ fontSize: 12, color: 'var(--ink-light)', marginBottom: 8, fontStyle: 'italic' }}>Kama ndiyo, orodhesha mikopo yote na majina ya wakopeshaji:</p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Benki / Taasisi</th>
              <th>Kiasi Ulichokopa</th>
              <th>Muda wa Mkopo</th>
              <th>Makato kwa Mwezi</th>
              <th>Kiasi Kilichobaki</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2].map(i => (
              <tr key={i}>
                <td><input type="text" name={`prev_benki_${i}`} placeholder="Benki…" /></td>
                <td><input type="number" name={`prev_kiasi_${i}`} placeholder="Tshs" /></td>
                <td><input type="text" name={`prev_muda_${i}`} placeholder="Miezi…" /></td>
                <td><input type="number" name={`prev_makato_${i}`} placeholder="Tshs" /></td>
                <td><input type="number" name={`prev_baki_${i}`} placeholder="Tshs" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* ─── SECTION D-2: UDHAMINI ─── */}
      <Section letter="D" title="Udhamini wa Mkopo" gold>
        <GuarantorCard num={1} users={allUsers} selectedId={g1Id} onSelect={setG1Id} displayName={g1Name} />
        <GuarantorCard num={2} users={allUsers} selectedId={g2Id} onSelect={setG2Id} displayName={g2Name} />
      </Section>

      {/* ─── SECTION E: AZIMIO ─── */}
      <Section letter="E" title="Azimio la Mkopaji">
        <p style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
          Mimi, <strong>{applicant?.jina_kamili || '_______________'}</strong>, Mwombaji wa mkopo, nathibitisha kuwa taarifa zote zilizotolewa hapo juu kwa Chama ni <strong>SAHIHI NA KWELI</strong>.
        </p>
        <div className="field-grid cols-2" style={{ marginBottom: 20 }}>
          <FieldGroup label="Kiasi cha Mkopo (Tshs)">
            <input type="text" name="azimio_kiasi" value={kiasi} readOnly
              style={{ background: 'var(--parchment)', cursor: 'not-allowed' }} onChange={() => {}} />
          </FieldGroup>
          <FieldGroup label="Rejesho la Kila Mwezi (Tshs)">
            <input type="text" name="azimio_rejesho" value={rejesho} readOnly
              style={{ background: 'var(--parchment)', cursor: 'not-allowed' }} onChange={() => {}} />
          </FieldGroup>
        </div>
        <div className="field-grid cols-3" style={{ marginBottom: 24 }}>
          <FieldGroup label="Fungu la Kwanza – Tarehe">
            <input type="date" name="tarehe_fungu_kwanza" />
          </FieldGroup>
          <FieldGroup label="Tarehe ya Kukamilika">
            <input type="date" name="tarehe_mwisho" />
          </FieldGroup>
        </div>

        <SignaturePad onRef={fn => { sigGetDataUrl.current = fn }} />

        <div className="field-grid cols-2" style={{ marginTop: 20 }}>
          <FieldGroup label="Tarehe ya Kusaini">
            <input type="date" name="tarehe_kusaini" defaultValue={today()} />
          </FieldGroup>
        </div>
      </Section>

      {/* ─── SECTION F: OFISI ─── */}
      <Section
        letter="F"
        title="Mapendekezo ya Mkopo"
        officeBanner="F: Mapendekezo ya Mkopo — Kwa Matumizi ya Ofisi Tu"
      >
        <p style={{ fontSize: 11, color: 'var(--border)', fontStyle: 'italic', marginBottom: 16 }}>
          Sehemu hii inajazwa na Afisa Mikopo na Kamati ya Mkopo pekee.
        </p>

        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 12 }}>
          (a) Maoni ya Afisa Mikopo
        </p>
        <div className="field-grid cols-3">
          <FieldGroup label="Tarehe ya Kupokea Maombi">
            <input type="date" name="tarehe_kupokea" />
          </FieldGroup>
          <FieldGroup label="Kiasi Kilichoombwa">
            <input type="number" name="off_kiasi_kuombwa" placeholder="Tshs" />
          </FieldGroup>
          <FieldGroup label="Kiasi Kilichopendekezwa">
            <input type="number" name="off_kiasi_pendekezwa" placeholder="Tshs" />
          </FieldGroup>
        </div>
        <div className="field-grid cols-3" style={{ marginTop: 14 }}>
          <FieldGroup label="Muda wa Marejesho (Miezi)">
            <input type="number" name="off_muda_miezi" placeholder="Miezi" />
          </FieldGroup>
          <FieldGroup label="Kuanzia Tarehe">
            <input type="date" name="off_tarehe_kuanzia" />
          </FieldGroup>
          <FieldGroup label="Hadi Tarehe">
            <input type="date" name="off_tarehe_hadi" />
          </FieldGroup>
        </div>
        <div className="field-grid cols-2" style={{ marginTop: 14 }}>
          <FieldGroup label="Riba (Tshs)">
            <input type="number" name="off_riba" placeholder="Tshs" />
          </FieldGroup>
          <FieldGroup label="Rejesho la Mwezi (Tshs)">
            <input type="number" name="off_rejesho_mwezi" placeholder="Tshs" />
          </FieldGroup>
        </div>
        <div className="field-grid cols-3" style={{ marginTop: 14 }}>
          <FieldGroup label="Sahihi ya Afisa Mikopo">
            <input type="text" name="off_afisa_sahihi" placeholder="Sahihi…" />
          </FieldGroup>
          <FieldGroup label="Simu ya Afisa">
            <input type="tel" name="off_afisa_simu" placeholder="Simu…" />
          </FieldGroup>
          <FieldGroup label="Tarehe">
            <input type="date" name="off_afisa_tarehe" />
          </FieldGroup>
        </div>

        {/* Kamati */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px dashed var(--border)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 12 }}>
            (b) Maoni ya Kamati ya Mkopo
          </p>
          <div className="field-grid cols-3">
            <FieldGroup label="Kiasi Kilichopitishwa (Tshs)">
              <input type="number" name="kamati_kiasi" placeholder="Tshs" />
            </FieldGroup>
            <FieldGroup label="Tarehe">
              <input type="date" name="kamati_tarehe" />
            </FieldGroup>
            <FieldGroup label="Muda (Miezi)">
              <input type="number" name="kamati_muda" placeholder="Miezi" />
            </FieldGroup>
          </div>
          <div className="field-grid cols-2" style={{ marginTop: 14 }}>
            <FieldGroup label="Riba (Tshs)">
              <input type="number" name="kamati_riba" placeholder="Tshs" />
            </FieldGroup>
            <FieldGroup label="Rejesho la Mwezi (Tshs)">
              <input type="number" name="kamati_rejesho" placeholder="Tshs" />
            </FieldGroup>
          </div>

          <div className="status-checks" style={{ marginTop: 16 }}>
            {[
              { id: 's1', name: 'status_kukubaliwa', label: 'UMEKUBALIWA' },
              { id: 's2', name: 'status_kukataliwa', label: 'UMEKATALIWA' },
              { id: 's3', name: 'status_kuahirishwa', label: 'UMEAHIRISHWA' },
            ].map(s => (
              <div key={s.id} className="status-check">
                <input type="checkbox" id={s.id} name={s.name} />
                <label htmlFor={s.id} style={{ fontSize: 14 }}>{s.label}</label>
              </div>
            ))}
          </div>

          <FieldGroup label="Maoni (Kama Haujakubaliwa)" className="">
            <textarea
              name="kamati_maoni"
              rows={3}
              placeholder="Andika maoni hapa…"
              style={{ resize: 'vertical', marginTop: 14 }}
            />
          </FieldGroup>
        </div>

        {/* Approval table */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px dashed var(--border)' }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--ink-light)', marginBottom: 12 }}>
            Umepitishwa Na:
          </p>
          <table className="data-table">
            <thead>
              <tr>
                <th>Na.</th>
                <th>Jina</th>
                <th>Sahihi</th>
                <th>Cheo</th>
              </tr>
            </thead>
            <tbody>
              {[
                { i: 1, cheo: 'Mwenyekiti wa Chama' },
                { i: 2, cheo: 'Meneja / Katibu wa Chama' },
                { i: 3, cheo: 'M/Kiti Kamati ya Mkopo' },
                { i: 4, cheo: 'Katibu Kamati ya Mkopo' },
                { i: 5, cheo: 'Mjumbe Kamati ya Mkopo' },
              ].map(({ i, cheo }) => (
                <tr key={i}>
                  <th style={{ padding: '8px 10px', background: 'var(--section-bg)' }}>{i}</th>
                  <td><input type="text" name={`ap_jina_${i}`} placeholder="Jina…" /></td>
                  <td><input type="text" name={`ap_sahihi_${i}`} placeholder="Sahihi…" /></td>
                  <td style={{ padding: '8px 10px', fontSize: 12, color: 'var(--ink-light)', background: 'var(--section-bg)' }}>{cheo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="field-grid cols-2" style={{ marginTop: 14 }}>
            <FieldGroup label="Hati ya Malipo Na">
              <input type="text" name="hati_malipo_na" placeholder="…" />
            </FieldGroup>
            <FieldGroup label="Hundi Na">
              <input type="text" name="hundi_na" placeholder="…" />
            </FieldGroup>
          </div>
          <FieldGroup label="Saini ya Mhasibu / Meneja" className="">
            <input type="text" name="saini_mhasibu" placeholder="Saini…" style={{ marginTop: 14 }} />
          </FieldGroup>
        </div>
      </Section>

      {/* ─── SUBMIT ─── */}
      <div className="submit-section">
        <button
          type="submit"
          className="btn-submit"
          disabled={submitting || submitted}
        >
          {submitted ? 'Imewasilishwa ✓' : submitting ? 'Inatuma…' : 'Wasilisha Maombi ya Mkopo'}
        </button>
        <p style={{ fontSize: 12, color: 'var(--border)', marginTop: 12, fontStyle: 'italic' }}>
          Kwa kubonyeza kitufe hiki, unakubali masharti yote ya mkopo huu.
        </p>
      </div>
    </form>
  )
}
