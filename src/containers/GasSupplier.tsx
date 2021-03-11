import React from "react";
import LayoutContentWrapper from "../components/utility/layoutWrapper";
import { Row, Col, Button } from "antd";
import basicStyle from "../assets/styles/constants";
import PageHeader from "../components/utility/pageHeader";
import { useHistory, useParams } from "react-router";
import usePump from "../hooks/use-pump.hook";
import ContentHolder from "../components/utility/contentHolder";
import Box from "../components/utility/box";
import { DetailsTable } from "./PaymentRequest";
import { PRIVATE_ROUTE } from "../route.constants";
import LoaderComponent from "../components/utility/loader.style";

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

const GasSupplier = () => {
    console.log("Entered gas supplier");
    const history = useHistory();
    const { pumpId } = useParams();
    const { pump, loading } = usePump(Number(pumpId));
    console.log(pump);
    if (loading) {
        return <LoaderComponent />;
    }
    const handleClick = () => {
        history.push(PRIVATE_ROUTE.PAYMENT_REQUEST);
    };
    const goAuthorization = handleClick;
    console.log(pump);
    if (pump) {
        const operationDetail = (
            <Col md={24} style={colStyle}>
                <Box title="Datos de la operación">
                    <ContentHolder>
                        <DetailsTable className="isoOrderInfo">
                            <div className="isoOrderTable">
                                <div className="isoOrderTableBody">
                                    <div className="isoSingleOrderInfo">
                                        <p>
                                            <span>Tipo de Combustible</span>
                                        </p>
                                        <span className="totalPrice">
                                            {
                                                pump?.lastExternalOperation
                                                    .fuelType.name
                                            }
                                        </span>
                                    </div>

                                    <div className="isoSingleOrderInfo">
                                        <p>
                                            <span>Total Litros</span>
                                        </p>
                                        <span className="totalPrice">
                                            {pump?.lastExternalOperation.litres}
                                        </span>
                                    </div>

                                    <div className="isoSingleOrderInfo">
                                        <p>
                                            <span>Precio x Litro</span>
                                        </p>
                                        <span className="totalPrice">
                                            ${" "}
                                            {pump?.lastExternalOperation.fuelPrice.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="isoOrderTableFooter">
                                    <span>Total</span>
                                    <span>
                                        ${" "}
                                        {pump?.lastExternalOperation.total.toFixed(
                                            2
                                        )}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        margin: "0 auto"
                                    }}
                                >
                                    
                                </div>
                            </div>
                        </DetailsTable>
                    </ContentHolder>
                </Box>
            </Col>
        );

        return (
            <LayoutContentWrapper>
                <div style={styles.wisgetPageStyle}>
                    <PageHeader>{"Ultima operacion del surtidor"}</PageHeader>
                    <Row style={rowStyle} gutter={0} justify="start">
                        {operationDetail}
                    </Row>
                </div>
            </LayoutContentWrapper>
        );
    } else return <div>Loading...</div>;
};

export default GasSupplier;
