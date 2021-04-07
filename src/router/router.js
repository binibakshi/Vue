import Vue from "vue";
import VueRouter from "vue-router";
// import VueRoutePrefetch from "vue-router-prefetch";
import store from "../store/store";

Vue.use(VueRouter);
// Vue.use(VueRoutePrefetch,{
//   componentName:"excelMixin"
// })

const routes = [
  {
    path: "/login",
    name: "login",
    component: () =>
      import( "../auth/ots-login.vue"),
  },
  {
    path: "/HireEmp",
    name: "HireEmp",
    component: () =>
      import(
         "../views/HireEmployee.vue"
      ),
  },
  {
    path: "/empInfo",
    alias: "/",
    name: "employeeInfo",
    component: () =>
      import(
         "../views/EmployeeInfo.vue"
      ),
    beforeEnter(to, from, next) {
      if (
        to.name == "employeeInfo" &&
        (store.state.logginAs == 999 || store.state.logginAs == 998)
      ) {
        alert("התחבר כמוסד כדי להכנס לדף זה");
        next({ name: "auth" });
      } else {
        next();
      }
    },
  },
  {
    path: "/AdditionalRewards/",
    name: "AdditionalRewards",
    props: true,
    component: () =>
      import(
        "../views/AdditionalRewards.vue"
      ),
    beforeEnter(to, from, next) {
      if (
        to.name == "AdditionalRewards" &&
        (store.state.logginAs == 999 || store.state.logginAs == 998)
      ) {
        alert("התחבר כמוסד כדי להכנס לדף זה");
        next({ name: "auth" });
      } else {
        next();
      }
    },
  },
  {
    path: "/jobRewards",
    name: "jobRewards",
    props: true,
    component: () =>
      import(
       "../views/jobRewards.vue"
      ),
    beforeEnter(to, from, next) {
      if (
        to.name == "jobRewards" &&
        (store.state.logginAs == 999 || store.state.logginAs == 998)
      ) {
        alert("התחבר כמוסד כדי להכנס לדף זה");
        next({ name: "auth" });
      } else {
        next();
      }
    },
  },
  {
    path: "/mossadot",
    name: "mossadot",
    component: () =>
      import( "../views/Mossadot.vue"),
  },
  {
    path: "/ImportData",
    name: "ImportData",
    component: () =>
      import("../views/ImportData.vue"),
  },
  {
    path: "/auth",
    name: "auth",
    component: () =>
      import("../views/AuthMenagment.vue"),
  },
  {
    path: "/calcHours",
    name: "calcHours",
    component: () =>
      import("../views/calcHours.vue"),
  },
  {
    path: "/mossadotHours",
    name: "mossadotHours",
    component: () =>
      import(
        "../views/mossadotHours.vue"
      ),
  },
  {
    path: "/report/:id",
    name: "report",
    component: () =>
      import(
        "../views/report.vue"
      ),
  },
  {
    path: "/mossadClasses",
    name: "mossadClasses",
    component: () =>
      import(
        "../views/mossadClasses.vue"
      ),
  },
  {
    path: "/bagrutRewardsCust",
    name: "bagrutRewardsCust",
    component: () =>
      import("../views/bagrutRewardsCust.vue"),
  },
  {
    path: "/jobRewardsCust",
    name: "jobRewardsCust",
    component: () =>
      import("../views/jobRewardsCust.vue"),
  },
  {
    path: "/setJobPercent",
    name: "setJobPercent",
    component: () =>
      import("../views/setJobPercent.vue"),    beforeEnter(to, from, next) {
        if (
          to.name == "setJobPercent" &&
          (store.state.logginAs == 999 || store.state.logginAs == 998)
        ) {
          alert("התחבר כמוסד כדי להכנס לדף זה");
          next({ name: "auth" });
        } else {
          next();
        }
      },
  },

];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== "login" && !store.getters.loggedIn) next({ name: "login" });
  else next();
});

export default router;
