import { Modal } from "antd";
import React, { createRef } from "react";
import EnterTransferCodeForm from "./EnterTransferCodeForm";


export const EnterTransferCode = ({
    opened,
    onClose,
    onFinished
}: {
    opened?: boolean;
    onClose: () => void;
    onFinished: (code: string) => void;
}) => {
    const formRef = opened ? createRef<any>() : undefined;
    return (
        <Modal
            width={400}
            visible={opened}
            title={"Ingrese el número de transferencia"}
            footer={null}
            onCancel={onClose}
        >
            {opened && (
                <EnterTransferCodeForm
                    onSubmit={(c: { code: string }) => onFinished(c.code)}
                    wrappedComponentRef={formRef}
                />
            )}
        </Modal>
    );
};
