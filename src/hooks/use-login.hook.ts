import { useMutation } from "@apollo/react-hooks";
import { IUserModel } from "./../interfaces/models/user.model";
import { gql } from "apollo-boost";
import {
  SecurityContext,
  SECURITY_ACTIONS,
} from "./../contexts/security.context";
import { useContext, useEffect } from "react";

interface ILoginMutationResult {
  token: string;
  user: IUserModel & {
    seller?: {
      gasStation: {
        id: string;
        name: string;
      };
      name: string;
    };
  };
}

const SIGN_IN_QUERY = gql`
  mutation SignIn($username: String!, $password: String!) {
    login(credentials: { username: $username, password: $password }) {
      token
      user {
        id
        username
        roles {
          id
          name
        }
        seller {
          id
          gasStation {
            id
            name
          }
          name
        }
        gasStationAdministrator {
          id
          gasStation {
            id
            name
          }
        }
      }
    }
  }
`;

const useLogin = () => {
  const [signIn, { loading, data, error }] = useMutation<{
    login: ILoginMutationResult;
  }>(SIGN_IN_QUERY, { errorPolicy: "all" });
  const [state, dispatch] = useContext(SecurityContext);
  const doLogin = (username: string, password: string) => {
    signIn({
      variables: {
        username,
        password,
      },
    });
  };
  const doLogout = () => {
    dispatch({
      type: SECURITY_ACTIONS.CLEAR_AUTHENTICATION,
    });
  };
  const isAuthenticated = state.token != "";
  useEffect(() => {
    if (data) {
      dispatch({
        type: SECURITY_ACTIONS.SET_AUTHENTICATION,
        payload: {
          token: data.login.token,
          user: {
            username: data.login.user.username,
            //email: data.login.user.customer.email,
            roles: data.login.user.roles,
            seller: data.login.user.seller,
            gasStationAdministrator: data.login.user.gasStationAdministrator,
          },
        },
      });
    }
  }, [data]);

  const token = state.token;
  const user = state.user;

  return { isAuthenticated, doLogin, doLogout, error };
};

export default useLogin;
