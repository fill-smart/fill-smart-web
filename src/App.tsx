import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Environment from "./Environment";
import { ApolloProvider } from "@apollo/react-hooks";
import client from "./ApolloClient";
import { Customers } from "./Customers";

const App: React.FC = () => (
    <ApolloProvider client={client}>
        <div className="App">
            <header className="App-header">
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <p>
                    Environment is{" "}
                    <code>{Environment.isProd ? "Prod" : "Dev"}</code>.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <img src={logo} className="App-logo" alt="logo" />

                <Customers></Customers>
            </header>
        </div>
    </ApolloProvider>
);
export default App;
