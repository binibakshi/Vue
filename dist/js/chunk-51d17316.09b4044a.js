(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-51d17316"],{1148:function(e,t,r){"use strict";var s=r("a691"),o=r("1d80");e.exports="".repeat||function(e){var t=String(o(this)),r="",n=s(e);if(n<0||n==1/0)throw RangeError("Wrong number of repetitions");for(;n>0;(n>>>=1)&&(t+=t))1&n&&(r+=t);return r}},"13d5":function(e,t,r){"use strict";var s=r("23e7"),o=r("d58f").left,n=r("a640"),a=r("ae40"),i=r("2d00"),u=r("605d"),d=n("reduce"),c=a("reduce",{1:0}),l=!u&&i>79&&i<83;s({target:"Array",proto:!0,forced:!d||!c||l},{reduce:function(e){return o(this,e,arguments.length,arguments.length>1?arguments[1]:void 0)}})},"246e":function(e,t,r){"use strict";r.r(t);var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("setEmployeesHours")],1)},o=[],n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-card",[r("div",{staticClass:"littleMargin"},[r("v-row",{attrs:{id:"mossadHoursDetails"}},[r("v-col",{attrs:{cols:"12",md:"2",sm:"2"}},[r("v-select",{staticStyle:{"max-hight":"40px"},attrs:{items:e.years,"item-text":"hebrewYear","item-value":"year",label:"שנה"},on:{change:function(t){return e.onYearChanged()}},model:{value:e.selectedYear,callback:function(t){e.selectedYear=t},expression:"selectedYear"}})],1),r("v-col",{attrs:{cols:"12",md:"2",sm:"2"}},[r("p",[e._v("מוסד - "+e._s(e._mossadInfo.mossadName))])]),r("v-col",{attrs:{cols:"12",md:"2",sm:"2"}},[r("a",{on:{click:function(t){return e.navToReport()}}},[e._v("שעות מאוישות - "+e._s(e._mossadInfo.currHours))])]),r("v-col",{attrs:{cols:"12",md:"2",sm:"2"}},[r("p",[e._v(" יתרת שעות - "+e._s(e.getTwoDigits(e._mossadInfo.maxHours-e._mossadInfo.currHours))+" ")])]),r("v-col",{attrs:{cols:"12",md:"2",sm:"2"}},[r("p",[e._v("מגבלת שעות- "+e._s(e._mossadInfo.maxHours))])]),r("v-col",{attrs:{cols:"12",md:"2",sm:"2"}},[r("p",[e._v(" אחוז איוש - "+e._s(e.getTwoDigits(e._mossadInfo.currHours/e._mossadInfo.maxHours*100))+"% ")])])],1),r("div",{directives:[{name:"show",rawName:"v-show",value:null!=e._mossadInfo.maxHours&&0!=e._mossadInfo.maxHours,expression:"_mossadInfo.maxHours != null && _mossadInfo.maxHours != 0"}]},[r("div",{staticClass:"wrapper-grid"},[r("div",{staticClass:"grid-element"},[r("v-autocomplete",{attrs:{disabled:null==e._mossadInfo.maxHours||0==e._mossadInfo.maxHours,items:e.tzArray,"item-text":function(e){return e.firstName+" "+e.lastName+" - "+e.empId},"item-value":"empId",label:"תעודת זהות",placeholder:"חפש","hide-selected":""},on:{change:function(t){return e.getEmployeeInfo()}},model:{value:e.empId,callback:function(t){e.empId=t},expression:"empId"}})],1),r("div",{staticClass:"grid-element"},[r("p",[e._v("שם פרטי")]),e._v(" "+e._s(e.employeeInfo.firstName)+" ")]),r("div",{staticClass:"grid-element"},[r("p",[e._v("שם משפחה")]),e._v(" "+e._s(e.employeeInfo.lastName)+" ")]),r("div",{staticClass:"grid-element"},[r("p",[e._v("גיל")]),e._v(" "+e._s(e._getAge)+" ")]),r("div",{staticClass:"grid-element"},[r("p",[e._v("משרת אם")]),e._v(" "+e._s(e.formatIsMother)+" ")]),r("div",{staticClass:"grid-element"},[r("p",[e._v("שעות גיל")]),e._v(" "+e._s(e._getAgeHours)+" ")]),r("div",{staticClass:"grid-element"},[r("div",{staticClass:"detailsTable"},[r("table",[r("thead",[r("th"),r("th",[e._v("א")]),r("th",[e._v("ב")]),r("th",[e._v("ג")]),r("th",[e._v("ד")]),r("th",[e._v("ה")]),r("th",[e._v("ו")]),r("th",[e._v("סך שעות")]),r("th",[e._v("אחוז משרה")])]),r("tbody",e._l(e.empHoursTable,(function(t,s){return r("tr",{key:s},[r("td",[e._v(e._s(e.getRowType(t.type)))]),e._l(6,(function(s){return r("td",{key:s},[r("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(o){var n=o.on,a=o.attrs;return[r("span",e._g(e._b({on:{mouseover:function(r){return e.changeText(t.type,s-1)}}},"span",a,!1),n),[e._v(" "+e._s(t.week[s-1].hours))])]}}],null,!0)},[r("span",[e._v(e._s(e.hoverText))])])],1)})),r("td",[e._v(e._s(t.sum))]),r("td",[e._v(e._s(e.getTwoDigits(t.jobPercent))+"%")])],2)})),0)])]),r("div",{staticClass:"underTableDiv"},[r("div",{staticClass:"workInReform"},e._l(e.workInReforms,(function(t){return r("span",{key:t,attrs:{id:"mossadotWorkAt"}},[e._v(e._s(e.getRreformDiscription(t)+", "))])})),0),r("div",[r("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(t){var s=t.on,o=t.attrs;return[r("v-icon",e._g(e._b({staticClass:"mr-3 excelMDI",attrs:{large:""},on:{click:function(t){return e.exportEmployeeWeeklyHours()}}},"v-icon",o,!1),s),[e._v("mdi-file-excel-outline")])]}}])},[r("span",[e._v("ייצוא איוש שעות לאקסל")])])],1)])]),r("div",{staticClass:"grid-element"},[r("router-link",{attrs:{title:"דף אחוז קביעות משרה",to:{name:"setJobPercent"},target:"_blank"}},[e._v(" אחוז קביעות")]),r("p",[e._v(e._s(e.estinateJobPercent))])],1)]),null!=e.empId?r("v-row",[r("v-col",{attrs:{cols:"12",md:"3",sm:"3"}},[r("v-select",{attrs:{items:e.filterReformTypeByMossad(),"item-text":"name","item-value":"reformId",label:"בחר רפורמה",multiple:"","single-line":""},model:{value:e.selectedReforms,callback:function(t){e.selectedReforms=t},expression:"selectedReforms"}})],1)],1):e._e(),null!=e.employeeInfo&&null!=e.selectedReforms?r("div",e._l(e.selectedReforms,(function(t,s){return r("v-card",{key:s,staticClass:"littleSpace center"},[r("v-progress-circular",{directives:[{name:"show",rawName:"v-show",value:e.circleProgress,expression:"circleProgress"}],attrs:{size:100,color:"primary",indeterminate:""}}),r("weeklyHours",{directives:[{name:"show",rawName:"v-show",value:!e.circleProgress,expression:"!circleProgress"}],key:e.compId,attrs:{empId:e.empId,selectedYear:e.selectedYear,reformType:t,isMother:e.employeeInfo.mother,ageHours:e.ageHours,codeDescription:e.getRelevantCodesDescription(t),jobRewardTypes:e.jobRewardTypes,rewardsHours:e.getRelevantRewardHours(t),existData:e.getRelevantData(t)}})],1)})),1):e._e()],1)],1)])},a=[],i=(r("4de4"),r("7db0"),r("4160"),r("caad"),r("13d5"),r("b0c0"),r("b680"),r("2532"),r("159b"),r("96cf"),r("1da1")),u=r("bc3a"),d=r.n(u),c=function(){var e=this,t=e.$createElement,r=e._self._c||t;return null!=e.empId?r("div",{staticClass:"reformTypeTables"},[r("h1",{staticClass:"center"},[e._v(e._s(e._reformDiscription))]),e._l(e.tablesArray,(function(t,s){return r("div",{key:s},[r("div",{staticClass:"sideBySide"},[r("div",{attrs:{id:"right"}},[r("v-text-field",{attrs:{label:"מתאריך",type:"date",min:e.datesRange.min,max:e.datesRange.max},on:{change:function(r){return e.setDatesIfChange(t)}},model:{value:t.begda,callback:function(r){e.$set(t,"begda",r)},expression:"table.begda"}},[e._v("מתאריך")]),r("v-text-field",{attrs:{label:"עד תאריך",type:"date",min:e.datesRange.min,max:e.datesRange.max},on:{change:function(r){return e.setDatesIfChange(t)}},model:{value:t.endda,callback:function(r){e.$set(t,"endda",r)},expression:"table.endda"}},[e._v("עד תאריך")])],1),r("div",{attrs:{id:"left"}},[r("weeklyHoursTable",{attrs:{empId:e.empId,reformType:e.reformType,isMother:e.isMother,ageHours:e.ageHours,existData:t.data,begda:t.begda,endda:t.endda,codeDescription:e.codeDescription,jobRewardTypes:e.jobRewardTypes,rewardsHours:e.rewardsHours}})],1)])])}))],2):e._e()},l=[],f=function(){var e=this,t=e.$createElement,r=e._self._c||t;return null!=e.empId&&0!=e.reformType?r("div",[r("table",{attrs:{id:"t01"}},[e._m(0),r("tbody",[e._l(e.newHours,(function(t,s){return r("tr",{key:s},[r("td",[r("div",{attrs:{id:"additionalActions"}},[t.type==e.frontalConst?r("v-icon",{attrs:{id:"myPlusIcon",dense:""},on:{click:function(t){return e.addNewRow()}}},[e._v("mdi-plus-circle-outline")]):e._e(),t.type==e.frontalConst?r("v-icon",{attrs:{id:"myMinusIcon",dense:""},on:{click:function(t){return e.removeRow(s)}}},[e._v("mdi-minus-circle-outline")]):e._e()],1)]),r("td",[e._v(e._s(e.convertReformDescription(t.type)))]),r("td",{staticStyle:{"padding-right":"10px"}},[t.type==e.frontalConst?r("v-autocomplete",{staticClass:"mySelectOption",attrs:{items:e.relevantCodes(t),"hide-selected":"","item-text":function(e){return e.code+" - "+e.codeDescription},"item-value":"code"},on:{change:function(r){return e.onCodeSelect(t)}},model:{value:t.code,callback:function(r){e.$set(t,"code",r)},expression:"row.code"}}):e._e(),t.type!=e.frontalConst?r("h4",{staticStyle:{"text-align":"right"}},[e._v(" "+e._s(t.code)+" - "+e._s(e.currCodeDescription(t.code))+" ")]):e._e()],1),r("td",[e.isBagrutReward(t.code)?r("router-link",{attrs:{title:"מעבר לגמולי בגרות",to:{name:"AdditionalRewards"},target:"_blank"},nativeOn:{click:function(t){return e.beforeOpenRewards(t)}}},[e._v(" "+e._s(t.hours)+" ")]):e._e(),e.isJobReward(t.code)?r("router-link",{attrs:{title:"מעבר לגמולי שעות",to:{name:"jobRewards"},target:"_blank"},nativeOn:{click:function(t){return e.beforeOpenRewards(t)}}},[e._v(" "+e._s(t.hours)+" ")]):e._e(),e.isRewradHours(t.code)?e._e():r("input",{directives:[{name:"model",rawName:"v-model",value:t.hours,expression:"row.hours"}],attrs:{id:"hours",type:"number",min:"0",step:"0.1",disabled:t.code<=0||t.type!=e.frontalConst||e.isRewradHours(t.code)},domProps:{value:t.hours},on:{input:[function(r){r.target.composing||e.$set(t,"hours",r.target.value)},function(t){return e.getPauseAndPrivateHours()}]}})],1),r("td",{staticClass:"disableStyle"}),e._l(t.week,(function(s,o){return r("td",{key:o},[r("input",{directives:[{name:"model",rawName:"v-model",value:t.week[o],expression:"row.week[index2]"}],attrs:{type:"number",min:"0",step:"0.1",disabled:t.hours<=0},domProps:{value:t.week[o]},on:{input:function(r){r.target.composing||e.$set(t.week,o,r.target.value)}}})])})),r("td",{staticClass:"disableStyle",style:{color:0==e.validRowsHours(t)?"red":"inherit"}},[e._v(" "+e._s(e.getTwoDigits(e.leftHours(t)))+" ")])],2)})),r("tr",{staticClass:"summaryRow"},[r("td"),r("td",[e._v("סך")]),r("td",[e._v("--")]),r("td",[e._v(e._s(e.hoursAmount()))]),r("td",[e._v(" "+e._s(e.getTwoDigits(this.calcJobPercent(this.reformType,this.hoursAmount(),this.ageHours,this.isMother)))+"% ")]),e._l(parseInt(6),(function(t,s){return r("td",{key:s},[e._v(" "+e._s(e.dayAmount(t-1))+" ")])})),r("td",{style:{color:0==e.validTotalHours()?"red":"inherit"}},[e._v(" "+e._s(e.getTwoDigits(e.leftTableHours()))+" ")])],2)],2)]),r("v-row",{staticClass:"center",staticStyle:{"margin-top":"auto","margin-bottom":"auto"}},[r("v-btn",{staticClass:"myBtn",attrs:{color:"primary"},on:{click:function(t){return e.saveHours()}}},[e._v("שמור שעות")]),r("v-btn",{staticClass:"myBtn",attrs:{color:""},on:{click:function(t){return e.cleanWeeklyData()}}},[e._v("נקה")])],1)],1):e._e()},m=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("thead",[r("tr",[r("th"),r("th",[e._v("סוג")]),r("th",[e._v("קוד פיצול")]),r("th",[e._v("שעות")]),r("th",[e._v("אחוז משרה")]),r("th",[e._v("א'")]),r("th",[e._v("ב'")]),r("th",[e._v("ג'")]),r("th",[e._v("ד'")]),r("th",[e._v("ה'")]),r("th",[e._v("ו'")]),r("th",[e._v("הפרש")])])])}],h=(r("a630"),r("d81d"),r("a434"),r("d3b7"),r("6062"),r("3ca3"),r("ddb0"),r("56d7")),p={data:function(){return{}},methods:{calcJobPercent:function(e,t,r,s){return 0==t?0:1==e||7==e?this.getOlamYashanJobPercent(r,s,t):2==e?this.getOfekHasashJobPercent(r,s,t):5==e?this.getOzLetmuraJobPercent(r,s,t):8==e?this.getMinhalaJobPercent(r,s,t):void 0},getOlamYashanJobPercent:function(e,t,r){var s=0,o=24;return o-=e,s=r/o*100,t&&(s*=1.1),s},getOfekHasashJobPercent:function(e,t,r){var s=0,o=36;return o-=e,t&&(o-=2),s=r/o*100,s},getOzLetmuraJobPercent:function(e,t,r){var s=0,o=40;return o-=e,s=r/o*100,t&&(s*=1.07),s},getMinhalaJobPercent:function(e,t,r){var s=0,o=20;return s=r/o*100,s}}},v=1,g=2,y=3,w={name:"weeklyHours",props:["empId","reformType","isMother","ageHours","existData","begda","endda","codeDescription","jobRewardTypes","rewardsHours"],data:function(){return{newHours:[],tableBegda:"",tableEndda:"",datesRange:{min:"",max:""},tableToSave:[],tablesArray:[],empOptions:[],reformTypes:[],frontalCodes:[],frontalConst:v}},mounted:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.initilizer(),t.next=3,e.getEmployeeOptions();case 3:e.setFrontalCodes(),e.setBegdaEndda(),e.setExistData(),e.setExistRewards(),e.getPauseAndPrivateHours(),e.setPrivateAndPauseCodes(e.newHours.find((function(e){return e.type==v})).code),e.sortTable();case 10:case"end":return t.stop()}}),t)})))()},methods:{initilizer:function(){this.newHours=[],5==this.reformType||2==this.reformType?this.newHours=[{type:v,hours:0,code:"",week:[0,0,0,0,0,0]},{type:g,hours:0,code:"",week:[0,0,0,0,0,0]},{type:y,hours:0,code:"",week:[0,0,0,0,0,0]}]:this.newHours=[{type:v,hours:0,code:"",week:[0,0,0,0,0,0]}]},getPauseAndPrivateHours:function(){if(2==this.reformType||5==this.reformType){var e=Math.round(this.newHours.filter((function(e){return e.type==v})).reduce((function(e,t){return e+parseFloat(t.hours)}),0));e<=0||(this.newHours.find((function(e){return e.type==y})).hours=this.empOptions.find((function(t){return t.frontalHours==e})).pauseHours,this.newHours.find((function(e){return e.type==g})).hours=this.empOptions.find((function(t){return t.frontalHours==e})).privateHours)}},getEmployeeOptions:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,d.a.get("/calcHours/options",{params:{reformType:e.reformType,empId:e.empId}}).then((function(t){e.empOptions=t.data})).catch((function(t){return e.$store.dispatch("displayErrorMessage",{error:t})}));case 2:case"end":return t.stop()}}),t)})))()},setNewHoursForSave:function(){var e=this;this.tableToSave=[],this.newHours.forEach((function(t){t.week.forEach((function(r,s){e.tableToSave.push({empId:e.empId,mossadId:e.$store.state.logginAs,changedBy:e.$store.state.username,empCode:t.code,begda:new Date(e.begda),endda:new Date(e.endda),day:s,hours:r})}))}))},onCodeSelect:function(e){e.hours=0,this.isRewradHours(e.code)&&(e.hours=this.rewardsHours.filter((function(t){return t.employmentCode==e.code})).reduce((function(e,t){return e+parseFloat(t.hours)}),0),this.getPauseAndPrivateHours()),this.setPrivateAndPauseCodes(e.code)},beforeOpenRewards:function(){this.$store.dispatch("setEmpId",this.empId),this.$store.dispatch("setSelectedYear",new Date(this.endda).getFullYear())},setPrivateAndPauseCodes:function(e){2!=this.reformType&&5!=this.reformType||""==e||(5==this.reformType?(this.newHours.find((function(e){return e.type==g})).code=9601,this.newHours.find((function(e){return e.type==y})).code=9602):2==this.reformType&&(this.newHours.find((function(e){return e.type==y})).code=5468,this.newHours.find((function(e){return e.type==g})).code=5467))},setExistData:function(){var e,t=this,r={};this.existData.forEach((function(s){e=t.codeDescription.find((function(e){return e.code==s.empCode})).hourType,e==v&&""!=t.newHours.find((function(t){return t.type==e})).code?void 0==t.newHours.find((function(e){return e.code==s.empCode}))?(r={type:v,hours:0,code:s.empCode,week:[0,0,0,0,0,0]},t.isRewradHours(s.empCode)||(r.hours=s.hours),r.week[s.day]=s.hours,t.newHours.push(r)):(t.isRewradHours(s.empCode)||(t.newHours.find((function(e){return e.code==s.empCode})).hours+=s.hours),t.newHours.find((function(e){return e.code==s.empCode})).week[s.day]+=s.hours):(t.isRewradHours(s.empCode)||(t.newHours.find((function(t){return t.type==e})).hours+=s.hours),t.newHours.find((function(t){return t.type==e})).week[s.day]=s.hours,t.newHours.find((function(t){return t.type==e})).code=s.empCode)}))},setExistRewards:function(){var e=this,t=0,r={};Array.from(new Set(this.rewardsHours.map((function(e){return e.employmentCode})))).forEach((function(s){t=e.rewardsHours.filter((function(e){return e.employmentCode==s})).reduce((function(e,t){return e+parseFloat(t.hours)}),0).toFixed(2),0==t||(""==e.newHours.find((function(e){return e.type==v})).code?(e.newHours.find((function(e){return e.type==v})).hours+=1*t,e.newHours.find((function(e){return e.type==v})).code=s):(r=e.newHours.find((function(e){return e.code==s})),r?r.hours=t:e.newHours.push({code:s,hours:t,type:1,week:[0,0,0,0,0,0]})))}))},relevantCodes:function(e){var t=this;return this.frontalCodes.filter((function(r){return!t.newHours.map((function(e){return e.code})).includes(r.code)||r.code==e.code}))},removeRow:function(e){0!==e&&this.newHours[e].type==v&&(this.newHours.splice(e,1),this.getPauseAndPrivateHours())},addNewRow:function(){this.newHours.push({type:v,hours:0,code:"",week:[0,0,0,0,0,0]}),this.sortTable()},sortTable:function(){this.newHours.sort((function(e,t){return e.type-t.type}))},setBegdaEndda:function(){this.tableBegda=this.FormatDate(this.begda),this.tableEndda=this.FormatDate(this.endda)},FormatDate:function(e){var t,r=new Date(e),s=r.getFullYear(),o=0,n=0;return o+=r.getMonth()+1,o<10&&(o="0"+o),r.getDate()<10&&(n="0"),n+=r.getDate(),t=s+"-"+o+"-"+n,t},isNumber:function(e){return!isNaN(parseFloat(e))&&!isNaN(e-0)},getTwoDigits:function(e){return isNaN(e)||0==e?0:parseFloat(e).toFixed(2)},currCodeDescription:function(e){return void 0!=e&&e>0?void 0===this.codeDescription.find((function(t){return t.code==e}))?"":this.codeDescription.find((function(t){return t.code==e})).codeDescription:""},saveHours:function(){var e=this,t=!0;if(this.newHours.forEach((function(r){0!=e.validRowsHours(r)||(t=!1)})),0==t)return alert("יש למלא שעות תקינות"),!1;this.setNewHoursForSave(),d()({url:"/teacherEmploymentDetails/saveAll",method:"post",data:this.tableToSave}).then((function(){alert("הנתונים נשמרו בהצלחה"),h["bus"].$emit("changeWeeklyHours")})).catch((function(t){e.$store.dispatch("displayErrorMessage",{error:t})}))},convertReformDescription:function(e){return e==g?"פרטני":e==y?"שהייה":"פרונטלי"},validRowsHours:function(e){return void 0==e.hours||0==this.leftHours(e)},validTotalHours:function(){return 0==this.leftTableHours()},leftHours:function(e){var t=e.week;return parseFloat(t.reduce((function(e,t){return parseFloat(e)+parseFloat(t)}),0))-e.hours},leftTableHours:function(){var e=this;return this.newHours.reduce((function(t,r){return parseFloat(t)+e.leftHours(r)}),0)},hoursAmount:function(){var e=this;return this.newHours.filter((function(t){return e.isNumber(t.hours)})).reduce((function(e,t){return parseFloat(e)+parseFloat(t.hours)}),0).toFixed(2)},dayAmount:function(e){return this.newHours.reduce((function(t,r){return parseFloat(t)+parseFloat(r.week[e])}),0)},cleanWeeklyData:function(){this.newHours.forEach((function(e){e.hours=0,e.week=[0,0,0,0,0,0]}))},setFrontalCodes:function(){var e=this;this.frontalCodes=this.codeDescription.filter((function(t){return(t.hourType==v||0==t.hourType)&&!e.newHours.find((function(e){return e.code==t.code}))}))},isRewradHours:function(e){return this.isBagrutReward(e)||this.isJobReward(e)},isBagrutReward:function(e){return 9671==e||2598==e},isJobReward:function(e){var t=this.jobRewardTypes.find((function(t){return t.employmentCode==e}));return void 0!=t}},mixins:[p]},b=w,H=(r("37c3"),r("2877")),I=r("6544"),_=r.n(I),x=r("c6a6"),T=r("8336"),D=r("132d"),R=r("0fd9"),k=Object(H["a"])(b,f,m,!1,null,"bd1d4742",null),E=k.exports;_()(k,{VAutocomplete:x["a"],VBtn:T["a"],VIcon:D["a"],VRow:R["a"]});var C={name:"weeklyHours",props:["empId","reformType","isMother","ageHours","selectedYear","codeDescription","existData","jobRewardTypes","rewardsHours"],components:{weeklyHoursTable:E},data:function(){return{datesRange:{min:"",max:""},tablesArray:[],reformTypes:[]}},created:function(){this.getReformTypes()},mounted:function(){this.setBegdaEndda(),this.gruopByBegdaEndda()},methods:{gruopByBegdaEndda:function(){var e=this;this.tablesArray=[],this.existData.forEach((function(t){var r=e.tablesArray.find((function(r){return r.begda==e.FormatDate(t.begda)&&r.endda==e.FormatDate(t.endda)}));null!=r?r.data.push(t):e.tablesArray.push({begda:e.FormatDate(t.begda),endda:e.FormatDate(t.endda),data:[t]})})),this.setDefualtValues()},getReformTypes:function(){var e=this;d.a.get("/reformTypes/relevant").then((function(t){e.reformTypes=t.data})).catch((function(t){return e.$store.dispatch("displayErrorMessage",{error:t})}))},setBegdaEndda:function(){this.datesRange.min=new Date(this.selectedYear-1,8,1),this.datesRange.max=new Date(this.selectedYear,5,20)},setDefualtValues:function(){0==this.tablesArray.length&&this.tablesArray.push({begda:this.FormatDate(this.datesRange.min),endda:this.FormatDate(this.datesRange.max),data:[]})},addWeeklHoursTable:function(){var e=new Date(this.tablesArray.reduce((function(e,t){return e.endda>t.endda?e:t})).endda);e.setDate(e.getDate()+1),e<this.datesRange.max?this.tablesArray.push({begda:this.FormatDate(e),endda:this.FormatDate(this.datesRange.max),data:[]}):alert("אין אפשרות ליצור יותר מרושמה אחת על תאריכים חופפים")},removeWeeklHoursTable:function(){this.tablesArray.pop()},setDatesIfChange:function(e){(e.endda>this.FormatDate(this.datesRange.max)||e.endda<this.FormatDate(this.datesRange.min))&&(e.endda=this.FormatDate(this.datesRange.max)),(e.begda>this.FormatDate(this.datesRange.max)||e.begda<this.FormatDate(this.datesRange.min))&&(e.begda=this.FormatDate(this.datesRange.min))},FormatDate:function(e){var t,r=new Date(e),s=r.getFullYear(),o=0,n=0;return o+=r.getMonth()+1,o<10&&(o="0"+o),r.getDate()<10&&(n="0"),n+=r.getDate(),t=s+"-"+o+"-"+n,t}},computed:{_reformDiscription:function(){var e=this,t=this.reformTypes.find((function(t){return t.reformId==e.reformType}));return void 0!=t?t.name:""}}},F=C,A=(r("e8ec"),r("8654")),P=Object(H["a"])(F,c,l,!1,null,"95600fbe",null),M=P.exports;_()(P,{VTextField:A["a"]});var Y=r("87cf"),$={name:"setEmployeesHours",components:{weeklyHours:M},data:function(){return{selectedReforms:[],selectedYear:0,empId:null,ageHours:0,tzArray:[],datesRange:{min:"",max:""},employeeInfo:{},existData:[],reformTypes:[],workInReforms:[],codeDescription:[],empHoursTable:[],jobRewardTypes:[],years:[],mossadot:[],rewardsHours:[],mossadInfo:{mossadId:"",mossadName:"",maxHours:0,currHours:0},hoverText:"",compId:0,estinateJobPercent:0,circleProgress:!1}},created:function(){this.getAllTz(),this.getCodeDescription(),this.getMossadot(),this.getReformTypes(),this.getMossadHours(),this.getBagrutRewardsTypes()},mounted:function(){var e=this;this.initilize(),h["bus"].$on("changeWeeklyHours",Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.getAllEmpData(),t.next=3,e.getMossadHours();case 3:case"end":return t.stop()}}),t)}))))},computed:{_getAge:function(){if(!this.isNotEmpty(this.employeeInfo)){var e=new Date,t=new Date(this.employeeInfo.birthDate),r=0,s=e.getFullYear()-t.getFullYear();return e.getUTCMonth()<t.getUTCMonth()&&(s-=1),r=e.getUTCMonth()-t.getUTCMonth(),r<0&&(r*=-1),r<10&&(r="0"+r),s+"."+r}},formatIsMother:function(){if(!this.isNotEmpty(this.employeeInfo))return!0===this.employeeInfo.mother?"כן":"לא"},_getAgeHours:function(){if(!this.isNotEmpty(this.employeeInfo)){var e=new Date(this.employeeInfo.birthDate),t=new Date,r=new Date(t.getFullYear(),8,1);t.getMonth()>=8&&r.setFullYear(r.getFullYear()+1);var s=r.getFullYear()-e.getFullYear();return s<50?0:s>55?4:2}},_mossadInfo:function(){return this.mossadInfo}},methods:{initilize:function(){if(0!=this.$store.state.selectedYear)this.selectedYear=this.$store.state.selectedYear;else{var e=new Date;this.selectedYear=e.getMonth()>=8?e.getFullYear()+1:e.getFullYear()}0!=this.$store.state.empId&&(this.empId=this.$store.state.empId,this.getEmployeeInfo()),this.mossadInfo.mossadId=this.$store.state.mossadId,this.mossadInfo.mossadName=this.$store.state.mossadInfo.mossadName,this.years=[{year:2021,hebrewYear:'תשפ"א'},{year:2022,hebrewYear:'תשפ"ב'},{year:2023,hebrewYear:'תשפ"ג'},{year:2024,hebrewYear:'תשפ"ד'},{year:2025,hebrewYear:'תשפ"ה'}],this.empHoursTable=[{week:[],sum:0,jobPercent:0,type:0},{week:[],sum:0,jobPercent:0,type:1}];for(var t=0;t<6;t++)this.empHoursTable[0].week.push({day:t,hours:0,mossadot:[]}),this.empHoursTable[1].week.push({day:t,hours:0,mossadot:[]});this.setBegdaEndda(),this.compId=0},onYearChanged:function(){this.$store.dispatch("setSelectedYear",this.selectedYear),this.getEmployeeInfo(),this.setBegdaEndda(),this.getMossadHours()},getAllTz:function(){var e=this;d.a.get("/employees/all").then((function(t){e.tzArray=t.data,0!=e.$store.state.empId&&(e.empId=e.tzArray.find((function(t){return t.empId==e.$store.state.empId})).empId)})).catch((function(t){return e.$store.dispatch("displayErrorMessage",{error:t})}))},getEmployeeInfo:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.circleProgress=!0,e.$store.dispatch("setEmpId",e.empId),t.next=4,d.a.get("/employees/byId",{params:{empId:e.empId}}).then((function(t){e.employeeInfo=t.data})).catch((function(t){return e.$store.dispatch("displayErrorMessage",{error:t})}));case 4:return e.calcAgeHours(),t.next=7,e.getAllEmpData();case 7:setTimeout((function(){return e.circleProgress=!1}),1e3);case 8:case"end":return t.stop()}}),t)})))()},getMossadHours:function(){var e=this;d.a.get("mossadHours/byId",{params:{mossadId:this.$store.state.logginAs,year:this.selectedYear}}).then((function(t){e.mossadInfo.currHours=t.data.currHours,e.mossadInfo.maxHours=t.data.maxHours})).catch((function(){e.mossadInfo.currHours=0,e.mossadInfo.maxHours=0,alert("לא נמצאו נתונים עבור מוסד בשנה זו בחר שנה אחרת או הוסף שעות למוסד")}))},getReformTypes:function(){var e=this;d.a.get("/reformTypes/relevant").then((function(t){e.reformTypes=t.data,e.filterReformTypeByMossad()})).catch((function(t){return e.$store.dispatch("displayErrorMessage",{error:t})}))},getCodeDescription:function(){var e=this;d.a.get("/convertHours/all").then((function(t){e.codeDescription=t.data})).catch((function(t){return e.$store.dispatch("displayErrorMessage",{error:t})}))},getAllEmpData:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(null!=e.empId&&""!=e.empId){t.next=2;break}return t.abrupt("return");case 2:return t.next=4,d.a.get("/teacherEmploymentDetails/byId",{params:{empId:e.empId,begda:e.datesRange.min,endda:e.datesRange.max}}).then((function(t){e.existData=t.data})).catch((function(t){return e.$store.dispatch("displayErrorMessage",{error:t})}));case 4:return t.next=6,d.a.get("/teachersRewards/byEmpIdAndMossadAndYear",{params:{empId:e.empId,mossadId:e.$store.state.logginAs,year:e.selectedYear}}).then((function(t){e.rewardsHours=t.data})).catch((function(t){e.$store.dispatch("displayErrorMessage",{error:t})}));case 6:e.calcEmpHoursData(),e.getEstemateJobPercent(),e.compId+=1;case 9:case"end":return t.stop()}}),t)})))()},getBagrutRewardsTypes:function(){var e=this;d.a.get("jobRewards/all").then((function(t){e.jobRewardTypes=t.data})).catch((function(t){e.$store.dispatch("displayErrorMessage",{error:t})}))},getEstemateJobPercent:function(){var e=this;d.a.get("/jobPercent/byId",{params:{empId:this.empId,mossadId:this.$store.state.logginAs,year:this.selectedYear}}).then((function(t){t.data,t.data?e.estinateJobPercent=t.data.jobPercent:e.estinateJobPercent=0,e.estinateJobPercent>e.empHoursTable[1].week[5].hours&&alert("יש לעדכן אחוז קביעות לעובד זה")})).catch((function(t){return e.$store.dispatch("displayErrorMessage",{error:t})}))},setBegdaEndda:function(){this.datesRange.min=this.formatDate(new Date(this.selectedYear-1,8,1)),this.datesRange.max=this.formatDate(new Date(this.selectedYear,5,21))},formatDate:function(e){var t,r=new Date(e),s=r.getFullYear(),o=0,n=0;return o+=r.getMonth()+1,o<10&&(o="0"+o),r.getDate()<10&&(n="0"),n+=r.getDate(),t=s+"-"+o+"-"+n,t},exportEmployeeWeeklyHours:function(){this.createWeeklyHoursToEmployee(this.empId,this.$store.state.logginAs,this.datesRange.min,this.datesRange.max)},filterReformTypeByMossad:function(){return 2==this.$store.state.mossadInfo.mossadType?this.reformTypes.filter((function(e){return 1==e.reformId||5==e.reformId||7==e.reformId||2==e.reformId||8==e.reformId})):1==this.$store.state.mossadInfo.mossadType?this.reformTypes.filter((function(e){return 1==e.reformId||5==e.reformId||8==e.reformId})):this.reformTypes},getTwoDigits:function(e){return isNaN(e)?"":parseFloat(e).toFixed(2)},changeText:function(e,t){this.hoverText=this.getMossadotDescription(this.empHoursTable[e].week[t].mossadot)},getMossadotDescription:function(e){var t=this;if(null==e)return"";var r="";return e.forEach((function(e){r+=t.mossadot.find((function(t){return t.mossadId==e})).mossadName+", "})),r},getRelevantCodesDescription:function(e){return this.codeDescription.filter((function(t){return t.reformType==e}))},getRelevantData:function(e){var t=this;return this.existData.filter((function(r){return r.reformType==e&&r.mossadId==t.$store.state.logginAs}))},getRelevantRewardHours:function(e){return this.rewardsHours.filter((function(t){return t.reformId==e}))},getRreformDiscription:function(e){var t=this.reformTypes.find((function(t){return t.reformId==e}));return void 0!=t?t.name:""},getMossadot:function(){var e=this;d.a.get("mossadot/all").then((function(t){return e.mossadot=t.data})).catch((function(t){return e.$store.dispatch("displayErrorMessage",{error:t})}))},calcAgeHours:function(){void 0===this.employeeInfo.birthDate&&(this.ageHours=0);var e=new Date(this.employeeInfo.birthDate),t=new Date,r=new Date(t.getFullYear(),8,1);t.getMonth()>=8&&r.setFullYear(r.getFullYear()+1);var s=r.getFullYear()-e.getFullYear();this.ageHours=s<50?0:s>55?4:2},getRowType:function(e){return 0===e?"במוסד":"בכל המוסדות"},calcEmpHoursData:function(){var e=this;this.workInReforms=[],this.empHoursTable=[{week:[],sum:0,jobPercent:0,type:0},{week:[],sum:0,jobPercent:0,type:1}];for(var t=0;t<6;t++)this.empHoursTable[0].week.push({day:t,hours:0,mossadot:[this.$store.state.logginAs]}),this.empHoursTable[1].week.push({day:t,hours:0,mossadot:[]});this.existData.forEach((function(t){t.mossadId==e.$store.state.logginAs&&(e.empHoursTable[0].week[t.day].hours+=t.hours,e.empHoursTable[0].sum+=t.hours),e.empHoursTable[1].week[t.day].hours+=t.hours,e.empHoursTable[1].sum+=t.hours,e.empHoursTable[1].week[t.day].mossadot.includes(t.mossadId)||e.empHoursTable[1].week[t.day].mossadot.push(t.mossadId),e.workInReforms.includes(t.reformType)||t.mossadId!=e.$store.state.logginAs||0==t.hours||e.workInReforms.push(t.reformType)})),this.empHoursTable[0].sum=this.empHoursTable[0].sum.toFixed(2),this.empHoursTable[1].sum=this.empHoursTable[1].sum.toFixed(2),this.rewardsHours.forEach((function(t){e.workInReforms.includes(t.reformId)||0==t.hours||e.workInReforms.push(t.reformId)})),this.selectedReforms=this.workInReforms,this.reformTypes.forEach((function(t){var r=e.existData.filter((function(r){return r.reformType==t.reformId&&r.mossadId==e.$store.state.logginAs})).reduce((function(e,t){return e+parseFloat(t.hours)}),0).toFixed(2);e.empHoursTable[0].jobPercent+=e.calcJobPercent(t.reformId,r,e.ageHours,e.employeeInfo.mother);var s=e.existData.filter((function(e){return e.reformType==t.reformId})).reduce((function(e,t){return e+parseFloat(t.hours)}),0).toFixed(2);e.empHoursTable[1].jobPercent+=e.calcJobPercent(t.reformId,s,e.ageHours,e.employeeInfo.mother)}))},navToReport:function(){var e=this.$router.resolve({path:"/report/reportWeeklyHours"});window.open(e.href)},isNotEmpty:function(e){for(var t in e)return!1;return!0}},mixins:[Y["a"],p]},S=$,N=(r("b8a2"),r("b0af")),O=r("62ad"),j=r("490a"),B=r("b974"),J=r("3a2f"),z=Object(H["a"])(S,n,a,!1,null,"2b6fd43a",null),V=z.exports;_()(z,{VAutocomplete:x["a"],VCard:N["a"],VCol:O["a"],VIcon:D["a"],VProgressCircular:j["a"],VRow:R["a"],VSelect:B["a"],VTooltip:J["a"]});var W={name:"employeeInfo",components:{setEmployeesHours:V},data:function(){return{}}},U=W,Q=Object(H["a"])(U,s,o,!1,null,"22c0c3f6",null);t["default"]=Q.exports},2532:function(e,t,r){"use strict";var s=r("23e7"),o=r("5a34"),n=r("1d80"),a=r("ab13");s({target:"String",proto:!0,forced:!a("includes")},{includes:function(e){return!!~String(n(this)).indexOf(o(e),arguments.length>1?arguments[1]:void 0)}})},"37c3":function(e,t,r){"use strict";var s=r("fa98"),o=r.n(s);o.a},"3b1e":function(e,t,r){},"408a":function(e,t,r){var s=r("c6b6");e.exports=function(e){if("number"!=typeof e&&"Number"!=s(e))throw TypeError("Incorrect invocation");return+e}},"4df4":function(e,t,r){"use strict";var s=r("0366"),o=r("7b0b"),n=r("9bdd"),a=r("e95a"),i=r("50c4"),u=r("8418"),d=r("35a1");e.exports=function(e){var t,r,c,l,f,m,h=o(e),p="function"==typeof this?this:Array,v=arguments.length,g=v>1?arguments[1]:void 0,y=void 0!==g,w=d(h),b=0;if(y&&(g=s(g,v>2?arguments[2]:void 0,2)),void 0==w||p==Array&&a(w))for(t=i(h.length),r=new p(t);t>b;b++)m=y?g(h[b],b):h[b],u(r,b,m);else for(l=w.call(h),f=l.next,r=new p;!(c=f.call(l)).done;b++)m=y?n(l,g,[c.value,b],!0):c.value,u(r,b,m);return r.length=b,r}},5411:function(e,t,r){},6062:function(e,t,r){"use strict";var s=r("6d61"),o=r("6566");e.exports=s("Set",(function(e){return function(){return e(this,arguments.length?arguments[0]:void 0)}}),o)},6566:function(e,t,r){"use strict";var s=r("9bf2").f,o=r("7c73"),n=r("e2cc"),a=r("0366"),i=r("19aa"),u=r("2266"),d=r("7dd0"),c=r("2626"),l=r("83ab"),f=r("f183").fastKey,m=r("69f3"),h=m.set,p=m.getterFor;e.exports={getConstructor:function(e,t,r,d){var c=e((function(e,s){i(e,c,t),h(e,{type:t,index:o(null),first:void 0,last:void 0,size:0}),l||(e.size=0),void 0!=s&&u(s,e[d],{that:e,AS_ENTRIES:r})})),m=p(t),v=function(e,t,r){var s,o,n=m(e),a=g(e,t);return a?a.value=r:(n.last=a={index:o=f(t,!0),key:t,value:r,previous:s=n.last,next:void 0,removed:!1},n.first||(n.first=a),s&&(s.next=a),l?n.size++:e.size++,"F"!==o&&(n.index[o]=a)),e},g=function(e,t){var r,s=m(e),o=f(t);if("F"!==o)return s.index[o];for(r=s.first;r;r=r.next)if(r.key==t)return r};return n(c.prototype,{clear:function(){var e=this,t=m(e),r=t.index,s=t.first;while(s)s.removed=!0,s.previous&&(s.previous=s.previous.next=void 0),delete r[s.index],s=s.next;t.first=t.last=void 0,l?t.size=0:e.size=0},delete:function(e){var t=this,r=m(t),s=g(t,e);if(s){var o=s.next,n=s.previous;delete r.index[s.index],s.removed=!0,n&&(n.next=o),o&&(o.previous=n),r.first==s&&(r.first=o),r.last==s&&(r.last=n),l?r.size--:t.size--}return!!s},forEach:function(e){var t,r=m(this),s=a(e,arguments.length>1?arguments[1]:void 0,3);while(t=t?t.next:r.first){s(t.value,t.key,this);while(t&&t.removed)t=t.previous}},has:function(e){return!!g(this,e)}}),n(c.prototype,r?{get:function(e){var t=g(this,e);return t&&t.value},set:function(e,t){return v(this,0===e?0:e,t)}}:{add:function(e){return v(this,e=0===e?0:e,e)}}),l&&s(c.prototype,"size",{get:function(){return m(this).size}}),c},setStrong:function(e,t,r){var s=t+" Iterator",o=p(t),n=p(s);d(e,t,(function(e,t){h(this,{type:s,target:e,state:o(e),kind:t,last:void 0})}),(function(){var e=n(this),t=e.kind,r=e.last;while(r&&r.removed)r=r.previous;return e.target&&(e.last=r=r?r.next:e.state.first)?"keys"==t?{value:r.key,done:!1}:"values"==t?{value:r.value,done:!1}:{value:[r.key,r.value],done:!1}:(e.target=void 0,{value:void 0,done:!0})}),r?"entries":"values",!r,!0),c(t)}}},"6d61":function(e,t,r){"use strict";var s=r("23e7"),o=r("da84"),n=r("94ca"),a=r("6eeb"),i=r("f183"),u=r("2266"),d=r("19aa"),c=r("861d"),l=r("d039"),f=r("1c7e"),m=r("d44e"),h=r("7156");e.exports=function(e,t,r){var p=-1!==e.indexOf("Map"),v=-1!==e.indexOf("Weak"),g=p?"set":"add",y=o[e],w=y&&y.prototype,b=y,H={},I=function(e){var t=w[e];a(w,e,"add"==e?function(e){return t.call(this,0===e?0:e),this}:"delete"==e?function(e){return!(v&&!c(e))&&t.call(this,0===e?0:e)}:"get"==e?function(e){return v&&!c(e)?void 0:t.call(this,0===e?0:e)}:"has"==e?function(e){return!(v&&!c(e))&&t.call(this,0===e?0:e)}:function(e,r){return t.call(this,0===e?0:e,r),this})};if(n(e,"function"!=typeof y||!(v||w.forEach&&!l((function(){(new y).entries().next()})))))b=r.getConstructor(t,e,p,g),i.REQUIRED=!0;else if(n(e,!0)){var _=new b,x=_[g](v?{}:-0,1)!=_,T=l((function(){_.has(1)})),D=f((function(e){new y(e)})),R=!v&&l((function(){var e=new y,t=5;while(t--)e[g](t,t);return!e.has(-0)}));D||(b=t((function(t,r){d(t,b,e);var s=h(new y,t,b);return void 0!=r&&u(r,s[g],{that:s,AS_ENTRIES:p}),s})),b.prototype=w,w.constructor=b),(T||R)&&(I("delete"),I("has"),p&&I("get")),(R||x)&&I(g),v&&w.clear&&delete w.clear}return H[e]=b,s({global:!0,forced:b!=y},H),m(b,e),v||r.setStrong(b,e,p),b}},"9bdd":function(e,t,r){var s=r("825a"),o=r("2a62");e.exports=function(e,t,r,n){try{return n?t(s(r)[0],r[1]):t(r)}catch(a){throw o(e),a}}},a434:function(e,t,r){"use strict";var s=r("23e7"),o=r("23cb"),n=r("a691"),a=r("50c4"),i=r("7b0b"),u=r("65f0"),d=r("8418"),c=r("1dde"),l=r("ae40"),f=c("splice"),m=l("splice",{ACCESSORS:!0,0:0,1:2}),h=Math.max,p=Math.min,v=9007199254740991,g="Maximum allowed length exceeded";s({target:"Array",proto:!0,forced:!f||!m},{splice:function(e,t){var r,s,c,l,f,m,y=i(this),w=a(y.length),b=o(e,w),H=arguments.length;if(0===H?r=s=0:1===H?(r=0,s=w-b):(r=H-2,s=p(h(n(t),0),w-b)),w+r-s>v)throw TypeError(g);for(c=u(y,s),l=0;l<s;l++)f=b+l,f in y&&d(c,l,y[f]);if(c.length=s,r<s){for(l=b;l<w-s;l++)f=l+s,m=l+r,f in y?y[m]=y[f]:delete y[m];for(l=w;l>w-s+r;l--)delete y[l-1]}else if(r>s)for(l=w-s;l>b;l--)f=l+s-1,m=l+r-1,f in y?y[m]=y[f]:delete y[m];for(l=0;l<r;l++)y[l+b]=arguments[l+2];return y.length=w-s+r,c}})},a630:function(e,t,r){var s=r("23e7"),o=r("4df4"),n=r("1c7e"),a=!n((function(e){Array.from(e)}));s({target:"Array",stat:!0,forced:a},{from:o})},b680:function(e,t,r){"use strict";var s=r("23e7"),o=r("a691"),n=r("408a"),a=r("1148"),i=r("d039"),u=1..toFixed,d=Math.floor,c=function(e,t,r){return 0===t?r:t%2===1?c(e,t-1,r*e):c(e*e,t/2,r)},l=function(e){var t=0,r=e;while(r>=4096)t+=12,r/=4096;while(r>=2)t+=1,r/=2;return t},f=u&&("0.000"!==8e-5.toFixed(3)||"1"!==.9.toFixed(0)||"1.25"!==1.255.toFixed(2)||"1000000000000000128"!==(0xde0b6b3a7640080).toFixed(0))||!i((function(){u.call({})}));s({target:"Number",proto:!0,forced:f},{toFixed:function(e){var t,r,s,i,u=n(this),f=o(e),m=[0,0,0,0,0,0],h="",p="0",v=function(e,t){var r=-1,s=t;while(++r<6)s+=e*m[r],m[r]=s%1e7,s=d(s/1e7)},g=function(e){var t=6,r=0;while(--t>=0)r+=m[t],m[t]=d(r/e),r=r%e*1e7},y=function(){var e=6,t="";while(--e>=0)if(""!==t||0===e||0!==m[e]){var r=String(m[e]);t=""===t?r:t+a.call("0",7-r.length)+r}return t};if(f<0||f>20)throw RangeError("Incorrect fraction digits");if(u!=u)return"NaN";if(u<=-1e21||u>=1e21)return String(u);if(u<0&&(h="-",u=-u),u>1e-21)if(t=l(u*c(2,69,1))-69,r=t<0?u*c(2,-t,1):u/c(2,t,1),r*=4503599627370496,t=52-t,t>0){v(0,r),s=f;while(s>=7)v(1e7,0),s-=7;v(c(10,s,1),0),s=t-1;while(s>=23)g(1<<23),s-=23;g(1<<s),v(1,1),g(2),p=y()}else v(0,r),v(1<<-t,0),p=y()+a.call("0",f);return f>0?(i=p.length,p=h+(i<=f?"0."+a.call("0",f-i)+p:p.slice(0,i-f)+"."+p.slice(i-f))):p=h+p,p}})},b8a2:function(e,t,r){"use strict";var s=r("5411"),o=r.n(s);o.a},bb2f:function(e,t,r){var s=r("d039");e.exports=!s((function(){return Object.isExtensible(Object.preventExtensions({}))}))},caad:function(e,t,r){"use strict";var s=r("23e7"),o=r("4d64").includes,n=r("44d2"),a=r("ae40"),i=a("indexOf",{ACCESSORS:!0,1:0});s({target:"Array",proto:!0,forced:!i},{includes:function(e){return o(this,e,arguments.length>1?arguments[1]:void 0)}}),n("includes")},e8ec:function(e,t,r){"use strict";var s=r("3b1e"),o=r.n(s);o.a},f183:function(e,t,r){var s=r("d012"),o=r("861d"),n=r("5135"),a=r("9bf2").f,i=r("90e3"),u=r("bb2f"),d=i("meta"),c=0,l=Object.isExtensible||function(){return!0},f=function(e){a(e,d,{value:{objectID:"O"+ ++c,weakData:{}}})},m=function(e,t){if(!o(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!n(e,d)){if(!l(e))return"F";if(!t)return"E";f(e)}return e[d].objectID},h=function(e,t){if(!n(e,d)){if(!l(e))return!0;if(!t)return!1;f(e)}return e[d].weakData},p=function(e){return u&&v.REQUIRED&&l(e)&&!n(e,d)&&f(e),e},v=e.exports={REQUIRED:!1,fastKey:m,getWeakData:h,onFreeze:p};s[d]=!0},fa98:function(e,t,r){}}]);
//# sourceMappingURL=chunk-51d17316.09b4044a.js.map