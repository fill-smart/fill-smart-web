import {
  FilterTypesEnum,
  IFilterCriteria,
  IAndFilterCriteria,
} from "./../core/filters";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { ITransferWithdrawalModel } from "../interfaces/models/transfer-withdrawal.model";

export type PendingTransferWithdrawalRecord = Pick<
  ITransferWithdrawalModel,
  "id" | "stamp" | "withdrawal" | "accountType"
>;

export interface IPendingTransferWithdrawalResult {
  transferWithdrawals: {
    pageInfo: {
      total: number;
    };
    result: PendingTransferWithdrawalRecord[];
  };
}

const LIST_PENDING_TRANSFER_WITHDRAWALS_QUERY = gql`
  query pendingTransferWithdrawals($filter: String, $sort: String) {
    transferWithdrawals(criteria: { filter: $filter, sort: $sort }) {
      pageInfo {
        total
      }
      result {
        id
        stamp
        accountType
        withdrawal {
          id
          wallet {
            id
            customer {
              id
              firstName
              lastName
              documentNumber
              cbu
              cbuAlias
              mercadopagoAccount
            }
          }
          stamp
          litres
          fuelPrice {
            id
            price
          }
        }
      }
    }
  }
`;

const usePendingTransferWithdrawals = (criteria?: {
  pagination?: { current: number; pageSize: number };
  sort?: Array<{ property: string; descending: boolean }>;
  filter?: IFilterCriteria;
}) => {
  const { data, loading, error, refetch } = useQuery<
    IPendingTransferWithdrawalResult
  >(LIST_PENDING_TRANSFER_WITHDRAWALS_QUERY, {
    variables: {
      sort: JSON.stringify(criteria?.sort),
      filter: JSON.stringify({
        and: (criteria?.filter as IAndFilterCriteria)?.and.concat([
          { property: "authorized", type: FilterTypesEnum.IsNull, value: null },
        ]),
      }),
    },
  });

  if (error) {
    throw error;
  }
  const total = data?.transferWithdrawals.pageInfo.total;
  const pendingTransferWithdrawals = data?.transferWithdrawals.result;
  return { pendingTransferWithdrawals, loading, refetch, total };
};

export default usePendingTransferWithdrawals;
