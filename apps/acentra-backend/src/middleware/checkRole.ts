import { Request, Response, NextFunction } from "express";
import { UserRole, ActionPermission, ROLE_PERMISSIONS } from "@acentra/shared-types";
import { AppDataSource } from "@/data-source";
import { Job, JobStatus } from "@/entity/Job";

export const checkPermission = (permission: ActionPermission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      res.status(401).send("Unauthorized");
      return;
    }

    const userPermissions = ROLE_PERMISSIONS[user.role] || [];

    if (userPermissions.includes(permission)) {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  };
};

export const checkRole = (roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      res.status(401).send("Unauthorized");
      return;
    }

    if (
      roles.includes(user.role) ||
      user.role === UserRole.SUPER_ADMIN ||
      user.role === UserRole.ADMIN
    ) {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  };
};

export const checkJobOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const jobId = req.params.id;

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  
  if (userPermissions.includes(ActionPermission.MANAGE_ALL_JOBS)) {
    next();
    return;
  }

  if (!jobId) {
    res.status(400).send("Job ID required");
    return;
  }

  const jobRepository = AppDataSource.getRepository(Job);
  const job = await jobRepository.findOne({
    where: { id: jobId },
    relations: ["created_by"],
  });

  if (!job) {
    res.status(404).send("Job not found");
    return;
  }

  if (job.created_by.id === user.userId) {
    next();
  } else {
    res.status(403).send("Forbidden: You are not the owner of this job");
  }
};

import { logger } from "@acentra/logger";

export const checkJobAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const jobId = req.params.id || req.params.jobId || req.body.jobId;

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  logger.info(`🛡️ checkJobAssignment: User ${user.email} (${user.role}) accessing job ${jobId}`);

  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  
  // Check permissions instead of roles
  if (
    userPermissions.includes(ActionPermission.VIEW_ALL_CANDIDATES) ||
    userPermissions.includes(ActionPermission.MANAGE_ALL_JOBS) ||
    userPermissions.includes(ActionPermission.VIEW_ALL_JOBS)
  ) {
    logger.info(`✅ Access granted via permissions: ${userPermissions.filter(p => [ActionPermission.VIEW_ALL_CANDIDATES, ActionPermission.MANAGE_ALL_JOBS, ActionPermission.VIEW_ALL_JOBS].includes(p)).join(', ')}`);
    next();
    return;
  }

  if (!jobId) {
    res.status(400).send("Job ID required");
    return;
  }

  const jobRepository = AppDataSource.getRepository(Job);
  const job = await jobRepository.findOne({
    where: { id: jobId },
    relations: ["assignees", "created_by"],
  });

  if (!job) {
    res.status(404).send("Job not found");
    return;
  }

  const isAssigned =
    job.assignees.some((assignee) => assignee.id === user.userId) ||
    job.created_by.id === user.userId;

  if (isAssigned) {
    next();
  } else {
    res.status(403).send("Forbidden: You are not assigned to this job");
  }
};

export const checkJobNotClosed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const jobId = req.params.jobId || req.body.jobId;
  const candidateId = req.params.id || req.params.candidateId;

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  let job: Job | null = null;
  const jobRepository = AppDataSource.getRepository(Job);

  if (jobId) {
    job = await jobRepository.findOne({ where: { id: jobId } });
  } else if (candidateId) {
    // For status updates, we need to get the job through the candidate
    const candidateRepository = AppDataSource.getRepository("Candidate");
    const candidate = await candidateRepository.findOne({
      where: { id: candidateId },
      relations: ["job"],
    });
    if (candidate) {
      job = candidate.job;
    }
  }

  if (!job) {
    res.status(404).send("Job not found");
    return;
  }

  if (job.status === JobStatus.CLOSED) {
    res.status(400).send("Cannot modify closed job");
    return;
  }

  next();
};
