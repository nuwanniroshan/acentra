import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { Notification } from "@/entity/Notification";
import { NotificationDTO } from "@/dto/NotificationDTO";

export class NotificationController {
    private notificationRepository = AppDataSource.getRepository(Notification);

    async getNotifications(request: Request, response: Response) {
        const userId = (request as any).user.id;

        const notifications = await this.notificationRepository.find({
            where: { userId, tenantId: (request as any).tenantId },
            order: { createdAt: "DESC" }
        });

        // Convert to DTOs for reduced payload
        const notificationDTOs = notifications.map(notification => new NotificationDTO(notification));
        return response.status(200).json(notificationDTOs);
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
