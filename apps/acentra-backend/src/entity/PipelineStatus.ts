import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

@Entity()
@Index(['tenantId', 'value'], { unique: true })
export class PipelineStatus {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  tenantId: string;

  @Column({ type: "varchar" })
  value: string;

  @Column({ type: "varchar" })
  label: string;

  @Column({ type: "int", default: 0 })
  order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
