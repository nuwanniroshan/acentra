# Implement Permission-Based Role System

## Description
Instead of using fixed user roles, we want to implement a permission-based role system. This will allow for more granular control over what users can do within the application.

## Requirements
1.  **Actions as Permissions**:
    - Each capability in the system should be defined as an "Action" (Action Name).
    - These actions represent the fundamental permissions.

2.  **Role Management**:
    - Ability to define Roles.
    - Ability to assign specific Actions to Roles.
    - Ability to remove Actions from Roles.

3.  **Implementation Details**:
    - The mapping of Actions and default Roles should be hardcoded in the system for now.
    - Suggested location for these definitions: `libs/shared`.

## Acceptance Criteria
- [ ] A list of system Actions is defined (e.g., in an enum or constant).
- [ ] A structure for defining Roles and their associated Actions is created.
- [ ] The system checks for the presence of a specific Action (permission) rather than just a Role when authorizing requests/access.
