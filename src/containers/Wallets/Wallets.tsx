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
import { IWalletModel } from "../../interfaces/models/wallet.model";
import useWalletsByCustomer from "../../hooks/use-wallets-by-customer.hook";
import BackButton from "../../components/uielements/BackButton";

const { rowStyle, colStyle } = basicStyle;

type FuelTypeViewModel = Pick<IFuelTypeModel, "name">;

type WalletViewModel = Pick<IWalletModel, "id" | "litres" | "availableLitres"> & {
    fuelType: FuelTypeViewModel;
};

const Wallets = () => {
    const { customerId } = useParams();
    if (!customerId) {
        throw "No customer id";
    }

    const { wallets, loading } = useWalletsByCustomer(Number(customerId));

    const history = useHistory();
    const goBack = () => {
        history.goBack();
    };

    const columns = [        
        {
            title: "Tipo de Combustible",
            key: "fuelType.name",
            render: (w: WalletViewModel) => TextCell(w?.fuelType.name)
        },
        {
            title: "Litros Totales",
            key: "litres",
            render: (w: WalletViewModel) =>
                TextCell(
                    w?.litres.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    })
                )
        },
        {
            title: "Litros Disponibles",
            key: "availableLitres",
            render: (w: WalletViewModel) =>
                TextCell(
                    w?.availableLitres.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    })
                )
        }
    ];

    

    

    if (loading) {
        return <Loader />;
    }
    if (!wallets || wallets.length == 0) {
        return <div>No existen estaciones de servicio</div>;
    }
    
    return (
        <LayoutContentWrapper>
            <PageHeader>Listado de Billeteras</PageHeader>

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
                                dataSource={wallets}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
                
            </Row>
        </LayoutContentWrapper>
    );
};

export default Wallets;
