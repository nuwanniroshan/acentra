import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { Notification } from "@/entity/Notification";
import { NotificationDTO } from "@/dto/NotificationDTO";

export class NotificationController {
    private notificationRepository = AppDataSource.getRepository(Notification);

    async getNotifications(request: Request, response: Response) {
        const userId = (request as any).user.id;
        const page = parseInt(request.query.page as string) || 1;
        const limit = parseInt(request.query.limit as string) || 10;
        const filter = request.query.filter as string; // 'read', 'unread', or undefined
        const skip = (page - 1) * limit;

        const where: any = { userId, tenantId: (request as any).tenantId };
        
        if (filter === 'unread') {
            where.isRead = false;
        } else if (filter === 'read') {
            where.isRead = true;
        }

        const [notifications, total] = await this.notificationRepository.findAndCount({
            where,
            order: { createdAt: "DESC" },
            skip,
            take: limit
        });

        // Convert to DTOs for reduced payload
        const notificationDTOs = notifications.map(notification => new NotificationDTO(notification));
        
        return response.status(200).json({
            data: notificationDTOs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    }

    async getUnreadCount(request: Request, response: Response) {
        const userId = (request as any).user.id;
        
        const count = await this.notificationRepository.count({
            where: { 
                userId, 
                tenantId: (request as any).tenantId,
                isRead: false
            }
        });

        return response.status(200).json({ count });
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
