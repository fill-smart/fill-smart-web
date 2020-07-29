import { Modal } from "antd";
import React, { createRef } from "react";
import { INotificationModel } from "../../interfaces/models/notification.model";
import useNotificationMutations from "../../hooks/use-notification-mutations.hook";
import NotificationsForm from "./NotificationsForm";

export const NotificationsEdit = ({
    opened,
    onClose,
    onFinished,
}: {
    opened?: boolean;
    onClose: () => void;
    onFinished: () => void;

}) => {
    const formRef = opened ? createRef<any>() : undefined;
    const { create } = useNotificationMutations();

    const doCreate = (data: Partial<INotificationModel>) => {
        create(data);
        onFinished();
    };

    return (
        <Modal
            width={800}
            visible={opened}
            title={"Envio de Notificacion"}
            footer={null}
            onCancel={onClose}
        >
            {opened && (
                <NotificationsForm
                    onSubmit={c =>
                        doCreate(c)
                    }
                    wrappedComponentRef={formRef}
                />
            )}
        </Modal>
    );
};
