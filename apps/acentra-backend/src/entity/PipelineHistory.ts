import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Candidate } from "./Candidate";
import { User } from "./User";

@Entity()
export class PipelineHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  tenantId: string;

  @ManyToOne(() => Candidate, { onDelete: "CASCADE" })
  candidate: Candidate;

  @Column({ type: "varchar", nullable: true })
  old_status: string;

  @Column({ type: "varchar" })
  new_status: string;

  @ManyToOne(() => User, { nullable: true })
  changed_by: User;

  @CreateDateColumn()
  changed_at: Date;
}
