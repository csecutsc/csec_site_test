$(document).ready(function () {
    // smooth scrolling
    $("a[href^='#']").on('click', function (e) {
        var hash = this.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top - 50
        }, 1000, function () {
            window.location.hash = hash;
        });
        e.preventDefault();
    });
    // makeshift anti-spam function
    $('.email-link').hover(function () {
        var newHref = $(this).attr('href').replace('unhackable', 'mail.utoronto.ca');
        $(this).attr('href', newHref);
    });
    $('.email-link').hover(function () {
        var newHref = $(this).attr('href').replace('hidemelink', 'me');
        $(this).attr('href', newHref);
    });
});
