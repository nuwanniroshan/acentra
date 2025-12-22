import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne } from "typeorm";
import { Tenant } from "./Tenant";

@Entity()
export class ApiKey {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, type: "varchar" })
  tenantId: string;

  @Column({ type: "varchar" })
  @Index({ unique: true })
  hashedKey: string;

  @Column({ type: "varchar" })
  maskedKey: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "uuid", nullable: true })
  createdBy: string;

  @Column({ type: "timestamp", nullable: true })
  lastUsedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  revokedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Tenant)
  tenant: Tenant;
}
