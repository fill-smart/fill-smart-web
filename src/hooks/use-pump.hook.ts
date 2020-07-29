import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

interface IPumpResult {
    pumpById: {
        id: number;
        externalId: string;
        lastExternalOperation: {
            stamp: Date;
            litres: number;
            fuelType: {
                name: string;
            };
            total: number;
            fuelPrice: number;
        };
    };
}

const LIST_PUMPS_QUERY = gql`
    query getPump($id: ID!) {
        pumpById(id: $id) {
            id
            externalId
            lastExternalOperation {
                id
                stamp
                litres
                fuelType {
                    id
                    name
                }
                total
                fuelPrice
            }
        }
    }
`;

const usePump = (pumpId: number) => {
    const { data, loading, error } = useQuery<IPumpResult>(LIST_PUMPS_QUERY, {
        variables: { id: pumpId }
    });
    if (error) {
        throw error;
    }
    const pump = data?.pumpById;
    return { pump, loading };
};

export default usePump;
