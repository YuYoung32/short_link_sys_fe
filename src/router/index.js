import {createRouter, createWebHistory} from 'vue-router';
import AppLayout from '../layout/AppLayout.vue';


const routes = [
    {
        path: '/',
        name: 'AppLayout',
        component: AppLayout,
        children: [
            {
                path: '/',
                name: 'dashboard',
                component: () => import('/src/views/Dashboard.vue')
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
