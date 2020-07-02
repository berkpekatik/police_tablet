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


    var playerList = []
    $(document).ready(function () {
        $.post('http://police_tablet/getPlayers', JSON.stringify(""), function (cb) {
            playerList = cb
            Refresh();
        });
        $("#updateForm").hide();
    });

    function Refresh() {
        $("#getPlayers2 option").remove().selectpicker("refresh");
        $("#getPlayers3 option").remove().selectpicker("refresh");
        $("#getPlayers option").remove().selectpicker("refresh");
        jQuery.each(playerList, function (index, value) {
            $("#getPlayers2").append('<option value="' + value.identifier + '">' + value.firstname + ' ' + value.lastname + '</option>').selectpicker("refresh");
            $("#getPlayers").append('<option value="' + value.identifier + '">' + value.firstname + ' ' + value.lastname + '</option>').selectpicker("refresh");
            $("#getPlayers3").append('<option value="' + value.identifier + '">' + value.firstname + ' ' + value.lastname + '</option>').selectpicker("refresh");
        });

        jQuery.each(playerList, function (index, value) {
            $("#getPlayers").append('<option value="' + value.identifier + '">' + value.firstname + ' ' + value.lastname + '</option>').selectpicker("refresh");
        });
    }

    $('#addRecord').on('click', function () {
        $("#successError").show();
        $("#successError").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        setTimeout(function () {
            $("#successError").hide()
        }, 3000);
        var form = $("#recordForm").serializeArray();
        $.post('http://police_tablet/crimePageAdd', JSON.stringify(form));
    });

    $('#seeRecord').on('click', function () {
        GetCrime();
    });

    $('#nav-warrant-tab').on('click', function () {

        $("#warrantTable td").remove();
        $.post('http://police_tablet/warrantPageGetAll', JSON.stringify(""), function (cb) {
            jQuery.each(cb, function (index, value) {
                $("#warrantTable")
                    .append("<tr id='warrant-" + value.id + "'><td>" + value.firstname + " " + value.lastname + "</td><td>"
                        + value.crime + "</td><td>" + value.endofcrime + "</td><td><a href='#' onclick='DeleteWarrant(" + value.id + ")'><i class='fas fa-trash-alt'></i></a></td></tr>");
            });

        });
    });

    function GetCrime() {
        $("#recordsTable td").remove();
        var player = $("#getPlayers").val();
        $.post('http://police_tablet/crimePageGetAll', JSON.stringify(player), function (cb) {
            jQuery.each(cb, function (index, value) {
                $("#recordsTable")
                    .append("<tr id=" + value.id + "><td>" + value.senderfirstname + " " + value.senderlastname + "</td><td>"
                        + value.crime + "</td><td>" + value.dateofcrime + "</td><td><a href='#' onclick='EditRecord(" + "\"" + value.crime + "\"" + "," + value.id + ")'><i class='fas fa-pen' ></i></a> <a href='#' onclick='DeleteRecord(" + value.id + ")'><i class='fas fa-trash-alt'></i></a></td></tr>");
            });
        });
    }

    function DeleteRecord(id) {
        $(".swal2-modal").css('background-color', 'transparent');//Optional changes the color of the sweetalert 
        $(".swal2-container.in").css('background-color', 'transparent');//changes the color of the overlay
        Swal.fire({
            text: "Silmek istediğine emin misin ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet!',
            cancelButtonText: 'Hayır'
        }).then((result) => {
            if (result.value) {
                $.post('http://police_tablet/crimePageRemove', JSON.stringify(id));
                $("#successErrorx2").show();
                $("#successErrorx2").text("Kayıt sistemde başarılı bir şekilde silindi!");
                $("#successErrorx2").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                setTimeout(function () {
                    $("#successErrorx2").hide()
                }, 3000);
                setTimeout(function () {
                    $("#updateForm").hide()
                }, 500);
                $('#' + id + '').remove();
            }
        })
        
    }
    function DeletePenal(id) {
        $(".swal2-modal").css('background-color', 'transparent');//Optional changes the color of the sweetalert 
        $(".swal2-container.in").css('background-color', 'transparent');//changes the color of the overlay
        Swal.fire({
            text: "Silmek istediğine emin misin ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet!',
            cancelButtonText: 'Hayır'
        }).then((result) => {
            if (result.value) {
                $.post('http://police_tablet/removeBill', JSON.stringify(id));
                $("#fakename").text("Kayıt silindi!");
                $("#fakename").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                $('#penal-' + id + '').remove();
            }
        })
    }
    function DeleteWarrant(id) {
        $(".swal2-modal").css('background-color', 'transparent');//Optional changes the color of the sweetalert 
        $(".swal2-container.in").css('background-color', 'transparent');//changes the color of the overlay
        Swal.fire({
            text: "Silmek istediğine emin misin ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet!',
            cancelButtonText: 'Hayır'
        }).then((result) => {
            if (result.value) {
                $.post('http://police_tablet/crimePageRemove', JSON.stringify(id));
                $("#successErrorx3").show();
                $("#successErrorx3").text("Kayıt sistemde başarılı bir şekilde silindi!");
                $("#successErrorx3").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                setTimeout(function () {
                    $("#successErrorx3").hide()
                }, 3000);
                $('#warrant-' + id + '').remove();
            }
        })
    }

    function EditRecord(text, id) {
        $("#updateForm").show()
        $("#updateNeden").val(text);
        $("#crimeId").text(id);
    }

    $("#update").click(function () {
        var crime = $("#updateNeden").val();
        var crimeId = $("#crimeId").text();
        $.post('http://police_tablet/crimePageUpdate', JSON.stringify({ id: crimeId, text: crime }));
        setTimeout(function () {
            GetCrime()
        }, 1000);
        $("#successErrorx2").show();
        $("#successErrorx2").text("Kayıt sistemde başarılı bir şekilde değiştirildi!");
        $("#successErrorx2").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        setTimeout(function () {
            $("#successErrorx2").hide()
        }, 3000);
    });

    $("#addPanel").click(function () {

        var panelForm = $("#panel").serializeArray();
        var selectedFineText = $("#finelist option:selected").text();
        var selectedFineAmount = $("#finelist option:selected").val();
        $.post('http://police_tablet/sendPenal', JSON.stringify({ id: panelForm[0].value, label: selectedFineText, amount: selectedFineAmount }));
        $("#successErrorx4").show();
        $("#successErrorx4").text("Kayıt sisteme başarıyla eklendi!");
        $("#successErrorx4").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        setTimeout(function () {
            $("#successErrorx4").hide()
        }, 3000);
    });

    $("#finecategory").change(function () {
        $.post('http://police_tablet/getAllFines', JSON.stringify($("#finecategory option:selected").val()), function (cb) {
            $("#finelist option").remove().selectpicker("refresh");
			jQuery.each(cb, function (index, value) {
                $("#finelist").append('<option data-subtext="' + value.amount + '$" value="' + value.amount + '">' + value.label + '</option>').selectpicker("refresh");
            });
        });
    });

    $("#refreshAllPlayers").click(function () {
        $("#getPlayers option").remove().selectpicker("refresh");
        $.post('http://police_tablet/getPlayers', JSON.stringify(""), function (cb) {

            jQuery.each(cb, function (index, value) {
                $("#getPlayers").append('<option value="' + value.identifier + '">' + value.firstname + ' ' + value.lastname + '</option>').selectpicker("refresh");
            });
        });

    });

    $("#refreshAllPlayers3").click(function () {
        $("#getPlayers3 option").remove().selectpicker("refresh");
        $.post('http://police_tablet/getPlayers', JSON.stringify(""), function (cb) {

            jQuery.each(cb, function (index, value) {
                $("#getPlayers3").append('<option value="' + value.identifier + '">' + value.firstname + ' ' + value.lastname + '</option>').selectpicker("refresh");
            });
        });

    });

    $("#refreshAllPlayers2").click(function () {
        $("#getPlayers2 option").remove().selectpicker("refresh");
        $.post('http://police_tablet/getPlayers', JSON.stringify(""), function (cb) {
            jQuery.each(cb, function (index, value) {
                $("#getPlayers2").append('<option value="' + value.identifier + '">' + value.firstname + ' ' + value.lastname + '</option>').selectpicker("refresh");
            });

        });
    });
    $("input[name='inlineRadioOptions']").change(function () {
        var selectedRadio = $('input[name=inlineRadioOptions]:checked').val();
        if (selectedRadio == 1) {
            $("#fullname").attr("placeholder", "Şahıs İsmi Girin");
        } else {
            $("#fullname").attr("placeholder", "Plaka Girin");
        }

    });
    $("#search").click(function () {
        var name = $("#fullname").val();
        $("#fakename").text("");
        var selectedRadio = $('input[name=inlineRadioOptions]:checked').val();
        var data = JSON.stringify({ name: name, value: selectedRadio });
        $.post('http://police_tablet/searchButton', data, function (cb) {
            $("#carTable td").remove();
            $("#billingTable td").remove();
            if (cb == "Sonuç Bulunamadı!") {
                $("#fakename").text(cb);
                $("#fakename").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                return;
            }
            $("#fakename").text(cb.fullname);
            $("#fakename").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
            jQuery.each(cb.cars, function (index, value) {
                var status = "Dışarda";
                if (value.stored) {
                    status = "Garajda"
                }
                $("#carTable").append("<tr><td>" + value.plate + "</td><td>" + status + "</td></tr>");
            });

            jQuery.each(cb.billings, function (index, value) {
                var date = new Date(value.date);
                $("#billingTable").append("<tr id='penal-" + value.id + "'><td>" + value.sender + "</td><td>" + value.label + "</td><td>" + value.amount + "$</td><td style='font-size:12px;'>" + date.toLocaleString() + "</td><td><a href='#' onclick='DeletePenal(" + value.id + ")'><i class='fas fa-trash-alt'></i></a></td></tr>");
            });
        });

    });



    $('body').on('keydown', function (e) {
        var code = e.keyCode || e.which;
        if (code == 120) {
            Close();
        }
    });
    $(document).ready(function () {
        $(".nav-tabs a").click(function () {
            $(this).tab('show');
			$.post('http://police_tablet/getPlayers', JSON.stringify(""), function (cb) {
				playerList = cb
				Refresh();
			});
        });

        $("#successError").hide();
        $("#successErrorx2").hide();
        $("#successErrorx3").hide();
        $("#successErrorx4").hide();
    });




    var navs = ["nav-home", "nav-penal", "nav-crime-add", "nav-crime-show", "nav-warrant"];
    $("#nav-home-tab").click(function () {
        console.log($(this).attr('id'))
        for (var i = 0; i < navs.length; i++) {
            if (navs[i] != $("#nav-home").attr('id')) {
                $("#" + navs[i]).hide();
            } else {
                $("#" + navs[i]).show();
            }
        }
    });
    $("#nav-penal-tab").click(function () {
        console.log($(this).attr('id'))
        for (var i = 0; i < navs.length; i++) {
            if (navs[i] != $("#nav-penal").attr('id')) {
                $("#" + navs[i]).hide();
            } else {
                $("#" + navs[i]).show();
            }
        }
    });
    $("#nav-crime-add-tab").click(function () {
        console.log($(this).attr('id'))
        for (var i = 0; i < navs.length; i++) {
            if (navs[i] != $("#nav-crime-add").attr('id')) {
                $("#" + navs[i]).hide();
            } else {
                $("#" + navs[i]).show();
            }
        }
    });
    $("#nav-crime-show-tab").click(function () {
        console.log($(this).attr('id'))
        for (var i = 0; i < navs.length; i++) {
            if (navs[i] != $("#nav-crime-show").attr('id')) {
                $("#" + navs[i]).hide();
            } else {
                $("#" + navs[i]).show();
            }
        }
    });
    $("#nav-warrant-tab").click(function () {
        console.log($(this).attr('id'))
        for (var i = 0; i < navs.length; i++) {
            if (navs[i] != $("#nav-warrant").attr('id')) {
                $("#" + navs[i]).hide();
            } else {
                $("#" + navs[i]).show();
            }
        }
    });
