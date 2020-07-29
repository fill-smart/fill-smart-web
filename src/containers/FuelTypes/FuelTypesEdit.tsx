import { Modal } from "antd";
import React, { createRef } from "react";
import FuelTypesForm from "./FuelTypesForm";
import { IFuelTypeModel } from "../../interfaces/models/fuel-type.model";
import useFuelTypeMutations from "../../hooks/use-fuel-type-mutations.hook";

export const FuelTypesEdit = ({
    opened,
    onClose,
    editing,
    onFinished
}: {
    opened?: boolean;
    onClose: () => void;
    onFinished: () => void;
    editing: Partial<IFuelTypeModel>;
}) => {
    const formRef = opened ? createRef<any>() : undefined;
    const { editFuelType } = useFuelTypeMutations();

    const edit = (id: number, data: Partial<IFuelTypeModel>) => {
        editFuelType(id, data);
        onFinished();
    };
    return (
        <Modal
            width={800}
            visible={opened}
            title={
                editing
                    ? "Editar Combustible"
                    : "Alta de Combustible"
            }
            footer={null}
            onCancel={onClose}
        >
            {opened && (
                <FuelTypesForm
                    initialValue={editing}
                    onSubmit={c =>edit(+editing!.id!, c)}
                    wrappedComponentRef={formRef}
                />
            )}
        </Modal>
    );
};
