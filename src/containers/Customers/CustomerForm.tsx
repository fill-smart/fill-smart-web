import React, { useImperativeHandle, forwardRef, useEffect } from "react";
import { Input, DatePicker } from "antd";
import Form from "../../components/uielements/form";
import Checkbox from "../../components/uielements/checkbox";
import Button from "../../components/uielements/button";
import { FormComponentProps } from "antd/lib/form";
import { ICustomerModel } from "../../interfaces/models/customer.model";
import { FormProps } from "../../form/forms";
import moment from "moment";
const FormItem = Form.Item;

const CustomerFormFields = forwardRef<
    FormComponentProps,
    FormProps<Partial<ICustomerModel>>
>(({ form, onSubmit, initialValue }, ref) => {
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
                            /*[n]: moment.isMoment(values[n])
                                ? values[n].toDate()
                                : values[n]*/
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
            <FormItem {...formItemLayout} label="Documento" hasFeedback>
                {getFieldDecorator("documentNumber", {
                    rules: [
                        {
                            required: true,
                            message: "Debe ingresar el numero de documento"
                        }
                    ],
                    initialValue: initialValue?.documentNumber
                })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Nombre" hasFeedback>
                {getFieldDecorator("firstName", {
                    rules: [
                        {
                            required: true,
                            message: "Debe ingresar el nombre"
                        }
                    ],
                    initialValue: initialValue?.firstName
                })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Apellido" hasFeedback>
                {getFieldDecorator("lastName", {
                    rules: [
                        {
                            required: true,
                            message: "Debe ingresar el apellido"
                        }
                    ],
                    initialValue: initialValue?.lastName
                })(<Input />)}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="Fecha de Nacimiento"
                hasFeedback
            >
                {getFieldDecorator("born", {
                    rules: [
                        {
                            required: true,
                            message: "Ingrese la fecha de nacimiento"
                        }
                    ],
                    initialValue: moment(initialValue?.born)
                })(
                    <DatePicker
                        placeholder=""
                        style={{ width: "100%" }}
                        format="DD/MM/YYYY"
                    />
                )}
            </FormItem>
            <FormItem {...formItemLayout} label="Telefono" hasFeedback>
                {getFieldDecorator("phone", {
                    rules: [
                        {
                            required: true,
                            message: "Debe ingresar el telefono"
                        }
                    ],
                    initialValue: initialValue?.phone
                })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Email" hasFeedback>
                {getFieldDecorator("email", {
                    rules: [
                        {
                            required: true,
                            message: "Debe ingresar el email"
                        },
                        {
                            type: "email",
                            message: "Ingrese un email valido"
                        }
                    ],
                    initialValue: initialValue?.user?.username
                })(<Input />)}
            </FormItem>
            <FormItem style={{ textAlign: "center" }}>
                <Button type="primary" htmlType="submit">
                    Guardar
                </Button>
            </FormItem>
        </Form>
    );
});

const CustomerForm = Form.create<FormProps<Partial<ICustomerModel>>>()(
    CustomerFormFields
);
export default CustomerForm;
