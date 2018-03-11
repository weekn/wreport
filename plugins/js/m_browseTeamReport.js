define(['jquery', "wangEditor","jsviews","jquery.bootstrap"], function($, E) {
    var get_data_path="data/user_report.json";


    function BrowseTeamReport_m(){
        this.reports=[]
        this.getReport=function(){

            var that=this;
            $.get(get_data_path,function(json){

                $.observable(that.reports).refresh(json);

                $(".teamReport_content_content").each(function(i){
                    //遍历建立所有editor
                    var editor = new E("",this);
                    editor.customConfig.zIndex = 0;
                    editor.create();
                    editor.$textElem.attr('contenteditable', false);
                })

            });
        };


        this.init=function(tmpl){
            console.log("init breos");

            var app = {
                allreport:this.reports
            };
            var myTemplate = $.templates(tmpl);

            myTemplate.link("[moudule=m_browseTeamReport]", app)
                .on("click",".teamReport_0_top",function(){
                    if( $(this).next().is(':hidden')){　　//如果node是隐藏的则显示node元素，否则隐藏
                        $(this).removeClass("teamReport_0_top_hide");
                    }else{

                        $(this).addClass("teamReport_0_top_hide");

                    }
                    $(this).next().slideToggle();

                })
                .on("click",".teamReport_1_top",function(){
                    if( $(this).next().is(':hidden')){　　//如果node是隐藏的则显示node元素，否则隐藏
                        $(this).removeClass("teamReport_0_top_hide");
                    }else{

                        $(this).addClass("teamReport_0_top_hide");

                    }
                    $(this).next().slideToggle();

                })
                .on("click",".teamReport_2_top",function(){
                    if( $(this).next().is(':hidden')){　　//如果node是隐藏的则显示node元素，否则隐藏
                        $(this).removeClass("teamReport_0_top_hide");
                    }else{

                        $(this).addClass("teamReport_0_top_hide");

                    }
                    $(this).next().slideToggle();

                })

            //初始化编辑器

            this.getReport();
        }
    }
    return BrowseTeamReport_m;
});