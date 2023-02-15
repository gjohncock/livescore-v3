/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// <input type="text" val="test" data-role="mywidget" data-height="100" data-inline="true" />

(function($){
    
    $.widget("mobile.mywidget", $.mobile.widget, {
        
        /** Available options for the widget are specified here, along with default values. */
        options: {
            inline: false,
            mode: "default",
            height: 200
        },
        
        /** Mandatory method - automatically called by jQuery Mobile to initialise the widget. */
        _create: function() {
            var inputElement = this.element;
            var opts = $.extend(this.options, inputElement.data("options"));
            $(document).trigger("mywidgetcreate");

//            inputElement.after("<button>" + inputElement.val() + "</button>");
            inputElement.after('<div>contents of my div</div>');
//            ...
        },
        
        /** Custom method to handle updates. */
        _update: function() {
            var inputElement = this.element;
            var opts = $.extend(this.options, inputElement.data("options"));
            $(document).trigger("mywidgetupdate");
//            ...
            inputElement.siblings("button").text(inputElement.val());
//            ...
        },
        
        /* Externally callable method to force a refresh of the widget. */
        refresh: function() {
            return this._update();
        }
    });
    
    /* Handler which initialises all widget instances during page creation. */
    $(document).bind("pagecreate", function(e) {
        $(document).trigger("mywidgetbeforecreate");
        return $(":jqmData(role='mywidget')", e.target).mywidget();
    });
    
})(jQuery);
