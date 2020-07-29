import React from "react";
import { ConfigProvider } from "antd";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import themes from "./config/theme/theme.config";
import AppLocale from "./config/translation";

export default function AppProvider({ children }) {
    const { locale } = useSelector(
        (state: any) => state.LanguageSwitcher.language
    );
    const { themeName } = useSelector(
        (state: any) => state.ThemeSwitcher.changeThemes
    );
    const currentAppLocale = AppLocale[locale];
    return (
        <ConfigProvider locale={currentAppLocale.antd}>
            <IntlProvider
                locale={currentAppLocale.locale}
                messages={currentAppLocale.messages}
            >
                <ThemeProvider theme={themes[themeName]}>
                    {children}
                </ThemeProvider>
            </IntlProvider>
        </ConfigProvider>
    );
}
