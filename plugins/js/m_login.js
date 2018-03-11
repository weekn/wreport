define(['jquery', "wangEditor","jsviews","jquery.bootstrap"], function($, E) {



    function Login_m(){
        this.account="";
        this.password="";

        this.login=function(){
            console.log("login--"+this.account+"  "+this.password)
            window.location.href="index.html#/myReport";
        };
        this.init=function(tmpl){
            var that=this;
            var app={login:that};
            var myTemplate = $.templates(tmpl);

            myTemplate.link("[moudule=m_login]", app)
                .on("click",".login_login button",function(){
                    that.login();
                })

        }
    }
    return Login_m;
});