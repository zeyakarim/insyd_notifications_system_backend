const { Notifications } = require("./models");

const MESSAGE_TEMPLATES = {
    like: "Someone liked your architecture post!",
    comment: "New comment: 'Love this design concept!'",
    follow: "DesignStudio_42 started following you",
    job: "Job match: Senior Architect at Foster + Partners",
    default: "New activity in your network"
};

let ioInstance = null;

const initNotificationService = (io) => {
    ioInstance = io;
};

const createNotificationService = async (type, sessionId) => {
    try {
        // Validate input
        if (!sessionId) throw new Error('Session ID is required');
        if (!type) throw new Error('Notification type is required');

        const notification = await Notifications.create({
            session_id: sessionId,
            type,
            text: MESSAGE_TEMPLATES[type] || MESSAGE_TEMPLATES.default,
            is_read: false
        });

        // Broadcast to specific session
        if (ioInstance) {
            ioInstance.to(sessionId).emit('new-notification', {
                id: notification.id,
                type: notification.type,
                text: notification.text,
                created_at: notification.created_at
            });
        }

        return notification;
    } catch (error) {
        console.error('[NotificationService] Error creating notification:', error);
        throw new Error(`Failed to create notification: ${error.message}`);
    }
};

const fetchUnreadNotificationsService = async (sessionId) => {
    try {
        const notifications = await Notifications.findAll({
            where: {
                session_id: sessionId,
                is_read: false
            },
            order: [['created_at', 'DESC']],
            limit: 10
        })
        return notifications;
    } catch (error) {
        console.error('Error in fetching notifications : ', error);
        throw(error)
    }
}

const markAsReadService = async (notificationId) => {
    try {
        const [affectedCount] = await Notifications.update(
            { is_read: true },
            { where: { id: notificationId } }
        );
        return affectedCount;
    } catch (error) {
        console.error('[NotificationService] Error marking notification as read:', error);
        throw new Error('Failed to update notification status');
    }
};


module.exports = {
    initNotificationService,
    createNotificationService,
    fetchUnreadNotificationsService,
    markAsReadService
}