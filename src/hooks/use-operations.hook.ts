import { IAndFilterCriteria } from "./../core/filters";
import { useGetMyGasStation } from "./user.hooks";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import moment from "moment";
import { IOperationModel } from "../interfaces/models/operation.model";
import { IFilterCriteria } from "../core/filters";

interface IOperationsResult {
  operations: {
    pageInfo: {
      total: number;
    };
    result: IOperationModel[];
  };
}

const LIST_OPERATIONS_QUERY = gql`
  query listOperations($max: Int, $skip: Int, $sort: String, $filter: String) {
    operations(
      criteria: { max: $max, skip: $skip, sort: $sort, filter: $filter }
    ) {
      pageInfo {
        total
      }
      result {
        id
        operationTypeId
        operationTypeName
        litres
        gasStationId
        gasStationName
        fuelPrice
        fuelTypeId
        fuelTypeName
        customerFirstName
        customerLastName
        customerDocumentNumber
        pumpExternalId
        stamp
        paymentMethod
        total
        targetCustomerFirstName
        targetCustomerLastName
        targetCustomerDocumentNumber
        transactionId
      }
    }
  }
`;

const useOperations = (criteria?: {
  pagination?: { current: number; pageSize: number };
  sort?: Array<{ property: string; descending: boolean }>;
  filter?: IFilterCriteria;
}) => {
  const max = criteria?.pagination ? criteria.pagination.pageSize : undefined;
  const skip = criteria?.pagination
    ? criteria.pagination.current * criteria.pagination.pageSize -
    criteria.pagination.pageSize
    : undefined;
  const { gasStation } = useGetMyGasStation();

  const filter: { and: {}[] } = {
    and: [],
  };

  if (gasStation && gasStation.id) {
    filter.and.push({
      type: "eq",
      property: "gasStationId",
      value: gasStation?.id,
    });
  }

  filter.and.push({
    type: "neq",
    property: "operationTypeName",
    value: "Canje de Combustible"
  });

  filter.and.push({
    or: [
      {
        type: "eq",
        property: "purchaseStatus",
        value: "completed"
      },
      {
        type: "null",
        property: "purchaseStatus",
        value: ""
      },
    ]
  });

  if (criteria && criteria.filter) {
    const criteriaFilter = criteria.filter as IAndFilterCriteria;
    criteriaFilter.and.map((c) => filter.and.push(c));
  }

  const { data, loading, error } = useQuery<IOperationsResult>(
    LIST_OPERATIONS_QUERY,
    {
      variables: {
        filter: filter ? JSON.stringify(filter) : undefined,
        max,
        skip,
        sort: JSON.stringify(criteria?.sort),
      },
      fetchPolicy: "no-cache"
    }
  );

  const operations = data?.operations.result;
  const total = data?.operations.pageInfo.total;

  return { operations, loading, error, total };
};

export const useOperationsLazy = (
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
  const { gasStation } = useGetMyGasStation();

  const filter: { and: {}[] } = {
    and: [],
  };

  if (gasStation && gasStation.id) {
    filter.and.push({
      type: "eq",
      property: "gasStationId",
      value: gasStation?.id,
    });
  }

  filter.and.push({
    type: "neq",
    property: "operationTypeName",
    value: "Canje de Combustible"
  });

  filter.and.push({
    or: [
      {
        type: "eq",
        property: "purchaseStatus",
        value: "completed"
      },
      {
        type: "null",
        property: "purchaseStatus",
        value: ""
      },
    ]
  });

  if (criteria && criteria.filter) {
    const criteriaFilter = criteria.filter as IAndFilterCriteria;
    criteriaFilter.and.map((c) => filter.and.push(c));
  }

  let sort = [{ property: 'stamp', descending: true }];
  if (criteria && criteria.sort) {
    sort = [...criteria.sort, ...sort];
  }

  const [execute, { data, loading, error }] = useLazyQuery<IOperationsResult>(
    LIST_OPERATIONS_QUERY,
    {
      variables: {
        filter: filter ? JSON.stringify(filter) : undefined,
        max,
        skip,
        sort: JSON.stringify(sort),
      },
      fetchPolicy: "no-cache"
    }
  );

  const operations = data?.operations.result;

  return { execute, operations, loading, error };
}

export default useOperations;
