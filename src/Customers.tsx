import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { IQueryResult } from "./GraphQL";

interface ICustomer {
    firstName: string;
    lastName: string;
    id: number;
}

const CUSTOMERS_QUERY = gql`
    query GetAllCustomers {
        customers {
            result {
                id
                firstName
                lastName
            }
        }
    }
`;

export const Customers: React.FC = () => {
    const { loading, error, data } = useQuery<IQueryResult<ICustomer>>(
        CUSTOMERS_QUERY
    );
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    return (
        <div>
            {data?.customers.result.map(customer => (
                <Customer key={customer.id} customer={customer}></Customer>
            ))}
        </div>
    );
};

export const Customer: React.FC<{ customer: ICustomer }> = props => (
    <div key={props.customer.id}>
        <p>
            {props.customer.id}: {props.customer.firstName}{" "}
            {props.customer.lastName}
        </p>
    </div>
);
