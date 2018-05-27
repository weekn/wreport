define(['jquery', "wangEditor","jsviews","jquery.bootstrap"], function($, E) {



    function Login_m(){
        this.account="";
        this.password="";

        this.login=function(){
            console.log("login--"+this.account+"  "+this.password);
            var data={
                username:this.account,
                password:this.password
            };

            gc.ajax("/token","POST",data,"",function(rsp){
                gc["user"]=rsp["response"];
                console.log(JSON.stringify(gc["user"]));
                window.localStorage.setItem("wreport_user",JSON.stringify(gc["user"]));
                window.location.href="index.html#/myReport";
            })

        };
        this.init=function(tmpl){
            var that=this;
            var app={login:that};
            var myTemplate = $.templates(tmpl);

            myTemplate.link("[moudule=m_login]", app)
                .on("click",".login_login button",function(e){

                    that.login();
                })

        }
    }
    return Login_m;
});