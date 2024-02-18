<script lang="ts">

</script>

<template>
    <main>
        <h1>Moderator: Add Hotspots for Campus</h1>
        <form @submit.prevent="register">
            <input type="text" placeholder="Email" v-model="email" class="black-text"/>
            <input type="password" placeholder="Password" v-model="password" class="black-text"/>
            <input type="text" placeholder="Username" v-model="username" class="black-text"/>
            <button type="submit">Register</button>
            <p style="color: black;">Have an account? <router-link to="/login">Login Here</router-link></p>
        </form>
    </main>
</template>