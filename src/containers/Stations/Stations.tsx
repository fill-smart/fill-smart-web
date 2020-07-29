import React, { useContext, useState, useEffect } from "react";
import { LayoutContentWrapper } from "../../components/utility/layoutWrapper.style";
import PageHeader from "../../components/utility/pageHeader";
import { Row, Col, Tooltip } from "antd";
import basicStyle from "../../assets/styles/constants";
import { TextCell } from "../../components/Tables/HelperCells";
import { TableViews } from "../Tables/AntTables/AntTables";
import IsoWidgetsWrapper from "../Widgets/WidgetsWrapper";
import IsoWidgetBox from "../Widgets/WidgetBox";
import {
    CenterText,
    ActionWrapper,
    ButtonWrapper,
    ButtonHolders,
    ActionBtn
} from "./Stations.styles";
import Popconfirms from "../../components/Feedback/Popconfirm";
import useGasStations, {
    IGasStationsResult
} from "../../hooks/use-gas-stations.hook";
import Loader from "../../components/utility/loader";
import { Link } from "react-router-dom";
import { PRIVATE_ROUTE } from "../../route.constants";
import { IGasStationModel } from "../../interfaces/models/gas-station.model";
import { StationEdit } from "./StationsEdit";
import moment from "moment";
import { QueryCriteria, FilteredTable } from "../../core/FilteredTable";
import { FilterTypesEnum, IAndFilterCriteria } from "../../core/filters";
import { createTextFilter, DateFilter } from "../../components/Tables/Filters";

const { rowStyle, colStyle } = basicStyle;

const Stations = () => {
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
    const { gasStations, loading, total } = useGasStations(tableCriteria);

    const columns = [
        {
            title: "Nombre",
            key: "name",
            width: "35%",
            render: o => TextCell(o?.name),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true
        },
        {
            title: "Dirección",
            key: "address",
            width: "40%",
            render: o => TextCell(o?.address),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true
        },
        {
            title: "Fecha Creación",
            key: "created",
            width: "10%",
            render: o => TextCell(moment(o?.created).format("DD/MM/YYYY")),
            filterDropdown: DateFilter,
            sorter: true
        },
        {
            title: "Total Mangueras",
            key: "pumpCount",
            width: "10%",
            render: o => {
                return <CenterText>{TextCell(o?.pumpsCount)}</CenterText>;
            }
        },
        {
            title: "",
            key: "action",
            width: "5%",
            className: "noWrapCell",
            render: o => {
                return (
                    <ActionWrapper>
                        <Tooltip title="Lista de Surtidores">
                            <Link
                                to={`/fillsmart/${PRIVATE_ROUTE.PUMPS.replace(
                                    ":gasStationId",
                                    o.id
                                )}`}
                            >
                                <i
                                    className="ion-pull-request"
                                    style={{ color: "#15b06e" }}
                                />
                            </Link>
                        </Tooltip>
                        <Tooltip title="Lista de Tanques">
                            <Link
                                to={`/fillsmart/${PRIVATE_ROUTE.TANKS.replace(
                                    ":gasStationId",
                                    o.id
                                )}`}
                            >
                                <i
                                    className="ion-battery-low"
                                    style={{ color: "#ffca28" }}
                                />
                            </Link>
                        </Tooltip>
                        <Tooltip title="Precios de Combustibles">
                            <Link
                                to={`/fillsmart/${PRIVATE_ROUTE.FUEL_PRICES}`}
                            >
                                <i
                                    className="ion-cash"
                                    style={{ color: "#8f5c53" }}
                                />
                            </Link>
                        </Tooltip>
                        <Tooltip title="Editar">
                            <a onClick={() => editStation(o)} href="#">
                                <i className="ion-android-create" />
                            </a>
                        </Tooltip>
                        {/*<Tooltip title="Eliminar">
                            <Popconfirms
                                title="Esta seguro que desea eliminar esta estación de servicio？"
                                okText="Si"
                                cancelText="No"
                                placement="topRight"
                                onConfirm={() => handleRecord("delete", o)}
                            >
                                <a className="deleteBtn" href="# ">
                                    <i className="ion-android-delete" />
                                </a>
                            </Popconfirms>
                                </Tooltip>*/}
                    </ActionWrapper>
                );
            }
        }
    ];
    const [modalOpened, setModalOpened] = useState(false);
    const [editingStation, setEditingStation] = useState<
        Partial<IGasStationModel> | undefined
    >();



    const editStation = (o: Partial<IGasStationModel>) => {
        setEditingStation(o);
        setModalOpened(true);
    };
    const createStation = () => {
        setEditingStation(undefined);
        setModalOpened(true);
    };

    return (
        <LayoutContentWrapper>
            <PageHeader>{"Estaciones de servicio"}</PageHeader>

            <Row style={rowStyle} gutter={0} justify="start">
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <IsoWidgetsWrapper>
                        <IsoWidgetBox>
                            <ButtonWrapper>
                                <div></div>
                                <ButtonHolders>
                                    <ActionBtn
                                        type="primary"
                                        onClick={() => createStation()}
                                    >
                                        Nueva Estación de servicio
                                    </ActionBtn>
                                </ButtonHolders>
                            </ButtonWrapper>

                            <FilteredTable
                                columns={columns}
                                dataSource={gasStations}
                                loading={loading}
                                pagination={{ ...tableCriteria.pagination, ...{ total } }}
                                otherFilters={otherFilters}
                                onCriteriaChange={setTableCriteria}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>
            <StationEdit
                editing={editingStation}
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onFinished={() => setModalOpened(false)}
            />
        </LayoutContentWrapper>
    );
};

export default Stations;
