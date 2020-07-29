import { IAndFilterCriteria } from "./../core/filters";
import { useGetMyGasStation } from "./user.hooks";
import { useQuery } from "@apollo/react-hooks";
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
        exchangeSourceFuelType
        customerFirstName
        customerLastName
        customerDocumentNumber
        pumpExternalId
        stamp
      }
    }
  }
`;

const useOperationsByCustomers = (customerDocumentNumber: number, criteria?: {
  pagination?: { current: number; pageSize: number };
  sort?: Array<{ property: string; descending: boolean }>;
  filter?: IFilterCriteria;
}) => {
  const max = criteria?.pagination ? criteria.pagination.pageSize : undefined;

  const skip = criteria?.pagination
    ? criteria.pagination.current * criteria.pagination.pageSize -
    criteria.pagination.pageSize
    : undefined;



  const filter: { and: {}[] } = {
    and: [],
  };

  if (criteria && criteria.filter) {
    const criteriaFilter = criteria.filter as IAndFilterCriteria;
    criteriaFilter.and.map((c) => filter.and.push(c));
  }

  const customerFilter = {
    value: customerDocumentNumber,
    property: "customerDocumentNumber",
    type: "eq",
  }

  filter.and.push(customerFilter);

  console.log(filter);

  const { data, loading, error } = useQuery<IOperationsResult>(
    LIST_OPERATIONS_QUERY,
    {
      variables: {
        filter: filter ? JSON.stringify(filter) : undefined,
        max,
        skip,
        sort: JSON.stringify(criteria?.sort),
      },
    }
  );

  const operations = data?.operations.result;
  const total = data?.operations.pageInfo.total;

  return { operations, loading, error, total };
};

export default useOperationsByCustomers;
