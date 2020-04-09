$(document).ready(function () {
    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        }
        return decodeURI(results[1]) || 0;
    }
    let project_name = $.urlParam('project_name')
    $("#project_name").text(project_name)
    let ChildFolder = null
    if ($.urlParam('child_folder')) {
        ChildFolder = $.urlParam('child_folder')
    }

    var domainURL = "http://localhost:8080"
    const appConfig = new blockstack.AppConfig(['store_write', 'publish_data'])
    var userSession = new blockstack.UserSession({ appConfig })
    let isEmployee = false
    if ($.urlParam('manger_id')) {
        isEmployee = true
        let manager_id = $.urlParam('manger_id')
        $("#invitebtn").hide()
        $("#mergebtn").hide()
        $(".invited-people").hide()
        getData(project_name + "@" + manager_id);
    } else {
        getData(project_name);
        getPeople();
    }

    function getData(project_name) {
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

            let fs = await userSession.getFile(project_name + "/fs.json", { decrypt: false })
            if (sharedKey && fs) {
                fs = await decrypt(fs, sharedKey)
                fs = JSON.parse(fs)
                let addData = ""
                let folders = []
                if (ChildFolder) {
                    let regex = new RegExp("^" + ChildFolder);
                    let ff_index = ChildFolder.split("/").length
                    for (let ff in fs) {
                        let appendContent = "";
                        if (regex.test(ff)) {

                            ff = ff.split("/")

                            if (ff.length > (ff_index + 1)) {

                                if (folders.indexOf(ff[ff_index]) === -1) {

                                    let href_url;
                                    if (isEmployee) {
                                        href_url = "project-dashboard.html?project_name=" + project_name.split("@")[0] + "&manger_id=" + project_name.split("@")[1] + "&child_folder=" + ChildFolder + "/" + ff[ff_index]
                                    } else {
                                        href_url = "project-dashboard.html?project_name=" + project_name + "&child_folder=" + ChildFolder + "/" + ff[ff_index]

                                    }
                                    appendContent += '<a href="' + href_url + '">'
                                    appendContent += '<li class="list-group-item"><i class="fa fa-folder" style="margin-right: 1rem"></i>' + ff[ff_index] + '</li>'
                                    appendContent += '</a>'

                                    folders.push(ff[ff_index + 1])
                                }
                            } else {
                                let href_url;
                                if (isEmployee) {
                                    href_url = "file-viewer.html?project_name=" + project_name + "&isEmployee=true" + "&file=" + ChildFolder + "/" + ff[ff_index]
                                } else {
                                    href_url = "file-viewer.html?project_name=" + project_name + "&file=" + ChildFolder + "/" + ff[ff_index]

                                }
                                appendContent += '<a href="' + href_url + '">'
                                appendContent += '<li class="list-group-item"><i class="fa fa-file" style="margin-right: 1.5rem"></i>' + ff[ff_index] + '</li>'
                                appendContent += '</a>'
                            }
                            addData += appendContent
                        }
                    }
                } else {
                    for (let ff in fs) {
                        let appendContent = "";
                        ff = ff.split("/")
                        if (ff.length > 1) {
                            if (folders.indexOf(ff[0]) === -1) {
                                let href_url;
                                if (isEmployee) {
                                    href_url = "project-dashboard.html?project_name=" + project_name.split("@")[0] + "&manger_id=" + project_name.split("@")[1] + "&child_folder=" + ff[0]
                                } else {
                                    href_url = "project-dashboard.html?project_name=" + project_name + "&child_folder=" + ff[0]

                                }
                                appendContent += '<a href="' + href_url + '">'
                                appendContent += '<li class="list-group-item"><i class="fa fa-folder" style="margin-right: 1rem"></i>' + ff[0] + '</li>'
                                appendContent += '</a>'
                                folders.push(ff[0])
                            }
                        } else {
                            let href_url;
                            if (isEmployee) {
                                href_url = "file-viewer.html?project_name=" + project_name + "&isEmployee=true" + "&file=" + ff[0]
                            } else {
                                href_url = "file-viewer.html?project_name=" + project_name + "&file=" + ff[0]

                            }
                            appendContent += '<a href="' + href_url + '">'
                            appendContent += '<li class="list-group-item"><i class="fa fa-file" style="margin-right: 1.5rem"></i>' + ff[0] + '</li>'
                            appendContent += '</a>'
                        }
                        addData += appendContent
                    }
                }
                $('#data').append('' + addData);
            }
        })()
    }

    function getPeople() {
        (async () => {
            let projects = await userSession.getFile("created_project.json", { decrypt: true })
            if (projects) {
                projects = JSON.parse(projects)
                let invited = projects.my_projects[project_name].invited

                let addData = "";
                for (let user in invited) {
                    addData += '<li class="list-group-item"><i class="fa fa-user" style="margin-right: 1rem"></i>' + user + '</li>'
                }
                $('#invitePeople').append('' + addData);
            }
        })()

    }


});

function sendInvitation() {
    console.log("Invitation Sent");
}



