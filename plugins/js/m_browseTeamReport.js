define(['jquery', "wangEditor","jsviews","jquery.bootstrap"], function($, E) {
    var get_data_path="data/user_report.json";
    var editor_record_dic={};
    function ReportItem(name,id,report){
        this.name="";
        this.id="";
        this.report="";
        this.cata="";
        this.editor_outcome="";
        this.editor_problem="";
        this.editor_plan="";

    }
    function ReportDetail(){
        this.top="11px";
        this.left="100px";
        this.editor="null";
        this.open=function(editor){
            var window_width = $(window).width();
            var window_height = $(window).height();
            var w=$(".teamReportDetail").width();
            var height=$(".teamReportDetail").height();


            var res_height=(window_height-height)/2;
            if(res_height<0){
                res_height=0;
            }


            $.observable(this).setProperty("left",(window_width-w)/2+"px");
            $.observable(this).setProperty("top",res_height+$(document).scrollTop());

            if(this.editor=="null"){
                this.editor=new E(".teamReportDetail_editor");
                this.editor.create();
            }
            $(".teamReportDetail").show();
            $("body,html").addClass("flow_lock");
            $("body").on("touchmove",function(event){        event.preventDefault;    }, false)
        }
        this.close=function(){
            $(".teamReportDetail").hide();
            $("body,html").removeClass("flow_lock");
        }
    }
    function BrowseTeamReport_m(){
        this.reports=[];
        this.reportDetail=new ReportDetail();
        this.getReport=function(){

            var that=this;
            $.get(get_data_path,function(json){

                // for(var i0 in json){
                //     var c0=json[i0];
                //     for(var i1 in c0["sub"]){
                //         var c1=c0["sub"][i1];
                //         for (var i2 in c1["sub"]){
                //             var c2=c1["sub"][i2];
                //             var item=new ReportItem(c0,c1,c2);
                //         }
                //     }
                // }


                $.observable(that.reports).refresh(json);
                editor_record_dic={}//clean
                $(".teamReport_content_content").each(function(i){
                    //遍历建立所有editor
                    var pro_id=$(this).closest("[pro_id]").attr("pro_id");
                    editor_record_dic[pro_id]= new E("",this);
                    editor_record_dic[pro_id].customConfig.zIndex = 0;
                    editor_record_dic[pro_id].create();
                    editor_record_dic[pro_id].$textElem.attr('contenteditable', false);
                })
                $("html,body").animate({scrollTop:0},0);//回顶端
                // document.querySelector("html").classList.add("lock");
                // window.addEventListener("mousewheel", this.forbidScroll);
                // window.addEventListener("touchmove", this.forbidScroll, { passive: false });

            });
        };



        this.init=function(tmpl){
            var that=this;

            var app = {
                allreport:this.reports,
                reportDetail:this.reportDetail
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

                })//
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
                .on("dblclick",".teamReport_content_content",function(){
                    var id=$(this).closest("[pro_id]").attr("pro_id");
                    that.reportDetail.open();



                })
                .on("click",".teamReportDetail_back",function(){
                    that.reportDetail.close();
                })

            //初始化编辑器

            this.getReport();
        }
    }
    return BrowseTeamReport_m;
});