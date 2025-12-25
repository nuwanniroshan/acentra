# Sprint Planning: Template & UX Improvements

**Project:** Acentra ATS - Template & UX Improvements  
**Planning Date:** December 25, 2025  
**Sprint Duration:** 2 weeks per sprint  
**Team Size:** Assumed 2-3 developers  
**Total Sprints:** 3 sprints (6 weeks)

---

## Executive Summary

This sprint plan breaks down 7 implementation tasks into 3 two-week sprints, prioritizing critical fixes first, then high-value UX improvements, and finally developer experience enhancements.

**Total Story Points:** 89 points  
**Estimated Duration:** 6 weeks (3 sprints)  
**Risk Level:** Medium

---

## Story Point Estimation

### Fibonacci Scale Reference
- **1 point:** < 2 hours (trivial)
- **2 points:** 2-4 hours (simple)
- **3 points:** 4-8 hours (straightforward)
- **5 points:** 1-2 days (moderate)
- **8 points:** 2-3 days (complex)
- **13 points:** 3-5 days (very complex)
- **21 points:** 1-2 weeks (epic)

### Task Breakdown with Story Points

| Task | Description | Story Points | Priority | Dependencies |
|------|-------------|--------------|----------|--------------|
| 003 | Fix Feedback Template Edit Bug | 8 | Critical | None |
| 001 | Email Template Placeholder Guide | 13 | High | None |
| 002 | Rich Text Editor for Email Templates | 21 | Medium | Task 001 |
| 004 | Feedback Template UX Redesign | 21 | Medium | Task 003 |
| 006 | Reusable Recruiter Assignment Component | 13 | Medium | None |
| 007 | Externalize AI Instructions | 8 | Medium | None |
| 005 | Aurora Logo Integration | 5 | Low | None |
| **TOTAL** | | **89** | | |

---

## Sprint 1: Critical Fixes & Foundation (Weeks 1-2)

**Theme:** Fix critical bugs and establish foundation for UX improvements  
**Total Story Points:** 26  
**Velocity Target:** 26 points (2 developers × 13 points/week)

### Sprint Goals
1. ✅ Fix feedback template edit bug (critical blocker)
2. ✅ Add email template placeholder guide (high user value)
3. ✅ Prepare foundation for rich text editor

### Sprint Backlog

#### 🔴 Critical
**Task 003: Fix Feedback Template Edit Bug** - 8 points
- **Assignee:** Developer 1 (Backend + Frontend)
- **Duration:** Days 1-3
- **Subtasks:**
  - [ ] Investigate backend API (FeedbackTemplateController) - 2 pts
  - [ ] Verify entity relationships and eager loading - 2 pts
  - [ ] Fix frontend state management - 2 pts
  - [ ] Add loading states and error handling - 1 pt
  - [ ] Write integration tests - 1 pt
- **Acceptance Criteria:**
  - Questions load correctly when editing template
  - No console errors
  - Loading state shows during fetch
  - Error handling works properly
- **Definition of Done:**
  - Code reviewed and merged
  - All tests passing
  - Deployed to staging
  - QA verified

#### 🟡 High Priority
**Task 001: Email Template Placeholder Guide** - 13 points
- **Assignee:** Developer 2 (Frontend)
- **Duration:** Days 1-7
- **Subtasks:**
  - [ ] Create placeholder definitions file - 2 pts
  - [ ] Build PlaceholderChip component - 2 pts
  - [ ] Build PlaceholderGuide component - 3 pts
  - [ ] Integrate with EmailTemplateManager - 2 pts
  - [ ] Add search/filter functionality - 2 pts
  - [ ] Write unit tests - 2 pts
- **Acceptance Criteria:**
  - All 12+ placeholders documented
  - Click-to-copy works
  - Search filters placeholders
  - Accessible (keyboard navigation)
- **Definition of Done:**
  - Component fully functional
  - Tests passing (>80% coverage)
  - Documentation updated
  - Design review approved

#### 📝 Preparation
**Task 002 Prep: Rich Text Editor Research** - 5 points
- **Assignee:** Developer 1 (Days 4-5)
- **Subtasks:**
  - [ ] Evaluate Lexical vs Tiptap - 2 pts
  - [ ] Create proof of concept - 2 pts
  - [ ] Document integration approach - 1 pt

### Sprint Ceremonies

**Sprint Planning:** Day 0 (2 hours)
- Review and estimate all tasks
- Assign tasks to developers
- Identify risks and dependencies

**Daily Standups:** Every day (15 minutes)
- What did you do yesterday?
- What will you do today?
- Any blockers?

**Mid-Sprint Check-in:** Day 5 (1 hour)
- Review progress on Task 003
- Adjust if needed

**Sprint Review:** Day 10 (1 hour)
- Demo fixed template edit
- Demo placeholder guide
- Gather stakeholder feedback

**Sprint Retrospective:** Day 10 (1 hour)
- What went well?
- What could be improved?
- Action items for next sprint

### Sprint Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Task 003 takes longer than expected | High | Start immediately, allocate best developer |
| Placeholder guide design changes | Medium | Get design approval early |
| Developer availability | Medium | Have backup developer identified |

### Sprint Success Metrics

- [ ] Task 003 completed and deployed
- [ ] Task 001 completed and deployed
- [ ] Zero critical bugs introduced
- [ ] All tests passing
- [ ] User feedback positive on placeholder guide

---

## Sprint 2: Major UX Improvements (Weeks 3-4)

**Theme:** Deliver major UX enhancements for templates  
**Total Story Points:** 42  
**Velocity Target:** 42 points (2 developers × 21 points/week)

### Sprint Goals
1. ✅ Implement rich text editor for email templates
2. ✅ Redesign feedback template interface
3. ✅ Improve overall template creation experience

### Sprint Backlog

#### 🟢 Medium Priority (High Value)
**Task 002: Rich Text Editor for Email Templates** - 21 points
- **Assignee:** Developer 1 (Full sprint)
- **Duration:** Days 1-10
- **Subtasks:**
  - [ ] Install and configure Lexical - 2 pts
  - [ ] Create RichTextEditor component - 5 pts
  - [ ] Build EditorToolbar component - 3 pts
  - [ ] Implement PlaceholderPlugin - 5 pts
  - [ ] Create EmailPreview component - 3 pts
  - [ ] Update backend for HTML emails - 2 pts
  - [ ] Write tests and email client testing - 1 pt
- **Acceptance Criteria:**
  - Rich text formatting works (bold, italic, lists, links)
  - Placeholders preserved in rich text
  - Preview mode accurate
  - HTML output email-client compatible
  - Backward compatible with plain text
- **Definition of Done:**
  - Tested on 5+ email clients
  - Migration strategy documented
  - Feature flag implemented
  - Deployed to staging

**Task 004: Feedback Template UX Redesign** - 21 points
- **Assignee:** Developer 2 (Full sprint)
- **Duration:** Days 1-10
- **Subtasks:**
  - [ ] Install @dnd-kit dependencies - 1 pt
  - [ ] Create TemplateBuilderPanel (slide-out) - 5 pts
  - [ ] Build QuestionList with drag-and-drop - 5 pts
  - [ ] Create QuestionCard (collapsible) - 4 pts
  - [ ] Implement useTemplateBuilder hook - 3 pts
  - [ ] Add animations and polish - 2 pts
  - [ ] Write tests - 1 pt
- **Acceptance Criteria:**
  - Slide-out panel replaces modal
  - Drag-and-drop reordering works
  - Click count reduced by 40%+
  - Accessible and responsive
- **Definition of Done:**
  - A/B testing framework ready
  - User testing completed
  - Performance benchmarks met
  - Feature flag implemented

### Sprint Ceremonies

**Sprint Planning:** Day 0 (2 hours)
- Review Sprint 1 outcomes
- Plan Sprint 2 tasks
- Identify integration points

**Daily Standups:** Every day (15 minutes)

**Mid-Sprint Sync:** Day 5 (1 hour)
- Demo progress on both tasks
- Discuss integration challenges
- Adjust timeline if needed

**Sprint Review:** Day 10 (1.5 hours)
- Demo rich text editor
- Demo new template builder
- Gather user feedback
- Plan A/B testing

**Sprint Retrospective:** Day 10 (1 hour)

### Sprint Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Rich text editor email compatibility issues | High | Test early and often on multiple clients |
| Drag-and-drop UX not intuitive | Medium | User testing mid-sprint |
| Performance issues with large templates | Medium | Performance testing on day 7 |
| Scope creep on UX redesign | Medium | Stick to defined acceptance criteria |

### Sprint Success Metrics

- [ ] 90% of new templates use rich text
- [ ] 50% reduction in clicks for template creation
- [ ] User satisfaction > 4.5/5
- [ ] No email rendering issues
- [ ] Performance < 200ms for all interactions

---

## Sprint 3: Polish & Developer Experience (Weeks 5-6)

**Theme:** Reusable components and developer experience improvements  
**Total Story Points:** 26  
**Velocity Target:** 26 points (2 developers × 13 points/week)

### Sprint Goals
1. ✅ Create reusable user assignment component
2. ✅ Externalize AI prompts for easier maintenance
3. ✅ Update branding with Aurora logo
4. ✅ Polish and optimize all features

### Sprint Backlog

#### 🟢 Medium Priority
**Task 006: Reusable Recruiter Assignment Component** - 13 points
- **Assignee:** Developer 1 (Days 1-6)
- **Duration:** Days 1-6
- **Subtasks:**
  - [ ] Create useUserSearch hook - 3 pts
  - [ ] Build UserAutocomplete component - 3 pts
  - [ ] Create UserChip component - 2 pts
  - [ ] Build UserAssignmentModal - 3 pts
  - [ ] Migrate job assignment - 1 pt
  - [ ] Write tests and documentation - 1 pt
- **Acceptance Criteria:**
  - Component works with any user role
  - Autocomplete search with debounce
  - Chip-based selection
  - Reused in 3+ features
- **Definition of Done:**
  - Old UserAssignmentModal removed
  - Used in jobs, candidates, feedback
  - Tests passing
  - Storybook stories added

**Task 007: Externalize AI Instructions** - 8 points
- **Assignee:** Developer 2 (Days 1-4)
- **Duration:** Days 1-4
- **Subtasks:**
  - [ ] Install gray-matter - 1 pt
  - [ ] Create PromptLoader service - 3 pts
  - [ ] Create 3 prompt markdown files - 2 pts
  - [ ] Update AIService - 1 pt
  - [ ] Write tests and documentation - 1 pt
- **Acceptance Criteria:**
  - All AI prompts in markdown files
  - Variable interpolation works
  - No breaking changes to AI features
  - Documentation complete
- **Definition of Done:**
  - All prompts externalized
  - Testing utility functional
  - README documentation complete
  - Deployed to production

#### 🔵 Low Priority
**Task 005: Aurora Logo Integration** - 5 points
- **Assignee:** Developer 2 (Days 5-6)
- **Duration:** Days 5-6
- **Subtasks:**
  - [ ] Gather logo assets - 1 pt
  - [ ] Create AuroraLogo component - 2 pts
  - [ ] Update all logo references - 1 pt
  - [ ] Update favicon and manifest - 1 pt
- **Acceptance Criteria:**
  - Logo in all interfaces
  - Theme variants work
  - Responsive (full/icon)
  - Favicon updated
- **Definition of Done:**
  - All 22 assets in place
  - Logo usage guidelines documented
  - Cross-browser tested
  - Deployed to production

### Polish & Testing (Days 7-10)

**Both Developers**
- [ ] User acceptance testing - 2 pts
- [ ] Performance optimization - 2 pts
- [ ] Bug fixes from testing - 2 pts
- [ ] Documentation updates - 1 pt
- [ ] Training materials - 1 pt

### Sprint Ceremonies

**Sprint Planning:** Day 0 (2 hours)

**Daily Standups:** Every day (15 minutes)

**Mid-Sprint Demo:** Day 5 (1 hour)
- Demo reusable assignment component
- Demo externalized AI prompts
- Show new logo

**Sprint Review:** Day 10 (2 hours)
- Demo all completed features
- Full system walkthrough
- Stakeholder sign-off
- Celebrate wins! 🎉

**Sprint Retrospective:** Day 10 (1.5 hours)
- Review entire project
- Document lessons learned
- Plan future enhancements

### Sprint Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Logo assets not ready | Low | Have placeholder ready |
| AI prompt changes break features | Medium | Comprehensive testing |
| Integration issues across features | Medium | Integration testing on day 7 |

### Sprint Success Metrics

- [ ] All 7 tasks completed
- [ ] Zero critical bugs
- [ ] User satisfaction > 4.5/5
- [ ] Performance maintained
- [ ] Documentation complete

---

## Resource Allocation

### Developer 1 (Full-Stack, Backend Focus)
**Sprint 1:**
- Task 003: Fix Feedback Template Edit (Days 1-3)
- Task 002 Prep: Rich Text Research (Days 4-5)
- Support Task 001 if needed (Days 6-10)

**Sprint 2:**
- Task 002: Rich Text Editor (Full sprint)

**Sprint 3:**
- Task 006: Reusable Assignment Component (Days 1-6)
- Polish & Testing (Days 7-10)

**Total Allocation:** 6 weeks

---

### Developer 2 (Frontend Focus)
**Sprint 1:**
- Task 001: Email Placeholder Guide (Full sprint)

**Sprint 2:**
- Task 004: Feedback Template UX Redesign (Full sprint)

**Sprint 3:**
- Task 007: Externalize AI Instructions (Days 1-4)
- Task 005: Aurora Logo Integration (Days 5-6)
- Polish & Testing (Days 7-10)

**Total Allocation:** 6 weeks

---

### Optional: Developer 3 (Part-time QA/Testing)
**Sprint 1:**
- Test Task 003 fixes
- Test Task 001 placeholder guide

**Sprint 2:**
- Email client testing for Task 002
- User testing for Task 004

**Sprint 3:**
- Integration testing
- User acceptance testing
- Performance testing

**Total Allocation:** 2-3 weeks (part-time)

---

## Velocity Tracking

### Expected Velocity (2 developers)
- **Sprint 1:** 26 points (13 points/developer/week)
- **Sprint 2:** 42 points (21 points/developer/week)
- **Sprint 3:** 26 points (13 points/developer/week)
- **Average:** 31 points/sprint

### Velocity Adjustments
If velocity is lower than expected:
- **Sprint 1 < 20 points:** Reduce Sprint 2 scope, move Task 004 to Sprint 3
- **Sprint 2 < 35 points:** Extend Sprint 3 by 1 week
- **Sprint 3 < 20 points:** Move Task 005 to future sprint

If velocity is higher than expected:
- Add polish tasks
- Add documentation
- Add training materials
- Start future enhancements

---

## Dependencies & Critical Path

### Critical Path
```
Task 003 (Sprint 1) → Task 004 (Sprint 2)
Task 001 (Sprint 1) → Task 002 (Sprint 2)
```

### Parallel Tracks
```
Track 1: Task 003 → Task 004 → Polish
Track 2: Task 001 → Task 002 → Polish
Track 3: Task 006 → Task 007 → Task 005 → Polish
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|------------|--------|
| 001 | None | 002 |
| 002 | 001 | None |
| 003 | None | 004 |
| 004 | 003 | None |
| 005 | None | None |
| 006 | None | None |
| 007 | None | None |

---

## Risk Management

### High Risk Items
1. **Email Client Compatibility (Task 002)**
   - **Mitigation:** Test on Gmail, Outlook, Apple Mail early
   - **Contingency:** Fallback to plain text mode

2. **Template Edit Bug Root Cause (Task 003)**
   - **Mitigation:** Allocate best backend developer
   - **Contingency:** Pair programming if stuck

3. **UX Redesign User Acceptance (Task 004)**
   - **Mitigation:** User testing mid-sprint
   - **Contingency:** Keep old UI as fallback

### Medium Risk Items
1. **Drag-and-Drop Performance**
   - **Mitigation:** Performance testing on day 7
   - **Contingency:** Simplify animations

2. **AI Prompt Externalization**
   - **Mitigation:** Comprehensive testing
   - **Contingency:** Rollback capability

### Low Risk Items
1. **Logo Integration**
   - **Mitigation:** Simple task, low complexity
   - **Contingency:** Use placeholder if assets delayed

---

## Definition of Ready (DoR)

Before a task enters a sprint:
- [ ] Requirements clearly defined
- [ ] Acceptance criteria documented
- [ ] Dependencies identified
- [ ] Story points estimated
- [ ] Assignee identified
- [ ] Design mockups available (if applicable)
- [ ] Technical approach agreed upon

---

## Definition of Done (DoD)

For a task to be considered complete:
- [ ] Code written and follows standards
- [ ] Unit tests written (>80% coverage)
- [ ] Integration tests written (where applicable)
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] QA tested and approved
- [ ] Acceptance criteria met
- [ ] No critical bugs
- [ ] Performance benchmarks met

---

## Sprint Metrics & KPIs

### Sprint Health Metrics
- **Velocity:** Actual vs. planned story points
- **Burndown:** Daily progress tracking
- **Cycle Time:** Time from start to done
- **Bug Count:** Bugs introduced per sprint
- **Code Coverage:** Test coverage percentage

### Business Metrics
- **User Satisfaction:** Survey score (target > 4.5/5)
- **Support Tickets:** Reduction in template-related tickets
- **Feature Adoption:** % of users using new features
- **Performance:** Page load times, interaction times

### Quality Metrics
- **Bug Escape Rate:** Bugs found in production
- **Test Coverage:** % of code covered by tests
- **Code Review Time:** Average time for PR review
- **Technical Debt:** New debt introduced

---

## Communication Plan

### Daily
- **Standup:** 9:00 AM (15 minutes)
- **Slack Updates:** As needed in #template-improvements channel

### Weekly
- **Progress Report:** Every Friday to stakeholders
- **Demo:** Every Friday to product team (optional)

### Bi-Weekly
- **Sprint Review:** End of each sprint
- **Sprint Retrospective:** End of each sprint
- **Sprint Planning:** Start of each sprint

### Ad-Hoc
- **Design Reviews:** As needed
- **Technical Discussions:** As needed
- **Stakeholder Check-ins:** As requested

---

## Rollout Plan

### Sprint 1 Rollout
- **Task 003:** Deploy to production immediately after QA
- **Task 001:** Deploy to production, monitor for issues

### Sprint 2 Rollout
- **Task 002:** Feature flag rollout (25% → 50% → 100%)
- **Task 004:** A/B test (50% old UI, 50% new UI)

### Sprint 3 Rollout
- **Task 006:** Deploy to production, monitor usage
- **Task 007:** Deploy to production, monitor AI features
- **Task 005:** Deploy to production

### Rollback Plan
- Feature flags allow instant rollback
- Database migrations are reversible
- Previous version tagged in git

---

## Success Criteria

### Project Success
- [ ] All 7 tasks completed within 6 weeks
- [ ] Zero critical bugs in production
- [ ] User satisfaction > 4.5/5
- [ ] 80% reduction in template-related support tickets
- [ ] 50% reduction in clicks for template creation
- [ ] 90% of new templates use rich text

### Sprint Success
- [ ] Sprint 1: Critical bug fixed, placeholder guide live
- [ ] Sprint 2: Rich text editor live, new template UX live
- [ ] Sprint 3: All polish items complete, project wrapped

---

## Post-Sprint Activities

### Sprint 1
- [ ] Monitor feedback template edit success rate
- [ ] Track placeholder guide usage
- [ ] Gather user feedback

### Sprint 2
- [ ] Monitor rich text editor adoption
- [ ] Track template creation time reduction
- [ ] A/B test results analysis

### Sprint 3
- [ ] Monitor reusable component usage
- [ ] Track AI prompt update frequency
- [ ] Final project retrospective

### Future Enhancements
- Template library with pre-designed layouts
- Drag-and-drop email builder
- AI-powered template suggestions
- Template analytics dashboard

---

## Budget & Resources

### Development Time
- **2 Developers × 6 weeks:** 60 developer-days
- **QA/Testing (part-time):** 15 QA-days
- **Total:** 75 person-days

### External Resources
- **Design Assets:** Logo files (Task 005)
- **Email Testing Tools:** Litmus or Email on Acid
- **Performance Monitoring:** Existing tools

### Training
- Lexical documentation review (2 hours)
- @dnd-kit documentation review (2 hours)
- Team knowledge sharing sessions (3 hours)

---

## Appendix

### A. Sprint Board Template

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   TO DO     │ IN PROGRESS │   REVIEW    │    DONE     │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ Task 003    │             │             │             │
│ (8 pts)     │             │             │             │
│             │             │             │             │
│ Task 001    │             │             │             │
│ (13 pts)    │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### B. Burndown Chart Template

```
Story Points
    26 │ ●
       │   ╲
    20 │     ●
       │       ╲
    15 │         ●
       │           ╲
    10 │             ●
       │               ╲
     5 │                 ●
       │                   ╲
     0 │___________________●
       Day 1  3  5  7  9  10
```

### C. Velocity Chart Template

```
Story Points
    45 │
       │     ┌──┐
    40 │     │  │
       │     │  │
    35 │     │  │
       │     │  │
    30 │     │  │
       │     │  │
    25 │┌──┐ │  │ ┌──┐
       │└──┘ └──┘ └──┘
     0 │_______________
       S1   S2   S3
```

---

**Last Updated:** December 25, 2025  
**Next Review:** End of Sprint 1  
**Document Owner:** Scrum Master / Project Manager
