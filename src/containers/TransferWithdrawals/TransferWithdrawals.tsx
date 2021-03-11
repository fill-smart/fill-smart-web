import React, { useContext, useState } from "react";
import basicStyle from "../../assets/styles/constants";
import { TextCell } from "../../components/Tables/HelperCells";
import moment from "moment";
import {
  ActionWrapper,
  ButtonWrapper,
  ButtonHolders,
  ActionBtn,
} from "../Stations/Stations.styles";
import { Tooltip, Col, Row } from "antd";
import LoaderComponent from "../../components/utility/loader.style";
import IsoWidgetsWrapper from "../Widgets/WidgetsWrapper";
import IsoWidgetBox from "../Widgets/WidgetBox";
import { LayoutContentWrapper } from "../../components/utility/layoutWrapper.style";
import PageHeader from "../../components/utility/pageHeader";
import Popconfirms from "../../components/Feedback/Popconfirm";
import useAcceptOrRejectTransferWithdrawal, {
  IConfirTransactionModel,
} from "../../hooks/use-accept-or-reject-transfer.hook";
import { EnterTransferCode } from "./EnterTransferCode";
import useTransferWithdrawals, {
  TransferWithdrawalRecord,
} from "../../hooks/use-transfer-withdrawals.hook";
import usePendingTransferWithdrawals, {
  PendingTransferWithdrawalRecord,
} from "../../hooks/use-pending-transfers.hook";
import useTransferWithdrawalSubscription from "../../hooks/use-transfer-withdrawal-subscription.hook";
import FileSaver from "file-saver";
import Excel from "exceljs";
import { QueryCriteria, FilteredTable } from "../../core/FilteredTable";
import { IAndFilterCriteria, FilterTypesEnum } from "../../core/filters";
import { DateFilter } from "../../components/Tables/Filters";

const { rowStyle, colStyle } = basicStyle;

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "flex-start",
    overflow: "hidden",
    width: "100%",
  },
};

export const accountTypeDict = {
  cbuAlias: "CBU/Alias",
  mercadopago: "Mercado Pago",
};

const Transfers = () => {
  const onConfirmTransfer = (transferId) => {
    setEnterTransferCodeOpened(true);
    setAcceptedTransferId(transferId);
  };
  const [enterTransferCodeOpened, setEnterTransferCodeOpened] = useState(false);
  const [acceptedTransferId, setAcceptedTransferId] = useState("");
  const { accept, reject } = useAcceptOrRejectTransferWithdrawal(() => {
    refetchPending();
    refetchTransfers();
  });
  const [
    tableCriteriaTransferWithdrawals,
    setTableCriteriaTransferWithdrawals,
  ] = useState<QueryCriteria>({
    pagination: { current: 1, pageSize: 10 },
    sort: [],
    filter: undefined,
  });
  const {
    transferWithdrawals,
    loading: loadingTransfers,
    refetch: refetchTransfers,
    total: totalTransfer,
  } = useTransferWithdrawals(tableCriteriaTransferWithdrawals);

  const [
    tableCriteriaPendingWithdrawals,
    setTableCriteriaPendingWithdrawals,
  ] = useState<QueryCriteria>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    sort: [],
    filter: undefined,
  });
  const {
    pendingTransferWithdrawals,
    loading: loadingPending,
    refetch: refetchPending,
    total: totalPending,
  } = usePendingTransferWithdrawals(tableCriteriaPendingWithdrawals);

  const _ = useTransferWithdrawalSubscription({
    transferWithDrawalNotify: () => {
      refetchPending();
      refetchTransfers();
    },
  });

  const generateExcel = async () => {
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("Clientes");

    sheet.columns = [
      { header: "Número de transferencia", key: "code" },
      { header: "Estado", key: "authorized" },
      { header: "Fecha", key: "stamp" },
      { header: "Nombre", key: "customer" },
      { header: "Documento", key: "document" },
      { header: "CBU", key: "cbu" },
      { header: "Alias", key: "cbuAlias" },
      { header: "Mercado Pago", key: "mercadopagoAccount" },
      { header: "Cuenta elegida", key: "accountType" },
      { header: "Importe", key: "price" },
    ];

    sheet.addRows(
      transferWithdrawals!.map((o) => [
        o.code ?? "-",
        o.authorized ? "Autorizada" : "Rechazada",
        moment(o.stamp).format("DD/MM/YYYY HH:mm"),
        o.withdrawal.wallet.customer.firstName +
          " " +
          o.withdrawal.wallet.customer.lastName,
        o.withdrawal.wallet.customer.documentNumber,
        o.withdrawal.wallet.customer.cbu ?? "-",
        o.withdrawal.wallet.customer.cbuAlias ?? "-",
        o.withdrawal.wallet.customer.mercadopagoAccount ?? "-",
        accountTypeDict[o.accountType],
        "$ " +
          (o.withdrawal.litres * o.withdrawal.fuelPrice.price).toLocaleString(
            undefined,
            {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }
          ),
      ])
    );

    sheet.columns.forEach(function (column) {
      var dataMax = 0;
      column.eachCell!(function (cell) {
        if (cell.value) {
          var columnLength = cell.value.toString().length;
          if (columnLength > dataMax) {
            dataMax = columnLength;
          }
        }
      });
      column.width = dataMax + 5;
    });

    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    await workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: fileType });
      FileSaver.saveAs(
        blob,
        "fillsmart_transferencias_" + moment().format("DD-MM-YYYY") + ".xlsx"
      );
    });
  };

  const pendingTransfersColumns = [
    {
      title: "Fecha de Registro",
      key: "stamp",
      render: (o: PendingTransferWithdrawalRecord) =>
        TextCell(moment(o.withdrawal.stamp).format("DD/MM/YYYY HH:mm")),
      filterDropdown: DateFilter,
      sorter: true,
    },
    {
      title: "Nombre Cliente",
      key: "customer",
      render: (o: PendingTransferWithdrawalRecord) =>
        TextCell(
          o.withdrawal.wallet.customer.firstName +
            " " +
            o.withdrawal.wallet.customer.lastName
        ),
    },
    {
      title: "Documento",
      key: "document",
      render: (o: PendingTransferWithdrawalRecord) =>
        TextCell(o.withdrawal.wallet.customer.documentNumber),
    },
    {
      title: "CBU",
      key: "cbu",
      render: (o: PendingTransferWithdrawalRecord) =>
        TextCell(o.withdrawal.wallet.customer.cbu ?? "-"),
    },
    {
      title: "Alias",
      key: "cbuAlias",
      render: (o: PendingTransferWithdrawalRecord) =>
        TextCell(o.withdrawal.wallet.customer.cbuAlias ?? "-"),
    },
    {
      title: "Mercado Pago",
      key: "mercadopagoAccount",
      render: (o: PendingTransferWithdrawalRecord) =>
        TextCell(o.withdrawal.wallet.customer.mercadopagoAccount ?? "-"),
    },
    {
      title: "Cuenta elegida",
      key: "accountType",
      render: (o: PendingTransferWithdrawalRecord) =>
        TextCell(accountTypeDict[o.accountType]),
    },
    {
      title: "Importe",
      key: "price",
      align: "right",
      render: (o: PendingTransferWithdrawalRecord) =>
        TextCell(
          "$ " +
            (o.withdrawal.litres * o.withdrawal.fuelPrice.price).toLocaleString(
              undefined,
              {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              }
            )
        ),
    },
    {
      title: "",
      key: "action",
      fixed: "right",
      width: 100,
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
      },
    },
  ];

  const transfersColumns = [
    {
      title: "Fecha de Registro",
      key: "stamp",
      render: (o: TransferWithdrawalRecord) =>
        TextCell(moment(o.stamp).format("DD/MM/YYYY HH:mm")),
      filterDropdown: DateFilter,
      sorter: true,
    },
    {
      title: "Número de transferencia",
      key: "code",
      render: (o: TransferWithdrawalRecord) =>
        o.code ? TextCell(o.code) : TextCell("-"),
    },
    {
      title: "Estado",
      key: "authorized",
      render: (o: TransferWithdrawalRecord) =>
        TextCell(o.authorized ? "Autorizada" : "Rechazada"),
    },
    {
      title: "Nombre",
      key: "customer",
      render: (o: TransferWithdrawalRecord) =>
        TextCell(
          o.withdrawal.wallet.customer.firstName +
            " " +
            o.withdrawal.wallet.customer.lastName
        ),
    },
    {
      title: "Documento",
      key: "document",
      render: (o: TransferWithdrawalRecord) =>
        TextCell(o.withdrawal.wallet.customer.documentNumber),
    },
    {
      title: "CBU",
      key: "cbu",
      render: (o: TransferWithdrawalRecord) =>
        TextCell(o.withdrawal.wallet.customer.cbu ?? "-"),
    },
    {
      title: "Alias",
      key: "cbuAlias",
      render: (o: TransferWithdrawalRecord) =>
        TextCell(o.withdrawal.wallet.customer.cbuAlias ?? "-"),
    },
    {
      title: "Mercado Pago",
      key: "mercadopagoAccount",
      render: (o: TransferWithdrawalRecord) =>
        TextCell(o.withdrawal.wallet.customer.mercadopagoAccount ?? "-"),
    },
    {
      title: "Cuenta elegida",
      key: "accountType",
      render: (o: TransferWithdrawalRecord) =>
        TextCell(accountTypeDict[o.accountType]),
    },
    {
      title: "Importe",
      key: "price",
      align: "right",
      render: (o: TransferWithdrawalRecord) =>
        TextCell(
          "$ " +
            (o.withdrawal.litres * o.withdrawal.fuelPrice.price).toLocaleString(
              undefined,
              {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              }
            )
        ),
    },
  ];

  return (
    <LayoutContentWrapper>
      <div style={styles.widgetPageStyle}>
        <PageHeader>Transferencias Pendientes</PageHeader>
        <Row style={rowStyle} gutter={0} justify="start">
          <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <IsoWidgetBox>
                <FilteredTable
                  columns={pendingTransfersColumns}
                  dataSource={pendingTransferWithdrawals}
                  loading={loadingPending}
                  pagination={{
                    ...tableCriteriaPendingWithdrawals.pagination,
                    ...{ total: totalPending },
                  }}
                  onCriteriaChange={setTableCriteriaPendingWithdrawals}
                  otherFilters={undefined}
                />
              </IsoWidgetBox>
            </IsoWidgetsWrapper>
          </Col>
        </Row>

        <PageHeader>Transferencias</PageHeader>
        <Row style={rowStyle} gutter={0} justify="start">
          <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
            <IsoWidgetsWrapper>
              <IsoWidgetBox>
                <ButtonWrapper>
                  <div></div>
                  <ButtonHolders>
                    <ActionBtn type="primary" onClick={generateExcel}>
                      Descargar planilla
                    </ActionBtn>
                  </ButtonHolders>
                </ButtonWrapper>
                <FilteredTable
                  columns={transfersColumns}
                  dataSource={transferWithdrawals}
                  loading={loadingTransfers}
                  pagination={{
                    ...tableCriteriaTransferWithdrawals.pagination,
                    ...{ totalTransfer },
                  }}
                  onCriteriaChange={(criteria) => {
                    setTableCriteriaTransferWithdrawals(criteria);
                  }}
                  otherFilters={undefined}
                />
              </IsoWidgetBox>
            </IsoWidgetsWrapper>
          </Col>
        </Row>
        <EnterTransferCode
          opened={enterTransferCodeOpened}
          onClose={() => setEnterTransferCodeOpened(false)}
          onFinished={(v: IConfirTransactionModel) => {
            accept(
              acceptedTransferId,
              v.code,
              v.voucher.fileList.map((f) => f.originFileObj)
            );
            setEnterTransferCodeOpened(false);
          }}
        />
      </div>
    </LayoutContentWrapper>
  );
};

export default Transfers;
