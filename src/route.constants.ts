export const PUBLIC_ROUTE = {
  LANDING: "/",
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  FORGET_PASSWORD: "/forgotpassword",
  RESET_PASSWORD: "/resetpassword",
  PAGE_404: "/404",
  PAGE_500: "/500",
  AUTH0_CALLBACK: "/auth0loginCallback"
};

export const PRIVATE_ROUTE = {
  DASHBOARD: "/",

  //**FillSamrt Routes **/

  //**FUEL TYPES */
  FUEL_TYPES: "fuel/types",

  //**STATIONS */
  STATIONS: "stations",
  STATIONS_EDIT: "stations/edit",
  //**END STATIONS */

  //**CUSTOMERS */
  CUSTOMERS: "customers",
  CUSTOMERS_MOVEMENTS: "customers/movements/:documentNumber",

  //**FUEL PRICES */
  FUEL_PRICES: "fuel/prices",

  //**OPERATIONS */
  OPERATIONS: "operations",
  ALL_OPERATIONS: "all/operations",
  OPERATIONS_TOTALS_BY_FUEL_PRICE: "operations/totals_by_fuel_type",

  //**PUMPS**/
  PUMPS: "pumps/:gasStationId",
  PUMPS_EDIT: "pumps/edit",
  //**END PUMPS**/

  /**TANKS**/
  TANKS: "tanks/:gasStationId",

  /**Wallets **/
  WALLETS: "wallets/:customerId",

  GAS_SUPPLIER: "gas-supplier",
  GAS_SUPPLIER_BY_ID: "gassupplier/:pumpId",
  GAS_SUPPLIER_OPERATIONS: "gas-supplier/operations",
  PAYMENT_REQUEST: "gassupplier/payment-request",
  BLANK_PAGE: "blank-page",
  AUTH_CHECK: "auth-check",
  GRACE_PERIOD: "grace-period",
  EXCHANGE_GRACE_PERIOD: "exchange-grace-period",
  PURCHASE_MAX_LITRES: "purchase-max-litres",
  WITHDRAWAL_MAX_AMOUNT: "withdrawal-max-amount",
  WITHDRAWAL_AMOUNT_MULTIPLE: "withdrawal-amount-multiple",
  PAYMENT_IN_STORE_LIMIT: "payment-in-store-limit",
  WALLET_MAX_LITRES_LIMIT: "wallet-max-litres-limit",
  ACCOUNT_MAX_LITRES_LIMIT: "account-max-litres-limit",
  CONTACT_EMAILS: "contact-emails",
  TRANSFERS: "transfers",
  //**End Fill Smart Routes **/

  INVESTMENT_TYPES: "investment/types",
  QUOTES: "quotes",
  INVESTMENTS: "investments",
  NOTIFICATIONS: "notifications",
  CASH_DEPOSITS: "cash-deposits",

  //Users Management
  USERS: "users",

  MAIL: "/inbox",
  SCRUM_BOARD: "/scrum-board",
  CALENDAR: "/calendar",
  GOOGLE_MAP: "/googlemap",
  LEAFLET_MAP: "/leafletmap",
  TABLE: "/table_ant",
  FORM: "/allFormComponent",
  INPUT: "/InputField",
  EDITOR: "/editor",
  FORM_WITH_STEPPERS: "/stepperForms",
  FORM_WITH_VALIDATION: "/FormsWithValidation",
  PROGRESS: "/progress",
  BUTTON: "/button",
  TAB: "/tab",
  AUTOCOMPLETE: "/autocomplete",
  CHECKBOX: "/checkbox",
  RADIOBOX: "/radiobox",
  SELECT: "/selectbox",
  TRANSFER: "/transfer",
  GRID_LAYOUT: "/gridLayout",
  NOTES: "/notes",
  TODO: "/todo",
  ARTICLES: "/articles",
  INVESTORS: "/investors",
  CONTACTS: "/contacts",
  ALERT: "/alert",
  MODAL: "/modal",
  MESSAGE: "/message",
  NOTIFICATION: "/notification",
  POPCONFIRM: "/Popconfirm",
  SPIN: "/spin",
  SHUFFLE: "/shuffle",
  AFFIX: "/affix",
  BREADCRUMB: "/breadcrumb",
  BACK_TO_TOP: "/backToTop",
  DROPDOWN: "/dropdown",
  OP_BADGE: "/op_badge",
  OP_CARD: "/op_card",
  OP_CAROUSEL: "/op_carousel",
  OP_COLLAPSE: "/op_collapse",
  OP_TOOLTIP: "/op_tooltip",
  RATING: "/rating",
  TREE: "/tree",
  OP_TAG: "/op_tag",
  OP_TIMELINE: "/op_timeline",
  OP_POPOVER: "/op_popover",
  GOOGLE_CHART: "/googleChart",
  RECHARTS: "/recharts",
  MENU: "/menu",
  REACT_CHART_2: "/ReactChart2",
  PAGINATION: "/pagination",
  CARD: "/card",
  CART: "/cart",
  CHECKOUT: "/checkout",
  SHOP: "/shop",
  REACT_DATES: "/reactDates",
  CODE_MIRROR: "/codeMirror",
  UPPY: "/uppy",
  DROPZONE: "/dropzone",
  YOUTUBE_SEARCH: "/youtubeSearch",
  FRAPPE_CHART: "/frappeChart",
  INVOICE: "/invoice",
  CHAT: "/chat",
  PROFILE: "/my-profile",
  SWIPER_SLIDER: "/swiperslider"
};
