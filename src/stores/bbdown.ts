import { defineStore } from 'pinia'
import { BBDownApiProvider } from '../models/api'
import { ElNotification } from 'element-plus';

export const useBBDownStore = defineStore('bbdown', {
    state: () => ({
        provider: null as BBDownApiProvider | null
    }),
    actions: {
        setProvider(url: string) {
            this.provider = new BBDownApiProvider(url)
            this.provider.fetchAllTasks()
                .then(() => {
                    ElNotification({
                        title: 'Success',
                        message: 'BBDown API Provider is set',
                        type: 'success',
                    });
                })
                .catch(() => {
                    ElNotification({
                        title: 'Error',
                        message: 'Failed to set BBDown API Provider',
                        type: 'error',
                    });
                })
        },
    }
});