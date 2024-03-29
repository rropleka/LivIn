<template>
    <div class="modal">
        <div class="modal-content">
            <p style="color: black;">{{ message }}</p>
            <input v-model="inputValue" type="text" class="text-input" placeholder="Enter text...">
            <div class="buttons">
                <button class="cancel-btn" @click="cancel">Cancel</button>
                <button class="confirm-btn" @click="confirm">Confirm</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['message'],
    data() {
        return {
            inputValue: ''
        };
    },
    methods: {
        cancel() {
            this.$emit('cancel');
        },
        confirm() {
            this.$emit('confirm', this.inputValue);
        }
    }
}
</script>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    max-width: 400px;
}

.text-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.cancel-btn {
    background-color: #e0e0e0;
    color: #333;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}

.confirm-btn {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}
</style>
