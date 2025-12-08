export class NotificationDTO {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  type?: string;
  referenceId?: string;

  constructor(notification: any) {
    this.id = notification.id;
    this.title = notification.title;
    this.message = notification.message;
    this.isRead = notification.isRead;
    this.createdAt = notification.createdAt;

    // Optional fields
    if (notification.type) this.type = notification.type;
    if (notification.referenceId) this.referenceId = notification.referenceId;
  }
}