import React, { useState, useContext } from "react";
import { LayoutContentWrapper } from "../../components/utility/layoutWrapper.style";
import PageHeader from "../../components/utility/pageHeader";
import { Row, Col, Tooltip } from "antd";
import basicStyle from "../../assets/styles/constants";
import { TextCell } from "../../components/Tables/HelperCells";
import { TableViews } from "../Tables/AntTables/AntTables";
import IsoWidgetsWrapper from "../Widgets/WidgetsWrapper";
import IsoWidgetBox from "../Widgets/WidgetBox";

import { DateUtils } from "@silentium-apps/fill-smart-common";
import loader from "../../components/utility/loader";
import LoaderComponent from "../../components/utility/loader.style";
import { ActionWrapper, ButtonWrapper } from "../Stations/Stations.styles";
import useParameters from "../../hooks/use-parameters.hook";
import moment from "moment";
import { IOperationModel } from "../../interfaces/models/operation.model";
import useOperations from "../../hooks/use-operations.hook";
import { IAndFilterCriteria, FilterTypesEnum } from "../../core/filters";
import { QueryCriteria, FilteredTable } from "../../core/FilteredTable";
import { createTextFilter, DateFilter, NumberFilter } from "../../components/Tables/Filters";
import { useParams, useHistory } from "react-router-dom";
import useOperationsByCustomers from "../../hooks/use-operations-by-customer.hook";
import BackButton from "../../components/uielements/BackButton";

const { rowStyle, colStyle } = basicStyle;




const CustomerMovements = () => {
    const { documentNumber } = useParams();

    if (!documentNumber) {
        throw "No customer document number";
    }


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
    const operationsHook = useOperationsByCustomers(Number(documentNumber), tableCriteria);
    const gracePeriodHook = useParameters();

    const history = useHistory();
    const goBack = () => {
        history.goBack();
    };

    const loading = operationsHook.loading || gracePeriodHook.loading;

    const operations = operationsHook.operations;

    const columns = [
        {
            title: "Nº de Transaccion",
            key: "id",
            render: (o: IOperationModel) => TextCell(o.id),
            filterDropdown: createTextFilter(FilterTypesEnum.Equals),
            sorter: true
        },
        {
            title: "Tipo",
            key: "operationTypeName",
            render: (o: IOperationModel) => TextCell(o.operationTypeName),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true
        },
        {
            title: "Fecha y Hora",
            key: "stamp",
            render: (o: IOperationModel) =>
                TextCell(DateUtils.format(o.stamp, "DD/MM/YYYY HH:mm")),
            filterDropdown: DateFilter,
            sorter: true
        },
        {
            title: "Tipo de Combustible",
            key: "fuelTypeName",
            render: (o: IOperationModel) => o.operationTypeName === "Canje de Combustible" ?
                TextCell(`De ${o.exchangeSourceFuelType} a ${o.fuelTypeName}`) : TextCell(o.fuelTypeName),
            filterDropdown: createTextFilter(FilterTypesEnum.Equals),
            sorter: true
        },
        {
            title: "Litros",
            key: "litres",
            align: "right",
            render: (o: IOperationModel) =>
                TextCell(
                    o.litres.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    })
                ),
            filterDropdown: NumberFilter,
            sorter: true
        },
        {
            title: "Precio",
            key: "fuelPrice",
            align: "right",
            render: (o: IOperationModel) =>
                TextCell("$ " +
                    o.fuelPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })
                ),
            filterDropdown: NumberFilter,
            sorter: true
        },
        {
            title: "Estación",
            key: "gasStationName",
            render: (o: IOperationModel) =>
                TextCell(o.gasStationName),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true
        },
        // {
        //     title: "Documento",
        //     key: "customerDocumentNumber",
        //     render: (o: IOperationModel) =>
        //         TextCell(o.customerDocumentNumber),
        //     filterDropdown: createTextFilter(FilterTypesEnum.Like),
        //     sorter: true
        // },
        // {
        //     title: "Nombre",
        //     key: "customerFirstName",
        //     render: (o: IOperationModel) =>
        //         TextCell(o.customerFirstName),
        //     filterDropdown: createTextFilter(FilterTypesEnum.Like),
        //     sorter: true
        // },
        // {
        //     title: "Apellido",
        //     key: "customerLastName",
        //     render: (o: IOperationModel) =>
        //         TextCell(o.customerLastName),
        //     filterDropdown: createTextFilter(FilterTypesEnum.Like),
        //     sorter: true
        // },
        {
            title: "Surtidor",
            key: "pump",
            render: (o: IOperationModel) => TextCell(o.pumpExternalId),
            filterDropdown: createTextFilter(FilterTypesEnum.Equals),
            sorter: true
        },
        {
            title: "Fecha de Carencia",
            key: "grace",
            render: (o: IOperationModel) =>
                TextCell(
                    o.operationTypeName == "Compra de Combustible"
                        ? moment(o.stamp)
                            .add(gracePeriodHook.gracePeriod, "days")
                            .format("DD/MM/YYYY")
                        : "-"
                )
        }
    ];

    const handleModal = (gasStation = null) => { };

    const handleRecord = (actionName, gasStation) => { };



    if (operationsHook.operations && operationsHook.operations.length <= 0) {
        return (
            <LayoutContentWrapper>
                <PageHeader>El cliente no registra operaciones.</PageHeader>
            </LayoutContentWrapper>
        );
    }

    return (
        <LayoutContentWrapper>
            <PageHeader>Operaciones del cliente
                {operationsHook.operations ? ' ' + operationsHook.operations[1].customerFirstName : ''}
                {' '}
                {operationsHook.operations ? operationsHook.operations[1].customerLastName : ''}
                {' '}
                {operationsHook.operations ? ' DNI: ' + operationsHook.operations[1].customerDocumentNumber : ''}
            </PageHeader>

            <Row style={rowStyle} gutter={0} justify="start">
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <IsoWidgetsWrapper>
                        <IsoWidgetBox>
                            <ButtonWrapper>
                                <BackButton
                                    onClick={goBack}
                                />
                            </ButtonWrapper>
                            {/* TABLE */}
                            <FilteredTable
                                columns={columns}
                                dataSource={operationsHook.operations}
                                loading={loading}
                                pagination={{ ...tableCriteria.pagination, ...{ total: operationsHook.total } }}
                                otherFilters={otherFilters}
                                onCriteriaChange={setTableCriteria}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>
        </LayoutContentWrapper>
    );
};

export default CustomerMovements;
