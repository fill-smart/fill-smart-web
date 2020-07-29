import { Modal } from "antd";
import React, { createRef } from "react";
import usePumpMutations from "../../hooks/use-pump-mutations.hook";
import { IPumpModel } from "../../interfaces/models/pump.model";
import PumpForm from "./PumpForm";

export const PumpEdit = ({
    opened,
    onClose,
    editing,
    onFinished
}: {
    opened?: boolean;
    onClose: () => void;
    onFinished: () => void;
    editing?: Partial<IPumpModel>;
}) => {
    const formRef = opened ? createRef<any>() : undefined;
    const { createPump, editPump } = usePumpMutations();
    const edit = (id: number, data: Partial<IPumpModel>) => {
        editPump(id, data);
        onFinished();
    };
    const create = (data: Partial<IPumpModel>) => {
        createPump(data);
        onFinished();
    };
    return (
        <Modal
            width={800}
            visible={opened}
            title={editing ? "Editar Surtidor" : "Alta de Surtidor"}
            footer={null}
            onCancel={onClose}
        >
            {opened && (
                <PumpForm
                    initialValue={editing}
                    onSubmit={c =>
                        editing ? edit(+editing!.id!, c) : create(c)
                    }
                    wrappedComponentRef={formRef}
                />
            )}
        </Modal>
    );
};
