(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0d335cd3"],{"159b":function(t,e,s){var r=s("da84"),a=s("fdbc"),i=s("17c2"),n=s("9112");for(var o in a){var c=r[o],l=c&&c.prototype;if(l&&l.forEach!==i)try{n(l,"forEach",i)}catch(d){l.forEach=i}}},"17c2":function(t,e,s){"use strict";var r=s("b727").forEach,a=s("a640"),i=s("ae40"),n=a("forEach"),o=i("forEach");t.exports=n&&o?[].forEach:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}},"287d":function(t,e,s){"use strict";var r=s("dc2c"),a=s.n(r);a.a},"2a7f":function(t,e,s){"use strict";s.d(e,"a",(function(){return i}));var r=s("71d9"),a=s("80d2");const i=Object(a["h"])("v-toolbar__title"),n=Object(a["h"])("v-toolbar__items");r["a"]},"36a7":function(t,e,s){},3816:function(t,e,s){"use strict";s.r(e);var r=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("setJobPercentage",{staticClass:"myTable center"})],1)},a=[],i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"wrapper"},[s("v-row",[s("v-col",{attrs:{cols:"12",md:"2"}},[s("v-select",{attrs:{items:t.$store.state.years,"item-text":"hebrewYear","item-value":"year",label:"שנה",placeholder:"בחר שנה"},on:{change:function(e){return t.onYearChange()}},model:{value:t.selectedYear,callback:function(e){t.selectedYear=e},expression:"selectedYear"}})],1),s("v-col",{attrs:{cols:"12",md:"8"}},[s("v-data-table",{staticClass:"elevation-3 jobPercentTable",attrs:{height:"450",headers:t.headers,items:t.tableToDisplay,search:t.search,dense:"","footer-props":{"items-per-page-options":[20,50,100,-1],"items-per-page-text":"מספר תוצאות  :"}},scopedSlots:t._u([{key:"top",fn:function(){return[s("v-toolbar",{attrs:{flat:"",color:"white"}},[s("v-toolbar-title",[s("v-card-title",[s("v-row",[s("v-col",{attrs:{cols:"12",md:"10"}},[s("v-text-field",{attrs:{label:"Search",placeholder:"חפש","single-line":"",autocomplete:"off","hide-details":"","append-icon":"mdi-magnify"},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}})],1)],1)],1)],1)],1)]},proxy:!0},{key:"item.estimateJobPercent",fn:function(e){var r=e.item;return[s("v-text-field",{staticStyle:{"max-width":"150px"},attrs:{dense:""},model:{value:r.estimateJobPercent,callback:function(e){t.$set(r,"estimateJobPercent",e)},expression:"item.estimateJobPercent"}})]}},{key:"item.actions",fn:function(e){var r=e.item;return[s("v-tooltip",{attrs:{bottom:""},scopedSlots:t._u([{key:"activator",fn:function(e){var a=e.on,i=e.attrs;return[s("v-icon",t._g(t._b({staticClass:"mr-2",attrs:{small:""},on:{click:function(e){return t.saveJobPercent(r)}}},"v-icon",i,!1),a),[t._v("mdi-content-save")])]}}],null,!0)},[s("span",[t._v("שמור")])])]}}],null,!0)})],1)],1)],1)},n=[],o=(s("7db0"),s("4160"),s("159b"),s("96cf"),s("1da1")),c=s("bc3a"),l=s.n(c),d={data:function(){return{search:"",selectedYear:0,selectedMossadId:0,tzArray:[],jobPercentTable:[],tableToDisplay:[],headers:[{text:"תעודת זהות",value:"empId"},{text:"שם משפחה",value:"lastName"},{text:"שם פרטי",value:"firstName"},{text:"קביעות משרה",value:"estimateJobPercent"},{text:"פעולות",value:"actions",sortable:!1}]}},created:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.initilize(),e.next=3,t.getAllJobPercent();case 3:return e.next=5,t.getAllTz();case 5:t.setExistData();case 6:case"end":return e.stop()}}),e)})))()},methods:{initilize:function(){if(0!=this.$store.state.selectedYear)this.selectedYear=this.$store.state.selectedYear;else{var t=new Date;this.selectedYear=t.getMonth()>=8?t.getFullYear()+1:t.getFullYear()}this.$store.state.logginAs==this.$store.state.logginAs&&(this.selectedMossadId=this.$store.state.logginAs)},getAllTz:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,l.a.get("/employees/all").then((function(e){t.tzArray=e.data})).catch((function(e){return t.$store.dispatch("displayErrorMessage",{error:e})}));case 2:case"end":return e.stop()}}),e)})))()},getAllJobPercent:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.jobPercentTable=[],e.next=3,l.a.get("/jobPercent/byYearAndMossad",{params:{mossadId:t.selectedMossadId,year:t.selectedYear}}).then((function(e){t.jobPercentTable=e.data})).catch((function(e){return t.$store.dispatch("displayErrorMessage",{error:e})}));case 3:case"end":return e.stop()}}),e)})))()},saveJobPercent:function(t){var e=this;if(t.estimateJobPercent>150)alert("אי אפשר להזין יותר מ150 אחוזי קיבעות משרה");else{var s={empId:t.empId,mossadId:this.selectedMossadId,year:this.selectedYear,estimateJobPercent:t.estimateJobPercent};l()({url:"/jobPercent/save",method:"post",data:s}).then((function(){alert("הנתונים נשמרו בהצלחה")})).catch((function(t){e.$store.dispatch("displayErrorMessage",{error:t})}))}},setExistData:function(){var t=this;this.tableToDisplay=[];var e={},s=0;this.tzArray.forEach((function(r){e=t.jobPercentTable.find((function(t){return t.empId==r.empId})),s=e?e.estimateJobPercent:0,t.tableToDisplay.push({empId:r.empId,firstName:r.firstName,lastName:r.lastName,estimateJobPercent:s})}))},onYearChange:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.$store.dispatch("setSelectedYear",t.selectedYear),e.next=3,t.getAllJobPercent();case 3:t.setExistData();case 4:case"end":return e.stop()}}),e)})))()}}},h=d,u=(s("287d"),s("2877")),p=s("6544"),m=s.n(p),g=s("99d9"),f=s("62ad"),b=s("8fea"),v=s("132d"),S=s("0fd9"),y=s("b974"),x=s("8654"),_=s("71d9"),E=s("2a7f"),C=s("3a2f"),w=Object(u["a"])(h,i,n,!1,null,"26aa8cd6",null),j=w.exports;m()(w,{VCardTitle:g["b"],VCol:f["a"],VDataTable:b["a"],VIcon:v["a"],VRow:S["a"],VSelect:y["a"],VTextField:x["a"],VToolbar:_["a"],VToolbarTitle:E["a"],VTooltip:C["a"]});var L={name:"setJobPercent",components:{setJobPercentage:j}},P=L,$=(s("795a"),Object(u["a"])(P,r,a,!1,null,"184040f0",null));e["default"]=$.exports},"3d1e":function(t,e,s){},4160:function(t,e,s){"use strict";var r=s("23e7"),a=s("17c2");r({target:"Array",proto:!0,forced:[].forEach!=a},{forEach:a})},"5e23":function(t,e,s){},"62ad":function(t,e,s){"use strict";s("4b85");var r=s("2b0e"),a=s("d9f7"),i=s("80d2");const n=["sm","md","lg","xl"],o=(()=>n.reduce((t,e)=>(t[e]={type:[Boolean,String,Number],default:!1},t),{}))(),c=(()=>n.reduce((t,e)=>(t["offset"+Object(i["D"])(e)]={type:[String,Number],default:null},t),{}))(),l=(()=>n.reduce((t,e)=>(t["order"+Object(i["D"])(e)]={type:[String,Number],default:null},t),{}))(),d={col:Object.keys(o),offset:Object.keys(c),order:Object.keys(l)};function h(t,e,s){let r=t;if(null!=s&&!1!==s){if(e){const s=e.replace(t,"");r+="-"+s}return"col"!==t||""!==s&&!0!==s?(r+="-"+s,r.toLowerCase()):r.toLowerCase()}}const u=new Map;e["a"]=r["a"].extend({name:"v-col",functional:!0,props:{cols:{type:[Boolean,String,Number],default:!1},...o,offset:{type:[String,Number],default:null},...c,order:{type:[String,Number],default:null},...l,alignSelf:{type:String,default:null,validator:t=>["auto","start","end","center","baseline","stretch"].includes(t)},tag:{type:String,default:"div"}},render(t,{props:e,data:s,children:r,parent:i}){let n="";for(const a in e)n+=String(e[a]);let o=u.get(n);if(!o){let t;for(t in o=[],d)d[t].forEach(s=>{const r=e[s],a=h(t,s,r);a&&o.push(a)});const s=o.some(t=>t.startsWith("col-"));o.push({col:!s||!e.cols,["col-"+e.cols]:e.cols,["offset-"+e.offset]:e.offset,["order-"+e.order]:e.order,["align-self-"+e.alignSelf]:e.alignSelf}),u.set(n,o)}return t(e.tag,Object(a["a"])(s,{class:o}),r)}})},"71d9":function(t,e,s){"use strict";s("5e23");var r=s("8dd9"),a=(s("8efc"),s("90a2")),i=(s("36a7"),s("24b2")),n=s("58df"),o=Object(n["a"])(i["a"]).extend({name:"v-responsive",props:{aspectRatio:[String,Number],contentClass:String},computed:{computedAspectRatio(){return Number(this.aspectRatio)},aspectStyle(){return this.computedAspectRatio?{paddingBottom:1/this.computedAspectRatio*100+"%"}:void 0},__cachedSizer(){return this.aspectStyle?this.$createElement("div",{style:this.aspectStyle,staticClass:"v-responsive__sizer"}):[]}},methods:{genContent(){return this.$createElement("div",{staticClass:"v-responsive__content",class:this.contentClass},this.$slots.default)}},render(t){return t("div",{staticClass:"v-responsive",style:this.measurableStyles,on:this.$listeners},[this.__cachedSizer,this.genContent()])}}),c=o,l=s("7560"),d=s("d9f7"),h=s("d9bd");const u="undefined"!==typeof window&&"IntersectionObserver"in window;var p=Object(n["a"])(c,l["a"]).extend({name:"v-img",directives:{intersect:a["a"]},props:{alt:String,contain:Boolean,eager:Boolean,gradient:String,lazySrc:String,options:{type:Object,default:()=>({root:void 0,rootMargin:void 0,threshold:void 0})},position:{type:String,default:"center center"},sizes:String,src:{type:[String,Object],default:""},srcset:String,transition:{type:[Boolean,String],default:"fade-transition"}},data(){return{currentSrc:"",image:null,isLoading:!0,calculatedAspectRatio:void 0,naturalWidth:void 0,hasError:!1}},computed:{computedAspectRatio(){return Number(this.normalisedSrc.aspect||this.calculatedAspectRatio)},normalisedSrc(){return this.src&&"object"===typeof this.src?{src:this.src.src,srcset:this.srcset||this.src.srcset,lazySrc:this.lazySrc||this.src.lazySrc,aspect:Number(this.aspectRatio||this.src.aspect)}:{src:this.src,srcset:this.srcset,lazySrc:this.lazySrc,aspect:Number(this.aspectRatio||0)}},__cachedImage(){if(!(this.normalisedSrc.src||this.normalisedSrc.lazySrc||this.gradient))return[];const t=[],e=this.isLoading?this.normalisedSrc.lazySrc:this.currentSrc;this.gradient&&t.push(`linear-gradient(${this.gradient})`),e&&t.push(`url("${e}")`);const s=this.$createElement("div",{staticClass:"v-image__image",class:{"v-image__image--preload":this.isLoading,"v-image__image--contain":this.contain,"v-image__image--cover":!this.contain},style:{backgroundImage:t.join(", "),backgroundPosition:this.position},key:+this.isLoading});return this.transition?this.$createElement("transition",{attrs:{name:this.transition,mode:"in-out"}},[s]):s}},watch:{src(){this.isLoading?this.loadImage():this.init(void 0,void 0,!0)},"$vuetify.breakpoint.width":"getSrc"},mounted(){this.init()},methods:{init(t,e,s){if(!u||s||this.eager){if(this.normalisedSrc.lazySrc){const t=new Image;t.src=this.normalisedSrc.lazySrc,this.pollForSize(t,null)}this.normalisedSrc.src&&this.loadImage()}},onLoad(){this.getSrc(),this.isLoading=!1,this.$emit("load",this.src),this.image&&(this.normalisedSrc.src.endsWith(".svg")||this.normalisedSrc.src.startsWith("data:image/svg+xml"))&&(this.image.naturalHeight&&this.image.naturalWidth?(this.naturalWidth=this.image.naturalWidth,this.calculatedAspectRatio=this.image.naturalWidth/this.image.naturalHeight):this.calculatedAspectRatio=1)},onError(){this.hasError=!0,this.$emit("error",this.src)},getSrc(){this.image&&(this.currentSrc=this.image.currentSrc||this.image.src)},loadImage(){const t=new Image;this.image=t,t.onload=()=>{t.decode?t.decode().catch(t=>{Object(h["c"])("Failed to decode image, trying to render anyway\n\nsrc: "+this.normalisedSrc.src+(t.message?"\nOriginal error: "+t.message:""),this)}).then(this.onLoad):this.onLoad()},t.onerror=this.onError,this.hasError=!1,t.src=this.normalisedSrc.src,this.sizes&&(t.sizes=this.sizes),this.normalisedSrc.srcset&&(t.srcset=this.normalisedSrc.srcset),this.aspectRatio||this.pollForSize(t),this.getSrc()},pollForSize(t,e=100){const s=()=>{const{naturalHeight:r,naturalWidth:a}=t;r||a?(this.naturalWidth=a,this.calculatedAspectRatio=a/r):t.complete||!this.isLoading||this.hasError||null==e||setTimeout(s,e)};s()},genContent(){const t=c.options.methods.genContent.call(this);return this.naturalWidth&&this._b(t.data,"div",{style:{width:this.naturalWidth+"px"}}),t},__genPlaceholder(){if(this.$slots.placeholder){const t=this.isLoading?[this.$createElement("div",{staticClass:"v-image__placeholder"},this.$slots.placeholder)]:[];return this.transition?this.$createElement("transition",{props:{appear:!0,name:this.transition}},t):t[0]}}},render(t){const e=c.options.render.call(this,t),s=Object(d["a"])(e.data,{staticClass:"v-image",attrs:{"aria-label":this.alt,role:this.alt?"img":void 0},class:this.themeClasses,directives:u?[{name:"intersect",modifiers:{once:!0},value:{handler:this.init,options:this.options}}]:void 0});return e.children=[this.__cachedSizer,this.__cachedImage,this.__genPlaceholder(),this.genContent()],t(e.tag,s,e.children)}}),m=s("80d2");e["a"]=r["a"].extend({name:"v-toolbar",props:{absolute:Boolean,bottom:Boolean,collapse:Boolean,dense:Boolean,extended:Boolean,extensionHeight:{default:48,type:[Number,String]},flat:Boolean,floating:Boolean,prominent:Boolean,short:Boolean,src:{type:[String,Object],default:""},tag:{type:String,default:"header"}},data:()=>({isExtended:!1}),computed:{computedHeight(){const t=this.computedContentHeight;if(!this.isExtended)return t;const e=parseInt(this.extensionHeight);return this.isCollapsed?t:t+(isNaN(e)?0:e)},computedContentHeight(){return this.height?parseInt(this.height):this.isProminent&&this.dense?96:this.isProminent&&this.short?112:this.isProminent?128:this.dense?48:this.short||this.$vuetify.breakpoint.smAndDown?56:64},classes(){return{...r["a"].options.computed.classes.call(this),"v-toolbar":!0,"v-toolbar--absolute":this.absolute,"v-toolbar--bottom":this.bottom,"v-toolbar--collapse":this.collapse,"v-toolbar--collapsed":this.isCollapsed,"v-toolbar--dense":this.dense,"v-toolbar--extended":this.isExtended,"v-toolbar--flat":this.flat,"v-toolbar--floating":this.floating,"v-toolbar--prominent":this.isProminent}},isCollapsed(){return this.collapse},isProminent(){return this.prominent},styles(){return{...this.measurableStyles,height:Object(m["g"])(this.computedHeight)}}},created(){const t=[["app","<v-app-bar app>"],["manual-scroll",'<v-app-bar :value="false">'],["clipped-left","<v-app-bar clipped-left>"],["clipped-right","<v-app-bar clipped-right>"],["inverted-scroll","<v-app-bar inverted-scroll>"],["scroll-off-screen","<v-app-bar scroll-off-screen>"],["scroll-target","<v-app-bar scroll-target>"],["scroll-threshold","<v-app-bar scroll-threshold>"],["card","<v-app-bar flat>"]];t.forEach(([t,e])=>{this.$attrs.hasOwnProperty(t)&&Object(h["a"])(t,e,this)})},methods:{genBackground(){const t={height:Object(m["g"])(this.computedHeight),src:this.src},e=this.$scopedSlots.img?this.$scopedSlots.img({props:t}):this.$createElement(p,{props:t});return this.$createElement("div",{staticClass:"v-toolbar__image"},[e])},genContent(){return this.$createElement("div",{staticClass:"v-toolbar__content",style:{height:Object(m["g"])(this.computedContentHeight)}},Object(m["r"])(this))},genExtension(){return this.$createElement("div",{staticClass:"v-toolbar__extension",style:{height:Object(m["g"])(this.extensionHeight)}},Object(m["r"])(this,"extension"))}},render(t){this.isExtended=this.extended||!!this.$scopedSlots.extension;const e=[this.genContent()],s=this.setBackgroundColor(this.color,{class:this.classes,style:this.styles,on:this.$listeners});return this.isExtended&&e.push(this.genExtension()),(this.src||this.$scopedSlots.img)&&e.unshift(this.genBackground()),t(this.tag,s,e)}})},"795a":function(t,e,s){"use strict";var r=s("3d1e"),a=s.n(r);a.a},"7db0":function(t,e,s){"use strict";var r=s("23e7"),a=s("b727").find,i=s("44d2"),n=s("ae40"),o="find",c=!0,l=n(o);o in[]&&Array(1)[o]((function(){c=!1})),r({target:"Array",proto:!0,forced:c||!l},{find:function(t){return a(this,t,arguments.length>1?arguments[1]:void 0)}}),i(o)},"8efc":function(t,e,s){},"99d9":function(t,e,s){"use strict";s.d(e,"a",(function(){return o})),s.d(e,"b",(function(){return c}));var r=s("b0af"),a=s("80d2");const i=Object(a["h"])("v-card__actions"),n=Object(a["h"])("v-card__subtitle"),o=Object(a["h"])("v-card__text"),c=Object(a["h"])("v-card__title");r["a"]},a640:function(t,e,s){"use strict";var r=s("d039");t.exports=function(t,e){var s=[][t];return!!s&&r((function(){s.call(null,e||function(){throw 1},1)}))}},dc2c:function(t,e,s){},fdbc:function(t,e){t.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}}}]);
//# sourceMappingURL=chunk-0d335cd3.64167eae.js.map