import React from "react";
import { LayoutContentWrapper } from "../../components/utility/layoutWrapper.style";
import PageHeader from "../../components/utility/pageHeader";
import { Row, Col } from "antd";
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
} from "../Pumps/Pumps.styles";
import Popconfirms from "../../components/Feedback/Popconfirm";
import Loader from "../../components/utility/loader";
import { useParams, useHistory } from "react-router-dom";
import { PumpHooks } from "../../hooks/pumps.hooks";
import { GasTankHooks } from "../../hooks/gas-tanks.hooks";
import { IGasTankModel } from "../../interfaces/models/gas-tank.model";
import { IFuelTypeModel } from "../../interfaces/models/fuel-type.model";
import Chart from "react-google-charts";
import BackButton from "../../components/uielements/BackButton";

const { rowStyle, colStyle } = basicStyle;

type FuelTypeViewModel = Pick<IFuelTypeModel, "name">;

type GasTankViewModel = Pick<IGasTankModel, "id" | "litres" | "externalId"> & {
    fuelType: FuelTypeViewModel;
};

const GasTanks = () => {
    const { gasStationId } = useParams();
    if (!gasStationId) {
        throw "No gas station id";
    }

    const { gasTanks, loading } = GasTankHooks.getByGasStation(
        Number(gasStationId)
    );

    const history = useHistory();
    const goBack = () => {
        history.goBack();
    };

    const columns = [
        {
            title: "Número",
            key: "id",
            render: (t: GasTankViewModel) => TextCell(t?.externalId)
        },
        {
            title: "Tipo de Combustible",
            key: "fuelType",
            render: (t: GasTankViewModel) => TextCell(t?.fuelType.name)
        },
        {
            title: "Litros",
            key: "litres",
            render: (t: GasTankViewModel) =>
                TextCell(
                    t?.litres.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    })
                )
        }
    ];

    const handleModal = (gasStation = null) => { };

    const handleRecord = (actionName, gasStation) => { };

    if (loading) {
        return <Loader />;
    }
    if (!gasTanks || gasTanks.length == 0) {
        return <div>No existen estaciones de servicio</div>;
    }
    const colors = [
        "#48A6F2",
        "#f64744",
        "#ffbf00",
        "#511E78",
        "#66d9de",
        "#ffa1b5",
        "#66d0a5",
        "#8f5c53"
    ];
    const width = "100%";
    const height = "400px";
    const BarChart = {
        title: "BarChart",
        key: "BarChart",
        chartType: "Bar",
        width,
        height,
        data: [
            [
                "Tanque",
                "Combustible Restante",
                {
                    role: "style"
                }
            ],
            ...gasTanks.map((g, index) => [
                `${g.externalId} - ${g.fuelType.name}`,
                g.litres,
                `fill-color: ${colors[index]}; fill-opacity: 0.4`
            ])
        ],
        options: {
            title: "Combustible por Tanque",
            titleTextStyle: {
                color: "#788195"
            },
            bar: {
                groupWidth: "95%"
            },
            legend: {
                position: "none"

            },
            animation: {
                duration: 1000,
                easing: "in",
                startup: true
            },
            hAxis: {
                textStyle: {
                    color: "#788195"
                }
            },
            vAxis: {
                width: "100%",
                label: "Tanque",
                textPosition: "in",
                textStyle: {
                    color: "#788195"
                }
            },
            tooltip: {
                textStyle: {
                    color: "#788195"
                }
            }
        },
        chartEvents: [
            {
                eventName: "onmouseover"
            }
        ]
    };
    const chartEvents = [
        {
            eventName: "select",
            callback(Chart) { }
        }
    ];
    return (
        <LayoutContentWrapper>
            <PageHeader>Tanques de Combustible</PageHeader>

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
                            <TableViews.SimpleView
                                tableInfo={{
                                    title: "Simple Table",
                                    value: "simple",
                                    columns: columns
                                }}
                                rowKey="id"
                                dataSource={gasTanks}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <IsoWidgetsWrapper>
                        <IsoWidgetBox
                            height={"450"}
                            style={{ overflow: "hidden" }}
                        >
                            {/* Google Bar Chart */}
                            <Chart
                                {...BarChart}
                                chartType="BarChart"
                                chartEvents={chartEvents as any}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>
        </LayoutContentWrapper>
    );
};

export default GasTanks;
