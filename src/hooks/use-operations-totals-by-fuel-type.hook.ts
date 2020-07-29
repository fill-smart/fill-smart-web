import { IAndFilterCriteria } from "./../core/filters";
import { useGetMyGasStation } from "./user.hooks";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import moment from "moment";
import { IOperationModel } from "../interfaces/models/operation.model";
import { IFilterCriteria } from "../core/filters";
import { IOperationTotalByFuelTypeModel } from "../interfaces/models/operation-total-by-fuel-type";

interface IOperationsTotalsByFuelTypeResult {
    operationTotalsByFuelType: {
        pageInfo: {
            total: number;
        };
        result: IOperationTotalByFuelTypeModel[];
    };
}

const LIST_OPERATIONS_QUERY = gql`
  query operationTotalsByFuelType($max: Int, $skip: Int, $sort: String, $filter: String){
  operationTotalsByFuelType(
    criteria: { max: $max, skip: $skip, sort: $sort, filter: $filter }
  ){
    pageInfo{
      total
    }
    result{
      fuelTypeName
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

const useOperationsTotalsByFuelType = () => {

    const [execute, { data, loading, error }] = useLazyQuery<IOperationsTotalsByFuelTypeResult>(
        LIST_OPERATIONS_QUERY
    );

    const getTotalOperationsByFuelTypeAndCustomer = (documentNumber: number) => {
        execute({
            variables: {
                filter: JSON.stringify({
                    type: "eq",
                    property: "customerDocumentNumber",
                    value: documentNumber
                })
            }
        });
    }

    const operationsTotalsByFuelType = data?.operationTotalsByFuelType.result;
    const total = data?.operationTotalsByFuelType.pageInfo.total;

    return { getTotalOperationsByFuelTypeAndCustomer, operationsTotalsByFuelType, loading, error, total };
};

export default useOperationsTotalsByFuelType;
