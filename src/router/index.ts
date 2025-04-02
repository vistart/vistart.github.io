import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';
import ToolboxHome from '../components/ToolboxHome.vue';
import ToolDetail from '../components/ToolDetail.vue';

const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: ToolboxHome,
            },
            {
                path: 'tool/:id',
                name: 'tool-detail',
                component: ToolDetail,
                props: true,
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;