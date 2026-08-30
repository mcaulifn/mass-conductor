var Ee=Object.defineProperty;var ke=Object.getOwnPropertyDescriptor;var u=(i,e,t,s)=>{for(var r=s>1?void 0:s?ke(e,t):e,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(e,t,r):n(r))||r);return s&&r&&Ee(e,t,r),r};var N=globalThis,O=N.ShadowRoot&&(N.ShadyCSS===void 0||N.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,W=Symbol(),ce=new WeakMap,k=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==W)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(O&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=ce.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&ce.set(t,e))}return e}toString(){return this.cssText}},de=i=>new k(typeof i=="string"?i:i+"",void 0,W),K=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new k(t,i,W)},pe=(i,e)=>{if(O)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),r=N.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}},Q=O?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return de(t)})(i):i;var{is:Me,defineProperty:Ce,getOwnPropertyDescriptor:Re,getOwnPropertyNames:Te,getOwnPropertySymbols:He,getPrototypeOf:Ie}=Object,B=globalThis,he=B.trustedTypes,Le=he?he.emptyScript:"",Ue=B.reactiveElementPolyfillSupport,M=(i,e)=>i,C={toAttribute(i,e){switch(e){case Boolean:i=i?Le:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},q=(i,e)=>!Me(i,e),ue={attribute:!0,type:String,converter:C,reflect:!1,useDefault:!1,hasChanged:q};Symbol.metadata??=Symbol("metadata"),B.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ue){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&Ce(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){let{get:r,set:o}=Re(this.prototype,e)??{get(){return this[t]},set(n){this[t]=n}};return{get:r,set(n){let a=r?.call(this);o?.call(this,n),this.requestUpdate(e,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ue}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;let e=Ie(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){let t=this.properties,s=[...Te(t),...He(t)];for(let r of s)this.createProperty(r,t[r])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let r of s)t.unshift(Q(r))}else e!==void 0&&t.push(Q(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pe(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:C).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,t){let s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let o=s.getPropertyOptions(r),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:C;this._$Em=r;let a=n.fromAttribute(t,o.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,s,r=!1,o){if(e!==void 0){let n=this.constructor;if(r===!1&&(o=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??q)(o,t)||s.useDefault&&s.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),o!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[r,o]of s){let{wrapped:n}=o,a=this[r];n!==!0||this._$AL.has(r)||a===void 0||this.C(r,void 0,o,a)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[M("elementProperties")]=new Map,y[M("finalized")]=new Map,Ue?.({ReactiveElement:y}),(B.reactiveElementVersions??=[]).push("2.1.2");var te=globalThis,me=i=>i,j=te.trustedTypes,ve=j?j.createPolicy("lit-html",{createHTML:i=>i}):void 0,_e="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,we="?"+$,ze=`<${we}>`,A=document,T=()=>A.createComment(""),H=i=>i===null||typeof i!="object"&&typeof i!="function",se=Array.isArray,Ne=i=>se(i)||typeof i?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,fe=/-->/g,ge=/>/g,w=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ye=/'/g,be=/"/g,xe=/^(?:script|style|textarea|title)$/i,re=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),c=re(1),Je=re(2),Ze=re(3),P=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),$e=new WeakMap,x=A.createTreeWalker(A,129);function Ae(i,e){if(!se(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ve!==void 0?ve.createHTML(e):e}var Oe=(i,e)=>{let t=i.length-1,s=[],r,o=e===2?"<svg>":e===3?"<math>":"",n=R;for(let a=0;a<t;a++){let l=i[a],v,f,h=-1,g=0;for(;g<l.length&&(n.lastIndex=g,f=n.exec(l),f!==null);)g=n.lastIndex,n===R?f[1]==="!--"?n=fe:f[1]!==void 0?n=ge:f[2]!==void 0?(xe.test(f[2])&&(r=RegExp("</"+f[2],"g")),n=w):f[3]!==void 0&&(n=w):n===w?f[0]===">"?(n=r??R,h=-1):f[1]===void 0?h=-2:(h=n.lastIndex-f[2].length,v=f[1],n=f[3]===void 0?w:f[3]==='"'?be:ye):n===be||n===ye?n=w:n===fe||n===ge?n=R:(n=w,r=void 0);let b=n===w&&i[a+1].startsWith("/>")?" ":"";o+=n===R?l+ze:h>=0?(s.push(v),l.slice(0,h)+_e+l.slice(h)+$+b):l+$+(h===-2?a:b)}return[Ae(i,o+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},I=class i{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let o=0,n=0,a=e.length-1,l=this.parts,[v,f]=Oe(e,t);if(this.el=i.createElement(v,s),x.currentNode=this.el.content,t===2||t===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=x.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(let h of r.getAttributeNames())if(h.endsWith(_e)){let g=f[n++],b=r.getAttribute(h).split($),z=/([.?@])?(.*)/.exec(g);l.push({type:1,index:o,name:z[2],strings:b,ctor:z[1]==="."?G:z[1]==="?"?X:z[1]==="@"?Y:E}),r.removeAttribute(h)}else h.startsWith($)&&(l.push({type:6,index:o}),r.removeAttribute(h));if(xe.test(r.tagName)){let h=r.textContent.split($),g=h.length-1;if(g>0){r.textContent=j?j.emptyScript:"";for(let b=0;b<g;b++)r.append(h[b],T()),x.nextNode(),l.push({type:2,index:++o});r.append(h[g],T())}}}else if(r.nodeType===8)if(r.data===we)l.push({type:2,index:o});else{let h=-1;for(;(h=r.data.indexOf($,h+1))!==-1;)l.push({type:7,index:o}),h+=$.length-1}o++}}static createElement(e,t){let s=A.createElement("template");return s.innerHTML=e,s}};function S(i,e,t=i,s){if(e===P)return e;let r=s!==void 0?t._$Co?.[s]:t._$Cl,o=H(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,t,s)),s!==void 0?(t._$Co??=[])[s]=r:t._$Cl=r),r!==void 0&&(e=S(i,r._$AS(i,e.values),r,s)),e}var Z=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,r=(e?.creationScope??A).importNode(t,!0);x.currentNode=r;let o=x.nextNode(),n=0,a=0,l=s[0];for(;l!==void 0;){if(n===l.index){let v;l.type===2?v=new L(o,o.nextSibling,this,e):l.type===1?v=new l.ctor(o,l.name,l.strings,this,e):l.type===6&&(v=new ee(o,this,e)),this._$AV.push(v),l=s[++a]}n!==l?.index&&(o=x.nextNode(),n++)}return x.currentNode=A,r}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},L=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,r){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=S(this,e,t),H(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==P&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ne(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&H(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=I.createElement(Ae(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(t);else{let o=new Z(r,this),n=o.u(this.options);o.p(t),this.T(n),this._$AH=o}}_$AC(e){let t=$e.get(e.strings);return t===void 0&&$e.set(e.strings,t=new I(e)),t}k(e){se(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,r=0;for(let o of e)r===t.length?t.push(s=new i(this.O(T()),this.O(T()),this,this.options)):s=t[r],s._$AI(o),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=me(e).nextSibling;me(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},E=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,o){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=d}_$AI(e,t=this,s,r){let o=this.strings,n=!1;if(o===void 0)e=S(this,e,t,0),n=!H(e)||e!==this._$AH&&e!==P,n&&(this._$AH=e);else{let a=e,l,v;for(e=o[0],l=0;l<o.length-1;l++)v=S(this,a[s+l],t,l),v===P&&(v=this._$AH[l]),n||=!H(v)||v!==this._$AH[l],v===d?e=d:e!==d&&(e+=(v??"")+o[l+1]),this._$AH[l]=v}n&&!r&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},G=class extends E{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}},X=class extends E{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}},Y=class extends E{constructor(e,t,s,r,o){super(e,t,s,r,o),this.type=5}_$AI(e,t=this){if((e=S(this,e,t,0)??d)===P)return;let s=this._$AH,r=e===d&&s!==d||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==d&&(s===d||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ee=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){S(this,e)}};var Be=te.litHtmlPolyfillSupport;Be?.(I,L),(te.litHtmlVersions??=[]).push("3.3.3");var Pe=(i,e,t)=>{let s=t?.renderBefore??e,r=s._$litPart$;if(r===void 0){let o=t?.renderBefore??null;s._$litPart$=r=new L(e.insertBefore(T(),o),o,void 0,t??{})}return r._$AI(i),r};var ie=globalThis,_=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Pe(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return P}};_._$litElement$=!0,_.finalized=!0,ie.litElementHydrateSupport?.({LitElement:_});var qe=ie.litElementPolyfillSupport;qe?.({LitElement:_});(ie.litElementVersions??=[]).push("4.2.2");var Se=i=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(i,e)}):customElements.define(i,e)};var je={attribute:!0,type:String,converter:C,reflect:!1,hasChanged:q},De=(i=je,e,t)=>{let{kind:s,metadata:r}=t,o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(t.name,i),s==="accessor"){let{name:n}=t;return{set(a){let l=e.get.call(this);e.set.call(this,a),this.requestUpdate(n,l,i,!0,a)},init(a){return a!==void 0&&this.C(n,void 0,i,a),a}}}if(s==="setter"){let{name:n}=t;return function(a){let l=this[n];e.call(this,a),this.requestUpdate(n,l,i,!0,a)}}throw Error("Unsupported decorator location: "+s)};function D(i){return(e,t)=>typeof t=="object"?De(i,e,t):((s,r,o)=>{let n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,e,t)}function m(i){return D({...i,state:!0,attribute:!1})}var F=class{constructor(e){this.hass=e;this.listeners=new Set}setHass(e){this.hass=e}onEvent(e){return this.listeners.add(e),this.ensureSubscribed(),()=>this.listeners.delete(e)}async ensureSubscribed(){if(!(this.unsub||this.subscribing))return this.subscribing=this.hass.connection.subscribeMessage(e=>{for(let t of this.listeners)t(e)},{type:"mass_conductor/subscribe_events"}).then(e=>{this.unsub=e}).catch(()=>{}).finally(()=>{this.subscribing=void 0}),this.subscribing}command(e,t){return this.hass.connection.sendMessagePromise({type:"mass_conductor/command",command:e,...t?{args:t}:{}})}getPlayers(){return this.command("players/all")}getProviders(){return this.command("providers")}search(e,t={}){return this.command("music/search",{search_query:e,media_types:["artist","album","track","playlist","radio"],limit:t.limit??8,...t.providers?.length?{providers:t.providers}:{},...t.userId?{user:t.userId}:{}})}browse(e,t){return this.command("music/browse",{...e?{path:e}:{},...t?{player_id:t}:{}})}playPause(e){return this.command("players/cmd/play_pause",{player_id:e})}next(e){return this.command("players/cmd/next",{player_id:e})}previous(e){return this.command("players/cmd/previous",{player_id:e})}seek(e,t){return this.command("players/cmd/seek",{player_id:e,position:Math.round(t)})}setVolume(e,t){return this.command("players/cmd/volume_set",{player_id:e,volume_level:Math.round(t)})}setMute(e,t){return this.command("players/cmd/volume_mute",{player_id:e,muted:t})}setPower(e,t){return this.command("players/cmd/power",{player_id:e,powered:t})}playMedia(e,t,s){return this.command("player_queues/play_media",{queue_id:e,media:t,...s?{user:s}:{}})}};function oe(i,e){let t=e?.areas,s=e?.devices;if(!t||!s)return"Speakers";let r,o=null;for(let[n,a]of Object.entries(s))if(a.identifiers?.some(l=>l[0]==="music_assistant"&&l[1]===i.player_id)){r=n,o=a.area_id;break}if(!r)return"Speakers";for(let n of Object.values(e?.entities??{}))if(n.device_id===r&&n.entity_id.startsWith("media_player.")&&n.area_id){o=n.area_id;break}return o&&t[o]?t[o].name:"Speakers"}function U(i){return i.display_name??i.name??i.player_id}function ne(i){switch(i){case"album":return"\u{1F4BF}";case"artist":return"\u{1F3A4}";case"playlist":return"\u2630";case"radio":return"\u{1F4FB}";default:return"\u266A"}}function ae(i){return i.artists?.map(t=>t.name).filter(Boolean).join(", ")||i.media_type}function le(i){if(!isFinite(i)||i<0)return"0:00";let e=Math.floor(i/60),t=Math.floor(i%60);return`${e}:${t.toString().padStart(2,"0")}`}var p=class extends _{constructor(){super(...arguments);this.users=[];this.players=[];this.error="";this.loading=!0;this.query="";this.view="main";this.playerQuery="";this.providers=[];this.searching=!1;this.browseMode="tree";this.browseItems=[];this.browseStack=[];this.browsing=!1;this.statusMsg="";this.tick=0;this.initialized=!1}setConfig(t){this.config=t,this.userId=t.default_user}getCardSize(){return 6}connectedCallback(){super.connectedCallback(),this.timer=window.setInterval(()=>this.tick=Date.now(),1e3),this.maybeInit()}disconnectedCallback(){super.disconnectedCallback(),this.unsub?.(),this.unsub=void 0,this.initialized=!1,this.timer&&window.clearInterval(this.timer)}updated(t){t.has("hass")&&this.maybeInit()}maybeInit(){this.hass&&(this.client?this.client.setHass(this.hass):this.client=new F(this.hass),!this.initialized&&(this.initialized=!0,this.unsub=this.client.onEvent(t=>this.onEvent(t)),this.loadData()))}onEvent(t){if(t.event==="player_updated"&&t.data){let s=t.data,r=this.players.findIndex(o=>o.player_id===s.player_id);if(r>=0){let o=[...this.players];o[r]=s,this.players=o}}else(t.event==="player_added"||t.event==="player_removed"||t.event==="queue_updated")&&this.debouncedRefresh()}debouncedRefresh(){this.refreshHandle&&window.clearTimeout(this.refreshHandle),this.refreshHandle=window.setTimeout(()=>void this.loadData(),400)}async loadData(){if(this.client)try{let[t,s]=await Promise.all([this.client.getPlayers(),this.client.getProviders()]);if(this.players=t,this.providers=s,this.error="",!this.allowEveryone&&!this.selectedUser&&this.users.length){let r=this.users.find(o=>o.user_id===this.config?.default_user||o.username===this.config?.default_user);this.userId=(r??this.users[0]).user_id}(!this.playerId||!this.scopedPlayers.some(r=>r.player_id===this.playerId))&&(this.playerId=this.pickDefaultPlayer()?.player_id)}catch(t){this.error=`Could not reach Music Assistant: ${t.message}`}finally{this.loading=!1}}get selectedUser(){return this.users.find(t=>t.user_id===this.userId)}get scopedPlayers(){return this.players.filter(t=>t.available&&!t.synced_to)}get selectedPlayer(){return this.players.find(t=>t.player_id===this.playerId)}pickDefaultPlayer(){return this.scopedPlayers.find(s=>s.playback_state==="playing")??this.scopedPlayers[0]}liveElapsed(t){let s=t.current_media,r=s?.elapsed_time??t.elapsed_time??0,o=s?.elapsed_time_last_updated??t.elapsed_time_last_updated;return t.playback_state==="playing"&&o?r+(Date.now()/1e3-o):r}cmd(t){let s=this.playerId;!this.client||!s||t(this.client,s).catch(r=>this.error=r.message)}get musicProviders(){return this.providers.filter(t=>t.type==="music")}async doSearch(){if(!(!this.client||!this.query.trim())){this.browseMode="search",this.searching=!0,this.results=void 0;try{this.results=await this.client.search(this.query.trim(),{userId:this.userId,providers:this.providerId?[this.providerId]:void 0})}catch(t){this.error=t.message}finally{this.searching=!1}}}openBrowse(){this.view="browse",this.browseMode="tree",this.browseStack.length||this.loadBrowse([{name:"Browse"}])}async loadBrowse(t){if(this.client){this.browseMode="tree",this.browsing=!0,this.browseStack=t;try{let s=t[t.length-1]?.path;this.browseItems=await this.client.browse(s,this.playerId)}catch(s){this.error=s.message,this.browseItems=[]}finally{this.browsing=!1}}}browseTap(t){t.media_type==="folder"?this.loadBrowse([...this.browseStack,{name:t.name,path:t.path}]):this.playItem(t)}crumbTo(t){this.loadBrowse(this.browseStack.slice(0,t+1))}async playItem(t){let s=this.playerId;if(!(!this.client||!s||!t.uri))try{await this.client.playMedia(s,t.uri,this.userId),this.statusMsg=`\u25B6 ${t.name}`,this.view="main"}catch(r){this.error=r.message}}render(){return this.config?this.loading?c`<ha-card><div class="pad muted">Loading…</div></ha-card>`:this.view==="players"?c`<ha-card>${this.renderPlayersView()}</ha-card>`:this.view==="browse"?c`<ha-card>${this.renderBrowseView()}</ha-card>`:c`
      <ha-card>
        <div class="pickers">${this.renderPickerButtons()}</div>
        ${this.error?c`<div class="error">${this.error}</div>`:d}
        ${this.renderNowPlaying()} ${this.renderControls()} ${this.renderSearch()}
      </ha-card>
    `:c`<ha-card>Not configured</ha-card>`}renderViewHead(t){return c`
      <div class="view-head">
        <button class="ctl" title="Back" @click=${()=>this.view="main"}>‹</button>
        <span class="view-title">${t}</span>
      </div>
    `}get allowEveryone(){return this.config?.allow_everyone!==!1}pickProvider(t){if(this.providerId=t,this.browseMode==="search"){this.query.trim()&&this.doSearch();return}if(t){let s=this.providers.find(r=>r.instance_id===t);this.loadBrowse([{name:"Browse"},{name:s?.name??"Source",path:`${t}://`}])}else this.loadBrowse([{name:"Browse"}])}renderPickerButtons(){let t=this.selectedPlayer;return c`
      <button class="selbtn" @click=${()=>this.view="players"}>
        <span class="ic">🔊</span>
        <span class="selbtn-main">${t?U(t):"No player"}</span>
        ${t?c`<span class="selbtn-sub">${oe(t,this.hass)}</span>`:d}
        <span class="caret">▾</span>
      </button>
    `}renderPlayersView(){let t=this.playerQuery.trim().toLowerCase(),s=new Map;for(let r of this.scopedPlayers){let o=oe(r,this.hass);t&&!U(r).toLowerCase().includes(t)&&!o.toLowerCase().includes(t)||(s.get(o)??s.set(o,[]).get(o)).push(r)}return c`
      ${this.renderViewHead("Play on\u2026")}
      <input
        class="sheet-search"
        type="text"
        placeholder="Filter rooms or players…"
        .value=${this.playerQuery}
        @input=${r=>this.playerQuery=r.target.value}
      />
      <div class="view-list">
        ${[...s.entries()].sort((r,o)=>r[0].localeCompare(o[0])).map(([r,o])=>c`
              <div class="sheet-group">${r}</div>
              ${o.map(n=>this.sheetRow(n.player_id===this.playerId,n.playback_state==="playing"?"\u25B6":"\u{1F50A}",U(n),n.playback_state==="playing"?"playing":void 0,()=>{this.playerId=n.player_id,this.view="main",this.playerQuery=""}))}
            `)}
        ${s.size===0?c`<div class="muted pad">no matches</div>`:d}
      </div>
    `}sheetRow(t,s,r,o,n){return c`
      <button class="sheet-row ${t?"active":""}" @click=${n}>
        <span class="row-ic">${s}</span>
        <span class="row-txt">
          <span class="row-lbl">${r}</span>
          ${o?c`<span class="row-sub">${o}</span>`:d}
        </span>
        ${t?c`<span class="row-check">✓</span>`:d}
      </button>
    `}renderNowPlaying(){let t=this.selectedPlayer,s=t?.current_media,r=s?.image_url;return c`
      <div class="art">
        ${r?c`<img src=${r} alt="" />`:c`<div class="art-empty">♪</div>`}
      </div>
      <div class="meta">
        <div class="title">${s?.title??"Nothing playing"}</div>
        <div class="artist">${s?.artist??(t?U(t):"")}</div>
      </div>
      ${this.renderProgress()}
    `}renderProgress(){this.tick;let t=this.selectedPlayer,s=t?.current_media?.duration??0,r=t?this.liveElapsed(t):0;return c`
      <div class="progress">
        <input
          type="range"
          min="0"
          max=${s||0}
          .value=${String(Math.floor(r))}
          ?disabled=${!s}
          @change=${o=>this.cmd((n,a)=>n.seek(a,Number(o.target.value)))}
        />
        <div class="times"><span>${le(r)}</span><span>${le(s)}</span></div>
      </div>
    `}renderControls(){let t=this.selectedPlayer,s=t?.playback_state==="playing",r=t?.volume_level??0,o=!!t?.volume_muted;return c`
      <div class="controls">
        <button class="ctl" title="Previous" @click=${()=>this.cmd((n,a)=>n.previous(a))}>
          ⏮
        </button>
        <button class="ctl big" title="Play/Pause" @click=${()=>this.cmd((n,a)=>n.playPause(a))}>
          ${s?"\u23F8":"\u25B6"}
        </button>
        <button class="ctl" title="Next" @click=${()=>this.cmd((n,a)=>n.next(a))}>⏭</button>
      </div>
      <div class="volrow">
        <button class="ctl sm" title="Mute" @click=${()=>this.cmd((n,a)=>n.setMute(a,!o))}>
          ${o?"\u{1F507}":"\u{1F50A}"}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          .value=${String(r)}
          @change=${n=>this.cmd((a,l)=>a.setVolume(l,Number(n.target.value)))}
        />
        <button
          class="ctl sm ${t?.powered?"on":""}"
          title="Power"
          @click=${()=>this.cmd((n,a)=>n.setPower(a,!t?.powered))}
        >
          ⏻
        </button>
      </div>
    `}renderSearch(){return c`
      <button class="browse" @click=${()=>this.openBrowse()}>⌕ Browse / Search</button>
      ${this.statusMsg?c`<div class="muted status">${this.statusMsg}</div>`:d}
    `}renderBrowseView(){let t=this.selectedPlayer;return c`
      ${this.renderViewHead("Browse & Search")}
      <div class="src-bar">
        <div class="src-line">
          <span class="src-cap">Source</span>
          <div class="src-chips">
            ${this.srcChip(!this.providerId,"All",()=>this.pickProvider(void 0))}
            ${this.musicProviders.map(s=>this.srcChip(s.instance_id===this.providerId,s.name,()=>this.pickProvider(s.instance_id)))}
          </div>
        </div>
      </div>
      <div class="searchbox">
        <input
          type="text"
          placeholder="Search this source…"
          .value=${this.query}
          @input=${s=>this.query=s.target.value}
          @keydown=${s=>s.key==="Enter"&&this.doSearch()}
        />
        <button class="ctl sm" @click=${()=>this.doSearch()}>⌕</button>
      </div>
      ${t?d:c`<div class="muted pad">Pick a player first to play.</div>`}
      ${this.renderBrowseNav()}
      <div class="view-list">
        ${this.browseMode==="search"?this.searching?c`<div class="muted pad">Searching…</div>`:this.renderResults():this.browsing?c`<div class="muted pad">Loading…</div>`:this.renderBrowseList()}
      </div>
    `}renderBrowseNav(){return this.browseMode==="search"?c`
        <button class="crumb-back" @click=${()=>this.browseMode="tree"}>‹ Back to Browse</button>
      `:c`
      <div class="crumbs">
        ${this.browseStack.map((t,s)=>{let r=s===this.browseStack.length-1;return c`
            <button class="crumb ${r?"active":""}" @click=${()=>this.crumbTo(s)}>
              ${t.name}
            </button>
            ${r?d:c`<span class="crumb-sep">›</span>`}
          `})}
      </div>
    `}renderBrowseList(){return this.browseItems.length?c`
      ${this.browseItems.map(t=>this.sheetRow(!1,t.media_type==="folder"?"\u{1F4C1}":ne(t.media_type),t.name,t.media_type==="folder"?t.subtitle??void 0:ae(t),()=>this.browseTap(t)))}
    `:c`<div class="muted pad">Empty.</div>`}srcChip(t,s,r){return c`<button class="srcchip ${t?"active":""}" @click=${r}>
      ${s}
    </button>`}renderResults(){let t=this.results;if(!t)return c`<div class="muted pad">Search to see results.</div>`;let s=[["Tracks",t.tracks],["Albums",t.albums],["Artists",t.artists],["Playlists",t.playlists],["Radio",t.radio]];return s.some(([,r])=>r&&r.length)?c`
      ${s.map(([r,o])=>o&&o.length?c`
              <div class="sheet-group">${r}</div>
              ${o.map(n=>this.sheetRow(!1,ne(n.media_type),n.name,ae(n),()=>this.playItem(n)))}
            `:d)}
    `:c`<div class="muted pad">No results.</div>`}};p.styles=K`
    ha-card {
      padding: 16px;
    }
    .pad {
      padding: 8px 0;
    }
    .pickers {
      display: flex;
      gap: 8px;
      margin-bottom: 14px;
    }
    /* a button that shows the current choice and opens a bottom sheet on tap */
    .selbtn {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      padding: 8px 14px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 22px;
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.95rem;
      overflow: hidden;
    }
    .selbtn .ic {
      font-size: 1rem;
    }
    .selbtn-main {
      flex: 1;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .selbtn-sub {
      font-size: 0.7rem;
      color: var(--secondary-text-color);
    }
    .caret {
      opacity: 0.6;
      font-size: 0.7rem;
    }
    /* bottom sheet (custom, fully themed — no native popup) */
    .sheet-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10;
    }
    .sheet {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 11;
      max-height: 75vh;
      display: flex;
      flex-direction: column;
      background: var(--card-background-color, #1c1c1c);
      color: var(--primary-text-color, #fff);
      border-radius: 18px 18px 0 0;
      box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.4);
      padding: 8px 12px calc(16px + env(safe-area-inset-bottom));
    }
    .sheet.tall {
      height: 80vh;
      max-height: 80vh;
    }
    .sheet-grip {
      width: 40px;
      height: 4px;
      border-radius: 2px;
      background: var(--divider-color, #666);
      margin: 6px auto 10px;
    }
    .sheet-title {
      font-size: 1.05rem;
      font-weight: 600;
      margin: 0 4px 10px;
    }
    .sheet-search {
      margin: 0 0 10px;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid var(--divider-color, #444);
      background: var(--secondary-background-color, #2a2a2a);
      color: var(--primary-text-color);
      font-size: 0.95rem;
    }
    .sheet-list {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .sheet-group {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--secondary-text-color);
      padding: 10px 6px 4px;
      position: sticky;
      top: 0;
      background: var(--card-background-color, #1c1c1c);
    }
    .sheet-row {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-height: 52px;
      padding: 10px;
      border: none;
      border-radius: 10px;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font-size: 1rem;
      text-align: left;
    }
    .sheet-row:hover {
      background: var(--secondary-background-color, rgba(255, 255, 255, 0.06));
    }
    .sheet-row.active {
      color: var(--primary-color, #03a9f4);
    }
    .row-ic {
      font-size: 1.1rem;
      width: 1.4rem;
      text-align: center;
    }
    .row-txt {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .row-sub {
      font-size: 0.72rem;
      color: var(--secondary-text-color);
    }
    .row-check {
      font-size: 1rem;
    }
    .pad {
      padding: 10px;
    }
    .art {
      width: 180px;
      height: 180px;
      margin: 0 auto 14px;
      border-radius: 12px;
      overflow: hidden;
      background: var(--secondary-background-color, #eee);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
    }
    .art img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .art-empty {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      font-size: 3rem;
      color: var(--secondary-text-color);
    }
    .meta {
      text-align: center;
      margin-bottom: 8px;
    }
    .title {
      font-size: 1.1rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .artist {
      color: var(--secondary-text-color);
      font-size: 0.9rem;
    }
    .progress input[type="range"] {
      width: 100%;
    }
    .times {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--secondary-text-color);
    }
    .controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 18px;
      margin: 10px 0;
    }
    .ctl {
      border: none;
      background: transparent;
      color: var(--primary-text-color);
      font-size: 1.5rem;
      cursor: pointer;
      line-height: 1;
    }
    .ctl.big {
      font-size: 2.4rem;
    }
    .ctl.sm {
      font-size: 1.1rem;
    }
    .ctl.on {
      color: var(--primary-color, #03a9f4);
    }
    .volrow {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 8px 0 4px;
    }
    .volrow input[type="range"] {
      flex: 1;
    }
    .browse {
      width: 100%;
      margin-top: 12px;
      padding: 10px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 10px;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.95rem;
    }
    /* in-card sub-screens (players / browse) — no fixed positioning, so they
       work inside HA's transformed card containers and scroll normally */
    .view-head {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    .view-title {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .view-list {
      max-height: 60vh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    /* breadcrumbs for the browse tree */
    .crumbs {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 2px;
      margin: 4px 0 8px;
    }
    .crumb {
      border: none;
      background: transparent;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      font-size: 0.85rem;
      padding: 2px 4px;
    }
    .crumb.active {
      color: var(--primary-text-color);
      font-weight: 600;
      cursor: default;
    }
    .crumb-sep {
      color: var(--secondary-text-color);
      font-size: 0.8rem;
    }
    .crumb-back {
      border: none;
      background: transparent;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      font-size: 0.9rem;
      padding: 4px 0;
      margin-bottom: 4px;
    }
    /* source (user + provider) selectors inside the browse screen */
    .src-bar {
      margin-bottom: 10px;
    }
    .src-line {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .src-cap {
      flex: 0 0 68px;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--secondary-text-color);
    }
    .src-chips {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      scrollbar-width: none;
      padding-bottom: 2px;
    }
    .src-chips::-webkit-scrollbar {
      display: none;
    }
    .srcchip {
      flex: 0 0 auto;
      min-height: 34px;
      padding: 5px 12px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 17px;
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.85rem;
      white-space: nowrap;
    }
    .srcchip.active {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    .searchbox {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .searchbox input {
      flex: 1;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .status {
      margin-top: 6px;
    }
    .error {
      color: var(--error-color, #db4437);
      margin-bottom: 8px;
      font-size: 0.85rem;
    }
    .muted {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }
  `,u([D({attribute:!1})],p.prototype,"hass",2),u([m()],p.prototype,"config",2),u([m()],p.prototype,"users",2),u([m()],p.prototype,"players",2),u([m()],p.prototype,"userId",2),u([m()],p.prototype,"playerId",2),u([m()],p.prototype,"error",2),u([m()],p.prototype,"loading",2),u([m()],p.prototype,"query",2),u([m()],p.prototype,"view",2),u([m()],p.prototype,"playerQuery",2),u([m()],p.prototype,"providers",2),u([m()],p.prototype,"providerId",2),u([m()],p.prototype,"results",2),u([m()],p.prototype,"searching",2),u([m()],p.prototype,"browseMode",2),u([m()],p.prototype,"browseItems",2),u([m()],p.prototype,"browseStack",2),u([m()],p.prototype,"browsing",2),u([m()],p.prototype,"statusMsg",2),u([m()],p.prototype,"tick",2),p=u([Se("mass-conductor")],p);window.customCards??=[];window.customCards.push({type:"mass-conductor",name:"Music Assistant Conductor",description:"Mini Music Assistant player with room + user selection."});export{p as MassConductor};
