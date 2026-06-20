Markdown
# MetricScale Analytics — Multi-Tenant SaaS Portal

An enterprise-grade, full-stack Software-as-a-Service (SaaS) financial analytics dashboard. This platform implements a robust **Shared Database, Shared Schema** multi-tenant architecture secured via JSON Web Tokens (JWT) and automated Hibernate data isolation filters.

## 🚀 Core Features

- **Robust Multi-Tenancy:** Automated data isolation using Hibernate data filters and Spring WebMVC interceptors to prevent cross-tenant data leaks.
- **Token-Based Authentication:** Cryptographically secure authentication pipeline utilizing Spring Security and JWT.
- **Dynamic Visualization:** Interactive transaction value stream charting powered by React and Recharts.
- **Thread-Safe Context Management:** Tenant scopes are bound explicitly to the executing thread using a customized `ThreadLocal` context wrapper.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (built with Vite)
- **Styling:** Tailwind CSS (v4)
- **Data Visualization:** Recharts
- **HTTP Client:** Axios

### Backend
- **Engine:** Spring Boot 3.x
- **Security:** Spring Security & JWT (`jjwt`)
- **ORM & Database:** Hibernate JPA & PostgreSQL
- **Utilities:** Lombok

---

## 📐 Architecture & Data Flow

1. **Authentication:** A user registers and signs in under a specific corporate identity profile. The backend evaluates credentials and returns a secure JWT containing the embedded `tenantId`.
2. **Request Interception:** The frontend stores the token and attaches the tenant identifier to out-going request headers.
3. **Thread Filtering:** A custom Spring `HandlerInterceptor` extracts the tenant scope and assigns it to a thread-safe `TenantContext`.
4. **Isolated Query Execution:** Hibernate automatically intercepts active repository queries and appends the relevant tenant discriminator restriction natively before reaching PostgreSQL.

---

## 💻 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js (v18+)
- PostgreSQL Instance running locally

### Backend Setup
1. Configure your local database connection parameters inside `src/main/resources/application.properties`.
2. Open the project folder in your terminal and run:
   ```bash
   mvn spring-boot:run
Frontend Setup
Navigate to the frontend directory:

Bash
cd metricscale-frontend
Install the necessary dependencies and launch the Vite development server:

Bash
npm install
Bash
npm run dev
Open your browser to http://localhost:5173 to access the live dashboard environment.
