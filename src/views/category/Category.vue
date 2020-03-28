<template>
    <div class="wrapper" ref="aaa"> 
        <div class="category">分类</div>
    </div>
</template>
<script>
    import BScroll from 'better-scroll'
    export default {
        name:'Category',
        data(){
            return {
                scroll:null
            }
        },
        //组件创建完后调用
        created(){
          //注意：在created函数中不可以取元素（这里取的不是undefined就是null）  
        },
        mounted(){
            console.log(document.querySelector('.wrapper'))
            this.scroll = new BScroll(document.querySelector('.wrapper'),{}) 
        }
    }
</script>
<style scoped>
    .wrapper{
        height:200px;
        background-color: red;
        /* overflow-y: scroll; */
    }
</style>