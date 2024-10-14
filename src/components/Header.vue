<script setup lang="ts">
import { Loading, CircleCheck, Warning } from '@element-plus/icons-vue';
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

const retry = () => {
    if (status.value === BBDownStatus.Ready) { connect() }
}

onMounted(() => {
    connect();
})
</script>

<template>
    <div class="header">
        <h3 class="title">BBDown 任务管理</h3>
        <el-icon size="22px" @click="retry">
            <CircleCheck v-if="status === BBDownStatus.Ready" class="icon-check" />
            <Loading v-if="status === BBDownStatus.Loading" class="icon-loading" />
            <Warning v-if="status === BBDownStatus.Error" class="icon-error" />
        </el-icon>
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

.icon-check {
    color: #67c23a;
}

/* create a loading anime for icon-loading */
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