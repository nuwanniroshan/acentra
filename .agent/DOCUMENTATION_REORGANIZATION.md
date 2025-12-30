# Documentation Reorganization Proposal

**Date:** December 25, 2025  
**Issue:** Documentation scattered across multiple folders with inconsistent structure  
**Goal:** Create a single, organized documentation structure

---

## Current State (Problems)

### Scattered Locations
```
/
├── backlog/                    ← Dev stories, implementation plans
├── docs/                       ← Architecture, PRD, stories
├── documentation/              ← PRD, architecture, tech specs
├── .agent/                     ← New PRD, tasks, sprint planning
├── ux-feedback.md             ← Root level (should be organized)
├── overview.md                ← Root level (should be organized)
└── todo.txt                   ← Root level (should be organized)
```

### Issues
- ❌ Multiple folders with similar content
- ❌ Duplicate files (PRD.md in multiple places)
- ❌ Inconsistent naming (PRD.md vs prd.md)
- ❌ Hard to find documents
- ❌ No clear organization system
- ❌ Mix of active and archived content

---

## Proposed Structure (Clean & Organized)

```
/
├── docs/                                    ← SINGLE documentation folder
│   ├── README.md                           ← Documentation index
│   │
│   ├── product/                            ← Product documentation
│   │   ├── prd-main.md                    ← Main product requirements
│   │   ├── prd-template-improvements.md   ← Current initiative PRD
│   │   ├── ux-feedback.md                 ← UX review feedback
│   │   └── roadmap.md                     ← Product roadmap
│   │
│   ├── architecture/                       ← Technical architecture
│   │   ├── overview.md                    ← System overview
│   │   ├── architecture-v2.md             ← Current architecture
│   │   ├── tech-stack.md                  ← Technology choices
│   │   └── database-schema.md             ← Database design
│   │
│   ├── development/                        ← Development docs
│   │   ├── setup.md                       ← Development setup
│   │   ├── workflows.md                   ← Development workflows
│   │   ├── coding-standards.md            ← Code standards
│   │   └── testing-guide.md               ← Testing guidelines
│   │
│   ├── project-management/                 ← PM documents
│   │   ├── sprint-planning.md             ← Current sprint plan
│   │   ├── sprint-board.md                ← Visual sprint board
│   │   ├── backlog.md                     ← Product backlog
│   │   └── retrospectives/                ← Sprint retros
│   │       ├── 2025-12-sprint-1.md
│   │       └── 2025-12-sprint-2.md
│   │
│   ├── tasks/                              ← Implementation tasks
│   │   ├── README.md                      ← Task index
│   │   ├── active/                        ← Current tasks
│   │   │   ├── task-001-email-placeholder-guide.md
│   │   │   ├── task-002-rich-text-editor.md
│   │   │   └── ...
│   │   └── completed/                     ← Completed tasks
│   │       └── task-xxx-completed.md
│   │
│   ├── epics/                              ← Epic documentation
│   │   ├── epic-001-user-management.md
│   │   ├── epic-002-template-improvements.md
│   │   └── ...
│   │
│   └── archive/                            ← Old/deprecated docs
│       ├── old-prd-v1.md
│       ├── old-architecture.md
│       └── ...
│
├── .agent/                                  ← Agent-specific files
│   ├── workflows/                          ← Workflow definitions
│   │   ├── build.md
│   │   ├── serve.md
│   │   └── test.md
│   └── aurora-clean-theme.md              ← Theme documentation
│
└── knowledge-base/                         ← Keep as-is (separate concern)
```

---

## Migration Plan

### Phase 1: Create New Structure (15 minutes)

```bash
# Create new folder structure
mkdir -p docs/product
mkdir -p docs/architecture
mkdir -p docs/development
mkdir -p docs/project-management/retrospectives
mkdir -p docs/tasks/active
mkdir -p docs/tasks/completed
mkdir -p docs/epics
mkdir -p docs/archive
```

### Phase 2: Move Documents (30 minutes)

#### From `.agent/` → `docs/`
```bash
# Product docs
mv .agent/prd-template-improvements.md docs/product/

# Project management
mv .agent/sprint-planning.md docs/project-management/
mv .agent/sprint-board.md docs/project-management/

# Tasks
mv .agent/tasks/README.md docs/tasks/
mv .agent/tasks/task-*.md docs/tasks/active/
```

#### From `backlog/` → `docs/`
```bash
# Dev stories → epics
mv backlog/dev-story-*.md docs/epics/

# Implementation plans → project management
mv backlog/implementation-plan-*.md docs/project-management/

# Epics
mv backlog/epics/* docs/epics/

# Sprints → archive (if old)
mv backlog/sprints/* docs/archive/
```

#### From `docs/` → `docs/` (reorganize)
```bash
# Architecture
mv docs/architecture.md docs/architecture/overview.md

# Stories
mv docs/stories/* docs/epics/

# PRD
mv docs/prd.md docs/archive/prd-old.md
```

#### From `documentation/` → `docs/`
```bash
# Architecture
mv documentation/architecture-design-2.0.md docs/architecture/

# Tech specs
mv documentation/tech-spec-*.md docs/architecture/

# PRD
mv documentation/PRD.md docs/archive/PRD-old.md
```

#### From root → `docs/`
```bash
# Product docs
mv ux-feedback.md docs/product/
mv overview.md docs/architecture/

# Keep todo.txt in root (it's a working file)
```

### Phase 3: Clean Up (10 minutes)

```bash
# Remove empty folders
rmdir backlog/epics backlog/sprints backlog
rmdir docs/stories
rmdir documentation/bmm documentation

# Or keep as archive
mv backlog docs/archive/old-backlog
mv documentation docs/archive/old-documentation
```

### Phase 4: Create Index (15 minutes)

Create `docs/README.md` with navigation to all documents.

---

## Recommended Folder Purposes

### `/docs/` - Main Documentation
**Purpose:** All project documentation  
**Contents:** Product, architecture, development, PM docs  
**Audience:** Everyone on the team

### `/docs/product/`
**Purpose:** Product requirements and roadmap  
**Contents:** PRDs, UX feedback, roadmap  
**Audience:** Product managers, designers, stakeholders

### `/docs/architecture/`
**Purpose:** Technical architecture and design  
**Contents:** System design, tech stack, database schema  
**Audience:** Developers, architects

### `/docs/project-management/`
**Purpose:** Sprint planning and tracking  
**Contents:** Sprint plans, backlogs, retrospectives  
**Audience:** Scrum master, PM, developers

### `/docs/tasks/`
**Purpose:** Implementation tasks  
**Contents:** Detailed task specifications  
**Audience:** Developers

### `/docs/epics/`
**Purpose:** Epic-level features  
**Contents:** Large feature specifications  
**Audience:** PM, developers

### `/docs/archive/`
**Purpose:** Old/deprecated documents  
**Contents:** Historical documents for reference  
**Audience:** Reference only

### `/.agent/`
**Purpose:** Agent-specific configurations  
**Contents:** Workflows, theme docs  
**Audience:** AI agent, developers

### `/knowledge-base/`
**Purpose:** General knowledge (keep separate)  
**Contents:** Tutorials, guides, references  
**Audience:** Everyone

---

## File Naming Conventions

### Use Consistent Naming
- ✅ `prd-template-improvements.md` (lowercase, hyphens)
- ❌ `PRD.md` (uppercase)
- ❌ `prd_template_improvements.md` (underscores)

### Use Descriptive Names
- ✅ `sprint-planning-2025-12.md`
- ❌ `sprint.md`

### Use Prefixes for Organization
- `prd-*.md` - Product requirements
- `task-*.md` - Implementation tasks
- `epic-*.md` - Epic specifications
- `arch-*.md` - Architecture documents

---

## Benefits of New Structure

### ✅ Single Source of Truth
- All docs in `/docs/` folder
- Easy to find anything
- No duplicate files

### ✅ Clear Organization
- Logical folder structure
- Consistent naming
- Easy navigation

### ✅ Better Collaboration
- Team knows where to look
- Easy to onboard new members
- Clear ownership

### ✅ Version Control
- Archive old versions
- Track changes over time
- Easy to reference history

### ✅ Scalability
- Easy to add new docs
- Structure supports growth
- Maintainable long-term

---

## Quick Start Guide

### For Product Managers
```
docs/product/          ← Your PRDs and roadmaps
docs/project-management/ ← Sprint planning
docs/tasks/            ← Review implementation tasks
```

### For Developers
```
docs/tasks/active/     ← Current tasks to implement
docs/architecture/     ← System design
docs/development/      ← Setup and workflows
```

### For Designers
```
docs/product/          ← Product requirements
docs/product/ux-feedback.md ← UX reviews
```

### For Stakeholders
```
docs/product/prd-*.md  ← Product plans
docs/product/roadmap.md ← Product roadmap
```

---

## Migration Commands (Copy & Paste)

```bash
# Navigate to project root
cd /Users/swiveltech/Disk/Swivel/acentra

# Create new structure
mkdir -p docs/product
mkdir -p docs/architecture
mkdir -p docs/development
mkdir -p docs/project-management/retrospectives
mkdir -p docs/tasks/active
mkdir -p docs/tasks/completed
mkdir -p docs/epics
mkdir -p docs/archive

# Move from .agent/
cp .agent/prd-template-improvements.md docs/product/
cp .agent/sprint-planning.md docs/project-management/
cp .agent/sprint-board.md docs/project-management/
cp -r .agent/tasks/* docs/tasks/active/

# Move from root
mv ux-feedback.md docs/product/
mv overview.md docs/architecture/

# Archive old folders
mv backlog docs/archive/old-backlog
mv documentation docs/archive/old-documentation
mv docs/architecture.md docs/archive/
mv docs/prd.md docs/archive/

# Keep .agent/workflows as-is (different purpose)

echo "✅ Migration complete!"
```

---

## Maintenance Guidelines

### Weekly
- [ ] Review and update active tasks
- [ ] Move completed tasks to `/completed/`
- [ ] Update sprint planning docs

### Monthly
- [ ] Archive old sprint docs
- [ ] Review and clean up duplicates
- [ ] Update documentation index

### Quarterly
- [ ] Review entire structure
- [ ] Archive outdated documents
- [ ] Update roadmap and PRDs

---

## Decision: What to Do?

### Option 1: Full Migration (Recommended)
**Pros:** Clean, organized, single source of truth  
**Cons:** Takes 1 hour, need to update references  
**When:** Now (best time to clean up)

### Option 2: Gradual Migration
**Pros:** Less disruptive, can do over time  
**Cons:** Confusion continues, takes longer  
**When:** Over next 2 weeks

### Option 3: Keep Current + Add Index
**Pros:** No migration needed  
**Cons:** Still confusing, hard to maintain  
**When:** If time is critical

---

## My Recommendation

**Do Option 1: Full Migration NOW**

**Why:**
1. You're starting new sprints - perfect timing
2. Only takes 1 hour
3. Will save hours of confusion later
4. Team will thank you

**How:**
1. Run the migration commands (5 minutes)
2. Create docs/README.md index (10 minutes)
3. Update any references in code (15 minutes)
4. Communicate to team (5 minutes)
5. Delete old folders (5 minutes)

**Total Time:** ~40 minutes for a clean, organized structure!

---

## Questions?

1. **What about .agent folder?**
   - Keep it! It's for agent-specific configs (workflows)
   - Move only the PRD, tasks, and sprint docs to `/docs/`

2. **What about knowledge-base?**
   - Keep it! It's a different purpose (general knowledge)

3. **What about old documents?**
   - Move to `/docs/archive/` for reference
   - Don't delete (might need history)

4. **What if I need to reference old structure?**
   - Everything will be in `/docs/archive/old-*`

---

**Ready to clean up? Let me know and I'll help you execute the migration!** 🚀
