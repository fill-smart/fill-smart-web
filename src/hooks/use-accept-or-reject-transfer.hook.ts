import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { SecurityContext } from "./../contexts/security.context";
import { useContext, useEffect } from "react";
import { message } from "antd";
import usePendingTransferWithdrawals from "./use-pending-transfers.hook";

const ACCEPT_TRANSFER_WITHDRAWAL_MUTATION = gql`
    mutation acceptTransferWithdrawal(
        $id: ID!
        $code: String!
        ) {
        acceptTransferWithdrawal(data: { id: $id, code: $code }) {
            ok
        }
    }
`;

const REJECT_TRANSFER_WITHDRAWAL_MUTATION = gql`
    mutation rejectTransferWithdrawal($id: ID!) {
        rejectTransferWithdrawal(data: { id: $id }) {
            ok
        }
    }
`;
const useAccept = () => {
    const [execute, { data, error, loading }] = useMutation<{
        acceptTransferWithdrawal: {
            ok: boolean;
        };
    }>(ACCEPT_TRANSFER_WITHDRAWAL_MUTATION);

    const authorize = (id: string, code: string) => {
        execute({
            variables: {
                id: id,
                code: code,
            }
        });
    };
    useEffect(() => {
        if (data?.acceptTransferWithdrawal.ok) {
            message.success("Se autorizo con exito");
        }
    }, [data?.acceptTransferWithdrawal.ok]);

    return { authorize };
};

const useReject = () => {
    const [execute, { data, error, loading }] = useMutation<{
        rejectTransferWithdrawal: {
            ok: boolean;
        };
    }>(REJECT_TRANSFER_WITHDRAWAL_MUTATION);

    const reject = (id: string) => {
        execute({
            variables: {
                id: id
            }
        });
    };
    useEffect(() => {
        if (data?.rejectTransferWithdrawal.ok) {
            message.warn("Se denego la autorizacion con exito");
        }
    }, [data?.rejectTransferWithdrawal.ok]);

    return { reject };
};

const useAcceptOrRejectTransferWithdrawal = () => {
    const acceptMutation = useAccept();
    const rejectMutation = useReject();

    return {
        accept: acceptMutation.authorize,
        reject: rejectMutation.reject
    };
};

export default useAcceptOrRejectTransferWithdrawal;
