import React, { useContext, useState } from "react";
import basicStyle from "../../assets/styles/constants";
import { SecurityContext } from "../../contexts/security.context";
import { TextCell } from "../../components/Tables/HelperCells";
import moment from "moment";
import { ActionWrapper } from "../Stations/Stations.styles";
import { Tooltip, Col, Row } from "antd";
import LoaderComponent from "../../components/utility/loader.style";
import IsoWidgetsWrapper from "../Widgets/WidgetsWrapper";
import IsoWidgetBox from "../Widgets/WidgetBox";
import { TableViews } from "../Tables/AntTables/AntTables";
import { LayoutContentWrapper } from "../../components/utility/layoutWrapper.style";
import PageHeader from "../../components/utility/pageHeader";
import Popconfirms from "../../components/Feedback/Popconfirm";
import useAcceptOrRejectTransferWithdrawal from "../../hooks/use-accept-or-reject-transfer.hook";
import { EnterTransferCode } from "./EnterTransferCode";
import useTransfers, { TransferWithdrawalRecord } from "../../hooks/use-transfer-withdrawals.hook";
import usePendingTransferWithdrawals, { PendingTransferWithdrawalRecord } from "../../hooks/use-pending-transfers.hook";
import useTransferWithdrawalSubscription from "../../hooks/use-transfer-withdrawal-subscription.hook";
import { constants } from "buffer";


const { rowStyle, colStyle } = basicStyle;

const styles = {
    widgetPageStyle: {
        display: "flex",
        flexFlow: "row wrap",
        alignItems: "flex-start",
        overflow: "hidden",
        width: "100%"
    }
};

export const accountTypeDict = {
    cbuAlias: "CBU/Alias",
    mercadopago: "Mercado Pago"
}

const PendingTransfers = ({
    onConfirmTransfer,
    onRejectTransfer,
    data
}: {
    onConfirmTransfer: (id: string) => void;
    onRejectTransfer: (id: string) => void;
    data: PendingTransferWithdrawalRecord[] | undefined;
}
) => {
    const pendingTransfersColumns = [
        {
            title: "Fecha",
            key: "stamp",
            render: (o: PendingTransferWithdrawalRecord) =>
                TextCell(
                    moment(o.withdrawal.stamp).format("DD/MM/YYYY HH:mm")
                )
        },
        {
            title: "Nombre Cliente",
            key: "customer",
            render: (o: PendingTransferWithdrawalRecord) =>
                TextCell(
                    o.withdrawal.wallet.customer.firstName +
                    " " +
                    o.withdrawal.wallet.customer.lastName
                )
        },
        {
            title: "Documento",
            key: "document",
            render: (o: PendingTransferWithdrawalRecord) =>
                TextCell(
                    o.withdrawal.wallet.customer.documentNumber
                )
        },
        {
            title: "CBU",
            key: "cbu",
            render: (o: PendingTransferWithdrawalRecord) =>
                TextCell(o.withdrawal.wallet.customer.cbu ?? "-")
        },
        {
            title: "Alias",
            key: "cbuAlias",
            render: (o: PendingTransferWithdrawalRecord) =>
                TextCell(o.withdrawal.wallet.customer.cbuAlias ?? "-")
        },
        {
            title: "Mercado Pago",
            key: "mercadopagoAccount",
            render: (o: PendingTransferWithdrawalRecord) =>
                TextCell(o.withdrawal.wallet.customer.mercadopagoAccount ?? "-")
        },
        {
            title: "Cuenta elegida",
            key: "accountType",
            render: (o: PendingTransferWithdrawalRecord) =>
                TextCell(
                    accountTypeDict[o.accountType]
                )
        },
        {
            title: "Importe",
            key: "price",
            align: "right",
            render: (o: PendingTransferWithdrawalRecord) =>
                TextCell(
                   "$ " + (o.withdrawal.litres * o.withdrawal.fuelPrice.price).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
                )
        },
        {
            title: "",
            key: "action",
            width: "5%",
            className: "noWrapCell",
            render: (o: PendingTransferWithdrawalRecord) => {
                return (
                    <ActionWrapper>
                        <Tooltip title="Aceptar">
                            <Popconfirms
                                title="¿Confirma que desea aceptar la transferencia?"
                                okText="Si"
                                cancelText="No"
                                placement="topRight"
                                onConfirm={() => onConfirmTransfer(o.id)}
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
                                title="¿Confirma que desea rechazar la transferencia?"
                                okText="Si"
                                cancelText="No"
                                placement="topRight"
                                onConfirm={() => onRejectTransfer(o.id)}
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

    return (
        <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
                <IsoWidgetBox>
                    {/* TABLE */}
                    <TableViews.SimpleView
                        tableInfo={{
                            title: "Simple Table",
                            value: "simple",
                            columns: pendingTransfersColumns
                        }}
                        rowKey="id"
                        dataSource={data}
                    />
                </IsoWidgetBox>
            </IsoWidgetsWrapper>
        </Col>
    );
};

const transfersColumns = [
    {
        title: "Número de transferencia",
        key: "code",
        render: (o: TransferWithdrawalRecord) => o.code ?
            TextCell(
                o.code
            )
        : TextCell("-")
    },
    {
        title: "Estado",
        key: "authorized",
        render: (o: TransferWithdrawalRecord) =>
            TextCell(
                o.authorized ? "Autorizada" : "Rechazada"
            )
    },
    {
        title: "Fecha",
        key: "stamp",
        render: (o: TransferWithdrawalRecord) =>
            TextCell(
                moment(o.stamp).format("DD/MM/YYYY HH:mm")
            )
    },
    {
        title: "Nombre Cliente",
        key: "customer",
        render: (o: TransferWithdrawalRecord) =>
            TextCell(
                o.withdrawal.wallet.customer.firstName +
                " " +
                o.withdrawal.wallet.customer.lastName
            )
    },
    {
        title: "Documento",
        key: "document",
        render: (o: TransferWithdrawalRecord) =>
            TextCell(
                o.withdrawal.wallet.customer.documentNumber
            )
    },
    {
        title: "CBU",
        key: "cbu",
        render: (o: TransferWithdrawalRecord) =>
            TextCell(o.withdrawal.wallet.customer.cbu ?? "-")
    },
    {
        title: "Alias",
        key: "cbuAlias",
        render: (o: TransferWithdrawalRecord) =>
            TextCell(o.withdrawal.wallet.customer.cbuAlias ?? "-")
    },
    {
        title: "Mercado Pago",
        key: "mercadopagoAccount",
        render: (o: TransferWithdrawalRecord) =>
            TextCell(o.withdrawal.wallet.customer.mercadopagoAccount ?? "-")
    },
    {
        title: "Cuenta elegida",
        key: "accountType",
        render: (o: TransferWithdrawalRecord) =>
            TextCell(
                accountTypeDict[o.accountType]
            )
    },
    {
        title: "Importe",
        key: "price",
        align: "right",
        render: (o: TransferWithdrawalRecord) =>
            TextCell(
               "$ " + (o.withdrawal.litres * o.withdrawal.fuelPrice.price).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })
            )
    }
];

const Transfers = () => {    
    const [enterTransferCodeOpened, setEnterTransferCodeOpened] = useState(false);
    const [acceptedTransferId, setAcceptedTransferId] = useState("");
    const { accept, reject } = useAcceptOrRejectTransferWithdrawal();
    const { transferWithdrawals, loading } = useTransfers();
    const { pendingTransferWithdrawals, loading: loadingPending } = usePendingTransferWithdrawals();
    const _ = useTransferWithdrawalSubscription();

    if (loading || loadingPending) return <LoaderComponent />;
    return (
        <LayoutContentWrapper>
            <div style={styles.widgetPageStyle}>
                <PageHeader>Transferencias Pendientes</PageHeader>
                <Row style={rowStyle} gutter={0} justify="start">
                    <PendingTransfers 
                        onConfirmTransfer={(transferId) => {setEnterTransferCodeOpened(true); setAcceptedTransferId(transferId)}}
                        onRejectTransfer={(transferId) => reject(transferId)}
                        data={pendingTransferWithdrawals}
                    />
                </Row>

                <PageHeader>{"Transferencias"}</PageHeader>
                <Row style={rowStyle} gutter={0} justify="start">
                    <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                        <IsoWidgetsWrapper>
                            <IsoWidgetBox>
                                {/* TABLE */}
                                <TableViews.SimpleView
                                    tableInfo={{
                                        title: "Simple Table",
                                        value: "simple",
                                        columns: transfersColumns
                                    }}
                                    rowKey="id"
                                    dataSource={transferWithdrawals}
                                />
                            </IsoWidgetBox>
                        </IsoWidgetsWrapper>
                    </Col>
                </Row>
                <EnterTransferCode
                    opened={enterTransferCodeOpened}
                    onClose={() => setEnterTransferCodeOpened(false)}
                    onFinished={(v) => { console.log("NUMERO ", v); accept(acceptedTransferId, v); setEnterTransferCodeOpened(false) }}
                />
            </div>
        </LayoutContentWrapper>
    );
};

export default Transfers;
