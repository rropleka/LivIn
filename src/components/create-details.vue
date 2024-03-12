<template>
    <div class="create-details">
        <h1 style="color: black;">Create Details</h1>
        <form @submit.prevent="create">
            <input type="text" placeholder="Name" v-model="name" class="black-text"/>
            <input type="text" placeholder="Location" v-model="location" class="black-text"/>
            <input type="text" placeholder="Description" v-model="description" class="black-text"/>
            <input type="text" placeholder="Price" v-model="price" class="black-text"/>
            <input type="text" placeholder="Image" v-model="image" class="black-text"/>
            <button type="submit">Create</button>
        </form>
    </div>
</template>