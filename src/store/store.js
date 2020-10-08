import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router/index";

Vue.use(Vuex);
// axios.defaults.baseURL = "http://localhost:9191";
axios.defaults.baseURL = "http://134.122.120.245:8080/ots-app";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

export const store = new Vuex.Store({
  state: {
    token: localStorage.getItem("access_token") || null,
    mossadId: localStorage.getItem("mossadId") || null,
    logginAs: localStorage.getItem("mossadId") || null,
    username: localStorage.getItem("username") || null,
    mossadInfo: {
      mossadName: "",
      mossadId: "",
      mossadType: "",
    },
  },
  getters: {
    loggedIn(state) {
      return state.token != null;
    },
    isAdmin(state) {
      if (state.mossadId == 999) {
        return true;
      }
      return false;
    },
    mossadInfo(state) {
      return state.mossadInfo;
    },
    mossadId(state) {
      return state.mossadId;
    },
  },
  mutations: {
    retrieveToken(state, token) {
      state.token = token;
    },
    destroyToken(state) {
      state.token = null;
    },
    setMossadInfo(state, mossadInfo) {
      state.mossadInfo = mossadInfo;
    },
  },
  actions: {
    async retrieveToken(context, credentials) {
      await axios
        .post("/authenticate", {
          username: credentials.username,
          password: credentials.password,
        })
        .then((response) => {
          const token = response.data.jwt;
          axios.defaults.headers.Authorization = "Bearer " + token;
          localStorage.setItem("access_token", token);
          localStorage.setItem("username", credentials.username);
          context.state.username = credentials.username;
          context.commit("retrieveToken", token);
        })
        .catch((error) => {
          this.$store.dispatch("displayErrorMessage", {
            error,
          });
          alert("שגיאה בפרטי התחברות");
        });
    },
    destroyToken(context) {
      if (context.getters.loggedIn) {
        context.state.mossadId = null;
        context.state.logginAs = null;
        context.state.mossadInfo = null;
        context.state.username = null;
        context.state.token = null;
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        localStorage.removeItem("mossadId");
        context.commit("destroyToken");

        router.push({ name: "login" });
      }
    },

    // async refreahToken(context) {
    //   var loadAgian = false;
    //   // delete only for this request
    //   delete axios.defaults.headers.Authorization;
    //   await axios
    //     .get("/authenticate/refresh", {
    //       params: {
    //         token: context.state.token,
    //         username: context.state.username,
    //       },
    //     })
    //     .then((response) => {
    //       if (response.data.jwt != undefined && response.data.jwt != null) {
    //         context.state.token = response.data.jwt;
    //         localStorage.setItem("access_token", context.state.token);
    //         axios.defaults.headers.Authorization =
    //           "Bearer " + context.state.token;
    //         loadAgian = true;
    //       } else {
    //         context.dispatch("destroyToken");
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       context.dispatch("destroyToken");
    //     });
    //   return loadAgian;
    // },
    displayErrorMessage(context, error) {
      if (
        error.error.response.status != undefined &&
        (error.error.response.status == 401 ||
          (error.error.response.status == 500 &&
            error.error.response.data.message.startsWith("JWT")))
      ) {
        if (context.state.token != null) {
          alert("התחבר מחדש");
          context.dispatch("destroyToken");
        }
      } else if (
        error.error == undefined ||
        error.error.response == undefined ||
        error.error.response.data.errorMessage == undefined
      ) {
        console.log(error);
      } else {
        alert(error.error.response.data.errorMessage);
      }
    },
    getMossadInfo(context) {
      axios
        .get("mossadot/byId", {
          params: {
            mossadId: context.state.logginAs,
          },
        })
        .then((response) => {
          context.state.mossadInfo = response.data;
          context.commit("setMossadInfo", response.data);
        })
        .catch((error) =>
          context.dispatch("displayErrorMessage", {
            error,
          })
        );
    },
  },
});

export default store;
