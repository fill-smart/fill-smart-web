import { Modal } from "antd";
import React, { createRef } from "react";
import InvestmentsForm from "./InvestmentsForm";
import useQuoteMutations from "../../hooks/use-quote-mutations.hook";
import useQuotes, { QuoteRecord } from "../../hooks/use-quotes.hook";
import { InvestmentTypeRecord } from "../../hooks/use-investment-types.hook";
import useInvestmentMutations from "../../hooks/use-investment-mutations.hook";
import { IInvestmentModel } from "../../interfaces/models/investment.model";

export const InvestmentsEdit = ({
    opened,
    onClose,
    editing,
    onFinished,
    investmentTypes,
    quotes
}: {
    opened?: boolean;
    onClose: () => void;
    onFinished: () => void;
    editing?: Partial<IInvestmentModel>;
    quotes: QuoteRecord[];
    investmentTypes: InvestmentTypeRecord[];
}) => {
    const formRef = opened ? createRef<any>() : undefined;
    const investmentMutations = useInvestmentMutations();
    console.log(editing, investmentTypes, quotes);
    const edit = (id: number, data: Partial<IInvestmentModel>) => {
        investmentMutations.edit(id, data);
        onFinished();
    };
    const create = (data: Partial<IInvestmentModel>) => {
        investmentMutations.create(data);
        onFinished();
    };

    return (
        <Modal
            width={800}
            visible={opened}
            title={editing ? "Editar Inversión" : "Alta de Inversión"}
            footer={null}
            onCancel={onClose}
        >
            {opened && (
                <InvestmentsForm
                    quotes={quotes}
                    investmentTypes={investmentTypes}
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
