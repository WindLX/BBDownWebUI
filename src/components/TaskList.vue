<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { Delete } from '@element-plus/icons-vue'
import { DownloadTask } from '../model';
import { removeTaskById } from '../api';

defineProps<{
    tasks?: DownloadTask[]
}>();

const emits = defineEmits<{
    (e: 'updateTasks'): void
}>();

const removeTask = async (aid: string) => {
    try {
        await removeTaskById(aid);
        ElMessage.success('任务删除成功');
        emits('updateTasks'); // 删除后刷新任务列表
    } catch (error) {
        ElMessage.error('删除任务失败');
    }
};

// 格式化下载速度
const formatSpeed = (speed: number) => {
    if (speed > 1e6) return (speed / 1e6).toFixed(2) + ' MB/s';
    if (speed > 1e3) return (speed / 1e3).toFixed(2) + ' KB/s';
    return speed + ' B/s';
};
</script>

<template>
    <el-table :data="tasks" v-if="tasks?.length" style="width: 100%" max-height="500">
        <!-- 任务ID -->
        <el-table-column prop="Aid" label="任务ID" width="180" fixed></el-table-column>

        <!-- 标题 -->
        <el-table-column prop="Title" label="标题" width="300" fixed></el-table-column>

        <!-- 下载请求的URL -->
        <el-table-column prop="Url" label="URL" width="300"></el-table-column>

        <!-- 创建时间 -->
        <el-table-column prop="TaskCreateTime" label="创建时间" width="200">
            <template #default="scope">
                <span>{{ new Date(scope.row.TaskCreateTime * 1000).toLocaleString() }}</span>
            </template>
        </el-table-column>

        <!-- 视频封面图片 -->
        <el-table-column prop="Pic" label="封面" width="150">
            <template #default="scope">
                <el-image :src="scope.row.Pic" style="width: 100px; height: 60px;"></el-image>
            </template>
        </el-table-column>

        <!-- 视频发布时间 -->
        <el-table-column prop="VideoPubTime" label="视频发布时间" width="200">
            <template #default="scope">
                <span>{{ new Date(scope.row.VideoPubTime * 1000).toLocaleString() }}</span>
            </template>
        </el-table-column>

        <!-- 完成时间 -->
        <el-table-column prop="TaskFinishTime" label="任务完成时间" width="200">
            <template #default="scope">
                <span v-if="scope.row.TaskFinishTime">
                    {{ new Date(scope.row.TaskFinishTime * 1000).toLocaleString() }}
                </span>
                <span v-else>未完成</span>
            </template>
        </el-table-column>

        <!-- 进度 -->
        <el-table-column prop="Progress" label="进度" width="150">
            <template #default="scope">
                <el-progress :percentage="scope.row.Progress * 100" status="success" />
            </template>
        </el-table-column>

        <!-- 下载速度 -->
        <el-table-column prop="DownloadSpeed" label="速度" width="150">
            <template #default="scope">
                <span>{{ formatSpeed(scope.row.DownloadSpeed) }}</span>
            </template>
        </el-table-column>

        <!-- 总下载字节数 -->
        <el-table-column prop="TotalDownloadedBytes" label="已下载 (Bytes)" width="200">
            <template #default="scope">
                <span>{{ scope.row.TotalDownloadedBytes.toLocaleString() }}</span>
            </template>
        </el-table-column>

        <!-- 是否成功 -->
        <el-table-column prop="IsSuccessful" label="是否成功" width="100">
            <template #default="scope">
                <el-tag v-if="scope.row.IsSuccessful" type="success">成功</el-tag>
                <el-tag v-else type="danger">失败</el-tag>
            </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
                <el-button type="danger" :icon="Delete" @click="removeTask(scope.row.Aid)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-empty v-if="!tasks?.length" description="暂无任务"></el-empty>
</template>