import { createRouter, createWebHistory } from 'vue-router';
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
                component: () => import('@/views/Dashboard.vue')
            },
            {
                path: '/link/manage',
                name: 'linkManage',
                component: () => import('@/views/link/Manage.vue')
            },
            {
                path: '/visit/analysis',
                name: 'visitAnalysis',
                component: () => import('@/views/visit/Analysis.vue')
            },
            {
                path: '/visit/detail',
                name: 'visitDetail',
                component: () => import('@/views/visit/Detail.vue')
            },
            {
                path: '/performance/monitor',
                name: 'performanceMonitor',
                component: () => import('@/views/performance/Monitor.vue')
            },
            {
                path: '/performance/benchmark',
                name: 'performanceBenchmark',
                component: () => import('@/views/performance/Benchmark.vue')
            },
            {
                path: '/settings/user',
                name: 'settingsUser',
                component: () => import('@/views/settings/User.vue')
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
