import type { Config } from 'tailwindcss';
import tailwindPlugin from 'tailwindcss/plugin.js';

// Plugin Types
type TailwindPluginBase = typeof tailwindPlugin;
type TailwindPlugin = ReturnType<TailwindPluginBase | TailwindPluginBase['withOptions']>;
type TurbinePluginBase = {
  transform?: (config: Partial<Config>) => Partial<Config>;
  plugins?: TailwindPlugin[];
};
export type TurbinePlugin = TurbinePluginBase | (<T = unknown>(...params: T[]) => TurbinePluginBase);
type Plugin = TurbinePlugin | TailwindPlugin;

// Tailwind Plugin Type Guard
function hasTailwindHandler(plugin: Plugin) {
  return 'handler' in plugin && typeof plugin.handler === 'function';
}
function isTailwindPlugin(plugin: Plugin): plugin is TailwindPlugin {
  if (hasTailwindHandler(plugin)) return true;
  if (typeof plugin === 'function' && hasTailwindHandler(plugin({}))) return true;
  return false;
}

// Turbine Plugin Type Guard
function hasTurbineTransform(plugin: Plugin) {
  return 'transform' in plugin && typeof plugin.transform === 'function';
}
function isTurbinePlugin(plugin: Plugin): plugin is TurbinePlugin {
  if (hasTurbineTransform(plugin)) return true;
  if (typeof plugin === 'function' && hasTurbineTransform(plugin({}))) return true;
  return false;
}

// Turbine Plugin Builder
const Turbine = {
  build({ config, plugins }: { config: Partial<Config>; plugins: Plugin[] }) {
    let i = 0;
    for (const plugin of plugins) {
      if (isTailwindPlugin(plugin)) {
        config.plugins ??= [];
        config.plugins.push(plugin);
      } else if (isTurbinePlugin(plugin)) {
        const { transform, plugins } = typeof plugin === 'function' ? plugin() : plugin;
        if (transform) {
          config = transform(config);
        }
        if (plugins) {
          config.plugins ??= [];
          config.plugins.push(...plugins);
        }
      } else {
        throw new Error(`Invalid Turbine plugin at position ${i}, did not match Tailwind CSS or Turbine plugin.`);
      }
      i++;
    }
    return config as Config;
  },
};

export default Turbine;
