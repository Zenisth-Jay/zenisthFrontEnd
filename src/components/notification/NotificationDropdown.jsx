import NotificationItem from "./NotificationItem";

const NotificationDropdown = ({ notifications = [] }) => {
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-semibold text-gray-800">Notifications</h3>

        {unreadCount > 0 && (
          <span className="text-sm text-indigo-600 font-medium">
            {unreadCount} unread
          </span>
        )}
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map((item) => (
            <NotificationItem key={item.notification_id} notification={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
