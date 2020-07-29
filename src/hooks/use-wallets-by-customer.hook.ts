import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

interface IWalletResult {
  wallets: {
    result: {
      id: string;
      fuelType: {
        name: string;
      };
      litres: number;
      availableLitres: number;
    }[];
  };
}

const LIST_WALLETS_BY_CUSTOMER = gql`
  query listWalletsByCustomer($criteria: String!) {
    wallets(criteria: { filter: $criteria }) {
      result {
        id
        fuelType {
          id
          name
        }
        litres
        availableLitres
      }
    }
  }
`;

const useWalletsByCustomer = (customerId: number) => {
  const { data, loading, error } = useQuery<IWalletResult>(
    LIST_WALLETS_BY_CUSTOMER,
    {
      variables: {
        criteria: JSON.stringify({
          value: customerId,
          property: "customer.id",
          type: "eq",
        }),
      },
    }
  );

  const wallets = data?.wallets.result;
  return { wallets, loading, error };
};

export default useWalletsByCustomer;
