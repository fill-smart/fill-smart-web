import React, {
    useImperativeHandle,
    forwardRef,
    useState,
    useContext
} from "react";
import { Input, Select, DatePicker } from "antd";
import Form from "../../components/uielements/form";
import Button from "../../components/uielements/button";
import { FormComponentProps } from "antd/lib/form";
import { FormProps } from "../../form/forms";
import { IUserModel } from "../../interfaces/models/user.model";
import { SecurityContext, RolesEnum } from "../../contexts/security.context";
import styled from "styled-components";
import * as hidePassIcon from "../../assets/icons/hide_pass_icon.png";
import * as showPassIcon from "../../assets/icons/show_pass_icon.png";
import moment from "moment";

const FormItem = Form.Item;
const { Option } = Select;
interface PickADateProps extends FormProps<{ value: moment.Moment }> { }

const PickADateFormFields = forwardRef<FormComponentProps, PickADateProps>(
    ({ form, onSubmit, initialValue, onClear }, ref) => {
        const handleSubmit = e => {
            e.preventDefault();
            form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    console.log("onSubmit", values)
                    onSubmit(values);
                }
            });
        };
        const { getFieldDecorator } = form;
        useImperativeHandle(ref, () => ({
            form
        }));
        const formItemLayout = {
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 16
            }
        };
        return (
            <Form onSubmit={handleSubmit}>
                <FormItem
                    {...formItemLayout}
                >

                    {getFieldDecorator("value")(<DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" placeholder="Seleccione la fecha" />)}
                </FormItem>

                <FormItem style={{ textAlign: "center" }}>
                    <Button type="primary" htmlType="submit">
                        Guardar
                    </Button>
                </FormItem>
            </Form>
        );
    }
);

const PickADateForm = Form.create<FormProps<{ value: moment.Moment }>>()(PickADateFormFields);
export default PickADateForm;
