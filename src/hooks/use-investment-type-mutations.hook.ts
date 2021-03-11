import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useEffect } from "react";
import { ICustomerModel } from "../interfaces/models/customer.model";
import useGasStations from "./use-gas-stations.hook";
import { message } from "antd";
import useInvestmentTypes from "./use-investment-types.hook";

const EDIT_INVESTMENT_TYPE_MUTATION = gql`
    mutation editInvestmentType($id: ID!, $name: String!) {
        investmentTypeEdit(data: { id: $id, name: $name }) {
            id
        }
    }
`;

const CREATE_INVESTMENT_TYPE_MUTATION = gql`
    mutation createInvestmentType($name: String!) {
        investmentTypeCreate(data: { name: $name }) {
            id
        }
    }
`;

const useEditInvestmentTypeMutation = () => {
    const { refetch } = useInvestmentTypes();
    const [execute, { loading, data, error }] = useMutation<{
        investmentTypeEdit: { id: number };
    }>(EDIT_INVESTMENT_TYPE_MUTATION);
    const editInvestmentType = (id: number, data: Partial<ICustomerModel>) => {
        execute({
            variables: {
                id,
                ...data
            }
        });
    };
    useEffect(() => {
        if (data?.investmentTypeEdit.id) {
            message.success("El tipo de inversión fue modificado con éxito");
            refetch();
        }
    }, [data?.investmentTypeEdit.id]);

    return { editInvestmentType };
};

const useCreateInvestmentTypeMutation = () => {
    const { refetch } = useInvestmentTypes();
    const [execute, { loading, data, error }] = useMutation<{
        investmentTypeCreate: { id: number };
    }>(CREATE_INVESTMENT_TYPE_MUTATION);
    const createInvestmentType = (data: Partial<ICustomerModel>) => {
        execute({
            variables: {
                ...data
            }
        });
    };
    useEffect(() => {
        if (data?.investmentTypeCreate.id) {
            message.success("El tipo de inversión fue creado con éxito");
            refetch();
        }
    }, [data?.investmentTypeCreate.id]);

    return { createInvestmentType };
};

const useInvestmentTypeMutations = () => {
    const { createInvestmentType } = useCreateInvestmentTypeMutation();
    const { editInvestmentType } = useEditInvestmentTypeMutation();
    return { createInvestmentType, editInvestmentType };
};

export default useInvestmentTypeMutations;
