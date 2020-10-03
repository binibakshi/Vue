import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);
// axios.defaults.baseURL = "http://localhost:9191";
axios.defaults.baseURL = "http://134.122.120.245:8080/ots-app";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

export const store = new Vuex.Store({
  state: {
    token: localStorage.getItem("access_token") || null,
    mossadId: localStorage.getItem("mossadId") || null,
    logginAuth: localStorage.getItem("mossadId") || null,
    username: localStorage.getItem("username") || null,
    mossadInfo: {
      mossadName: "",
      mossadId: "",
      mossadType: "",
    },
  },
  getters: {
    loggedIn(state) {
      return state.token !== null;
    },
    isAdmin() {
      if (this.state.mossadId == 999) {
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
    retrieveToken(context, credentials) {
      axios
        .post("/authenticate", {
          username: credentials.username,
          password: credentials.password,
        })
        .then((response) => {
          const token = response.data.jwt;
          localStorage.setItem("access_token", token);
          localStorage.setItem("username", credentials.username);
          context.state.username = credentials.username;
          context.commit("retrieveToken", token);
          // axios.defaults.headers.Authorization = "Bearer " + token;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    destroyToken(context) {
      // axios.defaults.headers.common["Authorization"] =
      //   "Bearer " + context.state.token;

      if (context.getters.loggedIn) {
        context.state.mossadId = null;
        context.state.logginAuth = null;
        context.state.mossadInfo = null;
        context.state.username = null;
        context.state.token = null;
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        context.commit("destroyToken");

        // return new Promise((resolve, reject) => {
        //   axios
        //     .post("/logout")
        //     .then((response) => {
        //       localStorage.removeItem("access_token");
        //       context.commit("destroyToken");
        //       resolve(response);
        //     })
        //     .catch((error) => {
        //       localStorage.removeItem("access_token");
        //       context.commit("destroyToken");
        //       reject(error);
        //     });
        // });
      }
    },
    displayErrorMessage(context, error) {
      if (
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
            mossadId: context.state.logginAuth,
          },
        })
        .then((response) => {
          context.state.mossadInfo = response.data;
          context.commit("setMossadInfo", response.data);
        })
        .catch((error) => console.log(error));
    },
  },
});

export default store;
