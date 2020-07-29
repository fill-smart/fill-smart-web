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
import { IUserModel } from "../../interfaces/models/user.model";
import { SecurityContext, RolesEnum } from "../../contexts/security.context";
import useGasStations from "../../hooks/use-gas-stations.hook";
import styled from "styled-components";
import * as hidePassIcon from "../../assets/icons/hide_pass_icon.png";
import * as showPassIcon from "../../assets/icons/show_pass_icon.png";

const FormItem = Form.Item;
const { Option } = Select;
export interface IChangePasswordModel {
    currentPassword: string;
    newPassword: string;

}
interface ChangePasswordFormProps extends FormProps<IChangePasswordModel> { }

const PasswordShower = styled.a`
    position:absolute;
    right: 10px;
    top:-13px;
`


const ChangePasswordFormFields = forwardRef<FormComponentProps, ChangePasswordFormProps>(
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
        const [isCurrentPasswordHidden, setIsCurrentPasswordHidden] = useState(true)
        const [isNewPasswordHidden, setIsNewPasswordHidden] = useState(true)

        const toggleIsCurrentPasswordHidden = () => {
            setIsCurrentPasswordHidden(!isCurrentPasswordHidden)
        }

        const toggleIsNewPasswordHidden = () => {
            setIsNewPasswordHidden(!isNewPasswordHidden)
        }

        return (
            <Form onSubmit={handleSubmit}>

                <FormItem style={{ position: "relative" }} {...formItemLayout} label="Contraseña Actual">
                    {getFieldDecorator("currentPassword", {
                        rules: [
                            {
                                required: true,
                                message: "Debe ingresar la contraseña actual"
                            }
                        ]
                    })(

                        <Input type={isCurrentPasswordHidden ? 'password' : 'text'} />


                    )}
                    <PasswordShower onClick={() => toggleIsCurrentPasswordHidden()}>
                        <img src={(isCurrentPasswordHidden ? showPassIcon : hidePassIcon) as any} />
                    </PasswordShower>
                </FormItem>
                <FormItem style={{ position: "relative" }} {...formItemLayout} label="Nueva Contraseña">
                    {getFieldDecorator("newPassword", {
                        rules: [
                            {
                                required: true,
                                message: "Debe ingresar la nueva contraseña"
                            }
                        ]
                    })(

                        <Input type={isNewPasswordHidden ? 'password' : 'text'} />


                    )}
                    <PasswordShower onClick={() => toggleIsNewPasswordHidden()}>
                        <img src={(isNewPasswordHidden ? showPassIcon : hidePassIcon) as any} />
                    </PasswordShower>
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

const ChangePasswordForm = Form.create<FormProps<IChangePasswordModel>>()(ChangePasswordFormFields);
export default ChangePasswordForm;
