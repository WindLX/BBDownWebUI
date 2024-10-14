<script setup lang="ts">
import { ref, Ref } from 'vue';
import { ElMessage, ElForm } from 'element-plus';
import { defaultOption, MyOption } from '../model';
import { useBBDownStore } from '../store';
import { ElMessageBox } from 'element-plus'

const drawerVisible = defineModel();
const taskOptions = ref<MyOption>(defaultOption);
const taskForm: Ref<typeof ElForm | null> = ref(null);
const store = useBBDownStore();

const parseMode = ref('web');
const onlyMode = ref('false');

const intro = `使用内置变量自定义单P存储文件名:
<videoTitle>: 视频主标题
<pageNumber>: 视频分P序号
<pageNumberWithZero>: 视频分P序号(前缀补零)
<pageTitle>: 视频分P标题
<bvid>: 视频BV号
<aid>: 视频aid
<cid>: 视频cid
<dfn>: 视频清晰度
<res>: 视频分辨率
<fps>: 视频帧率
<videoCodecs>: 视频编码
<videoBandwidth>: 视频码率
<audioCodecs>: 音频编码
<audioBandwidth>: 音频码率
<ownerName>: 上传者名称
<ownerMid>: 上传者mid
<publishDate>: 收藏夹 / 番剧 / 合集发布时间
<videoDate>: 视频发布时间(分p视频发布时间与<publishDate> 相同)
<apiType>: API类型(TV / APP / INTL / WEB)`;
const intro2 = `使用内置变量自定义多P存储文件名: 默认为: <videoTitle>/[P<pageNumberWithZero>]<pageTitle>`;

const size = ref('100%');

const emits = defineEmits<{
    (e: 'updateTasks'): void
}>();

const clearForm = () => {
    taskOptions.value = defaultOption;
    parseMode.value = 'web';
    onlyMode.value = 'false';
    taskForm.value?.resetFields()
}

const handleClose = (done: () => void) => {
    ElMessageBox.confirm('你确定取消新增任务吗?')
        .then(() => {
            done()
            clearForm();
        })
        .catch(() => {
            // catch error
        })
}

// 提交任务
const submitTask = async () => {
    try {
        switch (parseMode.value) {
            case 'web':
                break;
            case 'tv':
                taskOptions.value.UseTvApi = true;
                break;
            case 'app':
                taskOptions.value.UseAppApi = true;
                break;
            case 'intl':
                taskOptions.value.UseIntlApi = true;
                break;
            default:
                break;
        }
        switch (onlyMode.value) {
            case 'false':
                break;
            case 'video':
                taskOptions.value.VideoOnly = true;
                break;
            case 'audio':
                taskOptions.value.AudioOnly = true;
                break;
            case 'danmu':
                taskOptions.value.DanmakuOnly = true;
                break;
            case 'subtitle':
                taskOptions.value.SubOnly = true;
                break;
            case 'cover':
                taskOptions.value.CoverOnly = true;
                break;
            default:
                break;
        }
        await store.provider.addTask(taskOptions.value);
        ElMessage.success('任务添加成功');
        drawerVisible.value = false;
        clearForm();
        emits('updateTasks');
    } catch (error) {
        ElMessage.error('添加任务失败: ' + error);
        clearForm();
        emits('updateTasks');
    }

};
</script>

<template>
    <el-drawer v-model="drawerVisible" title="新建任务" direction="ltr" :before-close="handleClose" :size="size">
        <el-form :model="taskOptions" ref="taskForm" label-width="160px">
            <el-form-item label="视频链接" prop="Url" required>
                <el-input v-model="taskOptions.Url" placeholder="请输入视频链接" />
            </el-form-item>

            <h4>常规设置</h4>

            <el-form-item label="解析模式">
                <el-radio-group v-model="parseMode">
                    <el-radio value="web">网页模式</el-radio>
                    <el-radio value="tv">TV端模式</el-radio>
                    <el-radio value="app">APP端模式</el-radio>
                    <el-radio value="intl">国际版(东南亚视频)模式</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="视频编码优先级">
                <el-input v-model="taskOptions.EncodingPriority" />
                <el-text>用逗号分割 例: "hevc,av1,avc"</el-text>
            </el-form-item>

            <el-form-item label="画质优先级">
                <el-input v-model="taskOptions.DfnPriority" />
                <el-text>用逗号分隔 例: "8K 超高清, 1080P 高码率, HDR 真彩,
                    杜比视界</el-text>
            </el-form-item>

            <el-form-item label="多线程下载">
                <el-switch v-model="taskOptions.MultiThread" />
            </el-form-item>

            <el-form-item label="简单复用">
                <el-switch v-model="taskOptions.SimplyMux" />
            </el-form-item>

            <el-form-item label="排序">
                <el-checkbox v-model="taskOptions.VideoAscending">视频升序(最小体积优先)</el-checkbox>
                <el-checkbox v-model="taskOptions.AudioAscending">音频升序(最小体积优先)</el-checkbox>
            </el-form-item>

            <el-divider />
            <h4>内容处理</h4>
            <el-form-item label="选择分p">
                <el-input v-model="taskOptions.SelectPage"></el-input>
                <el-text>选择指定分p或分p范围: (-p 8 或 -p 1,2 或 -p 3-5 或 -p ALL 或 -p LAST 或 -p 3,5,LATEST)</el-text>
            </el-form-item>

            <el-form-item label="仅下载">
                <el-radio-group v-model="onlyMode">
                    <el-radio value="false">关闭</el-radio>
                    <el-radio value="video">仅视频</el-radio>
                    <el-radio value="audio">仅音频</el-radio>
                    <el-radio value="danmu">仅弹幕</el-radio>
                    <el-radio value="subtitle">仅字幕</el-radio>
                    <el-radio value="cover">仅封面</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="下载弹幕">
                <el-switch v-model="taskOptions.DownloadDanmaku" :disabled="onlyMode !== 'false'" />
            </el-form-item>

            <el-form-item label="跳过">
                <el-checkbox v-model="taskOptions.SkipMux" :disabled="onlyMode !== 'false'">跳过混流步骤</el-checkbox>
                <el-checkbox v-model="taskOptions.SkipSubtitle" :disabled="onlyMode !== 'false'">跳过字幕下载</el-checkbox>
                <el-checkbox v-model="taskOptions.SkipCover" :disabled="onlyMode !== 'false'">跳过封面下载</el-checkbox>
                <el-checkbox v-model="taskOptions.SkipAi" :disabled="onlyMode !== 'false'">跳过AI字幕下载</el-checkbox>
            </el-form-item>

            <el-divider />
            <h4>保存配置</h4>
            <el-form-item label="保存下载记录">
                <el-switch v-model="taskOptions.SaveArchivesToFile" />
                <el-text style="margin-left: 10px;">将下载过的视频记录到本地文件中, 用于后续跳过下载同个视频</el-text>
            </el-form-item>

            <el-form-item label="文件名格式">
                <el-input v-model="taskOptions.FilePattern"></el-input>
                <el-text style="white-space: pre-wrap;">
                    {{ intro }}
                </el-text>
            </el-form-item>
            <el-form-item label="多文件名格式">
                <el-input v-model="taskOptions.MultiFilePattern"></el-input>
                <el-text>{{ intro2 }}</el-text>
            </el-form-item>


            <el-divider />
            <h4>服务解析</h4>
            <el-form-item label="语言">
                <el-input v-model="taskOptions.Language"></el-input>
                <el-text>设置混流的音频语言(代码), 如chi, jpn等</el-text>
            </el-form-item>
            <el-form-item label="用户代理">
                <el-input v-model="taskOptions.UserAgent"></el-input>
                <el-text>指定user-agent, 否则使用随机user-agent</el-text>
            </el-form-item>
            <el-form-item label="Cookie">
                <el-input v-model="taskOptions.Cookie"></el-input>
                <el-text>设置字符串cookie用以下载网页接口的会员内容</el-text>
            </el-form-item>
            <el-form-item label="访问令牌">
                <el-input v-model="taskOptions.AccessToken"></el-input>
                <el-text>设置access_token用以下载TV/APP接口的会员内容</el-text>
            </el-form-item>
            <el-form-item label="Upos 主机">
                <el-input v-model="taskOptions.UposHost"></el-input>
                <el-text>自定义upos服务器</el-text>
            </el-form-item>
            <el-form-item label="每页延迟">
                <el-input v-model="taskOptions.DelayPerPage"></el-input>
                <el-text>设置下载合集分P之间的下载间隔时间(单位: 秒, 默认无间隔)</el-text>
            </el-form-item>
            <el-form-item label="主机">
                <el-input v-model="taskOptions.Host"></el-input>
                <el-text>指定BiliPlus host(使用BiliPlus需要access_token, 不需要cookie, 解析服务器能够获取你账号的大部分权限!)</el-text>
            </el-form-item>
            <el-form-item label="Ep 主机">
                <el-input v-model="taskOptions.EpHost"></el-input>
                <el-text>指定BiliPlus EP host(用于代理api.bilibili.com/pgc/view/web/season, 大部分解析服务器不支持代理该接口)</el-text>
            </el-form-item>
            <el-form-item label="区域">
                <el-input v-model="taskOptions.Area"></el-input>
                <el-text>(hk|tw|th) 使用BiliPlus时必选, 指定BiliPlus area</el-text>
            </el-form-item>
            <el-form-item label="强制替换">
                <el-checkbox v-model="taskOptions.ForceReplaceHost">强制替换下载服务器</el-checkbox>
                <el-checkbox v-model="taskOptions.ForceHttp">下载音视频时强制使用HTTP协议替换HTTPS</el-checkbox>
            </el-form-item>
            <el-form-item label="PCDN">
                <el-checkbox v-model="taskOptions.AllowPcdn">不替换PCDN域名, 仅在正常情况与--upos-host均无法下载时使用</el-checkbox>
            </el-form-item>

            <el-divider />
            <h4>FFmpeg 配置</h4>
            <el-form-item label="FFmpeg 路径">
                <el-input v-model="taskOptions.FFmpegPath"></el-input>
            </el-form-item>

            <el-divider />
            <h4>MP4Box 配置</h4>
            <el-form-item label="调用 MP4Box 混流">
                <el-switch v-model="taskOptions.UseMP4box" />
            </el-form-item>
            <el-form-item label="MP4Box 路径">
                <el-input v-model="taskOptions.Mp4boxPath" :disabled="!taskOptions.UseMP4box"></el-input>
            </el-form-item>

            <el-divider />
            <h4>Aria2c 配置</h4>
            <el-form-item label="调用 Aria2c 下载">
                <el-switch v-model="taskOptions.UseAria2c" />
            </el-form-item>
            <el-form-item label="Aria2c 路径">
                <el-input v-model="taskOptions.Aria2cPath" :disabled="!taskOptions.UseAria2c"></el-input>
            </el-form-item>
            <el-form-item label="Aria2c 附加参数">
                <el-input v-model="taskOptions.Aria2cArgs" :disabled="!taskOptions.UseAria2c"></el-input>
                <el-text>默认参数包含' -x16 -s16 -j16 -k 5M', 使用时注意字符串转义</el-text>
            </el-form-item>
            <el-divider />

            <h4>程序设置</h4>
            <el-form-item label="输出调试日志">
                <el-switch v-model="taskOptions.Debug"></el-switch>
            </el-form-item>

            <el-form-item label="服务器终端">
                <el-checkbox v-model="taskOptions.OnlyShowInfo">仅解析而不进行下载</el-checkbox>
                <el-checkbox v-model="taskOptions.ShowAll">展示所有分P标题</el-checkbox>
                <el-checkbox v-model="taskOptions.Interactive">交互式选择清晰度</el-checkbox>
                <el-checkbox v-model="taskOptions.HideStreams">不要显示所有可用音视频流</el-checkbox>
            </el-form-item>

            <el-form-item label="工作目录">
                <el-input v-model="taskOptions.WorkDir"></el-input>
                <el-text>设置程序的工作目录</el-text>
            </el-form-item>

            <el-form-item label="配置文件">
                <el-input v-model="taskOptions.ConfigFile"></el-input>
                <el-text>读取指定的BBDown本地配置文件</el-text>
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="drawerVisible = false">取消</el-button>
                <el-button type="primary" @click="submitTask">提交</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<style>
.dialog-footer {
    flex: auto;
}
</style>