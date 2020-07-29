import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import LoaderComponent from "../../components/utility/loader.style";
import useOperationsTotalsByFuelType from "../../hooks/use-operations-totals-by-fuel-type.hook";
import { IOperationTotalByFuelTypeModel } from "../../interfaces/models/operation-total-by-fuel-type";

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
import { IOperationModel, PaymentMethodsEnum } from "../../interfaces/models/operation.model";
import useOperations from "../../hooks/use-operations.hook";
import { IAndFilterCriteria, FilterTypesEnum } from "../../core/filters";
import { QueryCriteria, FilteredTable } from "../../core/FilteredTable";
import { createTextFilter, DateFilter, NumberFilter, createSelectFilter } from "../../components/Tables/Filters";
import useOperationsTotalsByCustomer from "../../hooks/use-operations-totals-by-customers.hook";


const centerContainer = {
    margin: "0 auto",
};

const padding20 = {
    padding: "10px"
};

export const OperationsTotalsByFuelTypeDetail = ({
    opened,
    customerDocumentNumber,
    onClose
}: {
    opened?: boolean;
    customerDocumentNumber: number | undefined;
    onClose: () => void;
}) => {

    console.log("Component dni: ", customerDocumentNumber);

    const { getTotalOperationsByFuelTypeAndCustomer, operationsTotalsByFuelType, loading, error, total } =
        useOperationsTotalsByFuelType();

    useEffect(() => {
        console.log("effect dni: ", customerDocumentNumber);
        if (customerDocumentNumber) {
            getTotalOperationsByFuelTypeAndCustomer(customerDocumentNumber);
        }
    }, [customerDocumentNumber]);

    const [tableCriteria, setTableCriteria] = useState<QueryCriteria>({
        pagination: {
            current: 1,
            pageSize: 10
        },
        sort: [],
        filter: undefined
    });
    const [otherFilters, setOtherFilters] = useState<IAndFilterCriteria | undefined>();

    const columns = [
        {
            title: "Tipo de Combustible",
            key: "customerLastName",
            render: (o: IOperationTotalByFuelTypeModel) => TextCell(o.fuelTypeName),
        },
        {
            title: "Total Vendido",
            key: "totalSold",
            render: (o: IOperationTotalByFuelTypeModel) => TextCell(
                o.totalSold.toLocaleString("es-ar", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }) + " lt"
            ),
        },
        {
            title: "Total Entregado",
            key: "totalDelivered",
            render: (o: IOperationTotalByFuelTypeModel) => TextCell(
                o.totalDelivered.toLocaleString("es-ar", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }) + " lt"
            ),
        },
        {
            title: "Pendiente de entregar",
            key: "totalPending",
            render: (o: IOperationTotalByFuelTypeModel) => TextCell(
                o.totalPending.toLocaleString("es-ar", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                }) + " lt"
            ),
        },
    ];

    return (
        <Modal width={800}
            onCancel={onClose}
            visible={opened}
            title={`Detalle`}
            footer={null}
        >
            {error ? <p>{error.message}</p> : null}

            {loading ? (
                <LoaderComponent />
            )
                : operationsTotalsByFuelType ? (
                    <div style={centerContainer as any}>
                        <FilteredTable
                            columns={columns}
                            dataSource={operationsTotalsByFuelType}
                            loading={loading}
                            pagination={{ ...tableCriteria.pagination, ...{ total: total } }}
                            otherFilters={otherFilters}
                            onCriteriaChange={setTableCriteria}
                        />
                    </div>
                ) : null}
        </Modal>
    );
};

export default OperationsTotalsByFuelTypeDetail;
