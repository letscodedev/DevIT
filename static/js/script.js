
$(document).ready(function () {

    const appConfig = new blockstack.AppConfig(['store_write', 'publish_data'], "http://localhost:8080", "http://localhost:8080/dashboard.html")
    var userSession = new blockstack.UserSession({ appConfig })

    if ($(window).width() <= 1199) {
        console.log("Mobile View");
        $('.show').on('click', function () {
            $('#left-icons').animate({
                left: 1000
            }, 'slow');
            $('#left-icons').fadeOut('slow');
            // $("#image").css('margin-top', '30px');
            // $("#image").css('width', '75%');
            $("#image").animate({
                'margin': '10%',
                'margin-top': '50%'
            }, 'slow');

            setTimeout(function () {
                $("#testing").fadeIn();
                var count = 0;
                do {
                    $('#testing').fadeOut(1000).fadeIn(1000);
                    count++;
                } while (count < 15);
            }, 2000);
        });
    } else {
        $('.show').on('click', function () {
            $('#left-icons').animate({
                left: 1000
            }, 'slow');
            $('#left-icons').fadeOut('fast');

            $("#image").animate({
                'margin-left': '530'
            }, 'slow');
            $("#image").css('margin-top', '30px');
            $("#image").animate({
                'width': '50%'
            }, 'slow');

            setTimeout(function () {
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
    }


})