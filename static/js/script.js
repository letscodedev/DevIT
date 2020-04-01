$(document).ready(function () {

    const appConfig = new blockstack.AppConfig(['store_write', 'publish_data'])
    var userSession = new blockstack.UserSession({ appConfig })


    if ($(window).width() <= 1199) {
        console.log("Mobile View");
        $('.show').on('click', function () {
            $('#content').animate({
                left: 400
            }, 'slow');
            $('#content').fadeOut('slow');

            $("#image").css('width', '75%');
            $("#image").animate({
                'margin': '10%',
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
            $('#content').animate({
                left:1000
            }, 'slow');
            $('#content').fadeOut('slow');

            $("#image").animate({
                'width': '50%',
                
            }, 'slow');
            $("#image").animate({
                'margin-left': '20%'
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