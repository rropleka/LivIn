import { createStore } from "vuex";
const store = createStore({
    state() {
        return {
            user: { // temp user data to test state in account-info
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
        login(context, user) {
            context.commit("setUser", user);
        },
        logout(context) {
            context.commit("setUser", null)
        }
    },
    modules: {},
});

export default store;
