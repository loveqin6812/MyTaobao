<template>
    <div class="tab-control">
        <div v-for="(item,index) in titles"
         class="tab-control-item" 
         :class="{active: index === currentIndex}"
         @click="itemClick(index)">
            <span>{{item}}</span>
        </div>
    </div>
</template>
<script>
    export default {
        name:'TabControl',
        props:{
            titles:{
                type:Array,
                default(){
                    return []
                }
            }
        },
        data(){
            return {
                // 记录当前选中的
                currentIndex:0
            }
        },
        methods:{
            itemClick(index){
                this.currentIndex = index;
                // 内部将事件传出去给Home.vue告诉它点击的是哪一个
                this.$emit('tabClick',index);
            }
        }
    }
</script>
<style scoped>
    .tab-control{
        display: flex;
        text-align: center;
        font-size: 15px;
        height: 40px;
        line-height: 40px;
        background-color: #fff;
    }
    .tab-control-item{
        flex:1;
    }
    .active{
        color:var(--color-tint);
    }
    .active span{
        border-bottom:3px solid var(--color-tint);
        /* span可以直接设置padding */
        padding:5px;
    }
</style>