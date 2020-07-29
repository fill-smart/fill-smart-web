import React, { lazy, Suspense } from "react";
import { Route, useRouteMatch, Switch } from "react-router-dom";
import Loader from "../../components/utility/loader";
import { PRIVATE_ROUTE } from "../../route.constants";

const routes = [
    {
        path: "",
        component: lazy(() => import("../DashboardHomePage")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.FUEL_TYPES,
        component: lazy(() => import("../FuelTypes/FuelTypes")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.STATIONS,
        component: lazy(() => import("../Stations/Stations")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.INVESTMENT_TYPES,
        component: lazy(() => import("../InvestmentTypes/InvestmentTypes")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.QUOTES,
        component: lazy(() => import("../Quotes/Quotes")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.INVESTMENTS,
        component: lazy(() => import("../Investments/Investments")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.NOTIFICATIONS,
        component: lazy(() => import("../Notifications/Notifications")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.CASH_DEPOSITS,
        component: lazy(() => import("../CashDeposits/CashDeposits")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.USERS,
        component: lazy(() => import("../Users/Users")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.CUSTOMERS,
        component: lazy(() => import("../Customers/Customers")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.CUSTOMERS_MOVEMENTS,
        component: lazy(() => import("../Customers/CustomerMovements")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.WALLETS,
        component: lazy(() => import("../Wallets/Wallets")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.FUEL_PRICES,
        component: lazy(() => import("../FuelPrices/FuelPrices")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.OPERATIONS,
        component: lazy(() => import("../Operations/Operations")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.ALL_OPERATIONS,
        component: lazy(() => import("../OperationsAdmin/OperationsAdmin")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.OPERATIONS_TOTALS_BY_FUEL_PRICE,
        component: lazy(() => import("../OperationsTotalsByFuelType/OperationsTotalsByFuelType")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.PUMPS,
        component: lazy(() => import("../Pumps/Pumps")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.TANKS,
        component: lazy(() => import("../GasTanks/GasTanks")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.GAS_SUPPLIER,
        component: lazy(() => import("../Stations")),
        exact: true
    },
    {
        path: PRIVATE_ROUTE.GAS_SUPPLIER_BY_ID,
        component: lazy(() => import("../GasSupplier")),
        exact: true
    },
    {
        path: "gassupplier/gassupplier/payment-request",
        component: lazy(() => import("../PaymentRequest")),
        exact: true
    },

    {
        path: "gas-tanks/:pumpId",
        component: lazy(() => import("../GasTanks/GasTanks")),
        exact: true
    },

    {
        path: PRIVATE_ROUTE.BLANK_PAGE,
        component: lazy(() => import("../BlankPage"))
    },
    {
        path: PRIVATE_ROUTE.AUTH_CHECK,
        component: lazy(() => import("../AuthCheck"))
    },
    {
        path: PRIVATE_ROUTE.GRACE_PERIOD,
        component: lazy(() => import("../Parameters/GracePeriodEdit"))
    },
    {
        path: PRIVATE_ROUTE.EXCHANGE_GRACE_PERIOD,
        component: lazy(() => import("../Parameters/ExchangeGracePeriodEdit"))
    },
    {
        path: PRIVATE_ROUTE.PURCHASE_MAX_LITRES,
        component: lazy(() => import("../Parameters/PurchaseMaxLitresEdit"))
    },
    {
        path: PRIVATE_ROUTE.WITHDRAWAL_MAX_AMOUNT,
        component: lazy(() => import("../Parameters/WithdrawalMaxAmountEdit"))
    },
    {
        path: PRIVATE_ROUTE.WITHDRAWAL_AMOUNT_MULTIPLE,
        component: lazy(() => import("../Parameters/WithdrawalAmountMultipleEdit"))
    },
    {
        path: PRIVATE_ROUTE.PAYMENT_IN_STORE_LIMIT,
        component: lazy(() => import("../Parameters/PaymentInStoreLimitEdit"))
    },
    {
        path: PRIVATE_ROUTE.ACCOUNT_MAX_LITRES_LIMIT,
        component: lazy(() => import("../Parameters/AccountMaxLitresEdit"))
    },
    {
        path: PRIVATE_ROUTE.WALLET_MAX_LITRES_LIMIT,
        component: lazy(() => import("../Parameters/WalletMaxLitresEdit"))
    },
    {
        path: PRIVATE_ROUTE.CONTACT_EMAILS,
        component: lazy(() => import("../Parameters/ContactEmailEdit"))
    },
    {
        path: PRIVATE_ROUTE.TRANSFERS,
        component: lazy(() => import("../TransferWithdrawals/TransferWithdrawals")),
        exact: true
    },
];

export default function AppRouter() {
    const { url } = useRouteMatch();
    return (
        <Suspense fallback={<Loader />}>
            <Switch>
                {routes.map((route, idx) => (
                    <Route
                        exact={route.exact}
                        key={idx}
                        path={`${url}/${route.path}`}
                    >
                        <route.component />
                    </Route>
                ))}
            </Switch>
        </Suspense>
    );
}
