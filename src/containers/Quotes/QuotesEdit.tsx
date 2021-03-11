import { Modal } from "antd";
import React, { createRef } from "react";
import QuotesForm from "./QuotesForm";
import useQuoteMutations from "../../hooks/use-quote-mutations.hook";
import { IQuoteModel } from "../../interfaces/models/quote.model";
import useQuotes, { QuoteRecord } from "../../hooks/use-quotes.hook";
import useInvestmentTypes, {
    InvestmentTypeRecord
} from "../../hooks/use-investment-types.hook";
import LoaderComponent from "../../components/utility/loader.style";

export const QuotesEdit = ({
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
    editing?: Partial<IQuoteModel>;
    quotes?: QuoteRecord[];
    investmentTypes: InvestmentTypeRecord[];
}) => {
    const formRef = opened ? createRef<any>() : undefined;
    const { editQuote, createQuote } = useQuoteMutations();
    console.log(editing, investmentTypes, quotes);
    const edit = (id: number, data: Partial<IQuoteModel>) => {
        editQuote(id, data);
        onFinished();
    };
    const create = (data: Partial<IQuoteModel>) => {
        createQuote(data);
        onFinished();
    };

    return (
        <Modal
            width={800}
            visible={opened}
            title={editing ? "Editar Cotización" : "Alta de Cotización"}
            footer={null}
            onCancel={onClose}
        >
            {opened && (
                <QuotesForm
                    quotes={quotes}
                    investmentTypes={investmentTypes}
                    initialValue={
                        editing
                            ? Object.assign(editing, {
                                  investmentTypeId: editing?.investmentType?.id,
                                  parentQuoteId: editing?.parentQuote?.id
                              })
                            : undefined
                    }
                    onSubmit={c =>
                        editing ? edit(+editing!.id!, c) : create(c)
                    }
                    wrappedComponentRef={formRef}
                />
            )}
        </Modal>
    );
};
