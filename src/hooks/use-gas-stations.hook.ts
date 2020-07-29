import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { IFilterCriteria } from "../core/filters";

export interface IGasStationsResult {
  gasStations: {
    pageInfo: {
      total: number;
    };
    result: {
      id: string;
      name: string;
      address: string;
      created: Date;
      pumpsCount: number;
      purchaseRequireAuthorization: boolean;
    }[];
  };
}

const LIST_GASSTATIONS_QUERY = gql`
  query listGasStations($max: Int, $skip: Int, $sort: String, $filter: String) {
    gasStations(
      criteria: { max: $max, skip: $skip, sort: $sort, filter: $filter }
    ) {
      pageInfo {
        total
      }
      result {
        id
        name
        address
        created
        pumpsCount
        purchaseRequireAuthorization
      }
    }
  }
`;

const useGasStations = (criteria?: {
  pagination?: { current: number; pageSize: number };
  sort?: Array<{ property: string; descending: boolean }>;
  filter?: IFilterCriteria;
}) => {
  const max = criteria?.pagination ? criteria.pagination.pageSize : undefined;
  const skip = criteria?.pagination
    ? criteria.pagination.current * criteria.pagination.pageSize -
      criteria.pagination.pageSize
    : undefined;
  const { data, loading, error, refetch } = useQuery<IGasStationsResult>(
    LIST_GASSTATIONS_QUERY,
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
  const total = data?.gasStations.pageInfo.total;
  const gasStations = data?.gasStations.result;
  return { gasStations, loading, refetch, total };
};

export default useGasStations;
