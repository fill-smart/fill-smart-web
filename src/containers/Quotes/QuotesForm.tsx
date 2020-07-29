import React, { useImperativeHandle, forwardRef, useEffect } from "react";
import { Input, DatePicker, Select, InputNumber } from "antd";
import Form from "../../components/uielements/form";
import Button from "../../components/uielements/button";
import { FormComponentProps } from "antd/lib/form";
import { FormProps } from "../../form/forms";
import { IQuoteModel } from "../../interfaces/models/quote.model";
import useInvestmentTypes, {
    InvestmentTypeRecord
} from "../../hooks/use-investment-types.hook";
import moment from "moment";
import { QuoteRecord } from "../../hooks/use-quotes.hook";

const FormItem = Form.Item;
const { Option } = Select;
interface QuoteEditFormProps extends FormProps<Partial<IQuoteModel>> {
    quotes: QuoteRecord[];
    investmentTypes: InvestmentTypeRecord[];
}

const QuoteFormFields = forwardRef<FormComponentProps, QuoteEditFormProps>(
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
                <FormItem
                    {...formItemLayout}
                    label="Tipo de Inversión"
                    hasFeedback
                >
                    {getFieldDecorator("investmentTypeId", {
                        rules: [
                            {
                                required: true,
                                message: "Debe ingresar el tipo de inversion"
                            }
                        ],
                        initialValue: initialValue?.investmentType?.id
                    })(
                        <Select>
                            {investmentTypes?.map(i => (
                                <Option key={i.id} value={i.id}>
                                    {i.name}
                                </Option>
                            ))}
                        </Select>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="Unidades" hasFeedback>
                    {getFieldDecorator("price", {
                        rules: [
                            {
                                required: true,
                                message: "Debe ingresar la cantidad de unidades"
                            }
                        ],
                        initialValue: initialValue?.price
                    })(<InputNumber style={{ width: "100%" }} step={0.01} />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Desde" hasFeedback>
                    {getFieldDecorator("from", {
                        rules: [
                            {
                                required: true,
                                message: "Ingrese la fecha desde"
                            }
                        ],
                        initialValue: initialValue?.from
                            ? moment(initialValue.from)
                            : undefined
                    })(
                        <DatePicker
                            placeholder=""
                            style={{ width: "100%" }}
                            format="DD/MM/YYYY"
                        />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="Cotizacion Padre"
                    hasFeedback
                >
                    {getFieldDecorator("parentQuoteId", {
                        initialValue: initialValue?.parentQuote?.id
                    })(
                        <Select>
                            {quotes?.map(i => (
                                <Option key={i.id} value={i.id}>
                                    {`${i.investmentType.name} - ${i.price}`}
                                </Option>
                            ))}
                        </Select>
                    )}
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

const QuotesForm = Form.create<FormProps<Partial<IQuoteModel>>>()(
    QuoteFormFields
);
export default QuotesForm;
