<template>
    <tab-bar>
        <tab-bar-item path="/home" activeColor="deepYellow">
          <img slot="slot-icon" src="~assets/img/tabbar/home.svg" alt="">
          <img slot="slot-icon-active" src="~assets/img/tabbar/home_active.svg" alt="">
          <div slot="slot-text">首页</div>
        </tab-bar-item>
        <tab-bar-item path="/category" activeColor="deepPink">
          <img slot="slot-icon" src="~assets/img/tabbar/category.svg" alt="">
          <img slot="slot-icon-active" src="~assets/img/tabbar/category_active.svg" alt="">
          <div slot="slot-text">分类</div>
        </tab-bar-item>
        <tab-bar-item path="/cart" activeColor="deepPink">
          <img slot="slot-icon" src="~assets/img/tabbar/cart.svg" alt="">
          <img slot="slot-icon-active" src="~assets/img/tabbar/cart_active.svg" alt="">
          <div slot="slot-text">购物车</div>
        </tab-bar-item>
        <tab-bar-item path="/profile">
          <img slot="slot-icon" src="~assets/img/tabbar/profile.svg" alt="">
          <img slot="slot-icon-active" src="~assets/img/tabbar/profile_active.svg" alt="">
          <div slot="slot-text">我的</div>
        </tab-bar-item>
      </tab-bar>
</template>
<script>
    import TabBar from 'common/tabbar/TabBar'; 
    import TabBarItem from 'common/tabbar/TabBarItem'; 
    export default {
        name:'MainTabBar',
        components:{
            TabBar,
            TabBarItem
        }
    }
</script>
<style>

</style>