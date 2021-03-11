import { IInvestmentModel } from "./../interfaces/models/investment.model";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useEffect } from "react";
import { message } from "antd";
import useInvestments from "./use-investments.hook";

const EDIT_INVESTMENT_MUTATION = gql`
    mutation editInvestment(
        $id: ID!
        $investmentTypeId: ID
        $quoteId: ID
        $ammount: Float
        $stamp: DateTime
        $movementType: InvestmentMovementType
    ) {
        investmentEdit(
            data: {
                id: $id
                investmentTypeId: $investmentTypeId
                quoteId: $quoteId
                stamp: $stamp
                movementType: $movementType
                ammount: $ammount
            }
        ) {
            id
        }
    }
`;

const CREATE_INVESTMENT_MUTATION = gql`
    mutation createInvestment(
        $investmentTypeId: ID
        $quoteId: ID
        $ammount: Float
        $stamp: DateTime
        $movementType: InvestmentMovementType
    ) {
        investmentCreate(
            data: {
                investmentTypeId: $investmentTypeId
                quoteId: $quoteId
                stamp: $stamp
                movementType: $movementType
                ammount: $ammount
            }
        ) {
            id
        }
    }
`;

const useEditInvestmentMutation = () => {
    const { refetch } = useInvestments();
    const [execute, { loading, data, error }] = useMutation<{
        investmentEdit: { id: number };
    }>(EDIT_INVESTMENT_MUTATION);
    const edit = (id: number, data: Partial<IInvestmentModel>) => {
        execute({
            variables: {
                id,
                ...data
            }
        });
    };
    useEffect(() => {
        if (data?.investmentEdit.id) {
            message.success("La inversion fue modificada con éxito");
            refetch();
        }
    }, [data?.investmentEdit.id]);

    return { edit };
};

const useCreateInvestmentMutation = () => {
    const { refetch } = useInvestments();
    const [execute, { loading, data, error }] = useMutation<{
        investmentCreate: { id: number };
    }>(CREATE_INVESTMENT_MUTATION);
    const create = (data: Partial<IInvestmentModel>) => {
        execute({
            variables: {
                ...data
            }
        });
    };
    useEffect(() => {
        if (data?.investmentCreate.id) {
            message.success("La inversion fue creada con éxito");
            refetch();
        }
    }, [data?.investmentCreate.id]);

    return { create };
};

const useInvestmentMutations = () => {
    const { create } = useCreateInvestmentMutation();
    const { edit } = useEditInvestmentMutation();
    return { create, edit };
};

export default useInvestmentMutations;
