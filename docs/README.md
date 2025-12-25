# Acentra ATS Documentation

**Welcome to the Acentra ATS documentation!** This is your single source of truth for all project documentation.

---

## 📚 Quick Navigation

### For Product Managers
- [Product Requirements](#product-requirements) - PRDs and roadmaps
- [Project Management](#project-management) - Sprint planning and tracking
- [Tasks](#implementation-tasks) - Current implementation tasks

### For Developers
- [Implementation Tasks](#implementation-tasks) - What to build
- [Architecture](#architecture) - How it's built
- [Development](#development) - How to build it

### For Designers
- [Product Requirements](#product-requirements) - What we're building
- [UX Feedback](#ux-feedback) - Design reviews

### For Stakeholders
- [Product Roadmap](#roadmap) - What's coming
- [Sprint Progress](#project-management) - Current status

---

## 📋 Product Requirements

### Active PRDs
- **[Template & UX Improvements](product/prd-template-improvements.md)** - Current initiative to improve email and feedback templates
- **[UX Feedback](product/ux-feedback.md)** - Comprehensive UX review and recommendations

### Roadmap
- Coming soon: Product roadmap document

---

## 🏗️ Architecture

### System Design
- **[System Overview](architecture/overview.md)** - High-level architecture overview
- Architecture v2.0 - See archive for historical versions

### Technical Specifications
- Database schema - Coming soon
- API documentation - Coming soon
- Tech stack - Coming soon

---

## 💻 Development

### Getting Started
- See main [README.md](../README.md) for setup instructions
- See [BMAD_QUICKSTART.md](../BMAD_QUICKSTART.md) for quick start

### Workflows
- [Build Workflow](../.agent/workflows/build.md)
- [Serve Workflow](../.agent/workflows/serve.md)
- [Test Workflow](../.agent/workflows/test.md)

### Standards
- Coding standards - Coming soon
- Testing guidelines - Coming soon

---

## 📊 Project Management

### Current Sprint
- **[Sprint Planning](project-management/sprint-planning.md)** - Detailed 3-sprint plan (6 weeks)
- **[Sprint Board](project-management/sprint-board.md)** - Visual sprint overview

### Backlog
- Product backlog - Coming soon

### Retrospectives
- Sprint retrospectives will be stored in `project-management/retrospectives/`

---

## ✅ Implementation Tasks

### Active Tasks (Sprint 1-3)

#### Sprint 1: Critical Fixes & Foundation
- **[Task 001: Email Template Placeholder Guide](tasks/active/task-001-email-placeholder-guide.md)** - 13 pts, HIGH
- **[Task 003: Fix Feedback Template Edit Bug](tasks/active/task-003-fix-feedback-template-edit.md)** - 8 pts, CRITICAL

#### Sprint 2: Major UX Improvements
- **[Task 002: Rich Text Editor](tasks/active/task-002-rich-text-editor.md)** - 21 pts, MEDIUM
- **[Task 004: Feedback Template UX Redesign](tasks/active/task-004-feedback-template-ux-redesign.md)** - 21 pts, MEDIUM

#### Sprint 3: Polish & Developer Experience
- **[Task 005: Aurora Logo Integration](tasks/active/task-005-aurora-logo-integration.md)** - 5 pts, LOW
- **[Task 006: Reusable Recruiter Assignment](tasks/active/task-006-reusable-recruiter-assignment.md)** - 13 pts, MEDIUM
- **[Task 007: Externalize AI Instructions](tasks/active/task-007-externalize-ai-instructions.md)** - 8 pts, MEDIUM

### Task Index
See **[tasks/README.md](tasks/README.md)** for complete task overview and roadmap.

---

## 🎯 Epics

Epic documentation will be organized here as we create them.

---

## 📦 Archive

Historical and deprecated documents are stored in the archive:

- **[Old Backlog](archive/old-backlog/)** - Previous backlog structure
- **[Old Documentation](archive/old-documentation/)** - Previous documentation folder

---

## 📁 Folder Structure

```
docs/
├── README.md                          ← You are here
│
├── product/                           ← Product documentation
│   ├── prd-template-improvements.md  ← Current PRD
│   └── ux-feedback.md                ← UX review
│
├── architecture/                      ← Technical architecture
│   └── overview.md                   ← System overview
│
├── development/                       ← Development guides
│   └── (coming soon)
│
├── project-management/                ← Sprint planning & tracking
│   ├── sprint-planning.md            ← 3-sprint plan
│   ├── sprint-board.md               ← Visual board
│   └── retrospectives/               ← Sprint retros
│
├── tasks/                             ← Implementation tasks
│   ├── README.md                     ← Task index
│   ├── active/                       ← Current tasks
│   │   ├── task-001-email-placeholder-guide.md
│   │   ├── task-002-rich-text-editor.md
│   │   ├── task-003-fix-feedback-template-edit.md
│   │   ├── task-004-feedback-template-ux-redesign.md
│   │   ├── task-005-aurora-logo-integration.md
│   │   ├── task-006-reusable-recruiter-assignment.md
│   │   └── task-007-externalize-ai-instructions.md
│   └── completed/                    ← Completed tasks
│
├── epics/                             ← Epic specifications
│   └── (coming soon)
│
└── archive/                           ← Historical documents
    ├── old-backlog/                  ← Previous backlog
    └── old-documentation/            ← Previous docs
```

---

## 🔍 Finding Documents

### By Role

**Product Manager:**
```
docs/product/              ← Your PRDs
docs/project-management/   ← Sprint planning
docs/tasks/               ← Task tracking
```

**Developer:**
```
docs/tasks/active/        ← What to build
docs/architecture/        ← How it's built
docs/development/         ← Setup guides
```

**Designer:**
```
docs/product/             ← Requirements
docs/product/ux-feedback.md ← UX reviews
```

**Stakeholder:**
```
docs/product/             ← Product plans
docs/project-management/  ← Progress tracking
```

### By Topic

**Templates & UX Improvements:**
- PRD: `docs/product/prd-template-improvements.md`
- Sprint Plan: `docs/project-management/sprint-planning.md`
- Tasks: `docs/tasks/active/task-001-*.md` through `task-007-*.md`

**Architecture:**
- Overview: `docs/architecture/overview.md`
- Historical: `docs/archive/old-documentation/`

**Sprint Planning:**
- Current: `docs/project-management/sprint-planning.md`
- Board: `docs/project-management/sprint-board.md`

---

## 📝 Document Naming Conventions

We use consistent naming for easy navigation:

### Prefixes
- `prd-*.md` - Product Requirements Documents
- `task-*.md` - Implementation tasks (numbered)
- `epic-*.md` - Epic specifications
- `arch-*.md` - Architecture documents
- `sprint-*.md` - Sprint-related documents

### Format
- Use lowercase with hyphens: `prd-template-improvements.md`
- Include dates for time-sensitive docs: `sprint-2025-12-planning.md`
- Be descriptive: `task-001-email-placeholder-guide.md` not `task-001.md`

---

## 🔄 Maintenance

### Weekly
- [ ] Update active tasks as they progress
- [ ] Move completed tasks to `tasks/completed/`
- [ ] Update sprint planning docs

### Monthly
- [ ] Archive old sprint documents
- [ ] Review and update roadmap
- [ ] Clean up duplicates

### Quarterly
- [ ] Review entire documentation structure
- [ ] Archive outdated documents
- [ ] Update this README

---

## 🤝 Contributing

### Adding New Documents

1. **Choose the right folder:**
   - Product requirements → `product/`
   - Technical specs → `architecture/`
   - Implementation tasks → `tasks/active/`
   - Sprint docs → `project-management/`

2. **Follow naming conventions:**
   - Use lowercase with hyphens
   - Use descriptive names
   - Add appropriate prefix

3. **Update this README:**
   - Add link in appropriate section
   - Update folder structure if needed

### Updating Documents

1. Make your changes
2. Update "Last Updated" date in document
3. Update this README if structure changes

### Archiving Documents

1. Move to `archive/` folder
2. Add note in document about why it's archived
3. Remove from active sections in this README

---

## 📞 Questions?

- **Can't find a document?** Check the archive or ask the team
- **Need to add a new type of document?** Propose a new folder structure
- **Document is outdated?** Update it or move to archive

---

## 📊 Documentation Stats

- **Total Documents:** 15+ active documents
- **Active Tasks:** 7 implementation tasks
- **Active PRDs:** 1 (Template & UX Improvements)
- **Sprints Planned:** 3 (6 weeks)
- **Story Points:** 89 total

---

## 🎯 Current Focus

**Active Initiative:** Template & UX Improvements
- **PRD:** [prd-template-improvements.md](product/prd-template-improvements.md)
- **Sprint Plan:** [sprint-planning.md](project-management/sprint-planning.md)
- **Status:** Sprint 1 ready to start
- **Duration:** 6 weeks (3 sprints)
- **Story Points:** 89

---

## 📚 Related Resources

### External Documentation
- [Knowledge Base](../knowledge-base/) - General tutorials and guides
- [Main README](../README.md) - Project setup and overview

### Agent Configuration
- [Workflows](../.agent/workflows/) - Automated workflows
- [Theme Documentation](../.agent/aurora-clean-theme.md) - Aurora theme guide

### Code Documentation
- Frontend: `apps/acentra-frontend/README.md`
- Backend: `apps/acentra-backend/README.md`
- Design System: `libs/aurora-design-system/README.md`

---

**Last Updated:** December 25, 2025  
**Maintained By:** Product & Engineering Team  
**Version:** 1.0

---

## 🚀 Quick Links

| Document | Purpose | Audience |
|----------|---------|----------|
| [Template PRD](product/prd-template-improvements.md) | Current initiative requirements | PM, Dev, Design |
| [Sprint Planning](project-management/sprint-planning.md) | 6-week execution plan | PM, Dev |
| [Sprint Board](project-management/sprint-board.md) | Visual sprint overview | Everyone |
| [Task Index](tasks/README.md) | All implementation tasks | Dev |
| [System Overview](architecture/overview.md) | Architecture overview | Dev, Architects |
| [UX Feedback](product/ux-feedback.md) | UX review findings | PM, Design |

---

**Welcome to organized documentation! 🎉**
