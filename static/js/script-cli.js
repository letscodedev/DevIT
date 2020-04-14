$(document).ready(function () {

    const appConfig = new blockstack.AppConfig(['store_write', 'publish_data'])
    var userSession = new blockstack.UserSession({ appConfig })
    if (localStorage.getItem("cliKey")) {
        $("#box1").val(localStorage.getItem("cliKey"))
        $("#box1").show()
    }
    $("#click1").click(function () {
        (async () => {
            localStorage.setItem("cliKey", (await get_random_key()).k)
            $("#box1").val(localStorage.getItem("cliKey"))
            $("#box1").show()
        })()

    })
    $("#click2").click(function () {
        (async () => {
            let clikey = localStorage.getItem("cliKey");
            if (clikey) {

                let encrypted = await encrypt(JSON.stringify(userSession.loadUserData()), clikey);
                let file = new Blob([encrypted], { type: 'text/plain' });
                let a = document.createElement('a');
                a.href = URL.createObjectURL(file);
                a.download = "cli-config.txt";
                a.click();
                // document.body.appendChild(link);

            }
        })()
    })
    $("#click3").click(function () {
        window.location = "https://drive.google.com/file/d/1qmrwPKPm8Ux-Ssw2GOTv5qxKxKGb4nSe/view?usp=sharing"
    })

    async function get_random_key() {

        let key = await window.crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256
            },
            true,
            ["encrypt", "decrypt"]
        );
        return await crypto.subtle.exportKey("jwk", key)
    }

})