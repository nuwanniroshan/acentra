import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { UserRole } from "@acentra/shared-types";

@Entity()
@Index(["email", "tenantId"], { unique: true }) // Email is unique per tenant
@Index(["employee_number", "tenantId"], { unique: true, where: '"employee_number" IS NOT NULL' })
export class User {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ nullable: false, type: "varchar" })
  tenantId: string;

  @Column({ type: "varchar" })
  email: string;

  @Column({ type: "varchar", nullable: true })
  password_hash: string;

  @Column({
    type: "varchar",
    default: UserRole.HIRING_MANAGER,
  })
  role: UserRole;

  @Column({ nullable: true, type: "varchar" })
  name: string;

  @Column({ nullable: true, type: "varchar" })
  profile_picture: string;

  @Column({ nullable: true, type: "varchar" })
  department: string;

  @Column({ nullable: true, type: "varchar" })
  office_location: string;

  @Column({ nullable: true, type: "varchar" })
  job_title: string;

  @Column({ nullable: true, type: "varchar" })
  employee_number: string;

  @Column({ nullable: true, type: "uuid" })
  manager_id: string;

  @Column({ nullable: true, type: "text" })
  address: string;

  @Column({ default: true, type: "boolean" })
  is_active: boolean;

  @Column({ type: "jsonb", nullable: true })
  preferences: Record<string, any>;

  @Column({ type: "jsonb", default: {} })
  custom_fields: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


