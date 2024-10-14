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

                    <div class="card-progress">
                        <el-progress :percentage="(task.Progress * 100).toFixed(2)" :duration="20" :stroke-width="15"
                            striped striped-flow />
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
                            <el-button type="primary" :icon="Link" @click="openUrl(task.Url)">链接</el-button>
                        </div>
                    </div>

                </div>
            </div>

        </li>
    </ul>
    <el-empty v-if="!tasks?.length" description="暂无进行中的任务"></el-empty>
</template>

<style scoped>
li {
    list-style: none;
}

.card {
    display: flex;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 5px;
}

.card-title {
    display: flex;
    align-items: center;
    justify-content: space-between
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

.card-image {
    width: 300px;
    height: 150px;
    margin: 5px;
    background-color: #ededed;
    border-radius: 5px;
}

.card-buttons {
    display: flex;
    align-items: center;
}

.card-progress {
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
</style>