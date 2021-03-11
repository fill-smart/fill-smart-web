import { useContext } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { SecurityContext, RolesEnum } from "../contexts/security.context";

interface IPumpsBySellerResult {
    me: {
        seller: {
            gasStation: {
                pumps: {
                    id: number;
                    externalId: string;
                    lastExternalOperation?: {
                        fuelType: {
                            name: string;
                            currentPrice: {
                                price: number;
                            };
                        };
                        stamp: Date;
                        litres: number;
                    };
                }[];
            };
        };
    };
}

interface IPumpsByAdministratorResult {
    me: {
        gasStationAdministrator: {
            gasStation: {
                pumps: {
                    id: number;
                    externalId: string;
                    lastExternalOperation?: {
                        fuelType: {
                            name: string;
                            currentPrice: {
                                price: number;
                            };
                        };
                        stamp: Date;
                        litres: number;
                    };
                }[];
            };
        };
    };
}

const LIST_PUMPS_BY_SELLER_QUERY = gql`
    query listPumpsBySeller {
        me {
            seller {
                id
                gasStation {
                    id
                    pumps {
                        id
                        externalId
                        lastExternalOperation {
                            id
                            fuelType {
                                id
                                currentPrice {
                                    id
                                    price
                                }
                                name
                            }
                            stamp
                            litres
                        }
                    }
                }
            }
        }
    }
`;

const LIST_PUMPS_BY_ADMINISTRATOR_QUERY = gql`
    query listPumpsByAdministrator {
        me {
            id
            gasStationAdministrator {
                id
                gasStation {
                    id
                    pumps {
                        id
                        externalId
                        lastExternalOperation {
                            id
                            fuelType {
                                id
                                currentPrice {
                                    id
                                    price
                                }
                                name
                            }
                            stamp
                            litres
                        }
                    }
                }
            }
        }
    }
`;

const usePumps = () => {
    const [security, _] = useContext(SecurityContext);

    const isGasStationAdmin = security.user?.roles
        .map(r => r.name)
        .includes(RolesEnum.GasStationAdmin);
    console.log(security.user, isGasStationAdmin);
    let query: any = null;
    if (isGasStationAdmin) {
        query = LIST_PUMPS_BY_ADMINISTRATOR_QUERY;
    } else {
        query = LIST_PUMPS_BY_SELLER_QUERY;
    }

    const { data, loading, error, refetch } = useQuery<
        IPumpsByAdministratorResult | IPumpsBySellerResult
    >(query, {
        fetchPolicy: "network-only",
        pollInterval: 30000
    });
    if (error) {
        throw error;
    }
    const pumps =
        (<IPumpsBySellerResult>data)?.me.seller?.gasStation.pumps ??
        (<IPumpsByAdministratorResult>data)?.me.gasStationAdministrator
            ?.gasStation.pumps;
    return { pumps, loading, refetch };
};
export default usePumps;
