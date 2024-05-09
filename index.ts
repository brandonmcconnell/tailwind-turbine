import type { Config } from 'tailwindcss';
import type { ResolvableTo } from 'tailwindcss/types/config.d.ts';
import tailwindPlugin from 'tailwindcss/plugin.js';

type PossiblyInvoked<T extends (...args: any[]) => any> = T | ReturnType<T>;

// Plugin Types
type TailwindPluginBase = typeof tailwindPlugin;
type TailwindPlugin = ReturnType<TailwindPluginBase> | PossiblyInvoked<ReturnType<TailwindPluginBase['withOptions']>>;
type TurbinePluginBase = {
  transform?: (config: NormalizedConfig) => NormalizedConfig;
  plugins?: TailwindPlugin[];
};
export type TurbinePlugin = TurbinePluginBase | ((...params: any[]) => TurbinePluginBase);
type Plugin = TurbinePlugin | TailwindPlugin;

// Tailwind Plugin Type Guard
function hasTailwindHandler(plugin: Plugin) {
  return 'handler' in plugin && typeof plugin.handler === 'function';
}
function isTailwindPlugin(plugin: Plugin): plugin is TailwindPlugin {
  const p = typeof plugin === 'function' ? plugin({}) : plugin;
  return p && hasTailwindHandler(p);
}

// Turbine Plugin Type Guard
function hasTurbineTransform(plugin: Plugin) {
  return 'transform' in plugin && typeof plugin.transform === 'function';
}
function hasTurbinePlugins(plugin: Plugin) {
  return 'plugins' in plugin && Array.isArray(plugin.plugins) && plugin.plugins.every(isTailwindPlugin);
}
function isTurbinePlugin(plugin: Plugin): plugin is TurbinePlugin {
  const p = typeof plugin === 'function' ? plugin({}) : plugin;
  return p && (hasTurbineTransform(p) || hasTurbinePlugins(p));
}

type NonNullableTheme = NonNullable<Config['theme']>;
interface NormalizedTheme extends NonNullableTheme {
  // Responsiveness
  supports: NonNullable<NonNullableTheme['supports']>;
  data: NonNullable<NonNullableTheme['data']>;
  // Reusable base configs
  colors: NonNullable<NonNullableTheme['colors']>;
  spacing: NonNullable<NonNullableTheme['spacing']>;
  // Components
  container: NonNullable<NonNullableTheme['container']>;
}

interface NormalizedThemeWithExtend extends NormalizedTheme {
  extend: NormalizedTheme;
}

interface NormalizedConfig extends Config {
  content: NonNullable<Config['content']>;
  safelist: NonNullable<Config['safelist']>;
  blocklist: NonNullable<Config['blocklist']>;
  presets: NonNullable<Config['presets']>;
  theme: NormalizedThemeWithExtend;
  plugins: NonNullable<Config['plugins']>;
}

const createNormalizedThemeObject = (): NormalizedTheme => ({
  supports: {},
  data: {},
  colors: {},
  spacing: {},
  container: {},
});

const normalizeConfig = (config: Partial<Config> | undefined = {}): NormalizedConfig => {
  if (
    !config.content ||
    (Array.isArray(config.content) && config.content.length === 0) ||
    (!Array.isArray(config.content) && config.content.files.length === 0)
  ) {
    console.warn(
      'Empty `content` or `content.files` value found in `config`. This may yield unexpected results, as your project files may not be scanned by Tailwind CSS.'
    );
  }
  config.content = {
    files: Array.isArray(config.content) ? config.content : [],
    ...(config.content && !Array.isArray(config.content) ? config.content : {}),
  } satisfies NormalizedConfig['content'];
  config.safelist ??= [] satisfies NormalizedConfig['safelist'];
  config.blocklist ??= [] satisfies NormalizedConfig['blocklist'];
  config.presets ??= [] satisfies NormalizedConfig['presets'];
  config.theme = {
    ...createNormalizedThemeObject(),
    ...(config.theme ?? {}),
    extend: {
      ...createNormalizedThemeObject(),
      ...(config.theme?.extend ?? {}),
    } satisfies NormalizedTheme,
  } satisfies NormalizedThemeWithExtend;
  config.plugins ??= [] satisfies NormalizedConfig['plugins'];
  return config as NormalizedConfig;
};

// Turbine Plugin Builder
export const build = ({
  config: CONFIG_RAW,
  plugins,
  // reporting, // Coming soon 👀
}: {
  config: Partial<Config>;
  plugins: Plugin[];
  // reporting?: boolean;
}) => {
  let i = 0;
  let config = normalizeConfig(CONFIG_RAW);
  for (const plugin of plugins) {
    if (isTailwindPlugin(plugin)) {
      config.plugins.push(plugin);
    } else if (isTurbinePlugin(plugin)) {
      const { transform, plugins } = typeof plugin === 'function' ? plugin() : plugin;
      if (transform) {
        config = transform(config);
      }
      if (plugins) {
        config.plugins.push(
          ...plugins.filter((plugin, j) => {
            if (isTailwindPlugin(plugin)) return true;
            console.warn(
              `Invalid Tailwind CSS plugin found at position ${j} in Turbine plugin at position ${i}, skipping.`
            );
            return false;
          })
        );
      }
    } else {
      throw new Error(`Invalid Turbine plugin at position ${i}, did not match Tailwind CSS or Turbine plugin.`);
    }
    i++;
  }
  return config as NormalizedConfig;
};

type ResolvableToFn<T> = Extract<ResolvableTo<T>, (...args: any[]) => any>;
type ResolvableToParameters<T> = Parameters<ResolvableToFn<T>>;
type PluginUtils<T> = ResolvableToParameters<T>[0];

export const resolve = <T, U>(value: ResolvableTo<T>, callback: (resolvedValue: T) => U) =>
  typeof value === 'function'
    ? (utils: PluginUtils<T>) => callback((value as ResolvableToFn<T>)(utils))
    : callback(value);
