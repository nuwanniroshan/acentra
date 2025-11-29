import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum OfficeType {
  HEADQUARTERS = "headquarters",
  BRANCH = "branch",
}

@Entity()
export class Office {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  tenantId: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar", nullable: true })
  address: string;

  @Column({
    type: "enum",
    enum: OfficeType,
    default: OfficeType.BRANCH,
  })
  type: OfficeType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
