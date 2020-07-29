import { Row, Col } from "antd";
import React, { createRef } from "react";
import { LayoutContentWrapper } from "../../components/utility/layoutWrapper.style";
import PageHeader from "../../components/utility/pageHeader";
import basicStyle from "../../assets/styles/constants";
import useParameters from "../../hooks/use-parameters.hook";
import LoaderComponent from "../../components/utility/loader.style";
import useParametersMutations from "../../hooks/use-parameter-mutations.hook";
import AccountMaxLitresForm from "./AccountMaxLitresForm";

const { rowStyle, colStyle } = basicStyle;

export const AccountMaxLitresEdit = () => {
    const formRef = createRef<any>();
    const { editAccountLitresLimit } = useParametersMutations();
    const { accountLitresLimit, loading } = useParameters();
    const edit = (data: { numberValue: number }) => {
        editAccountLitresLimit(data.numberValue);
    };
    if (loading) {
        return <LoaderComponent></LoaderComponent>;
    }
    return (
        <LayoutContentWrapper>
            <PageHeader>{"Parametros"}</PageHeader>

            <Row style={rowStyle} gutter={0} justify="start">
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <AccountMaxLitresForm
                        initialValue={{ numberValue: accountLitresLimit }}
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

export default AccountMaxLitresEdit;
