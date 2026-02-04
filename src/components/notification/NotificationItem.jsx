import { useMarkNotificationReadMutation } from "../../api/notificationApi";

const NotificationItem = ({ notification }) => {
  const { notification_id, title, message, is_read, created_at } = notification;

  const [markRead] = useMarkNotificationReadMutation();

  const handleNotificationClick = async () => {
    if (is_read) return;

    try {
      await markRead(notification_id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      onClick={handleNotificationClick}
      className={`
        px-4 py-3 border-b last:border-none cursor-pointer
        ${is_read ? "bg-white" : "bg-indigo-50"}
        hover:bg-indigo-100 transition
      `}
    >
      <div className="flex justify-between items-start">
        <h4
          className={`text-sm font-semibold ${
            is_read ? "text-gray-700" : "text-indigo-700"
          }`}
        >
          {title}
        </h4>

        {!is_read && (
          <span className="w-2 h-2 bg-indigo-600 rounded-full mt-1" />
        )}
      </div>

      <p className="text-sm text-gray-600 mt-1">{message}</p>

      <span className="text-xs text-gray-400 mt-1 block">
        {new Date(created_at).toLocaleString()}
      </span>
    </div>
  );
};

export default NotificationItem;
