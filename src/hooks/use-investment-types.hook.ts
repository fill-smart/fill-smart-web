import { Form } from "antd";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { IFilterCriteria } from "../core/filters";

export type InvestmentTypeRecord = {
  id: string;
  name: string;
};
export interface IInvestmentTypesResult {
  investmentTypes: {
    pageInfo: {
      total: number;
    };
    result: InvestmentTypeRecord[];
  };
}

const LIST_INVESTMENT_TYPES_QUERY = gql`
  query investmentTypes($max: Int, $skip: Int, $sort: String, $filter: String) {
    investmentTypes(
      criteria: { max: $max, skip: $skip, sort: $sort, filter: $filter }
    ) {
      pageInfo {
        total
      }
      result {
        id
        name
      }
    }
  }
`;

const useInvestmentTypes = (criteria?: {
  pagination?: { current: number; pageSize: number };
  sort?: Array<{ property: string; descending: boolean }>;
  filter?: IFilterCriteria;
}) => {
  const max = criteria?.pagination ? criteria.pagination.pageSize : undefined;
  const skip = criteria?.pagination
    ? criteria.pagination.current * criteria.pagination.pageSize -
      criteria.pagination.pageSize
    : undefined;
  const { data, loading, error, refetch } = useQuery<IInvestmentTypesResult>(
    LIST_INVESTMENT_TYPES_QUERY,
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
  const investmentTypes = data?.investmentTypes.result;
  const total = data?.investmentTypes.pageInfo.total;
  return { investmentTypes, loading, refetch, total };
};

export default useInvestmentTypes;
