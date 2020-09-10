import { FilterTypesEnum, IFilterCriteria, IAndFilterCriteria } from "../core/filters";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { ITransferWithdrawalModel } from "../interfaces/models/transfer-withdrawal.model";

export type TransferWithdrawalRecord = Pick<ITransferWithdrawalModel,
  "id" | "stamp" | "withdrawal" | "code" | "authorized" | "accountType">;

export interface ITransferWithdrawalsResult {
  transferWithdrawals: {
    result: TransferWithdrawalRecord[];
    pageInfo: {
      total: number;
    };
  };
}

const LIST_TRANSFER_WITHDRAWALS_QUERY = gql`
  query transferWithdrawals($filter: String, $sort: String) {
    transferWithdrawals(criteria: { filter: $filter, sort: $sort }) {
        pageInfo {
            total
        }
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

const useTransferWithdrawals = (criteria?: {
  pagination?: { current: number; pageSize: number };
  sort?: Array<{ property: string; descending: boolean }>;
  filter?: IFilterCriteria;
}) => {
  const { data, loading, error, refetch } = useQuery<ITransferWithdrawalsResult>(
    LIST_TRANSFER_WITHDRAWALS_QUERY,
    {
      variables: {
        sort: JSON.stringify(criteria?.sort),
        filter: JSON.stringify({ and: (criteria?.filter as IAndFilterCriteria)?.and.concat([{ property: "authorized", type: FilterTypesEnum.IsNotNull, value: null }]) })
      },
    }
  );

  if (error) {
    throw error;
  }
  const total = data?.transferWithdrawals.pageInfo.total;
  const transferWithdrawals = data?.transferWithdrawals.result;
  return { transferWithdrawals, loading, refetch, total };
};

export default useTransferWithdrawals;
