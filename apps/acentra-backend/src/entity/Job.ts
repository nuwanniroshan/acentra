import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";
import { Candidate } from "./Candidate";
import { FeedbackTemplate } from "./FeedbackTemplate";

export enum JobStatus {
  OPEN = "open",
  CLOSED = "closed",
}

@Entity()
export class Job {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  tenantId: string;

  @Column({ type: "varchar" })
  title: string;

  @Column("text")
  description: string;

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

  @OneToMany(() => Candidate, (candidate) => candidate.job)
  candidates: Candidate[];

  @ManyToMany(() => FeedbackTemplate, (template) => template.jobs)
  @JoinTable({
    name: 'job_feedback_templates',
    joinColumn: { name: 'job_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'feedback_template_id', referencedColumnName: 'id' }
  })
  feedbackTemplates: FeedbackTemplate[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
