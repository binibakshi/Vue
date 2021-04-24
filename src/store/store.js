import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router/router";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);
axios.defaults.baseURL = "http://localhost:9191";
// axios.defaults.baseURL = "http://134.122.120.245:9191";
// axios.defaults.baseURL = "http://134.122.120.245:8080/ots-app";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

if (process.env.NODE_ENV != 'development') {
    axios.defaults.baseURL = "http://134.122.120.245:9191";
}

export const store = new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        token: localStorage.getItem("access_token") || null,
        mossadId: localStorage.getItem("mossadId") || null,
        logginAs: localStorage.getItem("mossadId") || null,
        username: localStorage.getItem("username") || null,
        empId: 0,
        selectedYear: 0,
        mossadInfo: {
            mossadName: "",
            mossadId: "",
            mossadType: "",
        },
        popup: "",
        years: [
            { year: 2021, hebrewYear: 'תשפ"א' },
            { year: 2022, hebrewYear: 'תשפ"ב' },
            { year: 2023, hebrewYear: 'תשפ"ג' },
            { year: 2024, hebrewYear: 'תשפ"ד' },
            { year: 2025, hebrewYear: 'תשפ"ה' }
        ]
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
        setEmpId(state, empId) {
            state.empId = empId
        },
        setSelectedYear(state, selectedYear) {
            state.selectedYear = selectedYear
        },
        setLoggedAs(state, mossadId) {
            state.logginAs = mossadId
        }
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
                    // localStorage.setItem("access_token", token);
                    // localStorage.setItem("username", credentials.username);
                    context.state.username = credentials.username;
                    context.commit("retrieveToken", token);
                })
                .catch((error) => {
                    context.dispatch("displayErrorMessage", {
                        error,
                    });
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
        displayErrorMessage(context, error) {
            // eslint-disable-next-line no-debugger
            debugger;
            if (
                error.error.response.status != undefined &&
                (error.error.response.status == 401 ||
                    (error.error.response.status == 500 &&
                        error.error.response.data.message != undefined &&
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
        setEmpId(context, empId) {
            context.commit('setEmpId', empId);
        },
        setSelectedYear(context, selectedYear) {
            context.commit("setSelectedYear", selectedYear)
        },
        setLoggedAs(context, mossadId) {
            context.commit("setLoggedAs", mossadId)
        }
    },
});

export default store;