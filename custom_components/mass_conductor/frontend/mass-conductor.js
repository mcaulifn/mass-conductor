var Re=Object.defineProperty;var Te=Object.getOwnPropertyDescriptor;var u=(i,t,e,r)=>{for(var s=r>1?void 0:r?Te(t,e):t,o=i.length-1,a;o>=0;o--)(a=i[o])&&(s=(r?a(t,e,s):a(s))||s);return r&&s&&Re(t,e,s),s};var O=globalThis,B=O.ShadowRoot&&(O.ShadyCSS===void 0||O.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,W=Symbol(),ce=new WeakMap,M=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==W)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(B&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=ce.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&ce.set(e,t))}return t}toString(){return this.cssText}},pe=i=>new M(typeof i=="string"?i:i+"",void 0,W),K=(i,...t)=>{let e=i.length===1?i[0]:t.reduce((r,s,o)=>r+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1],i[0]);return new M(e,i,W)},he=(i,t)=>{if(B)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),s=O.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=e.cssText,i.appendChild(r)}},Q=B?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return pe(e)})(i):i;var{is:He,defineProperty:Ie,getOwnPropertyDescriptor:Le,getOwnPropertyNames:Ue,getOwnPropertySymbols:ze,getPrototypeOf:Ne}=Object,q=globalThis,ue=q.trustedTypes,Oe=ue?ue.emptyScript:"",Be=q.reactiveElementPolyfillSupport,C=(i,t)=>i,R={toAttribute(i,t){switch(t){case Boolean:i=i?Oe:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},j=(i,t)=>!He(i,t),me={attribute:!0,type:String,converter:R,reflect:!1,useDefault:!1,hasChanged:j};Symbol.metadata??=Symbol("metadata"),q.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=me){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(t,r,e);s!==void 0&&Ie(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){let{get:s,set:o}=Le(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:s,set(a){let l=s?.call(this);o?.call(this,a),this.requestUpdate(t,l,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??me}static _$Ei(){if(this.hasOwnProperty(C("elementProperties")))return;let t=Ne(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(C("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(C("properties"))){let e=this.properties,r=[...Ue(e),...ze(e)];for(let s of r)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,s]of e)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let s=this._$Eu(e,r);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let s of r)e.unshift(Q(s))}else t!==void 0&&e.push(Q(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return he(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(s!==void 0&&r.reflect===!0){let o=(r.converter?.toAttribute!==void 0?r.converter:R).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){let r=this.constructor,s=r._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let o=r.getPropertyOptions(s),a=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:R;this._$Em=s;let l=a.fromAttribute(e,o.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(t,e,r,s=!1,o){if(t!==void 0){let a=this.constructor;if(s===!1&&(o=this[t]),r??=a.getPropertyOptions(t),!((r.hasChanged??j)(o,e)||r.useDefault&&r.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:o},a){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),o!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[s,o]of r){let{wrapped:a}=o,l=this[s];a!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,o,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[C("elementProperties")]=new Map,y[C("finalized")]=new Map,Be?.({ReactiveElement:y}),(q.reactiveElementVersions??=[]).push("2.1.2");var re=globalThis,ve=i=>i,D=re.trustedTypes,ge=D?D.createPolicy("lit-html",{createHTML:i=>i}):void 0,we="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,xe="?"+$,qe=`<${xe}>`,A=document,H=()=>A.createComment(""),I=i=>i===null||typeof i!="object"&&typeof i!="function",se=Array.isArray,je=i=>se(i)||typeof i?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,fe=/-->/g,ye=/>/g,x=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),be=/'/g,$e=/"/g,Pe=/^(?:script|style|textarea|title)$/i,ie=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),n=ie(1),Ye=ie(2),et=ie(3),k=Symbol.for("lit-noChange"),c=Symbol.for("lit-nothing"),_e=new WeakMap,P=A.createTreeWalker(A,129);function Ae(i,t){if(!se(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ge!==void 0?ge.createHTML(t):t}var De=(i,t)=>{let e=i.length-1,r=[],s,o=t===2?"<svg>":t===3?"<math>":"",a=T;for(let l=0;l<e;l++){let d=i[l],v,g,h=-1,f=0;for(;f<d.length&&(a.lastIndex=f,g=a.exec(d),g!==null);)f=a.lastIndex,a===T?g[1]==="!--"?a=fe:g[1]!==void 0?a=ye:g[2]!==void 0?(Pe.test(g[2])&&(s=RegExp("</"+g[2],"g")),a=x):g[3]!==void 0&&(a=x):a===x?g[0]===">"?(a=s??T,h=-1):g[1]===void 0?h=-2:(h=a.lastIndex-g[2].length,v=g[1],a=g[3]===void 0?x:g[3]==='"'?$e:be):a===$e||a===be?a=x:a===fe||a===ye?a=T:(a=x,s=void 0);let b=a===x&&i[l+1].startsWith("/>")?" ":"";o+=a===T?d+qe:h>=0?(r.push(v),d.slice(0,h)+we+d.slice(h)+$+b):d+$+(h===-2?l:b)}return[Ae(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},L=class i{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let o=0,a=0,l=t.length-1,d=this.parts,[v,g]=De(t,e);if(this.el=i.createElement(v,r),P.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=P.nextNode())!==null&&d.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let h of s.getAttributeNames())if(h.endsWith(we)){let f=g[a++],b=s.getAttribute(h).split($),N=/([.?@])?(.*)/.exec(f);d.push({type:1,index:o,name:N[2],strings:b,ctor:N[1]==="."?X:N[1]==="?"?Y:N[1]==="@"?ee:E}),s.removeAttribute(h)}else h.startsWith($)&&(d.push({type:6,index:o}),s.removeAttribute(h));if(Pe.test(s.tagName)){let h=s.textContent.split($),f=h.length-1;if(f>0){s.textContent=D?D.emptyScript:"";for(let b=0;b<f;b++)s.append(h[b],H()),P.nextNode(),d.push({type:2,index:++o});s.append(h[f],H())}}}else if(s.nodeType===8)if(s.data===xe)d.push({type:2,index:o});else{let h=-1;for(;(h=s.data.indexOf($,h+1))!==-1;)d.push({type:7,index:o}),h+=$.length-1}o++}}static createElement(t,e){let r=A.createElement("template");return r.innerHTML=t,r}};function S(i,t,e=i,r){if(t===k)return t;let s=r!==void 0?e._$Co?.[r]:e._$Cl,o=I(t)?void 0:t._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(i),s._$AT(i,e,r)),r!==void 0?(e._$Co??=[])[r]=s:e._$Cl=s),s!==void 0&&(t=S(i,s._$AS(i,t.values),s,r)),t}var Z=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??A).importNode(e,!0);P.currentNode=s;let o=P.nextNode(),a=0,l=0,d=r[0];for(;d!==void 0;){if(a===d.index){let v;d.type===2?v=new U(o,o.nextSibling,this,t):d.type===1?v=new d.ctor(o,d.name,d.strings,this,t):d.type===6&&(v=new te(o,this,t)),this._$AV.push(v),d=r[++l]}a!==d?.index&&(o=P.nextNode(),a++)}return P.currentNode=A,s}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},U=class i{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=c,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=S(this,t,e),I(t)?t===c||t==null||t===""?(this._$AH!==c&&this._$AR(),this._$AH=c):t!==this._$AH&&t!==k&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):je(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==c&&I(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,s=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=L.createElement(Ae(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{let o=new Z(s,this),a=o.u(this.options);o.p(e),this.T(a),this._$AH=o}}_$AC(t){let e=_e.get(t.strings);return e===void 0&&_e.set(t.strings,e=new L(t)),e}k(t){se(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,s=0;for(let o of t)s===e.length?e.push(r=new i(this.O(H()),this.O(H()),this,this.options)):r=e[s],r._$AI(o),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=ve(t).nextSibling;ve(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},E=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,o){this.type=1,this._$AH=c,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=c}_$AI(t,e=this,r,s){let o=this.strings,a=!1;if(o===void 0)t=S(this,t,e,0),a=!I(t)||t!==this._$AH&&t!==k,a&&(this._$AH=t);else{let l=t,d,v;for(t=o[0],d=0;d<o.length-1;d++)v=S(this,l[r+d],e,d),v===k&&(v=this._$AH[d]),a||=!I(v)||v!==this._$AH[d],v===c?t=c:t!==c&&(t+=(v??"")+o[d+1]),this._$AH[d]=v}a&&!s&&this.j(t)}j(t){t===c?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},X=class extends E{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===c?void 0:t}},Y=class extends E{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==c)}},ee=class extends E{constructor(t,e,r,s,o){super(t,e,r,s,o),this.type=5}_$AI(t,e=this){if((t=S(this,t,e,0)??c)===k)return;let r=this._$AH,s=t===c&&r!==c||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==c&&(r===c||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},te=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t)}};var Ge=re.litHtmlPolyfillSupport;Ge?.(L,U),(re.litHtmlVersions??=[]).push("3.3.3");var ke=(i,t,e)=>{let r=e?.renderBefore??t,s=r._$litPart$;if(s===void 0){let o=e?.renderBefore??null;r._$litPart$=s=new U(t.insertBefore(H(),o),o,void 0,e??{})}return s._$AI(i),s};var oe=globalThis,_=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ke(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return k}};_._$litElement$=!0,_.finalized=!0,oe.litElementHydrateSupport?.({LitElement:_});var Ve=oe.litElementPolyfillSupport;Ve?.({LitElement:_});(oe.litElementVersions??=[]).push("4.2.2");var Se=i=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(i,t)}):customElements.define(i,t)};var Fe={attribute:!0,type:String,converter:R,reflect:!1,hasChanged:j},We=(i=Fe,t,e)=>{let{kind:r,metadata:s}=e,o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),r==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),r==="accessor"){let{name:a}=e;return{set(l){let d=t.get.call(this);t.set.call(this,l),this.requestUpdate(a,d,i,!0,l)},init(l){return l!==void 0&&this.C(a,void 0,i,l),l}}}if(r==="setter"){let{name:a}=e;return function(l){let d=this[a];t.call(this,l),this.requestUpdate(a,d,i,!0,l)}}throw Error("Unsupported decorator location: "+r)};function G(i){return(t,e)=>typeof e=="object"?We(i,t,e):((r,s,o)=>{let a=s.hasOwnProperty(o);return s.constructor.createProperty(o,r),a?Object.getOwnPropertyDescriptor(s,o):void 0})(i,t,e)}function m(i){return G({...i,state:!0,attribute:!1})}var F=class{constructor(t){this.hass=t;this.listeners=new Set}setHass(t){this.hass=t}onEvent(t){return this.listeners.add(t),this.ensureSubscribed(),()=>this.listeners.delete(t)}async ensureSubscribed(){if(!(this.unsub||this.subscribing))return this.subscribing=this.hass.connection.subscribeMessage(t=>{for(let e of this.listeners)e(t)},{type:"mass_conductor/subscribe_events"}).then(t=>{this.unsub=t}).catch(()=>{}).finally(()=>{this.subscribing=void 0}),this.subscribing}command(t,e){return this.hass.connection.sendMessagePromise({type:"mass_conductor/command",command:t,...e?{args:e}:{}})}getPlayers(){return this.command("players/all")}getProviders(){return this.command("providers")}search(t,e={}){return this.command("music/search",{search_query:t,media_types:["artist","album","track","playlist","radio"],limit:e.limit??8,...e.providers?.length?{providers:e.providers}:{},...e.userId?{user:e.userId}:{}})}browse(t,e){return this.command("music/browse",{...t?{path:t}:{},...e?{player_id:e}:{}})}playPause(t){return this.command("players/cmd/play_pause",{player_id:t})}next(t){return this.command("players/cmd/next",{player_id:t})}previous(t){return this.command("players/cmd/previous",{player_id:t})}seek(t,e){return this.command("players/cmd/seek",{player_id:t,position:Math.round(e)})}setVolume(t,e){return this.command("players/cmd/volume_set",{player_id:t,volume_level:Math.round(e)})}setMute(t,e){return this.command("players/cmd/volume_mute",{player_id:t,muted:e})}setPower(t,e){return this.command("players/cmd/power",{player_id:t,powered:e})}setGroupMembers(t,e={}){return this.command("players/cmd/set_members",{target_player:t,...e.add?.length?{player_ids_to_add:e.add}:{},...e.remove?.length?{player_ids_to_remove:e.remove}:{}})}groupPlayer(t,e){return this.command("players/cmd/group",{player_id:t,target_player:e})}ungroupPlayer(t){return this.command("players/cmd/ungroup",{player_id:t})}playMedia(t,e,r){return this.command("player_queues/play_media",{queue_id:t,media:e,...r?{user:r}:{}})}};function z(i,t){let e=t?.areas,r=t?.devices;if(!e||!r)return"Speakers";let s,o=null;for(let[a,l]of Object.entries(r))if(l.identifiers?.some(d=>d[0]==="music_assistant"&&d[1]===i.player_id)){s=a,o=l.area_id;break}if(!s)return"Speakers";for(let a of Object.values(t?.entities??{}))if(a.device_id===s&&a.entity_id.startsWith("media_player.")&&a.area_id){o=a.area_id;break}return o&&e[o]?e[o].name:"Speakers"}function w(i){return i.display_name??i.name??i.player_id}function Ee(i){return!!i?.supported_features?.includes("set_members")}function Me(i,t){if(!i||!t||i.player_id===t.player_id||!t.available)return!1;let e=i.can_group_with;return!e||!e.length?!1:e.includes(t.player_id)||t.provider!=null&&e.includes(t.provider)}function ae(i,t=[]){if(!i)return[];let e=new Set;for(let r of i.group_members??[])r&&r!==i.player_id&&e.add(r);for(let r of t)r.player_id!==i.player_id&&(r.synced_to===i.player_id||r.active_group===i.player_id)&&e.add(r.player_id);return[...e]}function Ce(i,t=[]){if(i){if(i.synced_to){let e=t.find(r=>r.player_id===i.synced_to);if(e)return e}return i}}function ne(i){switch(i){case"album":return"\u{1F4BF}";case"artist":return"\u{1F3A4}";case"playlist":return"\u2630";case"radio":return"\u{1F4FB}";default:return"\u266A"}}function le(i){return i.artists?.map(e=>e.name).filter(Boolean).join(", ")||i.media_type}function de(i){if(!isFinite(i)||i<0)return"0:00";let t=Math.floor(i/60),e=Math.floor(i%60);return`${t}:${e.toString().padStart(2,"0")}`}var p=class extends _{constructor(){super(...arguments);this.users=[];this.players=[];this.error="";this.loading=!0;this.query="";this.view="main";this.playerQuery="";this.providers=[];this.searching=!1;this.browseMode="tree";this.browseItems=[];this.browseStack=[];this.browsing=!1;this.statusMsg="";this.tick=0;this.initialized=!1}setConfig(e){this.config=e,this.userId=e.default_user}getCardSize(){return 6}connectedCallback(){super.connectedCallback(),this.timer=window.setInterval(()=>this.tick=Date.now(),1e3),this.maybeInit()}disconnectedCallback(){super.disconnectedCallback(),this.unsub?.(),this.unsub=void 0,this.initialized=!1,this.timer&&window.clearInterval(this.timer)}updated(e){e.has("hass")&&this.maybeInit()}maybeInit(){this.hass&&(this.client?this.client.setHass(this.hass):this.client=new F(this.hass),!this.initialized&&(this.initialized=!0,this.unsub=this.client.onEvent(e=>this.onEvent(e)),this.loadData()))}onEvent(e){if(e.event==="player_updated"&&e.data){let r=e.data,s=this.players.findIndex(o=>o.player_id===r.player_id);if(s>=0){let o=[...this.players];o[s]=r,this.players=o}}else(e.event==="player_added"||e.event==="player_removed"||e.event==="queue_updated")&&this.debouncedRefresh()}debouncedRefresh(){this.refreshHandle&&window.clearTimeout(this.refreshHandle),this.refreshHandle=window.setTimeout(()=>{this.loadData()},400)}async loadData(){if(this.client)try{let[e,r]=await Promise.all([this.client.getPlayers(),this.client.getProviders()]);if(this.players=e,this.providers=r,this.error="",!this.allowEveryone&&!this.selectedUser&&this.users.length){let s=this.users.find(o=>o.user_id===this.config?.default_user||o.username===this.config?.default_user);this.userId=(s??this.users[0]).user_id}(!this.playerId||!this.scopedPlayers.some(s=>s.player_id===this.playerId))&&(this.playerId=this.pickDefaultPlayer()?.player_id)}catch(e){this.error=`Could not reach Music Assistant: ${e.message}`}finally{this.loading=!1}}get selectedUser(){return this.users.find(e=>e.user_id===this.userId)}get scopedPlayers(){return this.players.filter(e=>e.available&&!e.synced_to)}get selectedPlayer(){return this.players.find(e=>e.player_id===this.playerId)}pickDefaultPlayer(){return this.scopedPlayers.find(r=>r.playback_state==="playing")??this.scopedPlayers[0]}liveElapsed(e){let r=e.current_media,s=r?.elapsed_time??e.elapsed_time??0,o=r?.elapsed_time_last_updated??e.elapsed_time_last_updated;return e.playback_state==="playing"&&o?s+(Date.now()/1e3-o):s}cmd(e){let r=this.playerId;!this.client||!r||e(this.client,r).catch(s=>this.error=s.message)}get groupLeader(){return Ce(this.selectedPlayer,this.players)}get groupMembers(){let e=new Set(ae(this.groupLeader,this.players));return this.players.filter(r=>e.has(r.player_id))}get groupCandidates(){let e=this.groupLeader;if(!e)return[];let r=new Set(ae(e,this.players));return this.players.filter(s=>s.player_id!==e.player_id&&!r.has(s.player_id)&&Me(e,s))}get canManageGroup(){return Ee(this.groupLeader)}runGroupCmd(e){if(this.client)try{e(this.client).catch(r=>this.error=r.message)}catch(r){this.error=r.message}}addToGroup(e){let r=this.groupLeader;r&&this.runGroupCmd(s=>s.setGroupMembers(r.player_id,{add:[e]}))}removeFromGroup(e){let r=this.groupLeader;r&&this.runGroupCmd(s=>s.setGroupMembers(r.player_id,{remove:[e]}))}ungroupAll(){let e=this.groupLeader;e&&this.runGroupCmd(r=>r.ungroupPlayer(e.player_id))}get musicProviders(){return this.providers.filter(e=>e.type==="music")}async doSearch(){if(!(!this.client||!this.query.trim())){this.browseMode="search",this.searching=!0,this.results=void 0;try{this.results=await this.client.search(this.query.trim(),{userId:this.userId,providers:this.providerId?[this.providerId]:void 0})}catch(e){this.error=e.message}finally{this.searching=!1}}}openBrowse(){this.view="browse",this.browseMode="tree",this.browseStack.length||this.loadBrowse([{name:"Browse"}])}async loadBrowse(e){if(this.client){this.browseMode="tree",this.browsing=!0,this.browseStack=e;try{let r=e[e.length-1]?.path;this.browseItems=await this.client.browse(r,this.playerId)}catch(r){this.error=r.message,this.browseItems=[]}finally{this.browsing=!1}}}browseTap(e){e.media_type==="folder"?this.loadBrowse([...this.browseStack,{name:e.name,path:e.path}]):this.playItem(e)}crumbTo(e){this.loadBrowse(this.browseStack.slice(0,e+1))}async playItem(e){let r=this.playerId;if(!(!this.client||!r||!e.uri))try{await this.client.playMedia(r,e.uri,this.userId),this.statusMsg=`\u25B6 ${e.name}`,this.view="main"}catch(s){this.error=s.message}}render(){return this.config?this.loading?n`<ha-card><div class="pad muted">Loading…</div></ha-card>`:this.view==="players"?n`<ha-card>${this.renderPlayersView()}</ha-card>`:this.view==="browse"?n`<ha-card>${this.renderBrowseView()}</ha-card>`:this.view==="group"?n`<ha-card>${this.renderGroupView()}</ha-card>`:n`
      <ha-card>
        <div class="pickers">${this.renderPickerButtons()}</div>
        ${this.error?n`<div class="error">${this.error}</div>`:c}
        ${this.renderNowPlaying()} ${this.renderControls()} ${this.renderSearch()}
      </ha-card>
    `:n`<ha-card>Not configured</ha-card>`}renderViewHead(e){return n`
      <div class="view-head">
        <button class="ctl" title="Back" @click=${()=>this.view="main"}>‹</button>
        <span class="view-title">${e}</span>
      </div>
    `}get allowEveryone(){return this.config?.allow_everyone!==!1}pickProvider(e){if(this.providerId=e,this.browseMode==="search"){this.query.trim()&&this.doSearch();return}if(e){let r=this.providers.find(s=>s.instance_id===e);this.loadBrowse([{name:"Browse"},{name:r?.name??"Source",path:`${e}://`}])}else this.loadBrowse([{name:"Browse"}])}renderPickerButtons(){let e=this.selectedPlayer,r=e?this.groupMembers.length:0;return n`
      <button class="selbtn" @click=${()=>this.view="players"}>
        <span class="ic">🔊</span>
        <span class="selbtn-main">${e?w(e):"No player"}</span>
        ${e?n`<span class="selbtn-sub">${z(e,this.hass)}</span>`:c}
        <span class="caret">▾</span>
      </button>
      ${e&&this.canManageGroup?n`
            <button
              class="groupbtn ${r?"on":""}"
              title="Group speakers"
              @click=${()=>this.view="group"}
            >
              <span class="ic">🔗</span>
              ${r?n`<span class="group-badge">+${r}</span>`:c}
            </button>
          `:c}
    `}renderGroupView(){let e=this.groupLeader;if(!e)return n`
        ${this.renderViewHead("Group speakers")}
        <div class="muted pad">Pick a player first.</div>
      `;if(!this.canManageGroup)return n`
        ${this.renderViewHead("Group speakers")}
        <div class="muted pad">${w(e)} doesn't support grouping.</div>
      `;let r=this.groupMembers,s=this.groupCandidates;return n`
      ${this.renderViewHead("Group speakers")}
      ${this.error?n`<div class="error">${this.error}</div>`:c}
      <div class="view-list">
        <div class="sheet-group">Playing on</div>
        ${this.sheetRow(!0,"\u{1F50A}",w(e),z(e,this.hass),()=>{})}
        ${r.length?n`
              <div class="sheet-group">Grouped speakers</div>
              ${r.map(o=>this.groupRow(o,"remove",()=>this.removeFromGroup(o.player_id)))}
              <button class="browse ungroup" @click=${()=>this.ungroupAll()}>
                ✕ Ungroup all
              </button>
            `:n`<div class="muted pad">No other speakers grouped yet.</div>`}
        <div class="sheet-group">Add speakers</div>
        ${s.length?s.map(o=>this.groupRow(o,"add",()=>this.addToGroup(o.player_id))):n`<div class="muted pad">No compatible speakers available.</div>`}
      </div>
    `}groupRow(e,r,s){return n`
      <button class="sheet-row group-row" @click=${s}>
        <span class="row-ic">🔊</span>
        <span class="row-txt">
          <span class="row-lbl">${w(e)}</span>
          <span class="row-sub">${z(e,this.hass)}</span>
        </span>
        <span class="group-act ${r}">${r==="add"?"\uFF0B":"\u2715"}</span>
      </button>
    `}renderPlayersView(){let e=this.playerQuery.trim().toLowerCase(),r=new Map;for(let s of this.scopedPlayers){let o=z(s,this.hass);e&&!w(s).toLowerCase().includes(e)&&!o.toLowerCase().includes(e)||(r.get(o)??r.set(o,[]).get(o)).push(s)}return n`
      ${this.renderViewHead("Play on\u2026")}
      <input
        class="sheet-search"
        type="text"
        placeholder="Filter rooms or players…"
        .value=${this.playerQuery}
        @input=${s=>this.playerQuery=s.target.value}
      />
      <div class="view-list">
        ${[...r.entries()].sort((s,o)=>s[0].localeCompare(o[0])).map(([s,o])=>n`
              <div class="sheet-group">${s}</div>
              ${o.map(a=>this.sheetRow(a.player_id===this.playerId,a.playback_state==="playing"?"\u25B6":"\u{1F50A}",w(a),a.playback_state==="playing"?"playing":void 0,()=>{this.playerId=a.player_id,this.view="main",this.playerQuery=""}))}
            `)}
        ${r.size===0?n`<div class="muted pad">no matches</div>`:c}
      </div>
    `}sheetRow(e,r,s,o,a){return n`
      <button class="sheet-row ${e?"active":""}" @click=${a}>
        <span class="row-ic">${r}</span>
        <span class="row-txt">
          <span class="row-lbl">${s}</span>
          ${o?n`<span class="row-sub">${o}</span>`:c}
        </span>
        ${e?n`<span class="row-check">✓</span>`:c}
      </button>
    `}renderNowPlaying(){let e=this.selectedPlayer,r=e?.current_media,s=r?.image_url;return n`
      <div class="art">
        ${s?n`<img src=${s} alt="" />`:n`<div class="art-empty">♪</div>`}
      </div>
      <div class="meta">
        <div class="title">${r?.title??"Nothing playing"}</div>
        <div class="artist">${r?.artist??(e?w(e):"")}</div>
      </div>
      ${this.renderProgress()}
    `}renderProgress(){this.tick;let e=this.selectedPlayer,r=e?.current_media?.duration??0,s=e?this.liveElapsed(e):0;return n`
      <div class="progress">
        <input
          type="range"
          min="0"
          max=${r||0}
          .value=${String(Math.floor(s))}
          ?disabled=${!r}
          @change=${o=>this.cmd((a,l)=>a.seek(l,Number(o.target.value)))}
        />
        <div class="times"><span>${de(s)}</span><span>${de(r)}</span></div>
      </div>
    `}renderControls(){let e=this.selectedPlayer,r=e?.playback_state==="playing",s=e?.volume_level??0,o=!!e?.volume_muted;return n`
      <div class="controls">
        <button class="ctl" title="Previous" @click=${()=>this.cmd((a,l)=>a.previous(l))}>
          ⏮
        </button>
        <button class="ctl big" title="Play/Pause" @click=${()=>this.cmd((a,l)=>a.playPause(l))}>
          ${r?"\u23F8":"\u25B6"}
        </button>
        <button class="ctl" title="Next" @click=${()=>this.cmd((a,l)=>a.next(l))}>⏭</button>
      </div>
      <div class="volrow">
        <button class="ctl sm" title="Mute" @click=${()=>this.cmd((a,l)=>a.setMute(l,!o))}>
          ${o?"\u{1F507}":"\u{1F50A}"}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          .value=${String(s)}
          @change=${a=>this.cmd((l,d)=>l.setVolume(d,Number(a.target.value)))}
        />
        <button
          class="ctl sm ${e?.powered?"on":""}"
          title="Power"
          @click=${()=>this.cmd((a,l)=>a.setPower(l,!e?.powered))}
        >
          ⏻
        </button>
      </div>
    `}renderSearch(){return n`
      <button class="browse" @click=${()=>this.openBrowse()}>⌕ Browse / Search</button>
      ${this.statusMsg?n`<div class="muted status">${this.statusMsg}</div>`:c}
    `}renderBrowseView(){let e=this.selectedPlayer;return n`
      ${this.renderViewHead("Browse & Search")}
      <div class="src-bar">
        <div class="src-line">
          <span class="src-cap">Source</span>
          <div class="src-chips">
            ${this.srcChip(!this.providerId,"All",()=>this.pickProvider(void 0))}
            ${this.musicProviders.map(r=>this.srcChip(r.instance_id===this.providerId,r.name,()=>this.pickProvider(r.instance_id)))}
          </div>
        </div>
      </div>
      <div class="searchbox">
        <input
          type="text"
          placeholder="Search this source…"
          .value=${this.query}
          @input=${r=>this.query=r.target.value}
          @keydown=${r=>r.key==="Enter"&&this.doSearch()}
        />
        <button class="ctl sm" @click=${()=>this.doSearch()}>⌕</button>
      </div>
      ${e?c:n`<div class="muted pad">Pick a player first to play.</div>`}
      ${this.renderBrowseNav()}
      <div class="view-list">
        ${this.browseMode==="search"?this.searching?n`<div class="muted pad">Searching…</div>`:this.renderResults():this.browsing?n`<div class="muted pad">Loading…</div>`:this.renderBrowseList()}
      </div>
    `}renderBrowseNav(){return this.browseMode==="search"?n`
        <button class="crumb-back" @click=${()=>this.browseMode="tree"}>‹ Back to Browse</button>
      `:n`
      <div class="crumbs">
        ${this.browseStack.map((e,r)=>{let s=r===this.browseStack.length-1;return n`
            <button class="crumb ${s?"active":""}" @click=${()=>this.crumbTo(r)}>
              ${e.name}
            </button>
            ${s?c:n`<span class="crumb-sep">›</span>`}
          `})}
      </div>
    `}renderBrowseList(){return this.browseItems.length?n`
      ${this.browseItems.map(e=>this.sheetRow(!1,e.media_type==="folder"?"\u{1F4C1}":ne(e.media_type),e.name,e.media_type==="folder"?e.subtitle??void 0:le(e),()=>this.browseTap(e)))}
    `:n`<div class="muted pad">Empty.</div>`}srcChip(e,r,s){return n`<button class="srcchip ${e?"active":""}" @click=${s}>
      ${r}
    </button>`}renderResults(){let e=this.results;if(!e)return n`<div class="muted pad">Search to see results.</div>`;let r=[["Tracks",e.tracks],["Albums",e.albums],["Artists",e.artists],["Playlists",e.playlists],["Radio",e.radio]];return r.some(([,s])=>s&&s.length)?n`
      ${r.map(([s,o])=>o&&o.length?n`
              <div class="sheet-group">${s}</div>
              ${o.map(a=>this.sheetRow(!1,ne(a.media_type),a.name,le(a),()=>this.playItem(a)))}
            `:c)}
    `:n`<div class="muted pad">No results.</div>`}};p.styles=K`
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
    /* group speakers button next to the player selector */
    .groupbtn {
      display: flex;
      align-items: center;
      gap: 4px;
      min-height: 44px;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 22px;
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.95rem;
    }
    .groupbtn.on {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    .group-badge {
      font-size: 0.75rem;
      font-weight: 600;
    }
    .group-row .group-act {
      font-size: 1.2rem;
      width: 1.6rem;
      text-align: center;
    }
    .group-act.add {
      color: var(--primary-color, #03a9f4);
    }
    .group-act.remove {
      color: var(--error-color, #db4437);
    }
    .ungroup {
      margin-top: 8px;
      color: var(--error-color, #db4437);
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
  `,u([G({attribute:!1})],p.prototype,"hass",2),u([m()],p.prototype,"config",2),u([m()],p.prototype,"users",2),u([m()],p.prototype,"players",2),u([m()],p.prototype,"userId",2),u([m()],p.prototype,"playerId",2),u([m()],p.prototype,"error",2),u([m()],p.prototype,"loading",2),u([m()],p.prototype,"query",2),u([m()],p.prototype,"view",2),u([m()],p.prototype,"playerQuery",2),u([m()],p.prototype,"providers",2),u([m()],p.prototype,"providerId",2),u([m()],p.prototype,"results",2),u([m()],p.prototype,"searching",2),u([m()],p.prototype,"browseMode",2),u([m()],p.prototype,"browseItems",2),u([m()],p.prototype,"browseStack",2),u([m()],p.prototype,"browsing",2),u([m()],p.prototype,"statusMsg",2),u([m()],p.prototype,"tick",2),p=u([Se("mass-conductor")],p);window.customCards??=[];window.customCards.push({type:"mass-conductor",name:"Music Assistant Conductor",description:"Mini Music Assistant player with room + user selection."});export{p as MassConductor};
