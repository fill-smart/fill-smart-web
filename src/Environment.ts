export interface IEnvironment extends IConfigurableEnvironment {
    apiUrl: string;
    isProd: boolean;
}

export interface IConfigurableEnvironment {
    apiUrl: string;
}

const devEnvironment: IConfigurableEnvironment = {
    apiUrl: "http://localhost:4000/graphql"
};

const prodEnvironment: IConfigurableEnvironment = {
    apiUrl: "http://localhost:4000/graphql"
};

const loadEnvironment = (): IConfigurableEnvironment => {
    return process.env.NODE_ENV === "production"
        ? prodEnvironment
        : devEnvironment;
};

const Environment: IEnvironment = Object.assign(loadEnvironment(), {
    isProd: process.env.NODE_ENV === "production"
});

export default Environment;
