define(['jquery', "jqueryui"], function($) {
    // var get_running_project_path="data/user_report.json";
    var get_running_project_path="http://localhost:8081/project";
    var add_project_path="http://localhost:8081/project"

    function Setting(){
        this.runningProject=[];
        this.getRunningProject=function(){
            var that=this;
            $.get(get_running_project_path,function(json){

                $.observable(that).setProperty("runningProject",json["response"]);
            });
        };
        this.dialog = "";
        this.addProject=function(data){
            var that=this;
            $.ajax({
                  type: 'POST',
                  url: add_project_path,
                  contentType:"application/json",
                  data: JSON.stringify(data),
                  success: function(rsp){
                       $.observable(that).setProperty("runningProject",rsp['response']);
                  }
            });
        }
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
                                }
                                that.addProject(json_data);
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
                .on("click",".fa-plus",function(){
                    var title=$(this).closest("[title]").attr("title");
                    var up_id=$(this).closest("[pro_id]").attr("pro_id");
                    var level=title.split("-").length;
                    $( "#team_setting_addPro" ).find(".validateTips").html("您即将在“"+title+"”下添加子项").attr("add_pro_level",level).attr("up_id",up_id);
                    that.dialog.dialog( "open" );
                })

            this.getRunningProject();
        };

    }
    return Setting;
});