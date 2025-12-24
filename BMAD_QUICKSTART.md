# BMAD Development Quickstart Guide

Welcome! This guide will get you started with development using the BMAD Method.

## 1. Setup Your IDE
Ensure you are using an Agentic IDE (like Cursor, Windsurf, or Claude Code). 

## 2. Load Your Agents
Depending on your IDE, you can call BMAD agents using `@` or `/` commands:
- **PM**: `@pm` (Product Manager)
- **Architect**: `@architect`
- **Developer**: `@dev`
- **QA**: `@qa`

## 3. The Workflow
Follow these simple steps to implement a feature:

### Step A: Planning
Ask the PM to generate a PRD or Story from your requirements:
> `@pm help me create a story for [Feature Name] based on our vision in documentation/bmm/vision.md`

### Step B: Solutioning
Ask the Architect to define the technical approach:
> `@architect design the solution for this story based on documentation/bmm/infrastructure.md`

### Step C: Execution
Let the Developer implement the code:
> `@dev implement the tasks from the story and architect's design`

### Step D: Verification
Ask the QA agent to review:
> `@qa *review the changes for this story`

## 4. Key Documentation
- **Vision & Goals**: [vision.md](file:///Users/swiveltech/Disk/Swivel/acentra/documentation/bmm/vision.md)
- **Tech Strategy**: [strategy.md](file:///Users/swiveltech/Disk/Swivel/acentra/documentation/bmm/strategy.md)
- **Infrastructure**: [infrastructure.md](file:///Users/swiveltech/Disk/Swivel/acentra/documentation/bmm/infrastructure.md)
- **Roadmap**: [roadmap.md](file:///Users/swiveltech/Disk/Swivel/acentra/documentation/bmm/roadmap.md)

## 5. Tips
- **Commit Often**: BMAD works best when you commit after each story is "Done".
- **Compact Context**: If the conversation gets too long, ask the architect to "compact the context" and start a new session.

Ready to go? Try asking `@pm` to explain the next steps for the roadmap!
