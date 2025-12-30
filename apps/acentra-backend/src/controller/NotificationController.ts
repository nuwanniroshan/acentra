import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { Notification } from "@/entity/Notification";
import { NotificationDTO } from "@/dto/NotificationDTO";
import { logger } from "@acentra/logger";

export class NotificationController {
    private notificationRepository = AppDataSource.getRepository(Notification);

    async getNotifications(request: Request, response: Response) {
        const userId = (request as any).user.userId;
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
        const userId = (request as any).user.userId;
        
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
        const userId = (request as any).user.userId;
        const tenantId = (request as any).tenantId;
        const { id } = request.body;

        try {
            if (id) {
                const result = await this.notificationRepository.update(
                    { id, userId, tenantId }, 
                    { isRead: true }
                );

                if (result.affected === 0) {
                     return response.status(404).json({ message: "Notification not found or access denied" });
                }

                return response.status(200).json({ message: "Notification marked as read" });
            } else {
                const result = await this.notificationRepository.update(
                    { userId, tenantId, isRead: false }, 
                    { isRead: true }
                );
                return response.status(200).json({ message: "All notifications marked as read", count: result.affected });
            }
        } catch (error) {
            logger.error("[NotificationController] Error marking as read:", error);
            return response.status(500).json({ message: "Failed to mark notifications as read" });
        }
    }
}
