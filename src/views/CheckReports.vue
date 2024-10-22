<script>
import { ref } from 'vue'
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore/lite'
import { firebaseapp } from '../main'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'

export default {
    async setup() {
        const search = ref('')
        const db = getFirestore(firebaseapp)
        let reviews = ref([])
        const reportIDs = ref([])
        reportIDs.value.push("dummydata")
        let reviewdb1 = []
        let reviewdb2 = []
        let reportdb = []

        // Collect reported reviews
        try {
            reportdb = collection(db, "reportedReviews")
            console.log('reportedReviews fetched:', reportdb)
        } catch (error) {
            console.error('Error fetching reportedReviews:', error.message)
        }
        const querySnapshot = await getDocs(reportdb)
        querySnapshot.forEach(doc => {
            reportIDs.value.push(doc.data().reviewID)
        })

        // Collect lender reviews
        try {
            reviewdb1 = collection(db, "lenderReviews")
            console.log('lenderReviews fetched:', reviewdb1)
        } catch (error) {
            console.error('Error fetching lenderReviews:', error.message)
        }
        const q1 = query(reviewdb1, where('__name__', 'in', reportIDs.value))
        const qs1 = await getDocs(q1)

        // Collect property reviews
        try {
            reviewdb2 = collection(db, "propertyReviews")
            console.log('propertyReviews fetched:', reviewdb2)
        } catch (error) {
            console.error('Error fetching propertyReviews:', error.message)
        } 
        const q2 = query(reviewdb2, where('__name__', 'in', reportIDs.value))
        const qs2 = await getDocs(q2)
        

        // Process the querySnapshot to get the documents
        qs1.forEach((doc) => {
            if (!doc.data().isPrivate) // for when implemented, works even if field is not present
            {
                reviews.value.push({
                    id: doc.id,
                    username: doc.data().username,
                    owner: doc.data().owner,
                    propertyName: doc.data().propertyName,
                    reviewText: doc.data().reviewText,
                    stars: doc.data().stars
                })
            }
        })
         // Process the querySnapshot to get the documents
        qs2.forEach((doc) => {
            if (!doc.data().isPrivate) // for when implemented, works even if field is not present
            {
                reviews.value.push({
                    id: doc.id,
                    username: doc.data().username,
                    owner: doc.data().owner,
                    propertyName: doc.data().propertyName,
                    reviewText: doc.data().reviewText,
                    stars: doc.data().stars
                })
            }
        })

        console.log("reviews", reviews)

        return {
            search,
            reviews
        }
    }, methods: {
        async deleteReview(reviewId) {
            const db = getFirestore();
            const propertyReviewRef = doc(db, "propertyReviews", reviewId);
            const lenderReviewRef = doc(db, "lenderReviews", reviewId);

            try {
                // Check if the review exists in propertyReviews collection
                const propertySnapshot = await getDoc(propertyReviewRef)
                if (propertySnapshot.exists()) {
                    await deleteDoc(propertyReviewRef);
                    console.log(`Review with ID ${reviewId} deleted from propertyReviews collection`);
                } else {
                    // If review is not found in propertyReviews collection, delete it from lenderReviews collection
                    await deleteDoc(lenderReviewRef);
                    console.log(`Review with ID ${reviewId} deleted from lenderReviews collection`);
                }
            } catch (error) {
                console.error("Error deleting review:", error.message);
            }
            this.deleteReport(reviewId)

        }, 
        async deleteReport(reviewID) {
            try {
                const db = getFirestore();
                // Construct a query to find the document in the reportedReviews collection
                const q = query(collection(db, 'reportedReviews'), where('reviewID', '==', reviewID));

                // Get the matching documents
                const querySnapshot = await getDocs(q);

                // Get the first document in the querySnapshot (there should be only one)
                const doc = querySnapshot.docs[0];

                // Check if a document was found
                if (doc) {
                    // Delete the document from the reportedReviews collection
                    await deleteDoc(doc.ref);

                    console.log(`Reported review with reviewID ${reviewID} deleted successfully.`);
                } else {
                    console.log(`No reported review found with reviewID ${reviewID}.`);
                }
            } catch (error) {
                console.error('Error deleting reported review:', error.message);
            }

            // Update the reviews array to remove the deleted review
            this.reviews = this.reviews.filter(review => review.id !== reviewID);
        },
        showConfirmation(message, action, itemId) {
            this.confirmationMessage = message;
            this.confirmVisible = true;
            this.confirmationAction = action; // removeReview or removeReport
            this.itemId = itemId;
        },
        hideConfirmation() {
            this.confirmVisible = false;
        },
        handleConfirm() {
            // Check which action to perform based on confirmationAction
            if (this.confirmationAction === 'removeReview') {
                this.deleteReview(this.itemId);
            } else if (this.confirmationAction === 'removeReport') {
                this.deleteReport(this.itemId);
            }
            // Reset confirmationAction and confirmationItemId
            this.confirmationAction = null;
            this.itemId = null;
            // Hide confirmation dialog
            this.hideConfirmation();
        }
    }, components: {
        ConfirmationDialog
    }, data() {
        return {
            confirmVisible: false,
            confirmationMessage: "Are you sure you want to remove this? This action can't be undone."
        }
    }
    

}
</script>

<template>
    <div class="grid grid-cols-4 p-6 result-cont-height">
        <div class="h-0"></div>
        <div class="col-span-3 result-cont-height">
            <p class="text-lg font-medium text-gray-900 mb-2">All Reported Reviews</p>
            <div class="overflow-hidden overflow-y-auto border-2 p-4 border-dark-orange rounded-lg max-result-height">
                <!-- Check if reviews array is empty -->
                <div v-if="reviews.length === 0" class="text-center text-gray-500 mt-4">
                    No reported reviews found.
                </div>
                <!-- If reviews array is not empty, render reviews -->
                <div v-else>
                    <div v-for="review in reviews" :key="review.id"
                        class="flex flex-row justify-between px-4 py-2 my-2 border-2 border-orange-200 shadow-md rounded-md">
                        <div class="flex flex-col">
                            <p class="text-lg font-medium text-gray-900">{{ "Username: " + review.username }}</p>
                            <p class="text-lg font-medium text-gray-900"> {{ "Owner: " + review.owner }} </p>
                            <p class="text-lg font-medium text-gray-900"> {{ "Property: " + review.propertyName }} </p>
                            <p class="text-lg font-medium text-gray-900"> {{ "Review: " + review.reviewText }} </p>
                            <p class="text-lg font-medium text-gray-900"> {{ "Stars: " + review.stars }} </p>
                        </div>
                        <div class="flex flex-col"> <!-- Wrap buttons in a flex column container -->
                            <button
                                @click="showConfirmation('Are you sure you want to remove this review. This action cannot be undone and all data will be lost.', 'removeReview', review.id)"
                                class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm px-8 py-2 mb-2">
                                <!-- Add mb-2 for margin between buttons -->
                                Remove Review
                            </button>
                            <button
                                @click="showConfirmation('Are you sure you want to remove this report. This action cannot be undone.', 'removeReport', review.id)"
                                class="text-white bg-light-orange hover:bg-dark-orange font-medium rounded-lg text-sm px-8 py-2">
                                Remove Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<confirmation-dialog v-if="confirmVisible" :message="confirmationMessage" @cancel="hideConfirmation"
    @confirm="handleConfirm" /></template>

<style>
.max-result-height {
    max-height: 105%;
}

.result-cont-height {
    height: 70%;
}</style>