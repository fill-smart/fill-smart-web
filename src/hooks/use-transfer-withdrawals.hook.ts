import { FilterTypesEnum } from "../core/filters";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { ITransferWithdrawalModel } from "../interfaces/models/transfer-withdrawal.model";

export type TransferWithdrawalRecord = Pick<ITransferWithdrawalModel, 
    "id" | "stamp" | "withdrawal" | "code" | "authorized" | "accountType">;

export interface ITransferWithdrawalsResult {
  transferWithdrawals: {
    result: TransferWithdrawalRecord[];
  };
}

const LIST_TRANSFER_WITHDRAWALS_QUERY = gql`
  query transferWithdrawals($filter: String, $sort: String) {
    transferWithdrawals(criteria: { filter: $filter, sort: $sort }) {
        result {
            id
            stamp
            code
            accountType
            authorized
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

const useTransferWithdrawals = () => {
  const { data, loading, error, refetch } = useQuery<ITransferWithdrawalsResult>(
    LIST_TRANSFER_WITHDRAWALS_QUERY,
    {
      variables: {
        filter: JSON.stringify({
          type: FilterTypesEnum.IsNotNull,
          property: "authorized",
        }),
        sort: JSON.stringify([{
          property: "stamp",
          descending: true
        }])
      },
    }
  );

  if (error) {
    throw error;
  }
  const transferWithdrawals = data?.transferWithdrawals.result;
  return { transferWithdrawals, loading, refetch };
};

export default useTransferWithdrawals;
