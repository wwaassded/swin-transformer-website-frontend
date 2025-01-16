import {createRouter, createWebHashHistory} from "vue-router"
import Login from "../view/Login.vue"
import Home from "../view/Home.vue"
import Logup from "../view/Logup.vue";
import Detail from "../view/Detail.vue";
import Detail_list from "../view/Detail_list.vue";

const routes = [
    {path: '/', component: Home, name: 'home'},
    {path: '/login', component: Login, name: 'login'},
    {path: '/logup', component: Logup, name: 'logup'},
    {path: '/detail', component: Detail, name: 'detail'},
    {path: '/detail_list', component: Detail_list, name: 'detail_list'}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const isLoggedIn = document.cookie.includes('identification');
    if (isLoggedIn) {
        if (to.path === '/login') {
            next('/');
        } else {
            if (to.path === '/detail') {
                if (from.path !== '/' && from.path !== '/detail_list') {
                    next('/')
                } else {
                    next()
                }
            } else {
                next();
            }
        }
    } else {
        //login logup 均不会执行跳转 login 的操作
        if (to.path !== '/login' && to.path !== '/logup') {
            next('/login');
        } else {
            next();
        }
    }
});

export default router