function n(){return n=Object.assign?Object.assign.bind():function(n){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var e in r)Object.prototype.hasOwnProperty.call(r,e)&&(n[e]=r[e])}return n},n.apply(this,arguments)}function t(n,t){(null==t||t>n.length)&&(t=n.length);for(var r=0,e=new Array(t);r<t;r++)e[r]=n[r];return e}function r(n){var t="function"==typeof n?n({}):n;return t&&function(n){return"handler"in n&&"function"==typeof n.handler}(t)}function e(n){var t="function"==typeof n?n({}):n;return t&&(function(n){return"transform"in n&&"function"==typeof n.transform}(t)||function(n){return"plugins"in n&&Array.isArray(n.plugins)&&n.plugins.every(r)}(t))}var o=function(o){for(var i,a=o.plugins,u=0,l=function(t){var r,e,o,i,a,u,l;return void 0===t&&(t={}),(!t.content||Array.isArray(t.content)&&0===t.content.length||!Array.isArray(t.content)&&0===t.content.files.length)&&console.warn("Empty `content` or `content.files` value found in `config`. This may yield unexpected results, as your project files may not be scanned by Tailwind CSS."),t.content=n({files:Array.isArray(t.content)?t.content:[]},t.content&&!Array.isArray(t.content)?t.content:{}),null!=(r=t).safelist||(r.safelist=[]),null!=(e=t).blocklist||(e.blocklist=[]),null!=(o=t).presets||(o.presets=[]),t.theme=n({},{supports:{},data:{},colors:{},spacing:{},container:{}},null!=(i=t.theme)?i:{},{extend:n({},{supports:{},data:{},colors:{},spacing:{},container:{}},null!=(a=null==(u=t.theme)?void 0:u.extend)?a:{})}),null!=(l=t).plugins||(l.plugins=[]),t}(o.config),s=function(n,r){var e="undefined"!=typeof Symbol&&n[Symbol.iterator]||n["@@iterator"];if(e)return(e=e.call(n)).next.bind(e);if(Array.isArray(n)||(e=function(n,r){if(n){if("string"==typeof n)return t(n,r);var e=Object.prototype.toString.call(n).slice(8,-1);return"Object"===e&&n.constructor&&(e=n.constructor.name),"Map"===e||"Set"===e?Array.from(n):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?t(n,r):void 0}}(n))){e&&(n=e);var o=0;return function(){return o>=n.length?{done:!0}:{done:!1,value:n[o++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(a);!(i=s()).done;){var c=i.value;if(r(c))l.plugins.push(c);else{if(!e(c))throw new Error("Invalid Turbine plugin at position "+u+", did not match Tailwind CSS or Turbine plugin.");var f,p="function"==typeof c?c():c,y=p.transform,d=p.plugins;y&&(l=y(l)),d&&(f=l.plugins).push.apply(f,d.filter(function(n,t){return!!r(n)||(console.warn("Invalid Tailwind CSS plugin found at position "+t+" in Turbine plugin at position "+u+", skipping."),!1)}))}u++}return l},i=function(n,t){return"function"==typeof n?function(r){return t(n(r))}:t(n)},a=function(n,t,r){void 0===r&&(r=!1),t(n,!1),r||n.extend||(n.extend={supports:{},data:{},colors:{},spacing:{},container:{}}),n.extend&&t(n.extend,!0)};export{o as build,i as resolvePluginUtils,a as resolveThemeExtend};
//# sourceMappingURL=index.module.js.map
