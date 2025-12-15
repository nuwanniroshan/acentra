import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { CandidateFeedbackTemplate } from "./CandidateFeedbackTemplate";
import { FeedbackQuestion } from "./FeedbackQuestion";

@Entity()
export class FeedbackResponse {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true, type: "varchar" })
  tenantId: string;

  @ManyToOne(() => CandidateFeedbackTemplate, { onDelete: "CASCADE" })
  candidateFeedback: CandidateFeedbackTemplate;

  @ManyToOne(() => FeedbackQuestion, { onDelete: "CASCADE" })
  question: FeedbackQuestion;

  @Column({ type: "text", nullable: true })
  textAnswer: string; // For free text questions

  @Column({ type: "int", nullable: true })
  numericAnswer: number; // For rating questions

  @Column({ type: "boolean", nullable: true })
  booleanAnswer: boolean; // For yes/no questions

  @Column({ type: "varchar", nullable: true })
  selectedOption: string; // For multiple choice questions

  @Column({ type: "text", nullable: true })
  comments: string;

  @Column({ nullable: true, type: "varchar" })
  answeredBy: string; // User ID who provided this response

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  answeredAt: Date;

  @Column({ default: false, type: "boolean" })
  isFinal: boolean; // True if this is the final response (for panel interviews)

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}