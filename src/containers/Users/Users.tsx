import React, { useState } from "react";
import { LayoutContentWrapper } from "../../components/utility/layoutWrapper.style";
import PageHeader from "../../components/utility/pageHeader";
import { Row, Col, Tooltip } from "antd";
import basicStyle from "../../assets/styles/constants";
import { TextCell } from "../../components/Tables/HelperCells";
import { TableViews } from "../Tables/AntTables/AntTables";
import IsoWidgetsWrapper from "../Widgets/WidgetsWrapper";
import IsoWidgetBox from "../Widgets/WidgetBox";
import {
    ActionWrapper,
    ButtonWrapper,
    ButtonHolders,
    ActionBtn
} from "./Users.styles";
import LoaderComponent from "../../components/utility/loader.style";
import useUsers, { UserRecord } from "../../hooks/use-users.hook";
import { UsersEdit } from "./UsersEdit";
import { IUserModel } from "../../interfaces/models/user.model";
import { createTextFilter, createSelectFilter } from "../../components/Tables/Filters";
import { FilterTypesEnum, IAndFilterCriteria } from "../../core/filters";
import { QueryCriteria, FilteredTable } from "../../core/FilteredTable";
import { RolesEnum } from "../../contexts/security.context";

const { rowStyle, colStyle } = basicStyle;

const Users = () => {
    /*Criteria*/
    const [tableCriteria, setTableCriteria] = useState<QueryCriteria>({
        pagination: {
            current: 1,
            pageSize: 10
        },
        sort: [],
        filter: undefined
    })
    const [otherFiltersRaw, setOtherFiltersRaw] = useState<any>();
    const [otherFilters, setOtherFilters] = useState<IAndFilterCriteria | undefined>()
    /*End Criteria*/
    console.log(tableCriteria.filter)
    const usersHook = useUsers(tableCriteria);
    const userColumns = [
        {
            title: "Nombre de Usuario",
            key: "username",
            render: (o: UserRecord) => TextCell(o.username),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true
        },
        {
            title: "Rol",
            key: "roles.name",
            render: (o: UserRecord) =>
                TextCell(o.roles.map(r => r.name).join(" - ")),
            filterDropdown: createSelectFilter([
                {
                    value: RolesEnum.Admin,
                    label: "Administrador"
                },
                {
                    value: RolesEnum.GasStationAdmin,
                    label: "Adm. Estacion de Serv."
                },
                {
                    value: RolesEnum.CoverageOperator,
                    label: "Operador de Cobertura."
                },
                {
                    value: RolesEnum.Seller,
                    label: "Vendedor"
                }
            ]),
            sorter: true

        },
        {
            title: "Estacion de Servicio",
            key: "gasStation.name",
            render: (o: UserRecord) =>
                TextCell(
                    o.gasStationAdministrator?.gasStation.name ||
                    o.seller?.gasStation.name ||
                    "-"
                ),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true
        } /*,

        {
            title: "",
            key: "action",
            width: "5%",
            className: "noWrapCell",
            render: o => {
                return (
                    <ActionWrapper>
                        <Tooltip title="Editar">
                            <a onClick={() => edit(o)} href="#">
                                <i className="ion-android-create" />
                            </a>
                        </Tooltip>
                    </ActionWrapper>
                );
            }
        }*/
    ];

    const [modalOpened, setModalOpened] = useState(false);



    const edit = (o: Partial<IUserModel>) => { };
    const create = () => {
        setModalOpened(true);
    };

    return (
        <LayoutContentWrapper>
            <PageHeader>{"Usuarios"}</PageHeader>

            <Row style={rowStyle} gutter={0} justify="start">
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <IsoWidgetsWrapper>
                        <IsoWidgetBox>
                            <ButtonWrapper>
                                <div></div>
                                <ButtonHolders>
                                    <ActionBtn
                                        type="primary"
                                        onClick={() => create()}
                                    >
                                        Nuevo Usuario
                                    </ActionBtn>
                                </ButtonHolders>
                            </ButtonWrapper>

                            {/* TABLE */}
                            <FilteredTable
                                columns={userColumns}
                                dataSource={usersHook.users}
                                loading={usersHook.loading}
                                pagination={{ ...tableCriteria.pagination, ...{ total: usersHook.total } }}
                                otherFilters={otherFilters}
                                onCriteriaChange={setTableCriteria}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>
            <UsersEdit
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onFinished={() => setModalOpened(false)}
            />
        </LayoutContentWrapper>
    );
};

export default Users;
