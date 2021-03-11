import { gql } from "apollo-boost";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { IFilterCriteria } from "../core/filters";

export interface ICustomersResult {
  customers: {
    pageInfo: {
      total: number;
    };
    result: {
      id: number;
      documentNumber: string;
      firstName: string;
      lastName: string;
      created: Date;
      born: Date;
      phone: string;
      status: string;
      user: {
        username: string;
      };
      cbu: string;
      cbuAlias: string;
      mercadopagoAccount: string;
    }[];
  };
}

const LIST_CUSTOMERS_QUERY = gql`
  query listCustomers($max: Int, $skip: Int, $sort: String, $filter: String) {
    customers(
      criteria: { max: $max, skip: $skip, sort: $sort, filter: $filter }
    ) {
      pageInfo {
        total
      }
      result {
        id
        documentNumber
        firstName
        lastName
        created
        born
        phone
        status
        user {
          id
          username
        }
        cbu
        cbuAlias
        mercadopagoAccount
      }
    }
  }
`;

const useCustomers = (criteria?: {
  pagination?: { current: number; pageSize: number };
  sort?: Array<{ property: string; descending: boolean }>;
  filter?: IFilterCriteria;
}) => {
  const max = criteria?.pagination ? criteria.pagination.pageSize : undefined;
  const skip = criteria?.pagination
    ? criteria.pagination.current * criteria.pagination.pageSize -
    criteria.pagination.pageSize
    : undefined;
  const { data, loading, error, refetch } = useQuery<ICustomersResult>(
    LIST_CUSTOMERS_QUERY,
    {
      variables: {
        max,
        skip,
        sort: JSON.stringify(criteria?.sort),
        filter: JSON.stringify(criteria?.filter),
      },
    }
  );

  if (error) {
    throw error;
  }
  const total = data?.customers.pageInfo.total;
  const customers = data?.customers.result;
  return { customers, loading, refetch, total };
};

export const useCustomersLazy = (
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
  const [execute, { data, loading, error }] = useLazyQuery<ICustomersResult>(
    LIST_CUSTOMERS_QUERY,
    {
      variables: {
        max,
        skip,
        sort: JSON.stringify(criteria?.sort),
        filter: JSON.stringify(criteria?.filter),
      },
    }
  );

  if (error) {
    throw error;
  }
  const customers = data?.customers.result;

  return { execute, customers, loading, error };
}

export default useCustomers;
