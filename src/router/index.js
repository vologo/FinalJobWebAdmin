import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login";
import Home from "../views/Home";
import Chat from "../views/chat/Chat";
import RecruitBoardDetail from "../views/recruit/RecruitBoardDetail";
import RecruitPublish from "../views/recruit/RecruitPublish";
import ShowDetail from "../views/recruit/ShowDetail";
import InputResume from "../views/recruit/InputResume";
import MyInfo from "../views/MyInfo";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        show: false,
    }, {
        path: '/home',
        name: 'Home',
        component: Home,
        show: true,
        children: [
            {
                path: '/myInfo',
                name: '我的信息',
                component: MyInfo,
                show: true,
            }
        ]
    }, {
        path: '/chat',
        name: '在线聊天',
        component: Chat,
        show: true,
    },{
        path: '/recruitBoardDetail',
        name: '岗位详情页',
        component: RecruitBoardDetail,
        show: true,
    },{
        path: '/recruitPublish',
        name: '对外招聘页',
        component: RecruitPublish,
        show: true,
    },{
        path: '/showDetail',
        name: '对外招聘详情页',
        component: ShowDetail,
        show: true,
    },{
        path: '/inputResume',
        name: '投递简历页面',
        component: InputResume,
        show: true,
    },
];

const router = new VueRouter({
    routes
});

export default router
