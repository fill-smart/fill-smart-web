import usePump from "./use-pump.hook";
import usePumpsByGasStations from "./use-pumps-by-gas-station.hook";
import usePumps from "./use-pumps.hook";

export const PumpHooks = {
    getById: usePump,
    getAll: usePumps,
    getByGasStation: usePumpsByGasStations
};
