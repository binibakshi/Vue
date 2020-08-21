/* eslint-disable no-unused-vars */
import XLSX from "xlsx";
import axios from "axios";
const FRONTAL = 1;

export default {
  data() {
    return {
      localMossadId: null,
      allEmpsInfo: null,
      codeDescription: [],
      empsHours: [],
      dataToExport: [],
    };
  },
  methods: {
    setWeeklyHoursAndExport() {
      this.allEmpsInfo.forEach((el) => {
        this.setExistHours(
          el,
          this.empsHours.filter((e) => e.empId == el.empId)
        );
      });
      this.downloadFile(
        this.dataToExport,
        this.getWeeklyHoursHeaders(),
        "מצבת שעות.xlsx",
        "מערכת שעות פרונטליות"
      );
    },
    getEmpHours(empId) {
      new Promise((resolve) => {
        axios
          .get("/teacherEmploymentDetails/byMossad", {
            params: {
              empId: empId,
              mossadId: this.$store.state.logginAuth,
            },
          })
          .then((response) => {
            this.dataToExport = response.data;
            resolve(response);
          });
      });
    },
    getEmpInfo(empId) {
      new Promise((resolve) => {
        axios
          .get("/employees/byId", {
            params: {
              empId: empId,
            },
          })
          .then((response) => {
            this.allEmpsInfo = response.data;
            resolve(response);
          });
      });
    },
    getAllEmpInfo() {
      return new Promise((resolve) => {
        axios
          .get("/employees/byMossad", {
            params: {
              mossadId: this.localMossadId,
            },
          })
          .then((response) => {
            this.allEmpsInfo = response.data;
            resolve(response);
          });
      });
    },
    getAllEmpHours() {
      return new Promise((resolve) => {
        axios
          .get("/teacherEmploymentDetails/allByMossad", {
            params: {
              mossadId: this.localMossadId,
            },
          })
          .then((response) => {
            this.empsHours = response.data;
            resolve(response);
          });
      });
    },
    getCodesDescription() {
      axios
        .get("/convertHours/all")
        .then((response) => {
          this.codeDescription = response.data;
        })
        .catch((error) =>
          this.$store.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
    downloadDemoFile() {
      var emptyForDemo = [];
      this.downloadFile(
        emptyForDemo,
        this.getWeeklyHoursHeaders(),
        "מצבת שעות.xlsx",
        "מערכת שעות פרונטליות"
      );
    },
    downloadFile(dataToExport, headers, excelName, sheetName) {
      var temp = dataToExport;
      temp.unshift(headers);
      var EmployeesWs = XLSX.utils.json_to_sheet(temp, {
        skipHeader: true,
        Views: [{ RTL: true }],
      });

      // A workbook is the name given to an Excel file
      var wb = XLSX.utils.book_new(); // make Workbook of Excel'
      XLSX.utils.book_append_sheet(wb, EmployeesWs, sheetName);
      this.set_right_to_left(wb);

      // export Excel file
      XLSX.writeFile(wb, excelName);
    },
    set_right_to_left(wb /*:Workbook*/) {
      if (!wb.Workbook) wb.Workbook = {};
      if (!wb.Workbook.Views) wb.Workbook.Views = [];
      if (!wb.Workbook.Views[0])
        (wb.Workbook.Views[0] = {}), (wb.Workbook.Views[0].RTL = true);
    },
    setExistHours(empInfo, hoursToFormat) {
      let tempHourType;
      let newRow = {};
      let hoursToDisplay = [];

      hoursToFormat.forEach((el) => {
        tempHourType = this.codeDescription.find((e) => e.code == el.empCode)
          .hourType;
        // collect only frontal hours
        if (tempHourType == FRONTAL) {
          // after first insert check whether create new row or add to existing one
          if (hoursToDisplay.find((e) => e.code == el.empCode) == undefined) {
            // create row template
            (newRow = {
              empId: empInfo.empId,
              lastName: empInfo.lastName,
              firstName: empInfo.firstName,
              ageHours: this.getAgeHours(empInfo.birthDate),
              isMother: this.getIsMother(empInfo.mother),
              code: el.empCode,
              codeDescription: this.getCodeDescription(el.empCode),
              mossadId: this.$store.state.logginAuth + "100",
              mossadName: this.$store.state.mossadInfo.mossadName,
              Sunday: 0,
              Monday: 0,
              Tuesday: 0,
              Wednesday: 0,
              Thursday: 0,
              Friday: 0,
              totalHours: 0,
              reformType: this.getReformType(el.empCode),
              systemMessages: "",
            }),
              hoursToDisplay.push(newRow);
          }
          this.setHoursInDay(
            hoursToDisplay.find((e) => e.code == el.empCode),
            el.day,
            el.hours
          );
        }
      });
      // this.sortWeeklyhoursTable(hoursToDisplay);
      this.dataToExport.push.apply(this.dataToExport, hoursToDisplay);
      // return hoursToDisplay;
    },
    sortWeeklyhoursTable(hoursToDisplay) {
      hoursToDisplay.sort((a, b) => a.empCode - b.empCode);
    },
    getWeeklyHoursHeaders() {
      var headers = {
        empId: "מספר עובד",
        lastName: "שם משפחה",
        firstName: "שם פרטי",
        ageHours: "שעות גיל",
        isMother: "מורה אם",
        code: "פיצול",
        codeDescription: "תאור פיצול",
        mossadId: "מוסד",
        mossadName: "שם מוסד",
        begda: "מתאריך",
        endda: "עד תאריך",
        Sunday: "א'",
        Monday: "ב'",
        Tuesday: "ג'",
        Wednesday: "ד",
        Thursday: "ה'",
        Friday: "ו'",
        totalHours: 'סה"כ שעות פרונטליות',
        reformType: "רפורמה",
        systemMessages: "הערות מערכת",
      };
      return headers;
    },
    setHoursInDay(record, day, newHours) {
      if (day == 0) {
        record.Sunday += newHours;
      } else if (day == 1) {
        record.Monday += newHours;
      } else if (day == 2) {
        record.Tuesday += newHours;
      } else if (day == 3) {
        record.Wednesday += newHours;
      } else if (day == 4) {
        record.Thursday += newHours;
      } else if (day == 5) {
        record.Friday += newHours;
      }
      record.totalHours += newHours;
    },
    formattedDate(birthDate) {
      var d = new Date(birthDate);
      return [d.getDate(), d.getMonth() + 1, d.getFullYear()]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join("/");
    },
    fromatGenderText(gender) {
      if (gender == "F") {
        return "נקבה";
      }
      return "זכר";
    },
    formatMotherType(mother) {
      if (mother == 1) {
        return "כן";
      }
      return "לא";
    },
    getIsMother(mother) {
      if (mother == "לא") {
        return 0;
      }
      return 1;
    },
    getAgeHours(getDate) {
      if (getDate === undefined) {
        return null;
      }
      var birthDate = new Date(getDate);
      var currDate = new Date();

      var age = currDate.getFullYear() - birthDate.getFullYear();
      if (age < 50) {
        return 0;
      } else if (age > 55) {
        return 4;
      } else {
        return 2;
      }
    },
    getCodeDescription(code) {
      return this.codeDescription.find((el) => el.code == code).codeDescription;
    },
    getReformType(empCode) {
      return "TODO";
    },
  },
};
