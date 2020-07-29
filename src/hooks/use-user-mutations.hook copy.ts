import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useEffect } from "react";
import { message } from "antd";

const CHANGE_PASSWORD_MUTATION = gql`
  mutation changePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(
      data: { currentPassword: $currentPassword, newPassword: $newPassword }
    ) {
      success
    }
  }
`;

const useChangePasswordMutation = () => {
  const [execute, { loading, data, error }] = useMutation<{
    changePassword: { success: boolean };
  }>(CHANGE_PASSWORD_MUTATION);
  const changePassword = (data: {
    newPassword: string;
    currentPassword: string;
  }) => {
    execute({
      variables: {
        ...data
      }
    });
  };
  useEffect(() => {
    if (data?.changePassword.success) {
      message.success("La contraseña fue modificada con exito");
    }
  }, [data?.changePassword.success]);

  useEffect(() => {
    if (error) {
      message.error("La contraseña actual es incorrecta");
    }
  }, [error]);

  return { changePassword };
};

export default useChangePasswordMutation;
