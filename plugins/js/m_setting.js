define(['jquery', "jqueryui"], function($) {
    // var get_running_project_path="data/project_data.json";
    var get_running_project_path="/project";
    var add_project_path="/project"
    
    function Setting(){
        this.runningProject=[];
        this.getRunningProject=function(){
            var that=this;
            gc.ajax(get_running_project_path,"GET","","",function(json){
                $.observable(that).setProperty("runningProject",json["response"]);
            });
            // $.get(get_running_project_path,function(json){
            //
            //
            // });
        };
        this.dialog = "";
        this.addProject=function(data){
            var that=this;
            gc.ajax(add_project_path,'POST',data,"",function(rsp){
                $.observable(that).setProperty("runningProject",rsp['response']);
            });
            // $.ajax({
            //       type: 'POST',
            //       url: add_project_path,
            //       contentType:"application/json",
            //       data: JSON.stringify(data),
            //       success: function(rsp){
            //
            //       }
            // });
        };
        this.deleteProject=function(id){
            var that=this;
            var url=add_project_path+"/"+id;
            gc.ajax(url,"DELETE","","",function(rsp){
                $.observable(that).setProperty("runningProject",rsp['response']);
            });
            // $.ajax({
            //     type: 'DELETE',
            //     url: add_project_path+"/"+id,
            //     success: function(rsp){
            //
            //     }
            // });
        };
        this.init=function(tmpl){
            var that=this;
            var app = {
                setting: this
            };
            var myTemplate = $.templates(tmpl);
            myTemplate.link(".panel [moudule=m_setting]", app)
                .ready(function(){


                    that.dialog=$( "#team_setting_addPro" ).dialog({
                        draggable:false,
                        autoOpen:false,
                        height: 400,
                        width: 350,
                        modal: true,
                        buttons: {
                            "确认增加": function(){
                                var level=$( "#team_setting_addPro" ).find(".validateTips").attr("add_pro_level");
                                var up_id=$( "#team_setting_addPro" ).find(".validateTips").attr("up_id");
                                var pro_name=$( "#team_setting_addPro" ).find("#add_pro_name").val();
                                var json_data={
                                    name:pro_name,
                                    level:level,
                                    up_id:up_id
                                };
                                that.addProject(json_data);
                                that.dialog.dialog( "close" );
                            },
                            "取消": function() {

                                that.dialog.dialog( "close" );
                            }
                        },
                        open: function(event, ui) {
                            $( "#team_setting_addPro" ).find("input,textarea").val("")
                        }
                    });
                })
                .on("click",".fa-caret-down",function(){//展开菜单
                    $("[name=setting_fabs]").focus();
                    $(this).nextAll().show();
                })
                .on("mouseout","[name=setting_fabs]",function(e){
                    var evt = window.event||e;
                    var obj=evt.toElement||evt.relatedTarget;
                    var pa=this;
                    if(pa.contains(obj)){
                        return false;
                    } else{
                        $(this).children("span").hide();

                    }

                })
                .on("click","[name=team_setting_add_pro]",function(){//z增加项目
                    var title=$(this).closest("[title]").attr("title");
                    var up_id=$(this).closest("[pro_id]").attr("pro_id");
                    var level=title.split("-").length;
                    $( "#team_setting_addPro" ).find(".validateTips").html("您即将在“"+title+"”下添加子项").attr("add_pro_level",level).attr("up_id",up_id);
                    that.dialog.dialog( "open" );
                })
                .on("click","[name=team_setting_add_pro_0]",function(){//增加一级项目
                    var level=0;
                    $( "#team_setting_addPro" ).find(".validateTips").html("您即将添加项目").attr("add_pro_level",level).attr("up_id","");
                    that.dialog.dialog( "open" );
                })
                .on("click",".fa-trash-o",function(){
                    var title=$(this).closest("[title]").attr("title");
                    var id=$(this).closest("[pro_id]").attr("pro_id");
                    $("#dialog-confirm").find("p").html("确认删除项目“"+title+"”，以及它的子项目吗？")
                    $( "#dialog-confirm" ).dialog({
                        resizable: false,
                        height: "auto",
                        width: 400,
                        modal: true,
                        buttons: {
                            "删除": function() {
                                that.deleteProject(id);
                                $( this ).dialog( "close" );
                            },
                            "取消": function() {
                                $( this ).dialog( "close" );
                            }
                        }
                    });
                })

            this.getRunningProject();
        };

    }
    return Setting;
});