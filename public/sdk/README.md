Initialisation

import * as MyFan from "@myfan/base-sdk" 

 Myfan.setAuth({
            redirectUrl : 'redirectUrl',
            clientId : 'clientId',
            responseType : 'token'
        }).init()
        
You do not have to call init(), it is just preloading Iframe for future use and boosting loading 

Myfan.toggleLoginForm() will hide/show the iframe login form


And then you can set listeners

 Myfan.on('login', function (res) {
            console.log("login res:", res)
        })
        
 Myfan.on('register',function (register) {
            console.log("login res:", register)
        })
        
 Myfan.on('error', function (err) {
            console.log("login res:", err)
        })
        
it accepts listeners action name as first parameter as string and second parameter as callback . Happy Using!!!
        
