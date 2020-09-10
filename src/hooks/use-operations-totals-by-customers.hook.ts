import { IAndFilterCriteria } from "./../core/filters";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { IOperationModel } from "../interfaces/models/operation.model";
import { IFilterCriteria } from "../core/filters";
import { IOperationTotalByCustomerModel } from "../interfaces/models/operation-total-by-customer";

interface IOperationsTotalsByCustomerResult {
  operationTotalsByCustomer: {
    pageInfo: {
      total: number;
    };
    result: IOperationTotalByCustomerModel[];
  };
}

const LIST_OPERATIONS_TOTAL_BY_CUSTOMER_QUERY = gql`
  query operationTotalsByCustomer($max: Int, $skip: Int, $sort: String, $filter: String){
  operationTotalsByCustomer(
    criteria: { max: $max, skip: $skip, sort: $sort, filter: $filter }
  ){
    pageInfo{
      total
    }
    result{      
      customerDocumentNumber
      customerFirstName
      customerLastName
      totalSold
      totalDelivered
      totalPending
    }
  }
}
`;

const useOperationsTotalsByCustomer = (criteria?: {
  pagination?: { current: number; pageSize: number };
  sort?: Array<{ property: string; descending: boolean }>;
  filter?: IFilterCriteria;
}) => {
  const max = criteria?.pagination ? criteria.pagination.pageSize : undefined;

  const skip = criteria?.pagination
    ? criteria.pagination.current * criteria.pagination.pageSize - criteria.pagination.pageSize : undefined;

  const { data, loading, error } = useQuery<IOperationsTotalsByCustomerResult>(
    LIST_OPERATIONS_TOTAL_BY_CUSTOMER_QUERY,
    {
      variables: {
        max,
        skip,
        filter: JSON.stringify(criteria?.filter),
        sort: JSON.stringify(criteria?.sort),
      },
    }
  );
  
  const operationsTotalsByCustomer = data?.operationTotalsByCustomer.result;
  const total = data?.operationTotalsByCustomer.pageInfo.total;

  return { operationsTotalsByCustomer, loading, error, total };
};

export const useOperationsTotalsByCustomerLazy = (criteria?: {
  pagination?: { current: number; pageSize: number };
  sort?: Array<{ property: string; descending: boolean }>;
  filter?: IFilterCriteria;
}) => {
  const max = criteria?.pagination ? criteria.pagination.pageSize : undefined;

  const skip = criteria?.pagination
    ? criteria.pagination.current * criteria.pagination.pageSize - criteria.pagination.pageSize : undefined;

  const [execute, { data, loading, error }] = useLazyQuery<IOperationsTotalsByCustomerResult>(
    LIST_OPERATIONS_TOTAL_BY_CUSTOMER_QUERY,
    {
      variables: {
        max,
        skip,
        filter: JSON.stringify(criteria?.filter),
        sort: JSON.stringify(criteria?.sort),
      },
    }
  );
  
  const operationsTotalsByCustomer = data?.operationTotalsByCustomer.result;
  const total = data?.operationTotalsByCustomer.pageInfo.total;

  return { execute, operationsTotalsByCustomer, loading, error, total };
};

export default useOperationsTotalsByCustomer;
