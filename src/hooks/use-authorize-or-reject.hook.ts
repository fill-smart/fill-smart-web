import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { SecurityContext } from "./../contexts/security.context";
import { useContext, useEffect } from "react";
import usePendingAuthorizations from "./use-pending-authorizations.hook";
import { message } from "antd";

const GRANT_DNI_AUTHORIZATION_MUTATION = gql`
    mutation grantDniAuthorization($id: ID!) {
        grantDniAuthorization(data: { id: $id }) {
            ok
        }
    }
`;

const REJECT_DNI_AUTHORIZATION_MUTATION = gql`
    mutation rejectDniAuthorization($id: ID!) {
        rejectDniAuthorization(data: { id: $id }) {
            ok
        }
    }
`;
const useAuthorize = () => {
    const { refetch } = usePendingAuthorizations();
    const [execute, { data, error, loading }] = useMutation<{
        grantDniAuthorization: {
            ok: boolean;
        };
    }>(GRANT_DNI_AUTHORIZATION_MUTATION);

    const authorize = (id: string) => {
        execute({
            variables: {
                id: id
            }
        });
    };
    useEffect(() => {
        if (data?.grantDniAuthorization.ok) {
            message.success("Se autorizo con exito");
            refetch();
        } else if (data?.grantDniAuthorization.ok === false) {
            message.error("El usuario no cuenta con fondos suficientes");
        }
    }, [data?.grantDniAuthorization.ok]);

    return { authorize };
};

const useReject = () => {
    const { refetch } = usePendingAuthorizations();
    const [execute, { data, error, loading }] = useMutation<{
        rejectDniAuthorization: {
            ok: boolean;
        };
    }>(REJECT_DNI_AUTHORIZATION_MUTATION);

    const reject = (id: string) => {
        execute({
            variables: {
                id: id
            }
        });
    };
    useEffect(() => {
        if (data?.rejectDniAuthorization.ok) {
            message.warn("Se denego la autorizacion con exito");
            refetch();
        }
    }, [data?.rejectDniAuthorization.ok]);

    return { reject };
};

const useAuthorizeOrReject = () => {
    const authorizeMutation = useAuthorize();
    const rejectMutation = useReject();

    return {
        authorize: authorizeMutation.authorize,
        reject: rejectMutation.reject
    };
};

export default useAuthorizeOrReject;
