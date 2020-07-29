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
interface UserEditFormProps extends FormProps<Partial<IUserModel>> { }

const PasswordShower = styled.a`
    position:absolute;
    right: 10px;
    top:-13px;
`


const UserFormFields = forwardRef<FormComponentProps, UserEditFormProps>(
    ({ form, onSubmit, initialValue, quotes, investmentTypes }, ref) => {
        const [security] = useContext(SecurityContext);
        const [selectedRole, setSelectedRole] = useState<
            RolesEnum | undefined
        >();
        const { gasStations } = useGasStations();
        const isAdmin = security.user?.roles
            .map(r => r.name)
            .includes(RolesEnum.Admin);
        const gasStationId =
            security.user?.gasStationAdministrator?.gasStation.id;
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
        const [isPasswordHidden, setIsPasswordHidden] = useState(true)

        const toggleIsPasswordHidden = () => {
            setIsPasswordHidden(!isPasswordHidden)
        }
        return (
            <Form onSubmit={handleSubmit}>
                <FormItem {...formItemLayout} label="Rol" hasFeedback>
                    {getFieldDecorator("role", {
                        rules: [
                            {
                                required: true,
                                message: "Debe ingresar el rol"
                            }
                        ]
                    })(
                        <Select onChange={(v: RolesEnum) => setSelectedRole(v)}>
                            {isAdmin && (
                                <Option value={RolesEnum.Admin}>
                                    {RolesEnum.Admin}
                                </Option>
                            )}
                            {isAdmin && (
                                <Option value={RolesEnum.CoverageOperator}>
                                    {RolesEnum.CoverageOperator}
                                </Option>
                            )}
                            <Option value={RolesEnum.GasStationAdmin}>
                                {RolesEnum.GasStationAdmin}
                            </Option>
                            <Option value={RolesEnum.Seller}>
                                {RolesEnum.Seller}
                            </Option>
                        </Select>
                    )}
                </FormItem>
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
                <FormItem
                    {...formItemLayout}
                    label="Nombre de Usuario"
                    hasFeedback
                >
                    {getFieldDecorator("username", {
                        rules: [
                            {
                                required: true,
                                message: "Debe ingresar el nombre del usuario"
                            }
                        ]
                    })(<Input />)}
                </FormItem>
                <FormItem style={{ position: "relative" }} {...formItemLayout} label="Contraseña" hasFeedback>
                    {getFieldDecorator("password", {
                        rules: [
                            {
                                required: true,
                                message: "Debe ingresar la contraseña"
                            }
                        ]
                    })(
                        <Input type={isPasswordHidden ? 'password' : 'text'} />
                    )}
                    <PasswordShower onClick={() => toggleIsPasswordHidden()}>
                        <img src={(isPasswordHidden ? showPassIcon : hidePassIcon) as any} />
                    </PasswordShower>
                </FormItem>
                {(selectedRole === RolesEnum.GasStationAdmin ||
                    selectedRole === RolesEnum.Seller) && (
                        <FormItem
                            {...formItemLayout}
                            label="Estacion de Servicio"
                            hasFeedback
                        >
                            {getFieldDecorator("gasStationId", {
                                rules: [
                                    {
                                        required: true,
                                        message:
                                            "Debe ingresar la estacion de servicio"
                                    }
                                ]
                            })(
                                <Select>
                                    {gasStations
                                        ?.filter(
                                            g =>
                                                !gasStationId ||
                                                g.id === gasStationId
                                        )
                                        ?.map(g => (
                                            <Option key={g.id} value={g.id}>
                                                {g.name}
                                            </Option>
                                        ))}
                                </Select>
                            )}
                        </FormItem>
                    )}

                <FormItem style={{ textAlign: "center" }}>
                    <Button type="primary" htmlType="submit">
                        Guardar
                    </Button>
                </FormItem>
            </Form>
        );
    }
);

const UsersForm = Form.create<FormProps<Partial<IUserModel>>>()(UserFormFields);
export default UsersForm;
