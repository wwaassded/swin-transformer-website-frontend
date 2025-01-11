import {defineStore} from "pinia";
import {parseCookies} from "../utils";
import type {identificationObject} from "../type";

const useUtilStore = defineStore('util', {
    state() {
        return {
            id: parseInt(localStorage.getItem('id') as string) || -1,
            username: localStorage.getItem('username') || '',
            original_image_id: parseInt(localStorage.getItem('original_image_id') as string) || -1,
            original_image_url: localStorage.getItem('original_image_url') || '',
            segmented_image_url: localStorage.getItem('segmented_image_url') || '',
        }
    },
    actions: {
        getFromCookieIdentification() {
            const cookieObject = parseCookies(document.cookie);
            const identificationJsonStyle = cookieObject.get('identification')?.replace(/\\054/g, ',');
            let str = typeof identificationJsonStyle === 'string' ? identificationJsonStyle : ' '
            const tmp_info: string = JSON.parse(str);
            const user_info: identificationObject = JSON.parse(tmp_info) //从cookie中解析的用户的信息 包括id 以及用户名称 可以存储在pinia中实现全局的共享
            this.id = user_info.id
            this.username = user_info.username
        },
        logout() {
            this.id = -1
            this.username = ''
            this.clearImages()
            localStorage.removeItem('id')
            localStorage.removeItem('username')
        },
        clearImages() {
            this.original_image_id = -1
            this.original_image_url = ''
            this.segmented_image_url = ''
            localStorage.removeItem('original_image_id')
            localStorage.removeItem('original_image_url')
            localStorage.removeItem('segmented_image_url')
        }
    },
})

export default useUtilStore