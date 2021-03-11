import { IUserModel } from "./../interfaces/models/user.model";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useEffect } from "react";
import { message } from "antd";
import useUsers from "./use-users.hook";

const CREATE_USER_MUTATION = gql`
    mutation createUser(
        $username: String!
        $password: String!
        $role: UserRoles!
        $name: String!
        $gasStationId: ID
    ) {
        userCreate(
            data: {
                username: $username
                password: $password
                gasStationId: $gasStationId
                role: $role
                name: $name
            }
        ) {
            id
        }
    }
`;

const useCreateUserMutation = () => {
    const { refetch } = useUsers();
    const [execute, { loading, data, error }] = useMutation<{
        userCreate: { id: number };
    }>(CREATE_USER_MUTATION);
    const create = (data: Partial<IUserModel>) => {
        execute({
            variables: {
                ...data
            }
        });
    };
    useEffect(() => {
        if (data?.userCreate.id) {
            message.success("El usuario fue creado con éxito");
            refetch();
        }
    }, [data?.userCreate.id]);

    return { create };
};

const useUserMutations = () => {
    const { create } = useCreateUserMutation();
    return { create };
};

export default useUserMutations;
