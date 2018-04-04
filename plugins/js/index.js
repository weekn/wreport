define(['jquery', "jqueryui"], function($) {
    
    $(document).ready(function() {
        initWindow();

    });

    $(window).resize(function() { //当浏览器大小变化时
        initWindow()
    });

    var initWindow = function() {
        var top_left_width = $(".top_left").width();
        var top_center_width = $(".top_center").width();
        var top_right_width = $(".top_right").width();
        var window_width = $(window).width();
        //console.log(top_left_width+top_center_width+top_left_width+"   "+window_width)
        if (top_left_width + top_center_width + top_right_width > window_width) {
            $(".top_center").addClass("top_center_small");
            $(".panel").addClass("panel_small")
        } else {
            $(".top_center").removeClass("top_center_small");
            $(".panel").removeClass("panel_small")
        }

    };
    $(".top_center_div a").click(function(){

        $(".top_center_div").removeClass("top_center_active");
        $(this).parent().addClass("top_center_active");
    });

    function TopLeftController(){
        this.dom=$(".top_left");
        this.weekn_d=0;
        this.init=function(){
            var that=this;
            $( "#choose_date" ).datepicker({
                showButtonPanel: true,
                monthNames: [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月r", "十二月" ],
                dayNamesMin  : [ "周日", "周一", "周二", "周三", "周四", "周五", "周六" ],
                defaultDate: +0,
                maxDate: "+1w",
                onClose:function( dateText,inst){

                    var select_date = new Date(dateText);
                    var today_date=new Date();
                    var select_comdays=(select_date.getTime()- select_date.getDay()*(1000*24*60*60))/(1000*24*60*60);
                    var today_comdays=(today_date.getTime()-today_date.getDay()*(1000*24*60*60)-today_date.getHours()*1000*60*60)/(1000*24*60*60);
                    var new_weekn_d=Math.round((today_comdays-select_comdays)/7);
                    // if(new_weekn_d!=that.weekn_d){//有无更新
                    //     that.weekn_d=new_weekn_d;
                    //     if(new_weekn_d>0){//只能选之前或本周
                    //         $("#choose_date_span").html(dateText+" 上"+new_weekn_d+"周");
                    //     }else if(new_weekn_d==0){
                    //         $("#choose_date_span").html("本周");
                    //     }
                    // }
                    if(new_weekn_d!=that.weekn_d){//有无更新
                        //gc.chosenDate=new_weekn_d;
                        that.weekn_d=new_weekn_d;
                        if(new_weekn_d>0){//只能选之前或本周
                            $("#choose_date_span").html(dateText+" 上"+new_weekn_d+"周");
                            gc.ifThisWeek=false;
                        }else if(new_weekn_d==0){
                            $("#choose_date_span").html("本周");
                            gc.ifThisWeek=true;
                        }
                        gc.changeDate(select_date.getTime());
                    }

                    // console.log(timeStamp/(1000*24*60*60))
                    // var select_timedays=today_timeStamp/(1000*24*60*60);
                    // var today_timedays=(new Date().getTime()-new Date().getHours()*1000*60*60)/(1000*24*60*60);
                    // console.log(new Date().getHours())
                    // console.log(today_timeStamp)
                }
            });
            that.dom.find(".fa-calendar,#choose_date_span").click(function(){

                that.dom.find("#choose_date").focus();
            });

        }
    }

    function TopRightController(){
        this.menu_dom=$( "#top_right_menu" );
        this.init=function(){
            var that=this;
            that.menu_dom.menu({

            });
            that.menu_dom.hide();
            $(".top_right").hover(function(){

            },function(){
                that.menu_dom.hide();
            });
            $(".top_right").click(function(){
                that.menu_dom.show();
            });
        }
    }
    var t=new TopLeftController();
    var topr=new TopRightController();
    topr.init();
    t.init();


});



