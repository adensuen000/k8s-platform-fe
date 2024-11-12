const baseUrl = 'http://localhost:9090'
export default {
    loginAuth: baseUrl + "/api/login",
    k8sTerminalWs: 'ws://localhost:8081/ws',
    //workflow
    k8sWorkflowCreate: baseUrl + '/api/k8s/workflow/create',
    k8sWorkflowDetail: baseUrl + '/api/k8s/workflow/detail',
    k8sWorkflowList: baseUrl + '/api/k8s/workflows',
    k8sWorkflowDel: baseUrl + '/api/k8s/workflow/del',
    //deployment
    k8sDeploymentList: baseUrl + '/api/k8s/deployments',
    k8sDeploymentDetail: baseUrl + '/api/k8s/deployment/detail',
    k8sDeploymentUpdate: baseUrl + '/api/k8s/deployment/update',
    k8sDeploymentScale: baseUrl + '/api/k8s/deployment/scale',
    k8sDeploymentRestart: baseUrl + '/api/k8s/deployment/restart',
    k8sDeploymentDel: baseUrl + '/api/k8s/deployment/del',
    k8sDeploymentCreate: baseUrl + '/api/k8s/deployment/create',
    k8sDeploymentNumNp: baseUrl + '/api/k8s/deployment/numns',
    //pod
    k8sPodList: baseUrl + '/api/k8s/pods',
    k8sPodDetail: baseUrl + '/api/k8s/pod/detail',
    k8sPodUpdate: baseUrl + '/api/k8s/pod/update',
    k8sPodDel: baseUrl + '/api/k8s/pod/del',
    k8sPodContainer: baseUrl + '/api/k8s/pod/container',
    k8sPodLog: baseUrl + '/api/k8s/pod/log',
    k8sPodNumNp: baseUrl + '/api/k8s/pod/numns',
    //daemonset
    k8sDaemonSetList: baseUrl + '/api/k8s/daemonsets',
    k8sDaemonSetDetail: baseUrl + '/api/k8s/daemonset/detail',
    k8sDaemonSetUpdate: baseUrl + '/api/k8s/daemonset/update',
    k8sDaemonSetDel: baseUrl + '/api/k8s/daemonset/del',
    //statefulset
    k8sStatefulSetList: baseUrl + '/api/k8s/statefulsets',
    k8sStatefulSetDetail: baseUrl + '/api/k8s/statefulset/detail',
    k8sStatefulSetUpdate: baseUrl + '/api/k8s/statefulset/update',
    k8sStatefulSetDel: baseUrl + '/api/k8s/statefulset/del',
    //service
    k8sServiceList: baseUrl + '/api/k8s/services',
    k8sServiceDetail: baseUrl + '/api/k8s/service/detail',
    k8sServiceUpdate: baseUrl + '/api/k8s/service/update',
    k8sServiceDel: baseUrl + '/api/k8s/service/del',
    k8sServiceCreate: baseUrl + '/api/k8s/service/create',
    //ingress
    k8sIngressList: baseUrl + '/api/k8s/ingresses',
    k8sIngressDetail: baseUrl + '/api/k8s/ingress/detail',
    k8sIngressUpdate: baseUrl + '/api/k8s/ingress/update',
    k8sIngressDel: baseUrl + '/api/k8s/ingress/del',
    k8sIngressCreate: baseUrl + '/api/k8s/ingress/create',
    //configmap
    k8sConfigMapList: baseUrl + '/api/k8s/configmaps',
    k8sConfigMapDetail: baseUrl + '/api/k8s/configmap/detail',
    k8sConfigMapUpdate: baseUrl + '/api/k8s/configmap/update',
    k8sConfigMapDel: baseUrl + '/api/k8s/configmap/del',
    //secret
    k8sSecretList: baseUrl + '/api/k8s/secrets',
    k8sSecretDetail: baseUrl + '/api/k8s/secret/detail',
    k8sSecretUpdate: baseUrl + '/api/k8s/secret/update',
    k8sSecretDel: baseUrl + '/api/k8s/secret/del',
    //pvc
    k8sPvcList: baseUrl + '/api/k8s/pvcs',
    k8sPvcDetail: baseUrl + '/api/k8s/pvc/detail',
    k8sPvcUpdate: baseUrl + '/api/k8s/pvc/update',
    k8sPvcDel: baseUrl + '/api/k8s/pvc/del',
    //node
    k8sNodeList: baseUrl + '/api/k8s/nodes',
    k8sNodeDetail: baseUrl + '/api/k8s/node/detail',
    //namespace
    k8sNamespaceList: baseUrl + '/api/k8s/namespaces',
    k8sNamespaceDetail: baseUrl + '/api/k8s/namespace/detail',
    k8sNamespaceDel: baseUrl + '/api/k8s/namespace/del',
    //pv
    k8sPvList: baseUrl + '/api/k8s/pvs',
    k8sPvDetail: baseUrl + '/api/k8s/pv/detail',
    //编辑器配置
    cmOptions: {
        // 语言及语法模式
        mode: 'text/yaml',
        // 主题
        theme: 'idea',
        // 显示行数
        lineNumbers: true,
        smartIndent: true, //智能缩进
        indentUnit: 4, // 智能缩进单元长度为 4 个空格
        styleActiveLine: true, // 显示选中行的样式
        matchBrackets: true, //每当光标位于匹配的方括号旁边时，都会使其高亮显示
        readOnly: false,
        lineWrapping: true //自动换行
    }
}