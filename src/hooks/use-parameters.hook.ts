import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

const GET_PARAMETERS_QUERY = gql`
  query getParameters {
    gracePeriod
    exchangeGracePeriod
    purchaseMaxLitres
    withdrawalMaxAmount
    withdrawalAmountMultiple
    paymentInStoreLimit
    contactHelpEmails
    walletLitresLimit
    accountLitresLimit
  }
`;

const useParameters = () => {
  const { data, loading, error, refetch } = useQuery<{
    gracePeriod: number;
    exchangeGracePeriod: number;
    purchaseMaxLitres: number;
    withdrawalMaxAmount: number;
    withdrawalAmountMultiple: number;
    paymentInStoreLimit: number;
    walletLitresLimit: number;
    accountLitresLimit: number;
    contactHelpEmails: string;
  }>(GET_PARAMETERS_QUERY);

  const gracePeriod = data?.gracePeriod;
  const exchangeGracePeriod = data?.exchangeGracePeriod;
  const purchaseMaxLitres = data?.purchaseMaxLitres;
  const withdrawalMaxAmount = data?.withdrawalMaxAmount;
  const withdrawalAmountMultiple = data?.withdrawalAmountMultiple;
  const paymentInStoreLimit = data?.paymentInStoreLimit;
  const contactHelpEmails = data?.contactHelpEmails;
  const walletLitresLimit = data?.walletLitresLimit;
  const accountLitresLimit = data?.accountLitresLimit;
  return {
    gracePeriod,
    exchangeGracePeriod,
    purchaseMaxLitres,
    withdrawalMaxAmount,
    withdrawalAmountMultiple,
    paymentInStoreLimit,
    contactHelpEmails,
    walletLitresLimit,
    accountLitresLimit,
    loading,
    refetch,
    error,
  };
};

export default useParameters;
