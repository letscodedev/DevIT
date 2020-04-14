$(document).ready(function () {
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
    $("#project_name").text(project_name)
    get_merge_requests()
    function get_merge_requests() {
        (async () => {
            let projects = await userSession.getFile("created_project.json", { decrypt: true })
            projects = JSON.parse(projects)
            let project = projects.my_projects[project_name]
            let invited = project.invited
            let sharedkey = project.sharedkey
            let project_details = await userSession.getFile(project_name + ".json", { decrypt: false })
            project_details = await decrypt(project_details, sharedkey)
            project_details = JSON.parse(project_details)
            let myID = userSession.loadUserData().username
            let commit = project_details.commit;
            let appendData = "";
            let fs = await userSession.getFile(project_name + "/fs.json", { decrypt: false })
            fs = await decrypt(fs, sharedkey)
            fs = JSON.parse(fs)
            for (let userid in invited) {
                let user_progress = await userSession.getFile(project_name + "@" + myID + ".json", { decrypt: false, username: userid, app: "https://devit-7cd11.web.app" })
                user_progress = await decrypt(user_progress, sharedkey)
                user_progress = JSON.parse(user_progress)
                if (user_progress.commit > commit) {
                    let dt = new Date(user_progress.commit);
                    appendData += '<li class="list-group-item">' + userid + "   (" + dt.toGMTString() + ') <button type="button" class="btn btn-warning lotwork" data-toggle="modal" id="' + userid + '" data-target="#exampleModal">See Request</button></li>'

                }
            }
            let changes;
            let current_user;
            $("#data").append(appendData)
            $(".lotwork").click(function () {
                (async () => {

                    $("#modalbd").empty();
                    changes = {}
                    let user = this.id
                    let user_fs = await userSession.getFile(project_name + "@" + myID + "/fs.json", { decrypt: false, username: user, app: "https://devit-7cd11.web.app" })
                    user_fs = await decrypt(user_fs, sharedkey)
                    user_fs = JSON.parse(user_fs)
                    current_user = user
                    let appendData = "<form>"
                    for (let file in user_fs) {
                        if (fs.hasOwnProperty(file)) {
                            let master_checksum = fs[file]
                            let user_checksum = user_fs[file]
                            if (master_checksum != user_checksum) {
                                //changed file
                                let changed_file_info = ""
                                changed_file_info += '<div class="form-check">'
                                changed_file_info += '<input class="form-check-input" type="checkbox" value="" id="' + file + 'c">'
                                changed_file_info += '<label class="form-check-label" for="' + file + 'c">'
                                changed_file_info += '<a href="file-viewer.html?project_name=' + project_name + '&file=' + file + '&userid=' + user + '"> (edited) ' + file + '</a>'
                                changed_file_info += '</label>'
                                changed_file_info += '</div>'
                                appendData += changed_file_info
                                changes[file] = { "type": "edit", "user": user }
                            }
                        } else {
                            let changed_file_info = ""
                            changed_file_info += '<div class="form-check">'
                            changed_file_info += '<input class="form-check-input" type="checkbox" value="" id="' + file + 'c">'
                            changed_file_info += '<label class="form-check-label" for="' + file + 'c">'
                            changed_file_info += '<a href="file-viewer.html?project_name=' + project_name + '&file=' + file + '&userid=' + user + '"> (new file) ' + file + '</a>'
                            changed_file_info += '</label>'
                            changed_file_info += '</div>'
                            appendData += changed_file_info
                            changes[file] = { "type": "new", "user": user }
                        }
                    }
                    for (let file in fs) {
                        if (!user_fs.hasOwnProperty(file)) {
                            let changed_file_info = ""
                            changed_file_info += '<div class="form-check">'
                            changed_file_info += '<input class="form-check-input" type="checkbox" value="" id="' + file + 'c">'
                            changed_file_info += '<label class="form-check-label" for="' + file + 'c">'
                            changed_file_info += '<a href="file-viewer.html?project_name=' + project_name + '&file=' + file + '"> (delet) ' + file + '</a>'
                            changed_file_info += '</label>'
                            changed_file_info += '</div>'
                            appendData += changed_file_info
                            changes[file] = { "type": "delet", "user": user }
                        }
                    }
                    appendData += "</form>"
                    $("#modalbd").append(appendData)

                })()
            })
            $("#confirmbtn").click(function () {
                (async () => {
                    $("#progress_bar").show()
                    $("#myclosa").trigger("click")
                    let myID = userSession.loadUserData().username
                    let userid = current_user;
                    let projects = await userSession.getFile("created_project.json", { decrypt: true })
                    let fs = await userSession.getFile(project_name + "/fs.json", { decrypt: false })
                    let user_progress = await userSession.getFile(project_name + "@" + myID + ".json", { decrypt: false, username: userid, app: "https://devit-7cd11.web.app" })
                    let project_details = await userSession.getFile(project_name + ".json", { decrypt: false })
                    let user_fs = await userSession.getFile(project_name + "@" + myID + "/fs.json", { decrypt: false, username: userid, app: "https://devit-7cd11.web.app" })
                    projects = JSON.parse(projects)
                    let project = projects.my_projects[project_name]
                    let sharedkey = project.sharedkey

                    fs = await decrypt(fs, sharedkey)
                    fs = JSON.parse(fs)
                    user_progress = await decrypt(user_progress, sharedkey)
                    user_progress = JSON.parse(user_progress)
                    project_details = await decrypt(project_details, sharedkey)
                    project_details = JSON.parse(project_details)
                    user_fs = await decrypt(user_fs, sharedkey)
                    user_fs = JSON.parse(user_fs)

                    for (let file in changes) {
                        if (document.getElementById(file + 'c').checked) {

                            if (changes[file].type == "new" || changes[file].type == "edit") {
                                let new_file_content = await userSession.getFile(project_name + "@" + myID + "/" + file, { decrypt: false, username: userid, app: "https://devit-7cd11.web.app" })
                                await userSession.putFile(project_name + "/" + file, new_file_content, { encrypt: false })
                                fs[file] = user_fs[file]
                            } else if (changes[file].type == "delet") {
                                userSession.deleteFile(project_name + "/" + file)
                                delete fs[file]
                            }
                        }
                    }
                    project_details.commit = user_progress.commit
                    project_details = await encrypt(JSON.stringify(project_details), sharedkey)


                    fs = await encrypt(JSON.stringify(fs), sharedkey)
                    await userSession.putFile(project_name + ".json", project_details, { encrypt: false })
                    await userSession.putFile(project_name + "/fs.json", fs, { encrypt: false })
                    console.log("Done!")
                    $("#progress_bar").hide()
                })()
            })
        })()
    }
})