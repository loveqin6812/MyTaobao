<template>
    <div class="tab-bar-item" @click="itemClick">
        <div v-if="!isActive"><slot name="slot-icon"></slot></div>
        <div v-else><slot name="slot-icon-active"></slot></div>
        <div :style="activeStyle"><slot name="slot-text"></slot></div>
    </div>
</template>
<script>
    export default {
        name:'TabBarItem',
        props:{
            path:String,
            activeColor:{
                type:String,
                default:'red'
            }
        },
        data(){
            return {
                // isActive:true
            }
        },
        computed:{
            isActive(){
              return this.$route.path.indexOf(this.path) !==-1;  
            },
            activeStyle(){
                return this.isActive ? {color: this.activeColor} : {};
            }
        },
        methods:{
            itemClick(){
                if(this.path !== this.$route.path)
                this.$router.push(this.path);
            }
        }
    }
</script>
<style>
  .tab-bar-item{
    flex:1;
    text-align: center;
    height: 49px;
    box-shadow: 0 -3px 1px rgba(100,100,100,.1);
    font-size: 14px;
  }
  .tab-bar-item img{
    width: 24px;
    height: 24px; 
    margin-top: 3px;
    vertical-align: middle;
    margin-bottom: 2px;
  }

</style>