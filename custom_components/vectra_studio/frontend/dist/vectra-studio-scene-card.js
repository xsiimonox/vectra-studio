var ue=Object.defineProperty;var je=Object.getOwnPropertyDescriptor;var ze=(o,e)=>{for(var t in e)ue(o,t,{get:e[t],enumerable:!0})};var S=(o,e,t,i)=>{for(var n=i>1?void 0:i?je(e,t):e,r=o.length-1,s;r>=0;r--)(s=o[r])&&(n=(i?s(e,t,n):s(n))||n);return i&&n&&ue(e,t,n),n};var j=window,z=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,G=Symbol(),pe=new WeakMap,P=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==G)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(z&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=pe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&pe.set(t,e))}return e}toString(){return this.cssText}},ve=o=>new P(typeof o=="string"?o:o+"",void 0,G),J=(o,...e)=>{let t=o.length===1?o[0]:e.reduce(((i,n,r)=>i+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+o[r+1]),o[0]);return new P(t,o,G)},Z=(o,e)=>{z?o.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((t=>{let i=document.createElement("style"),n=j.litNonce;n!==void 0&&i.setAttribute("nonce",n),i.textContent=t.cssText,o.appendChild(i)}))},D=z?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return ve(t)})(o):o;var Q,q=window,me=q.trustedTypes,De=me?me.emptyScript:"",_e=q.reactiveElementPolyfillSupport,Y={toAttribute(o,e){switch(e){case Boolean:o=o?De:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},fe=(o,e)=>e!==o&&(e==e||o==o),X={attribute:!0,type:String,converter:Y,reflect:!1,hasChanged:fe},ee="finalized",m=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(e){var t;this.finalize(),((t=this.h)!==null&&t!==void 0?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();let e=[];return this.elementProperties.forEach(((t,i)=>{let n=this._$Ep(i,t);n!==void 0&&(this._$Ev.set(n,i),e.push(n))})),e}static createProperty(e,t=X){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){let i=typeof e=="symbol"?Symbol():"__"+e,n=this.getPropertyDescriptor(e,i,t);n!==void 0&&Object.defineProperty(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){return{get(){return this[t]},set(n){let r=this[e];this[t]=n,this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||X}static finalize(){if(this.hasOwnProperty(ee))return!1;this[ee]=!0;let e=Object.getPrototypeOf(this);if(e.finalize(),e.h!==void 0&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(let n of i)this.createProperty(n,t[n])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let n of i)t.unshift(D(n))}else e!==void 0&&t.push(D(e));return t}static _$Ep(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}_$Eu(){var e;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(e=this.constructor.h)===null||e===void 0||e.forEach((t=>t(this)))}addController(e){var t,i;((t=this._$ES)!==null&&t!==void 0?t:this._$ES=[]).push(e),this.renderRoot!==void 0&&this.isConnected&&((i=e.hostConnected)===null||i===void 0||i.call(e))}removeController(e){var t;(t=this._$ES)===null||t===void 0||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])}))}createRenderRoot(){var e;let t=(e=this.shadowRoot)!==null&&e!==void 0?e:this.attachShadow(this.constructor.shadowRootOptions);return Z(t,this.constructor.elementStyles),t}connectedCallback(){var e;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$ES)===null||e===void 0||e.forEach((t=>{var i;return(i=t.hostConnected)===null||i===void 0?void 0:i.call(t)}))}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$ES)===null||e===void 0||e.forEach((t=>{var i;return(i=t.hostDisconnected)===null||i===void 0?void 0:i.call(t)}))}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$EO(e,t,i=X){var n;let r=this.constructor._$Ep(e,i);if(r!==void 0&&i.reflect===!0){let s=(((n=i.converter)===null||n===void 0?void 0:n.toAttribute)!==void 0?i.converter:Y).toAttribute(t,i.type);this._$El=e,s==null?this.removeAttribute(r):this.setAttribute(r,s),this._$El=null}}_$AK(e,t){var i;let n=this.constructor,r=n._$Ev.get(e);if(r!==void 0&&this._$El!==r){let s=n.getPropertyOptions(r),c=typeof s.converter=="function"?{fromAttribute:s.converter}:((i=s.converter)===null||i===void 0?void 0:i.fromAttribute)!==void 0?s.converter:Y;this._$El=r,this[r]=c.fromAttribute(t,s.type),this._$El=null}}requestUpdate(e,t,i){let n=!0;e!==void 0&&(((i=i||this.constructor.getPropertyOptions(e)).hasChanged||fe)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),i.reflect===!0&&this._$El!==e&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(e,i))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((n,r)=>this[r]=n)),this._$Ei=void 0);let t=!1,i=this._$AL;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),(e=this._$ES)===null||e===void 0||e.forEach((n=>{var r;return(r=n.hostUpdate)===null||r===void 0?void 0:r.call(n)})),this.update(i)):this._$Ek()}catch(n){throw t=!1,this._$Ek(),n}t&&this._$AE(i)}willUpdate(e){}_$AE(e){var t;(t=this._$ES)===null||t===void 0||t.forEach((i=>{var n;return(n=i.hostUpdated)===null||n===void 0?void 0:n.call(i)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){this._$EC!==void 0&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}};m[ee]=!0,m.elementProperties=new Map,m.elementStyles=[],m.shadowRootOptions={mode:"open"},_e?.({ReactiveElement:m}),((Q=q.reactiveElementVersions)!==null&&Q!==void 0?Q:q.reactiveElementVersions=[]).push("1.6.3");var te,I=window,E=I.trustedTypes,ge=E?E.createPolicy("lit-html",{createHTML:o=>o}):void 0,ne="$lit$",y=`lit$${(Math.random()+"").slice(9)}$`,Se="?"+y,qe=`<${Se}>`,x=document,O=()=>x.createComment(""),T=o=>o===null||typeof o!="object"&&typeof o!="function",Ee=Array.isArray,Ie=o=>Ee(o)||typeof o?.[Symbol.iterator]=="function",ie=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ye=/-->/g,$e=/>/g,b=RegExp(`>|${ie}(?:([^\\s"'>=/]+)(${ie}*=${ie}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),be=/'/g,Ae=/"/g,Ce=/^(?:script|style|textarea|title)$/i,ke=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),_=ke(1),st=ke(2),w=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),xe=new WeakMap,A=x.createTreeWalker(x,129,null,!1);function Pe(o,e){if(!Array.isArray(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return ge!==void 0?ge.createHTML(e):e}var Ke=(o,e)=>{let t=o.length-1,i=[],n,r=e===2?"<svg>":"",s=N;for(let c=0;c<t;c++){let a=o[c],l,h,u=-1,p=0;for(;p<a.length&&(s.lastIndex=p,h=s.exec(a),h!==null);)p=s.lastIndex,s===N?h[1]==="!--"?s=ye:h[1]!==void 0?s=$e:h[2]!==void 0?(Ce.test(h[2])&&(n=RegExp("</"+h[2],"g")),s=b):h[3]!==void 0&&(s=b):s===b?h[0]===">"?(s=n??N,u=-1):h[1]===void 0?u=-2:(u=s.lastIndex-h[2].length,l=h[1],s=h[3]===void 0?b:h[3]==='"'?Ae:be):s===Ae||s===be?s=b:s===ye||s===$e?s=N:(s=b,n=void 0);let v=s===b&&o[c+1].startsWith("/>")?" ":"";r+=s===N?a+qe:u>=0?(i.push(l),a.slice(0,u)+ne+a.slice(u)+y+v):a+y+(u===-2?(i.push(void 0),c):v)}return[Pe(o,r+(o[t]||"<?>")+(e===2?"</svg>":"")),i]},R=class o{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let r=0,s=0,c=e.length-1,a=this.parts,[l,h]=Ke(e,t);if(this.el=o.createElement(l,i),A.currentNode=this.el.content,t===2){let u=this.el.content,p=u.firstChild;p.remove(),u.append(...p.childNodes)}for(;(n=A.nextNode())!==null&&a.length<c;){if(n.nodeType===1){if(n.hasAttributes()){let u=[];for(let p of n.getAttributeNames())if(p.endsWith(ne)||p.startsWith(y)){let v=h[s++];if(u.push(p),v!==void 0){let Me=n.getAttribute(v.toLowerCase()+ne).split(y),M=/([.?@])?(.*)/.exec(v);a.push({type:1,index:r,name:M[2],strings:Me,ctor:M[1]==="."?se:M[1]==="?"?re:M[1]==="@"?ae:k})}else a.push({type:6,index:r})}for(let p of u)n.removeAttribute(p)}if(Ce.test(n.tagName)){let u=n.textContent.split(y),p=u.length-1;if(p>0){n.textContent=E?E.emptyScript:"";for(let v=0;v<p;v++)n.append(u[v],O()),A.nextNode(),a.push({type:2,index:++r});n.append(u[p],O())}}}else if(n.nodeType===8)if(n.data===Se)a.push({type:2,index:r});else{let u=-1;for(;(u=n.data.indexOf(y,u+1))!==-1;)a.push({type:7,index:r}),u+=y.length-1}r++}}static createElement(e,t){let i=x.createElement("template");return i.innerHTML=e,i}};function C(o,e,t=o,i){var n,r,s,c;if(e===w)return e;let a=i!==void 0?(n=t._$Co)===null||n===void 0?void 0:n[i]:t._$Cl,l=T(e)?void 0:e._$litDirective$;return a?.constructor!==l&&((r=a?._$AO)===null||r===void 0||r.call(a,!1),l===void 0?a=void 0:(a=new l(o),a._$AT(o,t,i)),i!==void 0?((s=(c=t)._$Co)!==null&&s!==void 0?s:c._$Co=[])[i]=a:t._$Cl=a),a!==void 0&&(e=C(o,a._$AS(o,e.values),a,i)),e}var oe=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var t;let{el:{content:i},parts:n}=this._$AD,r=((t=e?.creationScope)!==null&&t!==void 0?t:x).importNode(i,!0);A.currentNode=r;let s=A.nextNode(),c=0,a=0,l=n[0];for(;l!==void 0;){if(c===l.index){let h;l.type===2?h=new U(s,s.nextSibling,this,e):l.type===1?h=new l.ctor(s,l.name,l.strings,this,e):l.type===6&&(h=new le(s,this,e)),this._$AV.push(h),l=n[++a]}c!==l?.index&&(s=A.nextNode(),c++)}return A.currentNode=x,r}v(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},U=class o{constructor(e,t,i,n){var r;this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cp=(r=n?.isConnected)===null||r===void 0||r}get _$AU(){var e,t;return(t=(e=this._$AM)===null||e===void 0?void 0:e._$AU)!==null&&t!==void 0?t:this._$Cp}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=C(this,e,t),T(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==w&&this._(e):e._$litType$!==void 0?this.g(e):e.nodeType!==void 0?this.$(e):Ie(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==d&&T(this._$AH)?this._$AA.nextSibling.data=e:this.$(x.createTextNode(e)),this._$AH=e}g(e){var t;let{values:i,_$litType$:n}=e,r=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=R.createElement(Pe(n.h,n.h[0]),this.options)),n);if(((t=this._$AH)===null||t===void 0?void 0:t._$AD)===r)this._$AH.v(i);else{let s=new oe(r,this),c=s.u(this.options);s.v(i),this.$(c),this._$AH=s}}_$AC(e){let t=xe.get(e.strings);return t===void 0&&xe.set(e.strings,t=new R(e)),t}T(e){Ee(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,n=0;for(let r of e)n===t.length?t.push(i=new o(this.k(O()),this.k(O()),this,this.options)):i=t[n],i._$AI(r),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){var i;for((i=this._$AP)===null||i===void 0||i.call(this,!1,!0,t);e&&e!==this._$AB;){let n=e.nextSibling;e.remove(),e=n}}setConnected(e){var t;this._$AM===void 0&&(this._$Cp=e,(t=this._$AP)===null||t===void 0||t.call(this,e))}},k=class{constructor(e,t,i,n,r){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=d}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,i,n){let r=this.strings,s=!1;if(r===void 0)e=C(this,e,t,0),s=!T(e)||e!==this._$AH&&e!==w,s&&(this._$AH=e);else{let c=e,a,l;for(e=r[0],a=0;a<r.length-1;a++)l=C(this,c[i+a],t,a),l===w&&(l=this._$AH[a]),s||(s=!T(l)||l!==this._$AH[a]),l===d?e=d:e!==d&&(e+=(l??"")+r[a+1]),this._$AH[a]=l}s&&!n&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},se=class extends k{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}},Be=E?E.emptyScript:"",re=class extends k{constructor(){super(...arguments),this.type=4}j(e){e&&e!==d?this.element.setAttribute(this.name,Be):this.element.removeAttribute(this.name)}},ae=class extends k{constructor(e,t,i,n,r){super(e,t,i,n,r),this.type=5}_$AI(e,t=this){var i;if((e=(i=C(this,e,t,0))!==null&&i!==void 0?i:d)===w)return;let n=this._$AH,r=e===d&&n!==d||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,s=e!==d&&(n===d||r);r&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,i;typeof this._$AH=="function"?this._$AH.call((i=(t=this.options)===null||t===void 0?void 0:t.host)!==null&&i!==void 0?i:this.element,e):this._$AH.handleEvent(e)}},le=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){C(this,e)}};var we=I.litHtmlPolyfillSupport;we?.(R,U),((te=I.litHtmlVersions)!==null&&te!==void 0?te:I.litHtmlVersions=[]).push("2.8.0");var Ne=(o,e,t)=>{var i,n;let r=(i=t?.renderBefore)!==null&&i!==void 0?i:e,s=r._$litPart$;if(s===void 0){let c=(n=t?.renderBefore)!==null&&n!==void 0?n:null;r._$litPart$=s=new U(e.insertBefore(O(),c),c,void 0,t??{})}return s._$AI(o),s};var ce,de;var $=class extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;let i=super.createRenderRoot();return(e=(t=this.renderOptions).renderBefore)!==null&&e!==void 0||(t.renderBefore=i.firstChild),i}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ne(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!1)}render(){return w}};$.finalized=!0,$._$litElement$=!0,(ce=globalThis.litElementHydrateSupport)===null||ce===void 0||ce.call(globalThis,{LitElement:$});var Oe=globalThis.litElementPolyfillSupport;Oe?.({LitElement:$});((de=globalThis.litElementVersions)!==null&&de!==void 0?de:globalThis.litElementVersions=[]).push("3.3.3");var Te=o=>e=>typeof e=="function"?((t,i)=>(customElements.define(t,i),i))(o,e):((t,i)=>{let{kind:n,elements:r}=i;return{kind:n,elements:r,finisher(s){customElements.define(t,s)}}})(o,e);var Ve=(o,e)=>e.kind==="method"&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(t){t.createProperty(e.key,o)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){typeof e.initializer=="function"&&(this[e.key]=e.initializer.call(this))},finisher(t){t.createProperty(e.key,o)}},We=(o,e,t)=>{e.constructor.createProperty(t,o)};function K(o){return(e,t)=>t!==void 0?We(o,e,t):Ve(o,e)}function B(o){return K({...o,state:!0})}var he,Tt=((he=window.HTMLSlotElement)===null||he===void 0?void 0:he.prototype.assignedElements)!=null?(o,e)=>o.assignedElements(e):(o,e)=>o.assignedNodes(e).filter((t=>t.nodeType===Node.ELEMENT_NODE));var L={};ze(L,{default:()=>Ze,editor:()=>Fe,scene_card:()=>Ge,schedule_card:()=>Je});var Fe={entity:"Scene selection entity",entity_helper:"The select.*_scene_selection entity for the tank this card should control.",device_id:"Light or pump device",device_id_helper:"Any one light or pump in the schedule group this card should show -- never the Tank device itself."},Ge={title:"Scene",running_normal_schedule:"Running the normal schedule.",active_suffix:"active",remaining_suffix:"remaining",normal_schedule_tile:"Normal schedule",entity_not_found:"Entity not found:"},Je={loading:"Loading\u2026",device_not_found:"This device could not be found.",no_tank_found:"This device isn't linked to a Mobius tank.",group_not_found:"Couldn't find this device's own schedule group.",light_title:"Light Schedule",pump_title:"Pump Schedule",lunar_phases_active:"Lunar phases active",lunar_enable:"Enable moon cycle tracking",lunar_disable:"Disable moon cycle tracking",moon_phase_new:"New Moon",moon_phase_waxing_crescent:"Waxing Crescent",moon_phase_waxing_gibbous:"Waxing Gibbous",moon_phase_full:"Full Moon",moon_phase_waning_gibbous:"Waning Gibbous",moon_phase_waning_crescent:"Waning Crescent",scene_running_instead:"is running instead of the schedule",remaining_suffix:"remaining",speed_not_reliable:"speed (flow reading not reliable on this device)",no_flow_data:"No flow or speed data available.",currently_running:"Currently running",edit_schedule:"Edit schedule",is_unavailable:"is unavailable.",are_unavailable:"are unavailable.",no_channel_data:"No channel data available -- every light in this group is currently unavailable.",overall_intensity:"Overall intensity",loading_history:"Loading history\u2026",no_history_yet:"No history recorded yet today.",back:"Back",period_day:"Day",period_night:"Night",period_sunrise:"Sunrise",period_sunset:"Sunset",time:"Time",period:"Period",mode:"Mode",cancel:"Cancel",save:"Save",parent_pump:"Parent pump",no_other_pumps:"No other pumps found on this tank.",anti_sync:"Anti-Sync",ecosmart_back:"EcoSmart Back",reverse_hint:"A negative value reverses rotation direction, on pumps that support it.",schedule_saved:"Schedule saved.",saving_schedule:"Saving\u2026",save_schedule:"Save schedule to device",app_cache_note:"The Mobius app keeps its own copy of the schedule and won't show changes made here. To bring it up to date, download the .mob file after saving and import it in the app.",mixed_channels_note:"These lights don't all have the same channels; each is sent only the channels it has.",add_point:"Add point",delete:"Delete",variance_none:"None",variance_low:"Low",variance_medium:"Medium",variance_high:"High",download_mob:"Download .mob",exporting_mob:"Exporting\u2026",load_mob:"Load .mob",importing_mob:"Loading\u2026",mob_wrong_extension:"Please choose a .mob file.",mob_invalid_json:"This file doesn't look like a valid .mob file.",seconds_unit:"s"},Ze={editor:Fe,scene_card:Ge,schedule_card:Je};var Qe={en:L};function Re(o,e){let t=e.split(".").reduce((i,n)=>i&&typeof i=="object"?i[n]:void 0,o);return typeof t=="string"?t:void 0}function f(o,e){let t=(e||(typeof navigator<"u"?navigator.language:"en")).split("-")[0].toLowerCase(),i=Qe[t]??L;return Re(i,o)??Re(L,o)??o}function Ue(o){let e=Math.floor(o/60),t=o%60;return`${e}:${String(t).padStart(2,"0")}`}function He(o,e=Date.now()){let t=typeof o.ends_at=="string"?Date.parse(o.ends_at):NaN;if(!Number.isNaN(t))return Math.max(0,Math.round((t-e)/1e3));let i=o.duration_remaining_seconds;return typeof i=="number"?i:void 0}var W=class{constructor(e){this._host=e}sync(e){e&&this._handle===void 0?this._handle=setInterval(()=>this._host.requestUpdate(),1e3):e||this.stop()}stop(){this._handle!==void 0&&(clearInterval(this._handle),this._handle=void 0)}};var F="None",Xe={sunrise:"mdi:weather-sunset-up",sunset:"mdi:weather-sunset-down",feed:"mdi:food-drumstick",feeding:"mdi:food-drumstick",storm:"mdi:weather-lightning-rainy",moon:"mdi:weather-night",moonlit:"mdi:weather-night",clean:"mdi:broom","water change":"mdi:water-sync",cloud:"mdi:weather-cloudy","color cycle":"mdi:palette",disco:"mdi:party-popper"},Ye="mdi:bookmark-outline";function Le(o){let e=o.toLowerCase();for(let[t,i]of Object.entries(Xe))if(e.includes(t))return i;return Ye}var g=class extends ${constructor(){super(...arguments);this._countdown=new W(this)}disconnectedCallback(){super.disconnectedCallback(),this._countdown.stop()}setConfig(t){if(!t||!t.entity)throw new Error('vectra-studio-scene-card: "entity" is required (a select.*_scene_selection entity)');this._config=t}getCardSize(){return 3}getGridOptions(){return{rows:3,columns:6,min_rows:3}}static getStubConfig(t,i){return{entity:(i||[]).find(r=>r.startsWith("select.")&&r.includes("scene"))||""}}static getConfigForm(){return{schema:[{name:"entity",required:!0,selector:{entity:{domain:"select"}}}],computeLabel:t=>t.name==="entity"?f("editor.entity"):void 0,computeHelper:t=>t.name==="entity"?f("editor.entity_helper"):void 0}}get _stateObj(){return this.hass&&this._config?this.hass.states[this._config.entity]:void 0}async _selectOption(t){let i=this._stateObj;if(!(!i||this._pendingOption!=null)){this._pendingOption=t,this._activationError=void 0;try{await this.hass.callService("select","select_option",{entity_id:i.entity_id,option:t})}catch(n){this._activationError=n instanceof Error?n.message:String(n)}finally{this._pendingOption=void 0}}}_renderTile(t,i){let n=t===this._pendingOption,r=t===F?"mdi:calendar-clock":Le(t),s=t===F?f("scene_card.normal_schedule_tile",this.hass?.locale?.language):t;return _`
      <button
        class="tile ${i?"active":""}"
        ?disabled=${this._pendingOption!=null}
        @click=${()=>this._selectOption(t)}
        title=${s}
      >
        ${i&&!n?_`<ha-icon class="check" icon="mdi:check-circle"></ha-icon>`:d}
        <ha-icon icon=${n?"mdi:loading":r} class=${n?"spin":""}></ha-icon>
        <span>${s}</span>
      </button>
    `}render(){if(!this._config)return d;let t=this.hass?.locale?.language,i=this._stateObj;if(!i)return _`
        <ha-card>
          <div class="warning">
            ${f("scene_card.entity_not_found",t)} <code>${this._config.entity}</code>
          </div>
        </ha-card>
      `;let n=i.state,r=i.attributes.options||[F],s=n!==F?n:null,c=s?He(i.attributes):void 0;return this._countdown.sync(!!s&&!!i.attributes.ends_at),_`
      <ha-card>
        <div class="header">
          <div class="title">${i.attributes.friendly_name||f("scene_card.title",t)}</div>
        </div>
        ${s?_`
                <div class="status active">
                  <ha-icon icon=${Le(s)}></ha-icon>
                  <div class="status-text">
                    <div class="status-main">${s} ${f("scene_card.active_suffix",t)}</div>
                    ${c!=null&&c>0?_`<div class="status-sub">
                            ${Ue(c)} ${f("scene_card.remaining_suffix",t)}
                          </div>`:d}
                  </div>
                </div>
              `:_`<div class="status">${f("scene_card.running_normal_schedule",t)}</div>`}
        ${this._activationError?_`<div class="activation-error">${this._activationError}</div>`:d}
        <div class="tiles">${r.map(a=>this._renderTile(a,a===n))}</div>
      </ha-card>
    `}};g.styles=J`
    ha-card {
      padding: 16px;
    }
    .header {
      margin-bottom: 12px;
    }
    .title {
      font-size: 1.2em;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .status {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      margin-bottom: 14px;
      font-size: 0.9em;
      color: var(--secondary-text-color);
    }
    .status.active {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      color: var(--primary-text-color);
    }
    .status.active ha-icon {
      color: var(--primary-color);
    }
    .status-main {
      font-weight: 500;
    }
    .status-sub {
      font-size: 0.85em;
      color: var(--secondary-text-color);
    }
    .warning {
      padding: 12px;
      color: var(--error-color, #db4437);
    }
    .tiles {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
    }
    .tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 84px;
      height: 84px;
      border-radius: 12px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      font-family: inherit;
      font-size: 0.75em;
      padding: 0 6px;
      position: relative;
      box-sizing: border-box;
    }
    .tile:hover {
      border-color: var(--primary-color);
    }
    .tile.active {
      border-color: var(--primary-color);
      border-width: 1.5px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
      color: var(--primary-color);
      font-weight: 500;
    }
    .tile ha-icon {
      --mdc-icon-size: 22px;
    }
    .tile:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .tile ha-icon.spin {
      animation: mobius-scene-spin 1s linear infinite;
    }
    @keyframes mobius-scene-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .activation-error {
      margin: -4px 0 10px;
      padding: 8px 10px;
      border-radius: 8px;
      background: rgba(219, 68, 55, 0.1);
      color: var(--error-color, #db4437);
      font-size: 0.85em;
    }
    .tile .check {
      position: absolute;
      top: 4px;
      right: 4px;
      --mdc-icon-size: 16px;
      color: var(--primary-color);
      background: var(--card-background-color);
      border-radius: 50%;
    }
    .tile span {
      text-align: center;
      line-height: 1.15;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  `,S([K({attribute:!1})],g.prototype,"hass",2),S([B()],g.prototype,"_config",2),S([B()],g.prototype,"_pendingOption",2),S([B()],g.prototype,"_activationError",2),g=S([Te("vectra-studio-scene-card")],g);window.customCards=window.customCards||[];window.customCards.push({type:"vectra-studio-scene-card",name:"Mobius Scene",description:"Activate a Mobius tank's scenes, or resume its normal schedule.",preview:!1});export{g as MobiusSceneCard};
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
