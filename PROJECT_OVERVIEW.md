# NEWMAP-EIB Plateau — Digital Platform Project Overview

**Document purpose:** Source brief for preparing a government project pricing proposal and formal pitch to take the NEWMAP-EIB Plateau digital platform from concept/MVP to a properly governed, production-ready system.

**Programme:** Nigeria Erosion and Watershed Management Project (NEWMAP)  
**Funder / partner context:** European Investment Bank (EIB)  
**Geographic focus:** Plateau State, Nigeria  
**Implementing face (digital):** NEWMAP-EIB Plateau State public platform  

---

## 1. What this project is

NEWMAP-EIB Plateau is a **digital public information and project-visibility platform** for the Plateau State arm of the Nigeria Erosion and Watershed Management Project.

It exists to give government, development partners, communities, and the public a clear, trusted online window into:

- The programme’s mission and focus areas  
- Ongoing environmental interventions across Plateau State  
- Progress updates and field evidence (photos / gallery)  
- Official contact channels for the Plateau State Project Office  

In short: it is the **official digital front door and progress showcase** for NEWMAP-EIB activities in Plateau State—not a replacement for engineering works on the ground, but the system that makes those works visible, accountable, and easier to communicate.

---

## 2. The problem it addresses

Plateau State faces serious **gully erosion**, **seasonal flooding**, and broader **environmental degradation**. These risks threaten:

- Public infrastructure  
- Farmland and watersheds  
- Households and livelihoods  
- Community safety and climate resilience  

NEWMAP (with EIB support) responds through erosion control, flood management, watershed restoration, and community sensitization.

**The digital gap:** Without a proper platform, project updates stay fragmented (paper reports, WhatsApp photos, offline presentations). Citizens and partners struggle to see what is being done, where, and with what progress. Government accountability and donor visibility suffer.

**What this platform solves:** It centralizes public communication, project storytelling, and progress media in one government-aligned web presence—building transparency and trust around NEWMAP-EIB Plateau interventions.

---

## 3. Programme mission (as reflected in the platform)

> Protect Plateau State’s environment through erosion control, flood management, watershed restoration, and community resilience—reducing vulnerability to soil erosion, flooding, and climate-related risks.

### Key focus areas

| Focus area | Intent |
|------------|--------|
| **Watershed management** | Restore natural water flow and land stability |
| **Flood mitigation** | Reduce impacts of urban and rural flooding |
| **Erosion control** | Halt gully erosion and reclaim degraded land |
| **Community sensitization** | Educate and equip communities for environmental stewardship |

Illustrative intervention themes already represented in the current prototype include Jos North flood control, Shendam watershed stabilization, and community environmental awareness.

---

## 4. Who it is for

| Stakeholder | How they use the platform |
|-------------|---------------------------|
| **Plateau State Project Office / NEWMAP-EIB team** | Publish projects, news, progress, and official information |
| **State Government & MDAs** | Oversight, visibility, and public accountability |
| **EIB / development partners** | See progress narratives and field evidence |
| **Field workers & site supervisors** | Submit progress photos and update descriptions |
| **Communities & general public** | Learn about interventions, view gallery, contact the office |
| **Media & civil society** | Access accurate programme information |

---

## 5. Current state of the software (honest baseline)

A working **MVP / prototype** already exists in this repository. It demonstrates the brand, information architecture, and a basic progress-upload → gallery flow.

### What exists today

| Module | Status | Notes |
|--------|--------|--------|
| Home / mission | Built | Public landing page |
| About | Built | Programme story and focus areas |
| Projects portfolio | Built | Sample / hardcoded project cards with progress |
| News & updates | Built | Sample / hardcoded announcements |
| Gallery | Built | Displays uploaded images |
| Upload progress | Built | Field workers can upload images (no login yet) |
| Contact | Partial | Office details shown; form not fully wired |

### Technology (current)

- **Next.js** (App Router) + **React** + **TypeScript**  
- **Tailwind CSS** for UI  
- Local file storage for uploads (`public/uploads`)  
- No database, no authentication, no CMS, no maps/GIS yet  

### What is *not* production-ready yet

- Role-based access control (admin, editor, field uploader)  
- Content management for projects/news (still largely hardcoded)  
- Secure cloud media storage (needed for proper hosting)  
- Working contact / enquiry workflow (email or ticketing)  
- GIS / site maps, M&E dashboards, document repository  
- Audit trails, backups, SLA hosting, and government IT hardening  
- Formal UAT, training, and handover documentation  

**Positioning for the pitch:** The MVP proves demand and direction. A funded engagement is required to harden, expand, and operate it as an official government-facing system.

---

## 6. Proposed full delivery scope (for pricing)

Use the phases below as **pricing work packages**. Adjust effort and cost based on client priorities; Phase 1 alone can deliver a credible official launch.

### Phase 1 — Official public platform (foundation)

**Goal:** Replace the prototype with a secure, maintainable public site suitable for government launch.

Suggested inclusions:

1. **Design polish & brand compliance** — Plateau / NEWMAP / EIB visual identity, accessibility, mobile responsiveness  
2. **Content Management System (CMS)** — Admins can create/edit Projects, News, About, and Gallery without developers  
3. **Authentication & roles** — e.g. Super Admin, Content Editor, Field Uploader  
4. **Secure media storage** — Cloud object storage (e.g. S3-compatible) with size/type validation  
5. **Contact & enquiry handling** — Working form → email/notification to Project Office  
6. **Hosting & deployment** — Production hosting, HTTPS, domain (`newmapeibplateau.org` or approved domain), staging environment  
7. **Basic SEO & analytics** — Discoverability and usage reporting  
8. **Documentation & training** — Admin manual + 1–2 training sessions for Project Office staff  

**Outcome:** An official, editable public website with controlled progress uploads.

---

### Phase 2 — Project transparency & field operations

**Goal:** Make interventions measurable and easier to supervise.

Suggested inclusions:

1. **Structured project records** — LGA, site name, status, budget band (if approved), start/end dates, beneficiaries  
2. **Progress reporting workflow** — Approved uploads only; optional geotag/date stamps  
3. **Gallery moderation** — Review before public publish  
4. **Document library** — PDFs (briefs, fact sheets, ESMP summaries as approved)  
5. **Public project detail pages** — One page per intervention with timeline and media  
6. **Internal dashboard** — Counts of projects by status, LGA, theme  

**Outcome:** Citizens and partners see real project status; staff manage updates through a controlled process.

---

### Phase 3 — GIS, M&E, and institutional systems (optional / advanced)

**Goal:** Align the digital platform with technical programme management.

Suggested inclusions:

1. **Interactive map** — Intervention sites across Plateau State (LGAs such as Jos North, Jos South, Shendam, etc.)  
2. **M&E indicators** — Simple scorecards (households protected, hectares restored, drains completed, etc.)  
3. **Grievance / feedback channel** — Community complaints with tracking numbers  
4. **Partner / contractor visibility modules** (if required by PCU)  
5. **Integration hooks** — Export to Excel/PDF; optional APIs for state MIS  
6. **Advanced security & compliance** — Audit logs, role reviews, backup/DR policy, NDPR-aligned data practices  

**Outcome:** A programme information system, not only a brochure website.

---

### Phase 4 — Support, operations & continuous improvement

**Goal:** Keep the system alive after handover.

Suggested inclusions (annual or multi-year SLA):

- Hosting & uptime monitoring  
- Security patches and dependency updates  
- Content support / minor change requests (capped hours)  
- Backup verification and incident response  
- Quarterly feature improvements based on Project Office feedback  

---

## 7. Suggested pricing structure (how to quote)

When building the commercial proposal, price by **phase + deliverable**, not by “website” alone.

| Line item | What to price |
|-----------|----------------|
| Discovery & requirements workshop | Stakeholder sessions with Project Office / PCU |
| UX/UI design | Wireframes + approved visual design |
| Phase 1 build | Foundation platform (Section 6) |
| Phase 2 build | Transparency & field ops |
| Phase 3 build | GIS / M&E (optional) |
| Content migration | Loading real projects, news, photos, contacts |
| Training & change management | On-site or remote sessions + manuals |
| Go-live & warranty | e.g. 30–90 days defect fix window |
| Annual support SLA | Hosting + maintenance retainer |

### Effort drivers that affect cost

- Number of user roles and approval workflows  
- Whether GIS/maps are required at launch  
- Volume of historical content to migrate  
- Hosting preference (state data centre vs cloud)  
- Bilingual content (English + local language) if required  
- Integration with existing government systems  

---

## 8. Benefits for a government / partner audience

1. **Transparency** — Public can see interventions and progress  
2. **Accountability** — Documented updates support oversight and donor reporting  
3. **Community trust** — Clear communication reduces rumour and misinformation  
4. **Operational efficiency** — One channel for news, projects, and field photo evidence  
5. **Institutional memory** — Project history is stored digitally, not lost in staff turnover  
6. **Partner confidence** — EIB and other stakeholders get a professional, up-to-date digital presence  

---

## 9. Risks if left as an MVP only

| Risk | Impact |
|------|--------|
| No authentication on uploads | Uncontrolled or inappropriate public content |
| Local file storage | Unsuitable for reliable cloud hosting |
| Hardcoded content | Project Office cannot update without developers |
| Incomplete contact form | Missed citizen/partner enquiries |
| No CMS / backups / SLA | System becomes stale or unavailable |

These risks are the core justification for a properly scoped, funded delivery engagement.

---

## 10. Recommended pitch narrative (short)

> NEWMAP-EIB Plateau already has a working digital prototype that communicates the programme’s mission—erosion control, flood management, watershed restoration, and community resilience across Plateau State.  
>  
> We are seeking government / programme funding to take this from MVP to an official production platform: secure content management, controlled field progress reporting, reliable hosting, staff training, and optional GIS/M&E capabilities.  
>  
> The result will be a transparent, maintainable system that strengthens accountability for NEWMAP-EIB interventions and improves public and partner confidence in Plateau State’s environmental investments.

---

## 11. Immediate next steps (for proposal preparation)

1. Confirm **sponsoring agency** and decision-makers (Plateau State Project Office / PCU / relevant MDA).  
2. Agree **must-have scope for Year 1** (typically Phase 1 + selected Phase 2 items).  
3. Collect real content: project list by LGA, logos, office contacts, approved photos.  
4. Decide hosting and domain policy.  
5. Convert Section 6 into a priced bill of quantities (person-days × rates + hosting).  
6. Present demo of current MVP alongside the phased roadmap.

---

## 12. Repository reference

| Item | Detail |
|------|--------|
| Project name | NEWMAP-EIB Plateau |
| Codebase | This repository (`NEWMAP-EIB-PLATEAU`) |
| Current maturity | Early MVP / prototype |
| Primary pages | Home, About, Projects, News, Gallery, Upload Progress, Contact |

---

*This document describes the digital platform opportunity around the NEWMAP-EIB Plateau programme. Engineering and civil works remain separate programme components; this brief covers the software, content, hosting, and operational layers needed to present and manage project information properly online.*
