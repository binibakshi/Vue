/* eslint-disable no-unused-vars */
import XLSX from "xlsx";
import axios from "axios";
const FRONTAL = 1;

export default {
  data() {
    return {
      localMossadId: null,
      allEmpsInfo: [],
      codeDescription: [],
      empsHours: [],
      dataToExport: [],
    };
  },
  created() {
    this.getCodesDescription();
  },
  methods: {
    async createWeeklyHoursToMossad(mossadId) {
      await this.getAllEmpInfo(mossadId);
      await this.getAllEmpHours(mossadId);
      this.setWeeklyHoursAndExport(mossadId);
    },
    async createWeeklyHoursToEmployee(empId, mossadId) {
      await this.getEmpInfo(empId, mossadId);
      await this.getEmpHours(empId, mossadId);
      this.setWeeklyHoursAndExport(mossadId);
    },
    async setWeeklyHoursAndExport(mossadId) {
      var mossadName = "";
      await new Promise((resolve) => {
        axios
          .get("/mossadot/byId", {
            params: {
              mossadId: this.$store.state.logginAuth,
            },
          })
          .then((response) => {
            mossadName = response.data.mossadName;
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
          });
      });

      this.allEmpsInfo.forEach((el) => {
        this.setExistHours(
          el,
          this.empsHours.filter((e) => e.empId == el.empId),
          mossadId,
          mossadName
        );
      });
      this.downloadFile(
        this.dataToExport,
        this.getWeeklyHoursHeaders(),
        "מצבת שעות.xlsx",
        "מערכת שעות פרונטליות"
      );
    },
    getEmpHours(empId, mossadId) {
      return new Promise((resolve) => {
        axios
          .get("/teacherEmploymentDetails/byMossad", {
            params: {
              empId: empId,
              mossadId: mossadId,
            },
          })
          .then((response) => {
            this.empsHours = response.data;
            resolve(response);
          });
      });
    },
    getEmpInfo(empId) {
      return new Promise((resolve) => {
        axios
          .get("/employees/byId", {
            params: {
              empId: empId,
            },
          })
          .then((response) => {
            this.allEmpsInfo.push(response.data);
            resolve(response);
          });
      });
    },
    getAllEmpInfo(mossadId) {
      return new Promise((resolve) => {
        axios
          .get("/employees/byMossad", {
            params: {
              mossadId: mossadId,
            },
          })
          .then((response) => {
            this.allEmpsInfo = response.data;
            resolve(response);
          });
      });
    },
    getAllEmpHours(mossadId) {
      return new Promise((resolve) => {
        axios
          .get("/teacherEmploymentDetails/allByMossad", {
            params: {
              mossadId: mossadId,
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
    setExistHours(empInfo, hoursToFormat, mossadId, mossadName) {
      let tempHourType;
      let newRow = {};
      let hoursToDisplay = [];
      hoursToFormat.forEach((el) => {
        tempHourType = this.codeDescription.find((e) => e.code == el.empCode)
          .hourType;
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
            mossadId: mossadId + "100", // TODO
            mossadName: mossadName, // TODO
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
      });
      this.dataToExport.push.apply(this.dataToExport, hoursToDisplay);
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
      var birthDate = new Date(getDate);
      var today = new Date();
      var currSchoolYear = new Date(today.getFullYear(), 8, 1);

      if (
        today.getUTCMonth() > 8 ||
        (today.getUTCMonth() == 8 && today.getUTCDay() > 1)
      ) {
        currSchoolYear.setFullYear(currSchoolYear.getFullYear() + 1);
      }

      var age = currSchoolYear.getFullYear() - birthDate.getFullYear();
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
