import { INotificationModel } from "./../interfaces/models/notification.model";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

export type NotificationRecord = Pick<
  INotificationModel,
  "id" | "text" | "title" | "created"
>;
export interface INotificationsResult {
  notifications: {
    result: NotificationRecord[];
  };
}

const LIST_NOTIFICATIONS_QUERY = gql`
  query notifications {
    notifications {
      result {
        id
        title
        text
        created
      }
    }
  }
`;

const useNotifications = () => {
  const { data, loading, error, refetch } = useQuery<INotificationsResult>(
    LIST_NOTIFICATIONS_QUERY
  );

  if (error) {
    throw error;
  }
  const notifications = data?.notifications.result;
  return { notifications, loading, refetch };
};

export default useNotifications;
