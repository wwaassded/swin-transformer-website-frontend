// main.ts
import {createApp} from 'vue'
import App from './App.vue'
import {createPinia} from "pinia";

import router from "./router";
import axios from "axios";

import {createVuetify} from 'vuetify'
import 'vuetify/styles'
import {aliases, mdi} from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App)
const pinia = createPinia()

// 创建 Vuetify 实例
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
})

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true

app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .mount('#app')