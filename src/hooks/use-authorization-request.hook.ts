import { SecurityContext } from "./../contexts/security.context";
import { useEffect, useContext } from "react";
import { useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import usePendingAuthorizations from "./use-pending-authorizations.hook";
import { notification } from "antd";
import { IAuthorizationModel } from "../interfaces/models/authorization.model";

const AUTHORIZATION_REQUESTED_SUBSCRIPTION = gql`
    subscription authorizationRequested($gasStationId: ID!) {
        authorizationRequested(gasStationId: $gasStationId) {
            id
            cashWithdrawal {
                id
                wallet {
                    id
                    customer {
                        id
                        firstName
                        lastName
                    }
                }
            }
            shopPurchase {
                id
                wallet {
                    id
                    customer {
                        id
                        firstName
                        lastName
                    }
                }
            }
            refuel {
                id
                wallet {
                    id
                    customer {
                        id
                        firstName
                        lastName
                    }
                }
            }
            purchase {
                id
                wallet {
                    id
                    customer {
                        id
                        firstName
                        lastName
                    }
                }
            }
        }
    }
`;

const getTypeDescription = (
    authorization: Partial<IAuthorizationModel>
): [string, string] => {
    if (authorization.cashWithdrawal) {
        return [
            "Retiro de Efectivo",
            authorization.cashWithdrawal!.wallet.customer.firstName +
                " " +
                authorization.cashWithdrawal!.wallet.customer.lastName
        ];
    }
    if (authorization.refuel) {
        return [
            "Recarga de Combustible",
            authorization.refuel!.wallet.customer.firstName +
                " " +
                authorization.refuel!.wallet.customer.lastName
        ];
    }
    if (authorization.purchase) {
        return [
            "Compra en Efectivo",
            authorization.purchase!.wallet.customer.firstName +
                " " +
                authorization.purchase!.wallet.customer.lastName
        ];
    } else
        return [
            "Compra en Shop",
            authorization.shopPurchase!.wallet.customer.firstName +
                " " +
                authorization.shopPurchase!.wallet.customer.lastName
        ];
};

const openNotificationWithIcon = (
    type: "success" | "warning" | "info" | "error",
    title: string,
    description: string
) => {
    notification[type]({
        message: title,
        description,
        duration: 8
    });
};

const useAuthorizationRequest = () => {
    const { refetch } = usePendingAuthorizations();
    const [security] = useContext(SecurityContext);
    const gasStationId = security.user?.seller?.gasStation.id;
    console.log("gasStationId from sub: ", gasStationId);
    if (!gasStationId) {
        throw "The user has no gas station";
    }
    const sub = useSubscription<{
        authorizationRequested: Partial<IAuthorizationModel>;
    }>(AUTHORIZATION_REQUESTED_SUBSCRIPTION, {
        variables: {
            gasStationId
        }
    });
    useEffect(() => {
        if (
            sub.data?.authorizationRequested &&
            sub.data?.authorizationRequested.id
        ) {
            openNotificationWithIcon(
                "info",
                `Autorizar ${
                    getTypeDescription(sub.data.authorizationRequested)[0]
                }`,
                `${
                    getTypeDescription(sub.data.authorizationRequested)[1]
                } solicita autorizacion, recuerde solicitarle el DNI y verificar su identidad`
            );
            refetch();
        }
    }, [sub.data]);
};

export default useAuthorizationRequest;
