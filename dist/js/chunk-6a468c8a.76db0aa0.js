(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6a468c8a"],{"159b":function(e,t,s){var n=s("da84"),r=s("fdbc"),a=s("17c2"),i=s("9112");for(var o in r){var c=n[o],l=c&&c.prototype;if(l&&l.forEach!==a)try{i(l,"forEach",a)}catch(u){l.forEach=a}}},"17c2":function(e,t,s){"use strict";var n=s("b727").forEach,r=s("a640"),a=s("ae40"),i=r("forEach"),o=a("forEach");e.exports=i&&o?[].forEach:function(e){return n(this,e,arguments.length>1?arguments[1]:void 0)}},"2bfd":function(e,t,s){},4160:function(e,t,s){"use strict";var n=s("23e7"),r=s("17c2");n({target:"Array",proto:!0,forced:[].forEach!=r},{forEach:r})},"4de4":function(e,t,s){"use strict";var n=s("23e7"),r=s("b727").filter,a=s("1dde"),i=s("ae40"),o=a("filter"),c=i("filter");n({target:"Array",proto:!0,forced:!o||!c},{filter:function(e){return r(this,e,arguments.length>1?arguments[1]:void 0)}})},"7db0":function(e,t,s){"use strict";var n=s("23e7"),r=s("b727").find,a=s("44d2"),i=s("ae40"),o="find",c=!0,l=i(o);o in[]&&Array(1)[o]((function(){c=!1})),n({target:"Array",proto:!0,forced:c||!l},{find:function(e){return r(this,e,arguments.length>1?arguments[1]:void 0)}}),a(o)},"87cf":function(e,t,s){"use strict";s("4de4"),s("7db0"),s("4160"),s("a15b"),s("d81d"),s("159b"),s("96cf");var n=s("1da1"),r=s("1146"),a=s.n(r),i=s("bc3a"),o=s.n(i);t["a"]={name:"excelMixin",data:function(){return{localMossadId:null,allEmpsInfo:[],codeDescription:[],empsHours:[],dataToExport:[]}},methods:{createWeeklyHoursToMossad:function(e,t,s){var r=this;return Object(n["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,r.getCodesDescription();case 2:return n.next=4,r.getAllEmpInfo(e,t,s);case 4:return n.next=6,r.getAllEmpHours(e,t,s);case 6:return n.next=8,r.setWeeklyHoursAndExport(e);case 8:r.dataToExport=[],r.allEmpsInfo=[],r.empsHours=[];case 11:case"end":return n.stop()}}),n)})))()},createWeeklyHoursToEmployee:function(e,t,s,r){var a=this;return Object(n["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,a.getCodesDescription();case 2:return n.next=4,a.getEmpInfo(e,t,s,r);case 4:return n.next=6,a.getEmpHours(e,t,s,r);case 6:return n.next=8,a.setWeeklyHoursAndExport(t);case 8:a.dataToExport=[],a.allEmpsInfo=[],a.empsHours=[];case 11:case"end":return n.stop()}}),n)})))()},setWeeklyHoursAndExport:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function s(){var n;return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return n="",s.next=3,o.a.get("/mossadot/byId",{params:{mossadId:e}}).then((function(e){n=e.data.mossadName})).catch((function(e){return t.$store.dispatch("displayErrorMessage",{error:e})}));case 3:t.allEmpsInfo.forEach((function(s){t.setExistHours(s,t.empsHours.filter((function(e){return e.empId==s.empId})),e,n)})),t.setDataForDisplay(t.dataToExport),t.downloadFile(t.dataToExport,t.getWeeklyHoursHeaders(),"מצבת שעות.xlsx","מערכת שעות פרונטליות");case 6:case"end":return s.stop()}}),s)})))()},getEmpHours:function(e,t,s,r){var a=this;return Object(n["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,o.a.get("/teacherEmploymentDetails/byMossad",{params:{empId:e,mossadId:t,begda:s,endda:r}}).then((function(e){a.empsHours=e.data})).catch((function(e){return a.$store.dispatch("displayErrorMessage",{error:e})}));case 2:case"end":return n.stop()}}),n)})))()},getEmpInfo:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function s(){return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:return s.next=2,o.a.get("/employees/byId",{params:{empId:e}}).then((function(e){t.allEmpsInfo.push(e.data)})).catch((function(e){return t.$store.dispatch("displayErrorMessage",{error:e})}));case 2:case"end":return s.stop()}}),s)})))()},getAllEmpInfo:function(e,t,s){var r=this;return Object(n["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,o.a.get("/employees/byMossad",{params:{mossadId:e,begda:t,endda:s}}).then((function(e){r.allEmpsInfo=e.data})).catch((function(e){return r.$store.dispatch("displayErrorMessage",{error:e})}));case 2:case"end":return n.stop()}}),n)})))()},getAllEmpHours:function(e,t,s){var r=this;return Object(n["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,o.a.get("/teacherEmploymentDetails/allByMossad",{params:{mossadId:e,begda:t,endda:s}}).then((function(e){r.empsHours=e.data})).catch((function(e){return r.$store.dispatch("displayErrorMessage",{error:e})}));case 2:case"end":return n.stop()}}),n)})))()},getCodesDescription:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,o.a.get("/convertHours/all").then((function(t){e.codeDescription=t.data})).catch((function(t){return e.$store.dispatch("displayErrorMessage",{error:t})}));case 2:case"end":return t.stop()}}),t)})))()},downloadDemoFile:function(){var e=[];this.downloadFile(e,this.getWeeklyHoursHeaders(),"מצבת שעות.xlsx","מערכת שעות פרונטליות")},downloadFile:function(e,t,s,n){var r=e;r.unshift(t);var i=a.a.utils.json_to_sheet(r,{skipHeader:!0,Views:[{RTL:!0}]}),o=a.a.utils.book_new();a.a.utils.book_append_sheet(o,i,n),this.set_right_to_left(o),a.a.writeFile(o,s)},set_right_to_left:function(e){e.Workbook||(e.Workbook={}),e.Workbook.Views||(e.Workbook.Views=[]),e.Workbook.Views[0]||(e.Workbook.Views[0]={},e.Workbook.Views[0].RTL=!0)},setExistHours:function(e,t,s,n){var r=this,a={},i=[];t.forEach((function(t){void 0==i.find((function(e){return e.code==t.empCode&&e.begda==t.begda&&e.endda==t.endda}))&&(a={empId:e.empId,lastName:e.lastName,firstName:e.firstName,ageHours:r.getAgeHours(e.birthDate),isMother:r.getIsMother(e.mother),code:t.empCode,codeDescription:r.codeDescription.find((function(e){return e.code==t.empCode})).codeDescription,mossadId:s+"100",mossadName:n,begda:t.begda,endda:t.endda,Sunday:0,Monday:0,Tuesday:0,Wednesday:0,Thursday:0,Friday:0,totalHours:0,reformType:r.getReformType(t.empCode),systemMessages:""},i.push(a)),r.setHoursInDay(i.find((function(e){return e.code==t.empCode&&e.begda==t.begda&&e.endda==t.endda})),t.day,t.hours)})),this.dataToExport.push.apply(this.dataToExport,i)},sortWeeklyhoursTable:function(e){e.sort((function(e,t){return e.empCode-t.empCode}))},getWeeklyHoursHeaders:function(){var e={empId:"מספר עובד",lastName:"שם משפחה",firstName:"שם פרטי",ageHours:"שעות גיל",isMother:"מורה אם",code:"פיצול",codeDescription:"תאור פיצול",mossadId:"מוסד",mossadName:"שם מוסד",begda:"מתאריך",endda:"עד תאריך",Sunday:"א'",Monday:"ב'",Tuesday:"ג'",Wednesday:"ד",Thursday:"ה'",Friday:"ו'",totalHours:'סה"כ שעות פרונטליות',reformType:"רפורמה",systemMessages:"הערות מערכת"};return e},setDataForDisplay:function(e){var t=this;e.forEach((function(e){e.begda=t.formattedDate(e.begda),e.endda=t.formattedDate(e.endda)}))},setHoursInDay:function(e,t,s){0==t?e.Sunday+=s:1==t?e.Monday+=s:2==t?e.Tuesday+=s:3==t?e.Wednesday+=s:4==t?e.Thursday+=s:5==t&&(e.Friday+=s),e.totalHours+=s},formattedDate:function(e){var t=new Date(e);return[t.getDate(),t.getMonth()+1,t.getFullYear()].map((function(e){return e<10?"0".concat(e):"".concat(e)})).join("/")},fromatGenderText:function(e){return"F"==e?"נקבה":"זכר"},formatMotherType:function(e){return 1==e?"כן":"לא"},getIsMother:function(e){return"לא"==e?0:1},getAgeHours:function(e){var t=new Date(e),s=new Date,n=new Date(s.getFullYear(),8,1);s.getUTCMonth()>8&&n.setFullYear(n.getFullYear()+1);var r=n.getFullYear()-t.getFullYear();return r<50?0:r>55?4:2},getReformType:function(e){this.codeDescription.find((function(t){return t.code==e}));return"TODO"}}}},a15b:function(e,t,s){"use strict";var n=s("23e7"),r=s("44ad"),a=s("fc6a"),i=s("a640"),o=[].join,c=r!=Object,l=i("join",",");n({target:"Array",proto:!0,forced:c||!l},{join:function(e){return o.call(a(this),void 0===e?",":e)}})},c6a6:function(e,t,s){"use strict";s("2bfd");var n=s("b974"),r=s("8654"),a=s("d9f7"),i=s("80d2");const o={...n["b"],offsetY:!0,offsetOverflow:!0,transition:!1};t["a"]=n["a"].extend({name:"v-autocomplete",props:{allowOverflow:{type:Boolean,default:!0},autoSelectFirst:{type:Boolean,default:!1},filter:{type:Function,default:(e,t,s)=>s.toLocaleLowerCase().indexOf(t.toLocaleLowerCase())>-1},hideNoData:Boolean,menuProps:{type:n["a"].options.props.menuProps.type,default:()=>o},noFilter:Boolean,searchInput:{type:String}},data(){return{lazySearch:this.searchInput}},computed:{classes(){return{...n["a"].options.computed.classes.call(this),"v-autocomplete":!0,"v-autocomplete--is-selecting-index":this.selectedIndex>-1}},computedItems(){return this.filteredItems},selectedValues(){return this.selectedItems.map(e=>this.getValue(e))},hasDisplayedItems(){return this.hideSelected?this.filteredItems.some(e=>!this.hasItem(e)):this.filteredItems.length>0},currentRange(){return null==this.selectedItem?0:String(this.getText(this.selectedItem)).length},filteredItems(){return!this.isSearching||this.noFilter||null==this.internalSearch?this.allItems:this.allItems.filter(e=>{const t=Object(i["q"])(e,this.itemText),s=null!=t?String(t):"";return this.filter(e,String(this.internalSearch),s)})},internalSearch:{get(){return this.lazySearch},set(e){this.lazySearch=e,this.$emit("update:search-input",e)}},isAnyValueAllowed(){return!1},isDirty(){return this.searchIsDirty||this.selectedItems.length>0},isSearching(){return this.multiple&&this.searchIsDirty||this.searchIsDirty&&this.internalSearch!==this.getText(this.selectedItem)},menuCanShow(){return!!this.isFocused&&(this.hasDisplayedItems||!this.hideNoData)},$_menuProps(){const e=n["a"].options.computed.$_menuProps.call(this);return e.contentClass=("v-autocomplete__content "+(e.contentClass||"")).trim(),{...o,...e}},searchIsDirty(){return null!=this.internalSearch},selectedItem(){return this.multiple?null:this.selectedItems.find(e=>this.valueComparator(this.getValue(e),this.getValue(this.internalValue)))},listData(){const e=n["a"].options.computed.listData.call(this);return e.props={...e.props,items:this.virtualizedItems,noFilter:this.noFilter||!this.isSearching||!this.filteredItems.length,searchInput:this.internalSearch},e}},watch:{filteredItems:"onFilteredItemsChanged",internalValue:"setSearch",isFocused(e){e?(document.addEventListener("copy",this.onCopy),this.$refs.input&&this.$refs.input.select()):(document.removeEventListener("copy",this.onCopy),this.updateSelf())},isMenuActive(e){!e&&this.hasSlot&&(this.lazySearch=null)},items(e,t){t&&t.length||!this.hideNoData||!this.isFocused||this.isMenuActive||!e.length||this.activateMenu()},searchInput(e){this.lazySearch=e},internalSearch:"onInternalSearchChanged",itemText:"updateSelf"},created(){this.setSearch()},destroyed(){document.removeEventListener("copy",this.onCopy)},methods:{onFilteredItemsChanged(e,t){e!==t&&(this.setMenuIndex(-1),this.$nextTick(()=>{this.internalSearch&&(1===e.length||this.autoSelectFirst)&&(this.$refs.menu.getTiles(),this.setMenuIndex(0))}))},onInternalSearchChanged(){this.updateMenuDimensions()},updateMenuDimensions(){this.isMenuActive&&this.$refs.menu&&this.$refs.menu.updateDimensions()},changeSelectedIndex(e){this.searchIsDirty||(this.multiple&&e===i["w"].left?-1===this.selectedIndex?this.selectedIndex=this.selectedItems.length-1:this.selectedIndex--:this.multiple&&e===i["w"].right?this.selectedIndex>=this.selectedItems.length-1?this.selectedIndex=-1:this.selectedIndex++:e!==i["w"].backspace&&e!==i["w"].delete||this.deleteCurrentItem())},deleteCurrentItem(){const e=this.selectedIndex,t=this.selectedItems[e];if(!this.isInteractive||this.getDisabled(t))return;const s=this.selectedItems.length-1;if(-1===this.selectedIndex&&0!==s)return void(this.selectedIndex=s);const n=this.selectedItems.length,r=e!==n-1?e:e-1,a=this.selectedItems[r];a?this.selectItem(t):this.setValue(this.multiple?[]:null),this.selectedIndex=r},clearableCallback(){this.internalSearch=null,n["a"].options.methods.clearableCallback.call(this)},genInput(){const e=r["a"].options.methods.genInput.call(this);return e.data=Object(a["a"])(e.data,{attrs:{"aria-activedescendant":Object(i["o"])(this.$refs.menu,"activeTile.id"),autocomplete:Object(i["o"])(e.data,"attrs.autocomplete","off")},domProps:{value:this.internalSearch}}),e},genInputSlot(){const e=n["a"].options.methods.genInputSlot.call(this);return e.data.attrs.role="combobox",e},genSelections(){return this.hasSlot||this.multiple?n["a"].options.methods.genSelections.call(this):[]},onClick(e){this.isInteractive&&(this.selectedIndex>-1?this.selectedIndex=-1:this.onFocus(),this.isAppendInner(e.target)||this.activateMenu())},onInput(e){if(this.selectedIndex>-1||!e.target)return;const t=e.target,s=t.value;t.value&&this.activateMenu(),this.internalSearch=s,this.badInput=t.validity&&t.validity.badInput},onKeyDown(e){const t=e.keyCode;n["a"].options.methods.onKeyDown.call(this,e),this.changeSelectedIndex(t)},onSpaceDown(e){},onTabDown(e){n["a"].options.methods.onTabDown.call(this,e),this.updateSelf()},onUpDown(e){e.preventDefault(),this.activateMenu()},selectItem(e){n["a"].options.methods.selectItem.call(this,e),this.setSearch()},setSelectedItems(){n["a"].options.methods.setSelectedItems.call(this),this.isFocused||this.setSearch()},setSearch(){this.$nextTick(()=>{this.multiple&&this.internalSearch&&this.isMenuActive||(this.internalSearch=!this.selectedItems.length||this.multiple||this.hasSlot?null:this.getText(this.selectedItem))})},updateSelf(){(this.searchIsDirty||this.internalValue)&&(this.valueComparator(this.internalSearch,this.getValue(this.internalValue))||this.setSearch())},hasItem(e){return this.selectedValues.indexOf(this.getValue(e))>-1},onCopy(e){var t,s;if(-1===this.selectedIndex)return;const n=this.selectedItems[this.selectedIndex],r=this.getText(n);null==(t=e.clipboardData)||t.setData("text/plain",r),null==(s=e.clipboardData)||s.setData("text/vnd.vuetify.autocomplete.item+plain",r),e.preventDefault()}}})},d81d:function(e,t,s){"use strict";var n=s("23e7"),r=s("b727").map,a=s("1dde"),i=s("ae40"),o=a("map"),c=i("map");n({target:"Array",proto:!0,forced:!o||!c},{map:function(e){return r(this,e,arguments.length>1?arguments[1]:void 0)}})},fdbc:function(e,t){e.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}}}]);
//# sourceMappingURL=chunk-6a468c8a.76db0aa0.js.map