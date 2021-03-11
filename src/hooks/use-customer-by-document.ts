import { gql } from "apollo-boost";
import { useLazyQuery } from "@apollo/react-hooks";

export interface ISingleCustomerByDniResult {
    exists: boolean;
    customer: ISingleCustomerByDni;
}

export interface ISingleCustomerByDni {
    id: number;
    firstName: string;
    lastName: string;
    documentNumber: string;
    documents: {
        documentType: {
            name: string;
        };
        image: {
            base64: string;
        };
    }[];
}

export interface ICustomerByDniResult {
    customers: {
        result: ISingleCustomerByDni[];
    };
}

const FIND_CUSTOMER_BY_DOCUMENT = gql`
    query getCustomerByDocument($filter: String!) {
        customers(criteria: { filter: $filter }) {
            result {
                id
                firstName
                lastName
                documentNumber
                documents {
                    documentType {
                        name
                    }
                    image {
                        base64
                    }
                }
            }
        }
    }
`;
const useCustomerByDocument = (dni: string) => {
    const [execute, { loading, data, error, called, refetch }] = useLazyQuery<
        ICustomerByDniResult
    >(FIND_CUSTOMER_BY_DOCUMENT, {
        variables: {
            filter: JSON.stringify({
                type: "eq",
                property: "documentNumber",
                value: dni
            })
        }
    });
    if (error) {
        throw error;
    }
    const queryResult = data?.customers.result;
    const exists = (queryResult && queryResult.length > 0) ?? false;
    const customer =
        queryResult && queryResult.length > 0 ? queryResult[0] : null;
    const result = <ISingleCustomerByDniResult>{ exists, customer };
    return { execute, refetch, result, called, loading };
};

export default useCustomerByDocument;
