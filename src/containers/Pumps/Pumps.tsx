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
} from "./Pumps.styles";
import Popconfirms from "../../components/Feedback/Popconfirm";
import Loader from "../../components/utility/loader";
import { useParams, useHistory } from "react-router-dom";
import { PumpHooks } from "../../hooks/pumps.hooks";
import moment from "moment";
import { IPumpModel } from "../../interfaces/models/pump.model";
import { PumpEdit } from "./PumpsEdit";
import QRCode from "qrcode";
import BackButton from "../../components/uielements/BackButton";


const { rowStyle, colStyle } = basicStyle;

const Pumps = () => {
    const { gasStationId } = useParams();
    if (!gasStationId) {
        throw "No gas station id";
    }

    const { pumps, loading } = PumpHooks.getByGasStation(Number(gasStationId));

    const history = useHistory();
    const goBack = () => {
        history.goBack();
    };

    const columns = [
        {
            title: "Número",
            key: "externalId",
            render: o => TextCell(o?.externalId)
        },
        {
            title: "Fecha Creación",
            key: "created",
            render: o => TextCell(moment(o?.created).format("DD/MM/YYYY"))
        },
        {
            title: "",
            key: "action",
            width: "5%",
            className: "noWrapCell",
            render: row => {
                return (
                    <ActionWrapper>
                        <Tooltip title="Editar">
                            <a onClick={() => edit(row)} href="#">
                                <i className="ion-android-create" />
                            </a>
                        </Tooltip>
                        <Tooltip title="Generar QR">
                            <a href="# " onClick={() => generateQr(row)}>
                                <i className="ion-qr-scanner" />
                            </a>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                            <Popconfirms
                                title="Esta seguro que desea eliminar este surtidor？"
                                okText="Si"
                                cancelText="No"
                                placement="topRight"
                                onConfirm={() => handleRecord("delete", row)}
                            >
                                <a className="deleteBtn" href="# ">
                                    <i className="ion-android-delete" />
                                </a>
                            </Popconfirms>
                        </Tooltip>
                    </ActionWrapper>
                );
            }
        }
    ];

    const generateQr = (row: any) => {
        /*const formattedData =
            "1" + gasStationId.padStart(4, "0") + row.id.padStart(4, "0");*/
        const formattedDataJSONObject = {
            operationType: "refuel",
            gasStationId: gasStationId.toString(),
            pumpId: row.id.toString()
        }
        QRCode.toDataURL(
            JSON.stringify(formattedDataJSONObject),
            {
                width: 1000
            },
            function (err, url) {
                if (!err) {
                    const downloadLink = document.createElement("a");
                    const fileName = "qr.jpg";

                    downloadLink.href = url;
                    downloadLink.download = fileName;
                    downloadLink.click();
                }
            }
        );
    };

    const handleModal = (gasStation = null) => { };

    const handleRecord = (actionName, gasStation) => { };
    const [modalOpened, setModalOpened] = useState(false);
    const [editing, setEditing] = useState<Partial<IPumpModel> | undefined>();
    const edit = (o: Partial<IPumpModel>) => {
        setEditing(o);
        setModalOpened(true);
    };
    const create = () => {
        setEditing(undefined);
        setModalOpened(true);
    };

    if (loading) {
        return <Loader />;
    }
    if (!pumps || pumps.length == 0) {
        return <div>No existen estaciones de servicio</div>;
    }

    return (
        <LayoutContentWrapper>
            <PageHeader>            
                {"Surtidores"}
            </PageHeader>
            <Row style={rowStyle} gutter={0} justify="start">
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <IsoWidgetsWrapper>
                        <IsoWidgetBox>
                            <ButtonWrapper>
                                <BackButton
                                    onClick={goBack}
                                />
                                <ActionBtn
                                    type="primary"
                                    onClick={() => create()}
                                >
                                    Nuevo Surtidor
                                </ActionBtn>
                            </ButtonWrapper>

                            {/* TABLE */}
                            <TableViews.SimpleView
                                tableInfo={{
                                    title: "Simple Table",
                                    value: "simple",
                                    columns: columns
                                }}
                                rowKey="id"
                                dataSource={pumps}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>
            <PumpEdit
                editing={editing}
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onFinished={() => setModalOpened(false)}
            />
        </LayoutContentWrapper>
    );
};

export default Pumps;
