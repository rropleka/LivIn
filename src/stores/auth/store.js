import { createStore } from "vuex";

const store = createStore({
    state() {
        return {
            user: {
                id: 1, // wtv temp id
                username: "testuser",
                password: "testpassword",
                name: "John Doe",
                age: 25,
                email: "testemail",
                class: "Test Class",
                gender: "Male",
                aboutme: "I am a test user.",
                contactinfo: "testcontactinfo",
            },
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
    },
    actions: {
        login({ commit }, user) {
            commit("setUser", user);
        },
        logout({ commit }) {
            commit("setUser", null)
        }
    },
    modules: {},
});

export default store;
