import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

export type CurrentFuelPricesRecords = {
    id: number;
    fuelType: {
        name: string;
    };
    price: number;
}[];

export interface ICurrentFuelPricesResult {
    fuelPrices: {
        result: CurrentFuelPricesRecords;
    };
}

const LIST_CURRENT_FUEL_PRICES_QUERY = gql`
    query currentFuelPrices($criteria: String!) {
        fuelPrices(criteria: { filter: $criteria }) {
            result {
                id
                fuelType {
                    name
                }
                price
            }
        }
    }
`;

const useCurrentFuelPrices = () => {
    const { data, loading, error } = useQuery<ICurrentFuelPricesResult>(
        LIST_CURRENT_FUEL_PRICES_QUERY,
        {
            variables: {
                criteria: JSON.stringify({
                    type: "null",
                    property: "to"
                })
            }
        }
    );

    if (error) {
        throw error;
    }
    const currentFuelPrices = data?.fuelPrices.result;
    return { currentFuelPrices, loading };
};

export default useCurrentFuelPrices;
