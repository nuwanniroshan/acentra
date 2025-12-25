# Sprint Board - Template & UX Improvements

**Project:** Acentra ATS Template Improvements  
**Total Story Points:** 89  
**Duration:** 6 weeks (3 × 2-week sprints)  
**Team:** 2 developers + 1 QA (part-time)

---

## 📊 Sprint Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROJECT TIMELINE (6 WEEKS)                   │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   SPRINT 1      │   SPRINT 2      │   SPRINT 3                  │
│   (26 pts)      │   (42 pts)      │   (26 pts)                  │
│   Weeks 1-2     │   Weeks 3-4     │   Weeks 5-6                 │
├─────────────────┼─────────────────┼─────────────────────────────┤
│ 🔴 Fix Bug      │ 🟢 Rich Text    │ 🟢 Reusable Component       │
│ 🟡 Placeholders │ 🟢 UX Redesign  │ 🟢 AI Prompts               │
│                 │                 │ 🔵 Logo                     │
│                 │                 │ ✨ Polish                   │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

---

## Sprint 1: Critical Fixes & Foundation
**Dates:** Week 1-2 | **Points:** 26 | **Theme:** Fix & Prepare

### 🎯 Sprint Goals
1. Fix feedback template edit bug (CRITICAL)
2. Add email placeholder guide (HIGH VALUE)
3. Prepare for rich text editor

### 📋 Sprint Backlog

```
┌──────────────────────────────────────────────────────────────────┐
│ TO DO                                                            │
├──────────────────────────────────────────────────────────────────┤
│ 🔴 Task 003: Fix Feedback Template Edit Bug          [8 pts]    │
│    Assignee: Dev 1 (Backend/Full-stack)                         │
│    Duration: Days 1-3                                            │
│    ├─ Investigate backend API                        [2 pts]    │
│    ├─ Fix entity relationships                       [2 pts]    │
│    ├─ Fix frontend state                             [2 pts]    │
│    ├─ Add loading/error states                       [1 pt]     │
│    └─ Write tests                                    [1 pt]     │
│                                                                  │
│ 🟡 Task 001: Email Template Placeholder Guide       [13 pts]    │
│    Assignee: Dev 2 (Frontend)                                   │
│    Duration: Days 1-7                                            │
│    ├─ Create placeholder definitions                 [2 pts]    │
│    ├─ Build PlaceholderChip component                [2 pts]    │
│    ├─ Build PlaceholderGuide component               [3 pts]    │
│    ├─ Integrate with EmailTemplateManager            [2 pts]    │
│    ├─ Add search/filter                              [2 pts]    │
│    └─ Write tests                                    [2 pts]    │
│                                                                  │
│ 📝 Task 002 Prep: Rich Text Editor Research          [5 pts]    │
│    Assignee: Dev 1                                               │
│    Duration: Days 4-5                                            │
│    ├─ Evaluate Lexical vs Tiptap                     [2 pts]    │
│    ├─ Create proof of concept                        [2 pts]    │
│    └─ Document approach                              [1 pt]     │
└──────────────────────────────────────────────────────────────────┘
```

### 📈 Sprint Metrics
- **Velocity Target:** 26 points
- **Team Capacity:** 2 devs × 10 days = 20 dev-days
- **Risk Level:** Medium (critical bug fix)

### ✅ Definition of Done
- [ ] Template edit bug fixed and deployed
- [ ] Placeholder guide live in production
- [ ] All tests passing (>80% coverage)
- [ ] Zero critical bugs introduced
- [ ] Documentation updated

---

## Sprint 2: Major UX Improvements
**Dates:** Week 3-4 | **Points:** 42 | **Theme:** Transform UX

### 🎯 Sprint Goals
1. Implement rich text editor for emails
2. Redesign feedback template interface
3. Deliver major UX enhancements

### 📋 Sprint Backlog

```
┌──────────────────────────────────────────────────────────────────┐
│ TO DO                                                            │
├──────────────────────────────────────────────────────────────────┤
│ 🟢 Task 002: Rich Text Editor for Email Templates   [21 pts]    │
│    Assignee: Dev 1 (Full-stack)                                 │
│    Duration: Full sprint (Days 1-10)                             │
│    ├─ Install & configure Lexical                    [2 pts]    │
│    ├─ Create RichTextEditor component                [5 pts]    │
│    ├─ Build EditorToolbar                            [3 pts]    │
│    ├─ Implement PlaceholderPlugin                    [5 pts]    │
│    ├─ Create EmailPreview component                  [3 pts]    │
│    ├─ Update backend for HTML emails                 [2 pts]    │
│    └─ Test email clients                             [1 pt]     │
│                                                                  │
│ 🟢 Task 004: Feedback Template UX Redesign          [21 pts]    │
│    Assignee: Dev 2 (Frontend)                                   │
│    Duration: Full sprint (Days 1-10)                             │
│    ├─ Install @dnd-kit                               [1 pt]     │
│    ├─ Create TemplateBuilderPanel                    [5 pts]    │
│    ├─ Build QuestionList with DnD                    [5 pts]    │
│    ├─ Create QuestionCard (collapsible)              [4 pts]    │
│    ├─ Implement useTemplateBuilder hook              [3 pts]    │
│    ├─ Add animations & polish                        [2 pts]    │
│    └─ Write tests                                    [1 pt]     │
└──────────────────────────────────────────────────────────────────┘
```

### 📈 Sprint Metrics
- **Velocity Target:** 42 points
- **Team Capacity:** 2 devs × 10 days = 20 dev-days
- **Risk Level:** High (complex features)

### ✅ Definition of Done
- [ ] Rich text editor live with feature flag
- [ ] New template builder live with A/B test
- [ ] Email client testing passed (5+ clients)
- [ ] User testing completed
- [ ] Performance benchmarks met (<200ms)

---

## Sprint 3: Polish & Developer Experience
**Dates:** Week 5-6 | **Points:** 26 | **Theme:** Refine & Optimize

### 🎯 Sprint Goals
1. Create reusable user assignment component
2. Externalize AI prompts
3. Update branding
4. Polish all features

### 📋 Sprint Backlog

```
┌──────────────────────────────────────────────────────────────────┐
│ TO DO                                                            │
├──────────────────────────────────────────────────────────────────┤
│ 🟢 Task 006: Reusable Recruiter Assignment          [13 pts]    │
│    Assignee: Dev 1                                               │
│    Duration: Days 1-6                                            │
│    ├─ Create useUserSearch hook                      [3 pts]    │
│    ├─ Build UserAutocomplete                         [3 pts]    │
│    ├─ Create UserChip component                      [2 pts]    │
│    ├─ Build UserAssignmentModal                      [3 pts]    │
│    ├─ Migrate job assignment                         [1 pt]     │
│    └─ Write tests & docs                             [1 pt]     │
│                                                                  │
│ 🟢 Task 007: Externalize AI Instructions             [8 pts]    │
│    Assignee: Dev 2                                               │
│    Duration: Days 1-4                                            │
│    ├─ Install gray-matter                            [1 pt]     │
│    ├─ Create PromptLoader service                    [3 pts]    │
│    ├─ Create 3 prompt markdown files                 [2 pts]    │
│    ├─ Update AIService                               [1 pt]     │
│    └─ Write tests & docs                             [1 pt]     │
│                                                                  │
│ 🔵 Task 005: Aurora Logo Integration                 [5 pts]    │
│    Assignee: Dev 2                                               │
│    Duration: Days 5-6                                            │
│    ├─ Gather logo assets                             [1 pt]     │
│    ├─ Create AuroraLogo component                    [2 pts]    │
│    ├─ Update all logo references                     [1 pt]     │
│    └─ Update favicon & manifest                      [1 pt]     │
│                                                                  │
│ ✨ Polish & Testing                                  [8 pts]    │
│    Assignee: Both Devs + QA                                     │
│    Duration: Days 7-10                                           │
│    ├─ User acceptance testing                        [2 pts]    │
│    ├─ Performance optimization                       [2 pts]    │
│    ├─ Bug fixes                                      [2 pts]    │
│    ├─ Documentation updates                          [1 pt]     │
│    └─ Training materials                             [1 pt]     │
└──────────────────────────────────────────────────────────────────┘
```

### 📈 Sprint Metrics
- **Velocity Target:** 26 points
- **Team Capacity:** 2 devs × 10 days = 20 dev-days
- **Risk Level:** Low (polish & cleanup)

### ✅ Definition of Done
- [ ] All 7 tasks completed
- [ ] Zero critical bugs
- [ ] User satisfaction > 4.5/5
- [ ] All documentation complete
- [ ] Training materials ready

---

## 📊 Cumulative Progress

```
Story Points Completed
    90 │                                              ●
       │                                            ╱
    80 │                                          ╱
       │                                        ╱
    70 │                                      ╱
       │                                    ╱
    60 │                                  ╱
       │                                ╱
    50 │                              ●
       │                            ╱
    40 │                          ╱
       │                        ╱
    30 │                      ╱
       │                    ╱
    20 │                  ●
       │                ╱
    10 │              ╱
       │            ╱
     0 │__________●_____________________________________
       Start    S1      S2      S3      End
              (26)    (68)    (89)
```

---

## 👥 Resource Allocation

### Developer 1 (Backend/Full-stack)
```
Sprint 1: ████████░░ (8 days)  - Task 003 + Research
Sprint 2: ██████████ (10 days) - Task 002 (Rich Text)
Sprint 3: ██████████ (10 days) - Task 006 + Polish
```

### Developer 2 (Frontend)
```
Sprint 1: ██████████ (10 days) - Task 001 (Placeholders)
Sprint 2: ██████████ (10 days) - Task 004 (UX Redesign)
Sprint 3: ██████████ (10 days) - Task 007 + 005 + Polish
```

### QA (Part-time)
```
Sprint 1: ████░░░░░░ (4 days)  - Test fixes & guide
Sprint 2: ██████░░░░ (6 days)  - Email & UX testing
Sprint 3: █████░░░░░ (5 days)  - Integration & UAT
```

---

## 🎯 Success Metrics Dashboard

### Sprint 1 Targets
- [x] Critical bug fixed ✅
- [ ] Placeholder guide live
- [ ] Support tickets reduced by 30%
- [ ] Zero production bugs

### Sprint 2 Targets
- [ ] Rich text adoption > 90%
- [ ] Click reduction > 40%
- [ ] Email rendering 100% success
- [ ] User satisfaction > 4.5/5

### Sprint 3 Targets
- [ ] Component reused in 3+ places
- [ ] AI prompts externalized 100%
- [ ] Logo updated everywhere
- [ ] All documentation complete

---

## 🚨 Risk Heatmap

```
         Impact
         ↑
    High │ ⚠️ Email      │              │
         │ Compatibility │              │
         ├───────────────┼──────────────┤
  Medium │ 🔴 Bug Root   │ ⚠️ UX        │
         │ Cause         │ Acceptance   │
         ├───────────────┼──────────────┤
     Low │               │ 🟢 Logo      │
         │               │ Assets       │
         └───────────────┴──────────────┘
           Low      Medium      High
                Probability →
```

### Mitigation Strategies
- **🔴 Critical:** Daily monitoring, best developer assigned
- **⚠️ High:** Mid-sprint testing, user feedback loops
- **🟢 Low:** Standard monitoring, backup plans ready

---

## 📅 Key Milestones

```
Week 1  │ ● Sprint 1 Start
        │ ● Task 003 Complete
        │
Week 2  │ ● Task 001 Complete
        │ ● Sprint 1 Review
        │
Week 3  │ ● Sprint 2 Start
        │ ● Mid-sprint demos
        │
Week 4  │ ● Task 002 & 004 Complete
        │ ● Sprint 2 Review
        │
Week 5  │ ● Sprint 3 Start
        │ ● Task 006 & 007 Complete
        │
Week 6  │ ● Task 005 Complete
        │ ● Final Polish
        │ ● Project Complete 🎉
```

---

## 🎉 Sprint Ceremonies Schedule

### Sprint 1 (Weeks 1-2)
```
Mon W1  │ 9:00 AM  Sprint Planning (2h)
Daily   │ 9:00 AM  Standup (15min)
Fri W1  │ 2:00 PM  Mid-Sprint Check (1h)
Fri W2  │ 2:00 PM  Sprint Review (1h)
Fri W2  │ 3:30 PM  Retrospective (1h)
```

### Sprint 2 (Weeks 3-4)
```
Mon W3  │ 9:00 AM  Sprint Planning (2h)
Daily   │ 9:00 AM  Standup (15min)
Fri W3  │ 2:00 PM  Mid-Sprint Sync (1h)
Fri W4  │ 2:00 PM  Sprint Review (1.5h)
Fri W4  │ 4:00 PM  Retrospective (1h)
```

### Sprint 3 (Weeks 5-6)
```
Mon W5  │ 9:00 AM  Sprint Planning (2h)
Daily   │ 9:00 AM  Standup (15min)
Fri W5  │ 2:00 PM  Mid-Sprint Demo (1h)
Fri W6  │ 2:00 PM  Final Review (2h)
Fri W6  │ 4:30 PM  Project Retro (1.5h)
Fri W6  │ 6:00 PM  Celebration! 🎉
```

---

## 📝 Quick Reference

### Story Point Scale
- **1-2 pts:** Hours (trivial/simple)
- **3-5 pts:** Days (straightforward/moderate)
- **8-13 pts:** Days to week (complex/very complex)
- **21+ pts:** Weeks (epic)

### Priority Legend
- 🔴 **Critical:** Must complete, blocks other work
- 🟡 **High:** High user value, should complete
- 🟢 **Medium:** Important, complete if possible
- 🔵 **Low:** Nice to have, can defer

### Status Indicators
- ⭕ Not Started
- 🚧 In Progress
- 👀 In Review
- ✅ Done
- ❌ Blocked

---

**Last Updated:** December 25, 2025  
**Sprint Master:** TBD  
**Product Owner:** TBD
