$(function () {
    function display(bool) {
    if (bool) {
		$('.ipadBox').fadeIn();
        $("body").show();
        $("#police_tablet").show();
    } else {
		$('.ipadBox').stop().fadeOut();
		$("body").hide();
		$("#police_tablet").hide();
    }
}

display(false)

window.addEventListener('message', function(event) {

        var item = event.data;

        if (item.type === "ui") {
            if (item.status == true) {
                display(true)
            } else {
                display(false)
            }
        }


    })
})

function Close(){
	$.post('http://police_tablet/closeButton')
}

