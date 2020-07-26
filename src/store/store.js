import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);
axios.defaults.baseURL = "https://134.122.120.245:8443/ots-app";
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.baseURL = "http://localhost:9191";
// axios.defaults.headers.Authorization =
//   "Bearer " +
//   "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNTk1NTI1MTA4LCJpYXQiOjE1OTU0ODkxMDh9.43Fwt2q9MU1rmrXhjAbzovp0gF6s-5pEaW19buL9fho";

export const store = new Vuex.Store({
  state: {
    token: localStorage.getItem("access_token") || null,
    mossadId: null,
  },
  getters: {
    loggedIn(state) {
      return state.token !== null;
    },
  },
  mutations: {
    retrieveToken(state, token) {
      state.token = token;
    },
    destroyToken(state) {
      state.token = null;
    },
  },
  actions: {
    retrieveToken(context, credentials) {
      return new Promise((resolve, reject) => {
        
        axios
          .post("/authenticate", {
            username: credentials.username,
            password: credentials.password,
          })
          .then((response) => {
            const token = response.data.jwt;
            localStorage.setItem("access_token", token);
            context.commit("retrieveToken", token);
            // axios.defaults.headers.Authorization = "Bearer " + token;
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    destroyToken(context) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + context.state.token;

      if (context.getters.loggedIn) {
        return new Promise((resolve, reject) => {
          axios
            .post("/logout")
            .then((response) => {
              localStorage.removeItem("access_token");
              context.commit("destroyToken");
              resolve(response);
              // console.log(response);
              // context.commit('addTodo', response.data)
            })
            .catch((error) => {
              localStorage.removeItem("access_token");
              context.commit("destroyToken");
              reject(error);
            });
        });
      }
    },
    displayErrorMessage(context, error) {
      if (
        error.response == undefined ||
        error.response.data.errorMessage == undefined
      ) {
        console.log(error);
      } else {
        alert(error.response.data.errorMessage);
      }
    },
  },
});

export default store;