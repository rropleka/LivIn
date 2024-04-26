<script>
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore/lite'
import { firebaseapp } from '../main'
import {saveAs} from 'file-saver'
export default {
    async setup() {
        const db = getFirestore(firebaseapp)

        let requests = {};

        const verificationRequestsRef = collection(db, "verification Requests");

        const requestSnapshot = await getDocs(verificationRequestsRef)
        requestSnapshot.forEach(doc => {
            requests[doc.id] = doc.data()
        })

        return {
            db,
            requests
        }
    }, 
    methods: {
        download(key) {
            const request = this.requests[key]
            try {
                const file = new Blob([request.file], request.filetype);
                const url = URL.createObjectURL(file);
                saveAs(url, request.filename);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.log(error)
            }
        },
        async verify(id) {
            const request = this.requests[id]
            const querySnapshot = await getDocs(query(collection(this.db, 'properties'), where('propertyName', '==', request.propertyName), where('owner', '==', request.leasingCompany)));

            querySnapshot.forEach(async (doc) => {
                const data = doc.data()
                if (data.verifiedUsers) {
                    console.log(data.verifiedUsers);
                    data.verifiedUsers.push(request.user)
                }
                else {
                    data.verifiedUsers = [request.user]
                }
                await updateDoc(doc.ref, data);
                await this.remove(id);
            })
            
        },
        async remove(id) {
            const docToDelete = doc(this.db, "verification Requests", id);
            await deleteDoc(docToDelete)
            .catch((error) => {
                console.log(error);
            });
            await this.reload();
        },
        async reload() {
            this.render=false;
            let requests = {};

            const verificationRequestsRef = collection(this.db, "verification Requests");

            const requestSnapshot = await getDocs(verificationRequestsRef)
            requestSnapshot.forEach(doc => {
                requests[doc.id] = doc.data()
            })

            this.requests = requests;
            this.render=true;
        }
    },
    data() {
        return {
            render: true,
        }
    }
    

}
</script>

<template>
    <h1>Pending Verification Requests</h1>
    <div v-if="render">
        <div class="requestcard" v-for="(request, key) in requests" :key="key">
            <span>{{ request.user }}</span>
            <span>{{ request.leasingCompany }}</span>
            <span>{{ request.propertyName }}</span>
            <button @click="download(key)">Download File</button>
            <button @click="verify(key)">Accept</button>
            <button @click="remove(key)">Reject</button>
        </div>
    </div>

</template>

<style scoped>
.max-result-height {
    max-height: 105%;
}

h1 {
    color: black;
}

.result-cont-height {
    height: 70%;
}

.requestcard {
    background-color: #e8871b;
    margin-top: 10px;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    width: 50%;
    justify-content: space-between;
}

.button {
    display: flex;
    align-items: center;
}
</style>