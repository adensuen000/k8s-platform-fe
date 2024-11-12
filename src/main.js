import { createApp } from 'vue'
import App from './App.vue'
//导入elemnt plus
import ElementPlus from 'element-plus'
//引入默认主题
import 'element-plus/dist/index.css'
//引入element plus的所有图标
import * as ELIcons from '@element-plus/icons-vue'
//引入router
import router from './router'
//引入编辑器
import { GlobalCmComponent } from 'codemirror-editor-vue3'
import 'codemirror/theme/idea.css'
import 'codemirror/mode/yaml/yaml.js'

//创建vue实例
const app = createApp(App)
//将图标注册成全局组件
for (let iconName in ELIcons) {
    app.component(iconName, ELIcons[iconName])
}
//引入element plus
app.use(ElementPlus)
//注册编辑器组件
app.use(GlobalCmComponent, { componentName: "codemirror" })
//引入路由
app.use(router)
//挂载
app.mount('#app')
