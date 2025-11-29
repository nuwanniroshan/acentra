import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Notification } from "../entity/Notification";

export class NotificationController {
    private notificationRepository = AppDataSource.getRepository(Notification);

    async getNotifications(request: Request, response: Response) {
        const userId = (request as any).user.id;

        const notifications = await this.notificationRepository.find({
            where: { userId, tenantId: (request as any).tenantId },
            order: { createdAt: "DESC" }
        });

        return response.status(200).json(notifications);
    }

    async markAsRead(request: Request, response: Response) {
        const userId = (request as any).user.id;
        const { id } = request.body;

        if (id) {
            await this.notificationRepository.update({ id, userId, tenantId: (request as any).tenantId }, { isRead: true });
        } else {
            await this.notificationRepository.update({ userId, tenantId: (request as any).tenantId }, { isRead: true });
        }

        return response.status(200).json({ message: "Notifications marked as read" });
    }
}
