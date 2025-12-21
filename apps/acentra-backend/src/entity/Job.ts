import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";
import { Candidate } from "./Candidate";
import { FeedbackTemplate } from "./FeedbackTemplate";

export enum JobStatus {
  OPEN = "open",
  CLOSED = "closed",
  DRAFT = "draft",
  PENDING_APPROVAL = "pending_approval",
  CHANGES_REQUIRED = "changes_required",
  REJECTED = "rejected"
}

@Entity()
export class Job {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true, type: "varchar" })
  tenantId: string;

  @Column({ type: "varchar" })
  title: string;

  @Column("text")
  description: string;

  @Column({ type: "varchar", nullable: true })
  jdFilePath: string;

  @Column("text", { nullable: true })
  jd: string;

  @Column({ type: "varchar", nullable: true })
  department: string;

  @Column({ type: "varchar", nullable: true })
  branch: string;

  @Column("simple-array", { nullable: true })
  tags: string[];

  @Column({
    type: "enum",
    enum: JobStatus,
    default: JobStatus.OPEN,
  })
  status: JobStatus;

  @Column({ type: "date", nullable: true, default: () => "CURRENT_DATE" })
  start_date: Date | null;

  @Column({ type: "date", nullable: true })
  expected_closing_date: Date | null;

  @Column({ type: "date", nullable: true })
  actual_closing_date: Date | null;

  @ManyToOne(() => User, (user) => user.jobs)
  created_by: User;

  @ManyToMany(() => User)
  @JoinTable()
  assignees: User[];

  @OneToMany(() => Candidate, (candidate) => candidate.job, { cascade: true })
  candidates: Candidate[];

  @ManyToMany(() => FeedbackTemplate, (template) => template.jobs, {
    lazy: true // Enable lazy loading for feedback templates
  })
  @JoinTable({
    name: 'job_feedback_templates',
    joinColumn: { name: 'job_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'feedback_template_id', referencedColumnName: 'id' }
  })
  feedbackTemplates: Promise<FeedbackTemplate[]>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: "decimal", nullable: true })
  budget: number;

  @Column({ type: "text", nullable: true })
  rejectionReason: string;

  @ManyToOne(() => User, { nullable: true })
  approved_by: User;

  @Column({ type: "timestamp", nullable: true })
  approved_at: Date;

  @Column({ type: "text", nullable: true })
  approval_comment: string;

  @ManyToOne(() => User, { nullable: true })
  rejected_by: User;

  @Column({ type: "timestamp", nullable: true })
  rejected_at: Date;
}
