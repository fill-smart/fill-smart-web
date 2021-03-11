import { Modal } from "antd";
import React, { createRef } from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import useChangePasswordMutation from "../../hooks/use-user-mutations.hook copy";

export const ChangePassword = ({
    opened,
    onClose,
    onFinished
}: {
    opened?: boolean;
    onClose: () => void;
    onFinished: () => void;
}) => {
    const formRef = opened ? createRef<any>() : undefined;
    const changePasswordMutation = useChangePasswordMutation();

    const changePassword = (data: { currentPassword: string, newPassword: string }) => {
        changePasswordMutation.changePassword(data);
        onFinished()
    };

    return (
        <Modal
            width={800}
            visible={opened}
            title={"Cambiar Contraseña"}
            footer={null}
            onCancel={onClose}
        >
            {opened && (
                <ChangePasswordForm
                    onSubmit={c => changePassword(c)}
                    wrappedComponentRef={formRef}
                />
            )}
        </Modal>
    );
};
