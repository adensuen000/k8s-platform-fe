// 导入router的路由模式
import { createRouter, createWebHistory } from 'vue-router'
//导入进度条组件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//引入整体布局Layout
import Layout from '@/layout/Layout'
import jwt from 'jsonwebtoken'

//路由规则
const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/test', //url路径
        component: () =>import('@/views/test/Test.vue'),  //导入视图组件,
        meta: {title: "测试页"} //meta原信息
    },
    {
        path: '/login', //url路径
        component: () =>import('@/views/login/Login.vue'),  //导入视图组件,
        meta: {title: "登录"} //meta原信息
    },
    {
        path: '/layout', //url路径
        component: () =>import('@/layout/Layout.vue'),  //导入视图组件,
        meta: {title: "整体布局"} //meta原信息
    },
    {
        path: '/home', //url路径
        component: Layout,  //导入父组件,
        children: [
            {
                path: '/home',
                name: '概要',
                icon: 'odometer',
                meta: {title: "概要"},
                component: () => import("@/views/home/Home.vue") //导入子组件
            }
        ]
    },
    {
        path: "/cluster",
        name: "集群",
        component: Layout,
        icon: "home-filled",
        meta: {title: "集群"},
        children: [
            {
                path: "/cluster/node",
                name: "Node",
                icon: "el-icon-s-data",
                meta: {title: "Node"},
                component: () => import("@/views/node/Node.vue")
            },
            {
                path: "/cluster/namespace",
                name: "Namespace",
                icon: "el-icon-document-add",
                meta: {title: "Namespace"},
                component: () => import("@/views/namespace/Namespace.vue")
            },
            {
                path: "/cluster/persistentvolume",
                name: "PersistentVolume",
                icon: "el-icon-document-add",
                meta: {title: "PersistemtVolume"},
                component: () => import("@/views/pv/Pv.vue")
            }
        ]
    },
    {
        path: '/workflow', //url路径
        component: Layout,  //导入父组件,
        children: [
            {
                path: '/workflow',
                name: '工作流',
                icon: 'VideoPlay',
                meta: {title: "工作流"},
                component: () => import("@/views/workflow/Workflow.vue") //导入子组件
            }
        ]
    },
    {
        path: '/workload',
        name: '工作负载',
        component: Layout,
        icon: "menu",
        meta: {title: '工作负载'},
        children: [
            {
                path: '/workload/deployment',
                name: 'Deployment',
                icon: 'el-icon-s-data',
                meta: {title: 'Deployment'},
                component: () => import("@/views/deployment/Deployment.vue") 
            },
            {
                path: '/workload/pod',
                name: 'Pod',
                icon: 'el-icon-document-data',
                meta: {title: 'Pod'},
                component: () => import("@/views/pod/Pod.vue") 
            },
            {
                path: '/workload/daemonset',
                name: 'DaemonSet',
                icon: 'el-icon-document-data',
                meta: {title: 'DaemonSet'},
                component: () => import("@/views/daemonset/DaemonSet.vue") 
            },
            {
                path: "/workload/statefulset",
                name: "StatefulSet",
                icon: "el-icon-document-add",
                meta: {title: "StatefulSet"},
                component: () => import("@/views/statefulset/StatefulSet.vue")
            }
        ]
    },
    {
        path: "/loadbalance",
        name: "负载均衡",
        component: Layout,
        icon: "files",
        meta: {title: "负载均衡"},
        children: [
            {
                path: "/loadbalance/service",
                name: "Service",
                icon: "el-icon-s-data",
                meta: {title: "Service"},
                component: () => import("@/views/service/Service.vue")
            },
            {
                path: "/loadbalance/ingress",
                name: "Ingress",
                icon: "el-icon-document-add",
                meta: {title: "Ingress"},
                component: () => import("@/views/ingress/Ingress.vue")
            }
        ]
    },
    {
        path: "/storage",
        name: "存储与配置",
        component: Layout,
        icon: "tickets",
        meta: {title: "存储与配置"},
        children: [
            {
                path: "/storage/configmap",
                name: "Configmap",
                icon: "el-icon-document-add",
                meta: {title: "Configmap"},
                component: () => import("@/views/configmap/ConfigMap.vue")
            },
            {
                path: "/storage/secret",
                name: "Secret",
                icon: "el-icon-document-add",
                meta: {title: "Secret"},
                component: () => import("@/views/secret/Secret.vue")
            },
            {
                path: "/storage/persistentvolumeclaim",
                name: "PersistentVolumeClaim",
                icon: "el-icon-s-data",
                meta: {title: "PersistentVolumeClaim"},
                component: () => import("@/views/pvc/Pvc.vue")
            },
        ]
    },
    {
        path: '/404', //url路径
        component: () =>import('@/views/common/404.vue'),  //导入视图组件,
        meta: {title: "404"} //meta原信息
    },
    //未匹配到上面路由的页面直接跳转到404
    {
        path: '/:pathMatch(.*)',
        redirect: '/404'
    }
]

//createRouter 创建路由实例
const router = createRouter({
    // hash模式：createWebHashHistory,
    // history模式：createWebHisotry
    history: createWebHistory(),
    routes
})

//进度条初始化
//递增进度条，这将获取当前状态值并添加0.2到状态0.994
NProgress.inc(100)
//easing 动画字符串
//speed 动画速度
//showSpinner 进度环显示隐藏
NProgress.configure({ easing: 'ease', speed: 600, showSpinner: false })

//路由守卫，beforeEach是在进入页面之前做的事情
router.beforeEach((to, from, next) => {
    //启动进度条
    NProgress.start()
    //设置头部
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = "K8S管理平台"
    }
    //放行
    next()
})
router.beforeEach((to, from, next) => {
    //验证token是否合法
    jwt.verify(localStorage.getItem('token'), 'adoodevops', function (err) {
        //如果要去login页面，直接放行
        if (to.path == '/login') {
            next()
        //token验证失败，则跳转到login
        } else if (err) {
            next('/login')
        //token验证成功，则放行到下一个页面
        } else {
            next()
        }
    })
})
//路由守卫，afterEach是在进入页面之后做的事情
router.afterEach(() => {
    //关闭进度条
    NProgress.done()
})

//抛出路由示例，在main.js中引用
export default router