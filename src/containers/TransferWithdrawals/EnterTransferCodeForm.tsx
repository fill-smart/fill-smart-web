import React, {
    useImperativeHandle,
    forwardRef,
    useState,
    useContext
} from "react";
import { Input, Select } from "antd";
import Form from "../../components/uielements/form";
import Button from "../../components/uielements/button";
import { FormComponentProps } from "antd/lib/form";
import { FormProps } from "../../form/forms";


const FormItem = Form.Item;
interface EnterTransferCodeProps extends FormProps<{ value: string }> { }

const EnterTransferCodeFormFields = forwardRef<FormComponentProps, EnterTransferCodeProps>(
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
                    hasFeedback
                >
                    {getFieldDecorator("code", {
                        rules: [
                            {
                                required: true,
                                message: "Debe ingresar el número de transferencia"
                            }
                        ]
                    })(<Input />)}
                </FormItem>

                <FormItem style={{ textAlign: "center" }}>
                    <Button type="primary" htmlType="submit">
                        Aceptar
                    </Button>
                </FormItem>
            </Form>
        );
    }
);

const EnterTransferCodeForm = Form.create<FormProps<{ value: string }>>()(EnterTransferCodeFormFields);
export default EnterTransferCodeForm;
