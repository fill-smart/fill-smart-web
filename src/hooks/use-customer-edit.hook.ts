import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useContext, useEffect } from "react";
import { ICustomerModel } from "../interfaces/models/customer.model";
import useCustomers from "./use-customers.hook";
import { message } from "antd";

const EDIT_CUSTOMER_MUTATION = gql`
    mutation editCustomer(
        $id: ID!
        $firstName: String
        $lastName: String
        $documentNumber: String
        $born: DateTime
        $phone: String
        $email: String
    ) {
        customerEdit(
            data: {
                id: $id
                firstName: $firstName
                lastName: $lastName
                documentNumber: $documentNumber
                born: $born
                phone: $phone
                email: $email
            }
        ) {
            id
        }
    }
`;

const useCustomerEdit = () => {
    const { refetch } = useCustomers();
    const [execute, { loading, data, error }] = useMutation<{
        customerEdit: { id: number };
    }>(EDIT_CUSTOMER_MUTATION);
    const editCustomer = (id: number, data: Partial<ICustomerModel>) => {
        execute({
            variables: {
                id,
                ...data
            }
        });
    };
    useEffect(() => {
        if (data?.customerEdit.id) {
            message.success("El cliente fue modificado con éxito");
            refetch();
        }
    }, [data?.customerEdit.id]);

    return { editCustomer };
};

export default useCustomerEdit;
