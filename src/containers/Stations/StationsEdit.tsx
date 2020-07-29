import { Modal } from "antd";
import React, { createRef } from "react";
import useCustomerEdit from "../../hooks/use-customer-edit.hook";
import { IGasStationModel } from "../../interfaces/models/gas-station.model";
import StationForm from "./StationForm";
import useGasStationMutations from "../../hooks/use-gas-station-mutations.hook";

export const StationEdit = ({
    opened,
    onClose,
    editing,
    onFinished
}: {
    opened?: boolean;
    onClose: () => void;
    onFinished: () => void;
    editing?: Partial<IGasStationModel>;
}) => {
    const formRef = opened ? createRef<any>() : undefined;
    const { editGasStation, createGasStation } = useGasStationMutations();
    const edit = (id: number, data: Partial<IGasStationModel>) => {
        editGasStation(id, data);
        onFinished();
    };
    const create = (data: Partial<IGasStationModel>) => {
        createGasStation(data);
        onFinished();
    };
    return (
        <Modal
            width={800}
            visible={opened}
            title={
                editing
                    ? "Editar Estacion de Servicio"
                    : "Alta de Estacion de Servicio"
            }
            footer={null}
            onCancel={onClose}
        >
            {opened && (
                <StationForm
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
