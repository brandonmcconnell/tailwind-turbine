function n(n,r){(null==r||r>n.length)&&(r=n.length);for(var t=0,e=new Array(r);t<r;t++)e[t]=n[t];return e}function r(n){return"handler"in n&&"function"==typeof n.handler}function t(n){return!!r(n)||!("function"!=typeof n||!r(n({})))}function e(n){return"transform"in n&&"function"==typeof n.transform}function o(n){return!!e(n)||!("function"!=typeof n||!e(n({})))}var i={build:function(r){for(var e,i=r.config,u=0,a=function(r,t){var e="undefined"!=typeof Symbol&&r[Symbol.iterator]||r["@@iterator"];if(e)return(e=e.call(r)).next.bind(e);if(Array.isArray(r)||(e=function(r,t){if(r){if("string"==typeof r)return n(r,t);var e=Object.prototype.toString.call(r).slice(8,-1);return"Object"===e&&r.constructor&&(e=r.constructor.name),"Map"===e||"Set"===e?Array.from(r):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?n(r,t):void 0}}(r))){e&&(r=e);var o=0;return function(){return o>=r.length?{done:!0}:{done:!1,value:r[o++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(r.plugins);!(e=a()).done;){var l=e.value;if(t(l)){var f;null!=(f=i).plugins||(f.plugins=[]),i.plugins.push(l)}else{if(!o(l))throw new Error("Invalid Turbine plugin at position "+u+", did not match Tailwind CSS or Turbine plugin.");var p,c,s="function"==typeof l?l():l,d=s.transform,y=s.plugins;d&&(i=d(i)),y&&(null!=(p=i).plugins||(p.plugins=[]),(c=i.plugins).push.apply(c,y))}u++}return i}};export{i as default};
//# sourceMappingURL=index.module.js.map
