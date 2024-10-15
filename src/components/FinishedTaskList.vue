<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ElNotification } from 'element-plus';
import { Delete, AlarmClock, Link, More } from '@element-plus/icons-vue'
import { DownloadTask } from '../models/api';
import { useBBDownStore } from '../stores/bbdown';

defineProps<{
    tasks?: DownloadTask[],
}>();

const emits = defineEmits<{
    (e: 'updateTasks'): void
}>();

const store = useBBDownStore();
const detailVisible = ref(false);
const showTask = ref<DownloadTask | null>(null);

const dialogWidth = ref('500px');

const updateMedia = () => {
    if (window.innerWidth < 768) {
        dialogWidth.value = '90%';
    } else {
        dialogWidth.value = '500px';
    }
};

const removeTask = async (aid: string) => {
    try {
        if (!store.provider) {
            ElNotification({
                title: 'Add Task Error',
                message: 'Failed to get provider',
                type: 'error'
            })
            return;
        }

        await store.provider.removeTaskById(aid);

        ElNotification({
            title: 'Remove Task Success',
            type: 'success'
        })
        emits('updateTasks');
    } catch (error) {
        let e = error as Error;
        ElNotification({
            title: 'Remove Task Error',
            message: e.message,
            type: 'error'
        })
    }
};

const openUrl = (url: string) => {
    window.open(url, '_blank');
}

const showDetail = (task: DownloadTask) => {
    showTask.value = task;
    detailVisible.value = true;
}

// 格式化下载速度
const formatSpeed = (speed: number) => {
    if (speed > 1e6) return (speed / 1e6).toFixed(2) + ' MB/s';
    if (speed > 1e3) return (speed / 1e3).toFixed(2) + ' KB/s';
    return speed + ' B/s';
};

onMounted(() => {
    updateMedia();
    window.addEventListener('resize', updateMedia);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateMedia);
});
</script>

<template>
    <ul>
        <li v-for="task in tasks" :key="task.Aid">
            <div class="card">
                <el-image :src="task.Pic" class="card-image" fit="contain"></el-image>
                <div class="card-content">
                    <h3 class="card-title">
                        <span>{{ task.Title }}</span>
                        <el-tag v-if="task.IsSuccessful" type="success">成功</el-tag>
                        <el-tag v-else type="danger">失败</el-tag>
                    </h3>

                    <div class="card-status">
                        <span v-if="task.VideoPubTime" class="card-time">
                            <el-icon>
                                <AlarmClock class="icon" />
                            </el-icon>
                            {{ new Date(task.VideoPubTime * 1000).toLocaleString() }}
                        </span>
                        <div class="card-buttons">
                            <el-button type="info" plain class="card-button" :icon="More"
                                @click="showDetail(task)">详情</el-button>
                            <el-button type="primary" plain class="card-button" :icon="Link"
                                @click="openUrl(task.Url)">链接</el-button>
                            <el-button type="danger" class="card-button" :icon="Delete"
                                @click="removeTask(task.Aid)">删除</el-button>
                        </div>
                    </div>

                </div>
            </div>

        </li>
    </ul>
    <el-dialog v-model="detailVisible" title="详情" :width="dialogWidth">
        <div class="card-detail" v-if="showTask">
            <span>id: {{ showTask.Aid }}</span>
            <span>创建时间: {{ new Date(showTask.TaskCreateTime * 1000).toLocaleString() }}</span>
            <span v-if="showTask.TaskFinishTime">
                完成时间: {{ new Date(showTask.TaskFinishTime * 1000).toLocaleString() }}
            </span>
            <span>平均速度: {{ formatSpeed(showTask.DownloadSpeed) }}</span>
            <span>下载字节数: {{ showTask.TotalDownloadedBytes.toLocaleString() }} Bytes</span>
        </div>
    </el-dialog>
    <el-empty v-if="!tasks?.length" description="暂无完成的任务"></el-empty>
</template>

<style scoped>
ul {
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 0;
    padding-inline-end: 0;
}

li {
    list-style: none;
}

.card {
    display: flex;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 5px;
}

.card-image {
    width: 300px;
    height: 150px;
    margin: 5px;
    border-radius: 5px;
}

.card-content {
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.card-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.card-time {
    color: #8d8d8d;
    padding-right: 10px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.icon {
    color: #8d8d8d;
}

.card-buttons {
    display: flex;
}

.card-detail {
    margin-bottom: 5px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.card-detail span {
    font-size: 16px;
}

@media (max-width: 768px) {
    .card {
        flex-direction: column;
        align-items: center;
    }

    .card-image {
        width: 92%;
        height: auto;
        margin: 10px;
        margin-bottom: 0;
        border-radius: 5px;
    }

    .card-content {
        width: 100%;
    }

    .card-title {
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 15px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .card-status {
        flex-direction: column;
        gap: 10px;
    }

    .card-buttons {
        width: 90%;
        flex-direction: column;
        gap: 10px;
    }

    .card-button {
        margin: 0;
    }

    .card-time {
        justify-content: center;
        padding-right: 0;
    }
}

@media (max-width: 480px) {
    .card-title span {
        font-size: 16px;
    }
}
</style>