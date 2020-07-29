import { Row, Col } from "antd";
import React, { createRef } from "react";
import { LayoutContentWrapper } from "../../components/utility/layoutWrapper.style";
import PageHeader from "../../components/utility/pageHeader";
import GracePeriodForm from "./GracePeriodForm";
import basicStyle from "../../assets/styles/constants";
import { IParameterModel } from "../../interfaces/models/parameter.model";
import useParametersMutations from "../../hooks/use-parameter-mutations.hook";
import useParameters from "../../hooks/use-parameters.hook";
import LoaderComponent from "../../components/utility/loader.style";
const { rowStyle, colStyle } = basicStyle;

export const GracePeriodEdit = () => {
    const formRef = createRef<any>();
    const { editGracePeriod } = useParametersMutations();
    const { gracePeriod, loading } = useParameters();
    const edit = (data: { numberValue: number }) => {
        editGracePeriod(data.numberValue);
    };
    if (loading) {
        return <LoaderComponent></LoaderComponent>;
    }
    console.log("gp: ", gracePeriod);
    return (
        <LayoutContentWrapper>
            <PageHeader>{"Parametros"}</PageHeader>

            <Row style={rowStyle} gutter={0} justify="start">
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <GracePeriodForm
                        initialValue={{ numberValue: gracePeriod }}
                        onSubmit={(c: any) =>
                            edit({
                                numberValue: +c.numberValue
                            })
                        }
                        wrappedComponentRef={formRef}
                    />
                </Col>
            </Row>
        </LayoutContentWrapper>
    );
};

export default GracePeriodEdit;
