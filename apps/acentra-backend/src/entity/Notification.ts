import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

export enum NotificationType {
    JOB_ASSIGNED = "JOB_ASSIGNED",
    CANDIDATE_ADDED = "CANDIDATE_ADDED",
    STATUS_CHANGE = "STATUS_CHANGE",
    JOB_REJECTED = "JOB_REJECTED",
    JOB_APPROVED = "JOB_APPROVED"
}

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, type: "varchar" })
    tenantId: string;

    @Column({ type: "varchar" })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    user: User;

    @Column({
        type: "enum",
        enum: NotificationType,
    })
    type: NotificationType;

    @Column({ type: "varchar" })
    message: string;

    @Column({ type: "boolean", default: false })
    isRead: boolean;

    @Column({ type: "int", nullable: true })
    relatedEntityId: number; // Job ID or Candidate ID depending on type

    @CreateDateColumn()
    createdAt: Date;
}
