import { Form } from "antd";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

export type FuelPricesRecords = {
    from: Date;
    to: Date | null;
    id: number;
    fuelType: {
        name: string;
    };
    price: number;
}[];
export interface IFuelPricesResult {
    fuelPrices: {
        result: FuelPricesRecords;
    };
}

const LIST_FUEL_PRICES_QUERY = gql`
    query fuelPrices($sort: String!) {
        fuelPrices(criteria: { sort: $sort }) {
            result {
                id
                from
                to
                fuelType {
                    name
                }
                price
            }
        }
    }
`;

const useFuelPrices = () => {
    const { data, loading, error } = useQuery<IFuelPricesResult>(
        LIST_FUEL_PRICES_QUERY,
        {
            variables: {
                sort: JSON.stringify([
                    {
                        property: "fuelType.id"
                    },
                    {
                        property: "from"
                    }
                ])
            }
        }
    );

    if (error) {
        throw error;
    }
    const fuelPrices = data?.fuelPrices.result;
    return { fuelPrices, loading };
};

export default useFuelPrices;
