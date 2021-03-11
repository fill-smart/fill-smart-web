import { Modal } from "antd";
import React, { createRef } from "react";
import UsersForm from "./UsersForm";
import { IUserModel } from "../../interfaces/models/user.model";
import useUserMutations from "../../hooks/use-user-mutations.hook";

export const UsersEdit = ({
    opened,
    onClose,
    editing,
    onFinished
}: {
    opened?: boolean;
    onClose: () => void;
    onFinished: () => void;
    editing?: Partial<IUserModel>;
}) => {
    const formRef = opened ? createRef<any>() : undefined;
    const userMutations = useUserMutations();

    const create = (data: Partial<IUserModel>) => {
        userMutations.create(data);
        onFinished();
    };

    return (
        <Modal
            width={800}
            visible={opened}
            title={"Alta de Usuario"}
            footer={null}
            onCancel={onClose}
        >
            {opened && (
                <UsersForm
                    initialValue={editing}
                    onSubmit={c => create(c)}
                    wrappedComponentRef={formRef}
                />
            )}
        </Modal>
    );
};
