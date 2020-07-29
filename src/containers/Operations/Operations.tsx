import React, { useState } from "react";
import { LayoutContentWrapper } from "../../components/utility/layoutWrapper.style";
import PageHeader from "../../components/utility/pageHeader";
import { Row, Col } from "antd";
import basicStyle from "../../assets/styles/constants";
import { TextCell } from "../../components/Tables/HelperCells";
import { TableViews } from "../Tables/AntTables/AntTables";
import IsoWidgetsWrapper from "../Widgets/WidgetsWrapper";
import IsoWidgetBox from "../Widgets/WidgetBox";
import Loader from "../../components/utility/loader";
import { IFuelTypeModel } from "../../interfaces/models/fuel-type.model";
import { IFuelPriceModel } from "../../interfaces/models/fuel-price.model";
import useOperations from "../../hooks/use-operations.hook";
import { ICustomerModel } from "../../interfaces/models/customer.model";
import { IPumpModel } from "../../interfaces/models/pump.model";
import { IOperationModel, PaymentMethodsEnum } from "../../interfaces/models/operation.model";
import { DateUtils } from "@silentium-apps/fill-smart-common";
import useParameters from "../../hooks/use-parameters.hook";
import LoaderComponent from "../../components/utility/loader.style";
import moment from "moment";
import { QueryCriteria, FilteredTable } from "../../core/FilteredTable";
import { IAndFilterCriteria, FilterTypesEnum } from "../../core/filters";
import { createTextFilter, DateFilter, NumberFilter, createSelectFilter } from "../../components/Tables/Filters";
import { paymentMethodDict } from "../OperationsAdmin/OperationsAdmin";

const { rowStyle, colStyle } = basicStyle;

const Operations = () => {
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
    const { operations, loading, total } = useOperations(tableCriteria);
    const gracePeriodHook = useParameters();
    const columns = [
        {
            title: "Nº de Transaccion",
            key: "transactionId",
            render: (o: IOperationModel) => TextCell(o.transactionId),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
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
            sorter: true,
        },
        {
            title: "Tipo de Combustible",
            key: "fuelTypeName",
            render: (o: IOperationModel) => TextCell(o.fuelTypeName),
            filterDropdown: createTextFilter(FilterTypesEnum.Equals),
            sorter: true
        },
        {
            title: "Litros",
            key: "litres",
            align: "right",
            render: (o: IOperationModel) =>
                TextCell(
                    o.litres.toLocaleString("es-ar", {
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
                TextCell(
                    "$ " + o.fuelPrice.toLocaleString("es-ar", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })
                ),
            filterDropdown: NumberFilter,
            sorter: true
        },
        {
            title: "Total",
            key: "total",
            align: "right",
            render: (o: IOperationModel) => TextCell(
                "$ " +
                    o.total.toLocaleString("es-ar", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })
            ),
            filterDropdown: NumberFilter,
            sorter: true
        },
        {
            title: "Forma de Pago",
            key: "paymentMethod",
            align: "right",
            render: (o: IOperationModel) => o.paymentMethod ? TextCell(paymentMethodDict[o.paymentMethod]) : '-',
            filterDropdown: createSelectFilter([
                {
                    value: PaymentMethodsEnum.Cash,
                    label: "Efectivo"
                },
                {
                    value: PaymentMethodsEnum.Mercadopago,
                    label: "Mercado Pago"
                },
            ]),
            sorter: true
        },
        {
            title: "Documento",
            key: "customerDocumentNumber",
            render: (o: IOperationModel) =>
                TextCell(o.customerDocumentNumber),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true
        },
        {
            title: "Nombre",
            key: "customerFirstName",
            render: (o: IOperationModel) =>
                TextCell(o.customerFirstName),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true
        },
        {
            title: "Apellido",
            key: "customerLastName",
            render: (o: IOperationModel) =>
                TextCell(o.customerLastName),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true
        },
        {
            title: "Surtidor",
            key: "pumpExternalId",
            render: (o: IOperationModel) =>
                TextCell(o.pumpExternalId ?? "-"),
            filterDropdown: createTextFilter(FilterTypesEnum.Equals),
            sorter: true
        }
    ];

    const handleModal = (gasStation = null) => { };

    const handleRecord = (actionName, gasStation) => { };

    return (
        <LayoutContentWrapper>
            <PageHeader>Operaciones Realizadas</PageHeader>

            <Row style={rowStyle} gutter={0} justify="start">
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <IsoWidgetsWrapper>
                        <IsoWidgetBox>
                            {/* TABLE */}
                            <FilteredTable
                                columns={columns}
                                dataSource={operations}
                                loading={loading}
                                pagination={{ ...tableCriteria.pagination, ...{ total } }}
                                otherFilters={otherFilters}
                                onCriteriaChange={setTableCriteria}
                                defaultSorter={[{ property: "stamp", descending: true }]}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>
        </LayoutContentWrapper>
    );
};

export default Operations;
