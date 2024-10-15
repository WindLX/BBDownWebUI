<script setup lang="ts">
import { AlarmClock, Link, Odometer } from '@element-plus/icons-vue'
import { DownloadTask } from '../models/api';

defineProps<{
    tasks?: DownloadTask[],
}>();

const openUrl = (url: string) => {
    window.open(url, '_blank');
}

// 格式化下载速度
const formatSpeed = (speed: number) => {
    if (speed > 1e6) return (speed / 1e6).toFixed(2) + ' MB/s';
    if (speed > 1e3) return (speed / 1e3).toFixed(2) + ' KB/s';
    return speed + ' B/s';
};
</script>

<template>
    <ul>
        <li v-for="task in tasks" :key="task.Aid">
            <div class="card">
                <el-image :src="task.Pic" class="card-image" fit="contain"></el-image>
                <div class="card-content">
                    <h3 class="card-title">
                        <span>{{ task.Title }}</span>
                    </h3>

                    <div class="card-detail">
                        <el-progress :percentage="Math.floor(((task.Progress * 100) * 100) / 100)" :duration="20"
                            :stroke-width="15" striped striped-flow />
                        <span class="card-speed">
                            <el-icon class="icon">
                                <Odometer />
                            </el-icon>
                            <span class="card-time">{{ formatSpeed(task.DownloadSpeed) }}</span>
                        </span>
                    </div>

                    <div class="card-status">
                        <span v-if="task.VideoPubTime" class="card-time">
                            <el-icon>
                                <AlarmClock class="icon" />
                            </el-icon>
                            {{ new Date(task.VideoPubTime * 1000).toLocaleString() }}
                        </span>
                        <div class="card-buttons">
                            <el-button type="primary" plain :icon="Link" @click="openUrl(task.Url)">链接</el-button>
                        </div>
                    </div>

                </div>
            </div>

        </li>
    </ul>
    <el-empty v-if="!tasks?.length" description="暂无进行中的任务"></el-empty>
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
    justify-content: space-between
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

.card-progress span {
    font-size: 16px;
}

.card-speed {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 5px;
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
        align-items: center;
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
        width: 100%;
        flex-direction: column;
        gap: 10px;
    }

    .card-buttons {
        width: 90%;
        flex-direction: column;
        gap: 10px;
    }

    .card-time {
        justify-content: center;
        padding-right: 0;
    }

    .card-detail {
        width: 90%;
    }

    .card-speed {
        margin-top: 0;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .card-title span {
        font-size: 16px;
    }
}
</style>