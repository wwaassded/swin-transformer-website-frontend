import {defineStore} from "pinia";
import {ref} from "vue";

export const useWebSocketStore = defineStore('websocket', () => {
    const ws = ref()
    const status = ref('disconnected')
    const result = ref({})
    const isSuccessful = ref(false)
    const isCompleted = ref(false) // 页面只需要根据这个变量来进行分支渲染即可
    const connect = (taskId: string) => {
        if (ws.value) {
            console.log('websocket connection has already been established')
            return
        }
        ws.value = new WebSocket(`ws://localhost:8000/ws/taskStatus/${taskId}/`)
        ws.value.onopen = () => {
            status.value = 'connected'
            console.log('websocket connection established')
            console.log(`my task_id is:${taskId}`)
        }
        ws.value.onmessage = (event: MessageEvent) => {
            isCompleted.value = true
            const received_data = event.data
            if (received_data.isSuccessful) {
                isSuccessful.value = true
                result.value = received_data
            } else {
                isSuccessful.value = false
                result.value = {
                    'isSuccessful': false,
                    'message': 'failed to handle your image'
                }
            }
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