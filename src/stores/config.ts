import { defineStore } from "pinia";
import { defaultConfig, loadConfig } from "../models/config";
import { ElNotification } from 'element-plus';

export const useConfigStore = defineStore("config", {
    state: () => ({
        config: defaultConfig
    }),

    actions: {
        async loadConfig() {
            try {
                this.config = await loadConfig();
            } catch (err) {
                const e = err as Error;
                ElNotification({
                    title: 'Error',
                    message: e.message,
                    type: 'error',
                });
            }
        }
    }
});