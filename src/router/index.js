/* eslint-disable no-unused-vars */
import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "empInfo",
    // route level code-splitting
    // this generates a separate chunk (HireEmployee.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "default-page" */ "../views/EmployeeInfo.vue"
      ),
    beforeEnter(to, from, next) {
      if (store.state.logginAuth == 999) {
        alert("התחבר כמוסד כדי להכנס לדף זה");
        next({ name: "auth" });
      } else {
        next();
      }
    },
  },
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
      if (store.state.logginAuth == 999) {
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
      import(/* webpackChunkName: "ImportData" */ "../views/calcHours.vue"),
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
