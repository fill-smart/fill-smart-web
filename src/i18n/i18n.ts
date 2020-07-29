import strings_en from "./strings_en.json";
import strings_es from "./strings_es.json";
import { ILocalizedAvailableStrings } from "./localized-available-strings.js";

const localizedStrings: { [locale: string]: ILocalizedAvailableStrings } = {
    es: strings_es,
    en: strings_en
};

export const i18n = (locale?: LocalesEnum) => {
    const userLocale = locale ?? defaultLocale();
    const localized = localizedStrings[userLocale];
    return {
        Authentication: {
            Hello: (name: string) => {
                return replacePlaceholders(localized.hello, name);
            },
            PriceOfProduct: (
                productName: string,
                currency: string,
                price: string
            ) => {
                return replacePlaceholders(
                    localized.productPrice,
                    productName,
                    currency,
                    price
                );
            },
            NoParams: () => {
                return localized.noParams;
            },
            ForgotPassword: () => {
                return localized.forgotPassword;
            },
            RememberMe: () => {
                switch (userLocale) {
                    case LocalesEnum.EN:
                        return `Remember Me`;
                    case LocalesEnum.ES:
                        return `Recordarme`;
                    default:
                        throw "Language not supported";
                }
            },
            SignIn: () => {
                return localized.signIn;
            },
            Username: () => {
                return localized.username;
            },
            Password: () => {
                return localized.password;
            }
        }
    };
};

const replacePlaceholders = (string: string, ...args: any[]) => {
    let replaced = string;
    args.map((arg, index) => {
        replaced = replaced.replace(`{${index}}`, arg);
    });
    return replaced;
};

export enum LocalesEnum {
    ES = "es",
    EN = "en"
}
export const defaultLocale = () =>
    (navigator.language || navigator.languages[0]).split("-")[0].toLowerCase();
