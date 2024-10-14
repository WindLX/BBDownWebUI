import { defineStore } from 'pinia'
import { BBDownApiProvider } from './api'

export const useBBDownStore = defineStore('bbdown', {
    state: () => ({
        base_url: "http://127.0.0.1:12345",
        provider: new BBDownApiProvider("http://127.0.0.1:12345")
    }),
    actions: {
        setBaseUrl(url: string) {
            this.base_url = url
            this.provider = new BBDownApiProvider(url)
        }
    }
})