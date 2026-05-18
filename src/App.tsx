import { LoanForm } from './components/LoanForm'
import { Toast } from './components/Toast'

export default function App() {
  return (
    <>
      <Toast />

      <div id="loading-overlay" className="loading-overlay" style={{ display: 'none' }}>
        <div className="loading-spinner" />
        <div className="loading-text">Inapakia...</div>
      </div>

      <div className="page-wrapper">
        {/* ═══ HEADER ═══ */}
        <div className="header">
          <div className="header-ornament">✦ ✦ ✦</div>
          <h1>Chama cha Ushirika na Mikopo</h1>
          <h2>ST. JOHN NJIRO SACCOS LTD</h2>
          <h3>Fomu ya Maombi ya Mkopo</h3>
        </div>

        <LoanForm />

        <div className="page-footer">
          ST. JOHN NJIRO SACCOS LTD &nbsp;·&nbsp; Arusha, Tanzania
        </div>
      </div>
    </>
  )
}
