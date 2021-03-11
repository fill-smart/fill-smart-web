import React, { Component, useState, useEffect } from "react";
import LayoutContentWrapper from "../components/utility/layoutWrapper";

import { palette } from "styled-theme";
import { borderRadius } from "../library/helpers/style_utils";

import { Row, Col, Button, Tag, Input } from "antd";
import basicStyle from "../assets/styles/constants";

import PageHeader from "../components/utility/pageHeader";
import Box from "../components/utility/box";
import ContentHolder from "../components/utility/contentHolder";
import Alert from "../components/Feedback/Alert";
import { Modal } from "antd";
import styled from "styled-components";
import Buttons from "../components/uielements/button";
import { useHistory } from "react-router";
import useCustomerByDocument, {
    ISingleCustomerByDni
} from "../hooks/use-customer-by-document";

const centerContainer = {
    margin: "0 auto"
};

const padding20 = {
    padding: "10px"
};

const { rowStyle, colStyle } = basicStyle;

const showNotExists = () => {
    Modal.error({
        content: "No se encontro un cliente con el DNI ingresado"
    });
};

const showConfirm = (customer: ISingleCustomerByDni) =>
    Modal.confirm({
        width: 500,
        title: "Confirmar Identidad",
        content: (
            <>
                <div style={centerContainer}>
                    <div style={padding20}>
                        <img
                            src={`data:image/jpeg;base64,${customer.documents[0].image.base64}`}
                        />
                    </div>
                </div>
                <div style={centerContainer}>
                    <div style={padding20}>
                        <img
                            src={`data:image/jpeg;base64,${customer.documents[1].image.base64}`}
                        />
                    </div>
                </div>
            </>
        ),
        onOk: () => {
            Modal.info({
                title: "Solicitud Enviada",
                content: `Se ha enviado la solicitud de pago a ${customer.firstName} ${customer.lastName}, se informara mediante una alerta cuando el pago haya sido realizado`
            });
            setTimeout(() => {
                Modal.success({
                    title: "Pago Realizado",
                    content:
                        "El cliente ha realizado el pago exitosamente, el numero de operacion es 0014-7465"
                });
            }, 5000);
        },
        onCancel: () => {},
        okText: "Confirmar",
        cancelText: "Cancelar"
    });

const PaymentRequest = () => {
    const [dni, setDni] = useState("");
    const history = useHistory();
    const [hasFetched, setHasFetched] = useState(false);

    const handleCancel = () => {
        history.goBack();
    };

    const { execute, result, loading, called, refetch } = useCustomerByDocument(
        dni
    );
    useEffect(() => {
        if (hasFetched) {
            if (result.exists) {
                showConfirm(result.customer);
            } else {
                showNotExists();
            }
            setHasFetched(false);
        }
    }, [hasFetched]);

    const handleFindCustomer = () => {
        if (dni.length === 8) {
            if (!called) {
                execute();
            } else {
                refetch();
            }
            setHasFetched(true);
        }
    };    

    const gutter = 16;
    return (
        <LayoutContentWrapper>
            <PageHeader>Solicitud de Pago</PageHeader>
            <Row style={rowStyle} gutter={gutter} justify="start">
                <Col md={24} style={colStyle}>
                    <Alert
                        message=""
                        description={
                            "IMPORTANTE: Recuerde que debera solicitar el Documento y verificar la identidad de quien realiza la operacion"
                        }
                        type="info"
                        showIcon
                    />
                </Col>

                <Col md={24} sm={24} xs={24} style={colStyle}>
                    <Box title="Ingrese el Documento">
                        <ContentHolder>
                            <Input
                                placeholder="Ingrese un DNI (solo numeros sin puntos)"
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setDni(e.target.value)}
                            />

                            <ButtonWrapper>
                                <div></div>
                                <ButtonHolders>
                                    <ActionBtn
                                        type="primary"
                                        onClick={handleFindCustomer}
                                        disabled={dni.length !== 8}
                                    >
                                        Verificar
                                    </ActionBtn>
                                    <ActionBtn
                                        type="danger"
                                        onClick={handleCancel}
                                    >
                                        Cancelar
                                    </ActionBtn>
                                </ButtonHolders>
                            </ButtonWrapper>
                        </ContentHolder>
                    </Box>
                </Col>
            </Row>
        </LayoutContentWrapper>
    );
};

export const DetailsTable = styled.div`
    width: 100%;
    padding: ${props =>
        props["data-rtl"] === "rtl" ? "0 20px 0 30px" : "0 30px 0 20px"};

    @media only screen and (max-width: 767px) {
        width: 100%;
        padding: 0;
    }

    .isoOrderTable {
        width: 100%;
        display: flex;
        flex-direction: column;

        .isoOrderTableHead {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;

            .tableHead {
                font-size: 15px;
                font-weight: 500;
                color: ${palette("text", 0)};
                line-height: 1.2;
            }
        }

        .isoOrderTableBody {
            width: 100%;
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;

            .isoSingleOrderInfo {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid ${palette("border", 0)};

                &:last-child {
                    border-bottom: 0;
                }

                p {
                    padding-right: ${props =>
                        props["data-rtl"] === "rtl"
                            ? "0 0 0 35px"
                            : "0 35px 0 0"};
                    span {
                        font-size: 13px;
                        font-weight: 400;
                        color: ${palette("text", 2)};
                        line-height: 1.5;
                        padding: 0 3px;
                        display: inline-block;

                        &.isoQuantity {
                            font-size: 13px;
                            font-weight: 400;
                            color: ${palette("text", 1)};
                            line-height: 1.5;
                            display: inline-block;
                        }
                    }
                }

                .totalPrice {
                    font-size: 13px;
                    font-weight: 500;
                    color: ${palette("text", 2)};
                    line-height: 1.5;
                }
            }
        }

        .isoOrderTableFooter {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;

            span {
                font-size: 14px;
                font-weight: 500;
                color: ${palette("text", 0)};
                line-height: 1.2;
            }
        }
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-top: 20px;
    flex-wrap: wrap;
    align-items: center;
`;
const ButtonHolders = styled.div``;
const ActionBtn = styled(Buttons)`
    && {
        padding: 0 12px;
        margin-right: 15px;

        &:last-child {
            margin-right: 0;
        }

        i {
            font-size: 17px;
            color: ${palette("text", 1)};
        }

        &:hover {
            i {
                color: inherit;
            }
        }
    }
`;

export default PaymentRequest;
