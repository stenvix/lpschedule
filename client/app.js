/**
 * Created by stepanov on 6/8/16.
 */

require('./sass/main.sass');
require('material-design-lite/material.min.css');
require('material-design-lite/material.min.js');

require('jquery.event.move');
require('jquery.event.swipe');


$(document).ready(function () {
    var snackbarContainer = document.querySelector('#messages');
    $('#timetable')
        .on('movestart', function (e) {
            // If the movestart is heading off in an upwards or downwards
            // direction, prevent it so that the browser scrolls normally.
            if ((e.distX > e.distY && e.distX < -e.distY) ||
                (e.distX < e.distY && e.distX > -e.distY)) {
                e.preventDefault();
            }
        });
    $('#timetable').on('swipeleft', function (event) {
        $('.mdl-tabs__tab').each(function (key, value) {
            if ($(value).hasClass('is-active') && key == 0) {
                $('.mdl-tabs__tab').toggleClass('is-active');
                $('.mdl-tabs__panel').toggleClass('is-active');
            }else if(key==1){
                snackbarContainer.MaterialSnackbar.showSnackbar({message:$(value).text()});
            }
        });
    });
    $('#timetable').on('swiperight', function (event) {
        $('.mdl-tabs__tab').each(function (key, value) {
            if ($(value).hasClass('is-active') && key == 1) {
                $('.mdl-tabs__tab').toggleClass('is-active');
                $('.mdl-tabs__panel').toggleClass('is-active');
            }else if(key==0){
                snackbarContainer.MaterialSnackbar.showSnackbar({message:$(value).text()});
            }
        });

    });
});