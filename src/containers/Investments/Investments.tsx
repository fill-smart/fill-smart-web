import React, { useState } from "react";
import { LayoutContentWrapper } from "../../components/utility/layoutWrapper.style";
import PageHeader from "../../components/utility/pageHeader";
import { Row, Col, Tooltip, Button } from "antd";
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
} from "./Investments.styles";
import useQuotes from "../../hooks/use-quotes.hook";
import { InvestmentsEdit } from "./InvestmentsEdit";
import useInvestmentTypes from "../../hooks/use-investment-types.hook";
import useInvestments, {
    InvestmentRecord
} from "../../hooks/use-investments.hook";
import {
    IInvestmentModel,
    InvestmentMovementTypeEnum
} from "../../interfaces/models/investment.model";
import LoaderComponent from "../../components/utility/loader.style";
import useWallets from "../../hooks/use-wallets.hook";
import useFuelTypes from "../../hooks/use-fuel-types.hook";
import styled from "styled-components";
import moment from "moment";
import { PickADate } from "./PickADate";
import useOperations from "../../hooks/use-operations.hook";
const DateButton = styled(Button)`
    margin:10px;
`
const { rowStyle, colStyle } = basicStyle;

type AmmountPerFuelType = {
    type: {
        id: number;
        name: string;
        currentPrice: {
            price: number;
        };
    };
    litres: number;
    value: number;
};

const TableFooter = ({
    total,
    label,
    paddingRight,
    textColor,
    symbol,
    appendix
}: {
    label: string;
    total: number | string;
    paddingRight: string | number;
    textColor?: string;
    symbol: string;
    appendix?: string
}) => {
    return (
        <>
            <div
                style={{
                    width: "50%",
                    fontWeight: "bold",
                    display: "inline-block",
                    color: textColor
                }}
            >
                {label}
            </div>
            <div
                style={{
                    textAlign: "right",
                    width: "50%",
                    paddingRight: paddingRight,
                    fontWeight: "bold",
                    display: "inline-block",
                    color: textColor
                }}
            >
                {symbol}{" "}
                {typeof (total) === "number" ? total.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                }) : total} {appendix}
            </div>
        </>
    );
};

const Investments = () => {
    const [limitDay, setLimitDay] = useState<Date | undefined>();
    const walletsHook = useWallets();
    const { investments, loading } = useInvestments(limitDay);
    const investmentTypesHook = useInvestmentTypes();
    const quotesHook = useQuotes();
    const fuelTypesHook = useFuelTypes();
    const operationsHook = useOperations();

    const investmentColumns = [
        {
            title: "Tipo de Movimiento",
            key: "movementType",
            render: (o: InvestmentRecord) =>
                TextCell(
                    o?.movementType === InvestmentMovementTypeEnum.Purchase ? (
                        "Compra"
                    ) : (
                            <span
                                style={{
                                    color:
                                        o.movementType ===
                                            InvestmentMovementTypeEnum.Sale
                                            ? "red"
                                            : undefined
                                }}
                            >
                                Venta
                        </span>
                        )
                )
        },
        {
            title: "Tipo de Inversion",
            key: "investmentType",
            render: (o: InvestmentRecord) => TextCell(o?.investmentType.name)
        },
        {
            title: "Fecha",
            key: "stamp",
            render: (o: InvestmentRecord) =>
                TextCell(moment(o?.stamp).format("DD/MM/YYYY HH:mm"))
        },
        {
            title: "Vencimiento",
            key: "dueDate",
            render: (o: InvestmentRecord) =>
                TextCell(moment(o?.dueDate).format("DD/MM/YYYY HH:mm"))
        },
        {
            title: "Cotizacion",
            key: "quote",
            render: (o: InvestmentRecord) =>
                TextCell(
                    `${
                    o.quote.investmentType.name
                    } - ${o.quote.price.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    })}`
                )
        },

        {
            title: "Cantidad",
            key: "price",
            align: "right",
            render: (o: InvestmentRecord) =>
                TextCell(
                    o.ammount.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    })
                )
        },
        {
            title: "Subtotal",
            key: "total",
            align: "right",
            render: (o: InvestmentRecord) =>
                TextCell(
                    <span
                        style={{
                            color:
                                o.movementType ===
                                    InvestmentMovementTypeEnum.Sale
                                    ? "red"
                                    : undefined
                        }}
                    >
                        {o.movementType === InvestmentMovementTypeEnum.Sale
                            ? "-"
                            : ""}{" "}
                        ${" "}
                        {(o.quote.arsEquivalent * o.ammount).toLocaleString(
                            undefined,
                            {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2
                            }
                        )}
                    </span>
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
                    </ActionWrapper>
                );
            }
        }
    ];
    const ammountPerFuelTypeColumns = [
        {
            title: "Tipo de Combustible",
            key: "fuelType",
            render: (o: AmmountPerFuelType) => TextCell(o.type.name)
        },
        {
            title: "Litros",
            key: "litres",
            render: (o: AmmountPerFuelType) => TextCell(o.litres)
        },
        {
            title: "Precio Lt.",
            key: "litrePrice",
            render: (o: AmmountPerFuelType) =>
                TextCell(
                    "$ " +
                    o.type.currentPrice.price.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    })
                )
        },
        {
            title: "Subtotal",
            key: "subtotal",
            align: "right",
            render: (o: AmmountPerFuelType) =>
                TextCell(
                    "$ " +
                    o.value.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    })
                )
        }
    ];
    const [modalOpened, setModalOpened] = useState(false);
    const [editing, setEditing] = useState<
        Partial<IInvestmentModel> | undefined
    >();
    const [pickADateOpened, setPickADateOpened] = useState(false);
    if (
        loading ||
        investmentTypesHook.loading ||
        quotesHook.loading ||
        fuelTypesHook.loading ||
        operationsHook.loading
    ) {
        return <LoaderComponent />;
    }


    const edit = (o: Partial<IInvestmentModel>) => {
        setEditing(o);
        setModalOpened(true);
    };
    const create = () => {
        setEditing(undefined);
        setModalOpened(true);
    };
    const totalInvestments = investments?.reduce(
        (a, c) =>
            a +
            (c.movementType === InvestmentMovementTypeEnum.Purchase ? 1 : -1) *
            c.quote.arsEquivalent *
            c.ammount,
        0
    );
    const operationsByProductType = fuelTypesHook.fuelTypes?.map(type => ({
        type: type,
        operations: operationsHook.operations?.filter(
            operation => operation.fuelTypeId === type.id
        ) ?? []
    }));
    const moneyOfOperationsByProductType: AmmountPerFuelType[] = operationsByProductType!.map(
        operation => ({
            id: operation.type.id,
            type: operation.type,
            litres: operation.operations?.reduce((p, n) => p + n.litres, 0),
            value: operation.operations?.reduce(
                (p, n) => p + n.litres * operation.type.currentPrice.price,
                0
            )
        })
    );
    const compromisedTotal: number = moneyOfOperationsByProductType.reduce(
        (a, c) => a + c.value,
        0
    );
    console.log("detail per fuel type ", moneyOfOperationsByProductType);

    return (
        <LayoutContentWrapper>
            <PageHeader>
                {"Litros Comprometidos por Tipo de Combustible"}


            </PageHeader>
            <Row style={{ ...rowStyle, textAlign: "right" }} gutter={0} justify="start">
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <DateButton onClick={() => setLimitDay(undefined)} type="primary">Sin Limite</DateButton>
                    <DateButton onClick={() => setLimitDay(moment().add(30, "days").startOf("day").toDate())} type="primary">30 Dias</DateButton>
                    <DateButton onClick={() => setLimitDay(moment().add(60, "days").startOf("day").toDate())} type="primary">60 Dias</DateButton>
                    <DateButton onClick={() => setLimitDay(moment().add(90, "days").startOf("day").toDate())} type="primary">90 Dias</DateButton>
                    <DateButton onClick={() => setPickADateOpened(true)} type="primary">Personalizado</DateButton>
                </Col>


            </Row>
            <Row style={rowStyle} gutter={0} justify="start">
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <IsoWidgetsWrapper>
                        <IsoWidgetBox>
                            <TableFooter
                                symbol="$"
                                paddingRight="5%"
                                label="Total Comprometido"
                                total={(compromisedTotal ?? 0)}
                            ></TableFooter>

                            <TableFooter
                                symbol="$"
                                paddingRight="5%"
                                label="Total Invertido"
                                total={(totalInvestments ?? 0)}

                            ></TableFooter>

                            <TableFooter
                                symbol=""
                                paddingRight="5%"
                                label="Diferencia"
                                total={
                                    (totalInvestments ?? 0) -
                                    compromisedTotal
                                }
                                textColor={
                                    (totalInvestments ?? 0) -
                                        compromisedTotal <
                                        0
                                        ? "red"
                                        : undefined
                                }
                                appendix={(totalInvestments ?? 0) -
                                    compromisedTotal <
                                    0
                                    ? "(Sin Cobertura)"
                                    : "(Cubierto)"}
                            ></TableFooter>
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>

            <Row style={rowStyle} gutter={0} justify="start">
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <IsoWidgetsWrapper>
                        <IsoWidgetBox>
                            <TableViews.SimpleView
                                tableInfo={{
                                    title: "Simple Table",
                                    value: "simple",
                                    columns: ammountPerFuelTypeColumns
                                }}
                                rowKey="id"
                                dataSource={moneyOfOperationsByProductType}
                                footer={() => (
                                    <TableFooter
                                        symbol="$"
                                        paddingRight={0}
                                        label="Total Comprometido"
                                        total={compromisedTotal}
                                    ></TableFooter>
                                )}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>
            <PageHeader>{"Inversiones"}</PageHeader>

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
                                        Nueva Inversión
                                    </ActionBtn>
                                </ButtonHolders>
                            </ButtonWrapper>

                            {/* TABLE */}
                            <TableViews.SimpleView
                                tableInfo={{
                                    title: "Simple Table",
                                    value: "simple",
                                    columns: investmentColumns
                                }}
                                rowKey="id"
                                dataSource={investments}

                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>
            <InvestmentsEdit
                investmentTypes={investmentTypesHook.investmentTypes!}
                quotes={quotesHook.quotes!}
                editing={editing}
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onFinished={() => setModalOpened(false)}
            />
            <PickADate
                opened={pickADateOpened}
                onClose={() => setPickADateOpened(false)}
                onFinished={(v) => { setLimitDay(v); setPickADateOpened(false) }}
            />
        </LayoutContentWrapper>
    );
};

export default Investments;
