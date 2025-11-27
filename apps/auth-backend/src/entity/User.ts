import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "@rooster-clone/shared-types";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, type: "varchar" })
  email: string;

  @Column({ type: "varchar" })
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
