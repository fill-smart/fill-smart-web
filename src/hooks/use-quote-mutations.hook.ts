import { IQuoteModel } from "./../interfaces/models/quote.model";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useEffect } from "react";
import { message } from "antd";
import useQuotes from "./use-quotes.hook";

const EDIT_QUOTE_MUTATION = gql`
    mutation editQuote(
        $id: ID!
        $investmentTypeId: ID
        $from: DateTime
        $to: DateTime
        $price: Float
        $parentQuoteId: ID
    ) {
        quoteEdit(
            data: {
                id: $id
                investmentTypeId: $investmentTypeId
                from: $from
                to: $to
                price: $price
                parentQuoteId: $parentQuoteId
            }
        ) {
            id
        }
    }
`;

const CREATE_QUOTE_MUTATION = gql`
    mutation createQuote(
        $investmentTypeId: ID
        $from: DateTime
        $to: DateTime
        $price: Float
        $parentQuoteId: ID
    ) {
        quoteCreate(
            data: {
                investmentTypeId: $investmentTypeId
                from: $from
                to: $to
                price: $price
                parentQuoteId: $parentQuoteId
            }
        ) {
            id
        }
    }
`;

const useEditQuoteMutation = () => {
    const { refetch } = useQuotes();
    const [execute, { loading, data, error }] = useMutation<{
        quoteEdit: { id: number };
    }>(EDIT_QUOTE_MUTATION);
    const editQuote = (id: number, data: Partial<IQuoteModel>) => {
        execute({
            variables: {
                id,
                ...data
            }
        });
    };
    useEffect(() => {
        if (data?.quoteEdit.id) {
            message.success("La cotizacion fue modificada con éxito");
            refetch();
        }
    }, [data?.quoteEdit.id]);

    return { editQuote };
};

const useCreateQuoteMutation = () => {
    const { refetch } = useQuotes();
    const [execute, { loading, data, error }] = useMutation<{
        quoteCreate: { id: number };
    }>(CREATE_QUOTE_MUTATION);
    const createQuote = (data: Partial<IQuoteModel>) => {
        execute({
            variables: {
                ...data
            }
        });
    };
    useEffect(() => {
        if (data?.quoteCreate.id) {
            message.success("La cotizacion fue creada con éxito");
            refetch();
        }
    }, [data?.quoteCreate.id]);

    return { createQuote };
};

const useQuoteMutations = () => {
    const { createQuote } = useCreateQuoteMutation();
    const { editQuote } = useEditQuoteMutation();
    return { createQuote, editQuote };
};

export default useQuoteMutations;
