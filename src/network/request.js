import axios from 'axios'

export function request(config){
        //1.创建axios实例
    const instance = axios.create({
        baseURL:'http://152.136.185.210:8000/api/h3',
        timeout:5000
    })  
    //2.axios的拦截器
    instance.interceptors.request.use(config=>{//请求成功
        return config
    },err=>{//请求失败
        console.log(err)
    });
    //响应拦截
    instance.interceptors.response.use(res=>{
        return res.data
    },err=>{
        console.log(err)
    })
   return instance(config) //返回一个promise，其他组件在使用的时候就可以.then函数
}








//回调函数的讲解
// aaa = function(){

// }
// function test(aaa,bbb){//aaa和bbb都是函数
//     aaa('hello world')
// }
// test(function(res){//这个函数就是aaa
//     console.log(res)
// },function(err){//这个函数就是bbb
//     console.log(err)
// })