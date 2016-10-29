var urlSh = {
    hidden: true,
    txtBox: null,
    txt: null,
    target: null,
    alertEl: null,
    toggleTexts: function (sw) {
        urlSh.txtBox.textContent = '';
        urlSh.txtBox.style.display = sw ? 'block' : 'none';
        urlSh.txt.style.display = sw ? 'none' : 'block';
        urlSh.hidden = sw;
    },
    postURL: function () {
        if (urlSh.txtBox.textContent == '') {
            urlSh.alert('No URL specified!');
            return;
        }

        var expression = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
        var regex = new RegExp(expression);

        if(!urlSh.txtBox.textContent.match(regex) || urlSh.txtBox.textContent.indexOf(document.location.host) !== -1){
            urlSh.alert('Invalid URL specified!');
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/a", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status >= 200 && xhr.status <= 500) {
                    var json = JSON.parse(xhr.responseText);
                    urlSh.onResponse(json);
                } else {
                    urlSh.alert('Service currently not available!')
                }
                urlSh.hidden = true;
            }
        };
        var data = JSON.stringify({
            "url": urlSh.txtBox.textContent
        });
        xhr.send(data);
    },
    copy: function(str){
        var copy = document.getElementById('copy'),
            copyTxt = document.getElementById('copy-input'),
            overlay = document.getElementById('overlay');

        var clipboard = new Clipboard('#copy-button', {
            text: function(){
                return str;
            }
        });

        function reset(){
            copy.style.display = 'none';
            urlSh.txt.style.display = 'block';
            urlSh.txtBox.style.display = 'block';
            overlay.style.display = 'none';
            urlSh.txtBox.focus();
        }

        clipboard.on('success', reset);
        overlay.onclick = reset;

        copyTxt.textContent = str;
        copy.style.display = 'block';
        urlSh.txt.style.display = 'none';
        overlay.style.display = 'block';
    },
    onResponse: function (data) {
        if (data.success) {
            urlSh.copy(document.location.href + data.id);
            urlSh.toggleTexts(false);
        } else {
            urlSh.onFail(data.error);
        }
    },
    onFail: function (error) {
        urlSh.alert(error);
    },
    onLoad: function () {
        urlSh.txtBox = document.getElementById("text-cont");
        urlSh.txt = document.getElementById("main-text");
        urlSh.alertEl = document.getElementById('alert');

        document.body.onclick = function (e) {
            e = e || event;
            urlSh.txtBox.focus();
            e.preventDefault();
        };

        urlSh.txtBox.focus();
        urlSh.setTxtBoxTriggers();
        urlSh.addWindowListeners();
    },
    setTxtBoxTriggers: function () {
        urlSh.txtBox.onpaste = function () {
            urlSh.toggleTexts(true);
            setTimeout(urlSh.postURL, 100);
            return true;
        };

        urlSh.txtBox.onkeydown = function (e) {
            e = e || event;
            if (e.key == 'Enter') {
                urlSh.postURL();
                return false;
            }

            if (urlSh.hidden && e.key != 'Meta' && e.key != 'Escape'
                && e.key != 'AltGraph' && !e.ctrlKey && !e.shiftKey
                && !e.altKey && e.key != 'Tab') {
                urlSh.toggleTexts(true);
                urlSh.hidden = false;
            }
            return true;
        };

        urlSh.txtBox.onkeyup = function () {
            if (urlSh.txtBox.textContent == "") {
                urlSh.txt.style.display = 'block';
                urlSh.hidden = true;
            }
            return true;
        };
    },
    addWindowListeners: function () {
        window.addEventListener("dragover", function (e) {
            e = e || event;
            e.preventDefault();
        }, false);

        window.addEventListener("drop", function (e) {
            e = e || event;
            urlSh.toggleTexts(true);
            urlSh.txtBox.textContent = e.dataTransfer.getData('text');
            urlSh.postURL();
            e.preventDefault();
        }, false);

        window.addEventListener('keydown',function(e) {
            if(e.key != 'Enter' && urlSh.alertEl.style.opacity == '1') {
                urlSh.toggleAlert(false);
            }
            return true;
        })
    },
    once: function (seconds, callback) {
        var counter = 0;
        var time = window.setInterval(function () {
            counter++;
            if (counter >= seconds) {
                callback();
                window.clearInterval(time);
            }
        }, 400);
    },
    toggleAlert: function(sw) {
        if(!sw) {
            urlSh.alertEl.style.maxHeight = '0';
            urlSh.once( 1, function () {
                urlSh.alertEl.style.opacity = '0';
            });
        } else {
            urlSh.alertEl.style.maxHeight = '1000px';
            urlSh.alertEl.style.opacity   = '1';
        }
    },
    alert: function(message) {
        urlSh.alertEl.textContent = message;
        urlSh.toggleAlert(true);
    }
};

window.onload = urlSh.onLoad;