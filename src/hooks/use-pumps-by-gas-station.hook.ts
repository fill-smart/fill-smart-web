import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

interface IPumpsResult {
    pumps: {
        result: {
            externalId: string;
            created: Date;
        }[];
    };
}

const LIST_PUMPS_BY_GAS_STATION_QUERY = gql`
    query listPumpsByGasStation($criteria: String!) {
        pumps(criteria: { filter: $criteria }) {
            result {                
                id
                externalId
                created
            }
        }
    }
`;

const usePumpsByGasStations = (gasStationId: number) => {
    const { data, loading, error, refetch } = useQuery<IPumpsResult>(
        LIST_PUMPS_BY_GAS_STATION_QUERY,
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
    if (error) {
        throw error;
    }
    const pumps = data?.pumps.result;
    return { pumps, loading, refetch };
};

export default usePumpsByGasStations;
