import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useContext, useEffect } from "react";
import { ICustomerModel } from "../interfaces/models/customer.model";
import useCustomers from "./use-customers.hook";
import useGasStations from "./use-gas-stations.hook";
import { message } from "antd";

const EDIT_GAS_STATION_MUTATION = gql`
    mutation editGasStation($id: ID!, $name: String, $address: String, $purchaseRequireAuthorization:Boolean) {
        gasStationEdit(data: { id: $id, name: $name, address: $address, purchaseRequireAuthorization: $purchaseRequireAuthorization }) {
            id
        }
    }
`;

const CREATE_GAS_STATION_MUTATION = gql`
    mutation gasStationCreate($name: String!, $address: String!, $purchaseRequireAuthorization:Boolean) {
        gasStationCreate(data: { name: $name, address: $address, purchaseRequireAuthorization:$purchaseRequireAuthorization }) {
            id
        }
    }
`;

const useEditGasStationMutation = () => {
    const { refetch } = useGasStations();
    const [execute, { loading, data, error }] = useMutation<{
        gasStationEdit: { id: number };
    }>(EDIT_GAS_STATION_MUTATION);
    const editGasStation = (id: number, data: Partial<ICustomerModel>) => {
        execute({
            variables: {
                id,
                ...data
            }
        });
    };
    useEffect(() => {
        if (data?.gasStationEdit.id) {
            message.success("La estacion de servicio fue modificada con éxito");
            refetch();
        }
    }, [data?.gasStationEdit.id]);

    return { editGasStation };
};

const useCreateGasStationMutation = () => {
    const { refetch } = useGasStations();
    const [execute, { loading, data, error }] = useMutation<{
        gasStationCreate: { id: number };
    }>(CREATE_GAS_STATION_MUTATION);
    const createGasStation = (data: Partial<ICustomerModel>) => {
        execute({
            variables: {
                ...data
            }
        });
    };
    useEffect(() => {
        if (data?.gasStationCreate.id) {
            message.success("La estacion de servicio fue creada con éxito");
            refetch();
        }
    }, [data?.gasStationCreate.id]);

    return { createGasStation };
};

const useGasStationMutations = () => {
    const { createGasStation } = useCreateGasStationMutation();
    const { editGasStation } = useEditGasStationMutation();
    return { createGasStation, editGasStation };
};

export default useGasStationMutations;
