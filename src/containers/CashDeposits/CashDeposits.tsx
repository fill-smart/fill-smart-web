import React, { useState, useContext, useEffect } from "react";
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
import useCashDeposits, { CashDepositRecord, useCashDepositsLazy } from "../../hooks/use-cash-deposits.hook";
import { SecurityContext, RolesEnum } from "../../contexts/security.context";
import { QueryCriteria, FilteredTable } from "../../core/FilteredTable";
import { IAndFilterCriteria, FilterTypesEnum } from "../../core/filters";
import { DateFilter, NumberFilter, createTextFilter } from "../../components/Tables/Filters";
import Excel from "exceljs";
import FileSaver from "file-saver";

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
    const {pagination, ...tableCriteriaWithoutPagination} = tableCriteria;
    const [generateExcelClicked, setGenerateExcelClicked] = useState<boolean>(false);
    const [otherFiltersRaw, setOtherFiltersRaw] = useState<any>();
    const [otherFilters, setOtherFilters] = useState<IAndFilterCriteria | undefined>()
    /*End Criteria*/
    const gasStationId = security.user?.gasStationAdministrator?.gasStation.id;
    const { cashDeposits, loading, total } = useCashDeposits(gasStationId, tableCriteria);
    const allCashDepositsHook = useCashDepositsLazy(gasStationId, tableCriteriaWithoutPagination);

    const onGenerateExcelClicked = () => {
        setGenerateExcelClicked(true);
        if (allCashDepositsHook?.cashDeposits){
            generateExcel()
        }
        else {
            allCashDepositsHook.execute();
        }
    }

    useEffect(() => {
        if (allCashDepositsHook?.cashDeposits && generateExcelClicked) {
            generateExcel();
        }
    }, [allCashDepositsHook?.cashDeposits]);

    const generateExcel = async () => {    
        setGenerateExcelClicked(false);
        const workbook = new Excel.Workbook();
        const sheet = workbook.addWorksheet('Depositos en efectivo');
        
        sheet.columns = [
            { header: 'Fecha', key: 'stamp' },
            { header: 'Importe', key: 'amount' },
            { header: 'Estacion de Servicio', key: 'gasStation.name' },
            { header: 'Comprobante Nro.', key: 'receipt' },
        ];

        sheet.addRows(allCashDepositsHook.cashDeposits!.map(o => [
            moment(o?.stamp).format("DD/MM/YYYY HH:mm"), 
            "$ " + o.amount.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }), 
            o.gasStation.name,
            o.receipt
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
            FileSaver.saveAs(blob, "fillsmart_depositos_en_efectivo_" + moment().format("DD-MM-YYYY") + ".xlsx");
            });;
    };

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
                            {isGasStationAdmin ? <ButtonWrapper>
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
                                        Nuevo Depósito
                                    </ActionBtn>
                                </ButtonHolders>
                            </ButtonWrapper> 
                            :
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
