# ABP Offboarding Clearance Application — Knowledge Document

## What Is This Application?

This is an **SAP UI5 / Fiori** web application used internally by **ABP Group** (Ananda Bazar Patrika / ABP News media group) for processing **employee offboarding and exit clearance approvals**. When an employee resigns, this application orchestrates a multi-level, multi-department approval workflow — from the reporting manager chain all the way through departmental clearances, HR, payroll, and finance — until the Full & Final settlement is complete and the employee is formally released.

The application module is named `YHR_APR_ESEPRTN` (the "approve" side of e-Separation), and its UI5 namespace is `sap.abp.eSeparation.approve`.

---

## Application Architecture

### Pattern: Master-Detail SplitApp

The app uses a `sap.m.SplitApp` in **ShowHideMode** — on desktop, the master (employee list) and detail (clearance form) appear side-by-side; on phones, they show one at a time.

### MVC Compliance Assessment

The user has noted that this application **does not strictly follow MVC architecture**. Here is what I observed:

| MVC Layer | What Exists | Issues |
|-----------|-------------|--------|
| **Model** | OData V2 model (`esepApr`) + several JSON models (`request`, `detail`, `sepHeader`, `notes`, `attachment`, `user`, `pic`, `device`) | Models are created ad-hoc in controllers and Component.js rather than declared in a manifest. No formal data layer or service abstraction. |
| **View** | XML views (`SplitApp`, `RequestsMaster`, `RequestsDetail`, `ReqInitial`) + 1 XML fragment (`Forward`) | Views are reasonably well-structured as XML, but `RequestsDetail.view.xml` is extremely large (~888 lines) with deeply nested role-conditional visibility logic embedded directly in XML expressions. |
| **Controller** | JS controllers for each view | `RequestsDetail.controller.js` is ~2048 lines and contains business logic, validation, data transformation, OData calls, UI manipulation, and PDF generation all in one file. No separation of concerns. |

**Key architectural gaps:**

1. **No `manifest.json` (App Descriptor)** — The app uses the older `Component.js` metadata pattern (pre-UI5 1.30). All routing, dependencies, and configuration are hardcoded in `Component.js` instead of being declaratively defined.

2. **No service layer** — All OData calls (`oDataModel.read`, `oDataModel.create`, `oDataModel.remove`) are made directly inside controllers. There is no abstraction for backend communication (no service classes, no repository pattern).

3. **Business logic in controllers** — Notice period calculations, short notice deductions, leave balance computations, and validation rules live directly in the controller rather than in a separate model or service.

4. **`Common.js` is a global utility object** — Instead of using a proper UI5 module system (`sap.ui.define`), `Common.js` defines a global object with 60+ functions for role-based visibility and formatting. These are referenced from XML views via `Common.functionName`.

5. **No i18n / internationalization** — All text strings are hardcoded in views and controllers. No `i18n.properties` file exists.

6. **CSRF token stored on `window`** — `window.header_xcsrf_token` is used as a global variable for file upload authentication.

7. **No data binding for writes** — Despite the OData model being set to TwoWay binding, the `_create` method manually assembles the entire payload object by reading UI control values one by one, rather than leveraging model binding for form submission.

---

## File Structure

```
YHR_APR_ESEPRTN/
└── webapp/
    ├── Common.js                          — Shared utility (875 lines, 60+ role-based functions)
    ├── Component.js                       — App entry point, routing, OData model setup
    ├── META-INF/MANIFEST.MF               — Java WAR manifest (minimal)
    ├── WEB-INF/web.xml                    — Servlet deployment descriptor
    ├── css/eSeparationApprove.css          — Custom styles (background images, tile styling)
    ├── img/                               — Background images (home.jpg, home1.jpg, home2.jpg)
    └── views/
        ├── Forward.fragment.xml           — Dialog fragment for forwarding requests
        ├── ReqInitial.controller.js       — Empty controller for "no data" placeholder
        ├── ReqInitial.view.xml            — "No Data Found" placeholder view
        ├── RequestsDetail.controller.js   — Main approval logic (~2048 lines)
        ├── RequestsDetail.view.xml        — Clearance form view (~888 lines)
        ├── RequestsMaster.controller.js   — Employee list logic
        ├── RequestsMaster.view.xml        — Employee list view
        ├── SplitApp.controller.js         — Empty shell controller
        └── SplitApp.view.xml              — SplitApp container
```

---

## Backend / OData Services

All data flows through a single OData V2 service:

**Primary:** `/sap/opu/odata/sap/YHR_ESEP_APPROVAL_SRV`

| Entity Set | Purpose |
|------------|---------|
| `Emp_headerSet` | List of employees with pending requests |
| `EmployeePhotoSet` | Employee photos (binary stream) |
| `Request_detailsSet` | Employee detail for a specific request |
| `Separation_headerSet` | Main offboarding record (read + create/update) |
| `Separation_notesSet` | Notes on a separation request |
| `Separation_attachmentSet` | Attachments (read + delete) |
| `Sep_attachmentSet` | Attachment upload endpoint |
| `Emp_f4Set` | Users available for forwarding |
| `Call_Clearance_FormSet` | PDF clearance form generation |
| `Payrol_formSet` | PDF payroll form generation |

**Secondary:** `YHR_HELP_MANUAL_SRV` — Used only for the Help button PDF.

There is **no local database**. The SAP backend (ABAP) is the sole data store.

---

## Routing

Defined in `Component.js` (not in a manifest):

| Route | URL Pattern | View | Target |
|-------|------------|------|--------|
| `ReqMaster` | `""` (root) | `RequestsMaster` | Master pane |
| `ReqDetail` | `{pernr}/:request:` | `RequestsDetail` | Detail pane |
| `ReqInitial` | `{pernr}/:request:/No Data Found` | `ReqInitial` | Detail pane |

---

## Business Workflow

The application supports a **22-role approval chain** for employee offboarding:

### Phase 1 — Management Approval
1. **RM** — Reporting Manager reviews, proposes Last Working Day
2. **R2** — Reporting Manager Level 2
3. **R3** — Reporting Manager Level 3
4. **HD** — Editor / Departmental Head
5. **H2** — Executive Editor / Functional Head
6. **HR** — HR Business Partner
7. **HH** — HR Head (can set short notice waiver)

### Phase 2 — Department Clearances (parallel)
8. **RC** — Functional Clearance (responsibilities, documents, materials, assets)
9. **IC** — IT Clearance (laptop, desktop, data card, mobile, SIM, HDD, DVD writer)
10. **FC** — Finance Clearance (loans, advances, company lease, co-op dues, mobile reimbursement)
11. **AC** — Infrastructure/Admin (cupboard/drawer/cabin keys, furniture, car usage)
12. **EC** — Editorial Services (camera equipment, lenses, speedlight, monopod, memory cards)
13. **DB** — Digital/Brand MAE (social media IDs, online tools, shared drives)
14. **EM** — CMS/Editorial Manager (CMS login deactivation)
15. **DE** — Digital Editorial (VPN, email, CMS deactivation)

### Phase 3 — Full & Final Settlement
16. **PC** — Personnel (EL balance, salary, gratuity, allowances)
17. **HF** — HR Head F&F Approval
18. **PA** — Payroll (F&F calculations, F&F amount)
19. **FF** — Finance F&F Approval
20. **PF** — Personnel Final (I-Card return, release letter hold)
21. **PB** — Personnel Completion (offboarding closure)

### Additional Role
22. **RW** — Reporting Manager Withdraw (the only role that can Reject)

---

## Key Features

- **Role-based UI** — Each approver sees only the fields relevant to their role. Controlled by 60+ visibility functions in `Common.js`.
- **Last Working Day negotiation** — Employee, system, RM1, Editor, and Exec Editor each propose a date. The approver selects which one to use via radio buttons.
- **Notice period calculation** — Automatic calculation of notice period served, short notice days, and short notice deduction at basic salary.
- **Short notice waiver** — HR Head can waive short notice deduction.
- **Leave adjustment** — Earned leave balance can be adjusted against short notice.
- **Department clearance checklists** — Each department has specific items with Received / Not Received / Not Applicable status.
- **F&F settlement** — Full calculation of earned leaves, gratuity, night allowance, exgratia, salary for holiday working.
- **Payment method** — Electronic transfer or cheque.
- **PDF generation** — Clearance forms and payroll forms generated via OData.
- **File attachments** — Upload, download, and delete with CSRF token handling.
- **Forward** — Delegate the request to another user via a dialog.
- **Print** — Browser print for certain roles.

---

## What Is Working Fine (Current Development Status)

Based on reading the codebase, the following are fully implemented and functional:

1. **Master-detail navigation** — Employee list loads from OData, selecting an employee loads the detail view with all data.
2. **Role-based visibility** — All 22 roles have their visibility rules defined in `Common.js` and wired to the XML views.
3. **OData integration** — All CRUD operations (read employee list, read details, create/update separation header, upload/delete attachments, read notes) are implemented.
4. **Form submission** — Save (draft), Approve, and Reject flows are implemented with status codes `S`, `A`, `R`.
5. **Validation** — Extensive field-level validation before approval (dates, remarks, clearance dropdowns, mandatory attachments for PA/PB roles).
6. **Notice period calculations** — Short notice, waiver, and deduction logic is implemented.
7. **Leave balance calculations** — EL balance, earned leaves to adjust, and leave-against-short-notice logic works.
8. **File attachment handling** — Upload with CSRF token, download, delete, and file type validation (PDF, DOC, DOCX, PNG, JPEG, JPG, TIF, MSG).
9. **Forward functionality** — Dialog with user selection and remarks.
10. **PDF generation** — For clearance forms (PC/PF roles) and payroll forms (PA/PB roles).
11. **Pull-to-refresh** — On the master list.
12. **Search/filter** — Live search on the employee list.
13. **Device-responsive layout** — SplitApp ShowHideMode with phone/desktop detection.
14. **Custom styling** — Background images, transparent forms, tile styling.
15. **Help integration** — Help button in Fiori Launchpad header opening a manual PDF.

### Known Observations (Not Necessarily Bugs)

- `ReqInitial` controller has all lifecycle methods commented out — intentionally a static "No Data" page.
- `SplitApp.controller.js` is empty — the SplitApp is just a container.
- Notes section in `RequestsDetail.view.xml` has `visible="false"` — appears to be intentionally hidden.
- The Help button iframe points to another UI5 app (`yhr_lvattmanual`) which is a leave/attendance manual, not specific to offboarding.
- `web.xml` references `index.html` as the welcome file, but no `index.html` is present in the repository — this is expected since the app launches through the Fiori Launchpad, not standalone.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | SAP UI5 (classic, pre-AMD module loading) |
| View Technology | XML Views + XML Fragments |
| UI Library | `sap.m`, `sap.uxap` (ObjectPageLayout), `sap.ui.ux3`, `sap.suite.ui.commons` |
| Data Protocol | OData V2 |
| Backend | SAP NetWeaver Gateway (ABAP) |
| Deployment | Java WAR (ResourceServlet) / SAP BSP Repository |
| Styling | Custom CSS overrides |
| Authentication | SAP SSO (CSRF token for writes) |
