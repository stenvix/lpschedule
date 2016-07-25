/**
 * Created by stepanov on 6/8/16.
 */

require("./sass/main.sass");
require("material-design-lite/material.min.css");
require("dialog-polyfill/dialog-polyfill.css");
require("material-design-lite/material.min.js");
require("jquery.event.move");
require("jquery.event.swipe");

var dialogPolyfill = require("dialog-polyfill/dialog-polyfill.js");

$(document).ready(function () {
    $(function () {
        $("#search").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "/api/group",
                    dataType: "json",
                    data: {
                        search: request.term
                    },
                    success: function (data) {
                        // Handle 'no match' indicated by [ "" ] response
                        response(
                            $.map(data['data'], function (value, key) {
                                return {
                                    label: value.group_full_name,
                                    value: value.group_id
                                }
                            })
                        );
                    }
                });
            },
            minLength: 2,
            select: function (event, ui) {
                $("#search").val(ui.item.label);
                location.href = '/timetable/' + ui.item.value;
                return false;
            }
        });
    });
    var snackbarContainer = document.querySelector("#messages");
    $("#timetable")
        .on("movestart", function (e) {
            // If the movestart is heading off in an upwards or downwards
            // direction, prevent it so that the browser scrolls normally.
            if ((e.distX > e.distY && e.distX < -e.distY) ||
                (e.distX < e.distY && e.distX > -e.distY)) {
                e.preventDefault();
            }
        });
    $("#timetable").on("swipeleft", function (event) {
        $(".mdl-tabs__tab").each(function (key, value) {
            if ($(value).hasClass("is-active") && key === 0) {
                $(".mdl-tabs__tab").toggleClass("is-active");
                $(".mdl-tabs__panel").toggleClass("is-active");
            } else if (key === 1) {
                snackbarContainer.MaterialSnackbar.showSnackbar({message: $(value).text()});
            }
        });
    });
    $("#timetable").on("swiperight", function (event) {
        $(".mdl-tabs__tab").each(function (key, value) {
            if ($(value).hasClass("is-active") && key === 1) {
                $(".mdl-tabs__tab").toggleClass("is-active");
                $(".mdl-tabs__panel").toggleClass("is-active");
            } else if (key === 0) {
                snackbarContainer.MaterialSnackbar.showSnackbar({message: $(value).text()});
            }
        });

    });
    function getGroups(institute_id) {
        $.ajax({
            url: '/api/group',
            dataType: "json",
            method: "GET",
            data: {
                institute_id: institute_id
            },
            success: function (data) {
                $('#group option').remove();
                var listitems = '<option disabled selected value> -- Виберіть групу -- </option>';
                $.each(data.data, function (key, value) {
                    listitems += '<option value=' + value.group_id + '>' + value.group_full_name + '</option>';
                });
                $("#group").append(listitems)
            },
            error: function (data) {
                alert("Проблеми з’єднання з сервером!")
            }
        })
    }

    function getInstitutes() {
        $.ajax({
            url: '/api/institute',
            dataType: "json",
            method: "GET",
            success: function (data) {
                var listitems = '<option disabled selected value> -- Виберіть інститут -- </option>';
                $.each(data.data, function (key, value) {
                    listitems += '<option value=' + value.institute_id + '>' + value.institute_abbr + '</option>';
                });
                $("#institute").append(listitems)
            },
            error: function (data) {
                alert("Проблеми з’єднання з сервером!")
            }
        })
    }

    $('#institute').change(function (event) {
        getGroups($(event.target).val())
    });

    $('#group').change(function (event) {
        location.href = '/timetable/' + $(event.target).val()
    });


    (function () {
        var dialogButton = document.querySelector('#list');
        var dialog = document.querySelector('#dialog');
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        dialogButton.addEventListener('click', function () {
            dialog.showModal();
            getInstitutes();

        });
        dialog.querySelector('button:not([disabled])')
            .addEventListener('click', function () {
                dialog.close();
            });
    })()

});