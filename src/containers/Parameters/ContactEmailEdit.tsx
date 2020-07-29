import { Row, Col } from "antd";
import React, { createRef } from "react";
import { LayoutContentWrapper } from "../../components/utility/layoutWrapper.style";
import PageHeader from "../../components/utility/pageHeader";
import basicStyle from "../../assets/styles/constants";
import { IParameterModel } from "../../interfaces/models/parameter.model";
import useParametersMutations from "../../hooks/use-parameter-mutations.hook";
import useParameters from "../../hooks/use-parameters.hook";
import LoaderComponent from "../../components/utility/loader.style";
import PurchaseMaxLitresForm from "./PurchaseMaxLitresForm";
import WithdrawalMaxAmountForm from "./WithdrawalMaxAmountForm";
import PaymentInStoreLimitForm from "./PaymentInStoreLimitForm";
import ContactEmailForm from "./ContactEmailForm";
const { rowStyle, colStyle } = basicStyle;

export const ContactEmailEdit = () => {
    const formRef = createRef<any>();
    const { editContactHelpEmails } = useParametersMutations();
    const { contactHelpEmails, loading } = useParameters();
    const edit = (data: { textValue: string }) => {
        console.log(data);
        editContactHelpEmails(data.textValue);
    };
    if (loading) {
        return <LoaderComponent></LoaderComponent>;
    }
    return (
        <LayoutContentWrapper>
            <PageHeader>{"Parametros"}</PageHeader>

            <Row style={rowStyle} gutter={0} justify="start">
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <ContactEmailForm
                        initialValue={{ textValue: contactHelpEmails }}
                        onSubmit={(c: any) =>
                            edit({
                                textValue: c.textValue
                            })
                        }
                        wrappedComponentRef={formRef}
                    />
                </Col>
            </Row>
        </LayoutContentWrapper>
    );
};

export default ContactEmailEdit;
