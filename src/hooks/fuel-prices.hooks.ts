import useCurrentFuelPrices from "./use-current-fuel-prices.hook";
import useFuelPrices from "./use-fuel-prices.hook";

export const FuelPricesHooks = {
    getCurrent: useCurrentFuelPrices,
    getAll: useFuelPrices
};
