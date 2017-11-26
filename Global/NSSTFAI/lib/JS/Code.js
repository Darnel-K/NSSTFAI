var Settings = {
    "DEBUG": false,
    "LocalStorageSettingsName": "NSSTFAI",
    "JsonSettingsFile": "/NSSTFAI/Config.json",
    "QRcode-FC": "#FFFFFF",
    "QRcode-BC": "#2F2F2F",
    "QRcode-Link": $(location).prop('href'),
    "SidebarIconSRC": "/NSSTFAI/Icons/Directory.svg",
    "SidebarIconAlt": "[DIR]",
    "SidebarText": "Current Directory",
    "Config": null,
    "SettingsOpen": false,
    "BorderStyles": '<option value="solid">Solid</option><option value="dotted">Dotted</option><option value="dashed">Dashed</option><option value="double">Double</option><option value="groove">Groove</option><option value="ridge">Ridge</option><option value="inset">Inset</option><option value="outset">Outset</option><option value="none">None</option>'
};

function UpdateQRCode(link) {
    var options = {
        render: 'image',
        minVersion: 1,
        maxVersion: 40,
        ecLevel: 'H',
        left: 0,
        top: 0,
        size: $('#qrcode').width(),
        fill: Settings["QRcode-FC"],
        background: Settings["QRcode-BC"],
        text: link,
        radius: 0,
        quiet: 0,
        mode: 0,
        mSize: 0.1,
        mPosX: 0.5,
        mPosY: 0.5,
        label: 'no label',
        fontname: 'monospace',
        fontcolor: '#CCC',
        image: null
    };
    $('#qrcode').empty().qrcode(options);
    log("UpdateQRCode: QR Code Has Been Changed Based On '" + link + "'");
}

function log(msg, type = "LOG") {
    if (Settings['DEBUG']) {
        type = type.toUpperCase();
        if (type == "LOG") {
            console.log("NSSTFAI >> " + msg);
        } else if (type == "WARN") {
            console.warn("NSSTFAI >> " + msg);
        } else if (type == "ERROR") {
            console.error("NSSTFAI >> " + msg);
        }
    }
}

function GetSettingsFromFile(file) {
    $.getJSON(file).done(function(json) {
        log("GetSettingsFromFile: Get Config.json Successful");
        Settings["Config"] = json;
        ApplySettings(Settings["Config"]);
    }).fail(function() {
        log("GetSettingsFromFile: Unable To Get Config.json", "ERROR");
    });
}

function ApplySettings(JSON_OBJ) {
    if (JSON_OBJ.hasOwnProperty("ChangeableStyles")) {
        if (JSON_OBJ["ChangeableStyles"].hasOwnProperty("CSS")) {
            var Styles = "";
            for (var Key in JSON_OBJ['ChangeableStyles']['CSS']) {
                var HTML_Element = JSON_OBJ["ChangeableStyles"]["CSS"][Key]["Element"];
                for (var LowerKey in JSON_OBJ["ChangeableStyles"]["CSS"][Key]['Styles']) {
                    var CSSkey = JSON_OBJ["ChangeableStyles"]["CSS"][Key]['Styles'][LowerKey];
                    var ID = CSSkey["ID"];
                    var Type = CSSkey["Type"];
                    var Desc = CSSkey["Desc"];
                    var Value;
                    switch (Type) {
                        case "BORDER":
                            Value = String(CSSkey["Width"]) + "px " + CSSkey["Style"] + " " + CSSkey["HEX"];
                            break;
                        case "N-PX":
                            Value = String(CSSkey["Value"]) + "px";
                            break;
                        case "N-%":
                            Value = String(CSSkey["Value"]) + "%";
                            break;
                        case "N-VH":
                            Value = String(CSSkey["Value"]) + "vh";
                            break;
                        case "N-VW":
                            Value = String(CSSkey["Value"]) + "vw";
                            break;
                        default:
                            Value = CSSkey["Value"];
                            break;
                    }
                    Styles += HTML_Element + " {" + LowerKey + ": " + Value + ";}\n";
                    log("ApplySettings: CSS Key '" + LowerKey + "' With Value '" + Value + "' Set On '" + HTML_Element + "'");
                }
            }
            $('#s').text(Styles);
            log("ApplySettings: Finished Applying CSS Styles");
        }
        if (JSON_OBJ["ChangeableStyles"].hasOwnProperty("JS")) {
            for (var Key in JSON_OBJ['ChangeableStyles']['JS']) {
                for (var LowerKey in JSON_OBJ["ChangeableStyles"]["JS"][Key]['Styles']) {
                    var CSSkey = JSON_OBJ["ChangeableStyles"]["JS"][Key]['Styles'][LowerKey];
                    var ID = CSSkey["ID"];
                    var Type = CSSkey["Type"];
                    var Desc = CSSkey["Desc"];
                    var Value = CSSkey["Value"];
                    Settings[ID] = Value;
                    log("ApplySettings: Setting '" + ID + "' Value Set To '" + Value + "'");
                }
            }
            log("ApplySettings: Finished Applying JS Settings");
        }
    }
}

function GetSettingsFromLocalStorage(StorageName) {
    settingsObj = localStorage.getItem(StorageName);
    settingsObj = JSON.parse(decodeURIComponent(settingsObj));
    Settings["Config"] = settingsObj;
    log("GetSettingsFromLocalStorage: Settings Grabbed From Local Storage");
    ApplySettings(Settings["Config"]);
}

function GenBreadCrumb() {
    var breadcrumb = "<div class=\"rcrumbs\" id=\"breadcrumbs\"><ul>";
    var href = document.location.href;
    var s = href.split("/");
    for (var i=2;i<(s.length-1);i++) {
        breadcrumb += "<li><a href=\"" + href.substring(0,href.indexOf("/" + s[i]) + s[i].length + 1) + "/\">" + decodeURIComponent(s[i]) + "</a><span class=\"divider\">></span></li>";
        log("GenBreadCrumb: Added '" + decodeURIComponent(s[i]) + "' To Breadcrumb");
    }
    breadcrumb+="</ul></div>";
    $( "#topleft" ).append(breadcrumb);
    $("#breadcrumbs").rcrumbs();
    log("GenBreadCrumb: Breadcrumb Complete");
}

function SetupTable() {
    $("table img").attr("onerror", "this.onerror = null; this.src='/NSSTFAI/Icons/Error.svg'");
    $(".indexbreakrow").remove();
    $("tbody").before("<thead></thead>");
    $("thead").html("<tr class=\"indexhead\">" + $(".indexhead").html() + "</tr>");
    $(".indexhead").eq(1).remove();
    log("SetupTable: Table Setup Complete");
}

function SetSideBarInfo() {
    if ($('tr.selected').find('a').prop('href') == undefined) {
        Settings['QRcode-Link'] = $(location).prop('href');
        Settings["SidebarIconSRC"] = "/NSSTFAI/Icons/Directory.svg";
        Settings["SidebarIconAlt"] = "[DIR]";
        Settings["SidebarText"] = "Current Directory";
        log("SetSideBarInfo: Link Not Present");
    } else {
        link = $('tr.selected').find('a').prop('href');
        log("SetSideBarInfo: Link Detected, " + link);
        var extension = link.substr((link.lastIndexOf('.') + 1)).toLowerCase();
        switch (extension) {
            case 'png':
                Settings["SidebarIconSRC"] = link;
                break;
            case 'svg':
                Settings["SidebarIconSRC"] = link;
                break;
            case 'jpg':
                Settings["SidebarIconSRC"] = link;
                break;
            case 'jpeg':
                Settings["SidebarIconSRC"] = link;
                break;
            case 'bmp':
                Settings["SidebarIconSRC"] = link;
                break;
            case 'gif':
                Settings["SidebarIconSRC"] = link;
                break;
            default:
                Settings["SidebarIconSRC"] = $('tr.selected').find('img').attr('src');
                break;
        }
        Settings["QRcode-Link"] = $('tr.selected').find('a').prop('href');
        Settings["SidebarIconAlt"] = $('tr.selected').find('img').attr('alt');
        Settings["SidebarText"] = decodeURIComponent($('tr.selected').find('a').text().replace('/','')) + "<br />" + $('tr.selected').find('.indexcollastmod').text() + "<br />" + $('tr.selected').find('.indexcolsize').text();
        log("SetSideBarInfo: Sidebar Information Updated To, Text='" + Settings["SidebarText"] + "' Image='" + Settings["SidebarIconSRC"] + "' ImageAlt='" + Settings["SidebarIconAlt"] + "'");
    }
    UpdateQRCode(Settings["QRcode-Link"]);
    $('#icon').find('img').attr('src', Settings["SidebarIconSRC"]);
    $('#icon').find('img').attr('alt', Settings["SidebarIconAlt"]);
    $("#text p").html(Settings["SidebarText"]);
}

function SetupTableEvents() {
    $( "tr" ).on("mouseover", function() {
        log("Mouseover: Mouse Detected Over A Table Row");
        if(!$(this).hasClass('indexhead')){
            log("Mouseover: Does Not Have Class 'indexhead'");
            if(!$(this).hasClass('indexbreakrow')) {
                log("Mouseover: Does Not Have Class 'indexbreakrow'");
                $("tbody tr").removeClass("selected");
                $(this).addClass("selected");
                SetSideBarInfo();
            }
        }
    });

    $('tbody tr a').on("click", function(e) {
        e.preventDefault();
    });

    $('tbody tr').on("click", function(e) {
        e.preventDefault();
        link = $(this).find('a').prop('href');
		Settings["SidebarText"] = $(this).find('a').text();
        // var extension = link.substr((link.lastIndexOf('.') + 1)).toLowerCase();
        if (link.substr(-1) != "/" && link.substr(-1) != "\\") {
            win = window.open(link, '_blank');
            win.focus();
        } else {
            window.location.href = link;
        }
    });
}

function UpdateAndSaveSettings() {
    if (Settings["Config"].hasOwnProperty("ChangeableStyles")) {
        if (Settings["Config"]["ChangeableStyles"].hasOwnProperty("CSS")) {
            for (var Key in Settings["Config"]["ChangeableStyles"]["CSS"]) {
                var HTML_Element = Settings["Config"]["ChangeableStyles"]["CSS"][Key]["Element"];
                for (var LowerKey in Settings["Config"]["ChangeableStyles"]["CSS"][Key]["Styles"]) {
                    var CSSkey = Settings["Config"]["ChangeableStyles"]["CSS"][Key]["Styles"][LowerKey];
                    var ID = CSSkey["ID"];
                    var Type = CSSkey["Type"];
                    var Value;
                    switch (Type) {
                        case "BORDER":
                            var Width = $("#" + ID + "-W").val();
                            var ChosenStyle = $("#" + ID + "-S").val();
                            var HEX = $("#" + ID + "-H").val();
                            Settings["Config"]["ChangeableStyles"]["CSS"][Key]["Styles"][LowerKey]["Width"] = Width;
                            Settings["Config"]["ChangeableStyles"]["CSS"][Key]["Styles"][LowerKey]["Style"] = ChosenStyle;
                            Settings["Config"]["ChangeableStyles"]["CSS"][Key]["Styles"][LowerKey]["HEX"] = HEX;
                            log("UpdateAndSaveSettings: Key '" + ID + "' With Value '" + Width + "px " + ChosenStyle + " " + HEX + "' Saved");
                            break;
                        case "COLOUR":
                            Value = $("#" + ID).val();
                            if (!Value.startsWith("#")) { Value = "#" + Value; }
                            Settings["Config"]["ChangeableStyles"]["CSS"][Key]["Styles"][LowerKey]["Value"] = Value;
                            log("UpdateAndSaveSettings: Key '" + ID + "' With Value '" + Value + "' Saved");
                            break;
                        default:
                            Value = $("#" + ID).val();
                            Settings["Config"]["ChangeableStyles"]["CSS"][Key]["Styles"][LowerKey]["Value"] = Value;
                            log("UpdateAndSaveSettings: Key '" + ID + "' With Value '" + Value + "' Saved");
                            break;
                    }
                }
            }
        }
        if (Settings["Config"]["ChangeableStyles"].hasOwnProperty("JS")) {
            for (var Key in Settings["Config"]["ChangeableStyles"]["JS"]) {
                for (var LowerKey in Settings["Config"]["ChangeableStyles"]["JS"][Key]["Styles"]) {
                    var CSSkey = Settings["Config"]["ChangeableStyles"]["JS"][Key]["Styles"][LowerKey];
                    var ID = CSSkey["ID"];
                    var Value = $("#" + ID).val();
                    Settings[ID] = Value;
                    Settings["Config"]["ChangeableStyles"]["JS"][Key]["Styles"][LowerKey]["Value"] = Value;
                    log("UpdateAndSaveSettings: Key '" + ID + "' With Value '" + Value + "' Saved");
                }
            }
        }
    }
    localStorage.setItem(Settings["LocalStorageSettingsName"], encodeURIComponent(JSON.stringify(Settings["Config"])));
    GetSettingsFromLocalStorage(Settings["LocalStorageSettingsName"]);
}

function SetupSettingsEvents() {
    $("#SettingsButton").on("click", function() {
        if (!Settings['SettingsOpen']) { // Open
            $("#settings").show();
            SetupSettingsPage();
            $(this).find("img").attr("src", "/NSSTFAI/Icons/Close.svg")
            Settings['SettingsOpen'] = true;
            log("SetupSettingsPage: Settings Page Opened");
        } else { // Closed
            $("#settings").hide();
            $(this).find("img").attr("src", "/NSSTFAI/Icons/Settings.svg")
            Settings['SettingsOpen'] = false;
            log("SetupSettingsPage: Settings Page Closed");
        }
    });

    $("#reset").on("click", function () {
        localStorage.removeItem(Settings['LocalStorageSettingsName']);
        log("SetupSettingsPage: Reset Button Pushed");
        window.location.href = location.href;
    });
}

function SetupSettingsPage() {
    $("#SettingsContents").html("");
    if (Settings["Config"].hasOwnProperty("ChangeableStyles")) {
        if (Settings["Config"]["ChangeableStyles"].hasOwnProperty("CSS")) {
            $('#SettingsContents').append("<h2>Styles</h2>");
            $('#SettingsContents').append("<div class=\"container StylesSettings\"></div>");
            for (var Key in Settings["Config"]["ChangeableStyles"]["CSS"]) {
                for (var LowerKey in Settings["Config"]["ChangeableStyles"]["CSS"][Key]["Styles"]) {
                    var CSSkey = Settings["Config"]["ChangeableStyles"]["CSS"][Key]["Styles"][LowerKey];
                    var ID = CSSkey["ID"];
                    var Type = CSSkey["Type"];
                    var Desc = CSSkey["Desc"];
                    var Value;
                    switch (Type) {
                        case "BORDER":
                            var Width = String(CSSkey["Width"]);
                            var Style = CSSkey["Style"];
                            var HEX = CSSkey["HEX"];
                            $(".StylesSettings").append('<div class="SettingsItem"><p>' + Desc + '</p><input type="number" id="' + ID + '-W' + '" class="BorderStyling" value="' + Width + '"><select id="' + ID + '-S' + '" class="BorderStyling">' + Settings['BorderStyles'] + '</select><input id="' + ID + '-H' + '" class="jscolor {onFineChange:\'UpdateAndSaveSettings()\', hash: true} BorderStyling" value="' + HEX + '"></div>');
                            log("SetupSettingsPage: Added Item '" + ID + "' With Current Value Of '" + Width + "px " + Style + " #" + HEX);
                            $('#' + ID + '-S' + ' option[value="' + Style + '"]').prop({defaultSelected: true});
                            break;
                        case "N-PX":
                            var Min = String(CSSkey["Min"]);
                            var Max = String(CSSkey["Max"]);
                            Value = String(CSSkey["Value"]);
                            $(".StylesSettings").append('<div class="SettingsItem"><p>' + Desc + '</p><input type="number" id="' + ID + '" value="' + Value + '" min="' + Min + '" max="' + Max + '"></div>');
                            log("SetupSettingsPage: Added Item '" + ID + "' With Current Value Of '" + Value + "'");
                            break;
                        default:
                            Value = CSSkey["Value"];
                            $(".StylesSettings").append('<div class="SettingsItem"><p>' + Desc + '</p><input id="' + ID + '" class="jscolor {onFineChange:\'UpdateAndSaveSettings()\', hash: true}" value=\"' + Value + '\"></div>');
                            log("SetupSettingsPage: Added Item '" + ID + "' With Current Value Of '" + Value + "'");
                            break;
                    }
                }
            }
        }
        if (Settings["Config"]["ChangeableStyles"].hasOwnProperty("JS")) {
            $("#SettingsContents").append("<h2>JS</h2>");
            $("#SettingsContents").append('<div class="container JS_Settings"></div>');
            for (var Key in Settings["Config"]["ChangeableStyles"]["JS"]) {
                for (var LowerKey in Settings["Config"]["ChangeableStyles"]["JS"][Key]["Styles"]) {
                    var CSSkey = Settings["Config"]["ChangeableStyles"]["JS"][Key]["Styles"][LowerKey];
                    var ID = CSSkey["ID"];
                    var Type = CSSkey["Type"];
                    var Desc = CSSkey["Desc"];
                    var Value = CSSkey["Value"];
                    if (Type == "COLOUR") {
                        $(".JS_Settings").append('<div class="SettingsItem"><p>' + Desc + '</p><input id="' + ID + '" class="jscolor {onFineChange:\'UpdateAndSaveSettings()\', hash: true}" value=\"' + Value + '\"></div>');
                    } else {
                        $(".JS_Settings").append('<div class="SettingsItem"><p>' + Desc + '</p><input id="' + ID + '" type="text" value="' + Value + '"></div>');
                    }
                    log("SetupSettingsPage: Added Item '" + ID + "' With Current Value Of '" + Value + "'");
                }
            }
        }
    }
    jscolor.installByClassName("jscolor");
    $("input, select").on("change", function() {
        UpdateAndSaveSettings();
    });
}

function SetMobileSettings() {
    if (/iPad|iPhone|iPod|Android/.test(navigator.userAgent) && !window.MSStream) {
        $("tbody").css("overflox-y", "scroll");
        $("#settings").css("overflox-y", "scroll");
        $("tr").off("mouseover");
        log("MobileCheck: Mobile Device Detected, Applying Mobile CSS");
    } else {log("MobileCheck: Not A Mobile Device");}
}

function CheckForUpdate() {
    $.getJSON("https://raw.githubusercontent.com/Darnel-K/Apache-Index-Theme/master/version.json").done(function(json) {
        var RemoteVersion = json;
        $.getJSON("/NSSTFAI/lib/JS/Version.json").done(function(json) {
            var LocalVersion = json;
            if (LocalVersion["Version"] < RemoteVersion["Version"]) {
                if (RemoteVersion["Required"] == true) {
                    log("Update: An Important Update Is Available For Download At https://github.com/Darnel-K/Apache-Index-Theme", "WARN");
                } else {
                    log("Update: An Update Is Available For Download At https://github.com/Darnel-K/Apache-Index-Theme", "WARN");
                }
            }
        }).fail(function() {
            log("CheckForUpdate: Unable To Get Local Version Data", "ERROR");
        });
    }).fail(function() {
        log("CheckForUpdate: Unable To Get Remote Version Data", "ERROR");
    });
}

function ParentDirectory() {
    if ($("tbody").find('.indexcolname').find('a').html().toLowerCase() == "parent directory") {
        log("ParentDirectory: Going Up A Directory");
        $("tbody").find("tr").first().click();
    }
}

function ScrollIfNotVisible(element, parent) {
    try {
        if ($(element).position().top < 5 || $(element).position().top > $(parent).height()) {
            $(parent).scrollTop($(element).offset().top - $(parent).offset().top + $(parent).scrollTop());
            log("ScrollIfNotVisible: Scrolled To Item With Class '.selected'");
        }
    } catch (e) {}
}

function SetupKeydownEvents() {
    $(document).on("keydown", function (e) {
        if(! $(event.target).is('input')) {
            if (e.which === 37 || e.which === 8) { // Left Arrow || Backspace
                e.preventDefault();
                ParentDirectory();
            }
            if (e.which === 38) { // Up Arrow
                e.preventDefault();
                if ($('tbody tr.selected').length) {
                    if ($('tbody tr.selected').prev().length) {
                        $('tbody tr.selected').removeClass("selected").prev().addClass("selected");
                    } else {
                        $("tr.selected").removeClass("selected");
                        $("tbody tr:last-child").addClass("selected");
                    }
                } else {
                    $("tbody tr:last-child").addClass("selected");
                }
                log("Keydown: Moved Up One");
                ScrollIfNotVisible("tr.selected", "tbody");
                SetSideBarInfo();
            }
            if (e.which === 39 || e.which === 13) { // Right Arrow || Enter
                e.preventDefault();
                log("Keydown: Opening / Entering Selected File Or Directory")
                $("tbody tr.selected").click();
            }
            if (e.which === 40) { // Down Arrow
                e.preventDefault();
                if ($('tbody tr.selected').length) {
                    if ($('tbody tr.selected').next().length) {
                        $('tbody tr.selected').removeClass("selected").next().addClass("selected");
                    } else {
                        $("tr.selected").removeClass("selected");
                        $("tbody tr:first-child").addClass("selected");
                    }
                } else {
                    $("tbody tr:first-child").addClass("selected");
                }
                log("Keydown: Moved Down One");
                ScrollIfNotVisible("tr.selected", "tbody");
                SetSideBarInfo();
            }
            if (e.which === 83) { // S Key
                e.preventDefault();
                log("Keydown: Opening Settings Page")
                $("#SettingsButton").click();
            }
        }
    });
}

function SetupAllEvents() {
    SetupTableEvents();
    SetupSettingsEvents();
    SetupKeydownEvents();
}

function init() {
    $("title").text("Index of " + location.pathname + " @ " + location.hostname);
    if (localStorage.getItem(Settings['LocalStorageSettingsName']) != null) {
        GetSettingsFromLocalStorage(Settings['LocalStorageSettingsName']);
    } else {
        GetSettingsFromFile(Settings['JsonSettingsFile']);
    }
    SetSideBarInfo();
    GenBreadCrumb();
    SetupTable();
    SetupAllEvents();
    SetMobileSettings();
    CheckForUpdate();
}