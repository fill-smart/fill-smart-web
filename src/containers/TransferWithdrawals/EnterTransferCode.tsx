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
    onFinished: (c) => void;
}) => {
    const formRef = opened ? createRef<any>() : undefined;
    return (
        <Modal
            width={500}
            visible={opened}
            title={"Confirmar transferencia"}
            footer={null}
            onCancel={onClose}
        >
            {opened && (
                <EnterTransferCodeForm
                    onSubmit={(c) =>
                        onFinished(c)
                    }
                    wrappedComponentRef={formRef}
                />
            )}
        </Modal>
    );
};
