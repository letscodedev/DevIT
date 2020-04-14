$(document).ready(function () {

    const appConfig = new blockstack.AppConfig(['store_write', 'publish_data'])
    var userSession = new blockstack.UserSession({ appConfig })


    if (userSession.isSignInPending()) {
        $('#content').animate({
            left: 2000
        }, 2000)
        $('#content').removeClass('#content');
        $('#image-blockchain').animate({
            right: 2000
        }, 2000)
        $('#image-blockchain').removeClass('#image-blockchain');

        $('.yo').delay("slow").fadeIn();
        $('.yo').css('display', 'flex');
        userSession.handlePendingSignIn()
            .then(userData => {

                window.location = "dashboard.html"

            })

    }

    $("#download").click(function () {
        window.location = "cli.html"
    })

    $('#login').click(function () {
        $('#content').animate({
            left: 2000
        }, 2000)
        $('#content').removeClass('#content');
        $('#image-blockchain').animate({
            right: 2000
        }, 2000)
        $('#image-blockchain').removeClass('#image-blockchain');

        $('.yo').delay("slow").fadeIn();
        $('.yo').css('display', 'flex');

        setTimeout(function () {
            if (!userSession.isUserSignedIn()) {
                userSession.redirectToSignIn()
            } else {
                window.location = "dashboard.html"
            }
        }, 2000);
    });


})