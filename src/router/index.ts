import {createRouter, createWebHashHistory} from "vue-router"
import Login from "../view/Login.vue"
import Home from "../view/Home.vue"
import Logup from "../view/Logup.vue";

const routes = [
    {path: '/', component: Home, name: 'home'},
    {path: '/login', component: Login, name: 'login'},
    {path: '/logup', component: Logup, name: 'logup'}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, _from, next) => {
    const isLoggedIn = document.cookie.includes('identification');
    if (isLoggedIn) {
        try {
            if (to.path === '/login') {
                next('/');
            } else {
                next();
            }
        } catch (e) {
            console.error("JSON 解析失败:", e);
            next('/login');
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