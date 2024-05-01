import type { Config } from 'tailwindcss';
import tailwindPlugin from 'tailwindcss/plugin.js';
type PossiblyInvoked<T extends (...args: any[]) => any> = T | ReturnType<T>;
type TailwindPluginBase = typeof tailwindPlugin;
type TailwindPlugin = ReturnType<TailwindPluginBase> | PossiblyInvoked<ReturnType<TailwindPluginBase['withOptions']>>;
type TurbinePluginBase = {
    transform?: (config: Partial<Config>) => Partial<Config>;
    plugins?: TailwindPlugin[];
};
export type TurbinePlugin = TurbinePluginBase | ((...params: any[]) => TurbinePluginBase);
type Plugin = TurbinePlugin | TailwindPlugin;
declare const Turbine: {
    build({ config, plugins }: {
        config: Partial<Config>;
        plugins: Plugin[];
    }): import("tailwindcss/types/config").Config;
};
export default Turbine;
