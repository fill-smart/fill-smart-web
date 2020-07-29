import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

export interface IWalletResult {
  wallets: {
    result: {
      fuelType: {
        name: string;
        id: number;
        currentPrice: {
          price: number;
        };
      };
      id: number;
      litres: number;
    }[];
  };
}

const LIST_WALLETS_QUERY = gql`
  query listWallets($dueDate: DateTime) {
    wallets {
      result {
        fuelType {
          id
          name
          currentPrice {
            id
            price
          }
        }
        id
        litres
        availableLitres(dueDate: $dueDate)
      }
    }
  }
`;

const useWallets = (dueDate?: Date) => {
  const { data, loading, error } = useQuery<IWalletResult>(LIST_WALLETS_QUERY, {
    variables: {
      dueDate: dueDate,
    },
  });

  if (error) {
    throw error;
  }
  const wallets = data?.wallets.result;
  return { wallets, loading };
};

export default useWallets;
