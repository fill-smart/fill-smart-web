import { ICashDepositModel } from "./../interfaces/models/cash-deposit.model";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useEffect } from "react";
import useCashDeposits from "./use-cash-deposits.hook";
import { message } from "antd";

const CREATE_CASH_DEPOSIT_MUTATION = gql`
  mutation cashDepositCreate(
    $amount: Float!
    $stamp: DateTime!
    $receipt: String!
  ) {
    cashDepositCreate(
      data: { amount: $amount, stamp: $stamp, receipt: $receipt }
    ) {
      id
    }
  }
`;

const useCreateCashDepositMutation = () => {
  const { refetch } = useCashDeposits();
  const [execute, { loading, data, error }] = useMutation<{
    cashDepositCreate: { id: number };
  }>(CREATE_CASH_DEPOSIT_MUTATION);
  const create = (data: Partial<ICashDepositModel>) => {
    console.log("data: ", data);
    execute({
      variables: {
        ...data
      }
    });
  };
  useEffect(() => {
    console.log("cash deposit create data:", data);
    if (data?.cashDepositCreate.id) {
      message.success("El deposito en efectivo fue registrado con éxito");
      refetch();
    }
  }, [data?.cashDepositCreate?.id]);

  return { create };
};

const useCashDepositMutations = () => {
  const { create } = useCreateCashDepositMutation();

  return { create };
};

export default useCashDepositMutations;
