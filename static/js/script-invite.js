
$(document).ready(function () {

    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        }
        return decodeURI(results[1]) || 0;
    }

    var domainURL = "https://devit-7cd11.web.app"
    const appConfig = new blockstack.AppConfig(['store_write', 'publish_data'])
    var userSession = new blockstack.UserSession({ appConfig })
    let token = window.atob($.urlParam('token'))
    let data = JSON.parse(token)
    let sharedkey = userSession.decryptContent(token);
    let manager_id = data.manager_id
    let manager_pubkey = data.manager_pubkey;
    let project_name = data.project_name;
    (async () => {
        let fileContents = await userSession.getFile("joined_project.json", { decrypt: true })
        let projects_data;

        if (fileContents) {
            projects_data = JSON.parse(fileContents)
            if (projects_data.my_projects.hasOwnProperty(project_name + "@" + manager_id)) {
                console.log("Already Joined Project")
                return
            }
        } else {
            projects_data = { "my_projects": {} }
        }

        projects_data.my_projects[project_name + "@" + manager_id] = { "joined_at": Date.now(), "manager_id": manager_id, "manager_pubkey": manager_pubkey, "sharedkey": sharedkey }
        let manger_project_details = await userSession.getFile(project_name + ".json", { decrypt: false, username: manager_id, app: "https://devit-7cd11.web.app" })
        await userSession.putFile(project_name + "@" + manager_id + ".json", manger_project_details, { encrypt: false })
        await userSession.putFile("joined_project.json", JSON.stringify(projects_data), { encrypt: true })
        console.log("Project Joined Sucessfully")
        $("#progress_bar").empty()
        $("#progress_bar").append('<span style="position: absolute; height: 15%; width: 10%; top: 40%; left: 45%;">Project Joined Sucessfully!</span>')

    })()

})