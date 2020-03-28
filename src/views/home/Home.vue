<template>
    <div id="home">
        <nav-bar class="home-nav">
            <div slot="center">购物街</div>
        </nav-bar>
        <tab-control class="tab-control" 
            :titles="['流行','新款','精选']"
             @tabClick="tabClick"
             ref="tabControl1"
             v-show="isTabFixed">
            </tab-control>
        <scroll class="content" 
                ref="scroll" 
                :probe-type="3" 
                @scroll="contentScroll"
                :pull-up-load="true"
                @pullingUp="loadMore">
            <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
            <recommend-view :recommends="recommends"></recommend-view>
            <feature-view></feature-view>
            
            <tab-control :titles="['流行','新款','精选']"
             @tabClick="tabClick"
             ref="tabControl2">
            </tab-control>
            <goods-list :goods="showGoods"></goods-list>
        </scroll>
        <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    </div>
</template>
<script>
    // 导入子组件的地方
    import HomeSwiper from './homeComps/HomeSwiper'
    import RecommendView from './homeComps/RecommendView'
    import FeatureView from './homeComps/FeatureView'
    // 导入公共组件的地方 
    import NavBar from 'components/common/navbar/NavBar'
    import TabControl from 'components/content/tabControl/TabControl'
    import GoodsList from 'components/content/goods/GoodsList'
    // 混入
    // import BackTop from 'components/content/backTop/BackTop'
    // 导入方法、额外的数据的地方
    import {getHomeMultidata,getHomeGoods} from 'network/home'
    // import {debounce} from '../../common/utils'
    // 采用混入
    import {itemListenerMixin,backTopMixin} from '../../common/mixin'


    import Scroll from 'components/common/scroll/Scroll'

  
    export default {
        name:'Home',
        components:{
            HomeSwiper,
            RecommendView,
            FeatureView,
            GoodsList,

            TabControl,
            NavBar,
            Scroll,
            // BackTop
        },
        data(){
            return {
                banners:[],
                recommends:[],
                goods:{
                    'pop':{page:0,list:[]}, //流行
                    'new':{page:0,list:[]},//新款
                    'sell':{page:0,list:[]}//精选
                },
                currentType:'pop',//默认显示pop
                // isShowBackTop:false,//返回顶部图标
                tabOffsetTop:0, //记录tabControl滚动的距离
                isTabFixed:false,//记录tabControl是否吸顶
                saveY:0, //记录离开主页再次进入的时候所处的位置
                // itemImageListener:null,//保存GoodsListItem.vue中图片监听的函数---采用混入
            }
        },
        mixins:[itemListenerMixin,backTopMixin],
         
        computed:{
            showGoods(){
                return this.goods[this.currentType].list;
            }
        },
        created(){ //组件一创建完就在这里进行网络请求
            //1.请求导航跟推荐的多个数据
            this.getHomeMultidata();
            
            //2.请求首页商品数据
            this.getHomeGoods('pop');
            this.getHomeGoods('new');
            this.getHomeGoods('sell');
            
        },
        mounted(){
            
        },
        activated(){
            this.$refs.scroll.scrollTo(0,this.saveY,0) ;
            this.$refs.scroll.refresh();   
        },
        deactivated(){
            // 保存Y值
           this.saveY = this.$refs.scroll.getScrollY();
            //取消全局事件的监听
            this.$bus.$off('itemImageLoad',this.itemImageListener);
        },
        methods:{
            /*
            *【一】事件监听方法
            */
       
            tabClick(index){
                switch(index){
                    case 0:
                        this.currentType = 'pop';
                        break;
                    case 1:
                        this.currentType = 'new';
                        break;
                    case 2:
                        this.currentType = 'sell';
                        break;
                }
                // 让两个TabControl的currentIndex保持一致
                this.$refs.tabControl1.currentIndex = index;
                this.$refs.tabControl2.currentIndex = index;
            },
            
            contentScroll(position){
                // 1，判断BackTop是否显示
                
                this.listenShowBackTop(position);
                // 2.决定tabControl是否吸顶（position：fixed）
                
                this.isTabFixed = (-position.y) > this.tabOffsetTop;
            }, 
            loadMore(){
                this.getHomeGoods(this.currentType);
            },
            //监听轮播图图片的加载事件
            swiperImageLoad(){
                // 获得tabControl的滚动位置，然后与position.y对比
                this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
            },
           /*
            *【二】网络数据请求
            */
            //1、请求的是轮播与推荐的数据
            getHomeMultidata(){
                getHomeMultidata({}).then(res=>{
                    this.banners = res.data.banner.list;
                    this.recommends = res.data.recommend.list;
                })
            },
            // 2、请求的是首页商品列表的数据
            getHomeGoods(type){
                // 动态获取某一类型的页码
                const page = this.goods[type].page + 1;
                getHomeGoods(type,page).then(result=>{ 
                    console.log(result);
                    
                    this.goods[type].list.push(...result.data.list);
                    // 当前页加1，因为已经请求到一页的数据了
                    this.goods[type].page += 1; //将页码加1
                    //完成一次上拉加载更多后调用此方法，因为scroll默认只进行一次上拉加载
                    this.$refs.scroll.finishPullUp()
                })
            }
            // 3、
        },
    }
</script>
<style scoped>
    #home{
        position: relative;
        height:100vh;
    }
   /* 解决导航栏可以滚动问题 */
   .home-nav{
       background-color: var(--color-tint);
       color:#fff;
   }
   
   .tab-control{
       /* 相对定位还在原来的位置 */
       position: relative;
       z-index:9;
   }
   /*better-scroll的使用时必须给父元素设置高度  */
   .content{
       overflow: hidden;
       position: absolute;
       top:44px;
       bottom: 49px;
       left: 0;
       right: 0;
   }
</style>