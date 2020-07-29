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
} from "./Quotes.styles";
import Loader from "../../components/utility/loader";
import useQuotes, { QuoteRecord } from "../../hooks/use-quotes.hook";
import moment from "moment";
import { IQuoteModel } from "../../interfaces/models/quote.model";
import { QuotesEdit } from "./QuotesEdit";
import useInvestmentTypes from "../../hooks/use-investment-types.hook";
import { QueryCriteria, FilteredTable } from "../../core/FilteredTable";
import { IAndFilterCriteria, FilterTypesEnum } from "../../core/filters";
import { createTextFilter, DateFilter, NumberFilter } from "../../components/Tables/Filters";

const { rowStyle, colStyle } = basicStyle;

const Quotes = () => {
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
    const investmentTypesHook = useInvestmentTypes();
    const { quotes, loading, total } = useQuotes(tableCriteria);
    

    const columns = [
        {
            title: "Tipo de Inversion",
            key: "investmentType.name",
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true,
            render: (o: QuoteRecord) => TextCell(o?.investmentType.name)
        },
        {
            title: "Desde",
            key: "from",
            sorter: true,
            filterDropdown: DateFilter,
            render: (o: QuoteRecord) =>
                TextCell(moment(o?.from).format("DD/MM/YYYY HH:mm"))
        },
        {
            title: "Hasta",
            key: "to",
            sorter: true,
            filterDropdown: DateFilter,
            render: (o: QuoteRecord) =>
                TextCell(o?.to ? moment(o?.to).format("DD/MM/YYYY HH:mm") : "")
        },
        {
            title: "Unidades",
            key: "price",
            align: "right",
            sorter: true,
            filterDropdown: NumberFilter,
            render: (o: QuoteRecord) =>
                TextCell(
                    o?.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })
                )
        },
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
    const [editing, setEditing] = useState<Partial<IQuoteModel> | undefined>();



    const edit = (o: Partial<IQuoteModel>) => {
        setEditing(o);
        setModalOpened(true);
    };
    const create = () => {
        setEditing(undefined);
        setModalOpened(true);
    };

    return (
        <LayoutContentWrapper>
            <PageHeader>{"Cotizaciones"}</PageHeader>

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
                                        Nueva Cotización
                                    </ActionBtn>
                                </ButtonHolders>
                            </ButtonWrapper>

                            {/* TABLE */}
                            <FilteredTable
                                columns={columns}
                                dataSource={quotes}
                                loading={loading}
                                pagination={{ ...tableCriteria.pagination, ...{ total } }}
                                otherFilters={otherFilters}
                                onCriteriaChange={setTableCriteria}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>
            <QuotesEdit
                investmentTypes={investmentTypesHook.investmentTypes!}
                quotes={quotes}
                editing={editing}
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onFinished={() => setModalOpened(false)}
            />
        </LayoutContentWrapper>
    );
};

export default Quotes;
