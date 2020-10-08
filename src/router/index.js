/* eslint-disable no-unused-vars */
import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (HireEmployee.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "login" */ "../auth/ots-login.vue"),
  },
  {
    path: "/HireEmp",
    name: "HireEmp",
    // route level code-splitting
    // this generates a separate chunk (HireEmployee.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "HireEmployee" */ "../views/HireEmployee.vue"
      ),
  },
  {
    path: "/empInfo",
    name: "employeeInfo",
    // route level code-splitting
    // this generates a separate chunk (EmployeeInfo.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "EmployeeInfo" */ "../views/EmployeeInfo.vue"
      ),

    beforeEnter(to, from, next) {
      if (to.name == "employeeInfo" && store.state.logginAs == 999) {
        alert("התחבר כמוסד כדי להכנס לדף זה");
        next({ name: "auth" });
      } else {
        next();
      }
    },
  },
  {
    path: "/AdditionalRewards",
    name: "AdditionalRewards",
    // route level code-splitting
    // this generates a separate chunk (Mossadot.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "AdditionalRewards" */ "../views/AdditionalRewards.vue"
      ),
  },
  {
    path: "/mossadot",
    name: "mossadot",
    // route level code-splitting
    // this generates a separate chunk (Mossadot.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Mossadot" */ "../views/Mossadot.vue"),
  },
  {
    path: "/ImportData",
    name: "ImportData",
    // route level code-splitting
    // this generates a separate chunk (Mossadot.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "ImportData" */ "../views/ImportData.vue"),
  },
  {
    path: "/auth",
    name: "auth",
    // route level code-splitting
    // this generates a separate chunk (Mossadot.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "ImportData" */ "../views/AuthMenagment.vue"),
  },
  {
    path: "/calcHours",
    name: "calcHours",
    // route level code-splitting
    // this generates a separate chunk (Mossadot.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "calcHours" */ "../views/calcHours.vue"),
  },
  {
    path: "/mossadotHours",
    name: "mossadotHours",
    // route level code-splitting
    // this generates a separate chunk (Mossadot.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "mossadotHours" */ "../views/mossadotHours.vue"
      ),
  },
  {
    path: "/reportWeeklyHours",
    name: "reportWeeklyHours",
    // route level code-splitting
    // this generates a separate chunk (Mossadot.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "reportWeeklyHours" */ "../views/reportWeeklyHours.vue"
      ),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== "login" && !store.getters.loggedIn) next({ name: "login" });
  else next();
});

export default router;
