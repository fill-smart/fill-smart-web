import React, {
    useImperativeHandle,
    forwardRef,
    useState,
    useContext
} from "react";
import { Input, Select, Upload, Icon } from "antd";
import Form from "../../components/uielements/form";
import Button from "../../components/uielements/button";
import { FormComponentProps } from "antd/lib/form";
import { FormProps } from "../../form/forms";
import InputUpload from "../../components/Forms/Upload/upload";
import useAcceptOrRejectTransferWithdrawal from "../../hooks/use-accept-or-reject-transfer.hook";

const FormItem = Form.Item;
interface EnterTransferCodeProps extends FormProps<{ value: string }> { }

const EnterTransferCodeFormFields = forwardRef<FormComponentProps, EnterTransferCodeProps>(
    ({ form, onSubmit, initialValue, onClear }, ref) => {
        const handleSubmit = e => {
            e.preventDefault();
            form.validateFieldsAndScroll((err, values) => {
                if (!err) {
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
        const { accept, reject } = useAcceptOrRejectTransferWithdrawal(() => { console.log("hola") });

        return (
            <Form onSubmit={handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="N° de transferencia"
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
                <FormItem
                    {...formItemLayout}
                    label="Comprobante"
                >
                    {getFieldDecorator("voucher", {
                        rules: [
                            {
                                required: true,
                                message: "Debe ingresar el comprobante de transferencia"
                            }
                        ],
                        // valuePropName: "fileList",
                        // getValueFromEvent: (e) => { console.log("onchange", e) }
                    })(
                        // <Upload
                        //     name="file"
                        //     listType="picture"
                        //     customRequest={(e) => { console.log("eeee", e) }}
                        // >
                        //     <Button>
                        //         <Icon type="upload" /> Click para agregar
                        //     </Button>
                        // </Upload>
                        <InputUpload></InputUpload>
                    )}
                </FormItem>
                {/* <input
                    type="file"
                    required
                    onChange={({ target: { validity, files } }) =>
                    // validity.valid && upload({ csv: files![0] })
                    // console.log("files", validity, files)
                    {
                        validity.valid && accept("2", "hola", files![0])
                        console.log("files", files![0])
                    }
                    }
                /> */}
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
