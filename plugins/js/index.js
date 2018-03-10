define(['jquery', "wangEditor"], function($, E) {
    
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
    })


});



