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
} from "./Notifications.styles";
import Loader from "../../components/utility/loader";

import useNotifications, { NotificationRecord } from "../../hooks/use-notifications.hook";
import { NotificationsEdit } from "./NotificationsEdit";
import moment from "moment"

const { rowStyle, colStyle } = basicStyle;

const Notifications = () => {
    const { notifications, loading } = useNotifications();

    const columns = [
        {
            title: "Titulo",
            key: "investmentType",
            render: (o: NotificationRecord) => TextCell(o?.title)
        },
        {
            title: "Texto",
            key: "from",
            width: "80%",
            render: (o: NotificationRecord) =>
                TextCell(o?.text)
        },
        {
            title: "Enviada",
            key: "stamp",
            render: (o: NotificationRecord) =>
                TextCell(moment(o?.created).format("DD/MM/YYYY HH:mm"))
        }
    ];
    const [modalOpened, setModalOpened] = useState(false);


    if (loading) {
        return <Loader />;
    }
    if (!notifications) {
        return <div>No existen notificaciones</div>;
    }


    const create = () => {
        setModalOpened(true);
    };

    return (
        <LayoutContentWrapper>
            <PageHeader>{"Notificaciones"}</PageHeader>

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
                                        Nueva Notificación
                                    </ActionBtn>
                                </ButtonHolders>
                            </ButtonWrapper>

                            {/* TABLE */}
                            <TableViews.SimpleView
                                tableInfo={{
                                    title: "Simple Table",
                                    value: "simple",
                                    columns: columns
                                }}
                                rowKey="id"
                                dataSource={notifications}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>
            <NotificationsEdit
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onFinished={() => setModalOpened(false)}
            />
        </LayoutContentWrapper>
    );
};

export default Notifications;
