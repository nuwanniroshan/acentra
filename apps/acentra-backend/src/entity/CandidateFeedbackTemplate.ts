import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Candidate } from "./Candidate";
import { FeedbackTemplate } from "./FeedbackTemplate";

export enum FeedbackStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed"
}

@Entity()
export class CandidateFeedbackTemplate {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true, type: "varchar" })
  tenantId: string;

  @ManyToOne(() => Candidate, (candidate) => candidate.id, { onDelete: "CASCADE" })
  candidate: Candidate;

  @ManyToOne(() => FeedbackTemplate, (template) => template.id, { onDelete: "CASCADE" })
  template: FeedbackTemplate;

  @Column({
    type: "enum",
    enum: FeedbackStatus,
    default: FeedbackStatus.NOT_STARTED
  })
  status: FeedbackStatus;

  @Column({ nullable: true, type: "varchar" })
  assignedBy: string; // User ID who assigned this template

  @Column({ nullable: true, type: "timestamp" })
  assignedAt: Date;

  @Column({ nullable: true, type: "varchar" })
  completedBy: string; // User ID who completed this template

  @Column({ nullable: true, type: "timestamp" })
  completedAt: Date;

  @Column({ type: "decimal", precision: 3, scale: 2, nullable: true })
  overallScore: number; // Calculated from rating questions

  @Column({ type: "text", nullable: true })
  generalComments: string;

  @Column({ default: false, type: "boolean" })
  isManuallyAssigned: boolean; // True if manually assigned by recruiter

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}