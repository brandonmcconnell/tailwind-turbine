import type { Config } from 'tailwindcss';
import type { ResolvableTo } from 'tailwindcss/types/config.d.ts';
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
    content: NonNullable<Config['content']>;
    safelist: NonNullable<Config['safelist']>;
    blocklist: NonNullable<Config['blocklist']>;
    presets: NonNullable<Config['presets']>;
    theme: NormalizedTheme;
    plugins: NonNullable<Config['plugins']>;
}
export declare const build: ({ config: CONFIG_RAW, plugins, }: {
    config: Partial<Config>;
    plugins: Plugin[];
}) => NormalizedConfig;
type ResolvableToFn<T> = Extract<ResolvableTo<T>, (...args: any[]) => any>;
type ResolvableToParameters<T> = Parameters<ResolvableToFn<T>>;
type PluginUtils<T> = ResolvableToParameters<T>[0];
export declare const resolve: <T, U>(value: ResolvableTo<T>, callback: (resolvedValue: T) => U) => U | ((utils: PluginUtils<T>) => U);
export {};
