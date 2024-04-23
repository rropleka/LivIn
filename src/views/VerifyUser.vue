<template>
    <div class="about">
      <h1>Submit Verification</h1>
      <h2>Please submit verification data (bank statement, contract, etc) to verify you as a renter</h2>
    </div>
    <div>
        <input type="file" @change="upload" ref="file">
        <button @click="submit">Submit</button>
    </div>
</template>

<style scoped>

</style>

<script lang="ts">
    import { getFirestore, collection, getDocs, query, where, doc, getDoc, setDoc, updateDoc, addDoc } from 'firebase/firestore/lite'
    import { firebaseapp } from '../firebaseInit'

    export default {
        props: {
            leasingCompany: String,
            propertyName: String,
            username: String
        },
        data() {
            return {
                file: null,
            }
        },
        methods: {
            upload() {
                this.file = this.$refs.file.files[0];
            },
            async submit() {
                console.log(this.file);
                const db = getFirestore(firebaseapp);
                const verificationRequestsRef = collection(db, "verification Requests");
                const request = {
                    user: this.$route.params.user,
                    leasingCompany: this.$route.params.leasingCompany,
                    propertyName: this.$route.params.propertyName,
                    file: JSON.stringify(this.file),
                }
                console.log(request);
                console.log(request.file);
                try {
                    addDoc(verificationRequestsRef, request)
                }
                catch (error) {
                    console.log(error)
                }
            }
        },
        async setup() {

        }
    };

</script>
  