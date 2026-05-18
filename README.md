# ST. JOHN NJIRO SACCOS — Fomu ya Maombi ya Mkopo

Loan application form for St. John Njiro SACCOS Ltd, built with **React + TypeScript + Vite** and backed by **Supabase**.

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/saccos-mkopo.git
cd saccos-mkopo
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

> **⚠ Never commit `.env.local` to Git.** It is already in `.gitignore`.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
saccos-mkopo/
├── src/
│   ├── components/
│   │   ├── LoanForm.tsx       # Main form — all 6 sections
│   │   ├── GuarantorCard.tsx  # Reusable guarantor section
│   │   ├── SignaturePad.tsx   # Canvas signature component
│   │   ├── Toast.tsx          # Notification toasts
│   │   └── ui.tsx             # FieldGroup, Section, ReadonlyDisplay
│   ├── hooks/
│   │   └── useSignaturePad.ts # Canvas drawing logic
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client (reads from env vars)
│   │   └── utils.ts           # Helpers
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── .env.example               # Template — copy to .env.local
├── .gitignore                 # .env.local is excluded
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🗄️ Supabase Tables Required

### `users`
| Column | Type |
|--------|------|
| id | int8 (PK) |
| jina_kamili | text |
| namba_mwanachama | text |
| simu | text |
| anuani_posta | text |
| kata | text |
| mtaa | text |
| namba_nyumba | text |

### `loan_applications`
All fields in `LoanPayload` type (see `src/lib/supabase.ts`).

---

## 🌐 Deploy to Vercel (Recommended)

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "initial commit"
   git push origin main
   ```

2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo

3. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` → your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` → your anon key

4. Click **Deploy** — done!

### URL pattern for applicants
```
https://your-app.vercel.app/?id=MEMBER_ID
```

---

## 🌐 Deploy to Netlify (Alternative)

1. Go to [netlify.com](https://netlify.com) → **New site from Git**
2. Connect your GitHub repo
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add environment variables in **Site settings → Environment variables**

---

## 🔐 Security Notes

- Supabase keys are stored in environment variables, **never hardcoded**
- The `VITE_SUPABASE_ANON_KEY` is a public key designed for browser use — Supabase RLS (Row Level Security) should be enabled on your tables for production
- Recommended: Enable RLS and add policies so only authenticated users can insert loan applications

---

## 🛠 Build for production

```bash
npm run build
# Output is in /dist
```
