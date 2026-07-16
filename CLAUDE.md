# CLAUDE.md — hh-document-manager

Đây là tài liệu nội bộ dành cho AI agent (Claude Code, Cowork, hoặc bất kỳ Claude nào). Đọc kỹ trước khi viết bất kỳ dòng code nào.

---

## Mục đích dự án

Web app quản lý hồ sơ xuất nhập khẩu cho một công ty logistics gia đình nhỏ (Việt Nam–Trung Quốc). App tự động hoá việc tạo và lưu trữ ba loại chứng từ thương mại:

- **CT** — Sales Contract (Hợp đồng mua bán)
- **INV** — Invoice (Hoá đơn thương mại)
- **PL** — Packing List (Phiếu đóng gói)

Ngoài ra, app cho phép upload và lưu trữ các chứng từ hải quan khác dưới dạng file (PDF, ảnh...), tổ chức theo lô hàng (shipment), có thể tìm kiếm theo khách hàng, công ty, ngày.

**Hai người dùng:** một ở Việt Nam, một ở Trung Quốc — giao diện cần hỗ trợ 3 ngôn ngữ: Tiếng Việt, Tiếng Trung, Tiếng Anh.

---

## Trạng thái hiện tại (tính đến 2026-07-04)

> **Dự án bắt đầu lại từ đầu.** Dev tự viết để hiểu từng bước, không copy-paste code mẫu.

### ✅ Đã xong

- Next.js project khởi tạo (Next 16.2.9, React 19, TypeScript)
- Tailwind CSS v4 + shadcn/ui cài đặt
- Supabase client setup:
  - `lib/supabase/client.ts` — `createBrowserClient` cho Client Components
  - `lib/supabase/server.ts` — `createServerClient` cho Server Components / Server Actions
  - `lib/supabase/proxy.ts` — `updateSession()` dùng trong Proxy để refresh token
- `proxy.ts` (root) — auth guard: redirect unauthenticated → /login, redirect logged-in away from /login
- Database schema đã chạy trên Supabase, RLS đã bật trên bảng `seller_profile`
- Supabase CLI gen types: `lib/supabase/database.types.ts`
- **i18n** — custom cookie-based, 3 ngôn ngữ (vi/en/cn):
  - `lib/i18n/translations.ts` — group-by-lang dictionary `as const`
  - `lib/i18n/context.tsx` — `LangProvider` + `useLang()` hook, browser detection, cookie persistence
- **Login page** (`app/login/page.tsx`) — react-hook-form + Zod + shadcn/ui, inline lang switcher, password show/hide
- **Dashboard layout** (`app/(dashboard)/layout.tsx`) — MenuBar + ResizablePanelGroup (sidebar 16%) + StatusBar
  - `components/menu-bar.tsx` — File/Edit/View menus, language switcher, account dropdown
  - `components/app-sidebar.tsx` — nav items với i18n, active state dùng `item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)`
  - `components/status-bar.tsx` — shipment count, language display
- **Form components** (`components/form.tsx`) — `FormBase` render-prop pattern, `FormInput`, `FormTextarea`, `className` prop support
- **Seller profile** — hoàn chỉnh:
  - `schemas/seller-profile.ts` — Zod schema
  - `lib/utils/schema.ts` — `getRequiredFields()` helper tự derive required fields từ Zod schema
  - `app/(dashboard)/seller/page.tsx` — server component, fetch data + pass xuống form
  - `app/(dashboard)/seller/seller-profile-form.tsx` — client component, flex-wrap layout, i18n labels, required `*` tự động
  - `app/(dashboard)/seller/actions.ts` — server action: auth check → Zod validate → Supabase update, toast feedback
- **Customer CRUD** — hoàn chỉnh:
  - `schemas/customer.ts` — `customerSchema`, `customerFormSchema`, types
  - `app/(dashboard)/customers/page.tsx` — server component, URL-based pagination `?from=1&to=20`, fuzzy search `?q=...`
  - `app/(dashboard)/customers/customer-table.tsx` — client component, `RangePopover`, debounce search, prefetch, hover action buttons (`invisible group-hover:visible transition-none`)
  - `app/(dashboard)/customers/actions.ts` — `createNewCustomer`, `updateCustomer`, `deleteCustomer`
  - `app/(dashboard)/customers/[id]/page.tsx` — server component, `notFound()` nếu không tìm thấy
  - `app/(dashboard)/customers/[id]/customer-detail.tsx` — client component, `CopyButton`, `Field`, edit dialog
  - `components/customer-dialog.tsx` — `CustomerDialog` (create/edit), `DeleteCustomerDialog` (type tên để confirm)
  - `lib/utils/date.ts` — `formatDate()` dùng `@js-temporal/polyfill`
- **pg_trgm fuzzy search** — đã setup trên Supabase:
  - Extension `pg_trgm` đã bật
  - GIN index trên `customer` (company_name, contact_person, email, address, tax_code)
  - RPC `search_customers(q, p_from, p_to)` — trả về tất cả sorted by similarity, không filter ngưỡng
- **PDF test** — `@react-pdf/renderer` với Noto Sans SC:
  - Font: `public/NotoSansSC-Regular.ttf` + `public/NotoSansSC-Bold.ttf` (static per-weight, không dùng variable font)
  - Hỗ trợ: tiếng Anh + tiếng Việt có dấu + tiếng Trung trong 1 font
  - Test route: `app/api/pdf-test/route.tsx`

### 🔲 Chưa làm

- Shipment creation/editing form
- Explorer page (drill-down filter — xem thiết kế bên dưới)
- PDF templates cho CT, INV, PL
- Upload/lưu trữ file chứng từ (Supabase Storage)
- RLS policies cho các bảng còn lại (customer, shipment, ...)

---

## Stack kỹ thuật

| Lớp | Công nghệ |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | shadcn/ui + Tailwind CSS v4 |
| Forms | react-hook-form + Zod v4 |
| Backend/DB | Supabase (PostgreSQL + Storage) |
| Auth | Supabase Auth |
| Deploy | Vercel |
| Dev machine | MacBook Pro M4 Pro, 24GB RAM |

### Packages đã cài

```json
"dependencies": {
  "@supabase/ssr": "^0.12.0",
  "@supabase/supabase-js": "^2.108.2",
  "next": "16.2.9",
  "react": "19.2.4",
  "zod": "^4.4.3",
  "shadcn": "^4.11.0",
  "radix-ui": "^1.6.0",
  "lucide-react": "^1.21.0",
  "tailwind-merge": "^3.6.0",
  "class-variance-authority": "^0.7.1"
}
```

---

## Cấu trúc thư mục

```
doc-manager-supabase/
├── app/
│   ├── layout.tsx                        # Root layout, LangProvider
│   ├── globals.css
│   ├── login/
│   │   ├── page.tsx                      # Login form (client)
│   │   └── action.ts                     # signInWithPassword server action
│   └── (dashboard)/                      # Route group — không ảnh hưởng URL
│       ├── layout.tsx                    # MenuBar + ResizablePanelGroup + StatusBar
│       ├── action.ts                     # logout server action
│       ├── page.tsx                      # Explorer placeholder
│       └── seller/
│           ├── page.tsx                  # Server component — fetch data
│           ├── seller-profile-form.tsx   # Client component — form UI
│           └── actions.ts                # updateSellerProfile server action
├── components/
│   ├── menu-bar.tsx
│   ├── app-sidebar.tsx
│   ├── status-bar.tsx
│   ├── form.tsx                          # FormBase, FormInput, FormTextarea
│   └── ui/                              # shadcn/ui components
├── lib/
│   ├── utils.ts
│   ├── i18n/
│   │   ├── translations.ts              # Dictionary as const
│   │   └── context.tsx                  # LangProvider + useLang()
│   ├── utils/
│   │   └── schema.ts                    # getRequiredFields()
│   └── supabase/
│       ├── client.ts                    # Browser client
│       ├── server.ts                    # Server client
│       ├── proxy.ts                     # updateSession() cho Proxy
│       └── database.types.ts            # Gen từ Supabase CLI
├── schemas/
│   ├── login.ts
│   └── seller-profile.ts
├── proxy.ts                              # Next.js 16 Proxy (auth guard)
├── CLAUDE.md
└── AGENTS.md
```

---

## Database Schema (Supabase/PostgreSQL)

Schema đã được chạy trên Supabase. Chưa có migration file trong repo.

### Bảng: `seller_profile`

Thông tin bên bán (công ty của người dùng). Thường chỉ có 1 row.

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | uuid PK | |
| company_name_vi | text | |
| company_name_en | text | |
| company_name_cn | text | |
| address_vi | text | |
| address_en | text | |
| address_cn | text | |
| tax_code | text | |
| phone | text | |
| email | text | |
| bank_name | text | |
| bank_account | text | |
| bank_address | text | |
| swift_code | text | |
| authorized_person | text | Người ký hợp đồng |
| position | text | Chức danh |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### Bảng: `customer`

Thông tin khách hàng (bên mua).

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | uuid PK | |
| company_name | text | |
| address | text | |
| contact_person | text | |
| position | text | Chức danh người liên hệ |
| phone | text | |
| email | text | |
| tax_code | text | Mã số thuế |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### Bảng: `shipment`

Một lô hàng / một bộ hồ sơ.

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | uuid PK | |
| doc_number | text NOT NULL | Số bộ hồ sơ, format: ngày-tháng-năm + số thứ tự trong ngày |
| customer_id | uuid FK → customer | |
| contract_date | date | Ngày tạo bộ hồ sơ — dùng cho date filter trong Explorer |
| shipment_date | date | |
| port_of_loading | text | |
| port_of_destination | text | |
| transport_mode | text | sea / air / road |
| payment_terms | text | |
| packing_type | text | |
| shipping_marks | text | |
| status | text | draft / final |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### Bảng: `shipment_item`

Từng mặt hàng trong lô hàng.

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | uuid PK | |
| shipment_id | uuid FK → shipment | |
| item_no | int | Số thứ tự |
| name_en | text | Tên hàng tiếng Anh |
| name_cn | text | Tên hàng tiếng Trung |
| hs_code | text | |
| specification | text | |
| unit | text | pcs / kg / set... |
| quantity | numeric | |
| unit_price_usd | numeric | |
| packing_type | text | carton / bag... |
| num_packages | int | Số kiện |
| nw_kg | numeric | Net weight |
| gw_kg | numeric | Gross weight |
| cbm | numeric | Thể tích (m³) |

### Bảng: `shipment_document`

Chứng từ gắn với một lô hàng — có thể là CT/INV/PL tự động tạo, hoặc file upload thủ công.

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | uuid PK | |
| shipment_id | uuid FK → shipment | |
| doc_type | text | CT / INV / PL / OTHER |
| doc_number | text | Số chứng từ |
| is_auto_generated | boolean | true = sinh từ template, false = upload |
| file_name | text | |
| storage_path | text | Path trong Supabase Storage |
| status | text | draft / final |
| uploaded_at | timestamptz | |

### Mở rộng tương lai: Custom properties cho shipment

Đã cân nhắc thêm custom key-value properties vào mỗi shipment (không giới hạn số lượng). Hai hướng đã xem xét:

- **Bảng riêng (EAV pattern)** — `shipment_property(shipment_id, key, value)`: query được nhưng cần JOIN, phức tạp hơn khi dùng.
- **`jsonb` column** — thêm `custom_properties jsonb DEFAULT '{}'` vào bảng `shipment`: không cần JOIN, PostgreSQL hỗ trợ native (index GIN, query `->>`), đủ dùng cho mục đích display/reference.

**Kết luận:** nếu mở rộng thì dùng `jsonb`. Chỉ chuyển sang bảng riêng nếu cần search/filter theo property thường xuyên hoặc cần lưu lịch sử thay đổi từng property.

---

### Supabase Storage

- Bucket: `documents` (private)
- File path convention: `{shipment_id}/{doc_type}/{file_name}`

---

## Kế hoạch tính năng

### v1 — Core flow

1. Auth: Login / Logout
2. Quản lý khách hàng (CRUD)
3. Tạo lô hàng + nhập hàng hoá
4. Sinh PDF cho CT, INV, PL từ template cố định
5. Xem / download chứng từ theo lô hàng
6. Upload chứng từ thủ công (OTHER)

### v2 — Nâng cao

- Mini HTML template editor (Monaco Editor hoặc CodeMirror) + live preview bằng `<iframe srcDoc>`
- Tìm kiếm / lọc lô hàng theo khách hàng, ngày, trạng thái
- Đa ngôn ngữ UI (VI / ZH / EN)

### PDF Generation (đã quyết định kiến trúc)

- Dùng **`@react-pdf/renderer`** — render phía server (Route Handler), không cần headless Chromium
- Font: **Noto Sans SC** (static per-weight TTF) — cover tiếng Anh + Việt có dấu + Trung trong 1 font
- `renderToBuffer()` trả về `Buffer` → `new Response(new Uint8Array(buffer), { headers: { 'Content-Type': 'application/pdf' } })`
- ⚠️ `@react-pdf` không hỗ trợ variable font (`.ttf` có `wght` axis) — phải dùng static per-weight files từ subfolder `static/`

---

## Thiết kế Explorer — Drill-down Filter

Explorer hiện danh sách `shipment` (bộ hồ sơ), có pagination. Documents là con của shipment.

### URL state

Mỗi filter step là 1 `f` param trên URL, theo thứ tự áp dụng:

```
?f=q:guang&f=customer:uuid1,uuid2&f=date:2026~2027
```

Các loại filter:
- `f=q:text` — fuzzy search trên `doc_number` (pg_trgm)
- `f=customer:uuid1,uuid2` — `customer_id IN (...)`, nhiều uuid cách nhau bởi dấu phẩy
- `f=date:from~to` — `contract_date` trong khoảng, format `YYYY` hoặc `YYYY-MM`

### Logic query

- Các step **AND với nhau**
- Trong 1 step `customer:uuid1,uuid2` → **OR** (IN clause)
- Không có thứ tự bắt buộc giữa các step

### Breadcrumb

Render mỗi `f` param thành 1 breadcrumb item:
```
Explorer > "guang" > Cty A, Cty B > 2026 – 2027
```
- Click `Explorer` → clear hết filter (`?`)
- Click item i → giữ lại `f[0..i]`, bỏ hết sau (truncate)

### File structure (chưa implement)

```
app/(dashboard)/page.tsx              # Server component — parse f params, query shipment + join customer
app/(dashboard)/explorer-table.tsx    # Client component — filter bar, breadcrumb, table
```

---

## Quy tắc & Nguyên tắc

### Về code

- Dev **tự viết code**, Claude chỉ review và giải thích — không tự ý viết hộ toàn bộ file trừ khi được yêu cầu rõ ràng.
- Hỏi kỹ trước khi thêm dependency mới.
- Không dùng `any` trong TypeScript.
- Luôn dùng `createBrowserClient` cho Client Components, `createServerClient` cho Server Components/Actions.

### Về Supabase Auth

- Cookie của Supabase **không** phải HttpOnly — đây là thiết kế có chủ ý, browser client cần đọc token trực tiếp. RLS là lớp bảo mật chính.
- `updateSession()` trong middleware dùng `supabase.auth.getClaims()` để refresh token — **không được xoá dòng này** hoặc đặt code giữa `createServerClient` và `getClaims()`.
- Supabase Auth không hỗ trợ username-based login — chỉ dùng email.

### Về deployment

- Deploy trên **Vercel**.
- User ở Trung Quốc: `*.vercel.app` có thể bị DNS poisoning — cần custom domain trỏ về Vercel.
- Google services (OAuth, Gmail SMTP) **bị block hoàn toàn** tại Trung Quốc — không dùng.

---

## Lưu ý cho Agent

- File `AGENTS.md` ở root project có cảnh báo quan trọng: đây là **Next.js 16** với breaking changes so với các phiên bản cũ hơn. Đọc docs trong `node_modules/next/dist/docs/` nếu không chắc về API nào đó.
- Zod đang dùng **v4** — API có thay đổi so với v3.
- `middleware.ts` **chưa tồn tại** — khi tạo, import `updateSession` từ `lib/supabase/proxy.ts`.
- shadcn/ui components nằm trong `components/ui/`, import bằng `@/components/ui/...`.
