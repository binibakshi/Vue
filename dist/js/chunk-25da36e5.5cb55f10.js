(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-25da36e5"],{"057f":function(e,t,r){var n=r("fc6a"),a=r("241c").f,o={}.toString,i="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],s=function(e){try{return a(e)}catch(t){return i.slice()}};e.exports.f=function(e){return i&&"[object Window]"==o.call(e)?s(e):a(n(e))}},"2a7f":function(e,t,r){"use strict";r.d(t,"a",(function(){return o}));var n=r("71d9"),a=r("80d2");const o=Object(a["h"])("v-toolbar__title"),i=Object(a["h"])("v-toolbar__items");n["a"]},"2fa4":function(e,t,r){"use strict";r("20f6");var n=r("80d2");t["a"]=Object(n["h"])("spacer","div","v-spacer")},"746f":function(e,t,r){var n=r("428f"),a=r("5135"),o=r("e538"),i=r("9bf2").f;e.exports=function(e){var t=n.Symbol||(n.Symbol={});a(t,e)||i(t,e,{value:o.f(e)})}},"81b8":function(e,t,r){"use strict";var n=r("935f"),a=r.n(n);a.a},"935f":function(e,t,r){},a4d3:function(e,t,r){"use strict";var n=r("23e7"),a=r("da84"),o=r("d066"),i=r("c430"),s=r("83ab"),c=r("4930"),u=r("fdbf"),d=r("d039"),f=r("5135"),l=r("e8b5"),p=r("861d"),m=r("825a"),h=r("7b0b"),v=r("fc6a"),b=r("c04e"),y=r("5c6c"),w=r("7c73"),g=r("df75"),x=r("241c"),S=r("057f"),N=r("7418"),O=r("06cf"),R=r("9bf2"),I=r("d1e7"),T=r("9112"),j=r("6eeb"),k=r("5692"),E=r("f772"),D=r("d012"),F=r("90e3"),_=r("b622"),$=r("e538"),C=r("746f"),P=r("d44e"),V=r("69f3"),M=r("b727").forEach,J=E("hidden"),Y="Symbol",A="prototype",B=_("toPrimitive"),L=V.set,Q=V.getterFor(Y),W=Object[A],q=a.Symbol,z=o("JSON","stringify"),G=O.f,H=R.f,K=S.f,U=I.f,X=k("symbols"),Z=k("op-symbols"),ee=k("string-to-symbol-registry"),te=k("symbol-to-string-registry"),re=k("wks"),ne=a.QObject,ae=!ne||!ne[A]||!ne[A].findChild,oe=s&&d((function(){return 7!=w(H({},"a",{get:function(){return H(this,"a",{value:7}).a}})).a}))?function(e,t,r){var n=G(W,t);n&&delete W[t],H(e,t,r),n&&e!==W&&H(W,t,n)}:H,ie=function(e,t){var r=X[e]=w(q[A]);return L(r,{type:Y,tag:e,description:t}),s||(r.description=t),r},se=u?function(e){return"symbol"==typeof e}:function(e){return Object(e)instanceof q},ce=function(e,t,r){e===W&&ce(Z,t,r),m(e);var n=b(t,!0);return m(r),f(X,n)?(r.enumerable?(f(e,J)&&e[J][n]&&(e[J][n]=!1),r=w(r,{enumerable:y(0,!1)})):(f(e,J)||H(e,J,y(1,{})),e[J][n]=!0),oe(e,n,r)):H(e,n,r)},ue=function(e,t){m(e);var r=v(t),n=g(r).concat(me(r));return M(n,(function(t){s&&!fe.call(r,t)||ce(e,t,r[t])})),e},de=function(e,t){return void 0===t?w(e):ue(w(e),t)},fe=function(e){var t=b(e,!0),r=U.call(this,t);return!(this===W&&f(X,t)&&!f(Z,t))&&(!(r||!f(this,t)||!f(X,t)||f(this,J)&&this[J][t])||r)},le=function(e,t){var r=v(e),n=b(t,!0);if(r!==W||!f(X,n)||f(Z,n)){var a=G(r,n);return!a||!f(X,n)||f(r,J)&&r[J][n]||(a.enumerable=!0),a}},pe=function(e){var t=K(v(e)),r=[];return M(t,(function(e){f(X,e)||f(D,e)||r.push(e)})),r},me=function(e){var t=e===W,r=K(t?Z:v(e)),n=[];return M(r,(function(e){!f(X,e)||t&&!f(W,e)||n.push(X[e])})),n};if(c||(q=function(){if(this instanceof q)throw TypeError("Symbol is not a constructor");var e=arguments.length&&void 0!==arguments[0]?String(arguments[0]):void 0,t=F(e),r=function(e){this===W&&r.call(Z,e),f(this,J)&&f(this[J],t)&&(this[J][t]=!1),oe(this,t,y(1,e))};return s&&ae&&oe(W,t,{configurable:!0,set:r}),ie(t,e)},j(q[A],"toString",(function(){return Q(this).tag})),j(q,"withoutSetter",(function(e){return ie(F(e),e)})),I.f=fe,R.f=ce,O.f=le,x.f=S.f=pe,N.f=me,$.f=function(e){return ie(_(e),e)},s&&(H(q[A],"description",{configurable:!0,get:function(){return Q(this).description}}),i||j(W,"propertyIsEnumerable",fe,{unsafe:!0}))),n({global:!0,wrap:!0,forced:!c,sham:!c},{Symbol:q}),M(g(re),(function(e){C(e)})),n({target:Y,stat:!0,forced:!c},{for:function(e){var t=String(e);if(f(ee,t))return ee[t];var r=q(t);return ee[t]=r,te[r]=t,r},keyFor:function(e){if(!se(e))throw TypeError(e+" is not a symbol");if(f(te,e))return te[e]},useSetter:function(){ae=!0},useSimple:function(){ae=!1}}),n({target:"Object",stat:!0,forced:!c,sham:!s},{create:de,defineProperty:ce,defineProperties:ue,getOwnPropertyDescriptor:le}),n({target:"Object",stat:!0,forced:!c},{getOwnPropertyNames:pe,getOwnPropertySymbols:me}),n({target:"Object",stat:!0,forced:d((function(){N.f(1)}))},{getOwnPropertySymbols:function(e){return N.f(h(e))}}),z){var he=!c||d((function(){var e=q();return"[null]"!=z([e])||"{}"!=z({a:e})||"{}"!=z(Object(e))}));n({target:"JSON",stat:!0,forced:he},{stringify:function(e,t,r){var n,a=[e],o=1;while(arguments.length>o)a.push(arguments[o++]);if(n=t,(p(t)||void 0!==e)&&!se(e))return l(t)||(t=function(e,t){if("function"==typeof n&&(t=n.call(this,e,t)),!se(t))return t}),a[1]=t,z.apply(null,a)}})}q[A][B]||T(q[A],B,q[A].valueOf),P(q,Y),D[J]=!0},e01a:function(e,t,r){"use strict";var n=r("23e7"),a=r("83ab"),o=r("da84"),i=r("5135"),s=r("861d"),c=r("9bf2").f,u=r("e893"),d=o.Symbol;if(a&&"function"==typeof d&&(!("description"in d.prototype)||void 0!==d().description)){var f={},l=function(){var e=arguments.length<1||void 0===arguments[0]?void 0:String(arguments[0]),t=this instanceof l?new d(e):void 0===e?d():d(e);return""===e&&(f[t]=!0),t};u(l,d);var p=l.prototype=d.prototype;p.constructor=l;var m=p.toString,h="Symbol(test)"==String(d("test")),v=/^Symbol\((.*)\)[^)]+$/;c(p,"description",{configurable:!0,get:function(){var e=s(this)?this.valueOf():this,t=m.call(e);if(i(f,e))return"";var r=h?t.slice(7,-1):t.replace(v,"$1");return""===r?void 0:r}}),n({global:!0,forced:!0},{Symbol:l})}},e538:function(e,t,r){var n=r("b622");t.f=n},ecbc:function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("div",{attrs:{id:"jobRewardsReport"}},[r("v-data-table",{staticClass:"elevation-1",attrs:{dense:"",headers:e.headers,items:e.dataToDisplay,search:e.search,"footer-props":{"items-per-page-options":[20,50,100,-1],"items-per-page-text":"מספר תוצאות  :"},"no-data-text":"","item-key":"empId"},on:{"click:row":e.onRowClicked},scopedSlots:e._u([{key:"top",fn:function(){return[r("v-toolbar",{attrs:{flat:"",color:"white"}},[r("v-toolbar-title",[r("v-card-title",[r("v-row",[r("v-col",{attrs:{cols:"12",md:"10"}},[r("v-text-field",{attrs:{label:"Search",placeholder:"חפש","single-line":"",autocomplete:"off","hide-details":"","append-icon":"mdi-magnify"},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}})],1)],1)],1)],1),r("v-spacer"),r("v-btn",{attrs:{color:"success"},on:{click:function(t){return e.exportDataToExcel()}}},[e._v("ייצא לקסל")]),r("v-btn",{attrs:{color:"success"},on:{click:function(t){return e.expandExcel()}}},[e._v("ייצא אקסל מורחב")])],1)]},proxy:!0},{key:"item.percent",fn:function(t){var r=t.item;return[e._v(e._s(e.getTwoDigits(r.percent))+"%")]}}],null,!0)})],1)])},a=[],o=(r("a4d3"),r("e01a"),r("4de4"),r("7db0"),r("4160"),r("a630"),r("d81d"),r("13d5"),r("b680"),r("d3b7"),r("6062"),r("3ca3"),r("159b"),r("ddb0"),r("96cf"),r("1da1")),i=r("bc3a"),s=r.n(i),c=r("87cf"),u={props:["selectedYear","selectedMossadId"],data:function(){return{search:"",rewards:[],additionalReward:[],employees:[],dataToDisplay:[],headers:[{text:"תעודת זהות",value:"empId"},{text:"שם פרטי",value:"firstName"},{text:"שם משפחה",value:"lastName"},{text:"גמול שעות",value:"hours"},{text:"גמול אחוזים",value:"percent"}],isExternalRange:[{text:"חצוני",value:!0},{text:"פנימי",value:!1}],isSplitedRange:[{text:"לא",value:!1},{text:"כן",value:!0}]}},mounted:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.getEmployees();case 2:return t.next=4,e.getJobRewards();case 4:return t.next=6,e.getRewards();case 6:case"end":return t.stop()}}),t)})))()},methods:{getRewards:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.rewards=[],t.next=3,s.a.get("/teachersRewards/byMossadAndYearAndType",{params:{mossadId:e.selectedMossadId,year:e.selectedYear,rewardType:2}}).then((function(t){e.rewards=t.data,e.setDataToDisplay()})).catch((function(t){e.$store.dispatch("displayErrorMessage",{error:t})}));case 3:case"end":return t.stop()}}),t)})))()},getEmployees:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,s.a.get("/employees/all").then((function(t){e.employees=t.data})).catch((function(t){return e.$store.dispatch("displayErrorMessage",{error:t})}));case 2:case"end":return t.stop()}}),t)})))()},getJobRewards:function(){var e=this;return Object(o["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,s.a.get("jobRewards/all").then((function(t){e.additionalReward=t.data})).catch((function(t){e.$store.dispatch("displayErrorMessage",{error:t})}));case 2:case"end":return t.stop()}}),t)})))()},setDataToDisplay:function(){var e=this;this.dataToDisplay=[];for(var t=Array.from(new Set(this.rewards.map((function(e){return e.empId})))),r=function(r){var n=t[r],a=e.employees.find((function(e){return e.empId==n}));e.dataToDisplay.push({empId:n,firstName:a.firstName,lastName:a.lastName,hours:e.rewards.filter((function(e){return e.empId==n})).reduce((function(e,t){return e+parseFloat(t.hours)}),0).toFixed(2),percent:e.rewards.filter((function(e){return e.empId==n})).reduce((function(e,t){return e+parseFloat(t.percent)}),0).toFixed(2)})},n=0;n<t.length;n++)r(n)},exportDataToExcel:function(){var e=this,t=[],r={year:"שנה",empId:"תעודת זהות",firstName:"שם פרטי",lastName:"שם משפחה",hours:"גמול שעות",percent:"גמול אחוזים"};this.dataToDisplay.forEach((function(r){t.push({year:e.selectedYear,empId:r.empId,firstName:r.firstName,lastName:r.lastName,hours:r.hours,percent:r.percent})})),this.downloadFile(t,r,"דוח שעות.xlsx","סיכום שעות")},onRowClicked:function(e){this.$store.dispatch("setEmpId",e.empId),this.$store.dispatch("setLoggedAs",this.selectedMossadId);var t=this.$router.resolve({name:"jobRewards"});window.open(t.href)},expandExcel:function(){var e=this,t={empId:"תעודת זהות",firstName:"שם פרטי",lastName:"שם משפחה",mossadName:"שם מוסד",year:"שנה",employmentCode:"קוד מקצוע",codeDescription:"תיאור גמול",hoursReward:'ס"ה שעות',percentReward:'ס"ה אחוזים',hoursNormal:"גמול שעות",hoursOTS:"שעות תוספתיות",percentNormal:"גמול אחוזים",percentOTS:"אחוזים תוספתיים"},r=[],n={};this.rewards.forEach((function(t){n=e.additionalReward.find((function(e){return e.recordkey==t.rewardId})),r.push({empId:t.empId,firstName:e.employees.find((function(e){return e.empId==t.empId})).firstName,lastName:e.employees.find((function(e){return e.empId==t.empId})).lastName,mossadName:e.$store.state.mossadInfo.mossadName,year:e.selectedYear,employmentCode:n.employmentCode,codeDescription:n.description,hoursReward:t.hours,percentReward:t.percent,hoursNormal:t.hoursNormal,hoursOTS:t.hoursOTS,percentNormal:t.percentNormal,percentOTS:t.percentOTS})})),r.sort((function(e,t){return e.empId>t.empId?1:-1})),this.downloadFile(r,t,"גמולי בגרות.xlsx","גמולי בגרות")},getTwoDigits:function(e){return isNaN(e)?0:parseFloat(e).toFixed(2)}},mixins:[c["a"]]},d=u,f=(r("81b8"),r("2877")),l=r("6544"),p=r.n(l),m=r("8336"),h=r("99d9"),v=r("62ad"),b=r("8fea"),y=r("0fd9"),w=r("2fa4"),g=r("8654"),x=r("71d9"),S=r("2a7f"),N=Object(f["a"])(d,n,a,!1,null,"7ae0382c",null);t["default"]=N.exports;p()(N,{VBtn:m["a"],VCardTitle:h["b"],VCol:v["a"],VDataTable:b["a"],VRow:y["a"],VSpacer:w["a"],VTextField:g["a"],VToolbar:x["a"],VToolbarTitle:S["a"]})}}]);
//# sourceMappingURL=chunk-25da36e5.5cb55f10.js.map