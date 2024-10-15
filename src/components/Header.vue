<script setup lang="ts">
import { Loading, CircleCheck, Warning, Sunny, Moon } from '@element-plus/icons-vue';
import { ref, Ref, onMounted } from 'vue';
import { useBBDownStore } from '../stores/bbdown';

enum BBDownStatus {
    Ready = 0,
    Loading = 1,
    Error = 2,
}

const emits = defineEmits<{
    (e: 'connectFailed'): void
    (e: 'connectSuccess'): void
}>();

const store = useBBDownStore();
const status: Ref<BBDownStatus> = ref(BBDownStatus.Loading);

const isDark = ref(false);
const changeMode = () => {
    if (isDark.value) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

const connect = () => {
    if (!store.provider) {
        status.value = BBDownStatus.Error;
        emits('connectFailed');
        return;
    }

    store.provider.fetchAllTasks().then(() => {
        status.value = BBDownStatus.Ready;
        emits('connectSuccess');
    }).catch(() => {
        status.value = BBDownStatus.Error;
        emits('connectFailed');
    })
}

onMounted(() => {
    connect();
})
</script>

<template>
    <div class="header">
        <div class="left-stack">
            <img class="logo" alt="logo" src="/bilibili.svg" />
            <h3 class="title">BBDown 任务管理</h3>
        </div>

        <div class="right-stack">
            <el-switch v-model="isDark" :active-action-icon="Moon" :inactive-action-icon="Sunny" @change="changeMode" />
            <el-icon size="22px">
                <CircleCheck v-if="status === BBDownStatus.Ready" class="icon-check" />
                <Loading v-if="status === BBDownStatus.Loading" class="icon-loading" />
                <Warning v-if="status === BBDownStatus.Error" class="icon-error" />
            </el-icon>
        </div>

    </div>
</template>

<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.left-stack {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo {
    width: 30px;
}

.right-stack {
    display: flex;
    align-items: center;
    gap: 10px;
}

.icon-check {
    color: #67c23a;
}

.icon-loading {
    color: #409eff;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.icon-error {
    color: #f56c6c;
}
</style>