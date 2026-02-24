# WorkOrderHub — Lean Digital Work Order Management System

## 1. Project Overview

WorkOrderHub is a TPS-aligned Lean digital workflow system designed to manage internal operational requests for departments such as Facilities, IT, Security, and HR.

The system enforces:

- Standardized intake (validated structure)
- Controlled lifecycle transitions
- API key authentication
- Centralized error handling
- Traceability using requestId
- CSV bulk upload with row-level validation
- Visual operational management via Next.js frontend

The backend acts as the production controller enforcing governance rules.
The frontend acts as the visual management layer.

---

## 2. TPS (Toyota Production System) Alignment

### Standard Work
All work orders must pass strict validation before entering the system.

### Quality at Source (Jidoka)
Invalid input, unauthorized access, and invalid state transitions are rejected immediately.

### Flow Control
Work orders move only through predefined lifecycle states:

NEW → IN_PROGRESS  
IN_PROGRESS → BLOCKED or DONE  
BLOCKED → IN_PROGRESS  
DONE → no transitions allowed  

Invalid transitions return 409 INVALID_TRANSITION.

### Pull System
Only authenticated and validated requests enter the workflow.

### Visual Management
Frontend dashboard shows status distribution and filtered views.

### Andon (Error Signaling)
All errors are centralized and returned with structured responses including requestId.

---

## 3. Architecture Overview

Frontend (Next.js) → Backend (Express.js) → In-Memory Store

Backend responsibilities:
- Validation
- Workflow enforcement
- Authentication
- Error standardization
- CSV processing

Frontend responsibilities:
- UI rendering
- Form validation
- Error display
- Status transitions
- Bulk upload interface

---

## 4. Backend Setup Instructions

### Requirements
- Node.js LTS

### Steps
