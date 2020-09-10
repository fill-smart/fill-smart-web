import {
  IAndFilterCriteria,
  FilterTypesEnum,
  IPropertyFilterCriterion,
} from "./../core/filters";
import { ICashDepositModel } from "./../interfaces/models/cash-deposit.model";
import { gql } from "apollo-boost";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { IGasStationModel } from "../interfaces/models/gas-station.model";
import { RolesEnum, SecurityContext } from "../contexts/security.context";
import { useContext } from "react";
import { IFilterCriteria } from "../core/filters";

export type CashDepositRecord = Pick<
  ICashDepositModel,
  "id" | "amount" | "stamp" | "receipt"
> & {
  gasStation: Pick<IGasStationModel, "id" | "name">;
};
export interface ICashDepositResult {
  cashDeposits: {
    pageInfo: {
      total: number;
    };
    result: CashDepositRecord[];
  };
}

const LIST_DEPOSITS_QUERY = gql`
  query cashDeposits($max: Int, $skip: Int, $sort: String, $filter: String) {
    cashDeposits(
      criteria: { max: $max, skip: $skip, sort: $sort, filter: $filter }
    ) {
      pageInfo {
        total
      }
      result {
        id
        amount
        stamp
        receipt
        gasStation {
          id
          name
        }
      }
    }
  }
`;

const useCashDeposits = (
  gasStationId?: string,
  criteria?: {
    pagination?: { current: number; pageSize: number };
    sort?: Array<{ property: string; descending: boolean }>;
    filter?: IFilterCriteria;
  }
) => {
  const max = criteria?.pagination ? criteria.pagination.pageSize : undefined;
  const skip = criteria?.pagination
    ? criteria.pagination.current * criteria.pagination.pageSize -
      criteria.pagination.pageSize
    : undefined;

  let filter: { and: {}[] } = {
    and: [],
  };
  if (gasStationId) {
    filter.and.push({
      or: [
        {
          property: "gasStation.id",
          type: "eq",
          value: Number(gasStationId),
        },
      ],
    });

    if (
      criteria &&
      criteria.filter &&
      (criteria.filter as IAndFilterCriteria).and
    ) {
      (criteria.filter as IAndFilterCriteria).and.map((f) =>
        filter.and.push(f)
      );
    }
  }

  const variables = {
    filter: filter ? JSON.stringify(filter) : undefined,
    sort: criteria?.sort ? JSON.stringify(criteria?.sort) : undefined,
    max,
    skip,
  };

  const { data, loading, error, refetch } = useQuery<ICashDepositResult>(
    LIST_DEPOSITS_QUERY,
    { variables }
  );

  const total = data?.cashDeposits.pageInfo.total;
  const cashDeposits = data?.cashDeposits.result;
  return { cashDeposits, loading, refetch, total };
};

export const useCashDepositsLazy = (
  gasStationId?: string,
  criteria?: {
    pagination?: { current: number; pageSize: number };
    sort?: Array<{ property: string; descending: boolean }>;
    filter?: IFilterCriteria;
  }
) => {
  const max = criteria?.pagination ? criteria.pagination.pageSize : undefined;
  const skip = criteria?.pagination
    ? criteria.pagination.current * criteria.pagination.pageSize -
      criteria.pagination.pageSize
    : undefined;
  let filter: { and: {}[] } = {
    and: [],
  };

  if (gasStationId) {
    filter.and.push({
      or: [
        {
          property: "gasStation.id",
          type: "eq",
          value: Number(gasStationId),
        },
      ],
    });

    if (
      criteria &&
      criteria.filter &&
      (criteria.filter as IAndFilterCriteria).and
    ) {
      (criteria.filter as IAndFilterCriteria).and.map((f) =>
        filter.and.push(f)
      );
    }
  }

  const [execute, { data, loading, error }] = useLazyQuery<ICashDepositResult>(
    LIST_DEPOSITS_QUERY,
    {
      variables: {
        filter: JSON.stringify(filter),
        sort: criteria?.sort ? JSON.stringify(criteria?.sort) : undefined,
        max,
        skip,
      }
    }
  );

  const cashDeposits = data?.cashDeposits.result;

  return { execute, cashDeposits, loading, error };
}

export default useCashDeposits;
