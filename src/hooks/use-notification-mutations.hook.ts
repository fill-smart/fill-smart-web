import { INotificationModel } from "./../interfaces/models/notification.model";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useEffect } from "react";
import { message } from "antd";
import useNotifications from "./use-notifications.hook";

const CREATE_NOTIFICATION_MUTATION = gql`
  mutation createNotification($title: String!, $text: String!) {
    notificationCreate(data: { title: $title, text: $text }) {
      id
      title
      text
      created
    }
  }
`;

const useCreateNotificationMutation = () => {
  const { refetch } = useNotifications();
  const [execute, { loading, data, error }] = useMutation<{
    notificationCreate: { id: number };
  }>(CREATE_NOTIFICATION_MUTATION);
  const create = (data: Partial<INotificationModel>) => {
    execute({
      variables: {
        ...data
      }
    });
  };
  useEffect(() => {
    if (data?.notificationCreate.id) {
      message.success("La notificación fue creada con éxito");
      refetch();
    }
  }, [data?.notificationCreate.id]);

  return { create };
};

const useNotificationMutations = () => {
  const { create } = useCreateNotificationMutation();

  return { create };
};

export default useNotificationMutations;
