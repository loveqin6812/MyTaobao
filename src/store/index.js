import Vue from 'vue'
import Vuex from 'vuex'

// 1.安装插件
Vue.use(Vuex)

// 2.创建store对象
const store = new Vuex.Store({
    state:{
        cartList:[],//cartList:['商品1','商品2']
    },
    mutations:{
        // mutations唯一的目的就是修改state中的状态
        // mutations中中每个方法尽可能完成的事件单一一点
       addCounter(state,payload){
           payload.count ++;
       },
       addToCart(state,payload){
           state.cartList.push(payload)
       }
    },
    getters:{},
    actions:{
        // actions中除了放网络请求的代码外，还放一些逻辑判断的代码
        addCart(context,payload){
            // 1.查找之前数组中是否有该商品
            // payload是新添加的商品
            let oldProduct = null; 
            for(let item of context.state.cartList){
                if(item.iid === payload.iid){
                    oldProduct = item;
                }
            }
            // 2.判断oldProduct
            if(oldProduct){
                context.commit('addCounter',oldProduct)
            }else{
                payload.count = 1;
                context.commit('addToCart',payload)
            }
        }
    },
    modules:{}
})
// 3.挂载到vue实例上
export default store
