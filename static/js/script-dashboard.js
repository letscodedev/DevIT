$(document).ready(function () {

    var domainURL = "http://localhost:8080"
    const appConfig = new blockstack.AppConfig(['store_write', 'publish_data'])
    var userSession = new blockstack.UserSession({ appConfig })
    activeProject();
    function activeProject() {
        (async () => {

            $("#data").empty();
            let projects = await userSession.getFile("created_project.json", { decrypt: true })
            if (projects) {
                projects = JSON.parse(projects)
                let appendContent = ""
                let i = 0
                for (let project in projects.my_projects) {

                    let created_date = new Date(projects.my_projects[project].created_at).getDate() + "/" + new Date(projects.my_projects[project].created_at).getMonth() + "/" + new Date(projects.my_projects[project].created_at).getFullYear()
                    let innerdata = ""
                    innerdata += '<div class="project-box" id="' + project + '">'
                    innerdata += '<div class="project-box-header" style="display:flex; justify-content: space-between;">'
                    innerdata += '<span>project#' + i + '</span>'
                    innerdata += '<span><i class="far fa-clock" style="margin-right: 0.5rem;"></i>' + created_date + '</span>'
                    innerdata += '</div >'
                    innerdata += '<h1>' + project + '</h1>'
                    innerdata += '</div >'
                    appendContent += innerdata
                    i += 1
                    $(document).on('click', '#' + project, function () {
                        window.location = "project-dashboard.html?project_name=" + project
                    })
                }
                $('#data').append('' + appendContent)
            } else {
                $('#data').append('No Projects!')
            }

        })()
    }
});


/*
function pastProject() {
    $("#data").empty();
    console.log("Past Project");
    $("#data").append("past");
}

function checkProgrss(dateStart) {
    var date = new Date();
    // var deadline = new Date('6/12/2021');
    var startDate = new Date(dateStart)
    var diffTime = Math.abs(date - startDate);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // console.log(yes(diffDays, 100, 1))
    function yes(val, max, min) { return ((val - min) / (max - min)) * 100; }
    return diffDays;
    // $("#data").append(deadline - date);
    // $('#progress').animate({
    //     'width': diffDays
    // }, 'slow')
}*/