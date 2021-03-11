import React, { useImperativeHandle, forwardRef, useEffect } from "react";
import { Input, DatePicker } from "antd";
import Form from "../../components/uielements/form";
import Button from "../../components/uielements/button";
import { FormComponentProps } from "antd/lib/form";
import { FormProps } from "../../form/forms";
import moment from "moment";
import { IGasStationModel } from "../../interfaces/models/gas-station.model";
import { IParameterModel } from "../../interfaces/models/parameter.model";
const FormItem = Form.Item;

const WithdrawalAmountMultipleFormFields = forwardRef<
    FormComponentProps,
    FormProps<Partial<IGasStationModel>>
>(({ form, onSubmit, initialValue }, ref) => {
    useEffect(() => {
        if (initialValue) {
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
            <FormItem
                {...formItemLayout}
                label="Unidad mínima permitida para retirar"
                hasFeedback
            >
                {getFieldDecorator("numberValue", {
                    rules: [
                        {
                            required: true,
                            message: "Debe ingresar el mínimo"
                        }
                    ]
                })(<Input type="number" />)}
            </FormItem>

            <FormItem style={{ textAlign: "center" }}>
                <Button type="primary" htmlType="submit">
                    Guardar
                </Button>
            </FormItem>
        </Form>
    );
});

const WithdrawalAmountMultipleForm = Form.create<FormProps<Partial<IParameterModel>>>()(
    WithdrawalAmountMultipleFormFields
);
export default WithdrawalAmountMultipleForm;
