import React from "react";
import LayoutContentWrapper from "../components/utility/layoutWrapper";
import { Row, Col } from "antd";
import basicStyle from "../assets/styles/constants";
import IsoWidgetsWrapper from "./Widgets/WidgetsWrapper";
import PageHeader from "../components/utility/pageHeader";
import CardWidget from "./Widget/Widgets/Card/CardWidget";
import { useHistory } from "react-router";
import usePumps from "../hooks/use-pumps.hook";
import LoaderComponent from "../components/utility/loader.style";
import moment from "moment";
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

const SurtidoresPage = () => {
    const { pumps, loading } = usePumps();
    const history = useHistory();
    const handleClick = (pumpId: number) => {
        history.push(`/fillsmart/gassupplier/${pumpId}`);
    };
    if (loading) {
        return <LoaderComponent />;
    }
    if (!pumps) {
        return <div>No pumps</div>;
    }
    return (
        <LayoutContentWrapper>
            <div style={styles.wisgetPageStyle}>
                <PageHeader>{"Surtidores"}</PageHeader>
                <Row style={rowStyle} gutter={0} justify="start">
                    {pumps.map((pump, idx) => (
                        <Col
                            key={pump.id}
                            lg={8}
                            md={8}
                            sm={8}
                            xs={8}
                            style={colStyle}
                        >
                            <IsoWidgetsWrapper
                                style={{ cursor: "pointer" }}
                                gutterBottom={20}
                                onClick={e => handleClick(pump.id)}
                            >
                                {/* Card Widget */}
                                <CardWidget
                                    icon="ion-pull-request"
                                    iconcolor="#F75D81"
                                    number={"Surtidor " + pump.externalId}
                                    text=""
                                    litres={pump.lastExternalOperation?.litres}
                                    fuelType={
                                        pump.lastExternalOperation
                                            ? pump.lastExternalOperation
                                                  ?.fuelType.name
                                            : ""
                                    }
                                    total={
                                        pump.lastExternalOperation
                                            ? pump.lastExternalOperation
                                                  .litres *
                                              pump.lastExternalOperation
                                                  .fuelType.currentPrice.price
                                            : ""
                                    }
                                    ago={
                                        pump.lastExternalOperation
                                            ? moment(
                                                  pump.lastExternalOperation
                                                      .stamp
                                              )
                                                  .locale("ES-us")
                                                  .fromNow()
                                            : ""
                                    }
                                />
                            </IsoWidgetsWrapper>
                        </Col>
                    ))}
                </Row>
            </div>
        </LayoutContentWrapper>
    );
};

export default SurtidoresPage;
