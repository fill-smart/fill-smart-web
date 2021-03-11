import { IAndFilterCriteria } from "./../core/filters";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { IQuoteModel } from "../interfaces/models/quote.model";
import { IInvestmentTypeModel } from "../interfaces/models/investment-type.model";
import { IFilterCriteria } from "../core/filters";

export type QuoteRecord = Pick<IQuoteModel, "id" | "from" | "to" | "price"> & {
  parentQuote: QuoteRecord;
  investmentType: Pick<IInvestmentTypeModel, "id" | "name">;
};
export interface IQuotesResult {
  quotes: {
    pageInfo: {
      total: number;
    };
    result: QuoteRecord[];
  };
}

const LIST_QUOTES_QUERY = gql`
  query quotes($max: Int, $skip: Int, $sort: String, $filter: String) {
    quotes(criteria: { max: $max, skip: $skip, sort: $sort, filter: $filter }) {
      pageInfo {
        total
      }
      result {
        id
        parentQuote {
          id
        }
        investmentType {
          id
          name
        }
        from
        to
        price
      }
    }
  }
`;

const useQuotes = (criteria?: {
  pagination?: { current: number; pageSize: number };
  sort?: Array<{ property: string; descending: boolean }>;
  filter?: IFilterCriteria;
}) => {
  const max = criteria?.pagination ? criteria.pagination.pageSize : undefined;
  const skip = criteria?.pagination
    ? criteria.pagination.current * criteria.pagination.pageSize -
      criteria.pagination.pageSize
    : undefined;
  const filter = criteria?.filter
    ? [
        ...(criteria.filter as IAndFilterCriteria).and,
        {
          type: "null",
          property: "to",
        },
      ]
    : undefined;
  const { data, loading, error, refetch } = useQuery<IQuotesResult>(
    LIST_QUOTES_QUERY,
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
  const quotes = data?.quotes.result;
  const total = data?.quotes.pageInfo.total;
  return { quotes, loading, refetch, total };
};

export default useQuotes;
