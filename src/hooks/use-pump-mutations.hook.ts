import { PumpHooks } from "./pumps.hooks";
import { IPumpModel } from "./../interfaces/models/pump.model";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useEffect } from "react";
import { message } from "antd";
import usePumps from "./use-pumps.hook";
import { useParams } from "react-router";

const EDIT_PUMP_MUTATION = gql`
    mutation pumpEdit($id: ID!, $externalId: String, $gasStationId: ID!) {
        pumpEdit(
            data: {
                id: $id
                externalId: $externalId
                gasStationId: $gasStationId
            }
        ) {
            id
        }
    }
`;

const CREATE_PUMP_MUTATION = gql`
    mutation pumpCreate($externalId: String, $gasStationId: ID!) {
        pumpCreate(
            data: { externalId: $externalId, gasStationId: $gasStationId }
        ) {
            id
        }
    }
`;

const useEditPumpMutation = () => {
    const { gasStationId } = useParams();
    const { refetch } = PumpHooks.getByGasStation(Number(gasStationId));
    const [execute, { loading, data, error }] = useMutation<{
        pumpEdit: { id: number };
    }>(EDIT_PUMP_MUTATION);
    const editPump = (id: number, data: Partial<IPumpModel>) => {
        execute({
            variables: {
                id,
                ...data,
                gasStationId
            }
        });
    };
    useEffect(() => {
        if (data?.pumpEdit.id) {
            message.success("El surtidor fue modificada con éxito");
            refetch();
        }
    }, [data?.pumpEdit.id]);

    return { editPump };
};

const useCreatePumpMutation = () => {
    const { gasStationId } = useParams();
    const { refetch } = PumpHooks.getByGasStation(Number(gasStationId));
    const [execute, { loading, data, error }] = useMutation<{
        pumpCreate: { id: number };
    }>(CREATE_PUMP_MUTATION);
    const createPump = (data: Partial<IPumpModel>) => {
        execute({
            variables: {
                ...data,
                gasStationId
            }
        });
    };
    useEffect(() => {
        if (data?.pumpCreate.id) {
            message.success("El surtidor fue creado con éxito");
            refetch();
        }
    }, [data?.pumpCreate.id]);

    return { createPump };
};

const usePumpMutations = () => {
    const { createPump } = useCreatePumpMutation();
    const { editPump } = useEditPumpMutation();
    return { createPump, editPump };
};

export default usePumpMutations;
