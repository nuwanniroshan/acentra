"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = exports.NotificationType = exports.JobStatus = exports.ActionPermission = exports.UserRole = void 0;
// User types
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["ADMIN"] = "admin";
    UserRole["HR"] = "hr";
    UserRole["HIRING_MANAGER"] = "hiring_manager";
    UserRole["RECRUITER"] = "recruiter";
    UserRole["INTERVIEWER"] = "interviewer";
    UserRole["FINANCE_APPROVER"] = "finance_approver";
    UserRole["EMPLOYEE"] = "employee";
    UserRole["SYSTEM"] = "system";
})(UserRole || (exports.UserRole = UserRole = {}));
var ActionPermission;
(function (ActionPermission) {
    // User Management
    ActionPermission["LIST_USERS"] = "list_users";
    ActionPermission["DELETE_USERS"] = "delete_users";
    ActionPermission["MANAGE_USER_ROLES"] = "manage_user_roles";
    ActionPermission["MANAGE_USER_STATUS"] = "manage_user_status";
    // Organization Management
    ActionPermission["MANAGE_OFFICES"] = "manage_offices";
    ActionPermission["MANAGE_DEPARTMENTS"] = "manage_departments";
    // Job Management
    ActionPermission["CREATE_JOBS"] = "create_jobs";
    ActionPermission["MANAGE_ALL_JOBS"] = "manage_all_jobs";
    ActionPermission["VIEW_ALL_JOBS"] = "view_all_jobs";
    ActionPermission["VIEW_APPROVAL_DETAILS"] = "view_approval_details";
    // Candidate Management
    ActionPermission["CREATE_CANDIDATES"] = "create_candidates";
    ActionPermission["VIEW_ALL_CANDIDATES"] = "view_all_candidates";
    ActionPermission["UPLOAD_CV"] = "upload_cv";
    ActionPermission["MANAGE_CANDIDATE_STATUS"] = "manage_candidate_status";
    ActionPermission["MANAGE_CANDIDATES"] = "manage_candidates";
    // Pipeline Management
    ActionPermission["MANAGE_PIPELINE_STATUS"] = "manage_pipeline_status";
    // Feedback Management
    ActionPermission["MANAGE_FEEDBACK_TEMPLATES"] = "manage_feedback_templates";
    ActionPermission["VIEW_FEEDBACK_TEMPLATES"] = "view_feedback_templates";
    ActionPermission["ATTACH_FEEDBACK"] = "attach_feedback";
    ActionPermission["REMOVE_FEEDBACK"] = "remove_feedback";
})(ActionPermission || (exports.ActionPermission = ActionPermission = {}));
// Job types
var JobStatus;
(function (JobStatus) {
    JobStatus["OPEN"] = "open";
    JobStatus["CLOSED"] = "closed";
    JobStatus["DRAFT"] = "draft";
    JobStatus["PENDING_APPROVAL"] = "pending_approval";
    JobStatus["CHANGES_REQUIRED"] = "changes_required";
    JobStatus["REJECTED"] = "rejected";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
// Notification types
var NotificationType;
(function (NotificationType) {
    NotificationType["JOB_CREATED"] = "job_created";
    NotificationType["CANDIDATE_ADDED"] = "candidate_added";
    NotificationType["PIPELINE_STATUS_CHANGED"] = "pipeline_status_changed";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
// ROLE_PERMISSIONS
exports.ROLE_PERMISSIONS = {
    [UserRole.SUPER_ADMIN]: Object.values(ActionPermission),
    [UserRole.ADMIN]: Object.values(ActionPermission).filter(p => p !== ActionPermission.CREATE_JOBS),
    [UserRole.HR]: [
        ActionPermission.LIST_USERS,
        ActionPermission.MANAGE_OFFICES,
        ActionPermission.MANAGE_DEPARTMENTS,
        // ActionPermission.CREATE_JOBS, // HR cannot create jobs
        ActionPermission.MANAGE_ALL_JOBS,
        ActionPermission.VIEW_ALL_JOBS,
        ActionPermission.CREATE_CANDIDATES,
        ActionPermission.VIEW_ALL_CANDIDATES,
        ActionPermission.UPLOAD_CV,
        ActionPermission.MANAGE_CANDIDATE_STATUS,
        ActionPermission.MANAGE_FEEDBACK_TEMPLATES,
        ActionPermission.VIEW_FEEDBACK_TEMPLATES,
        ActionPermission.ATTACH_FEEDBACK,
        ActionPermission.REMOVE_FEEDBACK,
        ActionPermission.VIEW_APPROVAL_DETAILS,
    ],
    [UserRole.HIRING_MANAGER]: [
        ActionPermission.CREATE_JOBS,
        ActionPermission.CREATE_CANDIDATES, // Based on routes checkRole([..., HIRING_MANAGER...])
        ActionPermission.VIEW_FEEDBACK_TEMPLATES,
        ActionPermission.ATTACH_FEEDBACK,
        ActionPermission.REMOVE_FEEDBACK,
        // Hiring managers typically view candidates for their jobs (handled by business logic/other checks), 
        // but might not have VIEW_ALL_CANDIDATES
    ],
    [UserRole.RECRUITER]: [
        ActionPermission.VIEW_ALL_JOBS,
        ActionPermission.CREATE_CANDIDATES,
        ActionPermission.UPLOAD_CV,
        ActionPermission.ATTACH_FEEDBACK,
        ActionPermission.REMOVE_FEEDBACK,
        ActionPermission.VIEW_ALL_CANDIDATES,
        ActionPermission.VIEW_FEEDBACK_TEMPLATES,
    ],
    [UserRole.INTERVIEWER]: [
    // Basic permissions usually implied by auth, specific ones can be added here
    ],
    [UserRole.FINANCE_APPROVER]: [],
    [UserRole.EMPLOYEE]: [],
    [UserRole.SYSTEM]: Object.values(ActionPermission),
};
//# sourceMappingURL=index.js.map