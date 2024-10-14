<script setup lang="ts">
import { ref, Ref } from 'vue';
import { ElMessage, ElForm } from 'element-plus';
import { MyOption } from '../model';
import { addTask } from '../api';
import { ElMessageBox } from 'element-plus'

const drawerVisible = defineModel();
const taskOptions = ref<MyOption>({
    Url: ''
});
const taskForm: Ref<typeof ElForm | null> = ref(null);

const size = ref('100%');

const emits = defineEmits<{
    (e: 'updateTasks'): void
}>();

const clearForm = () => {
    taskOptions.value = {
        Url: ''
    }
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
        await addTask(taskOptions.value);
        ElMessage.success('任务添加成功');
        drawerVisible.value = false;
    } catch (error) {
        ElMessage.error('添加任务失败: ' + error);
    }
    clearForm
    emits('updateTasks');
};
</script>

<template>
    <el-drawer v-model="drawerVisible" title="新建任务" direction="ltr" :before-close="handleClose" :size="size">
        <el-form :model="taskOptions" ref="taskForm" label-width="120px">
            <el-form-item label="视频链接" prop="Url" required>
                <el-input v-model="taskOptions.Url" placeholder="请输入视频链接" />
            </el-form-item>

            <el-form-item label="下载选项">
                <el-checkbox v-model="taskOptions.UseTvApi">使用TV端解析模式</el-checkbox>
                <el-checkbox v-model="taskOptions.UseAppApi">使用APP端解析模式</el-checkbox>
                <el-checkbox v-model="taskOptions.UseIntlApi">使用国际版(东南亚视频)解析模式</el-checkbox>
                <el-checkbox v-model="taskOptions.UseMP4box">使用MP4Box来混流</el-checkbox>
                <el-checkbox v-model="taskOptions.EncodingPriority">视频编码的选择优先级, 用逗号分割 例: "hevc,av1,avc"</el-checkbox>
                <el-checkbox v-model="taskOptions.DfnPriority">画质优先级,用逗号分隔 例: "8K 超高清, 1080P 高码率, HDR 真彩,
                    杜比视界"</el-checkbox>
                <el-checkbox v-model="taskOptions.OnlyShowInfo">仅解析而不进行下载</el-checkbox>
                <el-checkbox v-model="taskOptions.ShowAll">展示所有分P标题</el-checkbox>
                <el-checkbox v-model="taskOptions.UseAria2c">调用aria2c进行下载</el-checkbox>
                <el-checkbox v-model="taskOptions.Interactive">交互式选择清晰度</el-checkbox>
                <el-checkbox v-model="taskOptions.HideStreams">不要显示所有可用音视频流</el-checkbox>
                <el-checkbox v-model="taskOptions.MultiThread">使用多线程下载(默认开启)</el-checkbox>
                <el-checkbox v-model="taskOptions.SimplyMux">简单复用</el-checkbox>
                <el-checkbox v-model="taskOptions.VideoOnly">仅视频</el-checkbox>
                <el-checkbox v-model="taskOptions.AudioOnly">仅音频</el-checkbox>
                <el-checkbox v-model="taskOptions.DanmakuOnly">仅弹幕</el-checkbox>
                <el-checkbox v-model="taskOptions.CoverOnly">仅封面</el-checkbox>
                <el-checkbox v-model="taskOptions.SubOnly">仅字幕</el-checkbox>
                <el-checkbox v-model="taskOptions.Debug">输出调试日志</el-checkbox>
                <el-checkbox v-model="taskOptions.SkipMux">跳过混流步骤</el-checkbox>
                <el-checkbox v-model="taskOptions.SkipSubtitle">跳过字幕下载</el-checkbox>
                <el-checkbox v-model="taskOptions.SkipCover">跳过封面下载</el-checkbox>
                <el-checkbox v-model="taskOptions.ForceHttp">下载音视频时强制使用HTTP协议替换HTTPS(默认开启)</el-checkbox>
                <el-checkbox v-model="taskOptions.DownloadDanmaku">下载弹幕</el-checkbox>
                <el-checkbox v-model="taskOptions.SkipAi">跳过AI字幕下载(默认开启)</el-checkbox>
                <el-checkbox v-model="taskOptions.VideoAscending">视频升序(最小体积优先)</el-checkbox>
                <el-checkbox v-model="taskOptions.AudioAscending">音频升序(最小体积优先)</el-checkbox>
                <el-checkbox v-model="taskOptions.AllowPcdn">不替换PCDN域名, 仅在正常情况与--upos-host均无法下载时使用</el-checkbox>
                <el-checkbox v-model="taskOptions.ForceReplaceHost">强制替换主机</el-checkbox>
                <el-checkbox v-model="taskOptions.SaveArchivesToFile">保存归档到文件</el-checkbox>
                <el-form-item label="文件模式">
                    <el-input v-model="taskOptions.FilePattern" placeholder="使用内置变量自定义单P存储文件名:
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
                                                 <publishDate>: 收藏夹/番剧/合集发布时间
                                                 <videoDate>: 视频发布时间(分p视频发布时间与<publishDate>相同)
                                                 <apiType>: API类型(TV/APP/INTL/WEB)"></el-input>
                </el-form-item>
                <el-form-item label="多文件模式">
                    <el-input v-model="taskOptions.MultiFilePattern"
                        placeholder="使用内置变量自定义多P存储文件名: 默认为: <videoTitle>/[P<pageNumberWithZero>]<pageTitle>"></el-input>
                </el-form-item>
                <el-form-item label="选择页面">
                    <el-input v-model="taskOptions.SelectPage"
                        placeholder="选择指定分p或分p范围: (-p 8 或 -p 1,2 或 -p 3-5 或 -p ALL 或 -p LAST 或 -p 3,5,LATEST)"></el-input>
                </el-form-item>
                <el-form-item label="语言">
                    <el-input v-model="taskOptions.Language" placeholder="设置混流的音频语言(代码), 如chi, jpn等"></el-input>
                </el-form-item>
                <el-form-item label="用户代理">
                    <el-input v-model="taskOptions.UserAgent" placeholder="指定user-agent, 否则使用随机user-agent"></el-input>
                </el-form-item>
                <el-form-item label="Cookie">
                    <el-input v-model="taskOptions.Cookie" placeholder="设置字符串cookie用以下载网页接口的会员内容"></el-input>
                </el-form-item>
                <el-form-item label="访问令牌">
                    <el-input v-model="taskOptions.AccessToken"
                        placeholder="设置access_token用以下载TV/APP接口的会员内容"></el-input>
                </el-form-item>
                <el-form-item label="Aria2c 参数">
                    <el-input v-model="taskOptions.Aria2cArgs" placeholder="调用aria2c的附加参数(默认参数包含' -x16 -s16 -j16 -k 5M',
                        使用时注意字符串转义)"></el-input>
                </el-form-item>
                <el-form-item label="工作目录">
                    <el-input v-model="taskOptions.WorkDir" placeholder="设置程序的工作目录"></el-input>
                </el-form-item>
                <el-form-item label="FFmpeg 路径">
                    <el-input v-model="taskOptions.FFmpegPath" placeholder="设置ffmpeg的路径"></el-input>
                </el-form-item>
                <el-form-item label="MP4box 路径">
                    <el-input v-model="taskOptions.Mp4boxPath" placeholder="设置mp4box的路径"></el-input>
                </el-form-item>
                <el-form-item label="Aria2c 路径">
                    <el-input v-model="taskOptions.Aria2cPath" placeholder="设置aria2c的路径"></el-input>
                </el-form-item>
                <el-form-item label="Upos 主机">
                    <el-input v-model="taskOptions.UposHost" placeholder="自定义upos服务器"></el-input>
                </el-form-item>
                <el-form-item label="每页延迟">
                    <el-input v-model="taskOptions.DelayPerPage"
                        placeholder="设置下载合集分P之间的下载间隔时间(单位: 秒, 默认无间隔)"></el-input>
                </el-form-item>
                <el-form-item label="主机">
                    <el-input v-model="taskOptions.Host"
                        placeholder="指定BiliPlus host(使用BiliPlus需要access_token, 不需要cookie, 解析服务器能够获取你账号的大部分权限!)"></el-input>
                </el-form-item>
                <el-form-item label="Ep 主机">
                    <el-input v-model="taskOptions.EpHost"
                        placeholder="指定BiliPlus EP host(用于代理api.bilibili.com/pgc/view/web/season, 大部分解析服务器不支持代理该接口)"></el-input>
                </el-form-item>
                <el-form-item label="区域">
                    <el-input v-model="taskOptions.Area"
                        placeholder="(hk|tw|th) 使用BiliPlus时必选, 指定BiliPlus area"></el-input>
                </el-form-item>
                <el-form-item label="配置文件">
                    <el-input v-model="taskOptions.ConfigFile"
                        placeholder="读取指定的BBDown本地配置文件(默认为: BBDown.config)"></el-input>
                </el-form-item>
            </el-form-item>
        </el-form>

        <!-- 提交和取消按钮 -->
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