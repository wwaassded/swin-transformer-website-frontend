import {defineStore} from "pinia";
import {ref} from "vue";

export const useWebSocketStore = defineStore('websocket', () => {
    const ws = ref()
    const status = ref('disconnected')
    const result = ref('')
    const connect = (taskId: string) => {
        if (ws.value) {
            console.log('websocket connection has already been established')
            return
        }
        ws.value = new WebSocket(`ws://localhost:8000/ws/taskStatus/${taskId}/`)
        ws.value.onopen = () => {
            status.value = 'connected'
            console.log('websocket connection established')
        }
        ws.value.onmessage = (event: MessageEvent) => {
            console.log('********')
            console.log(event)
            console.log('********')
        }
        ws.value.onerror = (e: Error) => {
            console.error('websocket error: ', e)
        }
        ws.value.onclose = () => {
            status.value = 'disconnected'
            ws.value = null
            console.log('websocket connection closed')
        }
    }
    const disconnect = () => {
        if (ws.value) {
            ws.value.close()
            ws.value = null
        }
    }
    return {
        ws,
        status,
        result,
        connect,
        disconnect,
    }
})