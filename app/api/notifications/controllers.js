const catchAsync = require("../../../utilities/catchAsync");
const { success, failure } = require("../../../utilities/responseHandler");
const { fetchUnreadNotificationsService, createNotificationService,  markAsReadService, deleteNotificationService } = require("./services");

exports.createNotifications = catchAsync(async (req, res, next) => {
    try {
        const { type } = req.body;
        const createdNotifications = await createNotificationService(type, req?.sessionId);
        res.json(success(createdNotifications, "Notifications Created Successfully!"))
    } catch (error) {
        res.json(failure(error, error?.message))
    }
});

exports.fetchNotifications = catchAsync(async (req, res, next) => {
    try {
        const fetchedNotifications = await fetchUnreadNotificationsService(req.sessionId);
        res.json(success(fetchedNotifications, "Notifications Fetched Successfully!"))
    } catch (error) {
        res.json(failure(error, error?.message))
    }
});

exports.markAsRead = catchAsync(async (req, res, next) => {
    try {
        const affected = await markAsReadService(req.params.id);
        res.json(success(affected, "Notifications Read Successfully!"))
    } catch (error) {
        res.json(failure(error, error?.message))
    }
})

exports.deleteNotification = catchAsync(async (req, res, next) => {
    try {
        const deletedNotification = await deleteNotificationService(req.params.id);
        res.json(success(deletedNotification, "Notifications Deleted Successfully!"))
    } catch (error) {
        res.json(failure(error, error?.message))
    }
})