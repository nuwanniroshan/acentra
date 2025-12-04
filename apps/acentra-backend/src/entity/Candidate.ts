import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Comment } from "./Comment";
import { Job } from "./Job";
import { User } from "./User";
import { CandidateFeedbackTemplate } from "./CandidateFeedbackTemplate";

export enum CandidateStatus {
  NEW = "new",
  SHORTLISTED = "shortlisted",
  INTERVIEW_SCHEDULED = "interview_scheduled",
  OFFER = "offer",
  HIRED = "hired",
  REJECTED = "rejected",
}

@Entity()
export class Candidate {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  tenantId: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar", nullable: true })
  first_name: string;

  @Column({ type: "varchar", nullable: true })
  last_name: string;

  @Column({ type: "varchar", nullable: true })
  email: string;

  @Column({ type: "varchar", nullable: true })
  phone: string;

  @Column({ type: "text", nullable: true })
  current_address: string;

  @Column({ type: "text", nullable: true })
  permanent_address: string;

  @Column({ type: "varchar" })
  cv_file_path: string;

  @Column({ type: "varchar", nullable: true })
  profile_picture: string;

  @Column({ type: "varchar", nullable: true })
  cover_letter_path: string;

  @Column({ type: "json", nullable: true })
  education: any[];

  @Column({ type: "json", nullable: true })
  experience: any[];

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  desired_salary: number;

  @Column({ type: "varchar", nullable: true })
  referred_by: string;

  @Column({ type: "varchar", nullable: true })
  website: string;

  @Column({
    type: "varchar",
    default: "new",
  })
  status: string;

  @Column({ type: "timestamp", nullable: true })
  interview_date: Date;

  @Column({ type: "varchar", nullable: true })
  interview_link: string;

  @Column({ type: "text", nullable: true })
  notes: string;

  @ManyToOne(() => Job, (job) => job.candidates)
  job: Job;

  @ManyToOne(() => User, { nullable: true })
  created_by: User;

  @OneToMany(() => Comment, (comment) => comment.candidate)
  comments: Comment[];

  @OneToMany(() => CandidateFeedbackTemplate, (candidateFeedback) => candidateFeedback.candidate)
  feedbackTemplates: CandidateFeedbackTemplate[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
