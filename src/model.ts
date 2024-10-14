// DownloadTask 数据结构表示一个下载任务的信息。
interface DownloadTask {
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
interface DownloadTaskCollection {
    Running: DownloadTask[];
    Finished: DownloadTask[];
}

// MyOption 数据结构表示下载参数的信息。
interface MyOption {
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

export type {
    DownloadTask,
    DownloadTaskCollection,
    MyOption
}