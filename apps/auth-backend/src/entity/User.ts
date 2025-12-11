import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { UserRole } from "@acentra/shared-types";

@Entity()
@Index(["email", "tenantId"], { unique: true }) // Email is unique per tenant
export class User {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ nullable: false })
  tenantId: string;

  @Column({ type: "varchar" })
  email: string;

  @Column({ type: "varchar", nullable: true })
  password_hash: string;

  @Column({
    type: "varchar",
    default: UserRole.ENGINEERING_MANAGER,
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

  @Column({ default: true, type: "boolean" })
  is_active: boolean;

  @Column({ type: "jsonb", nullable: true })
  preferences: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

// Re-export UserRole for backward compatibility
export { UserRole };
