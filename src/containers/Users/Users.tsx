import React, { useState, useEffect } from "react";
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
import useUsers, { UserRecord, useUsersLazy } from "../../hooks/use-users.hook";
import { UsersEdit } from "./UsersEdit";
import { IUserModel } from "../../interfaces/models/user.model";
import { createTextFilter, createSelectFilter } from "../../components/Tables/Filters";
import { FilterTypesEnum, IAndFilterCriteria } from "../../core/filters";
import { QueryCriteria, FilteredTable } from "../../core/FilteredTable";
import { RolesEnum } from "../../contexts/security.context";
import Excel from "exceljs";
import FileSaver from "file-saver";
import { execute } from "apollo-boost";
import moment from "moment";


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
    const {pagination, ...tableCriteriaWithoutPagination} = tableCriteria;
    const [generateExcelClicked, setGenerateExcelClicked] = useState<boolean>(false);
    const [otherFiltersRaw, setOtherFiltersRaw] = useState<any>();
    const [otherFilters, setOtherFilters] = useState<IAndFilterCriteria | undefined>()
    /*End Criteria*/
    const usersHook = useUsers(tableCriteria);
    const allUsersHook = useUsersLazy(tableCriteriaWithoutPagination);

    const onGenerateExcelClicked = () => {
        setGenerateExcelClicked(true);
        if (allUsersHook.users){
            generateExcel()
        }
        else {
            allUsersHook.execute();
        }
    }

    useEffect(() => {
        if (allUsersHook.users && generateExcelClicked) {
            generateExcel();
        }
    }, [allUsersHook.users]);

    
    const generateExcel = async () => {    
        setGenerateExcelClicked(false);
        const workbook = new Excel.Workbook();
        const sheet = workbook.addWorksheet('Usuarios');
        
        sheet.columns = [
            { header: 'Nombre de Usuario', key: 'username' },
            { header: 'Rol', key: 'roles.name' },
            { header: 'Estacion de Servicio', key: 'gasStation.name' }
        ];

        sheet.addRows(allUsersHook.users!.map(x => [x.username, x.roles.map(r => r.name).join(" - "), x.gasStationAdministrator?.gasStation.name || x.seller?.gasStation.name || "-"]));

        sheet.columns.forEach(function(column){
            var dataMax = 0;
            column.eachCell!(function(cell){
                if (cell.value) {
                    var columnLength = cell.value.toString().length;		
                    if (columnLength > dataMax) {
                        dataMax = columnLength;
                    }
                }
            })
            column.width = dataMax + 5;
        });

        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        await workbook.xlsx.writeBuffer().then(data => {
            const blob = new Blob([data], { type: fileType }); 
            FileSaver.saveAs(blob, "fillsmart_usuarios_" + moment().format("DD-MM-YYYY") + ".xlsx");
            });;
    };

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
        }
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
                                        onClick={onGenerateExcelClicked}
                                        loading={generateExcelClicked}
                                    >
                                        Descargar planilla
                                    </ActionBtn>
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
