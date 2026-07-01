# Task: Sync Dashboard Codebase to Reconciled Supabase Schema

## Objective
A sibling codebase (the public-facing booking website) was just reconciled to write to a new canonical Supabase schema. This dashboard codebase reads from the SAME Supabase table and almost certainly still references the OLD column names — it will be partially or fully broken until updated. Audit this codebase against the schema below, report every mismatch, then update all data-access code, types, and UI to match.

## Background Context (carry this forward — you have no other source for it)

### What happened upstream
- The website has four booking/enquiry forms: **car rental**, **accommodation**, **activity**, and **airport taxi/transfer**. All four were standardized to submit the same canonical set of fields.
- A Supabase table (`booking.requests` — note: **non-default schema**, the schema is literally named `booking`, not `public`) was reconciled to match. Columns were **renamed** (not dropped/recreated) to preserve data, and **new columns were added**.
- The table was emptied of stale test/seed data as part of this migration (intentional, approved) — do not worry about migrating old rows, only about reading/writing the new shape going forward.
- **The website side is already fully updated and tested end-to-end** (verified real inserts land correctly for all 4 form types). This dashboard is the only remaining piece that needs updating.

### Connecting to the right schema
Because the table lives in the `booking` Postgres schema, not `public`, the Supabase client must be initialized with that schema, e.g.:
```ts
createClient(url, anonKey, { db: { schema: "booking" } })
```
If this dashboard's Supabase client currently defaults to `public` (no `db.schema` option, or `schema: "public"`), that is itself a bug to fix — confirm and correct it. If using raw REST/PostgREST calls instead of `supabase-js`, note that **reads** need an `Accept-Profile: booking` header and **writes** (insert/update/delete) need a `Content-Profile: booking` header — these are different headers for different verbs in PostgREST, easy to get wrong.

### Canonical column reference for `booking.requests`

| Column | Type | Nullable | Old name (if renamed) | Notes |
|---|---|---|---|---|
| `id` | uuid | NO | — (untouched, PK) | **do not touch** |
| `full_name` | text | NO | was `customer_name` | |
| `email` | text | NO | was `customer_email` | |
| `phone` | text | NO | was `customer_phone` | |
| `adults` | integer | NO | new column | |
| `children` | integer | NO | new column | |
| `start_date` | date | NO | was `requested_date` | present for every form type |
| `end_date` | date | **YES (nullable)** | new column | **NULL when `form_type` is `activity` or `transfer`** — those two forms never collect a return/end date. Always populated for `rental` and `accommodation`. |
| `message` | text | NO (can be empty string `""`) | new column | free-text note from the customer. **Special case:** when `form_type = 'transfer'`, the website's form repurposes this same field to collect flight details (flight number, arrival/departure time) — there is no separate `flight_details` column. Label/display it accordingly when `form_type === 'transfer'` (e.g. "Flight Details" instead of "Message"/"Notes"). |
| `form_type` | text | NO | new column | discriminator, one of exactly: `"rental"` \| `"accommodation"` \| `"activity"` \| `"transfer"`. Note: `"transfer"` is the internal value for the airport taxi form — if the dashboard UI currently says "taxi" anywhere, that's just a display label choice, the stored value is `"transfer"`. |
| `activity_name` | text | NO | unchanged name, untouched | **misleading name** — despite being called `activity_name`, this column holds the item name for ALL form types (car model for rentals, property name for accommodation, activity name, or transfer route name). Do not rename it (out of scope), but be aware of what it actually contains when displaying it. |
| `party_size` | integer | NO | unchanged, untouched | legacy aggregate = `adults + children`, still populated for backward compatibility. Prefer displaying `adults`/`children` separately now that they exist, but don't remove this column. |
| `status` | text | NO, default `'pending_review'` | unchanged | workflow status — do not infer new values, audit what this dashboard already does with it |
| `reference` | text | YES | unchanged | back-office-assigned, untouched |
| `activity_ref` | text | YES | unchanged | back-office-assigned, untouched |
| `deposit_amount` / `balance_amount` / `total_amount` | numeric | YES | unchanged | untouched |
| `deposit_paid` / `balance_paid` | boolean | NO, default `false` | unchanged | untouched |
| `approved_by` / `approved_at` | — | YES | unchanged | untouched |
| `created_at` / `updated_at` | timestamptz | NO, default `now()` | unchanged | **do not touch** |

### The four form types and their display nuances
| `form_type` | Has `end_date`? | `message` field meaning |
|---|---|---|
| `rental` | yes | general notes/special requests |
| `accommodation` | yes | general notes/special requests |
| `activity` | **no (always NULL)** | general notes/special requests |
| `transfer` | **no (always NULL)** | **flight details** (flight number, arrival/departure time) — display with that label, not as a generic "message" |

## Execution Phases — DO IN ORDER

### Phase 1 — Audit (report only, NO edits yet)
1. Locate the Supabase client initialization in this codebase. Report its current schema config (is it pointed at `public` or `booking`? does it need fixing?).
2. Grep the entire codebase for every Supabase query/read/write touching the requests table (`.from('requests')` or equivalent, raw REST calls, GraphQL if applicable) and every reference to the old column names: `customer_name`, `customer_email`, `customer_phone`, `requested_date`.
3. Find every TypeScript type/interface modeling this table's rows and list which fields are stale, missing (`adults`, `children`, `end_date`, `message`, `form_type`), or misnamed.
4. Find every UI component that renders these rows (tables, cards, detail views, filters, exports) and note what they currently display and what's missing (no per-type display logic likely exists yet for `end_date`-less types or the transfer flight-details nuance).
5. Produce a report: **old reference → file/line → required new reference**, before changing anything. Stop and present this audit before proceeding to Phase 2 if anything looks structurally surprising (e.g., a second/different table than `booking.requests`, additional schemas, or column names that don't match what's described above) — otherwise proceed directly.

### Phase 2 — Update Data-Access Layer & Types
6. Fix the Supabase client schema config if it's wrong.
7. Update every query to use the new column names (`full_name`, `email`, `phone`, `start_date`, plus the new `adults`, `children`, `end_date`, `message`, `form_type`).
8. Update/extend TypeScript types to include all new fields with correct nullability (`end_date: string | null`, everything else required per the table above).
9. Update any write paths (status updates, approvals, edits) to read/write the correct column names — do not change the semantics of `status`, `reference`, `activity_ref`, `deposit_*`, `approved_*` workflows, only the column names they're keyed alongside.

### Phase 3 — Update Display Logic
10. Ensure every view that lists/details a request displays `adults` and `children` as separate values (not just the legacy combined `party_size`), `full_name`/`email`/`phone` under their new field names, and `start_date` correctly labeled.
11. Conditionally render `end_date` only when non-null — don't show an empty/blank "End Date" field for `activity` and `transfer` rows.
12. Add a `form_type` badge/label/column so all four types are distinguishable in any list view, with a human-readable label (e.g. `rental` → "Car Rental", `accommodation` → "Accommodation", `activity` → "Activity", `transfer` → "Airport Transfer" or "Taxi" per your existing UI vocabulary).
13. For rows where `form_type === 'transfer'`, label the `message` field as flight details, not as a generic message/notes field.
14. Ensure all four form types actually surface in whatever list/filter UI exists (don't let any type silently fall through a switch/if-chain that only handles a subset).

### Phase 4 — Verify Against Live Data
15. Connect to the live `booking.requests` table (`booking` schema) and confirm the dashboard now reads real rows without errors using the new column names.
16. If possible, exercise create/update/approval flows the dashboard owns and confirm they write back using correct column names without violating the `NOT NULL` constraints on `full_name`, `email`, `phone`, `adults`, `children`, `start_date`, `message`, `form_type`.
17. Report a final summary: file-by-file list of what changed, confirmation that all four `form_type` values render correctly, and confirmation that `end_date`-null rows don't show broken/empty UI.

## Constraints
- Do NOT touch `id`, `reference`, `activity_ref`, `deposit_amount`/`balance_amount`/`total_amount`, `deposit_paid`/`balance_paid`, `approved_by`/`approved_at`, `created_at`, `updated_at` — these are untouched by the upstream migration and out of scope here too.
- Treat the schema table above as source of truth — do not guess additional columns exist, and do not invent new ones beyond what's listed.
- Preserve existing dashboard styling, layout, and UX patterns — this is a data-contract sync, not a redesign. Only change what the renamed/new columns force you to change.
- If you find a second table, a different schema, or column names that contradict this document, STOP and report the discrepancy rather than guessing which is authoritative.
- Do not weaken or remove existing `status`/approval workflow logic — only fix the column names it depends on if they changed.
