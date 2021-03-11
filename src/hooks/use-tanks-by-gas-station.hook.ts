import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

interface ITanksResult {
    gasTanks: {
        result: {
            externalId: string;
            created: Date;
            fuelType: {
                name: string;
            };
            litres: number;
        }[];
    };
}

const LIST_TANKS_BY_GAS_STATION_QUERY = gql`
    query listGasTanksByGasStation($criteria: String!) {
        gasTanks(criteria: { filter: $criteria }) {
            result {
                id
                externalId
                fuelType {
                    name
                }
                litres
            }
        }
    }
`;

const useTanksByGasStations = (gasStationId: number) => {
    const { data, loading, error } = useQuery<ITanksResult>(
        LIST_TANKS_BY_GAS_STATION_QUERY,
        {
            variables: {
                criteria: JSON.stringify({
                    value: gasStationId,
                    property: "gasStation.id",
                    type: "eq"
                })
            }
        }
    );
    console.log(data);
    if (error) {
        throw error;
    }
    const gasTanks = data?.gasTanks.result;
    return { gasTanks, loading };
};

export default useTanksByGasStations;
