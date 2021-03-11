import React, { createContext, useReducer, Reducer } from "react";
import { IUserModel } from "../interfaces/models/user.model";

export interface ISecurityContext {
    token: string;
    user: Omit<IUserModel, "id" | "updated" | "created" | "deleted"> | null;
}

export enum SECURITY_ACTIONS {
    SET_AUTHENTICATION = "[Set Authentication]",
    CLEAR_AUTHENTICATION = "[Clear Authentication]"
}

export enum RolesEnum {
    Admin = "ADMINISTRATOR",
    Customer = "CUSTOMER",
    Seller = "SELLER",
    GasStationAdmin = "GAS_STATION_ADMINISTRATOR",
    CoverageOperator = "COVERAGE_OPERATOR"
}

export interface IAction {
    type: SECURITY_ACTIONS;
}

export interface ISetAuthenticationAction extends IAction {
    payload: {
        token: string;
        user: Omit<IUserModel, "id" | "updated" | "created" | "deleted">;
    };
}

export interface IClearAuthenticationAction extends IAction { }

export type ISecurityActions =
    | ISetAuthenticationAction
    | IClearAuthenticationAction;

export const defaultSecurityContextValue: ISecurityContext = {
    token: localStorage.getItem("jwt-token") ?? "",
    user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null
};

export const SecurityContext = createContext<
    [ISecurityContext, React.Dispatch<ISecurityActions>]
>((null as unknown) as [ISecurityContext, React.Dispatch<ISecurityActions>]);

export const SecurityContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer<
        Reducer<ISecurityContext, ISecurityActions>
    >((state, action) => {
        switch (action.type) {
            case SECURITY_ACTIONS.SET_AUTHENTICATION:
                const load = (action as ISetAuthenticationAction).payload;
                localStorage.setItem("jwt-token", load.token);
                localStorage.setItem("user", JSON.stringify(load.user));
                return {
                    ...state,
                    ...(action as ISetAuthenticationAction).payload
                };
            case SECURITY_ACTIONS.CLEAR_AUTHENTICATION:
                localStorage.removeItem("jwt-token");
                localStorage.removeItem("user");
                window.location.reload();
                return defaultSecurityContextValue;
            default:
                return state;
        }
    }, defaultSecurityContextValue);

    return (
        <SecurityContext.Provider value={[state, dispatch]}>
            {children}
        </SecurityContext.Provider>
    );
};
