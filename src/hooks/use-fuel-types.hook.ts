import { Form } from "antd";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

export type FuelTypeRecord = {
    id: number;
    name: string;
    currentPrice: {
        price: number;
    };
}[];
export interface IFuelTypesResult {
    fuelTypes: {
        result: FuelTypeRecord;
    };
}

const LIST_FUEL_TYPES_QUERY = gql`
    query fuelTypes {
        fuelTypes {
            result {
                id
                name
                currentPrice {
                    id
                    price
                }
            }
        }
    }
`;

const useFuelTypes = () => {
    const { data, loading, error, refetch } = useQuery<IFuelTypesResult>(
        LIST_FUEL_TYPES_QUERY
    );

    if (error) {
        throw error;
    }
    const fuelTypes = data?.fuelTypes.result;
    return { fuelTypes, loading, refetch };
};

export default useFuelTypes;
