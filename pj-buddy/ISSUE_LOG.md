# PJ-Buddy Issue Log

This document tracks technical issues, their resolution, and key learnings.

---

### **ISSUE-001: Supabase Database Connection Failure**

- **Status:** `RESOLVED`
- **Date Reported:** 2026-02-04
- **Date Resolved:** 2026-02-05

**Description:**
Prisma commands (`db push`, `migrate dev`) consistently failed with a `P1001: Can't reach database server` error, even after confirming credentials and opening network restrictions to all IPs.

**Analysis & Resolution:**
1.  **Initial Hypothesis (Incorrect):** Believed it was an IP allow-list issue in Supabase settings.
2.  **Network Diagnostics:** Using `nc` and `nslookup`, it was discovered that the Supabase hostname (`db...supabase.co`) was resolving exclusively to an IPv6 address for my server environment. The server's network was unable to establish a route over IPv6, causing the "Network is unreachable" error at a TCP level.
3.  **Workaround 1 (Partial Success):** Switched to the Supabase connection pooler URL (`pooler.supabase.com`). This allowed a successful connection, but Prisma's introspection/migration engine hung indefinitely, a known incompatibility issue with some poolers.
4.  **Workaround 2 (Successful):** The IPv4 add-on was not available on the free plan. The final solution was to:
    a. Use `prisma migrate diff` to generate the raw SQL needed to create the schema without requiring a database connection.
    b. Provide the SQL script to the user to run directly in the Supabase SQL Editor.
    c. Configure the application's `.env` file to use the connection pooler URL for runtime operations, which works correctly.

**Learning:**
- Direct connections to Supabase's free tier can be unreliable from IPv6-first environments.
- Connection poolers are a viable workaround for application runtime but may be incompatible with ORM migration tools like Prisma Migrate.
- Manually generating migration SQL is a robust fallback to provision a database schema when direct migration commands fail due to network issues.
