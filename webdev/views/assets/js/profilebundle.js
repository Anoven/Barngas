(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
$(document).on('click', '.navbar-collapse.in', function (e) {
    if ($(e.target).is('a:not(".dropdown-toggle")')) {
        $(this).collapse('hide');
    }
});
$(document).ready(function () {
    $('.form-control').change(function () {
        if ($('#profile_first_name').val() === '' && $('#profile_last_name').val() === '' && $('#profile_email').val() === '' && $('#profile_phone').val() === '') {
            $('#change_btn').attr('disabled', 'true');
        }
        else {
            $('#change_btn').removeAttr('disabled');
        }
    });
    $("#profile_form").submit(function (event) {
        if ($('#profile_first_name').val() === '') {
            $('#profile_first_name').val($('#profile_first_name').attr('placeholder'));
        }
        if ($('#profile_last_name').val() === '') {
            $('#profile_last_name').val($('#profile_last_name').attr('placeholder'));
        }
        if ($('#profile_email').val() === '') {
            $('#profile_email').val($('#profile_email').attr('placeholder'));
        }
        if ($('#profile_phone').val() === '') {
            $('#profile_phone').val($('#profile_phone').attr('placeholder'));
        }
    });
});

},{}]},{},[1]);
