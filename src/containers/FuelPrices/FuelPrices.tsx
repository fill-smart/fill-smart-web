import React, { useState } from "react";
import { LayoutContentWrapper } from "../../components/utility/layoutWrapper.style";
import PageHeader from "../../components/utility/pageHeader";
import { Row, Col, Modal } from "antd";
import basicStyle from "../../assets/styles/constants";
import { TextCell } from "../../components/Tables/HelperCells";
import { TableViews } from "../Tables/AntTables/AntTables";
import IsoWidgetsWrapper from "../Widgets/WidgetsWrapper";
import IsoWidgetBox from "../Widgets/WidgetBox";
import Loader from "../../components/utility/loader";
import { IFuelTypeModel } from "../../interfaces/models/fuel-type.model";
import { IFuelPriceModel } from "../../interfaces/models/fuel-price.model";
import useFuelPrices, {
    IFuelPricesResult,
    FuelPricesRecords
} from "../../hooks/use-fuel-prices.hook";
import { ActionWrapper, ButtonWrapper } from "../Stations/Stations.styles";
import { Link, useHistory } from "react-router-dom";
import { PRIVATE_ROUTE } from "../../route.constants";
import styled from "styled-components";
import Input from "../../components/uielements/input";
import { FuelPricesHooks } from "../../hooks/fuel-prices.hooks";
import {
    ICurrentFuelPricesResult,
    CurrentFuelPricesRecords
} from "../../hooks/use-current-fuel-prices.hook";
import Chart from "react-google-charts";
import * as Moment from "moment";
import { extendMoment, MomentRange, DateRange } from "moment-range";
import BackButton from "../../components/uielements/BackButton";
const moment = extendMoment(Moment);

const { rowStyle, colStyle } = basicStyle;

type FuelTypeViewModel = Pick<IFuelTypeModel, "name">;

type FuelPriceViewModel = Pick<IFuelPriceModel, "price" | "from" | "to"> & {
    fuelType: FuelTypeViewModel;
};

const Fieldset = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const Label = styled.label`
    font-size: 13px;
    line-height: 1.5;
    font-weight: 500;
    padding: 0;
    margin: 0 0 8px;
`;

const formatForChart = (prices: FuelPriceViewModel[]) => {
    let arrangedData: Array<{
        interval: string;
        prices: FuelPriceViewModel[];
    }> = [];
    let intervals: DateRange[] = [];
    for (let i = 0; i < 11; i++) {
        let endOfRange = moment().endOf("month");
        let startOfRange = moment().startOf("month");
        if (i > 0) {
            startOfRange = startOfRange.subtract(i, "months");
            endOfRange = endOfRange.subtract(i, "months");
        }

        const range = moment.range(startOfRange, endOfRange);
        intervals = [range, ...intervals];
    }
    const lastInterval = moment.range(
        moment().subtract(1000, "years"),
        intervals[0].start
    );
    intervals = [lastInterval, ...intervals];
    arrangedData = intervals.map((range, i) => {
        let containedPrices: FuelPriceViewModel[] = [];
        prices.map(price => {
            if (range.contains(moment(price.from))) {
                containedPrices = [...containedPrices, price];
            }
        });
        return {
            interval: i === 0 ? "Anterior" : range.start.format("MM/YYYY"),
            prices: containedPrices
        };
    });
    return arrangedData;
};

const getCurrent = (): [CurrentFuelPricesRecords | undefined, boolean] => {
    const { currentFuelPrices, loading } = FuelPricesHooks.getCurrent();
    return [currentFuelPrices, loading];
};

const getAll = (): [FuelPricesRecords | undefined, boolean] => {
    const { fuelPrices, loading } = FuelPricesHooks.getAll();
    return [fuelPrices, loading];
};

const FuelPrices = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentFuelPrices, currentLoading] = getCurrent();
    const [fuelPrices, allLoading] = getAll();
    const loading = currentLoading || allLoading;
    const history = useHistory();
    const goBack = () => {
        history.goBack();
    };
    const columns = [
        {
            title: "Tipo de Combustible",
            key: "fuelType",
            render: (p: FuelPriceViewModel) => TextCell(p?.fuelType.name)
        },
        {
            title: "Precio Actual",
            key: "fuelPrice",
            render: (p: FuelPriceViewModel) =>
                TextCell(
                    p?.price.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    })
                )
        }
    ];

    const handleModal = (gasStation = null) => {
        setModalOpen(true);
    };

    const handleRecord = (actionName, gasStation) => {};
    console.log(fuelPrices);
    /*Chart*/
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

    const chartEvents = [
        {
            eventName: "select",
            callback(Chart) {}
        }
    ];
    /*End Chart*/

    if (loading) {
        return <Loader />;
    }
    if (!fuelPrices || fuelPrices.length == 0) {
        return <div>No existen clientes registrados</div>;
    }
    let fuelTypes: Array<{ name: string }> = [];
    fuelPrices
        .map(price => price.fuelType.name)
        .map(name => {
            if (!fuelTypes.some(type => type.name === name)) {
                fuelTypes.push({
                    name
                });
            }
        });
    const rangesByFuelType = fuelTypes.map(type => {
        let formattedData = formatForChart(
            fuelPrices.filter(price => price.fuelType.name === type.name)
        );
        return { type, formattedData };
    });
    console.log(rangesByFuelType);
    const firstRow = ["x", ...fuelTypes.map(t => t.name)];
    let rest: any = [];
    for (let i = 0; i < 12; i++) {
        const axisName = rangesByFuelType[0].formattedData[i].interval;
        const row = [
            axisName,
            ...rangesByFuelType.map(
                range =>
                    +(
                        range.formattedData[i].prices.reduce(
                            (p, n) => p + n.price,
                            0
                        ) / range.formattedData[i].prices.length
                    ).toFixed(2)
            )
        ];
        rest = [...rest, row];
    }
    const data = [firstRow, ...rest];
    console.log("DATA:", data);
    const BarChart = {
        title: "LineChart",
        key: "LineChart",
        width,
        height,
        data,
        options: {
            title: "Evolución de Precios",
            titleTextStyle: {
                color: "#788195"
            },
            animation: {
                duration: 1000,
                easing: "in",
                startup: true
            },
            hAxis: {
                title: "Periodo",
                textStyle: {
                    color: "#788195"
                }
            },
            vAxis: {
                width: "100%",
                title: "Precio (Promedio)",
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
    /*
    [
        ["x", "Nafta Super", "Nafta Premium", "Diesel", "Diesel Premium"],
        ["01/2019", 0, 0, 0, 0],
        ["02/2019", 10, 5, 11, 13],
        ["03/2019", 23, 15, 26, 17],
        ["04/2019", 17, 9, 12, 15],
        ["05/2019", 18, 10, 21, 18],
        ["06/2019", 9, 5, 3, 1],
        ["07/2019", 11, 3, 15, 25]
    ]
    */

    return (
        <LayoutContentWrapper>
            <PageHeader>Precio de Combustibles</PageHeader>

            <Row style={rowStyle} gutter={0} justify="start">
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <IsoWidgetsWrapper>
                        <IsoWidgetBox>
                            <ButtonWrapper>
                                <BackButton
                                    onClick={goBack}
                                />
                            </ButtonWrapper>
                            <TableViews.SimpleView
                                tableInfo={{
                                    title: "Precio de Combustibles",
                                    value: "simple",
                                    columns: columns
                                }}
                                rowKey="id"
                                dataSource={currentFuelPrices}
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
                                chartType="LineChart"
                                chartEvents={chartEvents as any}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>
            <Modal
                visible={modalOpen}
                title="Editar Precio"
                okText={"Guardar"}
                onOk={() => console.log("OK")}
                onCancel={() => setModalOpen(false)}
            >
                <div>
                    <Fieldset>
                        <Label>Title</Label>
                        <Input
                            label="Title"
                            placeholder="Enter Title"
                            value=""
                            onChange={e => console.log(e, "title")}
                        />
                    </Fieldset>

                    <Fieldset>
                        <Label>Slug</Label>

                        <Input
                            label="Slug"
                            placeholder="Enter Slugs"
                            value=""
                            onChange={e => console.log(e, "slug")}
                        />
                    </Fieldset>
                </div>
            </Modal>
        </LayoutContentWrapper>
    );
};

export default FuelPrices;
