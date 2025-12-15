import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, type: "varchar" })
  name: string;

  @Column({ default: true, type: "boolean" })
  isActive: boolean;
}