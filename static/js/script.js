$(document).ready(function() {

    const appConfig = new blockstack.AppConfig(['store_write', 'publish_data'])
    var userSession = new blockstack.UserSession({ appConfig })

    $('.show').on('click', function() {
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

        setTimeout(function() {
            if (!userSession.isUserSignedIn() || !userSession.isSignInPending()) {
                userSession.redirectToSignIn()
            }
            $("#testing").fadeIn();
            var count = 0;
            do {
                $('#testing').fadeOut(1000).fadeIn(1000);
                count++;
            } while (count < 15);
        }, 2000);
    });
})