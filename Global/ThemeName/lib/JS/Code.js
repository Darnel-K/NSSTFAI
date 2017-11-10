var ConfigJSON;
var Settings = {};
var DEBUG = true;

function updateQrCode(link) {
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
        fontname: 'sans',
        fontcolor: '#F00',
        image: null
    };
    $('#qrcode').empty().qrcode(options);
}

function GetSettingsFromFile(file) {
    $.getJSON(file).done(function(json) {
        if (DEBUG) {console.log("DEBUG >> GetSettingsFromFile: Get Config.json Successful");}
        ConfigJSON = json;
        ApplySettings(ConfigJSON);
    }).fail(function() {
        if (DEBUG) {console.error("DEBUG >> GetSettingsFromFile: Unable To Get Config.json");}
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
                        default:
                            Value = CSSkey["Value"];
                            break;
                    }
                    Styles += HTML_Element + " {" + LowerKey + ": " + Value + ";}\n";
                }
            }
            $('#s').text(Styles);
        } else {
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
                }
            }
        }
    }
}

function GetSettingsFromCookie() {
    settingsObj = getCookie("indexSettings")
    settingsObj = JSON.parse(decodeURIComponent(settingsObj));
    ConfigJSON = settingsObj;
    ApplySettings(ConfigJSON);
}

function genBreadCrumb() {
    var breadcrumb = "<div class=\"rcrumbs\" id=\"breadcrumbs\"><ul>";
    var href = document.location.href;
    var s = href.split("/");
    for (var i=2;i<(s.length-1);i++) {
        breadcrumb += "<li><a href=\"" + href.substring(0,href.indexOf("/" + s[i]) + s[i].length + 1) + "/\">" + decodeURIComponent(s[i]) + "</a><span class=\"divider\">></span></li>";
    }
    breadcrumb+="</ul></div>";
    $( "#topleft" ).append(breadcrumb);
    $("#breadcrumbs").rcrumbs();
}

// function updateUIStyles() {
//     newStyles = {
//         "styles": {
//             "body":"color: #" + $("#BFC").val() + ";background-color: #" + $("#BBC").val() + ";",
//             "#icon":"color: #" + $("#IDFC").val() + ";background-color: #" + $("#IDBC").val() + ";",
//             "#text":"color: #" + $("#IIFC").val() + ";background-color: #" + $("#IIBC").val() + ";",
//             "#credits":"background-color: #" + $("#CBC").val() + ";",
//             "#qrcode":"background-color: #" + $("#QCBC").val() + ";",
//             "#credits a":"color: #" + $("#CFC").val() + ";",
//             "#infodiv":"background-color: #" + $("#ICBC").val() + ";",
//             "#topleft":"background-color: #" + $("#TBLBC").val() + ";border-right: 1px solid #" + $("#TBLRB").val() + ";",
//             "#settingsicon button img":"background-color: #" + $("#SIIBC").val() + ";",
//             "#topright":"background-color: #" + $("#TBRBC").val() + ";color: #" + $("#TBRFC").val() + ";",
//             "tr.indexhead a":"color: #" + $("#THFC").val() + ";",
//             "tr.indexhead":"border-bottom: 1px solid #" + $("#THBB").val() + "; background-color: #" + $("#THBC").val() + ";",
//             "tr.odd":"color: #" + $("#TROFC").val() + ";background-color: #" + $("#TROBC").val() + ";",
//             "tr.even":"color: #" + $("#TREFC").val() + ";background-color: #" + $("#TREBC").val() + ";",
//             "tr.odd a":"color: #" + $("#TROFC").val() + ";",
//             "tr.even a":"color: #" + $("#TREFC").val() + ";",
//             "::-webkit-scrollbar":"width: " + ("0" + $("#WSW").val()).slice(-2) + "px;",
//             "::-webkit-scrollbar-thumb":"background:#" + $("#WSBC").val() + ";border: thin solid #" + $("#WSB").val() + ";border-radius:" + ("0" + $("#WSBR").val()).slice(-2) + "px;",
//             "::-webkit-scrollbar-thumb:hover":"background:#" + $("#WSHBC").val() + ";border: thin solid #" + $("#WSHB").val() + ";",
//             ".rcrumbs *":"color: #" + $("#BrFC").val() + ";",
//             ".rcrumbs .divider":"color: #" + $("#BDFC").val() + ";",
//             "#settings":"background-color: #" + $("#SBC").val() + ";color: #" + $("#SFC").val() + ";",
//             "tbody tr.odd:hover":"color: #" + $("#TROHFC").val() + ";background-color: #" + $("#TROHBC").val() + ";transition: background-color .20s ease;",
//             "tbody tr.even:hover":"color: #" + $("#TREHFC").val() + ";background-color: #" + $("#TREHBC").val() + ";transition: background-color .20s ease;",
//             ".rcrumbs a:hover":"color: #" + $("#BHFC").val() + ";background-color: #" + $("#BHBC").val() + ";",
//             "#credits a:hover":"color: #" + $("#CHFC").val() + ";background-color: #" + $("#CHBC").val() + ";",
//             "#settings h2":"border-bottom: 1px solid #" + $("#SHBBC").val() + "",
//             "#save":"background-color: #" + $("#SSBBC").val() + ";",
//             "#reset":"background-color: #" + $("#SRBBC").val() + ";color: #" + $("#SRBFC").val(),
//             "#settingsicon button:hover img":"background-color: #" + $("#SIIHBC").val() + ";",
//             "#save:hover":"background-color: #" + $("#SSBHBC").val() + ";",
//             "#reset:hover":"background-color: #" + $("#SRBHBC").val() + ";color: #" + $("#SRBHFC").val()
//         }, 
//         "extra": {
//             "QCFC":"#" + $("#QCFC").val(),
//             "QCBC":"#" + $("#QCBC").val()
//         }
//     }
//     styles = "";
//     for (var prop in newStyles.styles) {
//         styles += prop + "{" + newStyles.styles[prop] + "}";
//     }
//     $("#s").html(styles);
//     QCFC = newStyles.extra["QCFC"];
//     QCBC = newStyles.extra["QCBC"];
// }

function setupTable() {
    $("table img").attr("onerror", "this.onerror = null; this.src='/ThemeName/Icons/Error.svg'");
    $(".indexbreakrow").remove();
    $("tbody").before("<thead></thead>");
    $("thead").html("<tr class=\"indexhead\">" + $(".indexhead").html() + "</tr>");
    $(".indexhead").eq(1).remove()
    $( "tr" ).mouseover(function() {
        if(!$(this).hasClass('indexhead')){
            if(!$(this).hasClass('indexbreakrow')) {
                if ($(this).find('a').prop('href') == undefined) {
                    qrlink = $(location).prop('href');
                    iconSRC = "/ThemeName/Icons/Directory.svg";
                    iconAlt = "[DIR]";
                    text = "Current Directory";
                } else {
                    link = $(this).find('a').prop('href');
                    var extension = link.substr((link.lastIndexOf('.') + 1)).toLowerCase();
                    switch (extension) {
                        case 'png':
                            iconSRC = link;
                            break;
                        case 'svg':
                            iconSRC = link;
                            break;
                        case 'jpg':
                            iconSRC = link;
                            break;
                        case 'jpeg':
                            iconSRC = link;
                            break;
                        case 'bmp':
                            iconSRC = link;
                            break;
                        case 'gif':
                            iconSRC = link;
                            break;
                        default:
                            iconSRC = $(this).find('img').attr('src');
                            break;
                    }
                    qrlink = $(this).find('a').prop('href');
                    iconAlt = $(this).find('img').attr('alt');
                    text = decodeURIComponent($(this).find('a').text().replace('/','')) + "<br />" + $(this).find('.indexcollastmod').text() + "<br />" + $(this).find('.indexcolsize').text();
                }
            }
        }
        updateQrCode(qrlink);
        $('#icon').find('img').attr('src', iconSRC);
        $('#icon').find('img').attr('alt', iconAlt);
        $('#text p').html(text);
    });
    $('tbody tr a').bind("click", function(e) {
        //    link = $(this).find('a').prop('href');
        //    window.location.href = link;
        e.preventDefault();
    });
    $('tbody tr').bind("click", function(e) {
        e.preventDefault();
        link = $(this).find('a').prop('href');
		text = $(this).find('a').text();
        var extension = link.substr((link.lastIndexOf('.') + 1)).toLowerCase();
        if (link.substr(-1) != "/" && link.substr(-1) != "\\") {
            win = window.open(link, '_blank');
            win.focus();
        } else {
            window.location.href = link;
        }
    });
}

function SetupSettingsPage() {
    $( "#open" ).click(function() {
        $( "#settings" ).show();
        $('#close').show();
        $('#open').hide();
        $("#SettingsContents").html("");
        if (ConfigJSON.hasOwnProperty("ChangeableStyles")) {
            if (ConfigJSON["ChangeableStyles"].hasOwnProperty("CSS")) {
                $('#SettingsContents').append("<h2>Styles</h2>");
                $('#SettingsContents').append("<div class=\"container StylesSettings\"></div>");
                for (var Key in ConfigJSON["ChangeableStyles"]["CSS"]) {
                    for (var LowerKey in ConfigJSON["ChangeableStyles"]["CSS"][Key]["Styles"]) {
                        var CSSkey = ConfigJSON["ChangeableStyles"]["CSS"][Key]["Styles"][LowerKey];
                        var ID = CSSkey["ID"];
                        var Type = CSSkey["Type"];
                        var Desc = CSSkey["Desc"];
                        var Min = String(CSSkey["Min"]);
                        var Max = String(CSSkey["Max"]);
                        var Value;
                        switch (Type) {
                            case "BORDER":
                                // Value = String(CSSkey["Width"]) + "px " + CSSkey["Style"] + " " + CSSkey["HEX"];
                                break;
                            case "N-PX":
                                Value = String(CSSkey["Value"]);
                                $(".StylesSettings").append('<div class="SettingsItem"><p>' + Desc + '</p><input type="number" id="' + ID + '" value="' + Value + '" min="' + Min + '" max="' + Max + '"></div>');
                                break;
                            default:
                            Value = CSSkey["Value"];
                                $(".StylesSettings").append('<div class="SettingsItem"><p>' + Desc + '</p><input id="' + ID + '" class="jscolor {onFineChange:\'updateUIStyles()\'}" value=\"' + Value.substr(1) + '\"></div>');
                                break;
                        }
                    }
                }
            }
            if (ConfigJSON["ChangeableStyles"].hasOwnProperty("JS")) {
                $("#SettingsContents").append("<h2>JS</h2>");
                $("#SettingsContents").append('<div class="container JS_Settings"></div>');
                for (var Key in ConfigJSON["ChangeableStyles"]["JS"]) {
                    for (var LowerKey in ConfigJSON["ChangeableStyles"]["JS"][Key]["Styles"]) {
                        var CSSkey = ConfigJSON["ChangeableStyles"]["JS"][Key]["Styles"][LowerKey];
                        var ID = CSSkey["ID"];
                        var Type = CSSkey["Type"];
                        var Desc = CSSkey["Desc"];
                        var Value = CSSkey["Value"];
                        $(".JS_Settings").append('<div class="SettingsItem"><p>' + Desc + '</p><input id="' + ID + '" type="text" value="' + Value + '"></div>');
                    }
                }
            }
        }
    });

    $( "#reset" ).click(function() {
        GetSettingsFromFile("/ThemeName/Config.json");
        setCookie("indexSettings",encodeURIComponent(JSON.stringify(ConfigJSON)),365);
        window.location.href = location.href;
    });
}

// function setupEvents() {
//     $( "#open" ).click(function() {
//         $( "#settings" ).show();
//         $('#close').show();
//         $('#open').hide();
//         if (checkCookie("indexSettings")) {
//             settingsObj = getCookie("indexSettings")
//             settingsObj = JSON.parse(decodeURIComponent(settingsObj));
//             document.getElementById('BFC').jscolor.fromString(settingsObj.styles["body"].substr(8, 6));
//             document.getElementById('IDFC').jscolor.fromString(settingsObj.styles["#icon"].substr(8, 6));
//             document.getElementById('IIFC').jscolor.fromString(settingsObj.styles["#text"].substr(8, 6));
//             document.getElementById('QCFC').jscolor.fromString(settingsObj.extra["QCFC"].substr(1, 6));
//             document.getElementById('CFC').jscolor.fromString(settingsObj.styles["#credits a"].substr(8, 6));
//             document.getElementById('ICBC').jscolor.fromString(settingsObj.styles["#infodiv"].substr(19, 6));
//             document.getElementById('TBLBC').jscolor.fromString(settingsObj.styles["#topleft"].substr(19, 6));
//             document.getElementById('TBRBC').jscolor.fromString(settingsObj.styles["#topright"].substr(19, 6));
//             document.getElementById('THFC').jscolor.fromString(settingsObj.styles["tr.indexhead a"].substr(8, 6));
//             document.getElementById('THBB').jscolor.fromString(settingsObj.styles["tr.indexhead"].substr(26, 6));
//             document.getElementById('TROFC').jscolor.fromString(settingsObj.styles["tr.odd"].substr(8, 6));
//             document.getElementById('TREFC').jscolor.fromString(settingsObj.styles["tr.even"].substr(8, 6));
//             document.getElementById('TROHFC').jscolor.fromString(settingsObj.styles["tbody tr.odd:hover"].substr(8, 6));
//             document.getElementById('TREHFC').jscolor.fromString(settingsObj.styles["tbody tr.even:hover"].substr(8, 6));
//             document.getElementById('WSBC').jscolor.fromString(settingsObj.styles["::-webkit-scrollbar-thumb"].substr(12, 6));
//             $('#WSBR').val(settingsObj.styles["::-webkit-scrollbar-thumb"].substr(60, 2));
//             document.getElementById('WSHB').jscolor.fromString(settingsObj.styles["::-webkit-scrollbar-thumb:hover"].substr(39, 6));
//             document.getElementById('BDFC').jscolor.fromString(settingsObj.styles[".rcrumbs .divider"].substr(8, 6));
//             document.getElementById('SFC').jscolor.fromString(settingsObj.styles["#settings"].substr(34, 6));
//             document.getElementById('BHBC').jscolor.fromString(settingsObj.styles[".rcrumbs a:hover"].substr(34, 6));
//             document.getElementById('CHBC').jscolor.fromString(settingsObj.styles["#credits a:hover"].substr(34, 6));
//             document.getElementById('SSBBC').jscolor.fromString(settingsObj.styles["#save"].substr(19, 6));
//             document.getElementById('SRBFC').jscolor.fromString(settingsObj.styles["#reset"].substr(34, 6));
//             document.getElementById('BBC').jscolor.fromString(settingsObj.styles["body"].substr(34, 6));
//             document.getElementById('IDBC').jscolor.fromString(settingsObj.styles["#icon"].substr(34, 6));
//             document.getElementById('IIBC').jscolor.fromString(settingsObj.styles["#text"].substr(34, 6));
//             document.getElementById('QCBC').jscolor.fromString(settingsObj.styles["#qrcode"].substr(19, 6));
//             document.getElementById('CBC').jscolor.fromString(settingsObj.styles["#credits"].substr(19, 6));
//             document.getElementById('SIIBC').jscolor.fromString(settingsObj.styles["#settingsicon button img"].substr(19, 6));
//             document.getElementById('TBLRB').jscolor.fromString(settingsObj.styles["#topleft"].substr(51, 6));
//             document.getElementById('TBRFC').jscolor.fromString(settingsObj.styles["#topright"].substr(34, 6));
//             document.getElementById('THBC').jscolor.fromString(settingsObj.styles["tr.indexhead"].substr(53, 6));
//             document.getElementById('TROBC').jscolor.fromString(settingsObj.styles["tr.odd"].substr(34, 6));
//             document.getElementById('TREBC').jscolor.fromString(settingsObj.styles["tr.even"].substr(34, 6));
//             document.getElementById('TROHBC').jscolor.fromString(settingsObj.styles["tbody tr.odd:hover"].substr(34, 6));
//             document.getElementById('TREHBC').jscolor.fromString(settingsObj.styles["tbody tr.even:hover"].substr(34, 6));
//             $('#WSW').val(settingsObj.styles["::-webkit-scrollbar"].substr(7, 2));
//             document.getElementById('WSB').jscolor.fromString(settingsObj.styles["::-webkit-scrollbar-thumb"].substr(39, 6));
//             document.getElementById('WSHBC').jscolor.fromString(settingsObj.styles["::-webkit-scrollbar-thumb:hover"].substr(12, 6));
//             document.getElementById('BrFC').jscolor.fromString(settingsObj.styles[".rcrumbs *"].substr(8, 6));
//             document.getElementById('SBC').jscolor.fromString(settingsObj.styles["#settings"].substr(19, 6));
//             document.getElementById('BHFC').jscolor.fromString(settingsObj.styles[".rcrumbs a:hover"].substr(8, 6));
//             document.getElementById('CHFC').jscolor.fromString(settingsObj.styles["#credits a:hover"].substr(8, 6));
//             document.getElementById('SHBBC').jscolor.fromString(settingsObj.styles["#settings h2"].substr(26, 6));
//             document.getElementById('SRBBC').jscolor.fromString(settingsObj.styles["#reset"].substr(19, 6));
//             document.getElementById('SSBHBC').jscolor.fromString(settingsObj.styles["#save:hover"].substr(19, 6));
//             document.getElementById('SRBHFC').jscolor.fromString(settingsObj.styles["#reset:hover"].substr(34, 6));
//             document.getElementById('SIIHBC').jscolor.fromString(settingsObj.styles["#settingsicon button:hover img"].substr(19, 6));
//             document.getElementById('SRBHBC').jscolor.fromString(settingsObj.styles["#reset:hover"].substr(19, 6));
//         }
//     });
//     $( "#close" ).click(function() {
//         $( "#settings" ).hide();
//         $('#close').hide();
//         $('#open').show();
//     });
//     $( "#save" ).click(function() {
//         newStyles = {
//             "styles": {
//                 "body":"color: #" + $("#BFC").val() + ";background-color: #" + $("#BBC").val() + ";",
//                 "#icon":"color: #" + $("#IDFC").val() + ";background-color: #" + $("#IDBC").val() + ";",
//                 "#text":"color: #" + $("#IIFC").val() + ";background-color: #" + $("#IIBC").val() + ";",
//                 "#credits":"background-color: #" + $("#CBC").val() + ";",
//                 "#qrcode":"background-color: #" + $("#QCBC").val() + ";",
//                 "#credits a":"color: #" + $("#CFC").val() + ";",
//                 "#infodiv":"background-color: #" + $("#ICBC").val() + ";",
//                 "#topleft":"background-color: #" + $("#TBLBC").val() + ";border-right: 1px solid #" + $("#TBLRB").val() + ";",
//                 "#settingsicon button img":"background-color: #" + $("#SIIBC").val() + ";",
//                 "#topright":"background-color: #" + $("#TBRBC").val() + ";color: #" + $("#TBRFC").val() + ";",
//                 "tr.indexhead a":"color: #" + $("#THFC").val() + ";",
//                 "tr.indexhead":"border-bottom: 1px solid #" + $("#THBB").val() + "; background-color: #" + $("#THBC").val() + ";",
//                 "tr.odd":"color: #" + $("#TROFC").val() + ";background-color: #" + $("#TROBC").val() + ";",
//                 "tr.even":"color: #" + $("#TREFC").val() + ";background-color: #" + $("#TREBC").val() + ";",
//                 "tr.odd a":"color: #" + $("#TROFC").val() + ";",
//                 "tr.even a":"color: #" + $("#TREFC").val() + ";",
//                 "::-webkit-scrollbar":"width: " + ("0" + $("#WSW").val()).slice(-2) + "px;",
//                 "::-webkit-scrollbar-thumb":"background:#" + $("#WSBC").val() + ";border: thin solid #" + $("#WSB").val() + ";border-radius:" + ("0" + $("#WSBR").val()).slice(-2) + "px;",
//                 "::-webkit-scrollbar-thumb:hover":"background:#" + $("#WSHBC").val() + ";border: thin solid #" + $("#WSHB").val() + ";",
//                 ".rcrumbs *":"color: #" + $("#BrFC").val() + ";",
//                 ".rcrumbs .divider":"color: #" + $("#BDFC").val() + ";",
//                 "#settings":"background-color: #" + $("#SBC").val() + ";color: #" + $("#SFC").val() + ";",
//                 "tbody tr.odd:hover":"color: #" + $("#TROHFC").val() + ";background-color: #" + $("#TROHBC").val() + ";transition: background-color .20s ease;",
//                 "tbody tr.even:hover":"color: #" + $("#TREHFC").val() + ";background-color: #" + $("#TREHBC").val() + ";transition: background-color .20s ease;",
//                 ".rcrumbs a:hover":"color: #" + $("#BHFC").val() + ";background-color: #" + $("#BHBC").val() + ";",
//                 "#credits a:hover":"color: #" + $("#CHFC").val() + ";background-color: #" + $("#CHBC").val() + ";",
//                 "#settings h2":"border-bottom: 1px solid #" + $("#SHBBC").val() + "",
//                 "#save":"background-color: #" + $("#SSBBC").val() + ";",
//                 "#reset":"background-color: #" + $("#SRBBC").val() + ";color: #" + $("#SRBFC").val(),
//                 "#settingsicon button:hover img":"background-color: #" + $("#SIIHBC").val() + ";",
//                 "#save:hover":"background-color: #" + $("#SSBHBC").val() + ";",
//                 "#reset:hover":"background-color: #" + $("#SRBHBC").val() + ";color: #" + $("#SRBHFC").val()
//             }, 
//             "extra": {
//                 "QCFC":"#" + $("#QCFC").val(),
//                 "QCBC":"#" + $("#QCBC").val()
//             }
//         }
//         setCookie("indexSettings",encodeURIComponent(JSON.stringify(newStyles)),365);
//         window.location.href = location.href;
//     });
// 
//     $( "input" ).change(function() {
//         updateUIStyles();
//     });
//     $(document).on("keydown", function (e) {
//         if(! $(event.target).is('input')) {
//             if (e.which === 8) {
//                 e.preventDefault();
//                 if ($("tbody").find('.indexcolname').find('a').html().toLowerCase() == "parent directory") {
//                     $("tbody").find("tr").first().click();
//                 }
//             }
//         }
//     });
// }

function init() {
    // QCFC = "#FFFFFF";
    // QCBC = "#2F2F2F";
    if (checkCookie("indexSettings")) {
        GetSettingsFromCookie();
    } else {
        GetSettingsFromFile("/ThemeName/Config.json");
    }
    qrlink = $(location).prop('href');
    iconSRC = "/ThemeName/Icons/Directory.svg";
    iconAlt = "[DIR]";
    text = "Current Directory";
    updateQrCode(qrlink);
    $('#icon').find('img').attr('src', iconSRC);
    $('#icon').find('img').attr('alt', iconAlt);
    $('#text p').html(text);
    genBreadCrumb();
    setupTable();
    // setupEvents();
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        $("tbody").css("overflox-y", "scroll");
        $("#settings").css("overflox-y", "scroll");
    }
}