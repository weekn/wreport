require.config({
	baseUrl: "plugins/",
    paths : {
        "jquery" : "js/jquery-3.3.1.min",
        "jquery.bootstrap":"bootstrap-3.3.7-dist/js/bootstrap.min",
        "jsviews":"jsview/jsviews.min",
        "index":"js/index",
        "wangEditor":"wangEditor-3.0.16/release/wangEditor.min",
        "reportItem":"js/reportItem",
        "index":"js/index"
        
    },
    shim: {

    	"jquery.bootstrap": {
            deps: ['jquery']
        }
    }
})

require(["jquery","index"],function($){
    $(document).ready(function(){
        $.get("addReport.html", function(data) {
        
            $(".panel").html(data);
        })
    })
    
})

// require(["jquery","wangEditor","jquery.bootstrap","index","reportItem","jsviews"],function($,E){
//     $(function(){
//         // alert(E);  
//     })
// })

