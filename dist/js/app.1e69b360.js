(function(e){function t(t){for(var a,o,c=t[0],u=t[1],i=t[2],d=0,l=[];d<c.length;d++)o=c[d],Object.prototype.hasOwnProperty.call(s,o)&&s[o]&&l.push(s[o][0]),s[o]=0;for(a in u)Object.prototype.hasOwnProperty.call(u,a)&&(e[a]=u[a]);f&&f(t);while(l.length)l.shift()();return r.push.apply(r,i||[]),n()}function n(){for(var e,t=0;t<r.length;t++){for(var n=r[t],a=!0,o=1;o<n.length;o++){var c=n[o];0!==s[c]&&(a=!1)}a&&(r.splice(t--,1),e=u(u.s=n[0]))}return e}var a={},o={app:0},s={app:0},r=[];function c(e){return u.p+"js/"+({}[e]||e)+"."+{"chunk-73840cf2":"f01ff9de","chunk-f58db93e":"d11d5e15","chunk-4b38fef3":"732415ff","chunk-605c9e7d":"4d453d06","chunk-04bba835":"73072fb9","chunk-5caed139":"544f579e","chunk-6446b905":"a91fe301","chunk-7467d3f9":"3e85fafb","chunk-e07713ec":"03441282","chunk-074bb9a0":"e75062ea","chunk-172fcbee":"c90d5eda","chunk-47e39605":"95afdce0","chunk-4d3d20d5":"7ca69247","chunk-5cae96be":"09ddf368","chunk-fdc61e16":"3afe94e8","chunk-27c5ae14":"b9c714d0","chunk-69c1d2aa":"49167184","chunk-70f9244b":"90e5e8b7","chunk-36e99c3f":"e3a23d55"}[e]+".js"}function u(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.e=function(e){var t=[],n={"chunk-73840cf2":1,"chunk-f58db93e":1,"chunk-4b38fef3":1,"chunk-605c9e7d":1,"chunk-04bba835":1,"chunk-5caed139":1,"chunk-6446b905":1,"chunk-7467d3f9":1,"chunk-074bb9a0":1,"chunk-172fcbee":1,"chunk-47e39605":1,"chunk-4d3d20d5":1,"chunk-5cae96be":1,"chunk-fdc61e16":1,"chunk-27c5ae14":1,"chunk-69c1d2aa":1,"chunk-70f9244b":1,"chunk-36e99c3f":1};o[e]?t.push(o[e]):0!==o[e]&&n[e]&&t.push(o[e]=new Promise((function(t,n){for(var a="css/"+({}[e]||e)+"."+{"chunk-73840cf2":"7cda4994","chunk-f58db93e":"600cb7d0","chunk-4b38fef3":"6134a656","chunk-605c9e7d":"3bd711e3","chunk-04bba835":"2f64c701","chunk-5caed139":"0711827a","chunk-6446b905":"e6cc270c","chunk-7467d3f9":"4223a512","chunk-e07713ec":"31d6cfe0","chunk-074bb9a0":"e8733600","chunk-172fcbee":"0d22f784","chunk-47e39605":"20c78554","chunk-4d3d20d5":"e33f94db","chunk-5cae96be":"7d2d5ec2","chunk-fdc61e16":"2f67d10d","chunk-27c5ae14":"59fc5d53","chunk-69c1d2aa":"49830f27","chunk-70f9244b":"e92e65e2","chunk-36e99c3f":"28a8c730"}[e]+".css",s=u.p+a,r=document.getElementsByTagName("link"),c=0;c<r.length;c++){var i=r[c],d=i.getAttribute("data-href")||i.getAttribute("href");if("stylesheet"===i.rel&&(d===a||d===s))return t()}var l=document.getElementsByTagName("style");for(c=0;c<l.length;c++){i=l[c],d=i.getAttribute("data-href");if(d===a||d===s)return t()}var f=document.createElement("link");f.rel="stylesheet",f.type="text/css",f.onload=t,f.onerror=function(t){var a=t&&t.target&&t.target.src||s,r=new Error("Loading CSS chunk "+e+" failed.\n("+a+")");r.code="CSS_CHUNK_LOAD_FAILED",r.request=a,delete o[e],f.parentNode.removeChild(f),n(r)},f.href=s;var h=document.getElementsByTagName("head")[0];h.appendChild(f)})).then((function(){o[e]=0})));var a=s[e];if(0!==a)if(a)t.push(a[2]);else{var r=new Promise((function(t,n){a=s[e]=[t,n]}));t.push(a[2]=r);var i,d=document.createElement("script");d.charset="utf-8",d.timeout=120,u.nc&&d.setAttribute("nonce",u.nc),d.src=c(e);var l=new Error;i=function(t){d.onerror=d.onload=null,clearTimeout(f);var n=s[e];if(0!==n){if(n){var a=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;l.message="Loading chunk "+e+" failed.\n("+a+": "+o+")",l.name="ChunkLoadError",l.type=a,l.request=o,n[1](l)}s[e]=void 0}};var f=setTimeout((function(){i({type:"timeout",target:d})}),12e4);d.onerror=d.onload=i,document.head.appendChild(d)}return Promise.all(t)},u.m=e,u.c=a,u.d=function(e,t,n){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)u.d(n,a,function(t){return e[t]}.bind(null,a));return n},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="/",u.oe=function(e){throw console.error(e),e};var i=window["webpackJsonp"]=window["webpackJsonp"]||[],d=i.push.bind(i);i.push=t,i=i.slice();for(var l=0;l<i.length;l++)t(i[l]);var f=d;r.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";var a=n("85ec"),o=n.n(a);o.a},"538c":function(e,t,n){"use strict";var a=n("64cb"),o=n.n(a);o.a},"56d7":function(e,t,n){"use strict";n.r(t),n.d(t,"bus",(function(){return W}));n("e260"),n("e6cf"),n("cca6"),n("a79d");var a=n("2b0e"),o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",{staticClass:"rtl"},[n("myNavBar"),n("v-main",{staticClass:"mainBackground"},[n("router-view")],1)],1)},s=[],r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("nav",[n("v-tabs",{staticClass:"grey lighten-3"},[n("v-tab",{attrs:{to:"/empInfo"}},[e._v(" איוש שעות ")]),n("v-menu",{attrs:{left:"","offset-y":""},scopedSlots:e._u([{key:"activator",fn:function(t){var a=t.on,o=t.attrs;return[n("v-btn",e._g(e._b({staticClass:"align-self-center mr-4",staticStyle:{magin:"0"},attrs:{text:""}},"v-btn",o,!1),a),[e._v(" גמולים "),n("v-icon",{attrs:{right:""}},[e._v(" mdi-menu-down ")])],1)]}}])},[n("v-list",[n("v-list-item",{attrs:{to:"/AdditionalRewards"}},[e._v("גמולי בגרות")])],1),n("v-list",[n("v-list-item",{attrs:{to:"/jobRewards"}},[e._v("גמולי תפקיד")])],1)],1),n("v-tab",{attrs:{to:"/calcHours"}},[e._v(" רפורמות עובד ")]),n("v-tab",{attrs:{to:"/HireEmp"}},[e._v(" עובדים ")]),n("v-menu",{attrs:{"offset-y":""},scopedSlots:e._u([{key:"activator",fn:function(t){var a=t.on,o=t.attrs;return[n("v-btn",e._g(e._b({staticClass:"align-self-center mr-4",attrs:{text:""}},"v-btn",o,!1),a),[e._v(" דוחות "),n("v-icon",{attrs:{right:""}},[e._v(" mdi-menu-down ")])],1)]}}])},[n("v-list",[n("v-list-item",{attrs:{to:"/report/reportWeeklyHours"}},[e._v("איוש שעות")])],1),n("v-list",[n("v-list-item",{attrs:{to:"/report/reportBagrutRewards"}},[e._v("גמולי בגרות")])],1),n("v-list",[n("v-list-item",{attrs:{to:"/report/reportJobRewards"}},[e._v("גמולי תפקיד")])],1),n("v-list",[n("v-list-item",{attrs:{to:"/report/reportRewardGaps"}},[e._v("דוח פערי שעות-גמולים")])],1)],1),999==e.$store.state.mossadId?n("v-menu",{attrs:{"offset-y":""},scopedSlots:e._u([{key:"activator",fn:function(t){var a=t.on,o=t.attrs;return[n("v-btn",e._g(e._b({staticClass:"align-self-center mr-4",staticStyle:{magin:"0"},attrs:{text:""}},"v-btn",o,!1),a),[e._v(" מנהלה "),n("v-icon",{attrs:{right:""}},[e._v(" mdi-menu-down ")])],1)]}}],null,!1,2424123248)},[n("v-list",[999==e.$store.state.mossadId?n("v-list-item",{attrs:{to:"/auth"}},[e._v(" הרשאות ")]):e._e(),n("v-list-item",{attrs:{to:"/ImportData"}},[e._v(" ניהול Excel ")]),n("v-list-item",{attrs:{to:"/mossadot"}},[e._v("ניהול מוסדות ")]),n("v-list-item",{attrs:{to:"/mossadotHours"}},[e._v(" מגבלת שעות למוסד ")]),n("v-list-item",{attrs:{to:"/mossadClasses"}},[e._v("ניהול כיתות במוסד")]),n("v-menu",{attrs:{left:"","offset-x":""},scopedSlots:e._u([{key:"activator",fn:function(t){var a=t.on,o=t.attrs;return[n("v-btn",e._g(e._b({staticClass:"align-self-center mr-4",staticStyle:{magin:"0"},attrs:{text:""}},"v-btn",o,!1),a),[e._v(" עריכת טבלאות נתונים "),n("v-icon",{attrs:{right:""}},[e._v(" mdi-menu-left ")])],1)]}}],null,!1,1422333336)},[n("v-list",[n("v-list-item",{attrs:{to:"/bagrutRewardsCust"}},[e._v("גמולי בגרות")]),n("v-list-item",{attrs:{to:"/jobRewardsCust"}},[e._v("גמולי תפקיד")])],1)],1)],1)],1):e._e(),n("div",{staticClass:"parent",attrs:{id:"navbarInfo"}},[n("p",{staticClass:"child inline-block-child"},[e._v(e._s(e._username))]),n("p",{staticClass:"child inline-block-child"},[e._v(e._s(e._AuthText))]),n("p",{staticClass:"child inline-block-child"},[e._v(e._s(e._mossadName))]),n("v-tooltip",{attrs:{bottom:""},scopedSlots:e._u([{key:"activator",fn:function(t){var a=t.on,o=t.attrs;return[n("v-icon",e._g(e._b({staticClass:"child inline-block-child",attrs:{large:"",color:"primary"},on:{click:function(t){return e.logout()}}},"v-icon",o,!1),a),[e._v("mdi-arrow-left-bold-circle")])]}}])},[n("span",[e._v("התנתק")])])],1)],1)],1)},c=[],u=n("bc3a"),i=n.n(u),d={data:function(){return{mossadName:""}},mounted:function(){var e=this;null!=this.$store.state.logginAs&&this.$store.dispatch("getMossadInfo"),W.$on("changeWeeklyHours",(function(){return e.getMossadInfo()}))},computed:{_mossadName:function(){return null!=this.$store.state.mossadInfo?this.$store.state.mossadInfo.mossadName:""},_AuthText:function(){return 999==this.$store.state.mossadId?"(Adimn)":998==this.$store.state.mossadId?"(חשבות שכר)":""},_isLogged:function(){return null!=this.$store.state.token},_mossadId:function(){return this.$store.state.mossadId},_username:function(){return this.$store.state.username}},methods:{getMossadInfo:function(){var e=this;i.a.get("mossadot/byId",{params:{mossadId:this.$store.state.logginAs}}).then((function(t){e.$store.state.mossadInfo=t.data,e.$store.commit("setMossadInfo",t.data),e.mossadName=t.data.mossadName})).catch((function(t){return e.$store.dispatch("displayErrorMessage",{error:t})}))},logout:function(){this.$store.dispatch("destroyToken").then((function(){localStorage.removeItem("mossadId")}))},isAdmin:function(){return 999==this.$store.state.mossadId}}},l=d,f=(n("538c"),n("2877")),h=n("6544"),m=n.n(h),p=n("8336"),b=n("132d"),k=n("8860"),v=n("da13"),g=n("e449"),_=n("71a3"),I=n("fe57"),y=n("3a2f"),w=Object(f["a"])(l,r,c,!1,null,"368d93ea",null),A=w.exports;m()(w,{VBtn:p["a"],VIcon:b["a"],VList:k["a"],VListItem:v["a"],VMenu:g["a"],VTab:_["a"],VTabs:I["a"],VTooltip:y["a"]});var S={name:"App",components:{myNavBar:A},data:function(){return{}},created:function(){this.onStart()},mounted:function(){},methods:{testMe:function(){this.$store.state.popup=!0},onStart:function(){null!=this.$store.state.token&&(i.a.defaults.headers.Authorization="Bearer "+this.$store.state.token)}}},C=S,E=(n("034f"),n("7496")),$=n("f6c4"),j=Object(f["a"])(C,o,s,!1,null,null,null),P=j.exports;m()(j,{VApp:E["a"],VMain:$["a"]});n("b0c0"),n("d3b7");var T=n("8c4f"),R=(n("2ca0"),n("96cf"),n("1da1")),M=n("2f62"),x=n("0e44");a["a"].use(M["a"]),i.a.defaults.baseURL="http://134.122.120.245:8082/ots-app",i.a.defaults.headers.common["Access-Control-Allow-Origin"]="*",i.a.defaults.baseURL="http://134.122.120.245:8082/ots-app";var O=new M["a"].Store({plugins:[Object(x["a"])()],state:{token:localStorage.getItem("access_token")||null,mossadId:localStorage.getItem("mossadId")||null,logginAs:localStorage.getItem("mossadId")||null,username:localStorage.getItem("username")||null,empId:0,selectedYear:0,mossadInfo:{mossadName:"",mossadId:"",mossadType:""},popup:""},getters:{loggedIn:function(e){return null!=e.token},isAdmin:function(e){return 999==e.mossadId},mossadInfo:function(e){return e.mossadInfo},mossadId:function(e){return e.mossadId}},mutations:{retrieveToken:function(e,t){e.token=t},destroyToken:function(e){e.token=null},setMossadInfo:function(e,t){e.mossadInfo=t},setEmpId:function(e,t){e.empId=t},setSelectedYear:function(e,t){e.selectedYear=t},setLoggedAs:function(e,t){e.logginAs=t}},actions:{retrieveToken:function(e,t){return Object(R["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,i.a.post("/authenticate",{username:t.username,password:t.password}).then((function(n){var a=n.data.jwt;i.a.defaults.headers.Authorization="Bearer "+a,e.state.username=t.username,e.commit("retrieveToken",a)})).catch((function(t){e.dispatch("displayErrorMessage",{error:t})}));case 2:case"end":return n.stop()}}),n)})))()},destroyToken:function(e){e.getters.loggedIn&&(e.state.mossadId=null,e.state.logginAs=null,e.state.mossadInfo=null,e.state.username=null,e.state.token=null,localStorage.removeItem("access_token"),localStorage.removeItem("username"),localStorage.removeItem("mossadId"),e.commit("destroyToken"),B.push({name:"login"}))},displayErrorMessage:function(e,t){void 0!=t.error.response.status&&(401==t.error.response.status||500==t.error.response.status&&void 0!=t.error.response.data.message&&t.error.response.data.message.startsWith("JWT"))?null!=e.state.token&&(alert("התחבר מחדש"),e.dispatch("destroyToken")):void 0==t.error||void 0==t.error.response||void 0==t.error.response.data.errorMessage?console.log(t):alert(t.error.response.data.errorMessage)},getMossadInfo:function(e){i.a.get("mossadot/byId",{params:{mossadId:e.state.logginAs}}).then((function(t){e.state.mossadInfo=t.data,e.commit("setMossadInfo",t.data)})).catch((function(t){return e.dispatch("displayErrorMessage",{error:t})}))},setEmpId:function(e,t){e.commit("setEmpId",t)},setSelectedYear:function(e,t){e.commit("setSelectedYear",t)},setLoggedAs:function(e,t){e.commit("setLoggedAs",t)}}}),N=O;a["a"].use(T["a"]);var L=[{path:"/login",name:"login",component:function(){return n.e("chunk-73840cf2").then(n.bind(null,"5790"))}},{path:"/HireEmp",name:"HireEmp",component:function(){return Promise.all([n.e("chunk-f58db93e"),n.e("chunk-4b38fef3"),n.e("chunk-605c9e7d"),n.e("chunk-7467d3f9")]).then(n.bind(null,"062c"))}},{path:"/empInfo",alias:"/",name:"employeeInfo",component:function(){return Promise.all([n.e("chunk-f58db93e"),n.e("chunk-e07713ec"),n.e("chunk-69c1d2aa"),n.e("chunk-36e99c3f")]).then(n.bind(null,"246e"))},beforeEnter:function(e,t,n){"employeeInfo"!=e.name||999!=N.state.logginAs&&998!=N.state.logginAs?n():(alert("התחבר כמוסד כדי להכנס לדף זה"),n({name:"auth"}))}},{path:"/AdditionalRewards/",name:"AdditionalRewards",props:!0,component:function(){return Promise.all([n.e("chunk-f58db93e"),n.e("chunk-4b38fef3"),n.e("chunk-605c9e7d"),n.e("chunk-e07713ec"),n.e("chunk-47e39605")]).then(n.bind(null,"9aff"))},beforeEnter:function(e,t,n){"AdditionalRewards"!=e.name||999!=N.state.logginAs&&998!=N.state.logginAs?n():(alert("התחבר כמוסד כדי להכנס לדף זה"),n({name:"auth"}))}},{path:"/jobRewards",name:"jobRewards",props:!0,component:function(){return Promise.all([n.e("chunk-f58db93e"),n.e("chunk-4b38fef3"),n.e("chunk-605c9e7d"),n.e("chunk-e07713ec"),n.e("chunk-4d3d20d5")]).then(n.bind(null,"7eac"))},beforeEnter:function(e,t,n){"jobRewards"!=e.name||999!=N.state.logginAs&&998!=N.state.logginAs?n():(alert("התחבר כמוסד כדי להכנס לדף זה"),n({name:"auth"}))}},{path:"/mossadot",name:"mossadot",component:function(){return Promise.all([n.e("chunk-f58db93e"),n.e("chunk-4b38fef3"),n.e("chunk-605c9e7d"),n.e("chunk-e07713ec"),n.e("chunk-5cae96be")]).then(n.bind(null,"a6f6"))}},{path:"/ImportData",name:"ImportData",component:function(){return Promise.all([n.e("chunk-f58db93e"),n.e("chunk-4b38fef3"),n.e("chunk-e07713ec"),n.e("chunk-69c1d2aa"),n.e("chunk-70f9244b")]).then(n.bind(null,"9597"))}},{path:"/auth",name:"auth",component:function(){return Promise.all([n.e("chunk-f58db93e"),n.e("chunk-4b38fef3"),n.e("chunk-605c9e7d"),n.e("chunk-6446b905")]).then(n.bind(null,"f913"))}},{path:"/calcHours",name:"calcHours",component:function(){return Promise.all([n.e("chunk-f58db93e"),n.e("chunk-4b38fef3"),n.e("chunk-e07713ec"),n.e("chunk-27c5ae14")]).then(n.bind(null,"10f8"))}},{path:"/mossadotHours",name:"mossadotHours",component:function(){return Promise.all([n.e("chunk-f58db93e"),n.e("chunk-4b38fef3"),n.e("chunk-605c9e7d"),n.e("chunk-04bba835")]).then(n.bind(null,"0d6b"))}},{path:"/report/:id",name:"report",component:function(){return Promise.all([n.e("chunk-f58db93e"),n.e("chunk-4b38fef3"),n.e("chunk-605c9e7d"),n.e("chunk-e07713ec"),n.e("chunk-172fcbee")]).then(n.bind(null,"e022"))}},{path:"/mossadClasses",name:"mossadClasses",component:function(){return Promise.all([n.e("chunk-f58db93e"),n.e("chunk-4b38fef3"),n.e("chunk-605c9e7d"),n.e("chunk-5caed139")]).then(n.bind(null,"aa2f"))}},{path:"/bagrutRewardsCust",name:"bagrutRewardsCust",component:function(){return Promise.all([n.e("chunk-f58db93e"),n.e("chunk-4b38fef3"),n.e("chunk-605c9e7d"),n.e("chunk-e07713ec"),n.e("chunk-074bb9a0")]).then(n.bind(null,"3e4f"))}},{path:"/jobRewardsCust",name:"jobRewardsCust",component:function(){return Promise.all([n.e("chunk-f58db93e"),n.e("chunk-4b38fef3"),n.e("chunk-605c9e7d"),n.e("chunk-e07713ec"),n.e("chunk-fdc61e16")]).then(n.bind(null,"1c82"))}}],H=new T["a"]({routes:L});H.beforeEach((function(e,t,n){"login"===e.name||N.getters.loggedIn?n():n({name:"login"})}));var B=H,V=n("1157"),D=n.n(V),Y=n("f309");a["a"].use(Y["a"]);var J=new Y["a"]({});window.$=window.jQuery=D.a,a["a"].config.productionTip=!1;var W=new a["a"];new a["a"]({router:B,store:O,vuetify:J,render:function(e){return e(P)}}).$mount("#app")},"64cb":function(e,t,n){},"85ec":function(e,t,n){}});
//# sourceMappingURL=app.1e69b360.js.map