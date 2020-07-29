import React, { useState, useContext } from "react";
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
} from "./CashDeposits.styles";
import Loader from "../../components/utility/loader";
import moment from "moment";


import { NotificationsEdit } from "./CashDepositsEdit";
import useCashDeposits, { CashDepositRecord } from "../../hooks/use-cash-deposits.hook";
import { SecurityContext, RolesEnum } from "../../contexts/security.context";
import { QueryCriteria, FilteredTable } from "../../core/FilteredTable";
import { IAndFilterCriteria, FilterTypesEnum } from "../../core/filters";
import { DateFilter, NumberFilter, createTextFilter } from "../../components/Tables/Filters";

const { rowStyle, colStyle } = basicStyle;

const CashDeposits = () => {
    const [security] = useContext(SecurityContext)
    const isGasStationAdmin = security.user?.roles.map(r => r.name).includes(RolesEnum.GasStationAdmin);
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
    const gasStationId = security.user?.gasStationAdministrator?.gasStation.id;
    const { cashDeposits, loading, total } = useCashDeposits(gasStationId, tableCriteria);
    console.log(gasStationId, tableCriteria);
    console.log(cashDeposits)
    const columns = [
        {
            title: "Fecha",
            key: "stamp",
            render: (o: CashDepositRecord) => TextCell(moment(o?.stamp).format("DD/MM/YYYY HH:mm")),
            filterDropdown: DateFilter,
            sorter: true,
        },
        {
            title: "Importe",
            align: "right",
            key: "amount",
            filterDropdown: NumberFilter,
            sorter: true,
            render: (o: CashDepositRecord) => TextCell("$ " + o.amount.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }))
        },
        {
            title: "Estacion de Servicio",
            key: "gasStation.name",
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true,
            render: (o: CashDepositRecord) => TextCell(o.gasStation.name)
        },
        {
            title: "Comprobante Nro.",
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true,
            key: "receipt",

            render: (o: CashDepositRecord) =>
                TextCell(o?.receipt)
        }
    ];
    const [modalOpened, setModalOpened] = useState(false);


    const create = () => {
        setModalOpened(true);
    };

    return (
        <LayoutContentWrapper>
            <PageHeader>{"Depósitos en Efectivo"}</PageHeader>

            <Row style={rowStyle} gutter={0} justify="start">
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <IsoWidgetsWrapper>
                        <IsoWidgetBox>
                            {isGasStationAdmin && <ButtonWrapper>
                                <div></div>
                                <ButtonHolders>
                                    <ActionBtn
                                        type="primary"
                                        onClick={() => create()}
                                    >
                                        Nuevo Depósito
                                    </ActionBtn>
                                </ButtonHolders>
                            </ButtonWrapper>}

                            <FilteredTable
                                columns={columns}
                                dataSource={cashDeposits}
                                loading={loading}
                                pagination={{ ...tableCriteria.pagination, ...{ total } }}
                                otherFilters={otherFilters}
                                onCriteriaChange={setTableCriteria}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>
            <NotificationsEdit
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onFinished={() => setModalOpened(false)}
            />
        </LayoutContentWrapper>
    );
};

export default CashDeposits;
