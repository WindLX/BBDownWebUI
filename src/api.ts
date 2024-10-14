import { DownloadTask, DownloadTaskCollection, MyOption } from "./model";

const BASE_URL = 'http://127.0.0.1:8080';

// 获取所有任务列表（运行中和已完成）
export const fetchAllTasks = async (): Promise<DownloadTaskCollection> => {
    const response = await fetch(`${BASE_URL}/get-tasks/`);
    if (!response.ok) {
        throw new Error('Failed to fetch all tasks');
    }
    return await response.json();
};

// 获取正在运行的任务列表
export const fetchRunningTasks = async (): Promise<DownloadTask[]> => {
    const response = await fetch(`${BASE_URL}/get-tasks/running`);
    if (!response.ok) {
        throw new Error('Failed to fetch running tasks');
    }
    return await response.json();
};

// 获取已完成的任务列表
export const fetchFinishedTasks = async (): Promise<DownloadTask[]> => {
    const response = await fetch(`${BASE_URL}/get-tasks/finished`);
    if (!response.ok) {
        throw new Error('Failed to fetch finished tasks');
    }
    return await response.json();
};

// 根据ID获取特定任务
export const fetchTaskById = async (id: string): Promise<DownloadTask | null> => {
    const response = await fetch(`${BASE_URL}/get-tasks/${id}`);
    if (response.status === 404) {
        return null;
    }
    if (!response.ok) {
        throw new Error('Failed to fetch task by id');
    }
    return await response.json();
};

// 添加新任务
export const addTask = async (options: MyOption): Promise<void> => {
    const response = await fetch(`${BASE_URL}/add-task`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
    });
    if (!response.ok) {
        throw new Error('Failed to add task');
    }
};

// 移除所有已完成的任务
export const removeFinishedTasks = async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}/remove-finished`);
    if (!response.ok) {
        throw new Error('Failed to remove finished tasks');
    }
};

// 移除所有失败的任务
export const removeFailedTasks = async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}/remove-finished/failed`);
    if (!response.ok) {
        throw new Error('Failed to remove failed tasks');
    }
};

// 根据ID移除特定已完成的任务
export const removeTaskById = async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/remove-finished/${id}`);
    if (!response.ok) {
        throw new Error('Failed to remove task by id');
    }
};
