import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PropertyPage from '../views/PropertyPage.vue'
import NotFound from '../views/NotFound.vue'
import EditPropertyPage from "../views/EditProperty.vue"
import { getFirestore, collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore/lite'
import { firebaseapp } from '../main'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/company-register',
      name: 'company-register',
      component: () => import('../views/companyRegister.vue')
    },
    {
      path: '/add-property',
      name: 'add-property',
      component: () => import('../views/addProperty.vue')
    },
    {
      path: '/property-page',
      name: 'property-page',
      component: () => import('../views/PropertyPage.vue')
    },
    {
      path: '/edit-property/:id',
      name: 'edit-property',
      component: () => import('../views/EditProperty.vue')
    },
    // {
    //   path: '/:leasingCompany/:PropertyName',
    //   name: 'property-page',
    //   component: PropertyPage
    // },
    {
      path: '/:leasingCompany/:PropertyName',
      name: 'property-page',
      component: PropertyPage,
      props: (route) => ({
        leasingCompany: route.params.leasingCompany,
        propertyName: route.params.PropertyName,
        propertyInfo: propertyExists(route.params.leasingCompany, route.params.PropertyName).property,
      }),
      beforeEnter: async (to, from, next) => {
        try {
          const { leasingCompany, PropertyName } = to.params as { leasingCompany: string, PropertyName: string };;;
          const propertyData = await propertyExists(leasingCompany, PropertyName);
          console.log("propertyData = ");
          console.log(propertyData.property);
          if (propertyData) {
            next(); // Proceed to the intended navigation
          } else {
            next({ name: 'not-found' }); // Redirect to the NotFound page
          }
        } catch (error) {
          console.error("Error checking property existence:", error);
          next({ name: 'not-found' }); // Redirect to the NotFound page
        }
      }
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: NotFound // Import the NotFound component
    },
    // {
    //   path: '/:pathMatch(.*)*', // Catch-all route for 404 errors
    //   name: 'not-found',
    //   component: NotFound
    // }
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/profile-page.vue')
    }
    ,
    {
      path: '/revprop',
      name: 'revprop',
      component: () => import('../views/PropRev.vue')
    }
  ]
})

async function propertyExists(leasingCompany:string, PropertyName:string) {
  // need to add checks through firebase if the leasingCompany and propety exists
  console.log(leasingCompany);
  console.log(PropertyName);
  try {
    const db = getFirestore(firebaseapp);

    // Query the users collection to find the leasing company
    const usersCollectionRef = collection(db, 'users');
    const userQuerySnapshot = await getDocs(query(usersCollectionRef, where("username", "==", leasingCompany)));

    // Check if the leasing company exists
    if (userQuerySnapshot.empty) {
        return false;
    }
    const leasingCompanyData = userQuerySnapshot.docs[0].data();

    // Query the properties collection to find the property
    const propertiesCollectionRef = collection(db, 'properties');
    const propertyQuerySnapshot = await getDocs(query(propertiesCollectionRef, 
        where("propertyName", "==", PropertyName),
        where("owner", "==", leasingCompany)));

    // Check if the property exists within the leasing company
    if (propertyQuerySnapshot.empty) {
        return false;
    }
    const propertyData = propertyQuerySnapshot.docs[0].data();
    console.log("found property");
    console.log(leasingCompanyData);
    console.log(propertyData);
    return {
        leasingCompany: leasingCompanyData,
        property: propertyData
    };
} catch (error) {
    console.error('Error checking property existence:', error);
    return false;
}
return false;
}

export default router