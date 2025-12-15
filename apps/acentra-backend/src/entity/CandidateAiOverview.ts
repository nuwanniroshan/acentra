import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Candidate } from "./Candidate";
import { Job } from "./Job";

@Entity()
export class CandidateAiOverview {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true, type: "varchar" })
  tenantId: string;

  @ManyToOne(() => Candidate, { onDelete: "CASCADE" })
  @JoinColumn({ name: "candidateId" })
  candidate: Candidate;

  @Column({ type: "varchar" })
  candidateId: string;

  @ManyToOne(() => Job)
  @JoinColumn({ name: "jobId" })
  job: Job;

  @Column({ type: "varchar" })
  jobId: string;

  @Column({ type: "text" })
  overviewText: string;

  @Column({ type: "json", nullable: true })
  structuredData: any;

  @Column({ type: "varchar", default: "AI" })
  generatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
