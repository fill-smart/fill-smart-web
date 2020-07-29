import React, { useImperativeHandle, forwardRef, useEffect } from "react";
import { Input, DatePicker, Select, InputNumber } from "antd";
import Form from "../../components/uielements/form";
import Button from "../../components/uielements/button";
import { FormComponentProps } from "antd/lib/form";
import { FormProps } from "../../form/forms";
import useInvestmentTypes, {
    InvestmentTypeRecord
} from "../../hooks/use-investment-types.hook";
import moment from "moment";
import { QuoteRecord } from "../../hooks/use-quotes.hook";
import { INotificationModel } from "../../interfaces/models/notification.model";

const FormItem = Form.Item;
const { Option } = Select;
interface NotificationEditFormProps extends FormProps<Partial<INotificationModel>> {

}

const NotificationFormFields = forwardRef<FormComponentProps, NotificationEditFormProps>(
    ({ form, onSubmit, initialValue, quotes, investmentTypes }, ref) => {
        const handleSubmit = e => {
            e.preventDefault();
            form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    //onSubmit(values);
                    const changes = Object.keys(values)
                        .filter(key => form.isFieldTouched(key))
                        .reduce(
                            (p: { [key: string]: any }, n) => ({
                                ...p,
                                [n]: values[n]
                            }),
                            {}
                        );
                    onSubmit(changes);
                }
            });
        };

        const { getFieldDecorator } = form;
        useImperativeHandle(ref, () => ({
            form
        }));

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 }
            }
        };

        return (
            <Form onSubmit={handleSubmit}>


                <FormItem {...formItemLayout} label="Titulo" hasFeedback>
                    {getFieldDecorator("title", {
                        rules: [
                            {
                                required: true,
                                message: "Debe ingresar el titulo"
                            }
                        ],
                        initialValue: initialValue?.title
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Texto" hasFeedback>
                    {getFieldDecorator("text", {
                        rules: [
                            {
                                required: true,
                                message: "Debe ingresar el texto"
                            }
                        ],
                        initialValue: initialValue?.text
                    })(<Input />)}
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

const NotificationsForm = Form.create<FormProps<Partial<INotificationModel>>>()(
    NotificationFormFields
);
export default NotificationsForm;
