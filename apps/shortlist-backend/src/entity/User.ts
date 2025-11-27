import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Job } from "./Job";
import { UserRole } from "@rooster-clone/shared-types";

// This is a simplified User entity for shortlist-backend
// The actual user data and authentication is handled by auth-backend
// This entity just stores the user ID and basic info for relations
@Entity()
export class User {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ unique: true, type: "varchar" })
  email: string;

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

  @OneToMany(() => Job, (job) => job.created_by)
  jobs: Job[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

// Re-export UserRole for backward compatibility
export { UserRole };
