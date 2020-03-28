<template>
    <div class="wrapper" ref="wrapper">
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    import BScroll from 'better-scroll'
   export default {
       name:'Scroll',
       props:{
           probeType:{
               type:Number,
               default:0
           },
           pullUpLoad:{
               type:Boolean,
               default:false
           }
       },
       data(){
           return {
               scroll:null
           }
       },
       mounted(){
        // 1.创建BScroll对象
        this.scroll = new BScroll(this.$refs.wrapper,{
            click:true,//控制类似于div那种元素可以点击的
            probeType:this.probeType,
            pullUpLoad:this.pullUpLoad
        })
        // 2.监听滚动的位置
        this.scroll.on('scroll',position=>{
            this.$emit('scroll',position)
        })
        // 3.监听上拉加载更多事件
        this.scroll.on('pullingUp',()=>{
            this.$emit('pullingUp')
        })
       },
       methods:{
           scrollTo(x,y,time=300){
            //添加this.scroll的原因是在监听图片的加载完成时，
            //图片先于scroll.refresh加载出来
            this.scroll && this.scroll.scrollTo(x,y,time);
           },
           finishPullUp(){
            this.scroll && this.scroll.finishPullUp()
           },
           refresh(){
               console.log('---')
            this.scroll && this.scroll.refresh()
           },
           getScrollY(){
               return this.scroll ? this.scroll.y :0;
           }
       }
   } 
</script>
<style scoped>

</style>