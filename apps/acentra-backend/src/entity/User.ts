import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, Index } from "typeorm";
import { Job } from "./Job";
import { UserRole } from "@acentra/shared-types";

// This is a simplified User entity for shortlist-backend
// The actual user data and authentication is handled by auth-backend
// This entity just stores the user ID and basic info for relations
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

  @Column({ nullable: true, type: "varchar" })
  reset_token: string;

  @Column({ nullable: true, type: "timestamp" })
  reset_token_expires: Date;

  @ManyToOne(() => User, (user) => user.direct_reports, { nullable: true })
  @JoinColumn({ name: "manager_id" })
  manager: User;

  @OneToMany(() => User, (user) => user.manager)
  direct_reports: User[];

  @OneToMany(() => Job, (job) => job.created_by)
  jobs: Job[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


