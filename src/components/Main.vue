<script setup lang="ts">
import { ref, Ref, onUnmounted } from 'vue';
import { ElNotification } from 'element-plus';
import { Refresh, Delete, Plus } from '@element-plus/icons-vue'
import { DownloadTaskCollection } from '../models/api';
import { useBBDownStore } from '../stores/bbdown';
import RunningTaskList from './RunningTaskList.vue';
import FinishedTaskList from './FinishedTaskList.vue';
import AddTask from './AddTask.vue';
import Header from './Header.vue';

// 状态管理
const tasks: Ref<DownloadTaskCollection | null> = ref(null);
const drawerVisible = ref(false);
const store = useBBDownStore();
let fetchTasksId = setInterval(() => {
    fetchTasks();
}, 1000);

const connectSuccessCallback = () => {
    fetchTasksId = setInterval(() => {
        fetchTasks();
    }, 1000);
}
const connectFailedCallback = () => {
    clearInterval(fetchTasksId);
}

// 页面加载时获取任务
onUnmounted(() => {
    clearInterval(fetchTasksId);
})

// 新建任务
const addTaskWrapper = async () => {
    drawerVisible.value = true;
}

// 获取任务列表
const fetchTasks = async () => {
    if (!store.provider) {
        ElNotification({
            title: 'Add Task Error',
            message: 'Failed to get provider',
            type: 'error'
        })
        return;
    }

    try {
        tasks.value = await store.provider.fetchAllTasks();
    } catch (error) {
        const e = error as Error;
        ElNotification({
            title: 'Fetch Task Error',
            message: e.message,
            type: 'error'
        })
    }
};

// 删除任务
const removeFinishedTasksWrapper = async () => {
    try {
        if (!store.provider) {
            ElNotification({
                title: 'Error',
                message: 'Failed to get provider',
                type: 'error'
            })
            return;
        }

        await store.provider.removeFinishedTasks();
        ElNotification({
            title: 'Success',
            message: 'Remove finished task successfully',
            type: 'success'
        })
        fetchTasks();
    } catch (error) {
        let e = error as Error;
        ElNotification({
            title: 'Error',
            message: e.message,
            type: 'error'
        })
    }
};

const removeFailedTasksWrapper = async () => {
    try {
        if (!store.provider) {
            ElNotification({
                title: 'Error',
                message: 'Failed to get provider',
                type: 'error'
            })
            return;
        }

        await store.provider!.removeFailedTasks();
        ElNotification({
            title: 'Success',
            message: 'Remove failed task successfully',
            type: 'success'
        })
        fetchTasks(); // 删除后刷新任务列表
    } catch (error) {
        let e = error as Error;
        ElNotification({
            title: 'Error',
            message: e.message,
            type: 'error'
        })
    }
};
</script>

<template>
    <div class="container">
        <el-container>
            <el-header>
                <Header @connect-failed="connectFailedCallback" @connect-success="connectSuccessCallback" />
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
                <RunningTaskList :tasks="tasks?.Running">
                </RunningTaskList>

                <h4>已完成的任务</h4>
                <FinishedTaskList :tasks="tasks?.Finished" @update-tasks="fetchTasks">
                </FinishedTaskList>

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

.mb-3 {
    margin-bottom: 20px;
}

.mt-3 {
    margin-top: 20px;
}
</style>
