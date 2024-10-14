import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

import { useConfigStore } from './stores/config'
import { useBBDownStore } from './stores/bbdown'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(ElementPlus)

const configStore = useConfigStore()
configStore.loadConfig().then(() => {
    const bbDownStore = useBBDownStore()
    bbDownStore.setProvider(configStore.config.backend.url)
    app.mount('#app')
})
