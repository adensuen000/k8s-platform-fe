<template>
    <div class="login">
        <el-card class="login-card">
            <!-- header插槽 -->
            <template #header>
                <div class="login-card-header">
                    <span>K8S平台 用户登录</span>
                </div>
            </template>
            <!-- ref设置后，在script中能使用this.$refs拿到对应的对象，用于验证和reset表单数据 -->
            <el-form :model="loginData" :rules="loginDataRules" ref="loginData">
                <!-- prop用于与rules的值对应，验证表单 -->
                <el-form-item prop="username" label="账号">
                    <!-- 
                        prefix-icon 输入框前面的图标
                        clearable  清除功能
                     -->
                    <el-input 
                    prefix-icon="UserFilled" 
                    v-model.trim="loginData.username" 
                    maxlength="32"
                    placeholder="请输入账号"
                    clearable>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <!-- 
                        prefix-icon 输入框前面的图标
                        clearable  清除功能
                     -->
                    <el-input 
                    prefix-icon="Lock" 
                    v-model.trim="loginData.password" 
                    maxlength="16"
                    placeholder="请输入密码"
                    clearable
                    show-password>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                    type="primary" 
                    style="width:100%;border-radius:2px"
                    :loading="loginLoading"
                    @click="formSubmit('loginData', handleLogin)">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import common from '../common/Config';  //url配置
import httpClient from '@/request';
import moment from 'moment';  //生成当前时间
import jwt from 'jsonwebtoken';
export default ({
    data() {
        return {
            loginUrl: common.loginAuth,
            loginData: {
                username: '',
                password: ''
            },
            loginDataRules: {
                username: [{
                    required: true,
                    message: '请填写用户名',
                    trigger: 'change'
                }],
                password: [{
                    required: true,
                    message: '请填写密码',
                    trigger: 'change'
                }],
            },
            loginLoading: false,
        }
    },
    methods: {
        handleLogin() {
            httpClient.post(this.loginUrl, this.loginData)
            .then(res => {
                //set数据
                localStorage.setItem('username', this.loginData.username)
                localStorage.setItem('loginDate', moment().format('YYYY-MM-DD HH:mm:ss'))
                //生成token
                let token = jwt.sign(this.loginData, 'adoodevops', {expiresIn: '10h'})
                localStorage.setItem('token', token)
                //跳转到/home
                this.$router.push('/')
                this.$message.success({
                    message: res.msg
                })
            })
            .catch(res => {
                this.$message.error({
                    message: res.msg
                })
            })
        },
        formSubmit(formName, fn) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    fn()
                } else {
                    return false;
                }
            })
        }
    }
})
</script>


<style scoped>
/* scoped用于设置的css样式只在当前组件页面生效 */
    .login {
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: url(../../assets/img/login3.webp);
        background-size: 100%;
    }
    .login-card {
        position: absolute;
        left: 35%;
        top: 35%;
        width: 350px;
        border-radius: 5px;
        background: rgb(255, 255, 255);
    }
    .login-card-header {
        text-align: center;
    }
</style>