import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Input, DatePicker, Select, InputNumber } from "antd";
import Form from "../../components/uielements/form";
import Button from "../../components/uielements/button";
import { FormComponentProps } from "antd/lib/form";
import { FormProps } from "../../form/forms";
import useInvestmentTypes, {
    InvestmentTypeRecord
} from "../../hooks/use-investment-types.hook";
import moment from "moment";
import {
    IInvestmentModel,
    InvestmentMovementTypeEnum
} from "../../interfaces/models/investment.model";
import { QuoteRecord } from "../../hooks/use-quotes.hook";

const FormItem = Form.Item;
const { Option } = Select;
interface InvestmentEditFormProps extends FormProps<Partial<IInvestmentModel>> {
    quotes: QuoteRecord[];
    investmentTypes: InvestmentTypeRecord[];
}

const InvestmentFormFields = forwardRef<
    FormComponentProps,
    InvestmentEditFormProps
>(({ form, onSubmit, initialValue, quotes, investmentTypes }, ref) => {
    const [selectedInvestmentTypeId, setSelectedInvestmentTypeId] = useState<
        string | undefined
    >(initialValue?.investmentType?.id);
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
                label="Tipo de Movimiento"
                hasFeedback
            >
                {getFieldDecorator("movementType", {
                    rules: [
                        {
                            required: true,
                            message: "Debe ingresar el tipo de movimiento"
                        }
                    ],
                    initialValue: initialValue?.movementType
                })(
                    <Select>
                        <Option value={InvestmentMovementTypeEnum.Purchase}>
                            Compra
                        </Option>
                        <Option value={InvestmentMovementTypeEnum.Sale}>
                            Venta
                        </Option>
                    </Select>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label="Tipo de Inversión" hasFeedback>
                {getFieldDecorator("investmentTypeId", {
                    rules: [
                        {
                            required: true,
                            message: "Debe ingresar el tipo de inversion"
                        }
                    ],
                    initialValue: initialValue?.investmentType?.id
                })(
                    <Select
                        onChange={(v: string) => setSelectedInvestmentTypeId(v)}
                    >
                        {investmentTypes?.map(i => (
                            <Option key={i.id} value={i.id}>
                                {i.name}
                            </Option>
                        ))}
                    </Select>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label="Cotización" hasFeedback>
                {getFieldDecorator("quoteId", {
                    rules: [
                        {
                            required: true,
                            message: "Debe ingresar la cotización"
                        }
                    ],
                    initialValue: initialValue?.quote?.id
                })(
                    <Select>
                        {quotes
                            .filter(
                                t =>
                                    t.investmentType.id ===
                                    selectedInvestmentTypeId
                            )
                            .map(i => (
                                <Option
                                    key={i.id}
                                    value={i.id}
                                >{`${i.investmentType.name} - ${i.price}`}</Option>
                            ))}
                    </Select>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label="Cantidad" hasFeedback>
                {getFieldDecorator("ammount", {
                    rules: [
                        {
                            required: true,
                            message: "Debe ingresar la cantidad"
                        }
                    ],
                    initialValue: initialValue?.ammount
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

            <FormItem style={{ textAlign: "center" }}>
                <Button type="primary" htmlType="submit">
                    Guardar
                </Button>
                <Button type="secondary" htmlType="button" onClick={() => { initialValue = undefined }}>
                    Limpiar
                </Button>
            </FormItem>
        </Form>
    );
});

const InvestmentsForm = Form.create<FormProps<Partial<IInvestmentModel>>>()(
    InvestmentFormFields
);
export default InvestmentsForm;
