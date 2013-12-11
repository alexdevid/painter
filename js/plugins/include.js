var Include = function(modules, callback) {
    var text = "<script src='" + modules + ".js' type='text/javascript'></script>";
    var head = document.getElementsByTagName('head')[0];
    $('head').append($(text));  //TODO исправить на нативный жс
};
