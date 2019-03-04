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
