//封装所有对首页的请求
import {request} from './request'

//这样封装的意义：方便管理整个首页的
//1、请求轮播与推荐的数据
export function getHomeMultidata(){
    return request({
        url:'/home/multidata'
    })
}
///2、首页商品列表相关的数据
//需要传入两个参数：类型（流行/新款/精选）与页码（page）
export function getHomeGoods(type,page){
    return request({
        url:'/home/data',
        params:{
            type,//pop new sell
            page 
        }
    })
}
// 3、

