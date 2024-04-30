import { type Config } from 'tailwindcss';
import tailwindPlugin from 'tailwindcss/plugin.js';
type TailwindPluginBase = typeof tailwindPlugin;
type TailwindPlugin = ReturnType<TailwindPluginBase | TailwindPluginBase['withOptions']>;
type TurbinePluginBase = {
    transform?: (config: Partial<Config>) => Partial<Config>;
    plugins?: TailwindPlugin[];
};
export type TurbinePlugin = TurbinePluginBase | (<T = unknown>(...params: T[]) => TurbinePluginBase);
type Plugin = TurbinePlugin | TailwindPlugin;
declare const Turbine: {
    build({ config, plugins }: {
        config: Partial<Config>;
        plugins: Plugin[];
    }): import("tailwindcss/types/config").Config;
};
export default Turbine;
