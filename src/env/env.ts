export interface IEnvironmentalConfig {
  serverUrl: string;
  wsUrl: string;
}

let Environment = (): IEnvironmentalConfig => {
  switch (process.env.REACT_APP_ENV) {
    case "prod": {
      return {
        serverUrl: "https://admin.fillsmart.com.ar/graphql",
        wsUrl: "wss://admin.fillsmart.com.ar/graphql",
      };
    }
    case "staging": {
      return {
        serverUrl: "https://fillsmart-staging.silentiumapps.com/graphql",
        wsUrl: "wss://fillsmart-staging.silentiumapps.com/graphql",
      };
    }
    case "dev":
    default: {
      return {
        serverUrl: "http://localhost:4000/graphql",
        wsUrl: "ws://localhost:4000/graphql",
      };
    }
  }
};

export default Environment;
