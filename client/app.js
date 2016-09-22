/**
 * Created by stepanov on 6/8/16.
 */

require("./sass/main.sass");
require("material-design-lite/material.css");
require("dialog-polyfill/dialog-polyfill.css");
require("./material.js");
require("jquery.event.move");
require("jquery.event.swipe");
require("./swiper.css")
var Swiper = require("./swiper.jquery.js");
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
    var initialSlide = 0;
    $(".mdl-tabs__tab").each(function (key, value){
        if($(value).hasClass('is-active')){
            initialSlide = key;
        }
    })
    //initialize swiper when document ready  and element is exist
    if($(".swiper-container").length > 0){
        var mySwiper = new Swiper ('.swiper-container', {
          // Optional parameters
          initialSlide: initialSlide,
          direction: 'horizontal',
          loop: false,
          prevButton: '#week-one',
          nextButton: '#week-two'
        })
        mySwiper.on('slideChangeStart', function () {
        $(".mdl-tabs__tab").each(function (key, value) {
                if(mySwiper.activeIndex == key){
                    snackbarContainer.MaterialSnackbar.showSnackbar({message: $(value).text()});
                }
                $(value).toggleClass("is-active");
            });
        });
    }
    function getGroups(institute_id) {
        $.ajax({
            url: '/api/group',
            dataType: "json",
            method: "GET",
            data: {
                institute_id: institute_id
            },
            success: function (data) {
                $('#group').empty();
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
                $('#institute').empty();
                $("#group").empty();
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

    $('#favorite').on('click', function()
        {
            $.ajax({
                url: '/api/favorite',
                dataType: 'json',
                data: {
                    group_id: $('#favorite').data('group')
                },
                method: 'POST',
                success: function(data){
                    if(data.data==='updated'){
                        $('#favorite').children().text('favorite');
                        snackbarContainer.MaterialSnackbar.showSnackbar({message: "Групу оновлено!"});
                    }else{
                        snackbarContainer.MaterialSnackbar.showSnackbar({message: "Групу запам’ятовано!"});
                    }
                },
                error: function(data){
                    console.log(data)
                    alert('Проблеми з’єднання з сервером')
                }
            }
            )
        });
    $('#institute').change(function (event) {
        getGroups($(event.target).val())
    });

    $('#group').change(function (event) {
        location.href = '/timetable/' + $(event.target).val()
    });

    (function () {
        var dialogButton = document.querySelector('#list');
        var dialog = document.querySelector('#dialog');
        if(dialog){
            if (!dialog.showModal) {
                dialogPolyfill.registerDialog(dialog);
            }
            if(dialogButton){
                dialogButton.addEventListener('click', function () {
                    dialog.showModal();
                    getInstitutes();
                });
            }
            dialog.querySelector('button:not([disabled])')
                .addEventListener('click', function () {
                    dialog.close();
                });
        }
    })()

});
