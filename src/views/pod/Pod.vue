<template>
    <div>
        <el-row>
            <!-- 头部1，放namespace选择框, 刷新按钮 -->
            <el-col :span="24">
                <el-card class="pod-head-card" shadow="never" :body-style="{padding:'10px'}">
                    <el-row>
                        <!-- namespace下拉选择框 -->
                        <el-col :span=8>
                            <span style="font-size: 14px;">命名空间：</span>
                            <el-select
                            @change="npChange"
                            size="small"
                            v-model="namespaceValue"
                            filterable>
                                <el-option
                                v-for="(item, index) in namespaceList"
                                :key="index"
                                :label="item.metadata.name"
                                :value="item.metadata.name"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="16" style="text-align:right;">
                            <el-button size="small" icon="Refresh" plain @click="getPods()">刷新</el-button>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <!-- 头部2，创建按钮 及搜索框 -->
            <el-col :span="24">
                <el-card class="pod-head-card" shadow="never" :body-style="{padding:'10px'}">
                    <!-- float属性，会将多个同级标签放在同一行 -->
                    <div style="float: left;margin-right:10px;">
                        <el-button size="small" type="primary" icon="Edit" disabled>创建</el-button>
                    </div>
                    <div>
                        <el-input class="pod-head-search" size="small" clearable placeholder="请输入" v-model='searchValue'></el-input>
                        <el-button size="small" type="primary" plain icon="Edit" @click="getPods()">搜索</el-button>
                    </div>
                </el-card>
            </el-col>
            <!-- 数据表格 -->
            <el-col :span="24">
                <el-card class="pod-body-card" shadow="never" :body-style="{padding:'10px'}">
                    <!-- row-key 用于定义行数据的key，一个key代表某一行，结合expandKey去使用 -->
                    <!-- expand-row-keys 是个数组，key加入这个数组就是将这一行展开 -->
                    <!-- expand-change 展开或关闭时，都触发这个方法 -->
                    <el-table
                    style="font-size:12px;"
                    :data="podList"
                    v-loading="appLoading"
                    :row-key="getRowKeys"
                    :expand-row-keys="expandKeys"
                    @expand-change="expandChange">
                    <!-- v-loading用于加载时的laoding动画 -->
                        <!-- 表格内容 -->
                        <!-- 最左侧留出20培训的宽度 -->
                        <el-table-column width="20"></el-table-column>
                        <!-- 扩展 -->
                        <el-table-column type="expand">
                            <!-- 该插槽用于获取行数据 -->
                            <template #default="props">
                                <el-tabs v-model="activeName" type="card">
                                    <el-tab-pane label="容器" name="container">
                                        <el-card shadow="never" style="border-radius:1px;" :body-style="{padding:'5px'}">
                                            <el-table style="font-size:12px;" :data="props.row.spec.containers">
                                                <el-table-column prop="name" label="容器"></el-table-column>
                                                <el-table-column prop="args" label="启动命令"></el-table-column>
                                                <el-table-column label="环境变量">
                                                    <template v-slot="scope">
                                                        <el-popover :width="500" placement="left" trigger="hover">
                                                            <el-table style="font-size:12px" size="mini" :show-header="false" :data="scope.row.env">
                                                                <el-table-column prop="name" label="名称"></el-table-column>
                                                                <el-table-column prop="value" label="值"></el-table-column>
                                                            </el-table>
                                                            <!-- popover的插槽 -->
                                                            <template #reference>
                                                                <el-button size="small">此处查看</el-button>
                                                            </template>
                                                        </el-popover>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </el-card>
                                    </el-tab-pane>
                                    <el-tab-pane label="日志" name="log">
                                        <el-card shadow="never" style="border-radius:1px;" :body-style="{padding:'5px'}">
                                            <!-- 按钮 -->
                                            <div>
                                                <el-select size="small" v-model="containerValue" placeholder="请选择">
                                                    <el-option
                                                        v-for="item in containerList"
                                                        :key="item"
                                                        :value="item"
                                                    ></el-option>
                                                </el-select>
                                                <el-button 
                                                    style="margin-left:10px;border-radius:2px;" 
                                                    size="small" 
                                                    type="primary"
                                                    @click="getLog(props.row.metadata.name)">
                                                    查看
                                                </el-button>
                                            </div>
                                            <!-- 日志 -->
                                            <div class="pod-body-log-card">
                                                <span style="white-space: pre-wrap;color:#fff;">{{ logContent }}</span>
                                            </div>
                                        </el-card>
                                    </el-tab-pane>
                                    <el-tab-pane label="终端" name="shell">
                                        <el-card shadow="never" style="border-radius:1px;" :body-style="{padding:'5px'}">
                                            <!-- 按钮 -->
                                            <div>
                                                <el-select size="small" v-model="containerValue" placeholder="请选择">
                                                    <el-option
                                                        v-for="item in containerList"
                                                        :key="item"
                                                        :value="item"
                                                    ></el-option>
                                                </el-select>
                                                <el-button 
                                                    style="margin-left:10px;border-radius:2px;" 
                                                    size="small" 
                                                    type="primary"
                                                    @click="initSocket(props.row)">
                                                    连接
                                                </el-button>
                                                <el-button 
                                                    style="margin-left:10px;border-radius:2px;" 
                                                    size="small" 
                                                    type="danger"
                                                    @click="closeSocket()">
                                                    关闭
                                                </el-button>
                                            </div>
                                            <!-- 日志 -->
                                            <el-card shadow="never" class="pod-body-shell-card" :body-style="{padding: '5px'}">
                                                <!-- xterm虚拟终端 -->
                                                <div id="xterm"></div>
                                            </el-card>
                                        </el-card>
                                    </el-tab-pane>
                                </el-tabs>
                            </template>
                        </el-table-column>
                        <!-- pod名字 -->
                        <el-table-column label="Pod名" prop="metadata.name">
                            <!-- 插槽，scope.row获取当前行的数据 -->
                            <template v-slot="scope">
                                <a class="pod-body-podname" @click="expandMap[scope.row.metadata.name] ? expandChange(scope.row, []) : expandChange(scope.row, [scope.row])">{{ scope.row.metadata.name }}</a>
                            </template>
                        </el-table-column>
                        <!-- 节点 -->
                        <el-table-column label="节点">
                            <!-- 插槽，scope.row获取当前行的数据 -->
                            <template v-slot="scope">
                                <el-tag v-if="scope.row.spec.nodeName" type="warning">{{ scope.row.spec.nodeName }}</el-tag>
                            </template>
                        </el-table-column>
                        <!-- 状态 -->
                        <el-table-column label="状态">
                            <!-- 插槽，scope.row获取当前行的数据 -->
                            <template v-slot="scope">
                                <div :class="{'success-dot':scope.row.status.phase == 'Running', 'warning-dot':scope.row.status.phase == 'Pending', 'error-dot':scope.row.status.phase !== 'Running' && scope.row.status.phase !== 'Pending'}"></div>
                                <span :class="{'success-status':scope.row.status.phase == 'Running', 'warning-status':scope.row.status.phase == 'Pending', 'error-status':scope.row.status.phase !== 'Running' && scope.row.status.phase !== 'Pending'}">
                                    {{ scope.row.status.phase }}
                                </span>
                            </template>
                        </el-table-column>
                        <!-- 重启数 -->
                            <el-table-column label="重启数">
                            <!-- 插槽，scope.row获取当前行的数据 -->
                            <template v-slot="scope">
                                {{ restartTotal(scope) }}
                            </template>
                        </el-table-column>
                        <!-- 创建时间 -->
                        <el-table-column label="创建时间">
                            <template v-slot="scope">
                                <el-tag type="info">{{ timeTrans(scope.row.metadata.creationTimestamp) }}</el-tag>
                            </template>
                        </el-table-column>
                        <!-- 操作列,放按钮 -->
                        <el-table-column label="操作" fixed="right" width="200">
                            <template v-slot="scope">
                                <el-button size="small" icon="Edit" type="primary" plain @click="getPodDetail(scope)">YAML</el-button>
                                <el-button size="small" icon="Edit" type="danger" plain @click="handleConfirm(scope, '删除', delPod)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页配置 -->
                    <!-- background 背景色灰 -->
                    <!-- size-change 单页大小改变后触发 -->
                    <!-- current-change 页数改变后触发 -->
                    <!-- current-page 当前页 -->
                    <!-- page-size 单页大小 -->
                    <!-- layout 分页器支持的功能 -->
                    <!-- total 数据总条数 -->
                    <el-pagination
                    style="margin-top:10px;"
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="pagesizeList"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="podTotal">
                    </el-pagination>
                </el-card>
            </el-col>
        </el-row>
        <!-- yaml编辑器 -->
        <el-dialog title="YAML信息" v-model="yamlDialog" width="45%" top="2%">
            <codemirror
                :value="contentYaml"
                border
                :options="cmOptions"
                height="500"
                style="font-size:14px;"
                @change="onChange">
            </codemirror>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="yamlDialog = false">取 消</el-button>
                    <el-button type="primary" @click="updatePod()">更 新</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import common from '../common/Config'
import httpClient from '@/request'
import yaml2obj from 'js-yaml'
import json2yaml from 'json2yaml'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import 'xterm/lib/xterm.js'
export default ({
    data () {
        return {
            namespaceValue: 'default',
            namespaceListUrl: common.k8sNamespaceList,
            namespaceList: [],
            createPodDrawer: false,
            searchValue: '',
            appLoading: false,
            //分页
            currentPage: 1,
            pagesize: 10,
            pagesizeList: [10, 20, 30],
            //列表
            podList: [],
            podTotal: 0,
            podListData: {
                url: common.k8sPodList,
                params: {
                    filter_name: '',
                    namespace: '',
                    page: 1,
                    limit: 10
                }
            },
            //详情
            podDetail: '',
            podDetailData: {
                url: common.k8sPodDetail,
                params: {
                    pod_name: '',
                    namespace: ''
                }
            },
            //codemirror
            yamlDialog: false,
            contentYaml: '',
            cmOptions: common.cmOptions,
            //更新
            updatePodData: {
                url: common.k8sPodUpdate,
                params: {
                    content: '',
                    namespace: ''
                }
            },
            //删除
            delPodData: {
                url: common.k8sPodDel,
                params: {
                    pod_name: '',
                    namespace: ''
                }
            },
            //扩展tab
            activeName: 'container',
            expandKeys: [],
            expandMap: {},
            //容器列表
            containerList: {},
            containerValue: '',
            getContainerData: {
                url: common.k8sPodContainer,
                params: {
                    pod_name: '',
                    namespace: ''
                }
            },
            //日志
            logContent: '',
            getLogData: {
                url: common.k8sPodLog,
                params: {
                    container_name: '',
                    pod_name: '',
                    namespace: ''
                }
            },
            //终端
            term: null,
            socket: null
        }
    },
    methods: {
        //初始化xterm
        initTerm() {
            this.term = new Terminal({
                rendererType: 'canvas', //渲染类型
                rows: 50, //行数
                cols: 130,
                convertEol: false, //启用时，光标将设置为下一行的开头
                scrollback: 10, //终端中的回滚量
                disableStdin: false, //是否应禁用输入
                cursorStyle: 'underline', //光标样式
                cursorBlink: true, //光标闪烁
                theme: {
                    foreground: 'white', //字体
                    background: '#060101', //背景色
                    cursor: 'help' //设置光标
                }
            })
            //绑定dom
            this.term.open(document.getElementById('xterm'))
            //调整终端的尺寸
            const fitAddon = new FitAddon()
            this.term.loadAddon(fitAddon)
            fitAddon.fit()
            //获得终端的焦点
            this.term.focus()
            //重新定义一个this。不然this的指向会有问题
            let _this = this
            //用于定义输入的操作
            this.term.onData(function (key) {
                //key是指输入的值
                let msgOrder = {
                    operation: 'stdin',
                    data: key
                }
                //发送数据
                _this.socket.send(JSON.stringify(msgOrder))
            })
            //发送resize请求
            let msgOrder2 = {
                operation: 'resize',
                cols: this.term.cols,
                rows: this.term.rows
            }
            this.socket.send(JSON.stringify(msgOrder2))
        },
        //初始化websocket
        initSocket(row) {
            let wsUrl = common.k8sTerminalWs + "?pod_name=" + row.metadata.name + "&container_name=" + this.containerValue + "&namespace=" + this.namespaceValue
            //实例化
            this.socket = new WebSocket(wsUrl)
            //定义方法
            //打开socket
            this.socket.onopen = () => {
                this.initTerm()
            }
            //接收数据
            this.socket.onmessage = (msg) => {
                let content = JSON.parse(msg.data)
                this.term.write(content.data)
            }
            //关闭之前打印
            this.socket.onclose = () => {
                this.term.write("连接已关闭")
            }
            //发生错误的处理
            this.socket.onerr = () => {
                console.log('socket 连接失败')
            }
        },
        //关闭socket连接
        closeSocket() {
            if (!this.socket) {
                return
            }
            this.term.write("连接关闭中。。。")
            this.socket.close()
        },
        getRowKeys(row) {
            return row.metadata.name
        },
        //row代表当前展开的行
        //expandRows代表展开的所有行
        expandChange(row, expandRows) {
            //初始化变量,无论是展开还是关闭，都先清空，后面再决定要不要加到expandKeys里面去
            this.expandKeys=[]
            //每次展开，第一个打开的都是容器
            this.activeName = 'container'
            //判断是展开还是关闭, 0代表关闭，1代表展开
            if (expandRows.length > 0 ) {
                //用map表示展开与关闭
                this.expandMap[row.metadata.name] = 1
                this.setExpandMap(row.metadata.name)
                row ? (this.expandKeys.push(row.metadata.name), this.getContainers(row)) : ''
            } else {
                this.expandMap[row.metadata.name] = 0
            }
        },
        //除了传进来的值置为1，其他都置为0
        setExpandMap(podName) {
            let key
            for (key in this.expandMap) {
                key !== podName? this.expandMap[key] = 0 : ''
            }
        },
        restartTotal(e) {
            let index, sum = 0
            let containerStatuses = e.row.status.containerStatuses
            for (index in containerStatuses) {
                sum = sum + containerStatuses[index].restartCount
            }
            return sum
        },
        //json转yaml方法
        transYaml(content) {
            return json2yaml.stringify(content)
        },
        //yaml转obj方法
        transObj(content) {
            return yaml2obj.load(content)
        },
        onChange(val) {
            this.contentYaml = val
        },
        handleClose() {
            this.createPodDrawer = false
        },
        //页面大小发生变化时触发，赋值并重新获取列表
        handleSizeChange(size) {
            this.pagesize = size;
            this.getPods()
        },
        //页数发生变化时触发，复制并重新获取列表
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            this.getPods()
        },
        // 格林威治时间转为北京时间
        timeTrans(timestamp) {
            let date = new Date(new Date(timestamp).getTime() + 8 * 3600 * 1000)
            date = date.toJSON()
            date = date.substring(0, 19).replace('T', ' ')
            return date
        },
        ellipsis(value) {
            return value.length>15?value.substring(0,15)+'...':value
        },
        getPods(){
            //打开loading
            this.appLoading = true
            //定义参数
            this.podListData.params.filter_name = this.searchValue
            this.podListData.params.namespace = this.namespaceValue
            this.podListData.params.page = this.currentPage
            this.podListData.params.limit = this.pagesize
            //发起请求
            httpClient.get(this.podListData.url, {params: this.podListData.params})
            //处理结果
            .then(res => {
                //列表页两个要素
                //数据列表
                //total总数，用于分页
                this.podList = res.data.items
                this.podTotal = res.data.total
            })
            .catch(res => {
                this.$message.error({
                    message: res.msg
                })
            })
            .finally(() => {
                this.appLoading = false
            })
        },
        getPodDetail(e) {
            //打开loading
            this.appLoading = true
            //定义参数
            this.podDetailData.params.pod_name = e.row.metadata.name
            this.podDetailData.params.namespace = this.namespaceValue
            //发起请求
            httpClient.get(this.podDetailData.url, {params: this.podDetailData.params})
            //处理结果
            .then(res => {
                this.podDetail = res.data
                //转yaml
                this.contentYaml = this.transYaml(this.podDetail)
                //打开编辑器
                this.yamlDialog = true
            })
            .catch(res => {
                this.$message.error({
                    message: res.msg
                })
            })
            .finally(() => {
                this.appLoading = false
            })
        },
        updatePod() {
            this.appLoading = true
            //yaml转json
            let content = JSON.stringify(this.transObj(this.contentYaml))
            //发起请求
            this.updatePodData.params.content = content
            this.updatePodData.params.namespace = this.namespaceValue
            httpClient.put(this.updatePodData.url, this.updatePodData.params)
            .then(res => {
                this.$message.success({
                    message: res.msg
                })
            })
            .catch(res => {
                this.$message.error({
                    message: res.msg
                })
            })
            .finally(() => {
                this.getPods()
                this.yamlDialog = false
                this.appLoading = false
            })
        },
        delPod(e) {
            this.appLoading = true
            //发起请求
            this.delPodData.params.pod_name = e.row.metadata.name
            this.delPodData.params.namespace = this.namespaceValue
            httpClient.delete(this.delPodData.url, {data: this.delPodData.params})
            .then(res => {
                this.$message.success({
                    message: res.msg
                })
            })
            .catch(res => {
                this.$message.error({
                    message: res.msg
                })
            })
            .finally(() => {
                this.getPods()
                this.appLoading = false
            })
        },
        //确认框
        handleConfirm(obj, operateName, fn ) {
            let confirmContent = '确认继续' + operateName + "操作吗？"
            //弹出框用法
            this.$confirm(confirmContent, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })
            //点击确定的处理方法
            .then(() => {
                fn(obj)
            })
            .catch(() => {
                this.$message.info({
                    message: '已取消操作'
                })
            })
        },
        //容器列表
        getContainers(row) {
            this.getContainerData.params.pod_name = row.metadata.name
            this.getContainerData.params.namespace = this.namespaceValue
            //发起请求
            httpClient.get(this.getContainerData.url, {params: this.getContainerData.params})
            //处理结果
            .then(res => {
                this.containerList = res.data
                this.containerValue = this.containerList[0]
            })
            .catch(res => {
                this.$message.error({
                    message: res.msg
                })
            })
        },
        //日志
        getLog(podName) {
            this.appLoading = false
            this.getLogData.params.pod_name = this.containerValue
            this.getLogData.params.pod_name = podName
            this.getLogData.params.namespace = this.namespaceValue
            //发起请求
            httpClient.get(this.getLogData.url, {params: this.getLogData.params})
            //处理结果
            .then(res => {
                this.logContent = res.data
            })
            .catch(res => {
                this.$message.error({
                    message: res.msg
                })
            })
            .finally(() => {
                this.appLoading = false
            })
        },
        //终端
        getNamespaces() {
            httpClient.get(this.namespaceListUrl)
            .then(res => {
                this.namespaceList = res.data.items
            })
            .catch(res => {
                this.$message.error({
                    message: res.msg
                })
            })
        },
        npChange() {
            this.getPods()
            localStorage.setItem('namespace', this.namespaceValue)
        }
    },
    watch: {
        activeName() {
            if (this.activeName == 'log') {
                this.expandKeys.length ? this.getLog(this.expandKeys[0]) : ''
            }
        }
    },
    //mounted声明周期的操作，用于在页面加载完成之前获取某些数据
    mounted() {
        if (localStorage.getItem('namespace')) {
            this.namespaceValue = localStorage.getItem('namespace')
        }
        this.getNamespaces()
        this.getPods()
    }
})
</script>

<style scoped>
    /* 卡片样式 */
    .pod-head-card, .pod-body-card {
        border-radius: 1px;
        margin-bottom: 5px;
    }
    .el-button {
        border-radius: 2px;
    }
    .pod-head-search {
        width: 160px;
        margin-right: 10px;
    }
    .pod-body-podname {
        font-weight:bold;
        color: rgb(33, 82, 155);
    }
    .pod-body-podname:hover {
        color: rgb(84, 138, 238);
        cursor: pointer;
        font-weight: bold;
    }
    .pod-body-log-card, .pod-body-shell-card {
        border-radius:1px;
        height:600px;
        overflow:auto;
        background-color: #060101;
    }
        /* pod状态栏圆点的css实现 */
    .success-dot{
        display:inline-block;
        width: 7px;
        height:7px;
        background: rgb(27, 202, 21);
        border-radius:50%;
        border:1px solid rgb(27, 202, 21);
        margin-right: 10px;
    }
    .warning-dot{
        display:inline-block;
        width: 7px;
        height:7px;
        background: rgb(233, 200, 16);
        border-radius:50%;
        border:1px solid rgb(233, 200, 16);
        margin-right: 10px;
    }
    .error-dot{
        display:inline-block;
        width: 7px;
        height:7px;
        background: rgb(226, 23, 23);
        border-radius:50%;
        border:1px solid rgb(226, 23, 23);
        margin-right: 10px;
    }
    .success-status {
        color: rgb(27, 202, 21);
    }
    .warning-status {
        color: rgb(233, 200, 16);
    }
    .error-status {
        color: rgb(226, 23, 23);
    }
</style>
