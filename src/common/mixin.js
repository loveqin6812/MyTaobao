import {debounce} from './utils'
import BackTop from 'components/content/backTop/BackTop'
// 导出一个对象
export const itemListenerMixin = {
    components:{},
    methods:{},
    data(){
        return {
            itemImageListener:null,
            refresh:null,//在这里保存一次直接混入到Detail.vuve中来对DetailGoodsInfo.vue中的图片事件进行防抖封装
        }
    },
    mounted(){
        this.refresh = debounce(this.$refs.scroll.refresh,50);
    
        this.itemImageListener = ()=>{
            this.refresh();
        }
        this.$bus.$on('itemImageLoad',this.itemImageListener);
    }
}
// 首页与详情页的回到顶部的混入封装
export const backTopMixin = {
    components:{
        BackTop
    },
    data(){
        return {
            isShowBackTop:false
        }
    },
    methods:{
        backClick(){
            this.$refs.scroll.scrollTo(0,0,500);
        },
        listenShowBackTop(position){
            this.isShowBackTop = -position.y >1000;
        }
    }
}