<template>
    <div class="border" style="display: flex;justify-content: space-between">
        <div style="width: 33%">
            <el-card style="margin:10px 0px 10px 10px" shadow="never">
                <div slot="header">
                    <span>出勤统计</span>
                    <el-tooltip effect="dark" placement="top">
                        <div slot="content">
                            休息日打卡请走加班申请渠道哦，休息日打卡不算考勤范围内
                        </div>
                        <i class="fa fa-lightbulb-o" style="margin-top: 10px;margin-left: 10px"></i>
                    </el-tooltip>
                </div>
                <div>
                    <div id="days" style="width: 380px;height:200px"></div>
                    <div class="c1">
                        <div style="margin-left: 20px">
                            <div style="margin-bottom: 5px">{{already}}</div>
                            <div><i class="fa fa-circle" style="margin-right: 15px;color: #1E90FF"/>实际出勤（天）</div>
                        </div>
                        <div style="margin-right: 20px">
                            <div style="margin-bottom: 5px">{{none}}</div>
                            <div><i class="fa fa-circle" style="margin-right: 15px;color: #EE3B3B"/>未出勤（天）</div>
                        </div>
                    </div>
                </div>
            </el-card>
            <el-card style="margin:10px 0px 10px 10px" shadow="never">
                <div slot="header">
                    <span>异常考勤</span>
                    <el-tooltip effect="dark" placement="top">
                        <div slot="content">
                            现有工时:有打卡的日期的出勤汇总<br/>
                            总需工时:有打卡的日期的最少需要工作的时长
                        </div>
                        <i class="fa fa-lightbulb-o" style="margin-top: 10px;margin-left: 10px"></i>
                    </el-tooltip>
                </div>
                <div>
                    <div class="c1">
                        <div style="margin-left: 20px">
                            <div style="margin-bottom: 5px">{{early}}</div>
                            <div><i class="fa fa-circle" style="margin-right: 15px;color: #1E90FF"/>早退（天）</div>
                        </div>
                        <div style="margin-right: 20px">
                            <div style="margin-bottom: 5px">{{late}}</div>
                            <div><i class="fa fa-circle" style="margin-right: 15px;color: #EE3B3B"/>迟到（天）</div>
                        </div>
                    </div>

                    <div class="c1">
                        <div>
                            <div style="margin-bottom: 5px">{{worked}}</div>
                            <div><i class="fa fa-circle" style="margin-right: 15px;color: #00FA9A"/>现有工时（时）</div>
                        </div>
                        <div>
                            <div style="margin-bottom: 5px">{{already * 8}}</div>
                            <div><i class="fa fa-circle" style="margin-right: 15px;color: #9400D3"/>总需工时（时）</div>
                        </div>
                    </div>


                </div>
            </el-card>
            <el-card style="margin:10px 0px 10px 10px" shadow="never">
                <div slot="header">
                    <span>本月请假信息</span>
                </div>
                <div v-for="(item,index) in leaveInfo" :key="index">
                    <el-tag style="margin-top: 5px">{{item.leaveType}}</el-tag>
                    {{item.time}}
                </div>
            </el-card>
        </div>
        <div class="border" style="margin:10px 10px 10px 10px;width: 67%">
            <AttendanceCalendar/>
        </div>
    </div>
</template>

<script>
    import {postRequest} from "../utils/RequestUtil";
    import AttendanceCalendar from "./staff/AttendanceCalendar";

    export default {
        name: "HomeComponent",
        data() {
            return {
                days: null,
                already: null,
                none: null,
                needDay: null,
                early: null,
                late: null,
                worked: null,
                leaveInfo: [],
                exceptionCheckIn: [],
            }
        },
        components: {
            AttendanceCalendar: AttendanceCalendar,
        },
        mounted() {
            this.getDays();
            this.getLeaveInfo();
            this.initExceptionCheckIn();
        },
        methods: {
            getLeaveInfo() {
                let params = {};
                params.month = null;
                postRequest("/system/config/getLeaveInfo",params).then(resp => {
                    if (resp) {
                        this.leaveInfo = resp.data;
                    }
                })
            },
            initPie() {
                let echarts = require('echarts');
                let myChart = echarts.init(document.getElementById('days'));
                // 绘制图表
                myChart.setOption({
                    series: [
                        {
                            name: '考勤统计',
                            type: 'pie',    // 设置图表类型为饼图
                            radius: '55%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
                            data: this.days,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                normal: {
                                    label: {
                                        show: true,
                                        formatter: '{b} : {c} ({d}%)'
                                    },
                                    labelLine: {show: true}
                                }
                            },
                            color: ["#4876FF", "#7A7A7A", "#FF3030", "#EEB422"]
                        }
                    ]
                })
            },
            initExceptionCheckIn() {
                let params = {};
                params.month = null;
                postRequest("/system/config/getExceptionCheckIn",params).then(resp => {
                    this.exceptionCheckIn = resp.data;
                    for (let i in this.exceptionCheckIn) {
                        if (this.exceptionCheckIn[i].name === '早退') {
                            this.early = this.exceptionCheckIn[i].value;
                        } else if (this.exceptionCheckIn[i].name === '迟到') {
                            this.late = this.exceptionCheckIn[i].value;
                        } else if (this.exceptionCheckIn[i].name === '已工作工时') {
                            this.worked = this.exceptionCheckIn[i].value;
                        } else if (this.exceptionCheckIn[i].name === '总工时') {
                            this.needDay = this.exceptionCheckIn[i].value;
                        }
                    }
                })
            },
            getDays() {
                let params={};
                params.month = null;
                postRequest("/system/config/getShouldBeWorkDays",params).then(resp => {
                    if (resp) {
                        this.days = resp.data;
                        for (let i in this.days) {
                            if (this.days[i].name === '已打卡') {
                                this.already = this.days[i].value;
                            } else if (this.days[i].name === '未打卡') {
                                this.none = this.days[i].value;
                            }
                        }
                        this.initPie();
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .border {
        border-style: solid;
        border-width: 1px;
        border-color: #CFCFCF
    }

    .t1 {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #7A7A7A;
    }

    .c1 {
        font-size: 15px;
        text-align: center;
        margin-bottom: 20px;
        margin-top: 10px;
        display: flex;
        justify-content: space-between
    }
</style>
