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
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== "login" && !store.getters.loggedIn) next({ name: "login" });
  else next();
});

export default router;
