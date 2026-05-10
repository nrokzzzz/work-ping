# WorkPing Admin Dashboard

The administrative web interface for WorkPing — a workforce management platform. Provides HR and admin staff with complete visibility and control over employees, attendance, leaves, shifts, payroll, and subscriptions.

## Tech Stack

- **Framework**: React 18 + Vite 5
- **Routing**: React Router v6
- **Forms**: React Hook Form + Yup
- **Charts**: ApexCharts, FullCalendar
- **Face Detection**: TensorFlow.js + MediaPipe (for enrollment UI)
- **Maps**: Leaflet (geofencing zones)
- **Styling**: Bootstrap 5 + SASS
- **HTTP**: Axios

## Features

- Employee management (create, update, bulk import via Excel)
- Attendance tracking with face recognition enrollment
- Leave approvals and holiday calendar management
- Shift scheduling with drag-and-drop calendar
- Subscription and billing management
- Real-time analytics dashboards (ApexCharts)
- Geofence zone configuration (Leaflet maps)
- Excel export for reports

## Getting Started

```bash
npm install
cp .env.example .env   # fill in your API base URL
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | URL of the centralized API server |
| `VITE_FACE_API_URL` | URL of the face recognition microservice |

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # preview production build locally
```

## Future Scope

### 🏦 Automated Payment Gateway Integration

- **Monthly Payroll Disbursement** — Integrate with payment gateways (Razorpay, Stripe, PayPal) to automatically transfer monthly salaries and revenue shares directly to employee bank accounts on a configurable schedule.
- **Multi-Currency Support** — Handle payroll disbursements across different currencies for distributed / international teams.
- **Tax & Deduction Automation** — Auto-calculate statutory deductions (PF, ESI, TDS, etc.) before disbursement and generate pay-slips.
- **Reimbursement & Bonus Payouts** — Allow admins to trigger one-time or recurring bonus and reimbursement payments through the same gateway.
- **Payment Audit Trail** — Maintain a tamper-proof ledger of every transaction with timestamps, amounts, and status for compliance and reconciliation.
- **Employee Self-Service Portal** — Let employees view payment history, download pay-slips, and update bank details securely.

### 🌐 Multi-Sector Availability

WorkPing is designed to extend beyond traditional employee workforce management. Planned sector-specific modules include:

| Sector | Use Cases |
|---|---|
| **Healthcare** | Shift scheduling for hospital staff, on-call rotations, overtime compliance, and per-diem payouts. |
| **Education** | Faculty attendance, substitute teacher management, stipend disbursement for research assistants. |
| **Construction & Field Ops** | Geo-fenced attendance for on-site workers, contractor payment milestones, daily-wage auto-settlements. |
| **Retail & Hospitality** | Part-time / gig worker hour tracking, tip pooling & distribution, seasonal workforce scaling. |
| **Freelance & Gig Economy** | Project-based billing, milestone payments, multi-client invoicing, and 1099 / contract compliance. |
| **Government & Public Sector** | Grade-pay structuring, pension calculations, allowance management, and audit-ready reporting. |

### 🔮 Additional Planned Enhancements

- **AI-Powered Payroll Insights** — Predictive analytics for payroll budgeting and anomaly detection in payment patterns.
- **Configurable Approval Workflows** — Multi-level payment approval chains customizable per sector and organization size.
- **Third-Party Accounting Integration** — Sync with Tally, QuickBooks, Zoho Books, and other accounting platforms for seamless bookkeeping.
- **White-Label & Tenant Customization** — Allow each sector or organization to brand the dashboard and tailor modules to their domain.

---

## Related Services

- [workping-api](../centralized-server) — core backend API
- [workping-biometric](../face-api-microservice) — face recognition engine
- [workping-portal](../employees-ui) — employee-facing dashboard
