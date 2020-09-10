import React, { useState, useEffect } from "react";
import { LayoutContentWrapper } from "../../components/utility/layoutWrapper.style";
import PageHeader from "../../components/utility/pageHeader";
import { Row, Col, Tooltip } from "antd";
import basicStyle from "../../assets/styles/constants";
import { TextCell } from "../../components/Tables/HelperCells";
import IsoWidgetsWrapper from "../Widgets/WidgetsWrapper";
import IsoWidgetBox from "../Widgets/WidgetBox";
import { ActionWrapper, ButtonWrapper, ButtonHolders, ActionBtn } from "../Stations/Stations.styles";
import { IAndFilterCriteria, FilterTypesEnum } from "../../core/filters";
import { QueryCriteria, FilteredTable } from "../../core/FilteredTable";
import { createTextFilter, NumberFilter, createSelectFilter } from "../../components/Tables/Filters";
import { IOperationTotalByCustomerModel } from "../../interfaces/models/operation-total-by-customer";
import useOperationsTotalsByCustomer, { useOperationsTotalsByCustomerLazy } from "../../hooks/use-operations-totals-by-customers.hook";
import OperationsTotalsByFuelTypeDetail from "./OperationsTotalsByFuelTypeDetail";
import { DateUtils } from "@silentium-apps/fill-smart-common";
import { paymentMethodDict } from "../OperationsAdmin/OperationsAdmin";
import moment from "moment";
import FileSaver from "file-saver";
import Excel from "exceljs";


const { rowStyle, colStyle } = basicStyle;

const OperationsTotalsByFuelType = () => {
    /*Criteria*/
    const [tableCriteria, setTableCriteria] = useState<QueryCriteria>({
        pagination: {
            current: 1,
            pageSize: 10
        },
        sort: [],
        filter: undefined
    });
    const {pagination, ...tableCriteriaWithoutPagination} = tableCriteria;
    const allOperationsHook = useOperationsTotalsByCustomerLazy(tableCriteriaWithoutPagination);
    const [generateExcelClicked, setGenerateExcelClicked] = useState<boolean>(false);
    const [otherFilters, setOtherFilters] = useState<IAndFilterCriteria | undefined>();
    const operationsTotalsByCustomerHook = useOperationsTotalsByCustomer(tableCriteria);
    const [modalDetailOpened, setModalDetailOpened] = useState(false);
    const [customerDocumentNumber, setCustomerDocumentNumber] = useState<number | undefined>();
    const loading = operationsTotalsByCustomerHook.loading;

    const onGenerateExcelClicked = () => {
        setGenerateExcelClicked(true);
        if (allOperationsHook.operationsTotalsByCustomer){
            generateExcel()
        }
        else {
            allOperationsHook.execute();
        }
    }

    useEffect(() => {
        if (allOperationsHook.operationsTotalsByCustomer && generateExcelClicked) {
            generateExcel();
        }
    }, [allOperationsHook.operationsTotalsByCustomer]);

    const generateExcel = async () => {
        setGenerateExcelClicked(false);    
        const workbook = new Excel.Workbook();
        const sheet = workbook.addWorksheet('Vendidos-Entregados');
        
        sheet.columns = [
            { header: 'Documento', key: 'customerDocumentNumber' },
            { header: 'Nombre', key: 'customerFirstName' },
            { header: 'Apellido', key: 'customerLastName' },
            { header: 'Total Vendido', key: 'totalSold' },
            { header: 'Total Entregado', key: 'totalDelivered' },
            { header: 'Pendiente de entregar', key: 'totalPending' },
        ];

        sheet.addRows(allOperationsHook.operationsTotalsByCustomer!.map(o => [
            o.customerDocumentNumber,
            o.customerFirstName,
            o.customerLastName,
            o.totalSold?.toLocaleString("es-ar", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }) + " lt",
            o.totalDelivered?.toLocaleString("es-ar", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }) + " lt",
            o.totalPending?.toLocaleString("es-ar", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }) + " lt"
        ]));

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
            FileSaver.saveAs(blob, "fillsmart_vendidos_entregados_" + moment().format("DD-MM-YYYY") + ".xlsx");
            });;
    };
    
    const columns = [
        {
            title: "Documento",
            key: "customerDocumentNumber",
            render: (o: IOperationTotalByCustomerModel) => TextCell(o.customerDocumentNumber),
            filterDropdown: createTextFilter(FilterTypesEnum.Equals),
            sorter: true
        },
        {
            title: "Nombre",
            key: "customerFirstName",
            render: (o: IOperationTotalByCustomerModel) => TextCell(o.customerFirstName),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true
        },
        {
            title: "Apellido",
            key: "customerLastName",
            render: (o: IOperationTotalByCustomerModel) => TextCell(o.customerLastName),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true
        },
        {
            title: "Total Vendido",
            key: "totalSold",
            render: (o: IOperationTotalByCustomerModel) => TextCell(
                o.totalSold.toLocaleString("es-ar", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }) + " lt"
            ),
            filterDropdown: NumberFilter,
            sorter: true
        },
        {
            title: "Total Entregado",
            key: "totalDelivered",
            render: (o: IOperationTotalByCustomerModel) => TextCell(
                o.totalDelivered.toLocaleString("es-ar", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }) + " lt"
            ),
            filterDropdown: NumberFilter,
            sorter: true
        },
        {
            title: "Pendiente de entregar",
            key: "totalPending",
            render: (o: IOperationTotalByCustomerModel) => TextCell(
                o.totalPending.toLocaleString("es-ar", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }) + " lt"
            ),
            filterDropdown: NumberFilter,
            sorter: true
        },
        {
            title: "",
            key: "action",
            width: "5%",
            className: "noWrapCell",
            render: (o: IOperationTotalByCustomerModel) => {
                return (
                    <ActionWrapper>
                        <Tooltip title="Ver Detalle">
                            <a onClick={() => showDetail(o)} href="# ">
                                <i className="ion-eye" />
                            </a>
                        </Tooltip>
                    </ActionWrapper>
                );
            }
        },
    ];

    const showDetail = (operation: IOperationTotalByCustomerModel) => {
        console.log("operation dni: ", operation.customerDocumentNumber);
        setCustomerDocumentNumber(operation.customerDocumentNumber);
        setModalDetailOpened(true);
    }

    return (
        <LayoutContentWrapper>
            <PageHeader>Litros vendidos / Litros entregados por cliente</PageHeader>

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
                                </ButtonHolders>
                            </ButtonWrapper>
                            {/* TABLE */}
                            <FilteredTable
                                columns={columns}
                                dataSource={operationsTotalsByCustomerHook.operationsTotalsByCustomer}
                                loading={loading}
                                pagination={{ ...tableCriteria.pagination, ...{ total: operationsTotalsByCustomerHook.total } }}
                                otherFilters={otherFilters}
                                onCriteriaChange={setTableCriteria}
                                showDeleted={true}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>

            <OperationsTotalsByFuelTypeDetail opened={modalDetailOpened} customerDocumentNumber={customerDocumentNumber}
                onClose={() => setModalDetailOpened(false)}
            />
        </LayoutContentWrapper>
    );
};

export default OperationsTotalsByFuelType;
