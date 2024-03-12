import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const store = createStore({
    state: {
        user: null,
        isLoggedIn: false,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            state.isLoggedIn = !!user;
        },
    },
    plugins: [createPersistedState()],
    actions: {
        loginUser({ commit }, user) {
          // Call the setUser mutation to update the user state
          commit('setUser', user);
          
        },
        logoutUser({ commit }) {
          // Call the setUser mutation with null to log the user out
          commit('setUser', null);
        },
    },
    getters: {
        isLoggedIn: (state) => state.isLoggedIn,
        currentUser: (state) => state.user,
    },
});

export default store;
