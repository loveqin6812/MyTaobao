<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
        <!-- 展示添加到购物车的商品信息 -->
        <div>{{$store.state.cartList.length}}</div>
        <ul>
            <li v-for="item in $store.state.cartList">{{item}}</li>
        </ul>
        <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
            <detail-swiper :top-images="topImages"></detail-swiper>
            <detail-base-info :goods="goods"></detail-base-info>
            <detail-shop-info :shop="shop"></detail-shop-info>
            <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"></detail-goods-info>
            <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
            <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
            <goods-list :goods="recommends" ref="recommend"></goods-list>
        </scroll>
        <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
        <detail-bottom-bar @addCart="addCart"></detail-bottom-bar>
    </div>
</template>
<script>
    import DetailNavBar from './childComps/DetailNavBar'
    import DetailSwiper from './childComps/DetailSwiper'

    import {getDetail,Goods,Shop,GoodsParam,getRecommend} from 'network/detail'
    import Scroll from 'components/common/scroll/Scroll'
    
    import DetailBaseInfo from './childComps/DetailBaseInfo'
    import DetailShopInfo from './childComps/DetailShopInfo'
    import DetailGoodsInfo from './childComps/DetailGoodsInfo'
    import DetailParamInfo from './childComps/DetailParamInfo'
    import DetailCommentInfo from './childComps/DetailCommentInfo'
    import GoodsList from 'components/content/goods/GoodsList'
    // import BackTop from 'components/content/backTop/BackTop'
    import DetailBottomBar from './childComps/DetailBottomBar'


    import {debounce} from '../../common/utils'
    // 采用混入
    import {itemListenerMixin,backTopMixin} from '../../common/mixin'



    export default {
        name:"Detail",
        components:{
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            Scroll,
            DetailGoodsInfo,
            DetailParamInfo,
            DetailCommentInfo,
            // BackTop,
            DetailBottomBar,
            GoodsList
        },
        data(){
            return {
                iid:null,
                topImages:[], //保存轮播图的数据
                goods:{},// 保存商品的基本信息(与DetailBaseInfo.vue中的goods一致)
                shop:{},//保存店铺信息的数据
                detailInfo:{},//保存商品详情图片的数据
                paramInfo:{},//保存参数信息的数据
                commentInfo:{},//保存评论信息的数据
                recommends:[],//保存推荐信息的数据
                // itemImageListener:null,//保存GoodsListItem.vue中图片监听的函数---采用混入
                themeTopYs:[],//保存主题对应的offsetTop值
                getThemeTopY:null,
                currentIndex:0,//记录选中的哪个主题
                // isShowBackTop:false,//返回顶部图标
            }
        },
        mixins:[itemListenerMixin,backTopMixin],
        created(){
            // 1.保存传入的iid
            this.iid = this.$route.params.iid;
            // 2.通过iid请求详情页的数据
            getDetail(this.iid).then(res=>{
                // console.log(res)
                const data = res.result;
                // 2.1.抽取想要展示的数据
                this.topImages = data.itemInfo.topImages;
                // 2.2.获取商品的基本信息
                this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services);
                // 2.3.获取店铺信息的数据
                this.shop = new Shop(data.shopInfo)
                // 2.4.获取商品的详情图片数据
                this.detailInfo = data.detailInfo
                // 2.5.获取参数信息的数据
                this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
                // 2.6.获取评论信息的数据
                if(data.rate.cRate !== 0){
                    this.commentInfo = data.rate.list[0];
                }
                // 这里不行的原因：
                // 图片还没有完全加载过来
                // this.$nextTick(()=>{
                //     this.themeTopYs = [];
                //     this.themeTopYs.push(0);
                //     this.themeTopYs.push(this.$refs.params.$el.offsetTop);
                //     this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
                //     this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
                //     console.log(this.themeTopYs)
                // })
            });
            // 3.请求推荐数据
            getRecommend().then(res=>{
                console.log(res)
                this.recommends = res.data.list;
            })
            // 4.给getThemeTopY赋值
            // 为什么在这里进行
            // 防抖操作就是阻止某一个操作被频繁进行，提高性能，防抖就是函数的封装
            // 防抖的执行是在图片加载事件中进行
            this.getThemeTopY = debounce(()=>{
                this.themeTopYs = [];
                this.themeTopYs.push(0);
                this.themeTopYs.push(this.$refs.params.$el.offsetTop);
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
                this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
                //themeTopYs的值[0, 13841, 15113, 15329, 1.7976931348623157e+308]
                // 空间换时间（执行性能）
                this.themeTopYs.push(Number.MAX_VALUE); 
                console.log(this.themeTopYs)
            },100)
        },
        methods:{
            
            detailImageLoad(){
                
                this.refresh()//因为混入了所以可以直接使用
                
                this.getThemeTopY();  
            },
            titleClick(index){
                this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
            },
            contentScroll(position){
                // console.log(position)
                // 1.获取y值
                const positionY = -position.y;
                // 2.positionY和主题中的值进行对比
                //  [0, 13841, 15113, 15329]
                // positionY在0 和13841之间，index=0
                // positionY在13841 和15113之间，index=1
                // positionY在15113 和15329之间，index=2
                // positionY >= 15329，index=3
                let length = this.themeTopYs.length;
                // 优化后
                for(let i=0;i<length-1;i++){//不遍历最后一个数据
                    if(this.currentIndex !== i && 
                    (positionY>=this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
                        this.currentIndex = i;
                        this.$refs.nav.currentIndex = this.currentIndex; 
                    }
                }
                
                this.listenShowBackTop(position);
            },
            // backClick(){
            //     this.$refs.scroll.scrollTo(0,0,500);
            // },
            // 加入购物车
            addCart(){
                // 1.获取购物车需要展示的信息
                // console.log('aaa')
                const product = {};
                product.image = this.topImages[0];
                product.title = this.goods.title;
                product.desc = this.goods.desc;
                product.price = this.goods.realPrice;
                product.iid = this.iid;
                console.log(product)
                // 2.将商品加入到购物车---使用vuex（先将product对象放在vuex中，）
                this.$store.dispatch('addCart',product);
            }
        },
        mounted(){
            
        },
        destroyed(){
            this.$bus.$off('itemImageLoad',this.itemImageListener);
        }
    }
</script>
<style scoped>
    #detail{
        height: 100vh;
        position: relative;
        z-index: 9;
        background-color: #fff;
        overflow: hidden;
    }
    /* 解决导航跟着内容一起滚动问题 */
    .detail-nav{
        position: relative;
        z-index: 9;
        background-color: #fff;
    }
    .content{
        /* 100%是基于父元素的视口高度 */
        height: calc(100% - 44px - 49px);
        /* position: absolute;
        top: 44px;
        bottom: 60px; */
    }
</style>