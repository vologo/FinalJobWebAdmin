<template>
    <div id="card">
        <header>
            <img class="avatar" v-bind:src="user.userFace" v-bind:alt="user.name">
            <p class="name">{{user.realName}}</p>
        </header>
        <footer>
            <input class="search" type="text" v-on:keyup.enter="searchUser"
                   v-model="$store.state.filterKey" placeholder="输入用户姓名，回车确认"></input>
        </footer>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: 'card',
        data() {
            return {
                user: JSON.parse(window.sessionStorage.getItem("currentUser")),
            }
        },
        computed: mapState([
            'users',
        ]),
        methods: {
            searchUser() {
                if(!this.$store.state.filterKey || this.$store.state.filterKey == ''){
                    this.$store.dispatch('initData');
                }
                for (let i = 0; i < this.users.length; i++) {
                    let user = this.users[i];
                    if (user.realName == this.$store.state.filterKey) {
                        let res = [];
                        res[0] = user;
                        this.$store.commit('INIT_USER', res);
                        return;
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    #card {
        padding: 12px;

        .avatar {
            width: 40px;
            height: 40px;
            vertical-align: middle; /*这个是图片和文字居中对齐*/
        }

        .name {
            display: inline-block;
            padding: 10px;
            margin-bottom: 15px;
            font-size: 16px;
        }

        .search {
            background: #26292E;
            height: 30px;
            line-height: 30px;
            padding: 0 10px;
            border: 1px solid #3a3a3a;
            border-radius: 4px;
            outline: none; /*鼠标点击后不会出现蓝色边框*/
            color: #FFF;
        }
    }
</style>
