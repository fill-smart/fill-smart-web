import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import useParameters from "./use-parameters.hook";
import { useEffect } from "react";
import { message } from "antd";

const SET_GRACE_PERIOD_MUTATION = gql`
  mutation changeGracePeriod($value: Int!) {
    updateGracePeriod(data: { value: $value }) {
      success
    }
  }
`;

const SET_EXCHANGE_GRACE_PERIOD_MUTATION = gql`
  mutation changeExchangeGracePeriod($value: Int!) {
    updateExchangeGracePeriod(data: { value: $value }) {
      success
    }
  }
`;

const SET_PURCHASE_MAX_LITRES_MUTATION = gql`
  mutation changePurchaseMaxLitres($value: Int!) {
    updatePurchaseMaxLitres(data: { value: $value }) {
      success
    }
  }
`;

const SET_WITHDRAWAL_MAX_AMOUNT_MUTATION = gql`
  mutation changeWithdrawalMaxAmount($value: Int!) {
    updateWithdrawalMaxAmount(data: { value: $value }) {
      success
    }
  }
`;

const SET_WITHDRAWAL_AMOUNT_MULTIPLE_MUTATION = gql`
  mutation changeWithdrawalAmountMultiple($value: Int!) {
    updateWithdrawalAmountMultiple(data: { value: $value }) {
      success
    }
  }
`;

const SET_PAYMENT_IN_STORE_LIMIT_MUTATION = gql`
  mutation changePaymentInStoreLimit($value: Int!) {
    updatePaymentInStoreLimit(data: { value: $value }) {
      success
    }
  }
`;

const SET_CONTACT_HELP_EMAILS_MUTATION = gql`
  mutation changeContactHelpEmails($value: String!) {
    updateContactHelpEmails(data: { value: $value }) {
      success
    }
  }
`;

const SET_WALLET_MAX_LITRES_MUTATION = gql`
  mutation changeWalletMaxLitres($value: Int!) {
    updateWalletLitresLimit(data: { value: $value }) {
      success
    }
  }
`;

const SET_ACCOUNT_MAX_LITRES_MUTATION = gql`
  mutation changeAccountMaxLitres($value: Int!) {
    updateWalletLitresLimit(data: { value: $value }) {
      success
    }
  }
`;

const useParametersMutations = () => {
  const { refetch } = useParameters();
  const [execute, result] = useMutation<{
    updateGracePeriod: { success: boolean };
  }>(SET_GRACE_PERIOD_MUTATION);
  const editGracePeriod = (value: number) => {
    execute({
      variables: {
        value,
      },
    });
  };
  useEffect(() => {
    if (result.data?.updateGracePeriod.success) {
      message.success("El periodo de carencia fue modificado con Exito");
      refetch();
    }
  }, [result.data?.updateGracePeriod.success]);

  const [executeExchange, resultExchange] = useMutation<{
    updateExchangeGracePeriod: { success: boolean };
  }>(SET_EXCHANGE_GRACE_PERIOD_MUTATION);
  const editExchangeGracePeriod = (value: number) => {
    executeExchange({
      variables: {
        value,
      },
    });
  };
  useEffect(() => {
    if (resultExchange.data?.updateExchangeGracePeriod.success) {
      message.success(
        "El periodo de carencia de transferencias fue modificado con Exito"
      );
      refetch();
    }
  }, [resultExchange.data?.updateExchangeGracePeriod.success]);

  const [executePurchase, resultPurchase] = useMutation<{
    updatePurchaseMaxLitres: { success: boolean };
  }>(SET_PURCHASE_MAX_LITRES_MUTATION);
  const editPurchaseMaxLitres = (value: number) => {
    executePurchase({
      variables: {
        value,
      },
    });
  };
  useEffect(() => {
    if (resultPurchase.data?.updatePurchaseMaxLitres.success) {
      message.success(
        "El límite de litros permitidos en Compra de combustible fue modificado con éxito"
      );
      refetch();
    }
  }, [resultPurchase.data?.updatePurchaseMaxLitres.success]);

  const [executeWithdrawalMax, resultWithdrawalMax] = useMutation<{
    updateWithdrawalMaxAmount: { success: boolean };
  }>(SET_WITHDRAWAL_MAX_AMOUNT_MUTATION);
  const editWithdrawalMaxAmount = (value: number) => {
    executeWithdrawalMax({
      variables: {
        value,
      },
    });
  };
  useEffect(() => {
    if (resultWithdrawalMax.data?.updateWithdrawalMaxAmount.success) {
      message.success(
        "El límite de efectivo permitido para retirar fue modificado con éxito"
      );
      refetch();
    }
  }, [resultWithdrawalMax.data?.updateWithdrawalMaxAmount.success]);

  const [executeWithdrawalMultiple, resultWithdrawalMultiple] = useMutation<{
    updateWithdrawalAmountMultiple: { success: boolean };
  }>(SET_WITHDRAWAL_AMOUNT_MULTIPLE_MUTATION);
  const editWithdrawalAmountMultiple = (value: number) => {
    executeWithdrawalMultiple({
      variables: {
        value,
      },
    });
  };
  useEffect(() => {
    if (resultWithdrawalMultiple.data?.updateWithdrawalAmountMultiple.success) {
      message.success(
        "El valor de la unidad mínima permitida para retirar fue modificado con éxito"
      );
      refetch();
    }
  }, [resultWithdrawalMultiple.data?.updateWithdrawalAmountMultiple.success]);

  const [executePayment, resultPayment] = useMutation<{
    updatePaymentInStoreLimit: { success: boolean };
  }>(SET_PAYMENT_IN_STORE_LIMIT_MUTATION);
  const editPaymentInStoreLimit = (value: number) => {
    executePayment({
      variables: {
        value,
      },
    });
  };
  useEffect(() => {
    if (resultPayment.data?.updatePaymentInStoreLimit.success) {
      message.success(
        "El límite de litros permitidos en Pago en Shop fue modificado con éxito"
      );
      refetch();
    }
  }, [resultPayment.data?.updatePaymentInStoreLimit.success]);

  const [executeEmails, resultEmails] = useMutation<{
    updateContactHelpEmails: { success: boolean };
  }>(SET_CONTACT_HELP_EMAILS_MUTATION);
  const editContactHelpEmails = (value: string) => {
    executeEmails({
      variables: {
        value,
      },
    });
  };
  useEffect(() => {
    if (resultEmails.data?.updateContactHelpEmails.success) {
      message.success("Los emails de contacto fueron modificados con éxito");
      refetch();
    }
  }, [resultEmails.data?.updateContactHelpEmails.success]);

  const [executeAccountLitresLimit, resultAccountLitresLimit] = useMutation<{
    updateAccountLitresLimit: { success: boolean };
  }>(SET_ACCOUNT_MAX_LITRES_MUTATION);
  const editAccountLitresLimit = (value: number) => {
    executeAccountLitresLimit({
      variables: {
        value,
      },
    });
  };
  useEffect(() => {
    if (resultAccountLitresLimit.data?.updateAccountLitresLimit.success) {
      message.success(
        "El maximo de litros por billetera fue modificado con éxito"
      );
      refetch();
    }
  }, [resultAccountLitresLimit.data?.updateAccountLitresLimit.success]);

  const [executeWalletLitresLimit, resultWalletLitresLimit] = useMutation<{
    updateWalletLitresLimit: { success: boolean };
  }>(SET_WALLET_MAX_LITRES_MUTATION);
  const editWalletLitresLimit = (value: number) => {
    executeWalletLitresLimit({
      variables: {
        value,
      },
    });
  };
  useEffect(() => {
    if (resultWalletLitresLimit.data?.updateWalletLitresLimit.success) {
      message.success(
        "El maximo de litros por billetera fue modificado con éxito"
      );
      refetch();
    }
  }, [resultWalletLitresLimit.data?.updateWalletLitresLimit.success]);

  return {
    editGracePeriod,
    editExchangeGracePeriod,
    editPurchaseMaxLitres,
    editWithdrawalMaxAmount,
    editWithdrawalAmountMultiple,
    editPaymentInStoreLimit,
    editContactHelpEmails,
    editAccountLitresLimit,
    editWalletLitresLimit,
  };
};

export default useParametersMutations;
