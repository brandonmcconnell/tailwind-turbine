import type { Config } from 'tailwindcss';
import type { ResolvableTo } from 'tailwindcss/types/config.d.ts';
import tailwindPlugin from 'tailwindcss/plugin.js';
import defaultFullConfig from 'tailwindcss/stubs/config.full.js';

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

const normalizeConfig = (config: Partial<Config> | undefined = {}, options: TurbineOptions): NormalizedConfig => {
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
  if (config.presets.length === 0 && options.defaultPreset) {
    config.presets.push(defaultFullConfig as Config);
  }
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

interface TurbineOptions {
  /** This value determines whether to fall back to the default Tailwind CSS preset when no presets are provided. */
  defaultPreset: boolean;
  // reporting: boolean; // coming soon 👀✨
}

const defaultTurbineOptions: TurbineOptions = {
  defaultPreset: true,
  // reporting: false,
};

// Turbine Plugin Builder
export const build = ({
  config: userDefinedConfig,
  plugins,
  options: userDefinedOptions,
}: {
  config: Partial<Config>;
  plugins?: Plugin[];
  options?: Partial<TurbineOptions>;
}) => {
  const options = { ...defaultTurbineOptions, ...(userDefinedOptions ?? {}) };
  let config = normalizeConfig(userDefinedConfig, options);
  let i = 0;
  for (const plugin of plugins ?? []) {
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

export const extend = <Theme extends NormalizedTheme>(
  theme: Theme,
  callback: (theme: Theme, isExtend: boolean) => unknown,
  createExtendIfMissing = false
) => {
  callback(theme, false);
  if (createExtendIfMissing) {
    if (!theme.extend) theme.extend = createNormalizedThemeObject() as NormalizedTheme;
  }
  if (theme.extend) {
    callback(theme.extend as Theme, true);
  }
};
