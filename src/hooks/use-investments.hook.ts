import { FilterTypesEnum } from "./../core/filters";
import { IInvestmentModel } from "./../interfaces/models/investment.model";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { IQuoteModel } from "../interfaces/models/quote.model";
import { IInvestmentTypeModel } from "../interfaces/models/investment-type.model";

export type InvestmentRecord = Pick<
  IInvestmentModel,
  "id" | "ammount" | "stamp" | "movementType" | "dueDate"
> & {
  quote: Pick<IQuoteModel, "id" | "price" | "arsEquivalent"> & {
    investmentType: Pick<IInvestmentTypeModel, "id" | "name">;
  };
  investmentType: Pick<IInvestmentTypeModel, "id" | "name">;
};
export interface IInvestmentsResult {
  investments: {
    result: InvestmentRecord[];
  };
}

const LIST_INVESTMENTS_QUERY = gql`
  query investments($filter: String) {
    investments(criteria: { filter: $filter }) {
      result {
        id
        ammount
        stamp
        dueDate
        investmentType {
          id
          name
        }
        quote {
          id
          price
          investmentType {
            id
            name
          }
          arsEquivalent
        }
        movementType
      }
    }
  }
`;

const useInvestments = (dueDate?: Date) => {
  const { data, loading, error, refetch } = useQuery<IInvestmentsResult>(
    LIST_INVESTMENTS_QUERY,
    {
      variables: {
        filter: dueDate
          ? JSON.stringify({
              type: FilterTypesEnum.LowerThanEquals,
              property: "dueDate",
              value: dueDate,
            })
          : undefined,
      },
    }
  );

  if (error) {
    throw error;
  }
  const investments = data?.investments.result;
  return { investments, loading, refetch };
};

export default useInvestments;
