import { Modal, Form } from "antd";
import React, { createRef, Ref } from "react";
import Input, { Textarea } from "../../components/uielements/input";
import { Fieldset, Label } from "./CustomersEdit.styles";
import Select, {
    SelectOption as Option
} from "../../components/uielements/select";
import CustomerForm from "./CustomerForm";
import { ICustomerModel } from "../../interfaces/models/customer.model";
import useCustomerEdit from "../../hooks/use-customer-edit.hook";

export const CustomerEdit = ({
    opened,
    onClose,
    editing,
    onFinished
}: {
    opened?: boolean;
    onClose: () => void;
    onFinished: () => void;
    editing: Partial<ICustomerModel> | undefined;
}) => {
    const formRef = createRef<any>();
    const { editCustomer } = useCustomerEdit();

    const edit = (id: number, data: Partial<ICustomerModel>) => {
        editCustomer(id, data);
        onFinished();
    };

    return (
        <Modal
            width={800}
            visible={opened}
            title={editing ? "Editar Cliente" : "Alta de Cliente"}
            footer={null}
            onCancel={onClose}
        >
            {opened && (
                <CustomerForm
                    initialValue={editing}
                    onSubmit={c => edit(+editing!.id!, c)}
                    wrappedComponentRef={formRef}
                />
            )}
        </Modal>
    );
};
