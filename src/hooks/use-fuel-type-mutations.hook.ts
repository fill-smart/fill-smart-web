import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useEffect } from "react";
import { message } from "antd";
import useFuelTypes from "./use-fuel-types.hook";
import { IFuelTypeModel } from "../interfaces/models/fuel-type.model";

const EDIT_FUEL_TYPE_MUTATION = gql`
    mutation editFuelType(
        $id: ID
        $name: String!
    ) {
        fuelTypeEdit(
            data: {
                id: $id
                name: $name
            }
        ) {
            id
        }
    }
`;

const useEditFuelTypeMutation = () => {
    const { refetch } = useFuelTypes();
    const [execute, { loading, data, error }] = useMutation<{
        fuelTypeEdit: { id: number };
    }>(EDIT_FUEL_TYPE_MUTATION);
    const editFuelType = (id: number, data: Partial<IFuelTypeModel>) => {
        execute({
            variables: {
                id,
                ...data
            }
        });
    };
    useEffect(() => {
        if (data?.fuelTypeEdit.id) {
            message.success("El combustible fue modificado con éxito");
            refetch();
        }
    }, [data?.fuelTypeEdit.id]);

    return { editFuelType };
};

const useFuelTypeMutations = () => {
    const { editFuelType } = useEditFuelTypeMutation();
    return { editFuelType };
};

export default useFuelTypeMutations;
