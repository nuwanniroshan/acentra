import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from "typeorm";
import { FeedbackQuestion } from "./FeedbackQuestion";
import { Job } from "./Job";

export enum FeedbackTemplateType {
  PHONE_SCREENING = "phone_screening",
  TECHNICAL_INTERVIEW = "technical_interview",
  MANAGER_FEEDBACK = "manager_feedback",
  HR_FEEDBACK = "hr_feedback",
  BEHAVIORAL_INTERVIEW = "behavioral_interview"
}

export enum StageTemplateMapping {
  NEW = "new",
  SHORTLISTED = "shortlisted",
  INTERVIEW_SCHEDULED = "interview_scheduled",
  PHONE_SCREENING = "phone_screening",
  TECHNICAL_INTERVIEW = "technical_interview",
  MANAGER_ROUND = "manager_round",
  HR_ROUND = "hr_round",
  OFFER = "offer",
  HIRED = "hired",
  REJECTED = "rejected"
}

@Entity()
export class FeedbackTemplate {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  tenantId: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({
    type: "enum",
    enum: FeedbackTemplateType,
  })
  type: FeedbackTemplateType;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", nullable: true })
  category: string;

  @Column({ type: "text", nullable: true })
  instructions: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "json", nullable: true })
  stageMappings: string[]; // Array of stage names this template auto-attaches to

  @Column({ type: "json", nullable: true })
  jobTypeMappings: string[]; // Array of job types/positions this template auto-attaches to

  @Column({ type: "int", default: 1 })
  version: number;

  @Column({ nullable: true })
  createdBy: string;

  @OneToMany(() => FeedbackQuestion, (question) => question.template, { cascade: true })
  questions: FeedbackQuestion[];

  @ManyToMany(() => Job, (job) => job.feedbackTemplates)
  jobs: Job[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}