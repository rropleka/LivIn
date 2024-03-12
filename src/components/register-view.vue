<template>
    <div class="register">
        <h1 style="color: black;">Register</h1>
        <!-- Create our Register form and prevent submission without necessary data -->
        <form @submit.prevent="register">
            <input type="text" placeholder="Email" v-model="email" class="black-text"/>
            <input type="password" placeholder="Password" v-model="password" class="black-text"/>
            <input type="text" placeholder="Username" v-model="username" class="black-text"/>
            <button type="submit">Register</button>
            <p style="color: black;">Have an account? <router-link to="/login">Login Here</router-link></p>
        </form>
    </div>
</template>

<script>
export default {
    props: {
        registerp: Function,
        emailp: String,
        passwordp: String,
        usernamep: String
    },
    data() {
        return { 
            register: this.registerp,
            email: this.emailp, 
            password: this.passwordp, 
            username: this.usernamep 
        }
    }
}
</script>
