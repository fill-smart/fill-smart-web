import React, { useImperativeHandle, forwardRef, useEffect } from "react";
import { Input, DatePicker, Checkbox, Switch } from "antd";
import Form from "../../components/uielements/form";
import Button from "../../components/uielements/button";
import { FormComponentProps } from "antd/lib/form";
import { FormProps } from "../../form/forms";
import moment from "moment";
import { IGasStationModel } from "../../interfaces/models/gas-station.model";
const FormItem = Form.Item as any;

const StationFormFields = forwardRef<
    FormComponentProps,
    FormProps<Partial<IGasStationModel>>
>(({ form, onSubmit, initialValue }, ref) => {
    useEffect(() => {
        if (initialValue) {
            console.log(initialValue)
            form.setFieldsValue(
                Object.keys(initialValue)
                    .filter(
                        key =>
                            Object.keys(form.getFieldsValue()).indexOf(key) > -1
                    )
                    .reduce(
                        (p, n) => ({
                            ...p,
                            [n]: initialValue[n]
                        }),
                        {}
                    )
            );
        } else {
            form.resetFields();
        }
    }, [initialValue]);
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
                console.log(changes)
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
            <FormItem {...formItemLayout} label="Nombre" hasFeedback>
                {getFieldDecorator("name", {
                    rules: [
                        {
                            required: true,
                            message: "Debe ingresar el nombre"
                        }
                    ]
                })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Direccion" hasFeedback>
                {getFieldDecorator("address", {
                    rules: [
                        {
                            required: true,
                            message: "Debe ingresar la direccion"
                        }
                    ]
                })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Requerir autorizacion" >
                {getFieldDecorator("purchaseRequireAuthorization", {
                    initialValue: initialValue?.purchaseRequireAuthorization  ?? false,
                    valuePropName: "checked"
                })(<Switch />)}
            </FormItem>

            <FormItem style={{ textAlign: "center" }}>
                <Button type="primary" htmlType="submit">
                    Guardar
                </Button>
            </FormItem>
        </Form>
    );
});

const StationForm = Form.create<FormProps<Partial<IGasStationModel>>>()(
    StationFormFields
);
export default StationForm;
