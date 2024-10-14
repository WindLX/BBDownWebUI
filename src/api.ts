import { DownloadTask, DownloadTaskCollection, MyOption } from "./model";

export class BBDownApiProvider {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    // 获取所有任务列表（运行中和已完成）
    fetchAllTasks = async (): Promise<DownloadTaskCollection> => {
        const response = await fetch(`${this.baseUrl}/get-tasks/`);
        if (!response.ok) {
            throw new Error('Failed to fetch all tasks');
        }
        return await response.json();
    };

    // 获取正在运行的任务列表
    fetchRunningTasks = async (): Promise<DownloadTask[]> => {
        const response = await fetch(`${this.baseUrl}/get-tasks/running`);
        if (!response.ok) {
            throw new Error('Failed to fetch running tasks');
        }
        return await response.json();
    };

    // 获取已完成的任务列表
    fetchFinishedTasks = async (): Promise<DownloadTask[]> => {
        const response = await fetch(`${this.baseUrl}/get-tasks/finished`);
        if (!response.ok) {
            throw new Error('Failed to fetch finished tasks');
        }
        return await response.json();
    };

    // 根据ID获取特定任务
    fetchTaskById = async (id: string): Promise<DownloadTask | null> => {
        const response = await fetch(`${this.baseUrl}/get-tasks/${id}`);
        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            throw new Error('Failed to fetch task by id');
        }
        return await response.json();
    };

    // 添加新任务
    addTask = async (options: MyOption): Promise<void> => {
        const response = await fetch(`${this.baseUrl}/add-task`, {
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
    removeFinishedTasks = async (): Promise<void> => {
        const response = await fetch(`${this.baseUrl}/remove-finished`);
        if (!response.ok) {
            throw new Error('Failed to remove finished tasks');
        }
    };

    // 移除所有失败的任务
    removeFailedTasks = async (): Promise<void> => {
        const response = await fetch(`${this.baseUrl}/remove-finished/failed`);
        if (!response.ok) {
            throw new Error('Failed to remove failed tasks');
        }
    };

    // 根据ID移除特定已完成的任务
    removeTaskById = async (id: string): Promise<void> => {
        const response = await fetch(`${this.baseUrl}/remove-finished/${id}`);
        if (!response.ok) {
            throw new Error('Failed to remove task by id');
        }
    };

}

