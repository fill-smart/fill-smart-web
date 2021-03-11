import { PRIVATE_ROUTE } from "../../route.constants";
import { useContext } from "react";
import { SecurityContext, RolesEnum } from "../../contexts/security.context";
const menuOptions = [
  {
    key: "",
    label: "Tablero",
    leftIcon: "ion-ios-monitor",
    roles: [RolesEnum.Admin]
  },
  {
    key: PRIVATE_ROUTE.FUEL_TYPES,
    label: "Combustibles",
    leftIcon: "ion-android-car",
    roles: [RolesEnum.Admin]
  },
  {
    key: PRIVATE_ROUTE.STATIONS,
    label: "Estaciones de servicio",
    leftIcon: "ion-grid",
    roles: [RolesEnum.Admin]
  },
  {
    key: PRIVATE_ROUTE.CUSTOMERS,
    label: "Clientes",
    leftIcon: "ion-android-contacts",
    roles: [RolesEnum.Admin]
  },
  {
    key: PRIVATE_ROUTE.FUEL_PRICES,
    label: "Precio de Combustibles",
    leftIcon: "ion-social-usd",
    roles: [RolesEnum.GasStationAdmin]
  },
  {
    key: PRIVATE_ROUTE.OPERATIONS,
    label: "Operaciones",
    leftIcon: "ion-android-expand",
    roles: [RolesEnum.GasStationAdmin, RolesEnum.Seller]
  },
  {
    key: PRIVATE_ROUTE.OPERATIONS_TOTALS_BY_FUEL_PRICE,
    label: "Vendidos / Entregados",
    leftIcon: "ion-arrow-graph-up-right",
    roles: [RolesEnum.Admin]
  },
  {
    key: PRIVATE_ROUTE.ALL_OPERATIONS,
    label: "Operaciones",
    leftIcon: "ion-android-expand",
    roles: [RolesEnum.Admin]
  },
  {
    key: PRIVATE_ROUTE.GAS_SUPPLIER,
    label: "Surtidores",
    leftIcon: "ion-ios-barcode",
    roles: [RolesEnum.GasStationAdmin, RolesEnum.Seller]
  },
  {
    key: "Coverage",
    label: "Cobertura",
    leftIcon: "ion-cash",
    roles: [RolesEnum.Admin, RolesEnum.CoverageOperator],
    children: [
      {
        key: PRIVATE_ROUTE.INVESTMENTS,
        label: "Cobertura"
      },
      {
        key: PRIVATE_ROUTE.INVESTMENT_TYPES,
        label: "Tipos de Inversiones"
      },
      {
        key: PRIVATE_ROUTE.QUOTES,
        label: "Cotizaciones"
      }
    ]
  },

  {
    key: PRIVATE_ROUTE.NOTIFICATIONS,
    label: "Notificaciones",
    leftIcon: "ion-android-chat",
    roles: [RolesEnum.Admin, RolesEnum.GasStationAdmin]
  },
  {
    key: PRIVATE_ROUTE.CASH_DEPOSITS,
    label: "Depositos en Efectivo",
    leftIcon: "ion-arrow-swap",
    roles: [RolesEnum.Admin, RolesEnum.GasStationAdmin]
  },
  {
    key: PRIVATE_ROUTE.TRANSFERS,
    label: "Transferencias",
    leftIcon: "ion-cash",
    roles: [RolesEnum.Admin]
  },
  {
    key: PRIVATE_ROUTE.USERS,
    label: "Usuarios",
    leftIcon: "ion-person-stalker",
    roles: [RolesEnum.Admin, RolesEnum.GasStationAdmin]
  },
  {
    key: "",
    label: "Autorizaciones",
    leftIcon: "ion-android-menu",
    roles: [RolesEnum.Seller]
  },
  {
    key: "Parameters",
    label: "Parametros",
    roles: [RolesEnum.Admin],
    leftIcon: "ion-android-options",
    children: [
      {
        key: PRIVATE_ROUTE.GRACE_PERIOD,
        label: "Carencia de Compra"
      },
      {
        key: PRIVATE_ROUTE.EXCHANGE_GRACE_PERIOD,
        label: "Carencia de Transferencia"
      },
      {
        key: PRIVATE_ROUTE.PURCHASE_MAX_LITRES,
        label: "Límite de Compra"
      },
      {
        key: PRIVATE_ROUTE.WITHDRAWAL_MAX_AMOUNT,
        label: "Límite de Retiro"
      },
      {
        key: PRIVATE_ROUTE.WITHDRAWAL_AMOUNT_MULTIPLE,
        label: "Unidad Mínima de Retiro"
      },
      {
        key: PRIVATE_ROUTE.PAYMENT_IN_STORE_LIMIT,
        label: "Límite de Pago en Shop"
      },
      {
        key: PRIVATE_ROUTE.CONTACT_EMAILS,
        label: "Emails de contacto"
      },
      {
        key: PRIVATE_ROUTE.ACCOUNT_MAX_LITRES_LIMIT,
        label: "Límite de Litros por Cuenta"
      },
      {
        key: PRIVATE_ROUTE.WALLET_MAX_LITRES_LIMIT,
        label: "Límite de Litros por Billetera"
      },
    ]
  }
];
export const useOptions = () => {
  const [security, _] = useContext(SecurityContext);
  const userRoles = security.user?.roles.map(r => r.name);
  const options = menuOptions.filter(o =>
    o.roles.some(r => userRoles?.includes(r))
  );

  return { options };
};

export default useOptions;
