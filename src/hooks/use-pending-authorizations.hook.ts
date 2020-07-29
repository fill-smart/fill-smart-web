import { useQuery } from "@apollo/react-hooks";
import { IRefuelModel } from "./../interfaces/models/refuel.model";
import { ICashWithdrawalModel } from "./../interfaces/models/cash-withdrawal.model";
import { gql } from "apollo-boost";
import { SecurityContext } from "./../contexts/security.context";
import { useContext, useEffect } from "react";
import { IShopPurchaseModel } from "../interfaces/models/shop-purchase.model";
import { IFuelPriceModel } from "../interfaces/models/fuel-price.model";
import { IFuelTypeModel } from "../interfaces/models/fuel-type.model";
import { ICustomerModel } from "../interfaces/models/customer.model";
import { IPumpModel } from "../interfaces/models/pump.model";
import { IPurchaseModel } from "../interfaces/models/purchase.model";

export interface IWalletCustomer {
    id: string;
    customer: Pick<
        ICustomerModel,
        "id" | "documentNumber" | "firstName" | "lastName"
    >;
}

export interface IPendingAuthorization {
    id: string;
    stamp: Date;
    shopPurchase: Pick<IShopPurchaseModel, "id" | "litres"> & {
        fuelPrice: Pick<IFuelPriceModel, "id" | "price">;
        wallet: IWalletCustomer;
    };
    cashWithdrawal: Pick<ICashWithdrawalModel, "id" | "litres"> & {
        fuelPrice: Pick<IFuelPriceModel, "id" | "price">;
        wallet: IWalletCustomer;
    };
    refuel: Pick<IRefuelModel, "id" | "litres"> & {
        fuelType: Pick<IFuelTypeModel, "id" | "name">;
        pump: Pick<IPumpModel, "externalId" | "id">;
        wallet: IWalletCustomer;
    };
    purchase: Pick<IPurchaseModel, "id" | "litres"> & {
        fuelPrice: Pick<IFuelPriceModel, "id" | "price">;
        fuelType: Pick<IFuelTypeModel, "id" | "name">;
        pump: Pick<IPumpModel, "externalId" | "id">;
        wallet: IWalletCustomer;
    };
}

interface IPendingAuthorizationResults {
    authorizations: { result: IPendingAuthorization[] };
}

const GET_PENDING_AUTHORIZATIONS_QUERY = gql`
    query getAuthorizationPendings($filter: String!, $sort: String!) {
        authorizations(criteria: { filter: $filter, sort: $sort }) {
            result {
                id
                stamp
                status
                refuel {
                    id
                    fuelType {
                        id
                        name
                    }
                    pump {
                        id
                        externalId
                    }
                    litres
                    wallet {
                        id
                        customer {
                            id
                            documentNumber
                            firstName
                            lastName
                        }
                    }
                }
                cashWithdrawal {
                    id
                    litres
                    fuelPrice {
                        id
                        price
                    }
                    wallet {
                        id
                        customer {
                            id
                            documentNumber
                            firstName
                            lastName
                        }
                    }
                }
                shopPurchase {
                    id
                    litres
                    fuelPrice {
                        id
                        price
                    }
                    wallet {
                        id
                        customer {
                            id
                            documentNumber
                            firstName
                            lastName
                        }
                    }
                }
                purchase {
                    id
                    litres
                    fuelPrice {
                        id
                        price
                    }
                    wallet {
                        id
                        customer {
                            id
                            documentNumber
                            firstName
                            lastName
                        }
                    }
                }
            }
        }
    }
`;

const usePendingAuthorizations = () => {
    const [security] = useContext(SecurityContext);
    const gasStationId = security.user?.seller?.gasStation.id;
    console.log("gasStationId: ", gasStationId);
    if (!gasStationId) {
        throw "The use has no gas station";
    }
    const { data, loading, error, refetch } = useQuery<
        IPendingAuthorizationResults
    >(GET_PENDING_AUTHORIZATIONS_QUERY, {
        fetchPolicy: "network-only",
        variables: {
            filter: JSON.stringify({
                and: [
                    {
                        or: [
                            {
                                property: "refuel.pump.gasStation.id",
                                type: "eq",
                                value: gasStationId
                            },
                            {
                                property: "shopPurchase.gasStation.id",
                                type: "eq",
                                value: gasStationId
                            },
                            {
                                property: "cashWithdrawal.gasStation.id",
                                type: "eq",
                                value: gasStationId
                            },
                            {
                                property: "purchase.gasStation.id",
                                type: "eq",
                                value: gasStationId
                            }
                        ]
                    },
                    { property: "status", type: "eq", value: "pending" }
                ]
            }),
            sort: JSON.stringify([{ property: "stamp", descending: true }])
        }
    });
    const authorizations = data?.authorizations.result;
    return { authorizations, loading, error, refetch };
};

export default usePendingAuthorizations;
