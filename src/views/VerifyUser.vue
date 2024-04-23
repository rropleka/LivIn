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
    button {
        color: black;
    }
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
                file: File,
            }
        },
        methods: {
            upload() {
                this.file = this.$refs.file.files[0];
            },
            async submit() {
                console.log(this.file);
                if (!this.file) {
                    return;
                }
                const db = getFirestore(firebaseapp);
                const verificationRequestsRef = collection(db, "verification Requests");
                const request = {
                    user: this.$route.params.user,
                    leasingCompany: this.$route.params.leasingCompany,
                    propertyName: this.$route.params.propertyName,
                    file: await this.file.text(),
                    filename: this.file.name,
                    filetype: {type: this.file.type}
                }
                //console.log(request);
                //console.log(request.file);
                //console.log(await new Blob([request.file], request.filetype).text())
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
  