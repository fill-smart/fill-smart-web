import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Input from "../../../components/uielements/input";
import Checkbox from "../../../components/uielements/checkbox";
import Button from "../../../components/uielements/button";
import logo from "../../../assets/images/logo_blue.png";
import { palette } from "styled-theme";
import SignInStyleWrapper from "./SignIn.styles";
import * as hidePassIcon from "../../../assets/icons/hide_pass_icon.png";
import * as showPassIcon from "../../../assets/icons/show_pass_icon.png";

import useLogin from "../../../hooks/use-login.hook";
import { i18n } from "../../../i18n/i18n";
import styled from "styled-components";

const PasswordShower = styled.a`
    position:absolute;
    right: 10px;
    top:10px;
`

const SignIn = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordHidden, setIsPasswordHidden] = useState(true)
    const { isAuthenticated, doLogin, error } = useLogin();
    const history = useHistory();
    useEffect(() => {
        if (isAuthenticated) {
            history.push("/fillsmart");
        }
    }, [isAuthenticated]);

    const handleLogin = (e: Event) => {
        if (!isAuthenticated) {
            doLogin(username, password);
        }
    };

    const toggleIsPasswordHidden = () => {
        setIsPasswordHidden(!isPasswordHidden)
    }

    return (
        <SignInStyleWrapper className="isoSignInPage">
            <div className="isoLoginContentWrapper">
                <div className="isoLoginContent">
                    <div className="isoLogoWrapper">
                        <Link to="/fillsmart">
                            <img src={logo} />
                        </Link>
                    </div>
                    <div className="isoSignInForm">
                        <form>
                            <div className="isoInputWrapper">
                                <Input
                                    size="large"
                                    placeholder={i18n().Authentication.Username()}
                                    autoComplete="true"
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="isoInputWrapper" style={{ position: "relative" }}>

                                <Input
                                    size="large"
                                    type={isPasswordHidden ? 'password' : 'text'}
                                    placeholder={i18n().Authentication.Password()}
                                    autoComplete="false"
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => setPassword(e.target.value)}
                                />
                                <PasswordShower onClick={() => toggleIsPasswordHidden()}>
                                    <img src={(isPasswordHidden ? showPassIcon : hidePassIcon) as any} />
                                </PasswordShower>
                            </div>
                            {error && (
                                <div className="ant-form-explain">
                                    <span style={{ color: "#f64744" }}>
                                        Usuario o contraseña incorrectos.
                                    </span>
                                </div>
                            )}

                            <div className="isoInputWrapper isoLeftRightComponent">
                                <Checkbox>
                                    {i18n().Authentication.RememberMe()}
                                </Checkbox>
                                <Button type="primary" onClick={handleLogin}>
                                    {i18n().Authentication.SignIn()}
                                </Button>
                            </div>
                        </form>
                        <div className="isoInputWrapper isoOtherLogin"></div>
                        <div className="isoCenterComponent isoHelperWrapper">
                            <Link
                                to="/forgotpassword"
                                className="isoForgotPass"
                            >
                                {i18n().Authentication.ForgotPassword()}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </SignInStyleWrapper>
    );
};

export default SignIn;
