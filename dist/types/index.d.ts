import type { Config } from 'tailwindcss';
import tailwindPlugin from 'tailwindcss/plugin.js';
type PossiblyInvoked<T extends (...args: any[]) => any> = T | ReturnType<T>;
type TailwindPluginBase = typeof tailwindPlugin;
type TailwindPlugin = ReturnType<TailwindPluginBase> | PossiblyInvoked<ReturnType<TailwindPluginBase['withOptions']>>;
type TurbinePluginBase = {
    transform?: (config: NormalizedConfig) => NormalizedConfig;
    plugins?: TailwindPlugin[];
};
export type TurbinePlugin = TurbinePluginBase | ((...params: any[]) => TurbinePluginBase);
type Plugin = TurbinePlugin | TailwindPlugin;
type NonNullableTheme = NonNullable<Config['theme']>;
interface NormalizedTheme extends NonNullableTheme {
    supports: NonNullable<NonNullableTheme['supports']>;
    data: NonNullable<NonNullableTheme['data']>;
    colors: NonNullable<NonNullableTheme['colors']>;
    spacing: NonNullable<NonNullableTheme['spacing']>;
    container: NonNullable<NonNullableTheme['container']>;
}
interface NormalizedConfig extends Config {
    safelist: NonNullable<Config['safelist']>;
    blocklist: NonNullable<Config['blocklist']>;
    presets: NonNullable<Config['presets']>;
    theme: NormalizedTheme;
    plugins: NonNullable<Config['plugins']>;
}
declare const Turbine: {
    build({ config: CONFIG_RAW, plugins, }: {
        config: Config;
        plugins: Plugin[];
    }): NormalizedConfig;
};
export default Turbine;
