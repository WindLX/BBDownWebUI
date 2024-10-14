<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Refresh, Delete, Plus } from '@element-plus/icons-vue'
import { DownloadTaskCollection } from '../model';
import { fetchAllTasks, removeFailedTasks, removeFinishedTasks } from '../api';
import TaskList from './TaskList.vue';
import AddTask from './AddTask.vue';

// 状态管理
const tasks: Ref<DownloadTaskCollection | null> = ref(null);
const drawerVisible = ref(false);

// 获取任务列表
const fetchTasks = async () => {
    try {
        tasks.value = await fetchAllTasks();
    } catch (error) {
        ElMessage.error('获取任务失败');
    }
};

// 页面加载时获取任务
onMounted(() => { fetchTasks() });

// 新建任务
const addTaskWrapper = async () => {
    drawerVisible.value = true;
}

// 删除任务
const removeFinishedTasksWrapper = async () => {
    try {
        await removeFinishedTasks();
        ElMessage.success('已完成任务删除成功');
        fetchTasks(); // 删除后刷新任务列表
    } catch (error) {
        ElMessage.error('删除已完成任务失败');
    }
};

const removeFailedTasksWrapper = async () => {
    try {
        await removeFailedTasks();
        ElMessage.success('失败任务删除成功');
        fetchTasks(); // 删除后刷新任务列表
    } catch (error) {
        ElMessage.error('删除失败任务失败');
    }
};
</script>

<template>
    <div class="container">
        <el-container>
            <el-header>
                <h3 class="title">BBDown 任务管理</h3>
            </el-header>
            <el-main>
                <!-- 顶栏 -->
                <el-row :gutter="20" class="mb-3">
                    <el-col :span="24">
                        <el-button :icon="Plus" @click="addTaskWrapper" type="primary">新建</el-button>
                        <el-button :icon="Refresh" @click="fetchTasks">刷新</el-button>
                        <el-button :icon="Delete" @click="removeFinishedTasksWrapper">删除已完成任务</el-button>
                        <el-button :icon="Delete" @click="removeFailedTasksWrapper">删除失败任务</el-button>
                    </el-col>
                </el-row>

                <h4>正在运行的任务</h4>
                <TaskList :tasks="tasks?.Running" @update-tasks="fetchTasks"></TaskList>

                <h4>已完成的任务</h4>
                <TaskList :tasks="tasks?.Finished" @update-tasks="fetchTasks"></TaskList>

            </el-main>
            <AddTask v-model="drawerVisible" @update-tasks="fetchTasks"></AddTask>
        </el-container>
    </div>
</template>


<style scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.title {
    text-align: center;
}

.mb-3 {
    margin-bottom: 20px;
}

.mt-3 {
    margin-top: 20px;
}
</style>
