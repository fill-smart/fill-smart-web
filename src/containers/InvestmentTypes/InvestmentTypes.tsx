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
} from "./InvestmentTypes.styles";
import Loader from "../../components/utility/loader";
import { InvestmentTypesEdit } from "./InvestmentTypesEdit";
import useInvestmentTypes from "../../hooks/use-investment-types.hook";
import { IInvestmentTypeModel } from "../../interfaces/models/investment-type.model";
import { QueryCriteria, FilteredTable } from "../../core/FilteredTable";
import { IAndFilterCriteria, FilterTypesEnum } from "../../core/filters";
import { createTextFilter } from "../../components/Tables/Filters";

const { rowStyle, colStyle } = basicStyle;

const Stations = () => {
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
    const { investmentTypes, loading, total } = useInvestmentTypes(tableCriteria);

    const columns = [
        {
            title: "Nombre",
            key: "name",
            width: "35%",
            render: o => TextCell(o?.name),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true,
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
    const [editing, setEditing] = useState<
        Partial<IInvestmentTypeModel> | undefined
    >();



    const edit = (o: Partial<IInvestmentTypeModel>) => {
        setEditing(o);
        setModalOpened(true);
    };
    const create = () => {
        setEditing(undefined);
        setModalOpened(true);
    };

    return (
        <LayoutContentWrapper>
            <PageHeader>{"Tipos de Inversión"}</PageHeader>

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
                                        Nuevo Tipo de Inversión
                                    </ActionBtn>
                                </ButtonHolders>
                            </ButtonWrapper>

                            {/* TABLE */}
                            <FilteredTable
                                columns={columns}
                                dataSource={investmentTypes}
                                loading={loading}
                                pagination={{ ...tableCriteria.pagination, ...{ total } }}
                                otherFilters={otherFilters}
                                onCriteriaChange={setTableCriteria}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>
            <InvestmentTypesEdit
                editing={editing}
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onFinished={() => setModalOpened(false)}
            />
        </LayoutContentWrapper>
    );
};

export default Stations;
