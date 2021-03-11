import React, { useState, useContext, useEffect } from "react";
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
import { ActionWrapper, ButtonWrapper, ButtonHolders, ActionBtn } from "../Stations/Stations.styles";
import useParameters from "../../hooks/use-parameters.hook";
import moment from "moment";
import { IOperationModel } from "../../interfaces/models/operation.model";
import useOperations from "../../hooks/use-operations.hook";
import { IAndFilterCriteria, FilterTypesEnum } from "../../core/filters";
import { QueryCriteria, FilteredTable } from "../../core/FilteredTable";
import { createTextFilter, DateFilter, NumberFilter } from "../../components/Tables/Filters";
import { useParams, useHistory } from "react-router-dom";
import useOperationsByCustomers, { useOperationsByCustomersLazy } from "../../hooks/use-operations-by-customer.hook";
import BackButton from "../../components/uielements/BackButton";
import FileSaver from "file-saver";
import Excel from "exceljs";


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
    const { pagination, ...tableCriteriaWithoutPagination } = tableCriteria;
    const allOperationsHook = useOperationsByCustomersLazy(Number(documentNumber), tableCriteriaWithoutPagination);
    const [generateExcelClicked, setGenerateExcelClicked] = useState<boolean>(false);
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

    const onGenerateExcelClicked = () => {
        setGenerateExcelClicked(true);
        if (allOperationsHook.operations) {
            generateExcel()
        }
        else {
            allOperationsHook.execute();
        }
    }

    useEffect(() => {
        if (allOperationsHook.operations && generateExcelClicked) {
            generateExcel();
        }
    }, [allOperationsHook.operations]);

    const generateExcel = async () => {
        setGenerateExcelClicked(false);
        const workbook = new Excel.Workbook();
        const sheet = workbook.addWorksheet('Operaciones por Cliente');

        sheet.columns = [
            { header: 'Nº de Transaccion', key: 'id' },
            { header: 'Tipo', key: 'operationTypeName' },
            { header: 'Fecha y Hora', key: 'stamp' },
            { header: 'Tipo de Combustible', key: 'fuelTypeName' },
            { header: 'Litros', key: 'litres' },
            { header: 'Precio', key: 'fuelPrice' },
            { header: 'Estación', key: 'gasStationName' },
            { header: 'Surtidor', key: 'pumpExternalId' },
            { header: 'Fecha de Carencia', key: 'grace' },
        ];

        sheet.addRows(allOperationsHook.operations!.map(o => [
            o.id,
            o.operationTypeName,
            DateUtils.format(o.stamp, "DD/MM/YYYY HH:mm"),
            o.fuelTypeName,
            o.litres ? o.litres.toLocaleString("es-ar", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }) : "",
            o.fuelPrice ? "$ " + o.fuelPrice.toLocaleString("es-ar", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) : "",
            o.gasStationName,
            o.pumpExternalId ?? "-",
            o.operationTypeName == "Compra de Combustible"
                ? moment(o.stamp)
                    .add(gracePeriodHook.gracePeriod, "days")
                    .format("DD/MM/YYYY")
                : "-",
        ]));

        sheet.columns.forEach(function (column) {
            var dataMax = 0;
            column.eachCell!(function (cell) {
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
            FileSaver.saveAs(blob, "fillsmart_operaciones_" + allOperationsHook.operations![0].customerFirstName + "_" + allOperationsHook.operations![0].customerLastName + "_" + moment().format("DD-MM-YYYY") + ".xlsx");
        });;
    };

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
                    o.litres ? o.litres.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    }) : "-"
                ),
            filterDropdown: NumberFilter,
            sorter: true
        },
        {
            title: "Precio",
            key: "fuelPrice",
            align: "right",
            render: (o: IOperationModel) =>
                TextCell(
                    o.fuelPrice ? "$ " + o.fuelPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }) :
                        "-"
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
                                <ButtonHolders>
                                    <ActionBtn
                                        type="primary"
                                        onClick={onGenerateExcelClicked}
                                        loading={generateExcelClicked}
                                    >
                                        Descargar planilla
                                    </ActionBtn>
                                </ButtonHolders>
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
