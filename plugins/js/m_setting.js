define(['jquery', "jqueryui","jquery.bootstrap"], function($) {
    // var get_running_project_path="data/project_data.json";
    var get_running_project_path="/project";
    var add_project_path="/project"
    var getTeamInfo_path="/user/team"
    function Setting(){
        this.runningProject=[];
        this.dialog = "";
        this.project_dialog={//用于数据绑定
            pro_name:"",
            status:0,//0表示新增，1表示update
            team_members:[],
            roles:[],
            brief:""
        };
        this.getRunningProject=function(){
            var that=this;
            gc.ajax(get_running_project_path,"GET","","",function(json){
                $.observable(that).setProperty("runningProject",json["response"]);
            });

        };
        this.refresh=function(){
            var that=this;
            gc.ajax(getTeamInfo_path,"GET","","",function(rsp){

                $.observable(that.project_dialog).setProperty("team_members",rsp["response"][0]["members"]);

                that.getRunningProject();
            })
        };
        this.addProject=function(data){
            var that=this;
            gc.ajax(add_project_path,'POST',data,"",function(rsp){
                $.observable(that).setProperty("runningProject",rsp['response']);
            });

        };
        this.resetProject=function(data){
            var that=this;
            gc.ajax(add_project_path,"PUT",data,"",function(rsp){
                $.observable(that).setProperty("runningProject",rsp['response']);
            });
        };
        this.deleteProject=function(id){
            var that=this;
            var url=add_project_path+"/"+id;
            gc.ajax(url,"DELETE","","",function(rsp){
                $.observable(that).setProperty("runningProject",rsp['response']);
            });

        };
        this.init=function(tmpl){
            var that=this;
            var app = {
                setting: this
            };
            var helpers = {
                selectArole: function(r,e,ev){
                    var ifhas=false;
                    var role=ev.linkCtx.data;
                    role["role"]=r;
                    for(var i in that.project_dialog.roles){
                        if(that.project_dialog.roles[i]==role){
                            ifhas=true;
                            break;
                        }
                    }
                    if(!ifhas){
                        $.observable(that.project_dialog.roles).insert(role);

                    }

                },
                deleteRole:function(e,ev){
                    var index=0;
                    var role=ev.linkCtx.data;
                    that.project_dialog.Arole

                    for(var i in that.project_dialog.roles){
                        if(that.project_dialog.roles[i]["id"]==role["id"]){
                            index=i;
                            break;
                        }
                    }
                    $.observable(that.project_dialog.roles).remove(index)
                },
                reSetPor:function(e,ev){
                    var pro=ev.linkCtx.data;
                    that.project_dialog["id"]=pro["id"];
                    that.project_dialog.status=1;
                    var pro_name=pro["name"];
                    var start_time=pro["plan_start_time"];
                    var end_time=pro["plan_end_time"]
                    var roles=[];
                    for(var i in pro["roles"] ){
                        roles.push({
                            user_id:pro["roles"][i]["user_id"],
                            role:pro["roles"][i]["role"],
                            username: pro["roles"][i]["user_name"]
                        })
                    }
                    $( "#team_setting_addPro" ).find("#add_pro_name").val(pro_name);
                    $( "#team_setting_addPro" ).find("#pro_set_starttime").val( new Date(start_time).format("yyyy-MM-dd"));
                    $( "#team_setting_addPro" ).find("#pro_set_endtime").val((new Date(end_time)).format("yyyy-MM-dd"));
                    $.observable(that.project_dialog).setProperty("roles",roles);
                    that.dialog.dialog( "open" );
                }
            };
            var myTemplate = $.templates(tmpl);
            myTemplate.link(".panel [moudule=m_setting]", app,helpers)
                .ready(function(){
                    $( "#pro_set_starttime" ).datepicker({
                        dateFormat: "yy-mm-dd"
                    });
                    $( "#pro_set_endtime" ).datepicker({
                        dateFormat: "yy-mm-dd"
                    });

                    that.dialog=$( "#team_setting_addPro" ).dialog({
                        draggable:false,
                        autoOpen:false,
                        // height: 400,
                        // width: 350,
                        height: $(window).height()-8,
                        width: $(window).width()-8,
                        modal: true,
                        buttons: {
                            "确认增加": function(){
                                var level=$( "#team_setting_addPro" ).find(".validateTips").attr("add_pro_level");
                                var up_id=$( "#team_setting_addPro" ).find(".validateTips").attr("up_id");
                                var pro_name=$( "#team_setting_addPro" ).find("#add_pro_name").val();
                                var pro_starttime=$( "#team_setting_addPro" ).find("#pro_set_starttime").val();
                                var pro_endtime=$( "#team_setting_addPro" ).find("#pro_set_endtime").val();
                                var pro_roles=[];
                                for(var i in that.project_dialog.roles){
                                    var newrole={
                                        user_id:that.project_dialog.roles[i]["id"],
                                        user_name:that.project_dialog.roles[i]["username"],
                                        role:that.project_dialog.roles[i]["role"]
                                    };
                                    pro_roles.push(newrole)
                                }

                                var json_data={
                                    name:pro_name,
                                    level:level,
                                    up_id:up_id,
                                    plan_start_time:new Date(pro_starttime).getTime(),
                                    plan_end_time:new Date(pro_endtime).getTime(),
                                    roles:pro_roles
                                };
                                console.log(json_data)
                                if(that.project_dialog["status"]==0){//add
                                    that.addProject(json_data);
                                }else{
                                    json_data["id"]= that.project_dialog["id"];
                                    that.resetProject(json_data);
                                }

                                that.dialog.dialog( "close" );
                            },
                            "取消": function() {

                                that.dialog.dialog( "close" );
                            }
                        },
                        open: function(event, ui) {

                            gc.setFlow(false)
                        },
                        close:function(){
                            $( "#team_setting_addPro" ).find("input,textarea").val("");
                            $.observable(that.project_dialog.roles).refresh([])

                            gc.setFlow(true)
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
                    that.project_dialog.status=0;
                    that.dialog.dialog( "open" );
                })
                .on("click","[name=team_setting_add_pro_0]",function(){//增加一级项目
                    var level=0;
                    $( "#team_setting_addPro" ).find(".validateTips").html("您即将添加项目").attr("add_pro_level",level).attr("up_id","");
                    that.project_dialog.status=0;
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

            this.refresh();
        };

    }
    return Setting;
});