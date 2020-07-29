import { FilterTypesEnum } from "./../core/filters";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { ITransferWithdrawalModel } from "../interfaces/models/transfer-withdrawal.model";

export type PendingTransferWithdrawalRecord = Pick<ITransferWithdrawalModel, 
    "id" | "stamp" | "withdrawal" | "accountType">;

export interface IPendingTransferWithdrawalResult {
  transferWithdrawals: {
    result: PendingTransferWithdrawalRecord[];
  };
}

const LIST_PENDING_TRANSFER_WITHDRAWALS_QUERY = gql`
  query transferWithdrawals($filter: String, $sort: String) {
    transferWithdrawals(criteria: { filter: $filter, sort: $sort }) {
        result {
            id
            stamp
            accountType
            withdrawal {
                id
                wallet{
                    id
                    customer{
                        id
                        firstName
                        lastName
                        documentNumber
                        cbu
                        cbuAlias
                        mercadopagoAccount
                    }
                }
                litres
                fuelPrice{
                    id
                    price
                }
            }
        }
    }
  }
`;

const usePendingTransferWithdrawals = () => {
  const { data, loading, error, refetch } = useQuery<IPendingTransferWithdrawalResult>(
    LIST_PENDING_TRANSFER_WITHDRAWALS_QUERY,
    {
      variables: {
        filter: JSON.stringify({
          type: FilterTypesEnum.IsNull,
          property: "authorized",
        }),
        sort: JSON.stringify([{
          property: "withdrawal.stamp",
          descending: true
        }])
      },
    }
  );

  if (error) {
    throw error;
  }
  const pendingTransferWithdrawals = data?.transferWithdrawals.result;
  return { pendingTransferWithdrawals, loading, refetch };
};

export default usePendingTransferWithdrawals;
