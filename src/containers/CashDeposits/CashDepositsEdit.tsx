import { Modal } from "antd";
import React, { createRef } from "react";
import { ICashDepositModel } from "../../interfaces/models/cash-deposit.model";
import CashDepositsForm from "./CashDepositsForm";
import useCashDepositMutations from "../../hooks/use-cash-deposit-mutations.hook";

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
    const { create } = useCashDepositMutations();

    const doCreate = (data: Partial<ICashDepositModel>) => {
        create(data);
        onFinished();
    };

    return (
        <Modal
            width={800}
            visible={opened}
            title={"Registrar Deposito"}
            footer={null}
            onCancel={onClose}
        >
            {opened && (
                <CashDepositsForm
                    onSubmit={c =>
                        doCreate(c)
                    }
                    wrappedComponentRef={formRef}
                />
            )}
        </Modal>
    );
};
