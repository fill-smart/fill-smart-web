import { SecurityContext, RolesEnum } from "./../contexts/security.context";
import { useContext } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { IGasStationModel } from "../interfaces/models/gas-station.model";

type GasStationInfo = Pick<IGasStationModel, "name" | "id">;
interface IGasStationInfoResult {
    me: {
        gasStationAdministrator?: {
            gasStation: GasStationInfo;
        };
        seller?: {
            gasStation: GasStationInfo;
        };
    };
}

const GAS_STATION_INFO_QUERY = gql`
    query gasStationInfo {
        me {
            gasStationAdministrator {
                gasStation {
                    id
                    name
                }
            }
            seller {
                gasStation {
                    id
                    name
                }
            }
        }
    }
`;

export const useGetMyGasStation = () => {
    const [security] = useContext(SecurityContext);
    let filter: string | undefined;
    if (
        security.user?.roles
            .map(r => r.name)
            .includes(RolesEnum.GasStationAdmin)
    ) {
        filter = JSON.stringify({
            or: [
                {
                    property: "seller.gasStation.id",
                    type: "eq",
                    value: security.user.gasStationAdministrator?.gasStation.id
                },
                {
                    property: "gasStationAdministrator.gasStation.id",
                    type: "eq",
                    value: security.user.gasStationAdministrator?.gasStation.id
                }
            ]
        });
    }
    const { data, loading, error } = useQuery<IGasStationInfoResult>(
        GAS_STATION_INFO_QUERY
    );
    if (error) {
        //show a message
    }
    const gasStation =
        data?.me.gasStationAdministrator?.gasStation ??
        data?.me.seller?.gasStation;
    return { gasStation, loading };
};
