# ============================================================
# MIMIR — FRONTEND (Next.js + React + Tailwind)
# ============================================================

@AGENTS.md

# ⚠️ Root integration rules ada di ../CLAUDE.md — baca untuk cross-project tasks.

# ============================================================

# 🏆 PERFORMANCE & UX FIRST
# Performance IS user experience. Setiap millisecond loading, setiap frame drop, setiap unnecessary re-render adalah friksi yang membuat user pergi.
# **Prinsip: UX adalah performa. Performa adalah UX.**

## Target Metrics
| Metric | Target | Alat Ukur |
|--------|--------|-----------|
| First Contentful Paint (FCP) | <1.5s | Lighthouse / Web Vitals |
| Largest Contentful Paint (LCP) | <2.5s | Lighthouse / Web Vitals |
| Interaction to Next Paint (INP) | <200ms | Web Vitals |
| Cumulative Layout Shift (CLS) | <0.1 | Web Vitals |
| Time to Interactive (TTI) | <3.5s | Lighthouse |
| Bundle size per page | <100KB (gzipped) | `next/bundle-analyzer` |
| API response render | <100ms dari data sampai DOM | React DevTools |

---

## TECH STACK

| Layer          | Tech                              |
|---------------|-----------------------------------|
| Framework     | Next.js 16.2 (App Router)         |
| UI Library    | React 19.2                        |
| Language      | TypeScript 5 (strict)             |
| Styling       | Tailwind CSS v4                   |
| Bundler       | Turbopack (dev) / Webpack (build) |
| Compiler      | React Compiler (babel-plugin)     |
| Linting       | ESLint 9 + eslint-config-next     |
| Design System | Yggdrasil (lihat ../DESIGN.md)    |

---

# ⚠️ THIS IS NOT THE NEXT.JS YOU KNOW

Next.js 16 dan React 19 memiliki breaking changes signifikan.

## React 19 — Yang Berubah

- **React Compiler aktif** — jangan gunakan `useMemo`/`useCallback`/`React.memo` secara manual kecuali profiling membuktikan perlu. Compiler menangani memoization otomatis.
- **`use()` Hook baru** — baca Promise/Context langsung di render: `const data = use(promise)`. Alternatif lebih bersih dari `useEffect` + `useState` untuk data fetching.
- **`useActionState()`** — gantikan `useFormState` untuk form actions.
- **`useOptimistic()`** — untuk optimistic updates di form.
- **Server Components by default** — hanya file dengan `"use client"` yang Client Components.
- **`ref` sebagai prop langsung** — tidak perlu `forwardRef` lagi.
- **`use()` untuk Context** — `use(Context)` lebih pendek dari `useContext(Context)`.

## Next.js 16 — Yang Berubah

- **`generateMetadata`** — cara standar untuk metadata dinamis (bukan `Head`/`NextSeo`).
- **`<Image>`** — width/height wajib atau `fill` dengan `sizes`.
- **`<Link>`** — tidak perlu `<a>` child, render `<a>` langsung.
- **`loading.js`** + **`error.js`** — file-based loading/error boundaries per segment.
- **Route Handlers** — `app/api/route.ts` untuk API, bukan `pages/api/`.
- **Server Actions** — `"use server"` di function/action file untuk form submission.
- **`next.config.ts`** — TypeScript config file.

---

# ARCHITECTURE PATTERNS

## Directory Structure

```
src/
├── app/                     → App Router pages & layouts
│   ├── (auth)/              → Route group: auth pages
│   ├── dashboard/           → Dashboard pages
│   ├── forms/               → Form CRUD pages
│   ├── api/                 → Route handlers (if needed)
│   ├── layout.tsx           → Root layout
│   └── globals.css          → Global styles + Yggdrasil tokens
├── components/              → Shared UI components
│   ├── ui/                  → Base components (Yggdrasil)
│   └── features/            → Feature-specific components
├── lib/                     → Utilities, API client, helpers
├── types/                   → Shared TypeScript types
└── hooks/                   → Custom React hooks
```

## Component Patterns

### 🏆 Server Component First — ALWAYS
**Default adalah Server Component.** Hanya tambah `"use client"` jika benar-benar perlu:
- Event handlers (`onClick`, `onSubmit`)
- Hooks (`useState`, `useEffect`, `use` di client context)
- Browser-only APIs
- **Server Component = zero JS yang dikirim ke client, render lebih cepat.**

```typescript
// ✅ SERVER COMPONENT — optimal, zero client JS
async function FormList() {
  const forms = await fetch(`${API_URL}/forms`).then(r => r.json())
  return <FormListClient forms={forms} />
}

// ✅ CLIENT COMPONENT — minimal, hanya untuk interaktivitas
'use client'
import { use } from 'react'
function FormDetail({ formsPromise }: { formsPromise: Promise<Form[]> }) {
  const forms = use(formsPromise)
  return ...
}
```

### Data Fetching — Prioritaskan Server

| Approach | Performa | Kapan Pakai |
|----------|----------|-------------|
| **Server Component async** | 🏆 Terbaik — zero client JS, streaming | Default untuk semua data fetching |
| **`use()` + Promise passing** | ✅ Baik — avoid waterfall | Client Component yang butuh data |
| **Server Actions** | ✅ Baik — form submission | Mutasi data dari form |
| **`useEffect` + fetch** | ❌ Hindari — waterfall + loading state manual | Hanya jika tidak ada alternatif |

### UX States — Handle SEMUA kondisi

Setiap component yang menampilkan data WAJIB handle:

```
loading → Skeleton loader (bukan spinner circular)
empty   → Placeholder dengan ilustrasi + CTA
error   → Error boundary atau pesan error + retry button
success → Data ditampilkan dengan optimal
```

### File colocation — komponen di folder fiturnya, bukan flat.
### One component = one file — jangan export multiple components dari 1 file.

---

# 🏆 THIN CLIENT — NO BUSINESS LOGIC

**Frontend adalah thin client.** Zero business logic, zero computation, zero data processing. Semua perhitungan, kalkulasi, validasi, transformasi data, dan logika bisnis **hanya di backend**.

## Prinsip

```
Frontend = display + interaction only
Backend  = all business logic, calculations, data processing, validation
```

```typescript
// ❌ SALAH — kalkulasi di frontend
function OrderTotal({ items }: { items: CartItem[] }) {
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)  // 🔴 hitungan di FE
  const tax = total * 0.11
  return <p>Total: {total + tax}</p>
}

// ✅ BENAR — backend yang hitung, FE hanya tampilkan
async function OrderTotal() {
  const { total, tax } = await getOrderSummary()  // Backend returns { total, tax }
  return <p>Total: {total + tax}</p>
}
```

## Aturan

| Aturan | Penjelasan |
|--------|-----------|
| **NO perhitungan** | Jumlah, rata-rata, diskon, pajak, statistik → backend |
| **NO transformasi data** | Mapping, filtering, sorting data → backend |
| **NO validasi bisnis** | Duplicate check, quota, status transition → backend |
| **NO format konversi** | Tanggal, mata uang, unit → backend kirim format siap tampil |
| **NO aggregasi** | Group by, count, sum, average → SQL/backend |
| **Error dari backend** | Pesan error langsung dari response API, ditampilkan mentah |

## Error Handling — Display Only

```typescript
// ✅ BENAR — pesan error langsung dari backend, ditampilkan verbatim
async function FormPage() {
  try {
    const { data: form } = await getForm(id)   // envelope → ambil .data
    return <FormView form={form} />
  } catch (err) {
    if (err instanceof ApiError) {
      return <ErrorState message={err.message} />   // ← err.message dari backend
    }
    return <ErrorState message="Terjadi kesalahan. Silakan coba lagi." />
  }
}

// ❌ SALAH — frontend generate pesan error sendiri
catch (err) {
  let message = "Gagal memuat form"
  if (err.status === 404) message = "Form tidak ditemukan"    // 🔴 jangan
  if (err.status === 500) message = "Server sedang sibuk"     // 🔴 jangan
  return <ErrorState message={message} />
}
```

## Konsekuensi

- **Bundle lebih kecil** — tidak perlu library math/formatting/validation
- **Zero logic bugs di frontend** — semua logika di satu tempat (backend)
- **Source of truth tunggal** — tidak ada duplikasi logic FE vs BE
- **API response = UI state** — apa yang dikirim backend, itu yang ditampilkan
- **Mudah diganti frontend** — backend sudah handle semuanya

---

# 🏆 RE-RENDER PREVENTION — NON-NEGOTIABLE

Setiap unnecessary re-render adalah performa yang terbuang. Dengan React 19 + React Compiler, sebagian besar di-handle otomatis — yang perlu dikontrol adalah **pola arsitektural**, bukan micro-optimizations.

## Prinsip Dasar

```
Hierarki Pencegahan Re-render (dari paling efektif):
1. Server Component      → zero JS = zero re-render ← PALING EFEKTIF
2. State colocation      → state di komponen yang paling membutuhkan
3. Component splitting   → pisahkan bagian yang berubah vs tidak
4. Context splitting     → context kecil-kecil, jangan context raksasa
5. Stable props          → jangan buat object/array baru setiap render
6. React Compiler        → automatisasi sisanya ← JANGAN override manual
```

## 1. Server Component = Zero Re-render

**Server Component adalah senjata #1 anti re-render.** Komponen di-render sekali di server, hasilnya HTML dikirim ke client. Tidak ada hydration, tidak ada re-render, zero JS.

```typescript
// ✅ SERVER COMPONENT — zero re-render selamanya. Tidak perlu optimasi apapun.
// Langsung fetch data, langsung render. Tidak ada lifecycle.
async function FormList() {
  const forms = await fetchForms()
  return (
    <div>
      {forms.map(f => <FormCard key={f.id} form={f} />)}
    </div>
  )
}
```

**Strategi:**
- **Maximalkan Server Components.** Semua data fetching dan rendering default di server.
- **Client Components hanya lapisan tipis** di atas data dari server — untuk interaktivitas minimal.

## 2. State Colocation — State di Tempat yang Tepat

State harus sedekat mungkin dengan komponen yang menggunakannya. **Jangan lift state up tanpa alasan.**

```typescript
// ❌ SALAH — state di parent, meskipun hanya child yang butuh
function ParentPage() {
  const [isOpen, setIsOpen] = useState(false)  // 🔴 Hanya dipakai oleh Modal
  return (
    <main>
      <Header />
      <Content />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </main>
  )
  // 🔴 Setiap toggle Modal → Header dan Content ikut re-render!
}

// ✅ BENAR — state di komponen yang paling membutuhkan
function ParentPage() {
  return (
    <main>
      <Header />
      <Content />
      <ModalWrapper />   {/* State disembunyikan di sini */}
    </main>
  )
}

function ModalWrapper() {
  const [isOpen, setIsOpen] = useState(false)
  return <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
  // ✅ Hanya ModalWrapper yang re-render saat toggle
}
```

### Aturan State Colocation
```typescript
// ✅ State di sini — hanya Select yang perlu
function Select<T extends string>({ options }: { options: T[] }) {
  const [selected, setSelected] = useState<T>(options[0])
  return <select onChange={e => setSelected(e.target.value as T)}>...</select>
}

// ✅ Bawa state turun — jangan di parent
function QuestionEditor() {
  const [isPreview, setIsPreview] = useState(false)  // ✅ hanya dipakai di sini
  return isPreview ? <Preview /> : <Editor />
}
```

## 3. Component Splitting — Pisahkan yang Berubah vs Tidak

Jika satu bagian kecil berubah, jangan re-render seluruh komponen besar.

```typescript
// ❌ SALAH — typing di input menyebabkan seluruh Dashboard re-render
function Dashboard() {
  const [search, setSearch] = useState("")
  return (
    <div>
      <SearchInput value={search} onChange={setSearch} />
      <Sidebar />
      <ExpensiveChart />        // 🔴 Re-render setiap ketik!
      <DataTable data={data} /> // 🔴 Re-render setiap ketik!
    </div>
  )
}

// ✅ BENAR — search state di-isolate
function Dashboard() {
  return (
    <div>
      <SearchBox />             // State di dalam sini
      <Sidebar />
      <ExpensiveChart />
      <DataTable data={data} />
    </div>
  )
  // ✅ SearchBox re-render sendiri tanpa menyentuh komponen lain
}

function SearchBox() {
  const [search, setSearch] = useState("")
  return <SearchInput value={search} onChange={setSearch} />
}
```

## 4. Context Splitting — Jangan Context Raksasa

Context yang berubah-ubah menyebabkan **semua consumer** re-render.

```typescript
// ❌ SALAH — satu context untuk semuanya
interface AppContext {
  user: User
  theme: 'light' | 'dark'
  notifications: Notification[]
}
// 🔴 Theme berubah → user + notification consumers ikut re-render

// ✅ BENAR — split context by frequency of change
const ThemeContext = createContext<'light' | 'dark'>('light')     // Jarang berubah
const UserContext = createContext<User | null>(null)              // Per login saja
const NotificationContext = createContext<Notification[]>([])     // Frekuen
// ✅ Theme berubah → hanya theme consumer yang re-render
```

### Aturan Context
1. **Split berdasarkan frekuensi perubahan** — jarang (theme, lang) vs sering (notifications, form state)
2. **Nilai stabil** — jangan buat object/array baru setiap render di value provider
3. **`use(Context)`** — lebih pendek dan performanya sama

## 5. Stable Props & Keys

### Props — Jangan Buat Object/Array Baru Setiap Render

```typescript
// ❌ SALAH — object baru setiap render
function UserForm() {
  return <Input config={{ label: "Name", required: true }} />
  // 🔴 config adalah object baru → optimasi React Compiler jadi tidak optimal
}

// ✅ BENAR — referensi stabil
const INPUT_CONFIG = { label: "Name", required: true } as const
function UserForm() {
  return <Input config={INPUT_CONFIG} />
}
```

### Keys — WAJIB Stabil dan Unik

```typescript
// ❌ SALAH — index sebagai key
{items.map((item, i) => <Item key={i} data={item} />)}
// 🔴 Index berubah saat list berubah → semua item re-render + state hilang!

// ✅ BENAR — unique ID
{items.map(item => <Item key={item.id} data={item} />)}
```

## 6. React Compiler — Percayakan, Jangan Override

```typescript
// 🟢 REACT COMPILER — otomatis memoisasi komponen, hook, dan derived values
// ❌ TIDAK PERLU — compiler handles this
const memoized = useMemo(() => expensive(a, b), [a, b])
const handleClick = useCallback(() => doThing(id), [id])
const MemoizedComponent = React.memo(MyComponent)
```

**KAPAN override manual diperlukan?**
Hanya jika profiling (React DevTools — Components tab → Profiler) membuktikan:
- Komponen masih re-render padahal props tidak berubah
- Komponen masih re-render padahal state/tidak relevan
- Override: tambahkan `React.memo()` atau stabilkan props

## 7. Profiling — Cara Debug Re-render

```bash
# 1. Buka React DevTools
# 2. Components tab → Settings → Highlight updates when components render
#    → Lihat komponen mana yang re-render

# 3. Profiler tab → Record interaction
#    → Lihat flamegraph: komponen mana yang paling lama + paling sering re-render
```

### Re-render Red Flags
| Tanda | Penyebab | Fix |
|-------|----------|-----|
| **Komponen tinggi di tree re-render** | State terlalu high | State colocation |
| **Sibling ikut re-render** | Context berubah atau state di parent | Context splitting / component splitting |
| **List items re-render semua** | Key pakai index atau props tidak stabil | Keys stabil + props stabil |
| **Komponen berat re-render sering** | Tidak dipisah dari state yang berubah | Component splitting |
| **Seluruh halaman re-render** | Layout component punya state | Extract state ke child |

---

# 🏆 FRONTEND PERFORMANCE CHECKLIST

## Setiap commit WAJIB dicek:

### Re-render Prevention
- [ ] Server Component sebisa mungkin? (zero re-render)
- [ ] State di-colocate di komponen yang paling membutuhkan? (cek setiap `useState`)
- [ ] Komponen dipisah antara yang berubah vs tidak? (cek `useState` di parent yang tidak perlu)
- [ ] Context di-split by frequency of change?
- [ ] Props stabil — tidak ada object/array baru per render?
- [ ] `key` pakai unique ID, bukan index?
- [ ] Tidak ada `useMemo`/`useCallback` defensif? (React Compiler handles it)
- [ ] List >50 items pake virtualisasi?

### Thin Client — No Business Logic
- [ ] Zero business logic di frontend? Semua kalkulasi/validasi/transformasi di backend?
- [ ] Error messages langsung dari backend, ditampilkan verbatim?
- [ ] Tidak ada generate/override/translate pesan error di FE?
- [ ] Format data (tanggal, mata uang, dll) dikirim siap pakai dari backend?

### Bundle & Network
- [ ] Tidak ada barrel imports (`import { X } from '@/components'`)
- [ ] Lazy-load untuk komponen berat (dialog, chart, rich text editor)
- [ ] `next/image` untuk semua gambar (optimasi otomatis)
- [ ] Tidak ada library besar tanpa tree-shaking
- [ ] Font di-load via `next/font` (bukan CSS `@import`)

### UX
- [ ] Skeleton loading untuk semua halaman/data lists
- [ ] Empty state dengan ilustrasi dan CTA yang jelas
- [ ] Error boundary di setiap segment route (`error.js`)
- [ ] Loading boundary di setiap segment route (`loading.js`)
- [ ] Keyboard navigasi works untuk semua interactive element
- [ ] Focus management yang jelas untuk modal/dialog

### Yggdrasil Compliance
- [ ] UI mengacu ke `../DESIGN.md`? (token, spacing, font, radius, elevasi)
- [ ] Tidak ada hex hardcode — semua warna pakai CSS variables?
- [ ] Spacing pakai scale `var(--space-*)` bukan nilai random?
- [ ] Font sesuai role (Outfit display, Inter body, Geist Mono data)?
- [ ] Komponen pakai radius dari scale `var(--radius-*)`?
- [ ] Shadow pakai `var(--elevation-*)`?
- [ ] Dark mode `[data-theme="dark"]` didukung?
- [ ] Tidak ada file CSS custom? (hanya Tailwind utility + CSS variables)
- [ ] Tidak ada native browser UI? (`<select>` bawaan, `alert()`, `confirm()`, `prompt()` → wajib komponen Yggdrasil)

### Metrics
- [ ] Bundle size per page <100KB gzipped?
- [ ] Lighthouse Performance score >90?
- [ ] Tidak ada render-blocking resources?
- [ ] `next build` selesai tanpa warning?

---

# CODING STANDARDS (NON-NEGOTIABLE)

Aturan universal (NO `any`, NO comments, NO derived state, NO useEffect untuk
derived data, NO God components, handle ALL states, thin-client/no business logic,
error dari backend verbatim, naming lintas-bahasa) adalah **satu sumber** di
`../rules/coding-principles.md`. WAJIB baca di sana. Yang di bawah **hanya**
tambahan spesifik Next.js/React yang TIDAK universal:

| Rule | Detail |
|------|--------|
| **NO native browser UI** | WAJIB — jangan pernah pakai `<select>` bawaan browser, `alert()`, `confirm()`, `prompt()`, atau `<dialog>` polos. Gunakan komponen Yggdrasil sendiri: dropdown → `components/ui/select-field.tsx` (popup animasi + search), notifikasi/konfirmasi → komponen alert/dialog custom sesuai DESIGN.md |
| **NO barrel imports** | Import directly from file, not `index.ts` re-exports |
| **NO useEffect for derived data** | Compute inline, use `use()` for promises (React 19) |
| **`"use client"` di file terpisah** | Jangan gabung server & client logic di file yang sama |
| **UI WAJIB berdasarkan DESIGN.md** | Semua komponen, token, spacing, font, warna dari Yggdrasil |
| **NO custom CSS files** | Tailwind utility classes + CSS variables dari DESIGN.md |

## Naming (Next.js/React-specific — universal di `../rules/coding-principles.md`)

| Item | Convention | Example |
|------|-----------|---------|
| Files | Match export | `form-builder.tsx` → `FormBuilder` |
| CSS classes | Tailwind utility classes | Avoid custom CSS files |

---

# 🏆 YGGDRASIL DESIGN SYSTEM — WAJIB

**Setiap pembuatan UI / slicing WAJIB berdasarkan `../DESIGN.md`.**
Tidak boleh membuat komponen, warna, spacing, tipografi, atau style apapun di luar yang sudah didefinisikan di DESIGN.md.

## Aturan Wajib

| Aturan | Penjelasan |
|--------|-----------|
| **Baca DESIGN.md dulu** | Sebelum buat komponen apapun, baca DESIGN.md untuk token dan pattern yang tersedia |
| **WAJIB pakai token CSS** | `var(--bg-base)`, `var(--text-primary)`, `var(--brand-default)` — jangan hardcode hex |
| **WAJIB pakai spacing scale** | `var(--space-4)` sampai `var(--space-64)` — jangan nilai random |
| **WAJIB pakai font yang ditentukan** | Outfit (display/heading) + Inter (body/label) + Geist Mono (data) |
| **WAJIB pakai radius scale** | `var(--radius-md)`, `var(--radius-lg)`, dll — jangan nilai random |
| **WAJIB ikut elevasi system** | `var(--elevation-0)` sampai `var(--elevation-4)` — jangan shadow custom |
| **WAJIB dukung dark mode** | Semua komponen harus berfungsi di `[data-theme="dark"]` |
| **NO custom CSS** | Tailwind utility classes + CSS variables dari DESIGN.md — tidak ada file CSS sendiri |

## Prinsip Utama

- **Forged, not fabricated** — tiap elemen terasa kokoh
- **Sparse is sacred** — ruang kosong bukan kekosongan
- **One root, nine expressions** — satu bahasa visual untuk semua produk

## Tailwind Integration

Yggdrasil tokens diimplementasikan via Tailwind v4 CSS custom properties di `globals.css`:

```css
@theme {
  --color-ink: #1a1a2e;
  --color-parchment: #f5f0e8;
  --color-brass: #c9a84c;
  --color-rune: #3a3a5c;
  --color-rust: #8b4513;
  --color-ice: #e0e7ff;
  --color-frost: #a8c8e8;
  --color-ember: #ff6b35;
  --color-shadow: #0d0d1a;
}
```

- Dark mode via `[data-theme="dark"]` di `<html>` (bukan `prefers-color-scheme`)
- Spacing scale: 0.25rem base → `--space-xs` through `--space-3xl`

---

# API CLIENT PATTERN

Semua panggilan ke backend Go melalui service layer:

Response backend memakai envelope tunggal (lihat `../backend/CLAUDE.md` → *Response
Format* dan root `SECTION 4`). Type client HARUS field-by-field cocok dengan envelope
itu — `NO any` (lihat `../rules/coding-principles.md`), semua field eksplisit.

```typescript
// types/api.ts — envelope tunggal untuk SEMUA response
export interface ApiEnvelope<T> {
  data: T | null
  message: string | null
  error: { code: string; details: unknown } | null
}

// list endpoint: envelope + blok pagination terpisah
export interface PaginatedEnvelope<T> extends ApiEnvelope<T> {
  pagination: { total: number; page: number; page_size: number }
}

// lib/api-client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly code: string | null = null) {
    super(message)
  }
}

export async function apiGet<E extends ApiEnvelope<unknown>>(path: string): Promise<E> {
  const res = await fetch(`${BASE_URL}${path}`)
  const body = (await res.json()) as E
  if (!res.ok || body.error) {
    throw new ApiError(body.message ?? res.statusText, res.status, body.error?.code ?? null)
  }
  return body
}

// types/form.ts
export interface Form {
  id: string
  title: string
  created_at: string
  questions?: Question[]
}

// lib/forms.ts — list endpoint → PaginatedEnvelope, akses via .data / .pagination
export function getForms(): Promise<PaginatedEnvelope<Form[]>> {
  return apiGet<PaginatedEnvelope<Form[]>>('/api/v1/forms')
}

// detail endpoint → ApiEnvelope (tanpa pagination)
export function getForm(id: string): Promise<ApiEnvelope<Form>> {
  return apiGet<ApiEnvelope<Form>>(`/api/v1/forms/${id}`)
}
```

Karena `data` bisa `null` saat error, consumer WAJIB akses lewat `.data` (dan
`.pagination` untuk list), bukan menganggap seluruh response sebagai payload.

---

# LOCAL DEVELOPMENT

```bash
cd frontend
npm run dev          # → http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint check
tsc --noEmit         # TypeScript check (strict)
```

---

# REACT COMPILER NOTES

React Compiler otomatis memoisasi komponen dan hook. **Jangan tambahkan memo/useMemo/useCallback secara defensif.**
Hanya tambahkan jika profiling (React DevTools) membuktikan ada bottleneck nyata.

```typescript
// ❌ TIDAK PERLU — compiler handles this
const memoized = useMemo(() => expensive(a, b), [a, b])
const handleClick = useCallback(() => doThing(id), [id])

// ✅ Langsung saja
const value = expensive(a, b)
function handleClick() { doThing(id) }
```
