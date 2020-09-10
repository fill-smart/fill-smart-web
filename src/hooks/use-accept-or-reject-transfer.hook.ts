import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { SecurityContext } from "./../contexts/security.context";
import { useContext, useEffect } from "react";
import { message } from "antd";
import usePendingTransferWithdrawals from "./use-pending-transfers.hook";
export interface IConfirTransactionModel {
    code: string;
    voucher: { fileList: Array<{ thumbUrl: string, originFileObj: any }>, file: any }
}

const ACCEPT_TRANSFER_WITHDRAWAL_MUTATION = gql`
    mutation acceptTransferWithdrawal(
        $id: ID!
        $code: String!
        $fileList: [Upload!]!
        ) {
        acceptTransferWithdrawal(data: { id: $id, code: $code, fileList: $fileList }) {
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
const useAccept = (onSuccess: () => void) => {
    const [execute, { data, error, loading }] = useMutation<{
        acceptTransferWithdrawal: {
            ok: boolean;
        };
    }>(ACCEPT_TRANSFER_WITHDRAWAL_MUTATION);

    const authorize = (id: string, code: string, fileList: any) => {
        execute({
            variables: {
                id: id,
                code: code,
                fileList: fileList,
            }
        });
    };
    useEffect(() => {
        if (data?.acceptTransferWithdrawal.ok) {
            message.success("Se autorizo con exito");
            onSuccess();
        }
    }, [data?.acceptTransferWithdrawal.ok]);

    return { authorize };
};

const useReject = (onSuccess: () => void) => {
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
            onSuccess()
        }
    }, [data?.rejectTransferWithdrawal.ok]);

    return { reject };
};

const useAcceptOrRejectTransferWithdrawal = (onSuccess: () => void) => {
    const acceptMutation = useAccept(onSuccess);
    const rejectMutation = useReject(onSuccess);

    return {
        accept: acceptMutation.authorize,
        reject: rejectMutation.reject
    };
};

export default useAcceptOrRejectTransferWithdrawal;
