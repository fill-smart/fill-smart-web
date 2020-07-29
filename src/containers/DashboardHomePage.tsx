import React, { useContext, useState } from "react";
import LayoutContentWrapper from "../components/utility/layoutWrapper";
import { Row, Col, Tooltip } from "antd";
import basicStyle from "../assets/styles/constants";
import IsoWidgetsWrapper from "./Widgets/WidgetsWrapper";
import IsoWidgetBox from "./Widgets/WidgetBox";
import { TableViews } from "./Tables/AntTables/AntTables";
import PageHeader from "../components/utility/pageHeader";
import { TextCell } from "../components/Tables/HelperCells";
import ReportsWidget from "./Widgets/Report/ReportWidget";
import SingleProgressWidget from "./Widget/Widgets/Progress/ProgressSingle";
import SaleWidget from "./Widget/Widgets/Sale/SaleWidget";
import { SecurityContext, RolesEnum } from "../contexts/security.context";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
import { IOperationModel } from "../interfaces/models/operation.model";
import { ICustomerModel } from "../interfaces/models/customer.model";
import { IFuelTypeModel } from "../interfaces/models/fuel-type.model";
import { IPumpModel } from "../interfaces/models/pump.model";
import { IFuelPriceModel } from "../interfaces/models/fuel-price.model";
import { DateUtils } from "@silentium-apps/fill-smart-common";
import StickerWidget from "./Widgets/Sticker/StickerWidget";
import useCustomers from "../hooks/use-customers.hook";
import useWallets from "../hooks/use-wallets.hook";
import Chart from "react-google-charts";
import useFuelTypes from "../hooks/use-fuel-types.hook";
import LoaderComponent from "../components/utility/loader.style";
import usePendingAuthorizations, {
    IPendingAuthorization
} from "../hooks/use-pending-authorizations.hook";
import { ActionWrapper } from "./Stations/Stations.styles";
import Popconfirms from "../components/Feedback/Popconfirm";
import useAuthorizeOrReject from "../hooks/use-authorize-or-reject.hook";
import useAuthorizationRequest from "../hooks/use-authorization-request.hook";
import CustomerDocument from "./Customers/CustomerDocument";
import Investments from "./Investments/Investments";
import useOperations from "../hooks/use-operations.hook";
const { rowStyle, colStyle } = basicStyle;

const styles = {
    wisgetPageStyle: {
        display: "flex",
        flexFlow: "row wrap",
        alignItems: "flex-start",
        overflow: "hidden",
        width: "100%"
    }
};

/*GQL Daily Operations */
type CustomerViewModel = Pick<ICustomerModel, "firstName" | "lastName">;

type WalletViewModel = { customer: CustomerViewModel };

type FuelTypeViewModel = Pick<IFuelTypeModel, "name">;

type FuelPriceViewModel = Pick<IFuelPriceModel, "price">;

type PumpViewModel = Pick<IPumpModel, "externalId">;

type OperationViewModel = Pick<IOperationModel, "stamp" | "id" | "litres"> & {
    wallet: WalletViewModel;
    fuelType: FuelTypeViewModel;
    pump: PumpViewModel;
    fuelPrice: FuelPriceViewModel;
};
interface IOperationsResult {
    result: OperationViewModel[];
}

const LIST_TODAY_OPERATIONS_QUERY = gql`
    query listDailyOperations($filter: String!, $sort: String!) {
        refuels(criteria: { filter: $filter, sort: $sort }) {
            result {
                id
                stamp
                fuelType {
                    name
                }
                pump {
                    externalId
                }
                fuelPrice {
                    price
                }
                stamp
                litres
                wallet {
                    customer {
                        firstName
                        lastName
                    }
                }
            }
        }
    }
`;

const SIGNLE_PROGRESS_WIDGET = [
    {
        label: "Nafta Super",
        percent: 45,
        barHeight: 7,
        status: "active",
        info: true
    },
    {
        label: "Nafta Premium",
        percent: 23,
        barHeight: 7,
        status: "active",
        info: true
    },
    {
        label: "Diesel",
        percent: 12,
        barHeight: 7,
        status: "active",
        info: true
    },
    {
        label: "Diesel Premium",
        percent: 10,
        barHeight: 7,
        status: "active",
        info: true
    }
];

const totalSales = (
    <Row style={rowStyle} gutter={0} justify="start">
        <IsoWidgetsWrapper>
            {/* Sale Widget */}
            <SaleWidget
                label="Total de Operaciones"
                price="15.715.772,05"
                details="Operaciones de compra realizadas por los usuarios en efectivo o a traves de mercadopago"
                fontColor="#F75D81"
            />
        </IsoWidgetsWrapper>
    </Row>
);

const DashboardHomePage = () => {
    const [security, _] = useContext(SecurityContext);

    const role = security.user!.roles[0].name;
    console.log("role: ", role);
    switch (role) {
        case RolesEnum.Admin:
            return <AdminHome />;
        case RolesEnum.Seller:
            return <GasStationSellerHome />;
        case RolesEnum.CoverageOperator:
            return <Investments />;
        case RolesEnum.GasStationAdmin:
        default:
            return <GasStationAdminHome />;
    }
};
const PendingAuthorizations = ({
    onShowDniClick
}: {
    onShowDniClick: (c: CustomerViewModel) => void;
}) => {
    const { authorize, reject } = useAuthorizeOrReject();
    const { authorizations, loading } = usePendingAuthorizations();
    const _ = useAuthorizationRequest();

    const authorizationsColumns = [
        {
            title: "Tipo de Operacion",
            key: "operationType",
            render: (o: IPendingAuthorization) =>
                TextCell(
                    o.refuel
                        ? "Carga"
                        : o.cashWithdrawal
                            ? "Extraccion de Efectivo"
                            : o.shopPurchase
                                ? "Compra en Shop"
                                : o.purchase
                                    ? "Compra en Efectivo"
                                    : "."
                )
        },
        {
            title: "Fecha",
            key: "stamp",
            render: (o: IPendingAuthorization) =>
                TextCell(
                    o.stamp
                        ? moment(o.stamp)
                            .locale("ES-us")
                            .format("DD [de] MMM HH:mm:ss")
                        : "-"
                )
        },
        {
            title: "Nombre Cliente",
            key: "customer",
            render: (o: IPendingAuthorization) =>
                TextCell(
                    o.refuel
                        ? o.refuel.wallet.customer.firstName +
                        " " +
                        o.refuel.wallet.customer.lastName
                        : o.cashWithdrawal
                            ? o.cashWithdrawal.wallet.customer.firstName +
                            " " +
                            o.cashWithdrawal.wallet.customer.lastName
                            : o.purchase
                                ? o.purchase.wallet.customer.firstName +
                                " " +
                                o.purchase.wallet.customer.lastName
                                : o.shopPurchase.wallet.customer.firstName +
                                " " +
                                o.shopPurchase.wallet.customer.lastName
                )
        },
        {
            title: "Documento",
            key: "document",
            render: (o: IPendingAuthorization) =>
                TextCell(
                    o.refuel
                        ? o.refuel.wallet.customer.documentNumber
                        : o.cashWithdrawal
                            ? o.cashWithdrawal.wallet.customer.documentNumber
                            : o.purchase
                                ? o.purchase.wallet.customer.documentNumber
                                : o.shopPurchase.wallet.customer.documentNumber
                )
        },
        {
            title: "Surtidor",
            key: "pump",
            render: (o: IPendingAuthorization) =>
                TextCell(o.refuel ? o.refuel.pump.externalId : "-")
        },
        {
            title: "Importe/Litros",
            key: "price",
            align: "right",
            render: (o: IPendingAuthorization) =>
                TextCell(
                    o.refuel
                        ? `lts. ${o.refuel.litres.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2
                        })} (${o.refuel.fuelType.name})`
                        : o.cashWithdrawal
                            ? `$ ${(
                                o.cashWithdrawal.fuelPrice.price *
                                o.cashWithdrawal.litres
                            ).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2
                            })}`
                            : o.purchase
                                ? `$ ${(
                                    o.purchase.fuelPrice.price * o.purchase.litres
                                ).toLocaleString(undefined, {
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 2
                                })}`
                                : `$ ${(
                                    o.shopPurchase.fuelPrice.price *
                                    o.shopPurchase.litres
                                ).toLocaleString(undefined, {
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 2
                                })}`
                )
        },
        {
            title: "",
            key: "action",
            width: "5%",
            className: "noWrapCell",
            render: (o: IPendingAuthorization) => {
                return (
                    <ActionWrapper>
                        <Tooltip title="Ver Documento">
                            <a
                                onClick={() =>
                                    onShowDniClick(
                                        o.refuel
                                            ? o.refuel.wallet.customer
                                            : o.cashWithdrawal
                                                ? o.cashWithdrawal.wallet.customer
                                                : o.purchase
                                                    ? o.purchase.wallet.customer
                                                    : o.shopPurchase.wallet.customer
                                    )
                                }
                                href="# "
                            >
                                <i className="ion-eye" />
                            </a>
                        </Tooltip>
                        <Tooltip title="Autorizar">
                            <Popconfirms
                                title="¿Confirma que verifico el DNI del cliente?"
                                okText="Si"
                                cancelText="No"
                                placement="topRight"
                                onConfirm={() => authorize(o.id)}
                            >
                                <a className="deleteBtn" href="# ">
                                    <i
                                        className="ion-android-checkbox"
                                        style={{ color: "#15b06e" }}
                                    />
                                </a>
                            </Popconfirms>
                        </Tooltip>
                        <Tooltip title="Denegar">
                            <Popconfirms
                                title="¿Confirma que desea rechazar el pedido de autorizacion?"
                                okText="Si"
                                cancelText="No"
                                placement="topRight"
                                onConfirm={() => reject(o.id)}
                            >
                                <a className="deleteBtn" href="# ">
                                    <i
                                        className="ion-android-delete"
                                        style={{ color: "#f75d81" }}
                                    />
                                </a>
                            </Popconfirms>
                        </Tooltip>
                    </ActionWrapper>
                );
            }
        }
    ];

    if (loading) return <LoaderComponent />;
    return (
        <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
                <IsoWidgetBox>
                    {/* TABLE */}
                    <TableViews.SimpleView
                        tableInfo={{
                            title: "Simple Table",
                            value: "simple",
                            columns: authorizationsColumns
                        }}
                        rowKey="id"
                        dataSource={authorizations}
                    />
                </IsoWidgetBox>
            </IsoWidgetsWrapper>
        </Col>
    );
};

export const GasStationAdminHome = () => {
    const operationsHook = useOperations();
    const fuelTypesHook = useFuelTypes();

    if (operationsHook.loading || fuelTypesHook.loading) {
        return <LoaderComponent />;
    }
    const widgetsData: {
        key: string;
        value: string;
        icon: string;
        bgColor: string;
    }[] = [
            {
                key: "Operaciones",
                value: (operationsHook.operations?.length ?? 0).toString(),
                icon: "ion-android-cart",
                bgColor: "#7266BA"
            }
        ];
    console.log("OPERACIONES", operationsHook.operations)
    const operationsByType = [
        {
            id: 1,
            name: "Recarga de Combustible"
        },
        {
            id: 2,
            name: "Compra de Combustible"
        },
        {
            id: 3,
            name: "Compra en Shop"
        },
        {
            id: 4,
            name: "Retiro de Efectivo"
        }
    ].map(type => ({
        type: type,
        operations: operationsHook.operations?.filter(
            operation => operation.operationTypeId === type.id
        )
    }));

    const operationsByProductType = fuelTypesHook.fuelTypes?.map(type => ({
        type: type,
        operations: operationsHook.operations?.filter(
            operation => operation.fuelTypeId === Number(type.id)
        )
    }));
    console.log("BY PRODUCT TYPE", operationsByProductType)

    const ammountOfOperationsByType = operationsByType?.map(operation => ({
        type: operation.type,
        ammount: operation.operations?.length
    }));

    const litresOfOperationsByProductType = operationsByProductType?.map(
        operation => ({
            type: operation.type,
            litres: operation.operations?.reduce((p, n) => p + n.litres, 0)
        })
    );

    if (!ammountOfOperationsByType) {
        return <div>Error</div>;
    }

    if (!litresOfOperationsByProductType) {
        return <div>Error</div>;
    }

    const colors = ["#48A6F2", "#f64744", "#ffbf00", "#66d0a5", "#8f5c53"];
    const width = "100%";
    const height = "400px";
    const OperationsByTypeBarChart = {
        title: "BarChart",
        key: "BarChart",
        chartType: "Bar",
        width,
        height,
        data: [
            [
                "Operaciones Realizadas por Tipo",
                "Cantidad de Operaciones",
                {
                    role: "style"
                }
            ],
            ...ammountOfOperationsByType.map((g, index) => [
                g.type.name,
                g.ammount,
                `fill-color: ${colors[index]}; fill-opacity: 0.4`
            ])
        ],
        options: {
            title: "Operaciones Realizadas por Tipo",
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
                label: "Tipo de Operacion",
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

    const OperationsByFuelTypeBarChart = {
        title: "BarChart",
        key: "BarChart",
        chartType: "Bar",
        width,
        height,
        data: [
            [
                "Operaciones Expresadas en litros por Tipo de Producto",
                "Litros",
                {
                    role: "style"
                }
            ],
            ...litresOfOperationsByProductType.map((g, index) => [
                g.type.name,
                g.litres,
                `fill-color: ${colors[index]}; fill-opacity: 0.4`
            ])
        ],
        options: {
            title: "Operaciones Expresadas en litros por Tipo de Producto",
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
                label: "Tipo de Combustible",
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
            <div style={styles.wisgetPageStyle}>
                <Row style={rowStyle} gutter={0} justify="start">
                    <Row style={rowStyle} gutter={0} justify="start">
                        {widgetsData.map((widget, idx) => (
                            <Col
                                lg={8}
                                md={24}
                                sm={24}
                                xs={24}
                                style={colStyle}
                                key={idx}
                            >
                                <IsoWidgetsWrapper>
                                    {/* Sticker Widget */}
                                    <StickerWidget
                                        number={widget.value}
                                        text={widget.key}
                                        icon={widget.icon}
                                        fontColor="white"
                                        bgColor={widget.bgColor}
                                    />
                                </IsoWidgetsWrapper>
                            </Col>
                        ))}
                    </Row>
                </Row>
                <Row style={rowStyle} gutter={0} justify="start">
                    <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <IsoWidgetBox
                                height={"450"}
                                style={{ overflow: "hidden" }}
                            >
                                {/* Google Bar Chart */}
                                <Chart
                                    {...OperationsByTypeBarChart}
                                    chartType="BarChart"
                                    chartEvents={chartEvents as any}
                                />
                            </IsoWidgetBox>
                        </IsoWidgetsWrapper>
                    </Col>
                </Row>
                <Row style={rowStyle} gutter={0} justify="start">
                    <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <IsoWidgetBox
                                height={"450"}
                                style={{ overflow: "hidden" }}
                            >
                                {/* Google Bar Chart */}
                                <Chart
                                    {...OperationsByFuelTypeBarChart}
                                    chartType="BarChart"
                                    chartEvents={chartEvents as any}
                                />
                            </IsoWidgetBox>
                        </IsoWidgetsWrapper>
                    </Col>
                </Row>
            </div>
        </LayoutContentWrapper>
    );
};

export const GasStationSellerHome = () => {
    const [showingDniCustomer, setShowingDniCustomer] = useState<
        CustomerViewModel | undefined
    >();

    const [modalDocumentOpened, setModalDocumentOpened] = useState(false);
    const showDocument = (c: CustomerViewModel) => {
        console.log("customer:", c);
        setModalDocumentOpened(true);
        setShowingDniCustomer(c);
        console.log(modalDocumentOpened, showingDniCustomer);
    };

    return (
        <LayoutContentWrapper>
            <CustomerDocument
                opened={modalDocumentOpened}
                customer={showingDniCustomer}
                onClose={() => setModalDocumentOpened(false)}
            />
            <div style={styles.wisgetPageStyle}>
                <PageHeader>Autorizaciones Pendientes</PageHeader>
                <Row style={rowStyle} gutter={0} justify="start">
                    {/*progressContent*/}
                    <PendingAuthorizations
                        onShowDniClick={c => showDocument(c)}
                    />
                </Row>
            </div>
        </LayoutContentWrapper>
    );
};

export const AdminHome = () => {
    const operationsHook = useOperations();
    const customersHook = useCustomers();
    const walletsHook = useWallets();
    const fuelTypesHook = useFuelTypes();
    if (
        operationsHook.loading ||
        customersHook.loading ||
        walletsHook.loading
    ) {
        return <LoaderComponent />;
    }
    const widgetsData: {
        key: string;
        value: string;
        icon: string;
        bgColor: string;
    }[] = [
            {
                key: "Operaciones",
                value: (operationsHook.operations?.length ?? 0).toString(),
                icon: "ion-android-cart",
                bgColor: "#7266BA"
            },
            {
                key: "Clientes Registrados",
                value: (customersHook.customers?.length as number).toString(),
                icon: "ion-android-phone-portrait",
                bgColor: "#42A5F6"
            },
            {
                key: "Litros en Billeteras",
                value: Math.floor(
                    walletsHook.wallets?.reduce((p, n) => p + n.litres, 0) as number
                ).toString(),
                icon: "ion-battery-half",
                bgColor: "#7ED320"
            }
        ];

    const operationsByType = [
        {
            id: 1,
            name: "Recarga de Combustible"
        },
        {
            id: 2,
            name: "Compra de Combustible"
        },
        {
            id: 3,
            name: "Compra en Shop"
        },
        {
            id: 4,
            name: "Retiro de Efectivo"
        }
    ].map(type => ({
        type: type,
        operations: operationsHook.operations?.filter(
            operation => operation.operationTypeId === type.id
        )
    }));
    console.log("ALL", operationsHook.operations)
    console.log("BY TYPE", operationsByType)

    const walletsByFuelType = fuelTypesHook.fuelTypes?.map(fuelType => ({
        fuelType,
        wallets: walletsHook.wallets?.filter(
            wallet => wallet.fuelType.id === fuelType.id
        )
    }));
    const ammountOfOperationsByType = operationsByType?.map(operation => ({
        type: operation.type,
        ammount: operation.operations?.length
    }));
    const litresByType = walletsByFuelType?.map(fuelType => ({
        fuelType: fuelType.fuelType,
        litres: fuelType.wallets?.reduce((p, n) => p + n.litres, 0)
    }));
    const operationsByProductType = fuelTypesHook.fuelTypes?.map(type => ({
        type: type,
        operations: operationsHook.operations?.filter(
            operation => operation.fuelTypeId === Number(type.id)
        )
    }));
    console.log("BY PRODUCT TYPE", operationsByProductType)
    const litresOfOperationsByProductType = operationsByProductType?.map(
        operation => ({
            type: operation.type,
            litres: operation.operations?.reduce((p, n) => p + n.litres, 0)
        })
    );
    if (
        !ammountOfOperationsByType ||
        !litresByType ||
        !litresOfOperationsByProductType
    ) {
        return <div>Error</div>;
    }

    const colors = ["#48A6F2", "#f64744", "#ffbf00", "#66d0a5", "#8f5c53"];
    const width = "100%";
    const height = "400px";
    const OperationsByTypeBarChart = {
        title: "BarChart",
        key: "BarChart",
        chartType: "Bar",
        width,
        height,
        data: [
            [
                "Operaciones Realizadas por Tipo",
                "Cantidad de Operaciones",
                {
                    role: "style"
                }
            ],
            ...ammountOfOperationsByType.map((g, index) => [
                g.type.name,
                g.ammount,
                `fill-color: ${colors[index]}; fill-opacity: 0.4`
            ])
        ],
        options: {
            title: "Operaciones Realizadas por Tipo",
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
                label: "Tipo de Operacion",
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

    const OperationsByFuelTypeBarChart = {
        title: "BarChart",
        key: "BarChart",
        chartType: "Bar",
        width,
        height,
        data: [
            [
                "Saldos por Tipo de Combustible",
                "Cantidad en Litros",
                {
                    role: "style"
                }
            ],
            ...litresByType.map((g, index) => [
                g.fuelType.name,
                g.litres,
                `fill-color: ${colors[index]}; fill-opacity: 0.4`
            ])
        ],
        options: {
            title: "Litros comprometidos por tipo de combustible",
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
                label: "Tipo de Combustible",
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

    const OperationsInLitresByFuelTypeBarChart = {
        title: "BarChart",
        key: "BarChart",
        chartType: "Bar",
        width,
        height,
        data: [
            [
                "Operaciones Expresadas en litros por Tipo de Producto",
                "Litros",
                {
                    role: "style"
                }
            ],
            ...litresOfOperationsByProductType.map((g, index) => [
                g.type.name,
                g.litres,
                `fill-color: ${colors[index]}; fill-opacity: 0.4`
            ])
        ],
        options: {
            title: "Operaciones Expresadas en litros por Tipo de Producto",
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
                label: "Tipo de Combustible",
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
            <div style={styles.wisgetPageStyle}>
                <Row style={rowStyle} gutter={0} justify="start">
                    <Row style={rowStyle} gutter={0} justify="start">
                        {widgetsData.map((widget, idx) => (
                            <Col
                                lg={8}
                                md={24}
                                sm={24}
                                xs={24}
                                style={colStyle}
                                key={idx}
                            >
                                <IsoWidgetsWrapper>
                                    {/* Sticker Widget */}
                                    <StickerWidget
                                        number={widget.value}
                                        text={widget.key}
                                        icon={widget.icon}
                                        fontColor="white"
                                        bgColor={widget.bgColor}
                                    />
                                </IsoWidgetsWrapper>
                            </Col>
                        ))}
                    </Row>
                </Row>
                <Row style={rowStyle} gutter={0} justify="start">
                    <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <IsoWidgetBox
                                height={"450"}
                                style={{ overflow: "hidden" }}
                            >
                                {/* Google Bar Chart */}
                                <Chart
                                    {...OperationsByTypeBarChart}
                                    chartType="BarChart"
                                    chartEvents={chartEvents as any}
                                />
                            </IsoWidgetBox>
                        </IsoWidgetsWrapper>
                    </Col>
                </Row>
                <Row style={rowStyle} gutter={0} justify="start">
                    <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <IsoWidgetBox
                                height={"450"}
                                style={{ overflow: "hidden" }}
                            >
                                {/* Google Bar Chart */}
                                <Chart
                                    {...OperationsByFuelTypeBarChart}
                                    chartType="BarChart"
                                    chartEvents={chartEvents as any}
                                />
                            </IsoWidgetBox>
                        </IsoWidgetsWrapper>
                    </Col>
                </Row>
                <Row style={rowStyle} gutter={0} justify="start">
                    <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <IsoWidgetBox
                                height={"450"}
                                style={{ overflow: "hidden" }}
                            >
                                {/* Google Bar Chart */}
                                <Chart
                                    {...OperationsInLitresByFuelTypeBarChart}
                                    chartType="BarChart"
                                    chartEvents={chartEvents as any}
                                />
                            </IsoWidgetBox>
                        </IsoWidgetsWrapper>
                    </Col>
                </Row>
            </div>
        </LayoutContentWrapper>
    );
};

export default DashboardHomePage;
