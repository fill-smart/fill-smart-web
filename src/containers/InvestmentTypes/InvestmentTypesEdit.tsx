import { Modal } from "antd";
import React, { createRef } from "react";
import InvestmentTypesForm from "./InvestmentTypesForm";
import useInvestmentTypeMutations from "../../hooks/use-investment-type-mutations.hook";
import { IInvestmentTypeModel } from "../../interfaces/models/investment-type.model";

export const InvestmentTypesEdit = ({
    opened,
    onClose,
    editing,
    onFinished
}: {
    opened?: boolean;
    onClose: () => void;
    onFinished: () => void;
    editing?: Partial<IInvestmentTypeModel>;
}) => {
    const formRef = opened ? createRef<any>() : undefined;
    const {
        editInvestmentType,
        createInvestmentType
    } = useInvestmentTypeMutations();
    const edit = (id: number, data: Partial<IInvestmentTypeModel>) => {
        editInvestmentType(id, data);
        onFinished();
    };
    const create = (data: Partial<IInvestmentTypeModel>) => {
        createInvestmentType(data);
        onFinished();
    };
    return (
        <Modal
            width={800}
            visible={opened}
            title={
                editing
                    ? "Editar Tipo de Inversión"
                    : "Alta de Tipo de Inversión"
            }
            footer={null}
            onCancel={onClose}
        >
            {opened && (
                <InvestmentTypesForm
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
