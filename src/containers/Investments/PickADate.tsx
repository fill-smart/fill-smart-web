import { Modal } from "antd";
import React, { createRef } from "react";
import PickADateForm from "./PickADateForm";
import moment from "moment";

export const PickADate = ({
    opened,
    onClose,
    onFinished
}: {
    opened?: boolean;
    onClose: () => void;
    onFinished: (date: Date) => void;
}) => {
    const formRef = opened ? createRef<any>() : undefined;
    return (
        <Modal
            width={400}
            visible={opened}
            title={"Seleccione la fecha"}
            footer={null}
            onCancel={onClose}
        >
            {opened && (
                <PickADateForm
                    onSubmit={(c: { value: moment.Moment }) => onFinished(c.value.toDate())}
                    wrappedComponentRef={formRef}
                />
            )}
        </Modal>
    );
};
