import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Candidate } from "./Candidate";
import { User } from "./User";

export enum Recommendation {
  STRONG_HIRE = "strong_hire",
  HIRE = "hire",
  NEUTRAL = "neutral",
  NO_HIRE = "no_hire",
  STRONG_NO_HIRE = "strong_no_hire",
}

@Entity()
export class CandidateScorecard {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  tenantId: string;

  @Column({ type: "jsonb" })
  criteria: Record<string, number>; // e.g. {"Technical": 4, "Cultural": 5}

  @Column({ type: "text", nullable: true })
  comments: string;

  @Column({
    type: "varchar",
    default: Recommendation.HIRE,
  })
  overall_recommendation: string;

  @ManyToOne(() => Candidate, { onDelete: "CASCADE" })
  candidate: Candidate;

  @ManyToOne(() => User)
  submitted_by: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
