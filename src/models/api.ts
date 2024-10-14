// DownloadTask 数据结构表示一个下载任务的信息。
export interface DownloadTask {
    Aid: string;
    Url: string;
    TaskCreateTime: number;
    Title: string | null;
    Pic: string | null;
    VideoPubTime: number | null;
    TaskFinishTime: number | null;
    Progress: number;
    DownloadSpeed: number;
    TotalDownloadedBytes: number;
    IsSuccessful: boolean;
}

// DownloadTaskCollection 数据结构包含两个列表，分别表示正在运行的任务和已完成的任务。
export interface DownloadTaskCollection {
    Running: DownloadTask[];
    Finished: DownloadTask[];
}

// MyOption 数据结构表示下载参数的信息。
export interface MyOption {
    Url: string;
    UseTvApi?: boolean;
    UseAppApi?: boolean;
    UseIntlApi?: boolean;
    UseMP4box?: boolean;
    EncodingPriority?: string;
    DfnPriority?: string;
    OnlyShowInfo?: boolean;
    ShowAll?: boolean;
    UseAria2c?: boolean;
    Interactive?: boolean;
    HideStreams?: boolean;
    MultiThread?: boolean;
    SimplyMux?: boolean;
    VideoOnly?: boolean;
    AudioOnly?: boolean;
    DanmakuOnly?: boolean;
    CoverOnly?: boolean;
    SubOnly?: boolean;
    Debug?: boolean;
    SkipMux?: boolean;
    SkipSubtitle?: boolean;
    SkipCover?: boolean;
    ForceHttp?: boolean;
    DownloadDanmaku?: boolean;
    SkipAi?: boolean;
    VideoAscending?: boolean;
    AudioAscending?: boolean;
    AllowPcdn?: boolean;
    ForceReplaceHost?: boolean;
    SaveArchivesToFile?: boolean;
    FilePattern?: string;
    MultiFilePattern?: string;
    SelectPage?: string;
    Language?: string;
    UserAgent?: string;
    Cookie?: string;
    AccessToken?: string;
    Aria2cArgs?: string;
    WorkDir?: string;
    FFmpegPath?: string;
    Mp4boxPath?: string;
    Aria2cPath?: string;
    UposHost?: string;
    DelayPerPage?: string;
    Host?: string;
    EpHost?: string;
    Area?: string;
    ConfigFile?: string;
}

export const defaultOption: MyOption = {
    Url: "",
    UseTvApi: false,
    UseAppApi: false,
    UseIntlApi: false,
    UseMP4box: false,
    EncodingPriority: undefined,
    DfnPriority: undefined,
    OnlyShowInfo: false,
    ShowAll: false,
    UseAria2c: false,
    Interactive: false,
    HideStreams: false,
    MultiThread: true,
    SimplyMux: false,
    VideoOnly: false,
    AudioOnly: false,
    DanmakuOnly: false,
    CoverOnly: false,
    SubOnly: false,
    Debug: false,
    SkipMux: false,
    SkipSubtitle: false,
    SkipCover: false,
    ForceHttp: true,
    DownloadDanmaku: false,
    SkipAi: true,
    VideoAscending: false,
    AudioAscending: false,
    AllowPcdn: false,
    ForceReplaceHost: true,
    SaveArchivesToFile: false,
    FilePattern: "",
    MultiFilePattern: "",
    SelectPage: "",
    Language: "",
    UserAgent: "",
    Cookie: "",
    AccessToken: "",
    Aria2cArgs: "",
    WorkDir: "",
    FFmpegPath: "",
    Mp4boxPath: "",
    Aria2cPath: "",
    UposHost: "",
    DelayPerPage: "0",
    Host: "api.bilibili.com",
    EpHost: "api.bilibili.com",
    Area: "",
    ConfigFile: "BBDown.config"
}

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
