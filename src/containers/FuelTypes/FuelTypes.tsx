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
} from "./FuelTypes.styles";
import Loader from "../../components/utility/loader";
import { FuelTypesEdit } from "./FuelTypesEdit";
import { QueryCriteria, FilteredTable } from "../../core/FilteredTable";
import { IAndFilterCriteria, FilterTypesEnum } from "../../core/filters";
import { createTextFilter } from "../../components/Tables/Filters";
import useFuelTypes from "../../hooks/use-fuel-types.hook";
import { IFuelTypeModel } from "../../interfaces/models/fuel-type.model";
import LoaderComponent from "../../components/utility/loader.style";

const { rowStyle, colStyle } = basicStyle;

const FuelTypes = () => {
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
    const { fuelTypes, loading } = useFuelTypes();

    const columns = [
        {
            title: "Nombre",
            key: "name",
            width: "35%",
            render: o => TextCell(o?.name),
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
                    </ActionWrapper>
                );
            }
        }
    ];
    const [modalOpened, setModalOpened] = useState(false);
    const [editing, setEditing] = useState<
        Partial<IFuelTypeModel> | undefined
    >();

    const edit = (o: Partial<IFuelTypeModel>) => {
        setEditing(o);
        setModalOpened(true);
    };

    if (loading) {
        return (<LoaderComponent/>);
    }

    return (
        <LayoutContentWrapper>
            <PageHeader>{"Combustibles"}</PageHeader>

            <Row style={rowStyle} gutter={0} justify="start">
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <IsoWidgetsWrapper>
                        <IsoWidgetBox>
                            {/* TABLE */}
                            <FilteredTable
                                columns={columns}
                                dataSource={fuelTypes}
                                loading={loading}
                                pagination={undefined}
                                otherFilters={otherFilters}
                                onCriteriaChange={setTableCriteria}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>
            <FuelTypesEdit
                editing={editing!}
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onFinished={() => setModalOpened(false)}
            />
        </LayoutContentWrapper>
    );
};

export default FuelTypes;
