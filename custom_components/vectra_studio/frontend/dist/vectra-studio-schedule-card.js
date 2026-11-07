var Se=Object.defineProperty;var ot=Object.getOwnPropertyDescriptor;var at=(r,t)=>{for(var e in t)Se(r,e,{get:t[e],enumerable:!0})};var f=(r,t,e,i)=>{for(var n=i>1?void 0:i?ot(t,e):t,o=r.length-1,a;o>=0;o--)(a=r[o])&&(n=(i?a(t,e,n):a(n))||n);return i&&n&&Se(t,e,n),n};var W=window,B=W.ShadowRoot&&(W.ShadyCSS===void 0||W.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,te=Symbol(),ke=new WeakMap,R=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==te)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(B&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=ke.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&ke.set(e,t))}return t}toString(){return this.cssText}},Pe=r=>new R(typeof r=="string"?r:r+"",void 0,te),ie=(r,...t)=>{let e=r.length===1?r[0]:t.reduce(((i,n,o)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+r[o+1]),r[0]);return new R(e,r,te)},ne=(r,t)=>{B?r.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet)):t.forEach((e=>{let i=document.createElement("style"),n=W.litNonce;n!==void 0&&i.setAttribute("nonce",n),i.textContent=e.cssText,r.appendChild(i)}))},q=B?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return Pe(e)})(r):r;var re,G=window,Ae=G.trustedTypes,st=Ae?Ae.emptyScript:"",Te=G.reactiveElementPolyfillSupport,ae={toAttribute(r,t){switch(t){case Boolean:r=r?st:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Me=(r,t)=>t!==r&&(t==t||r==r),oe={attribute:!0,type:String,converter:ae,reflect:!1,hasChanged:Me},se="finalized",w=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),((e=this.h)!==null&&e!==void 0?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach(((e,i)=>{let n=this._$Ep(i,e);n!==void 0&&(this._$Ev.set(n,i),t.push(n))})),t}static createProperty(t,e=oe){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){let i=typeof t=="symbol"?Symbol():"__"+t,n=this.getPropertyDescriptor(t,i,e);n!==void 0&&Object.defineProperty(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(n){let o=this[t];this[e]=n,this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||oe}static finalize(){if(this.hasOwnProperty(se))return!1;this[se]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let e=this.properties,i=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(let n of i)this.createProperty(n,e[n])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let n of i)e.unshift(q(n))}else t!==void 0&&e.push(q(t));return e}static _$Ep(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach((e=>e(this)))}addController(t){var e,i;((e=this._$ES)!==null&&e!==void 0?e:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)===null||i===void 0||i.call(t))}removeController(t){var e;(e=this._$ES)===null||e===void 0||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;let e=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return ne(e,this.constructor.elementStyles),e}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach((e=>{var i;return(i=e.hostConnected)===null||i===void 0?void 0:i.call(e)}))}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach((e=>{var i;return(i=e.hostDisconnected)===null||i===void 0?void 0:i.call(e)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=oe){var n;let o=this.constructor._$Ep(t,i);if(o!==void 0&&i.reflect===!0){let a=(((n=i.converter)===null||n===void 0?void 0:n.toAttribute)!==void 0?i.converter:ae).toAttribute(e,i.type);this._$El=t,a==null?this.removeAttribute(o):this.setAttribute(o,a),this._$El=null}}_$AK(t,e){var i;let n=this.constructor,o=n._$Ev.get(t);if(o!==void 0&&this._$El!==o){let a=n.getPropertyOptions(o),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((i=a.converter)===null||i===void 0?void 0:i.fromAttribute)!==void 0?a.converter:ae;this._$El=o,this[o]=l.fromAttribute(e,a.type),this._$El=null}}requestUpdate(t,e,i){let n=!0;t!==void 0&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||Me)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,i))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((n,o)=>this[o]=n)),this._$Ei=void 0);let e=!1,i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(t=this._$ES)===null||t===void 0||t.forEach((n=>{var o;return(o=n.hostUpdate)===null||o===void 0?void 0:o.call(n)})),this.update(i)):this._$Ek()}catch(n){throw e=!1,this._$Ek(),n}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;(e=this._$ES)===null||e===void 0||e.forEach((i=>{var n;return(n=i.hostUpdated)===null||n===void 0?void 0:n.call(i)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach(((e,i)=>this._$EO(i,this[i],e))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};w[se]=!0,w.elementProperties=new Map,w.elementStyles=[],w.shadowRootOptions={mode:"open"},Te?.({ReactiveElement:w}),((re=G.reactiveElementVersions)!==null&&re!==void 0?re:G.reactiveElementVersions=[]).push("1.6.3");var le,V=window,T=V.trustedTypes,Ne=T?T.createPolicy("lit-html",{createHTML:r=>r}):void 0,de="$lit$",x=`lit$${(Math.random()+"").slice(9)}$`,Oe="?"+x,lt=`<${Oe}>`,P=document,C=()=>P.createComment(""),D=r=>r===null||typeof r!="object"&&typeof r!="function",Fe=Array.isArray,ct=r=>Fe(r)||typeof r?.[Symbol.iterator]=="function",ce=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ie=/-->/g,Le=/>/g,S=RegExp(`>|${ce}(?:([^\\s"'>=/]+)(${ce}*=${ce}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Re=/'/g,He=/"/g,ze=/^(?:script|style|textarea|title)$/i,Ue=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),d=Ue(1),K=Ue(2),A=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),Ce=new WeakMap,k=P.createTreeWalker(P,129,null,!1);function je(r,t){if(!Array.isArray(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ne!==void 0?Ne.createHTML(t):t}var dt=(r,t)=>{let e=r.length-1,i=[],n,o=t===2?"<svg>":"",a=H;for(let l=0;l<e;l++){let s=r[l],u,p,_=-1,m=0;for(;m<s.length&&(a.lastIndex=m,p=a.exec(s),p!==null);)m=a.lastIndex,a===H?p[1]==="!--"?a=Ie:p[1]!==void 0?a=Le:p[2]!==void 0?(ze.test(p[2])&&(n=RegExp("</"+p[2],"g")),a=S):p[3]!==void 0&&(a=S):a===S?p[0]===">"?(a=n??H,_=-1):p[1]===void 0?_=-2:(_=a.lastIndex-p[2].length,u=p[1],a=p[3]===void 0?S:p[3]==='"'?He:Re):a===He||a===Re?a=S:a===Ie||a===Le?a=H:(a=S,n=void 0);let b=a===S&&r[l+1].startsWith("/>")?" ":"";o+=a===H?s+lt:_>=0?(i.push(u),s.slice(0,_)+de+s.slice(_)+x+b):s+x+(_===-2?(i.push(void 0),l):b)}return[je(r,o+(r[e]||"<?>")+(t===2?"</svg>":"")),i]},O=class r{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let o=0,a=0,l=t.length-1,s=this.parts,[u,p]=dt(t,e);if(this.el=r.createElement(u,i),k.currentNode=this.el.content,e===2){let _=this.el.content,m=_.firstChild;m.remove(),_.append(...m.childNodes)}for(;(n=k.nextNode())!==null&&s.length<l;){if(n.nodeType===1){if(n.hasAttributes()){let _=[];for(let m of n.getAttributeNames())if(m.endsWith(de)||m.startsWith(x)){let b=p[a++];if(_.push(m),b!==void 0){let y=n.getAttribute(b.toLowerCase()+de).split(x),$=/([.?@])?(.*)/.exec(b);s.push({type:1,index:o,name:$[2],strings:y,ctor:$[1]==="."?he:$[1]==="?"?pe:$[1]==="@"?me:N})}else s.push({type:6,index:o})}for(let m of _)n.removeAttribute(m)}if(ze.test(n.tagName)){let _=n.textContent.split(x),m=_.length-1;if(m>0){n.textContent=T?T.emptyScript:"";for(let b=0;b<m;b++)n.append(_[b],C()),k.nextNode(),s.push({type:2,index:++o});n.append(_[m],C())}}}else if(n.nodeType===8)if(n.data===Oe)s.push({type:2,index:o});else{let _=-1;for(;(_=n.data.indexOf(x,_+1))!==-1;)s.push({type:7,index:o}),_+=x.length-1}o++}}static createElement(t,e){let i=P.createElement("template");return i.innerHTML=t,i}};function M(r,t,e=r,i){var n,o,a,l;if(t===A)return t;let s=i!==void 0?(n=e._$Co)===null||n===void 0?void 0:n[i]:e._$Cl,u=D(t)?void 0:t._$litDirective$;return s?.constructor!==u&&((o=s?._$AO)===null||o===void 0||o.call(s,!1),u===void 0?s=void 0:(s=new u(r),s._$AT(r,e,i)),i!==void 0?((a=(l=e)._$Co)!==null&&a!==void 0?a:l._$Co=[])[i]=s:e._$Cl=s),s!==void 0&&(t=M(r,s._$AS(r,t.values),s,i)),t}var ue=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;let{el:{content:i},parts:n}=this._$AD,o=((e=t?.creationScope)!==null&&e!==void 0?e:P).importNode(i,!0);k.currentNode=o;let a=k.nextNode(),l=0,s=0,u=n[0];for(;u!==void 0;){if(l===u.index){let p;u.type===2?p=new F(a,a.nextSibling,this,t):u.type===1?p=new u.ctor(a,u.name,u.strings,this,t):u.type===6&&(p=new ge(a,this,t)),this._$AV.push(p),u=n[++s]}l!==u?.index&&(a=k.nextNode(),l++)}return k.currentNode=P,o}v(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},F=class r{constructor(t,e,i,n){var o;this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cp=(o=n?.isConnected)===null||o===void 0||o}get _$AU(){var t,e;return(e=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&e!==void 0?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=M(this,t,e),D(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):ct(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==h&&D(this._$AH)?this._$AA.nextSibling.data=t:this.$(P.createTextNode(t)),this._$AH=t}g(t){var e;let{values:i,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=O.createElement(je(n.h,n.h[0]),this.options)),n);if(((e=this._$AH)===null||e===void 0?void 0:e._$AD)===o)this._$AH.v(i);else{let a=new ue(o,this),l=a.u(this.options);a.v(i),this.$(l),this._$AH=a}}_$AC(t){let e=Ce.get(t.strings);return e===void 0&&Ce.set(t.strings,e=new O(t)),e}T(t){Fe(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,n=0;for(let o of t)n===e.length?e.push(i=new r(this.k(C()),this.k(C()),this,this.options)):i=e[n],i._$AI(o),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)===null||i===void 0||i.call(this,!1,!0,e);t&&t!==this._$AB;){let n=t.nextSibling;t.remove(),t=n}}setConnected(t){var e;this._$AM===void 0&&(this._$Cp=t,(e=this._$AP)===null||e===void 0||e.call(this,t))}},N=class{constructor(t,e,i,n,o){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=h}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,n){let o=this.strings,a=!1;if(o===void 0)t=M(this,t,e,0),a=!D(t)||t!==this._$AH&&t!==A,a&&(this._$AH=t);else{let l=t,s,u;for(t=o[0],s=0;s<o.length-1;s++)u=M(this,l[i+s],e,s),u===A&&(u=this._$AH[s]),a||(a=!D(u)||u!==this._$AH[s]),u===h?t=h:t!==h&&(t+=(u??"")+o[s+1]),this._$AH[s]=u}a&&!n&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},he=class extends N{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},ut=T?T.emptyScript:"",pe=class extends N{constructor(){super(...arguments),this.type=4}j(t){t&&t!==h?this.element.setAttribute(this.name,ut):this.element.removeAttribute(this.name)}},me=class extends N{constructor(t,e,i,n,o){super(t,e,i,n,o),this.type=5}_$AI(t,e=this){var i;if((t=(i=M(this,t,e,0))!==null&&i!==void 0?i:h)===A)return;let n=this._$AH,o=t===h&&n!==h||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,a=t!==h&&(n===h||o);o&&this.element.removeEventListener(this.name,this,n),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;typeof this._$AH=="function"?this._$AH.call((i=(e=this.options)===null||e===void 0?void 0:e.host)!==null&&i!==void 0?i:this.element,t):this._$AH.handleEvent(t)}},ge=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t)}};var De=V.litHtmlPolyfillSupport;De?.(O,F),((le=V.litHtmlVersions)!==null&&le!==void 0?le:V.litHtmlVersions=[]).push("2.8.0");var We=(r,t,e)=>{var i,n;let o=(i=e?.renderBefore)!==null&&i!==void 0?i:t,a=o._$litPart$;if(a===void 0){let l=(n=e?.renderBefore)!==null&&n!==void 0?n:null;o._$litPart$=a=new F(t.insertBefore(C(),l),l,void 0,e??{})}return a._$AI(r),a};var _e,fe;var E=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;let i=super.createRenderRoot();return(t=(e=this.renderOptions).renderBefore)!==null&&t!==void 0||(e.renderBefore=i.firstChild),i}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=We(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return A}};E.finalized=!0,E._$litElement$=!0,(_e=globalThis.litElementHydrateSupport)===null||_e===void 0||_e.call(globalThis,{LitElement:E});var Be=globalThis.litElementPolyfillSupport;Be?.({LitElement:E});((fe=globalThis.litElementVersions)!==null&&fe!==void 0?fe:globalThis.litElementVersions=[]).push("3.3.3");var qe=r=>t=>typeof t=="function"?((e,i)=>(customElements.define(e,i),i))(r,t):((e,i)=>{let{kind:n,elements:o}=i;return{kind:n,elements:o,finisher(a){customElements.define(e,a)}}})(r,t);var ht=(r,t)=>t.kind==="method"&&t.descriptor&&!("value"in t.descriptor)?{...t,finisher(e){e.createProperty(t.key,r)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){typeof t.initializer=="function"&&(this[t.key]=t.initializer.call(this))},finisher(e){e.createProperty(t.key,r)}},pt=(r,t,e)=>{t.constructor.createProperty(e,r)};function Y(r){return(t,e)=>e!==void 0?pt(r,t,e):ht(r,t)}function v(r){return Y({...r,state:!0})}var ve,li=((ve=window.HTMLSlotElement)===null||ve===void 0?void 0:ve.prototype.assignedElements)!=null?(r,t)=>r.assignedElements(t):(r,t)=>r.assignedNodes(t).filter((e=>e.nodeType===Node.ELEMENT_NODE));var Ge,I;(function(r){r.language="language",r.system="system",r.comma_decimal="comma_decimal",r.decimal_comma="decimal_comma",r.space_comma="space_comma",r.none="none"})(Ge||(Ge={})),(function(r){r.language="language",r.system="system",r.am_pm="12",r.twenty_four="24"})(I||(I={}));var mt=function(r){if(r.time_format===I.language||r.time_format===I.system){var t=r.time_format===I.language?r.language:void 0,e=new Date().toLocaleString(t);return e.includes("AM")||e.includes("PM")}return r.time_format===I.am_pm};var Ve=function(r,t){return gt(t).format(r)},gt=function(r){return new Intl.DateTimeFormat(r.language,{hour:"numeric",minute:"2-digit",hour12:mt(r)})};var U={};at(U,{default:()=>bt,editor:()=>_t,scene_card:()=>ft,schedule_card:()=>vt});var _t={entity:"Scene selection entity",entity_helper:"The select.*_scene_selection entity for the tank this card should control.",device_id:"Light or pump device",device_id_helper:"Any one light or pump in the schedule group this card should show -- never the Tank device itself."},ft={title:"Scene",running_normal_schedule:"Running the normal schedule.",active_suffix:"active",remaining_suffix:"remaining",normal_schedule_tile:"Normal schedule",entity_not_found:"Entity not found:"},vt={loading:"Loading\u2026",device_not_found:"This device could not be found.",no_tank_found:"This device isn't linked to a Mobius tank.",group_not_found:"Couldn't find this device's own schedule group.",light_title:"Light Schedule",pump_title:"Pump Schedule",lunar_phases_active:"Lunar phases active",lunar_enable:"Enable moon cycle tracking",lunar_disable:"Disable moon cycle tracking",moon_phase_new:"New Moon",moon_phase_waxing_crescent:"Waxing Crescent",moon_phase_waxing_gibbous:"Waxing Gibbous",moon_phase_full:"Full Moon",moon_phase_waning_gibbous:"Waning Gibbous",moon_phase_waning_crescent:"Waning Crescent",scene_running_instead:"is running instead of the schedule",remaining_suffix:"remaining",speed_not_reliable:"speed (flow reading not reliable on this device)",no_flow_data:"No flow or speed data available.",currently_running:"Currently running",edit_schedule:"Edit schedule",is_unavailable:"is unavailable.",are_unavailable:"are unavailable.",no_channel_data:"No channel data available -- every light in this group is currently unavailable.",overall_intensity:"Overall intensity",loading_history:"Loading history\u2026",no_history_yet:"No history recorded yet today.",back:"Back",period_day:"Day",period_night:"Night",period_sunrise:"Sunrise",period_sunset:"Sunset",time:"Time",period:"Period",mode:"Mode",cancel:"Cancel",save:"Save",parent_pump:"Parent pump",no_other_pumps:"No other pumps found on this tank.",anti_sync:"Anti-Sync",ecosmart_back:"EcoSmart Back",reverse_hint:"A negative value reverses rotation direction, on pumps that support it.",schedule_saved:"Schedule saved.",saving_schedule:"Saving\u2026",save_schedule:"Save schedule to device",app_cache_note:"The Mobius app keeps its own copy of the schedule and won't show changes made here. To bring it up to date, download the .mob file after saving and import it in the app.",mixed_channels_note:"These lights don't all have the same channels; each is sent only the channels it has.",add_point:"Add point",delete:"Delete",variance_none:"None",variance_low:"Low",variance_medium:"Medium",variance_high:"High",download_mob:"Download .mob",exporting_mob:"Exporting\u2026",load_mob:"Load .mob",importing_mob:"Loading\u2026",mob_wrong_extension:"Please choose a .mob file.",mob_invalid_json:"This file doesn't look like a valid .mob file.",seconds_unit:"s"},bt={editor:_t,scene_card:ft,schedule_card:vt};var yt={en:U};function Ke(r,t){let e=t.split(".").reduce((i,n)=>i&&typeof i=="object"?i[n]:void 0,r);return typeof e=="string"?e:void 0}function c(r,t){let e=(t||(typeof navigator<"u"?navigator.language:"en")).split("-")[0].toLowerCase(),i=yt[e]??U;return Ke(i,r)??Ke(U,r)??r}function Ye(r){let t=Math.floor(r/60),e=r%60;return`${t}:${String(e).padStart(2,"0")}`}function Xe(r,t=Date.now()){let e=typeof r.ends_at=="string"?Date.parse(r.ends_at):NaN;if(!Number.isNaN(e))return Math.max(0,Math.round((e-t)/1e3));let i=r.duration_remaining_seconds;return typeof i=="number"?i:void 0}var J=class{constructor(t){this._host=t}sync(t){t&&this._handle===void 0?this._handle=setInterval(()=>this._host.requestUpdate(),1e3):t||this.stop()}stop(){this._handle!==void 0&&(clearInterval(this._handle),this._handle=void 0)}};function $t(r){return r.length<=1?r[0]||"":r.length===2?`${r[0]} and ${r[1]}`:`${r.slice(0,-1).join(", ")}, and ${r[r.length-1]}`}var Z=600,Q=200,wt={coolwhite:"#d6ecff",blue:"#2f6fed",royalblue:"#4169e1",green:"#43a047",red:"#e53935",uv:"#9400d3",warmwhite:"#ffe0b2",violet:"#8a2be2",deepblue:"#1a237e",deepred:"#b71c1c",neutralwhite:"#f5f5dc",yellow:"#fdd835",amber:"#ffb300",farred:"#4a0000",moonlight:"#7986cb",moonlightwhite:"#c5cae9",moonlightblue:"#5c6bc0",cyan:"#00bcd4",lime:"#c0ca33",blueandwhite:"#90a4ae",redandwhite:"#ef9a9a",uv_plus:"#7b1fa2",white:"#e0e0e0"},Je=["#4fc3f7","#ff8a65","#aed581","#ba68c8","#ffd54f"];function j(r){let t=wt[r.toLowerCase()];if(t)return t;let e=0;for(let i=0;i<r.length;i++)e=e*31+r.charCodeAt(i)>>>0;return Je[e%Je.length]}var xt=new Set(["Time","StartTime","EndTime","BigTime","OnTime","OffTime"]);function ee(r,t,e){return Math.min(e,Math.max(t,r))}function be(r){return"mode"in r}function Ze(r){return(r&6)===6?"sunrise":(r&10)===10?"sunset":r&2?"night":"day"}function Et(r,t){let e=t?.locale?.language;switch(r){case"mdi:moon-new":return c("schedule_card.moon_phase_new",e);case"mdi:moon-waxing-crescent":return c("schedule_card.moon_phase_waxing_crescent",e);case"mdi:moon-waxing-gibbous":return c("schedule_card.moon_phase_waxing_gibbous",e);case"mdi:moon-full":return c("schedule_card.moon_phase_full",e);case"mdi:moon-waning-gibbous":return c("schedule_card.moon_phase_waning_gibbous",e);case"mdi:moon-waning-crescent":return c("schedule_card.moon_phase_waning_crescent",e);default:return""}}function Qe(r){switch(r){case"sunrise":return c("schedule_card.period_sunrise");case"sunset":return c("schedule_card.period_sunset");case"night":return c("schedule_card.period_night");default:return c("schedule_card.period_day")}}function St(r){let t=Math.floor(r/60),e=r%60;return`${t}:${String(e).padStart(2,"0")}`}function kt(r){let t=r.locale?.time_format;if(t==="12hour"||t==="am_pm"||t==="12")return!0;if(t==="24hour"||t==="24")return!1;let e=t==="language"?r.locale?.language:void 0;return new Intl.DateTimeFormat(e,{hour:"numeric"}).resolvedOptions().hour12??!1}function et(r){let t=Number(r);return Number.isFinite(t)?String(Math.round(t)):r}function L(r){return r instanceof Error?r.message:String(r)}function ye(r){return!!r&&r.state!=="unavailable"&&r.state!=="unknown"}function tt(r,t){return t?Ve(r,t):`${r.getHours()}:${String(r.getMinutes()).padStart(2,"0")}`}function $e(r){return Object.entries(r.channel_entity_ids??{}).filter(t=>!!t[1])}function we(){return Date.now()-1440*60*1e3}function Pt(r,t,e){let i=[],n=new Date(r);for(n.setMinutes(0,0,0);n.getTime()<r||n.getHours()%e!==0;)n.setHours(n.getHours()+1);for(;n.getTime()<=t;)i.push(n.getTime()),n.setHours(n.getHours()+e);return i}var it=["Sinusoidal","Logarithmic","Linear"],At={day:1,night:3,sunrise:7,sunset:11};function xe(r,t){return r!=="Sync"?r:t===180?"AntiSync":"Sync"}function nt(r){return r==="AntiSync"?c("schedule_card.anti_sync"):r==="EcoSmartBack"?c("schedule_card.ecosmart_back"):r}function Tt(r){return r.flatMap(t=>t==="Sync"?["Sync","AntiSync"]:[t])}var g=class extends E{constructor(){super(...arguments);this._loading=!1;this._pendingLunarToggle=!1;this._channelHistoryByEntity={};this._historyLoading=!1;this._view="glance";this._scheduleLoading=!1;this._schedulePoints=[];this._savingSchedule=!1;this._saveScheduleSucceeded=!1;this._exportingMob=!1;this._importingMob=!1;this._editingIndex=null;this._isNewPoint=!1;this._otherPumps=[];this._countdown=new J(this)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._historyRefreshHandle),this._countdown.stop()}setConfig(e){if(!e||!e.device_id)throw new Error('vectra-studio-schedule-card: "device_id" is required (a light or pump device, never the Tank itself)');this._config=e,this._resolvedFor=void 0,this._group=void 0,this._error=void 0}getCardSize(){return this._group?.kind==="light"?6:4}getGridOptions(){return this._group?.kind==="light"?{columns:12,rows:7,min_columns:4,max_columns:12,min_rows:5,max_rows:10}:{columns:6,rows:4,min_columns:3,max_columns:12,min_rows:3,max_rows:6}}static getStubConfig(){return{device_id:""}}static getConfigForm(){return{schema:[{name:"device_id",required:!0,selector:{device:{integration:"vectra_studio"}}}],computeLabel:e=>e.name==="device_id"?c("editor.device_id"):void 0,computeHelper:e=>e.name==="device_id"?c("editor.device_id_helper"):void 0}}willUpdate(){!this.hass||!this._config||this._resolvedFor!==this._config.device_id&&this._resolveGroup()}async _resolveGroup(){let e=this._config.device_id;this._resolvedFor=e,this._loading=!0,this._error=void 0;try{let i=this.hass.devices?.[e];if(!i)throw new Error(c("schedule_card.device_not_found"));let n=i.via_device_id;if(!n)throw new Error(c("schedule_card.no_tank_found"));let o=await this.hass.callWS({type:"vectra_studio/resolve_schedule_groups",device_id:n}),a=o.groups.find(l=>l.members.some(s=>s.device_id===e));if(!a)throw new Error(c("schedule_card.group_not_found"));this._group=a,this._otherPumps=o.groups.filter(l=>l.kind==="pump").flatMap(l=>l.members).filter(l=>l.device_id!==e),clearInterval(this._historyRefreshHandle),a.kind==="light"&&(this._fetchChannelHistory(a),this._historyRefreshHandle=setInterval(()=>this._fetchChannelHistory(a),g.HISTORY_REFRESH_INTERVAL_MS))}catch(i){this._error=L(i),this._group=void 0}finally{this._loading=!1}}async _fetchChannelHistory(e){let i=e.members.flatMap(n=>Object.values(n.channel_entity_ids??{})).filter(n=>!!n);if(i.length!==0){this._historyLoading=!0;try{let n=await this.hass.callWS({type:"history/history_during_period",start_time:new Date(we()).toISOString(),entity_ids:i,no_attributes:!0,minimal_response:!0}),o={};for(let[a,l]of Object.entries(n))o[a]=l.map(s=>({t:(s.lu??s.lc??0)*1e3,v:Number(s.s)})).filter(s=>Number.isFinite(s.v));this._channelHistoryByEntity=o}catch{this._channelHistoryByEntity={}}finally{this._historyLoading=!1}}}_finishEditing(e){e&&this._isNewPoint&&this._editingIndex!=null&&(this._schedulePoints=this._schedulePoints.filter((i,n)=>n!==this._editingIndex)),this._editingIndex=null,this._workingPoint=void 0,this._isNewPoint=!1}_closeEdit(){this._finishEditing(!0),this._view="glance",this._saveScheduleError=void 0,this._saveScheduleSucceeded=!1}_startEditingPoint(e){this._editingIndex=e,this._isNewPoint=!1;let i=this._schedulePoints[e];this._workingPoint=be(i)?{...i,params:{...i.params}}:{...i,channels:{...i.channels}}}_cancelEditingPoint(){this._finishEditing(!0)}_saveEditingPoint(){if(this._editingIndex==null||!this._workingPoint)return;let e=[...this._schedulePoints];e[this._editingIndex]=this._workingPoint,this._schedulePoints=e,this._finishEditing(!1)}_deleteEditingPoint(){this._editingIndex!=null&&(this._schedulePoints=this._schedulePoints.filter((e,i)=>i!==this._editingIndex),this._finishEditing(!1))}_updateWorkingPointTime(e){this._workingPoint&&(this._workingPoint={...this._workingPoint,time_minutes:e})}_updateWorkingPointPeriod(e){this._workingPoint&&(this._workingPoint={...this._workingPoint,flags:At[e]})}_updateWorkingPumpMode(e){let i=this._workingPoint;if(!i||!this._group)return;let n=e==="AntiSync"?"Sync":e,o=e==="AntiSync"?180:n==="Sync"||n==="EcoSmartBack"?0:void 0,a=this._group.mode_params?.[n]??[],l={};for(let s of a)s==="PhaseShift"&&o!==void 0?l[s]=o:s in i.params?l[s]=i.params[s]:s==="RampType"?l[s]=it[0]:s==="ParentSerial"?l[s]=this._otherPumps[0]?.serial??"":l[s]=this._defaultParamValue(n,s);this._workingPoint={...i,mode:n,params:l}}_updateWorkingPumpParam(e,i){let n=this._workingPoint;n&&(this._workingPoint={...n,params:{...n.params,[e]:i}})}async _openEdit(){this._view="edit",this._scheduleLoading=!0,this._scheduleError=void 0;try{let e=await this.hass.callWS({type:"vectra_studio/read_schedule_group",device_id:this._config.device_id});this._schedulePoints=e.points}catch(e){this._scheduleError=L(e),this._schedulePoints=[]}finally{this._scheduleLoading=!1}}async _saveScheduleToDevice(){this._savingSchedule=!0,this._saveScheduleError=void 0,this._saveScheduleSucceeded=!1;try{let e=this._schedulePoints.map(i=>be(i)?{...i,flags:1}:i);await this.hass.callService("vectra_studio","write_schedule_group",{device_id:this._config.device_id,points:e}),this._saveScheduleSucceeded=!0,setTimeout(()=>{this._saveScheduleSucceeded=!1},4e3)}catch(e){this._saveScheduleError=L(e)}finally{this._savingSchedule=!1}}async _exportMob(){this._exportingMob=!0,this._mobError=void 0;try{let e=await this.hass.callWS({type:"vectra_studio/export_schedule_group_mob",device_id:this._config.device_id}),i=new Blob([JSON.stringify(e.mob,null,2)],{type:"application/json"}),n=URL.createObjectURL(i),o=document.createElement("a");o.href=n,o.download=`${this._config.device_id}.mob`,o.click(),URL.revokeObjectURL(n)}catch(e){this._mobError=L(e)}finally{this._exportingMob=!1}}_triggerMobFilePicker(){this._mobError=void 0,this.shadowRoot?.querySelector(".mob-file-input")?.click()}async _handleMobFileSelected(e){let i=e.target,n=i.files?.[0];if(i.value="",!!n){if(!n.name.toLowerCase().endsWith(".mob")){this._mobError=c("schedule_card.mob_wrong_extension");return}this._importingMob=!0,this._mobError=void 0;try{let o=await n.text(),a;try{a=JSON.parse(o)}catch{throw new Error(c("schedule_card.mob_invalid_json"))}let l=await this.hass.callWS({type:"vectra_studio/parse_schedule_mob",device_id:this._config.device_id,mob:a});this._schedulePoints=l.points,this._finishEditing(!1)}catch(o){this._mobError=L(o)}finally{this._importingMob=!1}}}_activeSceneState(e){let i=e?.scene_entity_id?this.hass.states[e.scene_entity_id]:void 0;return i&&i.state!=="None"&&i.state!=="unavailable"?i:void 0}_renderSceneBanner(){let e=this._activeSceneState(this._group);if(this._countdown.sync(!!e?.attributes.ends_at),!e)return h;let i=Xe(e.attributes);return d`
      <div class="scene-banner">
        <ha-icon icon="mdi:auto-mode"></ha-icon>
        <span>
          <strong>${e.state}</strong> ${c("schedule_card.scene_running_instead")}
          ${i!=null&&i>0?d`(${Ye(i)} ${c("schedule_card.remaining_suffix")})`:h}
        </span>
      </div>
    `}_showMoreInfo(e){this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}_currentModeText(e,i){let n=this._activeSceneState(e);if(n)return n.state;if(!i)return;let o=i.attributes,a=nt(xe(i.state,o.PhaseShift)),l=o.ParentSerial;if(l){let s=this._otherPumps.find(u=>u.serial===l);if(s)return`${a} (${s.name})`}return a}_renderReading(e,i,n){return d`
      <div
        class="reading reading-clickable"
        role="button"
        tabindex="0"
        @click=${()=>this._showMoreInfo(e)}
        @keydown=${o=>{(o.key==="Enter"||o.key===" ")&&this._showMoreInfo(e)}}
      >
        <span class="reading-value">${i}</span>
        <span class="reading-unit">${n}</span>
      </div>
    `}_renderPumpGlance(){let e=this._group,i=e.members[0],n=i.flow_entity_id?this.hass.states[i.flow_entity_id]:void 0,o=i.speed_entity_id?this.hass.states[i.speed_entity_id]:void 0,a=i.mode_entity_id?this.hass.states[i.mode_entity_id]:void 0,l=ye(n),s=ye(o);return d`
      <ha-card>
        <div class="header">
          <div>
            <div class="title">${c("schedule_card.pump_title")}</div>
            <div class="subtitle">${i.name}</div>
          </div>
        </div>
        ${this._renderSceneBanner()}
        ${l?this._renderReading(i.flow_entity_id,et(n.state),n.attributes.unit_of_measurement):s?this._renderReading(i.speed_entity_id,`${et(o.state)}%`,c("schedule_card.speed_not_reliable")):d`<div class="reading-missing">${c("schedule_card.no_flow_data")}</div>`}
        ${a?d`
                <div class="current-mode">
                  ${c("schedule_card.currently_running")}
                  <strong>${this._currentModeText(e,a)}</strong>
                </div>
              `:h}
        <button class="edit-button" @click=${()=>this._openEdit()}>${c("schedule_card.edit_schedule")}</button>
      </ha-card>
    `}_pickAvailableLightMember(){let e=this._group,i=[],n;for(let o of e.members){let l=(o.channel_entity_ids?Object.values(o.channel_entity_ids):[]).find(p=>p!=null),s=l?this.hass.states[l]:void 0;ye(s)?n||(n=o):i.push(o.name)}return{member:n,unavailableNames:i}}_handleIntensityChange(e,i){this._pendingIntensityPercent=e,clearTimeout(this._intensityDebounceHandle),this._intensityDebounceHandle=setTimeout(()=>{this.hass.callService("vectra_studio","set_schedule_intensity",{device_id:i,intensity:e}).finally(()=>{this._pendingIntensityPercent=void 0})},1200)}_handleChartMouseMove(e){let i=e.currentTarget.getBoundingClientRect();this._chartHoverFraction=Math.max(0,Math.min(1,(e.clientX-i.left)/i.width))}_handleChartMouseLeave(){this._chartHoverFraction=void 0}_renderChartHoverOverlay(e){if(this._chartHoverFraction===void 0)return h;let i=$e(e),n=we()+this._chartHoverFraction*24*60*60*1e3,o=i.map(([l,s])=>{let u=this._channelHistoryByEntity[s];if(!u||u.length===0)return null;let p=u.reduce((_,m)=>Math.abs(m.t-n)<Math.abs(_.t-n)?m:_);return{channelName:l,value:Math.round(p.v)}}).filter(l=>l!==null);if(o.length===0)return h;let a=tt(new Date(n),this.hass?.locale);return d`
      <div class="chart-hover-line" style="left: ${this._chartHoverFraction*100}%"></div>
      <div class="chart-hover-time" style="left: ${this._chartHoverFraction*100}%">${a}</div>
      <div class="chart-tooltip" style="left: ${this._chartHoverFraction*100}%">
        ${o.map(l=>d`
            <div class="chart-tooltip-row">
              <span class="chart-tooltip-swatch" style="background: ${j(l.channelName)}"></span>
              <span class="chart-tooltip-name">${l.channelName}</span>
              <span class="chart-tooltip-value">${l.value}%</span>
            </div>
          `)}
      </div>
    `}_renderChartLegend(e){let i=$e(e).map(([n])=>n);return i.length===0?h:d`
      <div class="chart-legend">
        ${i.map(n=>d`
            <span class="chart-legend-item">
              <span class="chart-legend-swatch" style="background: ${j(n)}"></span>
              ${n}
            </span>
          `)}
      </div>
    `}_renderChannelChart(e){if(this._historyLoading)return d`<div class="chart-status">${c("schedule_card.loading_history")}</div>`;let i=this.hass?.locale?.language,n=`${e.device_id}|${i}`;if(n===this._lastChartKey&&this._channelHistoryByEntity===this._lastChartHistoryRef)return this._lastChartResult;let o=this._computeChannelChart(e);return this._lastChartKey=n,this._lastChartHistoryRef=this._channelHistoryByEntity,this._lastChartResult=o,o}_computeChannelChart(e){let i=$e(e);if(i.length===0)return d`<div class="chart-status">${c("schedule_card.no_channel_data")}</div>`;let n=we(),o=1440*60*1e3,a=m=>(m-n)/o*Z,l=m=>Q-Math.max(0,Math.min(100,m))/100*Q,s=Date.now(),u=i.map(([m,b])=>{let y=this._channelHistoryByEntity[b];if(!y||y.length===0)return h;let $=y[y.length-1],rt=(s>$.t?[...y,{t:s,v:$.v}]:y).map(Ee=>`${a(Ee.t).toFixed(1)},${l(Ee.v).toFixed(1)}`).join(" ");return K`<polyline points=${rt} fill="none" stroke=${j(m)} stroke-width="2" />`}).filter(m=>m!==h);if(u.length===0)return d`<div class="chart-status">${c("schedule_card.no_history_yet")}</div>`;let p=this.hass?.locale,_=Pt(n,s,6);return d`
      <svg class="chart" viewBox="0 0 ${Z} ${Q}" preserveAspectRatio="none">
        ${[0,50,100].map(m=>K`
            <line x1="0" x2=${Z} y1=${l(m)} y2=${l(m)} class="chart-gridline-h" />
          `)}
        ${_.map(m=>K`
            <line x1=${a(m)} x2=${a(m)} y1="0" y2=${Q} class="chart-gridline" />
          `)}
        ${u}
      </svg>
      <div class="chart-hour-labels">
        ${_.map(m=>d`<span class="chart-hour-label" style="left: ${a(m)/Z*100}%"
              >${tt(new Date(m),p)}</span
            >`)}
      </div>
    `}_lunarState(){let{member:e}=this._pickAvailableLightMember(),i=(this._group?.members??[]).map(l=>l.lunar_switch_entity_id).filter(l=>!!l),n=e?.lunar_switch_entity_id,o=e?.schedule_intensity_entity_id,a=o?this.hass.states[o]?.attributes.moon_phase_icon:void 0;return{entityIds:i,available:!!n,on:!!n&&this.hass.states[n]?.state==="on",phaseIcon:a}}async _setLunar(e,i){if(!(this._pendingLunarToggle||e.length===0)){this._pendingLunarToggle=!0,this._lunarToggleError=void 0;try{await this.hass.callService("switch",i?"turn_on":"turn_off",{entity_id:e})}catch(n){this._lunarToggleError=L(n)}finally{this._pendingLunarToggle=!1}}}_renderLightGlance(){let e=this._group,{member:i,unavailableNames:n}=this._pickAvailableLightMember(),o=i?.schedule_intensity_entity_id,a=o?this.hass.states[o]:void 0,l=a?Math.round(Number(a.state)):void 0,s=this._pendingIntensityPercent??l,u=this._lunarState();return d`
      <ha-card>
        <div class="header">
          <div>
            <div class="title">${c("schedule_card.light_title")}</div>
            <div class="subtitle">${e.members.map(p=>p.name).join(" + ")}</div>
          </div>
          ${u.on?d`<span
                  class="moon-indicator"
                  title=${u.phaseIcon?Et(u.phaseIcon,this.hass):c("schedule_card.lunar_phases_active")}
                >
                  <ha-icon icon=${u.phaseIcon??"mdi:moon-waning-crescent"}></ha-icon>
                </span>`:h}
        </div>
        ${this._renderSceneBanner()}
        ${n.length>0?d`
                <div class="unavailable-note">
                  ${$t(n)}
                  ${n.length===1?c("schedule_card.is_unavailable"):c("schedule_card.are_unavailable")}
                </div>
              `:h}
        ${i?d`
                <div class="chart-wrapper">
                  <div class="chart-y-axis">
                    <span>100%</span>
                    <span>50%</span>
                    <span>0%</span>
                  </div>
                  <div
                    class="chart-container"
                    @mousemove=${this._handleChartMouseMove}
                    @mouseleave=${this._handleChartMouseLeave}
                  >
                    ${this._renderChannelChart(i)} ${this._renderChartHoverOverlay(i)}
                  </div>
                </div>
                ${this._renderChartLegend(i)}
              `:d`<div class="reading-missing">${c("schedule_card.no_channel_data")}</div>`}
        ${s!=null?d`
                <div class="intensity-row">
                  <div class="intensity-label">
                    <span>${c("schedule_card.overall_intensity")}</span>
                    <span>${s}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    .value=${String(s)}
                    @input=${p=>this._handleIntensityChange(Number(p.target.value),this._config.device_id)}
                  />
                </div>
              `:h}
        <button class="edit-button" @click=${()=>this._openEdit()}>${c("schedule_card.edit_schedule")}</button>
      </ha-card>
    `}_renderLunarToggle(){let e=this._lunarState();if(!e.available)return h;let i=c(e.on?"schedule_card.lunar_disable":"schedule_card.lunar_enable");return d`<button
      class="header-icon-button moon-toggle ${e.on?"on":""}"
      ?disabled=${this._pendingLunarToggle}
      title=${i}
      aria-label=${i}
      @click=${()=>this._setLunar(e.entityIds,!e.on)}
    >
      <ha-icon
        icon=${this._pendingLunarToggle?"mdi:loading":e.on?e.phaseIcon??"mdi:moon-waning-crescent":"mdi:moon-new"}
        class=${this._pendingLunarToggle?"spin":""}
      ></ha-icon>
    </button>`}_renderEditShell(e){return d`
      <ha-card>
        <div class="edit-header">
          <button
            class="back-button"
            title=${c("schedule_card.back")}
            aria-label=${c("schedule_card.back")}
            @click=${()=>this._closeEdit()}
          >
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
          <div class="title">${c("schedule_card.edit_schedule")}</div>
          ${this._group?.kind==="light"?this._renderLunarToggle():h}
          <button
            class="header-icon-button"
            ?disabled=${this._importingMob||this._editingIndex!=null}
            title=${c("schedule_card.load_mob")}
            aria-label=${c("schedule_card.load_mob")}
            @click=${()=>this._triggerMobFilePicker()}
          >
            <ha-icon
              icon=${this._importingMob?"mdi:loading":"mdi:upload"}
              class=${this._importingMob?"spin":""}
            ></ha-icon>
          </button>
          <button
            class="header-icon-button"
            ?disabled=${this._exportingMob||this._editingIndex!=null}
            title=${c("schedule_card.download_mob")}
            aria-label=${c("schedule_card.download_mob")}
            @click=${()=>this._exportMob()}
          >
            <ha-icon
              icon=${this._exportingMob?"mdi:loading":"mdi:download"}
              class=${this._exportingMob?"spin":""}
            ></ha-icon>
          </button>
          <input
            type="file"
            class="mob-file-input"
            accept=".mob"
            style="display: none"
            @change=${i=>this._handleMobFileSelected(i)}
          />
        </div>
        ${this._mobError?d`<div class="save-schedule-error">${this._mobError}</div>`:h}
        ${this._lunarToggleError?d`<div class="save-schedule-error">${this._lunarToggleError}</div>`:h}
        ${e}
      </ha-card>
    `}_renderSaveScheduleControls(){return d`
      ${this._saveScheduleError?d`<div class="save-schedule-error">${this._saveScheduleError}</div>`:h}
      ${this._saveScheduleSucceeded?d`<div class="save-schedule-success">${c("schedule_card.schedule_saved")}</div>`:h}
      <button
        class="save-schedule-button"
        ?disabled=${this._savingSchedule||this._editingIndex!=null}
        @click=${()=>this._saveScheduleToDevice()}
      >
        ${this._savingSchedule?c("schedule_card.saving_schedule"):c("schedule_card.save_schedule")}
      </button>
      <div class="app-cache-note">
        <ha-icon icon="mdi:information-outline"></ha-icon>
        <span>${c("schedule_card.app_cache_note")}</span>
      </div>
      ${this._group?.mixed_channels?d`<div class="app-cache-note">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              <span>${c("schedule_card.mixed_channels_note")}</span>
            </div>`:h}
    `}_renderScheduleEditView(e,i){return this._scheduleError?this._renderEditShell(d`<div class="warning">${this._scheduleError}</div>`):this._scheduleLoading?this._renderEditShell(d`<div class="loading">${c("schedule_card.loading")}</div>`):this._renderEditShell(d`
      <div class="point-list">
        ${this._schedulePoints.map((n,o)=>this._editingIndex===o?e():this._renderPointRow(n,o))}
      </div>
      <button class="add-point-button" ?disabled=${this._editingIndex!=null} @click=${i}>
        ${c("schedule_card.add_point")}
      </button>
      ${this._renderSaveScheduleControls()}
    `)}_renderPumpEditView(){return this._renderScheduleEditView(()=>this._renderPumpPointEditForm(),()=>this._addPumpPoint())}_renderPointRow(e,i){let n=Ze(e.flags);return d`
      <button class="point-row" @click=${()=>this._startEditingPoint(i)}>
        <span class="point-time">${St(e.time_minutes)}</span>
        ${be(e)?d`<span class="point-mode">${e.mode}</span>`:d`${this._renderLightChannelBars(e)}
                <span class="point-period period-${n}">${Qe(n)}</span>`}
      </button>
    `}_renderLightChannelBars(e){return d`
      <span class="point-channel-bars">
        ${Object.entries(e.channels).map(([i,n])=>{let o=Math.max(0,Math.min(100,n));return d`
            <span
              class="point-channel-bar"
              title="${i}: ${Math.round(o)}%"
              style="height: ${Math.max(3,o/100*18)}px; background: ${j(i)}; opacity: ${.5+.5*(o/100)}"
            ></span>
          `})}
      </span>
    `}_renderTimeField(e){let i=Math.floor(e.time_minutes/60),n=e.time_minutes%60,o=kt(this.hass),a=o?i%12===0?12:i%12:i,l=i<12?"AM":"PM",s=u=>{let p=u.target.closest(".time-fields"),_=p.querySelector(".time-hour"),m=p.querySelector(".time-minute"),b=p.querySelector(".time-ampm"),y=Number(_.value),$=Number(m.value);o&&(y=y%12,b?.value==="PM"&&(y+=12)),this._updateWorkingPointTime(y*60+$)};return d`
      <label>
        ${c("schedule_card.time")}
        <span class="time-fields">
          <input
            class="time-hour"
            type="number"
            min=${o?1:0}
            max=${o?12:23}
            .value=${String(a)}
            @change=${s}
          />
          <span class="time-colon">:</span>
          <input
            class="time-minute"
            type="number"
            min="0"
            max="59"
            .value=${String(n).padStart(2,"0")}
            @change=${s}
          />
          ${o?d`<select class="time-ampm" .value=${l} @change=${s}>
                  <option value="AM" ?selected=${l==="AM"}>AM</option>
                  <option value="PM" ?selected=${l==="PM"}>PM</option>
                </select>`:h}
        </span>
      </label>
    `}_renderTimeOnlyField(e){return d` <div class="edit-row">${this._renderTimeField(e)}</div> `}_renderTimeAndPeriodFields(e){let i=Ze(e.flags);return d`
      <div class="edit-row">
        ${this._renderTimeField(e)}
        <label>
          ${c("schedule_card.period")}
          <select
            class="period-select"
            .value=${i}
            @change=${n=>this._updateWorkingPointPeriod(n.target.value)}
          >
            ${["day","night","sunrise","sunset"].map(n=>d`<option value=${n} ?selected=${n===i}>${Qe(n)}</option>`)}
          </select>
        </label>
      </div>
    `}_renderEditActions(){return d`
      <div class="edit-actions">
        <button class="cancel-button" @click=${()=>this._cancelEditingPoint()}>
          ${c("schedule_card.cancel")}
        </button>
        <button class="delete-point-button" @click=${()=>this._deleteEditingPoint()}>
          ${c("schedule_card.delete")}
        </button>
        <button class="save-point-button" @click=${()=>this._saveEditingPoint()}>
          ${c("schedule_card.save")}
        </button>
      </div>
    `}_addPumpPoint(){let e=this._group?.modes?.[0];if(!e)return;let i={time_minutes:0,flags:1,mode:e,params:{}};this._schedulePoints=[...this._schedulePoints,i],this._startEditingPoint(this._schedulePoints.length-1),this._isNewPoint=!0,this._updateWorkingPumpMode(xe(e,void 0))}_renderPumpPointEditForm(){let e=this._workingPoint,i=this._group?.modes??[],n=Tt(i),o=xe(e.mode,e.params.PhaseShift),a=(this._group?.mode_params?.[e.mode]??[]).filter(l=>l!=="PhaseShift");return d`
      <div class="point-edit-form">
        ${this._renderTimeOnlyField(e)}
        <label class="mode-label">
          ${c("schedule_card.mode")}
          <select
            .value=${o}
            @change=${l=>this._updateWorkingPumpMode(l.target.value)}
          >
            ${n.map(l=>d`<option value=${l} ?selected=${l===o}>${nt(l)}</option>`)}
          </select>
        </label>
        ${a.map(l=>this._renderPumpParamInput(l,e.params[l]))} ${this._renderEditActions()}
      </div>
    `}_paramRange(e){let i=this._workingPoint;return i?this._group?.param_ranges?.[i.mode]?.[e]:void 0}_defaultParamValue(e,i){let n=this._group?.param_ranges?.[e]?.[i];return n?i==="MaxSpeed"||i==="MinSpeed"?ee(500,n.min,n.max):n.min:0}_renderPumpParamInput(e,i){if(e==="RampType")return d`
        <label class="param-label">
          ${e}
          <select
            .value=${String(i)}
            @change=${a=>this._updateWorkingPumpParam(e,a.target.value)}
          >
            ${it.map(a=>d`<option value=${a} ?selected=${a===i}>${a}</option>`)}
          </select>
        </label>
      `;if(e==="ParentSerial")return d`
        <label class="param-label">
          ${c("schedule_card.parent_pump")}
          ${this._otherPumps.length===0?d`<div class="no-other-pumps">${c("schedule_card.no_other_pumps")}</div>`:d`
                  <select
                    .value=${String(i??"")}
                    @change=${a=>this._updateWorkingPumpParam(e,a.target.value)}
                  >
                    ${this._otherPumps.map(a=>d`<option value=${a.serial} ?selected=${a.serial===i}>${a.name}</option>`)}
                  </select>
                `}
        </label>
      `;if(e==="Variance"){let a=[[c("schedule_card.variance_none"),0],[c("schedule_card.variance_low"),200],[c("schedule_card.variance_medium"),550],[c("schedule_card.variance_high"),850]],l=(()=>{let s=Number(i??0);return s===0?a[0][0]:s<400?a[1][0]:s<700?a[2][0]:a[3][0]})();return d`
        <label class="param-label">
          ${e}
          <select
            .value=${l}
            @change=${s=>{let u=a.find(p=>p[0]===s.target.value);u&&this._updateWorkingPumpParam(e,u[1])}}
          >
            ${a.map(([s])=>d`<option value=${s} ?selected=${s===l}>${s}</option>`)}
          </select>
        </label>
      `}let n=e==="MaxSpeed"||e==="MinSpeed",o=this._paramRange(e);if(n){let a=this._group?.members?.[0]?.supports_reverse===!0,l=Number(i??0),s=Math.sign(l)*Math.round(Math.abs(l)/10),u=o?o.min/10:0,p=o?o.max/10:100;return d`
        <label class="param-label">
          ${e} (%)
          <input
            type="number"
            min=${a?-p:u}
            max=${p}
            step="1"
            .value=${String(s)}
            title=${a?c("schedule_card.reverse_hint"):h}
            @change=${_=>{let m=_.target,b=Number(m.value);!a&&b<0&&(b=Math.abs(b));let y=ee(Math.round(Math.abs(b)),u,p),$=(b<0?-1:1)*y;m.value=String($),this._updateWorkingPumpParam(e,$*10)}}
          />
          ${a?d`<span class="field-hint">${c("schedule_card.reverse_hint")}</span>`:h}
        </label>
      `}if(xt.has(e)){let a=Number(i??0)/1e3;return d`
        <label class="param-label">
          ${e} (${c("schedule_card.seconds_unit")})
          <input
            type="number"
            min=${o?o.min/1e3:0}
            max=${o?o.max/1e3:h}
            step=${o?o.step/1e3:"any"}
            .value=${String(a)}
            @change=${l=>{let s=l.target,u=Math.round(Number(s.value)*1e3);o&&(u=ee(Math.round(u/o.step)*o.step,o.min,o.max)),s.value=String(u/1e3),this._updateWorkingPumpParam(e,u)}}
          />
        </label>
      `}return d`
      <label class="param-label">
        ${e}
        <input
          type="number"
          min=${o?o.min:h}
          max=${o?o.max:h}
          step=${o?o.step:h}
          .value=${String(i??0)}
          @change=${a=>{let l=a.target,s=Number(l.value);o&&(s=ee(s,o.min,o.max)),l.value=String(s),this._updateWorkingPumpParam(e,s)}}
        />
      </label>
    `}_renderLightEditView(){return this._renderScheduleEditView(()=>this._renderLightPointEditForm(),()=>this._addLightPoint())}_addLightPoint(){let e=this._group?.channels??[];if(e.length===0)return;let i={time_minutes:0,flags:1,channels:Object.fromEntries(e.map(n=>[n,0]))};this._schedulePoints=[...this._schedulePoints,i],this._startEditingPoint(this._schedulePoints.length-1),this._isNewPoint=!0}_updateWorkingLightChannel(e,i){let n=this._workingPoint;n&&(this._workingPoint={...n,channels:{...n.channels,[e]:i}})}_renderLightPointEditForm(){let e=this._workingPoint,i=this._group?.channels??[];return d`
      <div class="point-edit-form">
        ${this._renderTimeAndPeriodFields(e)}
        ${i.map(n=>{let o=e.channels[n]??0;return d`
            <label class="channel-slider-label">
              <span class="channel-slider-name" style="color: ${j(n)}">${n}</span>
              <span class="channel-slider-value">${o}%</span>
              <input
                type="range"
                min="0"
                max="100"
                .value=${String(o)}
                @input=${a=>this._updateWorkingLightChannel(n,Number(a.target.value))}
              />
            </label>
          `})}
        ${this._renderEditActions()}
      </div>
    `}render(){return this._config?this._error?d`
        <ha-card>
          <div class="warning">${this._error}</div>
        </ha-card>
      `:this._loading||!this._group?d`
        <ha-card>
          <div class="loading">${c("schedule_card.loading")}</div>
        </ha-card>
      `:this._view==="edit"?this._group.kind==="pump"?this._renderPumpEditView():this._renderLightEditView():this._group.kind==="pump"?this._renderPumpGlance():this._renderLightGlance():h}};g.HISTORY_REFRESH_INTERVAL_MS=300*1e3,g.styles=ie`
    ha-card {
      padding: 16px;
    }
    .header {
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
    }
    .moon-indicator {
      display: flex;
      flex-shrink: 0;
      padding: 4px;
      color: var(--primary-color);
    }
    .moon-indicator ha-icon {
      --mdc-icon-size: 22px;
    }
    .moon-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: none;
      background: none;
      cursor: pointer;
      padding: 4px;
      color: var(--secondary-text-color);
      border-radius: 50%;
    }
    .moon-toggle:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    .moon-toggle:disabled {
      cursor: default;
      opacity: 0.6;
    }
    .moon-toggle.on {
      color: var(--primary-color);
    }
    .moon-toggle ha-icon {
      --mdc-icon-size: 22px;
    }
    .moon-toggle ha-icon.spin {
      animation: mobius-spin 1s linear infinite;
    }
    .activation-error {
      margin: 4px 0 10px;
      padding: 8px 10px;
      border-radius: 8px;
      background: rgba(219, 68, 55, 0.1);
      color: var(--error-color, #db4437);
      font-size: 0.85em;
    }
    .title {
      font-size: 1.2em;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .subtitle {
      font-size: 0.9em;
      color: var(--secondary-text-color);
      margin-bottom: 8px;
    }
    .warning {
      padding: 12px 0;
      color: var(--error-color, #db4437);
    }
    .loading {
      padding: 12px 0;
      color: var(--secondary-text-color);
    }
    .scene-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 8px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      font-size: 0.85em;
      color: var(--primary-text-color);
      margin-bottom: 12px;
    }
    .scene-banner ha-icon {
      color: var(--primary-color);
      --mdc-icon-size: 18px;
      flex-shrink: 0;
    }
    .reading {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin: 4px 0 6px 0;
    }
    .reading-clickable {
      cursor: pointer;
      border-radius: 8px;
      padding: 2px 6px;
      margin-left: -6px;
    }
    .reading-clickable:hover,
    .reading-clickable:focus-visible {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      outline: none;
    }
    .reading-value {
      font-size: 2.2em;
      font-weight: 300;
      color: var(--primary-text-color);
    }
    .reading-unit {
      font-size: 0.85em;
      color: var(--secondary-text-color);
    }
    .reading-missing {
      padding: 12px 0;
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }
    .current-mode {
      font-size: 0.85em;
      color: var(--secondary-text-color);
      margin-bottom: 14px;
    }
    .edit-button {
      width: 100%;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 10px 0;
      color: var(--primary-text-color);
      font-family: inherit;
      font-size: 0.9em;
      font-weight: 500;
      cursor: pointer;
    }
    .edit-button:hover {
      border-color: var(--primary-color);
    }
    .edit-header {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 14px;
    }
    .edit-header .title {
      flex: 1;
      margin: 0 8px;
    }
    .header-icon-button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: var(--primary-text-color);
      cursor: pointer;
      padding: 6px;
      border-radius: 50%;
    }
    .header-icon-button:last-of-type {
      margin-right: -6px;
    }
    .header-icon-button:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
    }
    .header-icon-button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .header-icon-button ha-icon {
      --mdc-icon-size: 20px;
    }
    .header-icon-button ha-icon.spin {
      animation: mobius-spin 1s linear infinite;
    }
    @keyframes mobius-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .back-button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      color: var(--primary-color);
      cursor: pointer;
      padding: 6px;
      margin: -6px;
      border-radius: 50%;
    }
    .back-button:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
    }
    .back-button ha-icon {
      --mdc-icon-size: 22px;
    }
    .point-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .point-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border-radius: 8px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
      font-size: 0.9em;
      width: 100%;
      border: none;
      color: inherit;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
    }
    .point-row:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
    }
    .point-edit-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid var(--primary-color);
      background: var(--card-background-color);
    }
    .edit-row {
      display: flex;
      gap: 10px;
    }
    .edit-row label,
    .mode-label,
    .param-label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.8em;
      color: var(--secondary-text-color);
      flex: 1;
    }
    .field-hint {
      font-size: 0.85em;
      font-style: italic;
      color: var(--secondary-text-color);
    }
    .no-other-pumps {
      font-size: 0.95em;
      color: var(--error-color, #db4437);
      padding: 4px 0;
    }
    .edit-row input,
    .edit-row select,
    .mode-label select,
    .param-label input,
    .param-label select {
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-family: inherit;
      font-size: 1em;
    }
    .time-fields {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .time-fields .time-hour,
    .time-fields .time-minute {
      width: 3em;
      text-align: center;
    }
    .time-colon {
      color: var(--secondary-text-color);
    }
    .edit-actions {
      display: flex;
      gap: 8px;
      margin-top: 4px;
    }
    .cancel-button,
    .delete-point-button,
    .save-point-button {
      flex: 1;
      padding: 8px 0;
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.9em;
      font-weight: 500;
      cursor: pointer;
    }
    .cancel-button {
      background: none;
      border: 1px solid var(--divider-color);
      color: var(--primary-text-color);
    }
    .delete-point-button {
      background: none;
      border: 1px solid var(--error-color, #db4437);
      color: var(--error-color, #db4437);
    }
    .save-point-button {
      background: var(--primary-color);
      border: none;
      color: var(--text-primary-color, #fff);
    }
    .add-point-button {
      width: 100%;
      margin-top: 10px;
      padding: 10px 0;
      border-radius: 10px;
      border: 1px dashed var(--divider-color);
      background: none;
      color: var(--primary-color);
      font-family: inherit;
      font-size: 0.9em;
      font-weight: 500;
      cursor: pointer;
    }
    .add-point-button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .app-cache-note {
      display: flex;
      gap: 6px;
      align-items: flex-start;
      margin: 8px 16px 4px;
      color: var(--secondary-text-color);
      font-size: 0.8em;
      line-height: 1.35;
    }
    .app-cache-note ha-icon {
      --mdc-icon-size: 16px;
      flex-shrink: 0;
    }
    .save-schedule-button {
      width: 100%;
      margin-top: 14px;
      padding: 12px 0;
      border-radius: 10px;
      border: none;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-family: inherit;
      font-size: 0.95em;
      font-weight: 500;
      cursor: pointer;
    }
    .save-schedule-button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .save-schedule-error {
      margin-top: 12px;
      padding: 10px;
      border-radius: 8px;
      background: rgba(219, 68, 55, 0.1);
      color: var(--error-color, #db4437);
      font-size: 0.9em;
    }
    .save-schedule-success {
      margin-top: 12px;
      padding: 10px;
      border-radius: 8px;
      background: rgba(67, 160, 71, 0.1);
      color: #43a047;
      font-size: 0.9em;
    }
    .point-time {
      font-variant-numeric: tabular-nums;
      color: var(--primary-text-color);
      font-weight: 500;
      min-width: 44px;
    }
    .channel-slider-label {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 4px 8px;
      font-size: 0.85em;
    }
    .channel-slider-name {
      font-weight: 500;
    }
    .channel-slider-value {
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
      text-align: right;
    }
    .channel-slider-label input[type="range"] {
      grid-column: 1 / -1;
      width: 100%;
      accent-color: var(--primary-color);
    }
    .point-period {
      font-size: 0.8em;
      padding: 2px 8px;
      border-radius: 10px;
      background: var(--divider-color);
      color: var(--secondary-text-color);
    }
    .point-period.period-night {
      background: #37474f;
      color: #e0e0e0;
    }
    .point-period.period-sunrise {
      background: #ffcc80;
      color: #5d4037;
    }
    .point-period.period-sunset {
      background: #ff8a65;
      color: #4e342e;
    }
    .point-mode {
      color: var(--secondary-text-color);
      margin-left: auto;
    }
    .point-channel-bars {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      height: 18px;
      flex: 1;
      margin-left: 8px;
    }
    .point-channel-bar {
      width: 7px;
      border-radius: 2px;
    }
    .unavailable-note {
      font-size: 0.8em;
      color: var(--secondary-text-color);
      margin-bottom: 8px;
    }
    .intensity-row {
      margin-bottom: 14px;
    }
    .intensity-label {
      display: flex;
      justify-content: space-between;
      font-size: 0.85em;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
    }
    .intensity-row input[type="range"] {
      width: 100%;
      accent-color: var(--primary-color);
    }
    .chart {
      width: 100%;
      height: auto;
      margin-bottom: 12px;
    }
    .chart-wrapper {
      display: flex;
      gap: 6px;
    }
    .chart-y-axis {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0 0 18px 0;
      font-size: 11px;
      color: var(--secondary-text-color);
      text-align: right;
      min-width: 30px;
    }
    .chart-container {
      position: relative;
      flex: 1;
      min-width: 0;
    }
    .chart-hover-line {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      background: var(--primary-text-color);
      opacity: 0.3;
      pointer-events: none;
      transform: translateX(-50%);
    }
    .chart-hover-time {
      position: absolute;
      bottom: -18px;
      transform: translateX(-50%);
      font-size: 11px;
      font-weight: 500;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      padding: 1px 5px;
      border-radius: 4px;
      border: 1px solid var(--divider-color);
      pointer-events: none;
      white-space: nowrap;
      z-index: 1;
    }
    .chart-tooltip {
      position: absolute;
      bottom: 100%;
      margin-bottom: 6px;
      transform: translateX(-50%);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 6px 8px;
      font-size: 0.78em;
      pointer-events: none;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      white-space: nowrap;
      z-index: 2;
    }
    .chart-tooltip-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .chart-tooltip-swatch {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .chart-tooltip-name {
      flex: 1;
    }
    .chart-tooltip-value {
      font-variant-numeric: tabular-nums;
      font-weight: 500;
    }
    .chart-legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin: 10px 0 12px;
      font-size: 0.78em;
      color: var(--secondary-text-color);
    }
    .chart-legend-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .chart-legend-swatch {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }
    .chart-gridline {
      stroke: var(--divider-color);
      stroke-width: 1;
    }
    .chart-gridline-h {
      stroke: var(--divider-color);
      stroke-width: 1;
      opacity: 0.5;
    }
    .chart-hour-labels {
      position: relative;
      height: 16px;
      margin-top: 2px;
    }
    .chart-hour-label {
      position: absolute;
      transform: translateX(-50%);
      font-size: 11px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .chart-status {
      padding: 24px 0;
      text-align: center;
      color: var(--secondary-text-color);
      font-size: 0.85em;
    }
  `,f([Y({attribute:!1})],g.prototype,"hass",2),f([v()],g.prototype,"_config",2),f([v()],g.prototype,"_group",2),f([v()],g.prototype,"_error",2),f([v()],g.prototype,"_loading",2),f([v()],g.prototype,"_pendingIntensityPercent",2),f([v()],g.prototype,"_pendingLunarToggle",2),f([v()],g.prototype,"_lunarToggleError",2),f([v()],g.prototype,"_channelHistoryByEntity",2),f([v()],g.prototype,"_historyLoading",2),f([v()],g.prototype,"_chartHoverFraction",2),f([v()],g.prototype,"_view",2),f([v()],g.prototype,"_scheduleLoading",2),f([v()],g.prototype,"_scheduleError",2),f([v()],g.prototype,"_schedulePoints",2),f([v()],g.prototype,"_savingSchedule",2),f([v()],g.prototype,"_saveScheduleError",2),f([v()],g.prototype,"_saveScheduleSucceeded",2),f([v()],g.prototype,"_exportingMob",2),f([v()],g.prototype,"_importingMob",2),f([v()],g.prototype,"_mobError",2),f([v()],g.prototype,"_editingIndex",2),f([v()],g.prototype,"_workingPoint",2),f([v()],g.prototype,"_isNewPoint",2),f([v()],g.prototype,"_otherPumps",2),g=f([qe("vectra-studio-schedule-card")],g);window.customCards=window.customCards||[];window.customCards.push({type:"vectra-studio-schedule-card",name:"Mobius Schedule",description:"View and edit a Mobius light or pump schedule.",preview:!1});export{g as MobiusScheduleCard};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
