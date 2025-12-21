import { Router } from "express";
import { UserController, uploadProfilePicture } from "./controller/UserController";
import { JobController, uploadJdTemp } from "./controller/JobController";
import { CandidateController, upload } from "./controller/CandidateController";
import { CommentController } from "./controller/CommentController";
import { OfficeController } from "./controller/OfficeController";
import { DepartmentController } from "./controller/DepartmentController";
import { PipelineStatusController } from "./controller/PipelineStatusController";
import { PipelineHistoryController } from "./controller/PipelineHistoryController";
import { NotificationController } from "./controller/NotificationController";
import { TenantController } from "./controller/TenantController";
import { FeedbackTemplateController } from "./controller/FeedbackTemplateController";
import { FeedbackController } from "./controller/FeedbackController";
import { AiOverviewController } from "./controller/AiOverviewController";
import { checkRole, checkPermission, checkJobAssignment, checkJobOwnership, checkJobNotClosed } from "./middleware/checkRole";
import { UserRole, ActionPermission } from "@acentra/shared-types";
import { authMiddleware } from "@acentra/auth-utils";

import { PublicController } from "./controller/PublicController";

const router = Router();


// Note: Auth routes are handled by the separate auth-backend service
// Get JWT secret from environment
const auth = authMiddleware(process.env.JWT_SECRET || "secret");

// User routes
router.get("/users", auth, UserController.list);
router.delete("/users/:id", auth, checkPermission(ActionPermission.DELETE_USERS), UserController.delete);
router.patch("/users/:id/role", auth, checkPermission(ActionPermission.MANAGE_USER_ROLES), UserController.updateRole);
router.patch("/users/:id/profile", auth, UserController.updateProfile);
router.patch("/users/:id/toggle-active", auth, checkPermission(ActionPermission.MANAGE_USER_STATUS), UserController.toggleActive);
router.get("/users/:id/preferences", auth, UserController.getPreferences);
router.patch("/users/:id/preferences", auth, UserController.updatePreferences);
router.post("/users/:id/profile-picture", auth, uploadProfilePicture.single('profile_picture'), UserController.uploadProfilePictureHandler);

// Public profile picture route with tenantId in path for direct img tag usage
router.get("/public/:tenantId/users/:id/profile-picture", UserController.getPublicProfilePicture);

// Office routes
router.get("/offices", auth, OfficeController.list);
router.post("/offices", auth, checkPermission(ActionPermission.MANAGE_OFFICES), OfficeController.create);
router.delete("/offices/:id", auth, checkPermission(ActionPermission.MANAGE_OFFICES), OfficeController.delete);

// Department routes
router.get("/departments", auth, DepartmentController.list);
router.post("/departments", auth, checkPermission(ActionPermission.MANAGE_DEPARTMENTS), DepartmentController.create);
router.delete("/departments/:id", auth, checkPermission(ActionPermission.MANAGE_DEPARTMENTS), DepartmentController.delete);

// Job routes
router.post("/jobs", auth, checkPermission(ActionPermission.CREATE_JOBS), JobController.create);
router.post("/jobs/parse-jd", auth, checkPermission(ActionPermission.CREATE_JOBS), uploadJdTemp.single('jd'), JobController.parseJd);
router.get("/jobs", auth, JobController.list);
router.get("/jobs/:id", auth, JobController.getOne);
router.put("/jobs/:id", auth, checkJobOwnership, JobController.update);
router.delete("/jobs/:id", auth, checkJobOwnership, JobController.delete);
router.post("/jobs/:id/close", auth, checkJobOwnership, JobController.close);
router.post("/jobs/:id/assign", auth, checkJobOwnership, JobController.assign);
router.get("/jobs/:id/jd", auth, JobController.getJd);

// Candidate routes
router.post("/candidates", auth, checkPermission(ActionPermission.CREATE_CANDIDATES), upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'cover_letter', maxCount: 1 },
  { name: 'profile_picture', maxCount: 1 }
]), checkJobNotClosed, CandidateController.create);
router.get("/candidates", auth, CandidateController.getAll);
router.get("/jobs/:jobId/candidates", auth, checkJobAssignment, CandidateController.listByJob);
router.get("/candidates/:id/cv", auth, CandidateController.getCv);

// Public profile picture route for candidates
router.get("/public/:tenantId/candidates/:id/profile-picture", CandidateController.getPublicProfilePicture);
router.patch("/candidates/:id/status", auth, checkJobNotClosed, CandidateController.updateStatus);
router.patch("/candidates/:id/notes", auth, CandidateController.updateNotes);
router.patch("/candidates/:id/cv", auth, checkPermission(ActionPermission.UPLOAD_CV), upload.single('cv'), CandidateController.uploadCv);
router.get("/candidates/:id/pipeline-history", auth, PipelineHistoryController.getHistoryByCandidate);
router.delete("/candidates/:id", auth, CandidateController.delete);

// AI Overview routes
router.get("/candidates/:id/ai-overview", auth, AiOverviewController.getOverview);
router.post("/candidates/:id/ai-overview/generate", auth, AiOverviewController.generateOverview);

// Comment routes
router.post("/candidates/:candidateId/comments", auth, upload.single('attachment'), CommentController.create);
router.get("/candidates/:candidateId/comments", auth, CommentController.listByCandidate);

router.delete("/comments/:id/attachment", auth, CommentController.deleteAttachment);
router.get("/public/:tenantId/comments/:id/attachment", CommentController.getPublicAttachment);

// Pipeline Status routes
const pipelineStatusController = new PipelineStatusController();
router.get("/pipeline-statuses", auth, (req, res) => pipelineStatusController.getAll(req, res));
router.post("/pipeline-statuses", auth, checkPermission(ActionPermission.MANAGE_PIPELINE_STATUS), (req, res) => pipelineStatusController.create(req, res));
router.put("/pipeline-statuses/order", auth, checkPermission(ActionPermission.MANAGE_PIPELINE_STATUS), (req, res) => pipelineStatusController.updateOrder(req, res));
router.patch("/pipeline-statuses/:id", auth, checkPermission(ActionPermission.MANAGE_PIPELINE_STATUS), (req, res) => pipelineStatusController.update(req, res));
router.delete("/pipeline-statuses/:id", auth, checkPermission(ActionPermission.MANAGE_PIPELINE_STATUS), (req, res) => pipelineStatusController.delete(req, res));

// Notification routes
const notificationController = new NotificationController();
router.get("/notifications", auth, (req, res) => notificationController.getNotifications(req, res));
router.get("/notifications/unread-count", auth, (req, res) => notificationController.getUnreadCount(req, res));
router.patch("/notifications/read", auth, (req, res) => notificationController.markAsRead(req, res));

// Feedback Template routes
const feedbackTemplateController = new FeedbackTemplateController();
router.get("/feedback-templates", auth, checkPermission(ActionPermission.VIEW_FEEDBACK_TEMPLATES), (req, res) => feedbackTemplateController.getAllTemplates(req, res));
router.get("/feedback-templates/:id", auth, checkPermission(ActionPermission.VIEW_FEEDBACK_TEMPLATES), (req, res) => feedbackTemplateController.getTemplateById(req, res));
router.post("/feedback-templates", auth, checkPermission(ActionPermission.MANAGE_FEEDBACK_TEMPLATES), (req, res) => feedbackTemplateController.createTemplate(req, res));
router.put("/feedback-templates/:id", auth, checkPermission(ActionPermission.MANAGE_FEEDBACK_TEMPLATES), (req, res) => feedbackTemplateController.updateTemplate(req, res));
router.delete("/feedback-templates/:id", auth, checkPermission(ActionPermission.MANAGE_FEEDBACK_TEMPLATES), (req, res) => feedbackTemplateController.deleteTemplate(req, res));
router.get("/feedback-templates/type/:type", auth, checkPermission(ActionPermission.VIEW_FEEDBACK_TEMPLATES), (req, res) => feedbackTemplateController.getTemplatesByType(req, res));
router.post("/feedback-templates/:id/clone", auth, checkPermission(ActionPermission.MANAGE_FEEDBACK_TEMPLATES), (req, res) => feedbackTemplateController.cloneTemplate(req, res));

// Feedback routes
const feedbackController = new FeedbackController();
router.get("/candidates/:candidateId/feedback", auth, (req, res) => feedbackController.getCandidateFeedback(req, res));
router.get("/feedback/:feedbackId", auth, (req, res) => feedbackController.getFeedbackDetails(req, res));
router.post("/candidates/:candidateId/feedback/attach", auth, checkPermission(ActionPermission.ATTACH_FEEDBACK), (req, res) => feedbackController.attachTemplate(req, res));
router.delete("/feedback/:feedbackId", auth, checkPermission(ActionPermission.REMOVE_FEEDBACK), (req, res) => feedbackController.removeTemplate(req, res));
router.post("/feedback/:feedbackId/responses", auth, (req, res) => feedbackController.saveResponse(req, res));
router.patch("/feedback/:feedbackId/complete", auth, (req, res) => feedbackController.completeFeedback(req, res));
router.post("/candidates/:candidateId/feedback/auto-attach", auth, (req, res) => feedbackController.autoAttachTemplates(req, res));
router.get("/feedback/stats", auth, checkPermission(ActionPermission.MANAGE_FEEDBACK_TEMPLATES), (req, res) => feedbackController.getFeedbackStats(req, res));

// Demo Request route (Public)
router.post("/public/request-demo", PublicController.requestDemo);

// Tenant routes (Public)
router.get("/tenants/:name/check", TenantController.check);

export default router;
