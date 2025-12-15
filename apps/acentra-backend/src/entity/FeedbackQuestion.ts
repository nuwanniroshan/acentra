import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { FeedbackTemplate } from "./FeedbackTemplate";

export enum QuestionType {
  FREE_TEXT = "free_text",
  RATING = "rating",
  YES_NO = "yes_no",
  MULTIPLE_CHOICE = "multiple_choice"
}

export enum QuestionRequired {
  REQUIRED = "required",
  OPTIONAL = "optional"
}

@Entity()
export class FeedbackQuestion {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true, type: "varchar" })
  tenantId: string;

  @Column({ type: "varchar" })
  question: string;

  @Column({
    type: "enum",
    enum: QuestionType,
  })
  type: QuestionType;

  @Column({
    type: "enum",
    enum: QuestionRequired,
    default: QuestionRequired.OPTIONAL
  })
  required: QuestionRequired;

  @Column({ type: "text", nullable: true })
  helpText: string;

  @Column({ type: "json", nullable: true })
  options: string[]; // For multiple choice questions

  @Column({ type: "int", nullable: true })
  minRating: number; // For rating questions

  @Column({ type: "int", nullable: true })
  maxRating: number; // For rating questions

  @Column({ type: "varchar", nullable: true })
  ratingLabels: string; // JSON string of rating scale labels

  @Column({ type: "int", default: 0 })
  order: number;

  @Column({ default: true, type: "boolean" })
  isActive: boolean;

  @ManyToOne(() => FeedbackTemplate, (template) => template.questions, { onDelete: "CASCADE" })
  template: FeedbackTemplate;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}