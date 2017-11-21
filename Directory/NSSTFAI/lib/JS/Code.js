var ConfigJSON;
var Settings = {
    LocalStorageSettingsName: "IndexSettings",
    JsonSettingsFile: "/NSSTFAI/Config.json",
    "QRcode-FC": "#FFFFFF"
};
var DEBUG = false;

function updateQrCode(link) {
    var options = {
        render: "image",
        minVersion: 1,
        maxVersion: 40,
        ecLevel: "H",
        left: 0,
        top: 0,
        size: $("#qrcode").width(),
        fill: Settings["QRcode-FC"],
        background: Settings["QRcode-BC"],
        text: link,
        radius: 0,
        quiet: 0,
        mode: 0,
        mSize: 0.1,
        mPosX: 0.5,
        mPosY: 0.5,
        label: "no label",
        fontname: "sans",
        fontcolor: "#F00",
        image: null
    };
    $("#qrcode")
        .empty()
        .qrcode(options);
}

function GetSettingsFromFile(file) {
    $.getJSON(file)
        .done(function(json) {
            if (DEBUG) {
                console.log(
                    "DEBUG >> GetSettingsFromFile: Get Config.json Successful"
                );
            }
            ConfigJSON = json;
            ApplySettings(ConfigJSON);
        })
        .fail(function() {
            if (DEBUG) {
                console.error(
                    "DEBUG >> GetSettingsFromFile: Unable To Get Config.json"
                );
            }
        });
}

function ApplySettings(JSON_OBJ) {
    if (JSON_OBJ.hasOwnProperty("ChangeableStyles")) {
        if (JSON_OBJ["ChangeableStyles"].hasOwnProperty("CSS")) {
            var Styles = "";
            for (var Key in JSON_OBJ["ChangeableStyles"]["CSS"]) {
                var HTML_Element =
                    JSON_OBJ["ChangeableStyles"]["CSS"][Key]["Element"];
                for (var LowerKey in JSON_OBJ["ChangeableStyles"]["CSS"][Key][
                    "Styles"
                ]) {
                    var CSSkey =
                        JSON_OBJ["ChangeableStyles"]["CSS"][Key]["Styles"][
                            LowerKey
                        ];
                    var ID = CSSkey["ID"];
                    var Type = CSSkey["Type"];
                    var Desc = CSSkey["Desc"];
                    var Value;
                    switch (Type) {
                        case "BORDER":
                            Value =
                                String(CSSkey["Width"]) +
                                "px " +
                                CSSkey["Style"] +
                                " " +
                                CSSkey["HEX"];
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
                    Styles +=
                        HTML_Element + " {" + LowerKey + ": " + Value + ";}\n";
                }
            }
            $("#s").text(Styles);
        }
        if (JSON_OBJ["ChangeableStyles"].hasOwnProperty("JS")) {
            for (var Key in JSON_OBJ["ChangeableStyles"]["JS"]) {
                for (var LowerKey in JSON_OBJ["ChangeableStyles"]["JS"][Key][
                    "Styles"
                ]) {
                    var CSSkey =
                        JSON_OBJ["ChangeableStyles"]["JS"][Key]["Styles"][
                            LowerKey
                        ];
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

function GetSettingsFromLocalStorage(StorageName) {
    settingsObj = localStorage.getItem(StorageName);
    settingsObj = JSON.parse(decodeURIComponent(settingsObj));
    ConfigJSON = settingsObj;
    ApplySettings(ConfigJSON);
}

function genBreadCrumb() {
    var breadcrumb = '<div class="rcrumbs" id="breadcrumbs"><ul>';
    var href = document.location.href;
    var s = href.split("/");
    for (var i = 2; i < s.length - 1; i++) {
        breadcrumb +=
            '<li><a href="' +
            href.substring(0, href.indexOf("/" + s[i]) + s[i].length + 1) +
            '/">' +
            decodeURIComponent(s[i]) +
            '</a><span class="divider">></span></li>';
    }
    breadcrumb += "</ul></div>";
    $("#topleft").append(breadcrumb);
    $("#breadcrumbs").rcrumbs();
}

function setupTable() {
    $("table img").attr(
        "onerror",
        "this.onerror = null; this.src='/NSSTFAI/Icons/Error.svg'"
    );
    $(".indexbreakrow").remove();
    $("tbody").before("<thead></thead>");
    $("thead").html(
        '<tr class="indexhead">' + $(".indexhead").html() + "</tr>"
    );
    $(".indexhead")
        .eq(1)
        .remove();
}

function SetupTableEvents() {
    $("tr").on("mouseover", function() {
        if (!$(this).hasClass("indexhead")) {
            if (!$(this).hasClass("indexbreakrow")) {
                if (
                    $(this)
                        .find("a")
                        .prop("href") == undefined
                ) {
                    qrlink = $(location).prop("href");
                    iconSRC = "/NSSTFAI/Icons/Directory.svg";
                    iconAlt = "[DIR]";
                    text = "Current Directory";
                } else {
                    link = $(this)
                        .find("a")
                        .prop("href");
                    var extension = link
                        .substr(link.lastIndexOf(".") + 1)
                        .toLowerCase();
                    switch (extension) {
                        case "png":
                            iconSRC = link;
                            break;
                        case "svg":
                            iconSRC = link;
                            break;
                        case "jpg":
                            iconSRC = link;
                            break;
                        case "jpeg":
                            iconSRC = link;
                            break;
                        case "bmp":
                            iconSRC = link;
                            break;
                        case "gif":
                            iconSRC = link;
                            break;
                        default:
                            iconSRC = $(this)
                                .find("img")
                                .attr("src");
                            break;
                    }
                    qrlink = $(this)
                        .find("a")
                        .prop("href");
                    iconAlt = $(this)
                        .find("img")
                        .attr("alt");
                    text =
                        decodeURIComponent(
                            $(this)
                                .find("a")
                                .text()
                                .replace("/", "")
                        ) +
                        "<br />" +
                        $(this)
                            .find(".indexcollastmod")
                            .text() +
                        "<br />" +
                        $(this)
                            .find(".indexcolsize")
                            .text();
                }
            }
        }
        updateQrCode(qrlink);
        $("#icon")
            .find("img")
            .attr("src", iconSRC);
        $("#icon")
            .find("img")
            .attr("alt", iconAlt);
        $("#text p").html(text);
    });

    $("tbody tr a").on("click", function(e) {
        e.preventDefault();
    });

    $("tbody tr").on("click", function(e) {
        e.preventDefault();
        link = $(this)
            .find("a")
            .prop("href");
        text = $(this)
            .find("a")
            .text();
        // var extension = link.substr((link.lastIndexOf('.') + 1)).toLowerCase();
        if (link.substr(-1) != "/" && link.substr(-1) != "\\") {
            win = window.open(link, "_blank");
            win.focus();
        } else {
            window.location.href = link;
        }
    });
}

function UpdateAndSaveSettings() {
    if (ConfigJSON.hasOwnProperty("ChangeableStyles")) {
        if (ConfigJSON["ChangeableStyles"].hasOwnProperty("CSS")) {
            for (var Key in ConfigJSON["ChangeableStyles"]["CSS"]) {
                var HTML_Element =
                    ConfigJSON["ChangeableStyles"]["CSS"][Key]["Element"];
                for (var LowerKey in ConfigJSON["ChangeableStyles"]["CSS"][Key][
                    "Styles"
                ]) {
                    var CSSkey =
                        ConfigJSON["ChangeableStyles"]["CSS"][Key]["Styles"][
                            LowerKey
                        ];
                    var ID = CSSkey["ID"];
                    var Type = CSSkey["Type"];
                    var Value;
                    switch (Type) {
                        case "BORDER":
                            var Width = $("#" + ID + "-W").val();
                            var ChosenStyle = $("#" + ID + "-S").val();
                            var HEX = $("#" + ID + "-H").val();
                            // Value = String(Width) + "px " + ChosenStyle + " " + HEX;
                            ConfigJSON["ChangeableStyles"]["CSS"][Key][
                                "Styles"
                            ][LowerKey]["Width"] = Width;
                            ConfigJSON["ChangeableStyles"]["CSS"][Key][
                                "Styles"
                            ][LowerKey]["Style"] = ChosenStyle;
                            ConfigJSON["ChangeableStyles"]["CSS"][Key][
                                "Styles"
                            ][LowerKey]["HEX"] = HEX;
                            break;
                        default:
                            Value = $("#" + ID).val();
                            ConfigJSON["ChangeableStyles"]["CSS"][Key][
                                "Styles"
                            ][LowerKey]["Value"] = Value;
                            break;
                    }
                }
            }
        }
        if (ConfigJSON["ChangeableStyles"].hasOwnProperty("JS")) {
            for (var Key in ConfigJSON["ChangeableStyles"]["JS"]) {
                for (var LowerKey in ConfigJSON["ChangeableStyles"]["JS"][Key][
                    "Styles"
                ]) {
                    var CSSkey =
                        ConfigJSON["ChangeableStyles"]["JS"][Key]["Styles"][
                            LowerKey
                        ];
                    var ID = CSSkey["ID"];
                    var Value = $("#" + ID).val();
                    Settings[ID] = Value;
                    ConfigJSON["ChangeableStyles"]["JS"][Key]["Styles"][
                        LowerKey
                    ]["Value"] = Value;
                }
            }
        }
    }
    localStorage.setItem(
        Settings["LocalStorageSettingsName"],
        encodeURIComponent(JSON.stringify(ConfigJSON))
    );
    GetSettingsFromLocalStorage(Settings["LocalStorageSettingsName"]);
}

function SetupSettingsPage() {
    $("#open").on("click", function() {
        $("#settings").show();
        $("#close").show();
        $("#open").hide();
        $("#SettingsContents").html("");
        BorderStyles =
            '<option value="solid">Solid</option><option value="dotted">Dotted</option><option value="dashed">Dashed</option><option value="double">Double</option><option value="groove">Groove</option><option value="ridge">Ridge</option><option value="inset">Inset</option><option value="outset">Outset</option><option value="none">None</option>';
        if (ConfigJSON.hasOwnProperty("ChangeableStyles")) {
            if (ConfigJSON["ChangeableStyles"].hasOwnProperty("CSS")) {
                $("#SettingsContents").append("<h2>Styles</h2>");
                $("#SettingsContents").append(
                    '<div class="container StylesSettings"></div>'
                );
                for (var Key in ConfigJSON["ChangeableStyles"]["CSS"]) {
                    for (var LowerKey in ConfigJSON["ChangeableStyles"]["CSS"][
                        Key
                    ]["Styles"]) {
                        var CSSkey =
                            ConfigJSON["ChangeableStyles"]["CSS"][Key][
                                "Styles"
                            ][LowerKey];
                        var ID = CSSkey["ID"];
                        var Type = CSSkey["Type"];
                        var Desc = CSSkey["Desc"];
                        var Value;
                        switch (Type) {
                            case "BORDER":
                                var Width = String(CSSkey["Width"]);
                                var Style = CSSkey["Style"];
                                var HEX = CSSkey["HEX"];
                                // Value = String(CSSkey["Width"]) + "px " + CSSkey["Style"] + " " + CSSkey["HEX"];
                                $(".StylesSettings").append(
                                    '<div class="SettingsItem"><p>' +
                                        Desc +
                                        '</p><input type="number" id="' +
                                        ID +
                                        "-W" +
                                        '" class="BorderStyling" value="' +
                                        Width +
                                        '"><select id="' +
                                        ID +
                                        "-S" +
                                        '" class="BorderStyling">' +
                                        BorderStyles +
                                        '</select><input id="' +
                                        ID +
                                        "-H" +
                                        '" class="jscolor {onFineChange:\'UpdateAndSaveSettings()\', hash: true} BorderStyling" value="' +
                                        HEX +
                                        '"></div>'
                                );
                                $(
                                    "#" +
                                        ID +
                                        "-S" +
                                        ' option[value="' +
                                        Style +
                                        '"]'
                                ).prop({ defaultSelected: true });
                                break;
                            case "N-PX":
                                var Min = String(CSSkey["Min"]);
                                var Max = String(CSSkey["Max"]);
                                Value = String(CSSkey["Value"]);
                                $(".StylesSettings").append(
                                    '<div class="SettingsItem"><p>' +
                                        Desc +
                                        '</p><input type="number" id="' +
                                        ID +
                                        '" value="' +
                                        Value +
                                        '" min="' +
                                        Min +
                                        '" max="' +
                                        Max +
                                        '"></div>'
                                );
                                break;
                            default:
                                Value = CSSkey["Value"];
                                $(".StylesSettings").append(
                                    '<div class="SettingsItem"><p>' +
                                        Desc +
                                        '</p><input id="' +
                                        ID +
                                        '" class="jscolor {onFineChange:\'UpdateAndSaveSettings()\', hash: true}" value="' +
                                        Value +
                                        '"></div>'
                                );
                                break;
                        }
                    }
                }
            }
            if (ConfigJSON["ChangeableStyles"].hasOwnProperty("JS")) {
                $("#SettingsContents").append("<h2>JS</h2>");
                $("#SettingsContents").append(
                    '<div class="container JS_Settings"></div>'
                );
                for (var Key in ConfigJSON["ChangeableStyles"]["JS"]) {
                    for (var LowerKey in ConfigJSON["ChangeableStyles"]["JS"][
                        Key
                    ]["Styles"]) {
                        var CSSkey =
                            ConfigJSON["ChangeableStyles"]["JS"][Key]["Styles"][
                                LowerKey
                            ];
                        var ID = CSSkey["ID"];
                        var Type = CSSkey["Type"];
                        var Desc = CSSkey["Desc"];
                        var Value = CSSkey["Value"];
                        if (Type == "COLOUR") {
                            $(".JS_Settings").append(
                                '<div class="SettingsItem"><p>' +
                                    Desc +
                                    '</p><input id="' +
                                    ID +
                                    '" class="jscolor {onFineChange:\'UpdateAndSaveSettings()\', hash: true}" value="' +
                                    Value +
                                    '"></div>'
                            );
                        } else {
                            $(".JS_Settings").append(
                                '<div class="SettingsItem"><p>' +
                                    Desc +
                                    '</p><input id="' +
                                    ID +
                                    '" type="text" value="' +
                                    Value +
                                    '"></div>'
                            );
                        }
                    }
                }
            }
        }
        jscolor.installByClassName("jscolor");
        $("input, select").on("change", function() {
            UpdateAndSaveSettings();
        });
    });

    $("#reset").on("click", function() {
        localStorage.removeItem(Settings["LocalStorageSettingsName"]);
        window.location.href = location.href;
    });

    $("#close").on("click", function() {
        $("#settings").hide();
        $("#close").hide();
        $("#open").show();
    });
}

function SetupOtherEvents() {
    $(document).on("keydown", function(e) {
        if (!$(event.target).is("input")) {
            if (e.which === 8) {
                e.preventDefault();
                if (
                    $("tbody")
                        .find(".indexcolname")
                        .find("a")
                        .html()
                        .toLowerCase() == "parent directory"
                ) {
                    $("tbody")
                        .find("tr")
                        .first()
                        .click();
                }
            }
        }
    });
}

function SetMobileSettings() {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        $("tbody").css("overflox-y", "scroll");
        $("#settings").css("overflox-y", "scroll");
        $("tr").off("mouseover");
    }
}

function init() {
    if (localStorage.getItem(Settings["LocalStorageSettingsName"]) != null) {
        GetSettingsFromLocalStorage(Settings["LocalStorageSettingsName"]);
    } else {
        GetSettingsFromFile(Settings["JsonSettingsFile"]);
    }
    qrlink = $(location).prop("href");
    iconSRC = "/NSSTFAI/Icons/Directory.svg";
    iconAlt = "[DIR]";
    text = "Current Directory";
    updateQrCode(qrlink);
    $("#icon")
        .find("img")
        .attr("src", iconSRC);
    $("#icon")
        .find("img")
        .attr("alt", iconAlt);
    $("#text p").html(text);
    genBreadCrumb();
    $("title").text(location.href);
    setupTable();
    SetupTableEvents();
    SetupSettingsPage();
    SetupOtherEvents();
    SetMobileSettings();
}
