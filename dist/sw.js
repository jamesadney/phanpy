try{self["workbox:core:7.0.0"]&&_()}catch{}const Z=(s,...e)=>{let t=s;return e.length>0&&(t+=` :: ${JSON.stringify(e)}`),t},ee=Z;class u extends Error{constructor(e,t){const n=ee(e,t);super(n),this.name=e,this.details=t}}const te=s=>new URL(String(s),location.href).href.replace(new RegExp(`^${location.origin}`),"");try{self["workbox:cacheable-response:7.0.0"]&&_()}catch{}class se{constructor(e={}){this._statuses=e.statuses,this._headers=e.headers}isResponseCacheable(e){let t=!0;return this._statuses&&(t=this._statuses.includes(e.status)),this._headers&&t&&(t=Object.keys(this._headers).some(n=>e.headers.get(n)===this._headers[n])),t}}class E{constructor(e){this.cacheWillUpdate=async({response:t})=>this._cacheableResponse.isResponseCacheable(t)?t:null,this._cacheableResponse=new se(e)}}function q(s){s.then(()=>{})}const ne=(s,e)=>e.some(t=>s instanceof t);let B,W;function ae(){return B||(B=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ie(){return W||(W=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const V=new WeakMap,S=new WeakMap,Q=new WeakMap,O=new WeakMap,P=new WeakMap;function re(s){const e=new Promise((t,n)=>{const a=()=>{s.removeEventListener("success",r),s.removeEventListener("error",i)},r=()=>{t(f(s.result)),a()},i=()=>{n(s.error),a()};s.addEventListener("success",r),s.addEventListener("error",i)});return e.then(t=>{t instanceof IDBCursor&&V.set(t,s)}).catch(()=>{}),P.set(e,s),e}function oe(s){if(S.has(s))return;const e=new Promise((t,n)=>{const a=()=>{s.removeEventListener("complete",r),s.removeEventListener("error",i),s.removeEventListener("abort",i)},r=()=>{t(),a()},i=()=>{n(s.error||new DOMException("AbortError","AbortError")),a()};s.addEventListener("complete",r),s.addEventListener("error",i),s.addEventListener("abort",i)});S.set(s,e)}let M={get(s,e,t){if(s instanceof IDBTransaction){if(e==="done")return S.get(s);if(e==="objectStoreNames")return s.objectStoreNames||Q.get(s);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return f(s[e])},set(s,e,t){return s[e]=t,!0},has(s,e){return s instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in s}};function ce(s){M=s(M)}function le(s){return s===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=s.call(T(this),e,...t);return Q.set(n,e.sort?e.sort():[e]),f(n)}:ie().includes(s)?function(...e){return s.apply(T(this),e),f(V.get(this))}:function(...e){return f(s.apply(T(this),e))}}function he(s){return typeof s=="function"?le(s):(s instanceof IDBTransaction&&oe(s),ne(s,ae())?new Proxy(s,M):s)}function f(s){if(s instanceof IDBRequest)return re(s);if(O.has(s))return O.get(s);const e=he(s);return e!==s&&(O.set(s,e),P.set(e,s)),e}const T=s=>P.get(s);function ue(s,e,{blocked:t,upgrade:n,blocking:a,terminated:r}={}){const i=indexedDB.open(s,e),o=f(i);return n&&i.addEventListener("upgradeneeded",c=>{n(f(i.result),c.oldVersion,c.newVersion,f(i.transaction),c)}),t&&i.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),o.then(c=>{r&&c.addEventListener("close",()=>r()),a&&c.addEventListener("versionchange",l=>a(l.oldVersion,l.newVersion,l))}).catch(()=>{}),o}function de(s,{blocked:e}={}){const t=indexedDB.deleteDatabase(s);return e&&t.addEventListener("blocked",n=>e(n.oldVersion,n)),f(t).then(()=>{})}const fe=["get","getKey","getAll","getAllKeys","count"],pe=["put","add","delete","clear"],N=new Map;function F(s,e){if(!(s instanceof IDBDatabase&&!(e in s)&&typeof e=="string"))return;if(N.get(e))return N.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,a=pe.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(a||fe.includes(t)))return;const r=async function(i,...o){const c=this.transaction(i,a?"readwrite":"readonly");let l=c.store;return n&&(l=l.index(o.shift())),(await Promise.all([l[t](...o),a&&c.done]))[0]};return N.set(e,r),r}ce(s=>({...s,get:(e,t,n)=>F(e,t)||s.get(e,t,n),has:(e,t)=>!!F(e,t)||s.has(e,t)}));try{self["workbox:expiration:7.0.0"]&&_()}catch{}const me="workbox-expiration",b="cache-entries",H=s=>{const e=new URL(s,location.href);return e.hash="",e.href};class ge{constructor(e){this._db=null,this._cacheName=e}_upgradeDb(e){const t=e.createObjectStore(b,{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1})}_upgradeDbAndDeleteOldDbs(e){this._upgradeDb(e),this._cacheName&&de(this._cacheName)}async setTimestamp(e,t){e=H(e);const n={url:e,timestamp:t,cacheName:this._cacheName,id:this._getId(e)},r=(await this.getDb()).transaction(b,"readwrite",{durability:"relaxed"});await r.store.put(n),await r.done}async getTimestamp(e){const n=await(await this.getDb()).get(b,this._getId(e));return n==null?void 0:n.timestamp}async expireEntries(e,t){const n=await this.getDb();let a=await n.transaction(b).store.index("timestamp").openCursor(null,"prev");const r=[];let i=0;for(;a;){const c=a.value;c.cacheName===this._cacheName&&(e&&c.timestamp<e||t&&i>=t?r.push(a.value):i++),a=await a.continue()}const o=[];for(const c of r)await n.delete(b,c.id),o.push(c.url);return o}_getId(e){return this._cacheName+"|"+H(e)}async getDb(){return this._db||(this._db=await ue(me,1,{upgrade:this._upgradeDbAndDeleteOldDbs.bind(this)})),this._db}}class we{constructor(e,t={}){this._isRunning=!1,this._rerunRequested=!1,this._maxEntries=t.maxEntries,this._maxAgeSeconds=t.maxAgeSeconds,this._matchOptions=t.matchOptions,this._cacheName=e,this._timestampModel=new ge(e)}async expireEntries(){if(this._isRunning){this._rerunRequested=!0;return}this._isRunning=!0;const e=this._maxAgeSeconds?Date.now()-this._maxAgeSeconds*1e3:0,t=await this._timestampModel.expireEntries(e,this._maxEntries),n=await self.caches.open(this._cacheName);for(const a of t)await n.delete(a,this._matchOptions);this._isRunning=!1,this._rerunRequested&&(this._rerunRequested=!1,q(this.expireEntries()))}async updateTimestamp(e){await this._timestampModel.setTimestamp(e,Date.now())}async isURLExpired(e){if(this._maxAgeSeconds){const t=await this._timestampModel.getTimestamp(e),n=Date.now()-this._maxAgeSeconds*1e3;return t!==void 0?t<n:!0}else return!1}async delete(){this._rerunRequested=!1,await this._timestampModel.expireEntries(1/0)}}const d={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:typeof registration<"u"?registration.scope:""},A=s=>[d.prefix,s,d.suffix].filter(e=>e&&e.length>0).join("-"),_e=s=>{for(const e of Object.keys(d))s(e)},$={updateDetails:s=>{_e(e=>{typeof s[e]=="string"&&(d[e]=s[e])})},getGoogleAnalyticsName:s=>s||A(d.googleAnalytics),getPrecacheName:s=>s||A(d.precache),getPrefix:()=>d.prefix,getRuntimeName:s=>s||A(d.runtime),getSuffix:()=>d.suffix},G=new Set;function ye(s){G.add(s)}class x{constructor(e={}){this.cachedResponseWillBeUsed=async({event:t,request:n,cacheName:a,cachedResponse:r})=>{if(!r)return null;const i=this._isResponseDateFresh(r),o=this._getCacheExpiration(a);q(o.expireEntries());const c=o.updateTimestamp(n.url);if(t)try{t.waitUntil(c)}catch{}return i?r:null},this.cacheDidUpdate=async({cacheName:t,request:n})=>{const a=this._getCacheExpiration(t);await a.updateTimestamp(n.url),await a.expireEntries()},this._config=e,this._maxAgeSeconds=e.maxAgeSeconds,this._cacheExpirations=new Map,e.purgeOnQuotaError&&ye(()=>this.deleteCacheAndMetadata())}_getCacheExpiration(e){if(e===$.getRuntimeName())throw new u("expire-custom-caches-only");let t=this._cacheExpirations.get(e);return t||(t=new we(e,this._config),this._cacheExpirations.set(e,t)),t}_isResponseDateFresh(e){if(!this._maxAgeSeconds)return!0;const t=this._getDateHeaderTimestamp(e);if(t===null)return!0;const n=Date.now();return t>=n-this._maxAgeSeconds*1e3}_getDateHeaderTimestamp(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),a=new Date(t).getTime();return isNaN(a)?null:a}async deleteCacheAndMetadata(){for(const[e,t]of this._cacheExpirations)await self.caches.delete(e),await t.delete();this._cacheExpirations=new Map}}try{self["workbox:navigation-preload:7.0.0"]&&_()}catch{}function be(){return!!(self.registration&&self.registration.navigationPreload)}function Ce(s){be()&&self.addEventListener("activate",e=>{e.waitUntil(self.registration.navigationPreload.enable().then(()=>{s&&self.registration.navigationPreload.setHeaderValue(s)}))})}try{self["workbox:routing:7.0.0"]&&_()}catch{}const z="GET",k=s=>s&&typeof s=="object"?s:{handle:s};class p{constructor(e,t,n=z){this.handler=k(t),this.match=e,this.method=n}setCatchHandler(e){this.catchHandler=k(e)}}class v extends p{constructor(e,t,n){const a=({url:r})=>{const i=e.exec(r.href);if(i&&!(r.origin!==location.origin&&i.index!==0))return i.slice(1)};super(a,t,n)}}class Ee{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",e=>{const{request:t}=e,n=this.handleRequest({request:t,event:e});n&&e.respondWith(n)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&e.data.type==="CACHE_URLS"){const{payload:t}=e.data,n=Promise.all(t.urlsToCache.map(a=>{typeof a=="string"&&(a=[a]);const r=new Request(...a);return this.handleRequest({request:r,event:e})}));e.waitUntil(n),e.ports&&e.ports[0]&&n.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){const n=new URL(e.url,location.href);if(!n.protocol.startsWith("http"))return;const a=n.origin===location.origin,{params:r,route:i}=this.findMatchingRoute({event:t,request:e,sameOrigin:a,url:n});let o=i&&i.handler;const c=e.method;if(!o&&this._defaultHandlerMap.has(c)&&(o=this._defaultHandlerMap.get(c)),!o)return;let l;try{l=o.handle({url:n,request:e,event:t,params:r})}catch(h){l=Promise.reject(h)}const m=i&&i.catchHandler;return l instanceof Promise&&(this._catchHandler||m)&&(l=l.catch(async h=>{if(m)try{return await m.handle({url:n,request:e,event:t,params:r})}catch(I){I instanceof Error&&(h=I)}if(this._catchHandler)return this._catchHandler.handle({url:n,request:e,event:t});throw h})),l}findMatchingRoute({url:e,sameOrigin:t,request:n,event:a}){const r=this._routes.get(n.method)||[];for(const i of r){let o;const c=i.match({url:e,sameOrigin:t,request:n,event:a});if(c)return o=c,(Array.isArray(o)&&o.length===0||c.constructor===Object&&Object.keys(c).length===0||typeof c=="boolean")&&(o=void 0),{route:i,params:o}}return{}}setDefaultHandler(e,t=z){this._defaultHandlerMap.set(t,k(e))}setCatchHandler(e){this._catchHandler=k(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new u("unregister-route-but-not-found-with-method",{method:e.method});const t=this._routes.get(e.method).indexOf(e);if(t>-1)this._routes.get(e.method).splice(t,1);else throw new u("unregister-route-route-not-registered")}}let C;const xe=()=>(C||(C=new Ee,C.addFetchListener(),C.addCacheListener()),C);function R(s,e,t){let n;if(typeof s=="string"){const r=new URL(s,location.href),i=({url:o})=>o.href===r.href;n=new p(i,e,t)}else if(s instanceof RegExp)n=new v(s,e,t);else if(typeof s=="function")n=new p(s,e,t);else if(s instanceof p)n=s;else throw new u("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});return xe().registerRoute(n),n}function K(s,e){const t=new URL(s);for(const n of e)t.searchParams.delete(n);return t.href}async function Re(s,e,t,n){const a=K(e.url,t);if(e.url===a)return s.match(e,n);const r=Object.assign(Object.assign({},n),{ignoreSearch:!0}),i=await s.keys(e,r);for(const o of i){const c=K(o.url,t);if(a===c)return s.match(o,n)}}class De{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}async function ke(){for(const s of G)await s()}function Ie(s){return new Promise(e=>setTimeout(e,s))}try{self["workbox:strategies:7.0.0"]&&_()}catch{}function D(s){return typeof s=="string"?new Request(s):s}class Oe{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new De,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const n of this._plugins)this._pluginStateMap.set(n,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){const{event:t}=this;let n=D(e);if(n.mode==="navigate"&&t instanceof FetchEvent&&t.preloadResponse){const i=await t.preloadResponse;if(i)return i}const a=this.hasCallback("fetchDidFail")?n.clone():null;try{for(const i of this.iterateCallbacks("requestWillFetch"))n=await i({request:n.clone(),event:t})}catch(i){if(i instanceof Error)throw new u("plugin-error-request-will-fetch",{thrownErrorMessage:i.message})}const r=n.clone();try{let i;i=await fetch(n,n.mode==="navigate"?void 0:this._strategy.fetchOptions);for(const o of this.iterateCallbacks("fetchDidSucceed"))i=await o({event:t,request:r,response:i});return i}catch(i){throw a&&await this.runCallbacks("fetchDidFail",{error:i,event:t,originalRequest:a.clone(),request:r.clone()}),i}}async fetchAndCachePut(e){const t=await this.fetch(e),n=t.clone();return this.waitUntil(this.cachePut(e,n)),t}async cacheMatch(e){const t=D(e);let n;const{cacheName:a,matchOptions:r}=this._strategy,i=await this.getCacheKey(t,"read"),o=Object.assign(Object.assign({},r),{cacheName:a});n=await caches.match(i,o);for(const c of this.iterateCallbacks("cachedResponseWillBeUsed"))n=await c({cacheName:a,matchOptions:r,cachedResponse:n,request:i,event:this.event})||void 0;return n}async cachePut(e,t){const n=D(e);await Ie(0);const a=await this.getCacheKey(n,"write");if(!t)throw new u("cache-put-with-no-response",{url:te(a.url)});const r=await this._ensureResponseSafeToCache(t);if(!r)return!1;const{cacheName:i,matchOptions:o}=this._strategy,c=await self.caches.open(i),l=this.hasCallback("cacheDidUpdate"),m=l?await Re(c,a.clone(),["__WB_REVISION__"],o):null;try{await c.put(a,l?r.clone():r)}catch(h){if(h instanceof Error)throw h.name==="QuotaExceededError"&&await ke(),h}for(const h of this.iterateCallbacks("cacheDidUpdate"))await h({cacheName:i,oldResponse:m,newResponse:r.clone(),request:a,event:this.event});return!0}async getCacheKey(e,t){const n=`${e.url} | ${t}`;if(!this._cacheKeys[n]){let a=e;for(const r of this.iterateCallbacks("cacheKeyWillBeUsed"))a=D(await r({mode:t,request:a,event:this.event,params:this.params}));this._cacheKeys[n]=a}return this._cacheKeys[n]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const n of this.iterateCallbacks(e))await n(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if(typeof t[e]=="function"){const n=this._pluginStateMap.get(t);yield r=>{const i=Object.assign(Object.assign({},r),{state:n});return t[e](i)}}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,n=!1;for(const a of this.iterateCallbacks("cacheWillUpdate"))if(t=await a({request:this.request,response:t,event:this.event})||void 0,n=!0,!t)break;return n||t&&t.status!==200&&(t=void 0),t}}class L{constructor(e={}){this.cacheName=$.getRuntimeName(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,n=typeof e.request=="string"?new Request(e.request):e.request,a="params"in e?e.params:void 0,r=new Oe(this,{event:t,request:n,params:a}),i=this._getResponse(r,n,t),o=this._awaitComplete(i,r,n,t);return[i,o]}async _getResponse(e,t,n){await e.runCallbacks("handlerWillStart",{event:n,request:t});let a;try{if(a=await this._handle(t,e),!a||a.type==="error")throw new u("no-response",{url:t.url})}catch(r){if(r instanceof Error){for(const i of e.iterateCallbacks("handlerDidError"))if(a=await i({error:r,event:n,request:t}),a)break}if(!a)throw r}for(const r of e.iterateCallbacks("handlerWillRespond"))a=await r({event:n,request:t,response:a});return a}async _awaitComplete(e,t,n,a){let r,i;try{r=await e}catch{}try{await t.runCallbacks("handlerDidRespond",{event:a,request:n,response:r}),await t.doneWaiting()}catch(o){o instanceof Error&&(i=o)}if(await t.runCallbacks("handlerDidComplete",{event:a,request:n,response:r,error:i}),t.destroy(),i)throw i}}class J extends L{async _handle(e,t){let n=await t.cacheMatch(e),a;if(!n)try{n=await t.fetchAndCachePut(e)}catch(r){r instanceof Error&&(a=r)}if(!n)throw new u("no-response",{url:e.url,error:a});return n}}const X={cacheWillUpdate:async({response:s})=>s.status===200||s.status===0?s:null};class Y extends L{constructor(e={}){super(e),this.plugins.some(t=>"cacheWillUpdate"in t)||this.plugins.unshift(X),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){const n=[],a=[];let r;if(this._networkTimeoutSeconds){const{id:c,promise:l}=this._getTimeoutPromise({request:e,logs:n,handler:t});r=c,a.push(l)}const i=this._getNetworkPromise({timeoutId:r,request:e,logs:n,handler:t});a.push(i);const o=await t.waitUntil((async()=>await t.waitUntil(Promise.race(a))||await i)());if(!o)throw new u("no-response",{url:e.url});return o}_getTimeoutPromise({request:e,logs:t,handler:n}){let a;return{promise:new Promise(i=>{a=setTimeout(async()=>{i(await n.cacheMatch(e))},this._networkTimeoutSeconds*1e3)}),id:a}}async _getNetworkPromise({timeoutId:e,request:t,logs:n,handler:a}){let r,i;try{i=await a.fetchAndCachePut(t)}catch(o){o instanceof Error&&(r=o)}return e&&clearTimeout(e),(r||!i)&&(i=await a.cacheMatch(t)),i}}class Te extends L{constructor(e={}){super(e),this.plugins.some(t=>"cacheWillUpdate"in t)||this.plugins.unshift(X)}async _handle(e,t){const n=t.fetchAndCachePut(e).catch(()=>{});t.waitUntil(n);let a=await t.cacheMatch(e),r;if(!a)try{a=await n}catch(i){i instanceof Error&&(r=i)}if(!a)throw new u("no-response",{url:e.url,error:r});return a}}Ce();self.__WB_DISABLE_DEV_LOGS=!0;const Ne=new p(({request:s,sameOrigin:e})=>{const t=s.url.includes("/icons/");return e&&t},new J({cacheName:"icons",plugins:[new x({maxEntries:300,maxAgeSeconds:3*24*60*60,purgeOnQuotaError:!0}),new E({statuses:[0,200]})]}));R(Ne);const Ae=new p(({request:s,sameOrigin:e})=>{const t=s.destination==="style"||s.destination==="script",n=/-[0-9a-z-]{4,}\./i.test(s.url);return e&&t&&n},new Y({cacheName:"assets",networkTimeoutSeconds:5,plugins:[new x({maxEntries:30,purgeOnQuotaError:!0}),new E({statuses:[0,200]})]}));R(Ae);const Se=new p(({request:s,sameOrigin:e})=>{const t=!e,n=s.destination==="image",a=s.url.includes("/avatars/"),r=s.url.includes("/custom/_emojis"),i=s.url.includes("/emoji/");return t&&n&&(a||r||i)},new J({cacheName:"remote-images",plugins:[new x({maxEntries:30,purgeOnQuotaError:!0}),new E({statuses:[0,200]})]}));R(Se);const Me=new v(/^https?:\/\/[^\/]+\/api\/v\d+\/(custom_emojis|lists\/\d+|announcements)$/,new Te({cacheName:"api-extended",plugins:[new x({maxAgeSeconds:12*60*60,purgeOnQuotaError:!0}),new E({statuses:[0,200]})]}));R(Me);const Pe=new v(/^https?:\/\/[^\/]+\/api\/v\d+\/(statuses\/\d+\/context)/,new Y({cacheName:"api",networkTimeoutSeconds:5,plugins:[new x({maxEntries:30,maxAgeSeconds:5*60,purgeOnQuotaError:!0}),new E({statuses:[0,200]})]}));R(Pe);self.addEventListener("push",s=>{const{data:e}=s;if(e){const t=e.json();console.log("PUSH payload",t);const{access_token:n,title:a,body:r,icon:i,notification_id:o,notification_type:c,preferred_locale:l}=t;navigator.setAppBadge&&c==="mention"&&navigator.setAppBadge(1),s.waitUntil(self.registration.showNotification(a,{body:r,icon:i,dir:"auto",badge:"/logo-badge-72.png",lang:l,tag:o,timestamp:Date.now(),data:{access_token:n,notification_type:c}}))}});self.addEventListener("notificationclick",s=>{const e=s.notification;console.log("NOTIFICATION CLICK payload",e);const{badge:t,body:n,data:a,dir:r,icon:i,lang:o,tag:c,timestamp:l,title:m}=e,{access_token:h,notification_type:I}=a,y=`/#/notifications?id=${c}&access_token=${btoa(h)}`;s.waitUntil((async()=>{var U;const g=await self.clients.matchAll({type:"window",includeUncontrolled:!0});if(console.log("NOTIFICATION CLICK clients 1",g),g.length&&"navigate"in g[0]){console.log("NOTIFICATION CLICK clients 2",g);const w=g.find(j=>j.focused||j.visibilityState==="visible")||g[0];console.log("NOTIFICATION CLICK navigate",y),w?(console.log("NOTIFICATION CLICK postMessage",w),w.focus(),(U=w.postMessage)==null||U.call(w,{type:"notification",id:c,accessToken:h})):(console.log("NOTIFICATION CLICK openWindow",y),await self.clients.openWindow(y))}else console.log("NOTIFICATION CLICK openWindow",y),await self.clients.openWindow(y);await s.notification.close()})())});
//# sourceMappingURL=sw.js.map
