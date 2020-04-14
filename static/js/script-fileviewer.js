$(document).ready(function () {
    editAreaLoader.init({
        id: "main_view"
    });
    editAreaLoader.setValue("main_view", "")
    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        }
        return decodeURI(results[1]) || 0;
    }
    const appConfig = new blockstack.AppConfig(['store_write', 'publish_data'])
    var userSession = new blockstack.UserSession({ appConfig })
    let project_name = $.urlParam('project_name')
    let file = $.urlParam('file')
    let userid = $.urlParam('userid')
    $("#file_name").text(file)
    let isEmployee = $.urlParam('isEmployee')
    showFile(project_name)

    function showFile(project_name) {
        (async () => {
            let sharedKey;
            if (isEmployee) {
                let projects = await userSession.getFile("joined_project.json", { decrypt: true })
                projects = JSON.parse(projects)
                sharedKey = projects.my_projects[project_name].sharedkey

            } else {
                let projects = await userSession.getFile("created_project.json", { decrypt: true })
                projects = JSON.parse(projects)
                sharedKey = projects.my_projects[project_name].sharedkey
            }
            let fileContent;
            if (userid) {
                fileContent = await userSession.getFile(project_name + "@" + userSession.loadUserData().username + "/" + file, { decrypt: false, username: userid, app: "https://devit-7cd11.web.app" })
            } else {
                fileContent = await userSession.getFile(project_name + "/" + file, { decrypt: false })
            }
            fileContent = await decrypt(fileContent, sharedKey)


            editAreaLoader.setValue("main_view", fileContent)
        })()
    }
})