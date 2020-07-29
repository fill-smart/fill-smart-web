import { useEffect, useContext } from "react";
import { useSubscription } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import usePendingTransferWithdrawals from "./use-pending-transfers.hook";
import useTransferWithdrawals from "./use-transfer-withdrawals.hook";
import { ITransferWithdrawalModel } from "../interfaces/models/transfer-withdrawal.model";


const TRANSFER_WITHDRAWAL_REQUESTED = gql`
    subscription {
        transferWithdrawalRequested {
            id
        }
    }
`;

const useTransferWithdrawalSubscription = () => {
    const { refetch: pendingTransferWithdrawalsRefetch } = usePendingTransferWithdrawals();
    const { refetch: transferWithdrawalsRefetch } = useTransferWithdrawals();

    const sub = useSubscription<{
        transferWithdrawalRequested: Partial<ITransferWithdrawalModel>;
    }>(TRANSFER_WITHDRAWAL_REQUESTED);

    useEffect(() => {
        if (
            sub.data?.transferWithdrawalRequested &&
            sub.data?.transferWithdrawalRequested.id
        ) {
            transferWithdrawalsRefetch();
            pendingTransferWithdrawalsRefetch();
        }
    }, [sub.data]);
};

export default useTransferWithdrawalSubscription;
