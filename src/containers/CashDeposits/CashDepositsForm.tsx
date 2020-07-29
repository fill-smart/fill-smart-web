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
import { ICashDepositModel } from "../../interfaces/models/cash-deposit.model";



const FormItem = Form.Item;
const { Option } = Select;
interface CashDepositEditFormProps extends FormProps<Partial<ICashDepositModel>> { }

const CashDepositFormFields = forwardRef<FormComponentProps, CashDepositEditFormProps>(
    ({ form, onSubmit, initialValue }, ref) => {
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


                <FormItem {...formItemLayout} label="Cantidad" hasFeedback>
                    {getFieldDecorator("amount", {
                        rules: [
                            {
                                required: true,
                                message: "Debe ingresar la cantidad"
                            }
                        ],
                        initialValue: initialValue?.amount
                    })(<InputNumber style={{ width: "100%" }} step={0.01} />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Fecha" hasFeedback>
                    {getFieldDecorator("stamp", {
                        rules: [
                            {
                                required: true,
                                message: "Ingrese la fecha"
                            }
                        ],
                        initialValue: initialValue?.stamp
                            ? moment(initialValue.stamp)
                            : undefined
                    })(
                        <DatePicker
                            placeholder=""
                            style={{ width: "100%" }}
                            format="DD/MM/YYYY"
                        />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="Nro. Comprobante" hasFeedback>
                    {getFieldDecorator("receipt", {
                        rules: [
                            {
                                required: true,
                                message: "Debe ingresar el numero de comprobante"
                            }
                        ],
                        initialValue: initialValue?.receipt
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

const CashDepositsForm = Form.create<FormProps<Partial<ICashDepositModel>>>()(
    CashDepositFormFields
);
export default CashDepositsForm;
