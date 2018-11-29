var Settings = {
    DEBUG: false,
    LocalStorageSettingsName: "NSSTFAI",
    JsonSettingsFile: "/NSSTFAI/Config.json",
    "QRcode-FC": "#FFFFFF",
    "QRcode-BC": "#2F2F2F",
    "QRcode-Link": $(location).prop("href"),
    SidebarIconSRC: "/NSSTFAI/Icons/Directory.svg",
    SidebarIconAlt: "[DIR]",
    SidebarText: "Current Directory",
    Config: null
};

function UpdateQRCode(link) {
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
        fontname: "monospace",
        fontcolor: "#CCC",
        image: null
    };
    $("#qrcode")
        .empty()
        .qrcode(options);
    log("UpdateQRCode: QR Code Has Been Changed Based On '" + link + "'");
}

function log(msg, type = "LOG") {
    if (Settings["DEBUG"]) {
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
    $.getJSON(file)
        .done(function(json) {
            log("GetSettingsFromFile: Get Config.json Successful");
            Settings["Config"] = json;
        })
        .fail(function() {
            log("GetSettingsFromFile: Unable To Get Config.json", "ERROR");
        });
}

function GenBreadCrumb() {
    var breadcrumb = '<div class="rcrumbs" id="breadcrumbs"><ul>';
    var href = document.location.href;
    var s = href.split("/");
    for (var i = 2; i < s.length - 1; i++) {
        breadcrumb += '<li><a href="' + href.substring(0, href.indexOf("/" + s[i]) + s[i].length + 1) + '/">' + decodeURIComponent(s[i]) + '</a><span class="divider">></span></li>';
        log("GenBreadCrumb: Added '" + decodeURIComponent(s[i]) + "' To Breadcrumb");
    }
    breadcrumb += "</ul></div>";
    $("#topleft").append(breadcrumb);
    $("#breadcrumbs").rcrumbs();
    log("GenBreadCrumb: Breadcrumb Complete");
}

function SetupTable() {
    $("table img").attr("onerror", "this.onerror = null; this.src='/NSSTFAI/Icons/Error.svg'");
    $(".indexbreakrow").remove();
    $("tbody").before("<thead></thead>");
    $("thead").html('<tr class="indexhead">' + $(".indexhead").html() + "</tr>");
    $(".indexhead")
        .eq(1)
        .remove();
    log("SetupTable: Table Setup Complete");
}

function SetSideBarInfo() {
    if (
        $("tr.selected")
            .find("a")
            .prop("href") == undefined
    ) {
        Settings["QRcode-Link"] = $(location).prop("href");
        Settings["SidebarIconSRC"] = "/NSSTFAI/Icons/Directory.svg";
        Settings["SidebarIconAlt"] = "[DIR]";
        Settings["SidebarText"] = "Current Directory";
        log("SetSideBarInfo: Link Not Present");
    } else {
        link = $("tr.selected")
            .find("a")
            .prop("href");
        log("SetSideBarInfo: Link Detected, " + link);
        var extension = link.substr(link.lastIndexOf(".") + 1).toLowerCase();
        switch (extension) {
            case "png":
                Settings["SidebarIconSRC"] = link;
                break;
            case "svg":
                Settings["SidebarIconSRC"] = link;
                break;
            case "jpg":
                Settings["SidebarIconSRC"] = link;
                break;
            case "jpeg":
                Settings["SidebarIconSRC"] = link;
                break;
            case "bmp":
                Settings["SidebarIconSRC"] = link;
                break;
            case "gif":
                Settings["SidebarIconSRC"] = link;
                break;
            case "tbn":
                Settings["SidebarIconSRC"] = link;
                break;
            case "metathumb":
                Settings["SidebarIconSRC"] = link;
                break;
            default:
                Settings["SidebarIconSRC"] = $("tr.selected")
                    .find("img")
                    .attr("src");
                break;
        }
        Settings["QRcode-Link"] = $("tr.selected")
            .find("a")
            .prop("href");
        Settings["SidebarIconAlt"] = $("tr.selected")
            .find("img")
            .attr("alt");
        Settings["SidebarText"] =
            decodeURIComponent(
                $("tr.selected")
                    .find("a")
                    .text()
                    .replace("/", "")
            ) +
            "<br />" +
            $("tr.selected")
                .find(".indexcollastmod")
                .text() +
            "<br />" +
            $("tr.selected")
                .find(".indexcolsize")
                .text();
        log("SetSideBarInfo: Sidebar Information Updated To, Text='" + Settings["SidebarText"] + "' Image='" + Settings["SidebarIconSRC"] + "' ImageAlt='" + Settings["SidebarIconAlt"] + "'");
    }
    UpdateQRCode(Settings["QRcode-Link"]);
    $("#icon")
        .find("img")
        .attr("src", Settings["SidebarIconSRC"]);
    $("#icon")
        .find("img")
        .attr("alt", Settings["SidebarIconAlt"]);
    $("#text p").html(Settings["SidebarText"]);
}

function SetupTableEvents() {
    $("tr").on("mouseover", function() {
        log("Mouseover: Mouse Detected Over A Table Row");
        if (!$(this).hasClass("indexhead")) {
            log("Mouseover: Does Not Have Class 'indexhead'");
            if (!$(this).hasClass("indexbreakrow")) {
                log("Mouseover: Does Not Have Class 'indexbreakrow'");
                $("tbody tr").removeClass("selected");
                $(this).addClass("selected");
                SetSideBarInfo();
            }
        }
    });

    $("tbody tr a").on("click", function(e) {
        e.preventDefault();
    });

    $("tbody tr").on("click", function(e) {
        e.preventDefault();
        link = $(this)
            .find("a")
            .prop("href");
        Settings["SidebarText"] = $(this)
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

    $("tbody tr a").on("mousedown", function(e) {
        if (e.button == 1 || e.button == 4) {
            e.preventDefault();
        }
    });

    $("tbody tr").on("mousedown", function(e) {
        if (e.button == 1 || e.button == 4) {
            e.preventDefault();
            link = $(this)
                .find("a")
                .prop("href");
            Settings["SidebarText"] = $(this)
                .find("a")
                .text();
            win = window.open(link, "_blank");
            win.focus();
        }
    });
}

function SetMobileSettings() {
    if (/iPad|iPhone|iPod|Android/.test(navigator.userAgent) && !window.MSStream) {
        $("tbody").css("overflox-y", "scroll");
        $("#settings").css("overflox-y", "scroll");
        $("tr").off("mouseover");
        $(document).off("keydown");
        log("MobileCheck: Mobile Device Detected, Applying Mobile CSS");
    } else {
        log("MobileCheck: Not A Mobile Device");
    }
}

function ParentDirectory() {
    if (
        $("tbody")
            .find(".indexcolname")
            .find("a")
            .html()
            .toLowerCase() == "parent directory"
    ) {
        log("ParentDirectory: Going Up A Directory");
        $("tbody")
            .find("tr")
            .first()
            .click();
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
    $(document).on("keydown", function(e) {
        if (!$(event.target).is("input")) {
            if (e.which === 37 || e.which === 8) {
                // Left Arrow || Backspace
                e.preventDefault();
                ParentDirectory();
            }
            if (e.which === 38) {
                // Up Arrow
                e.preventDefault();
                if ($("tbody tr.selected").length) {
                    if ($("tbody tr.selected").prev().length) {
                        $("tbody tr.selected")
                            .removeClass("selected")
                            .prev()
                            .addClass("selected");
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
            if (e.which === 39 || e.which === 13) {
                // Right Arrow || Enter
                e.preventDefault();
                log("Keydown: Opening / Entering Selected File Or Directory");
                $("tbody tr.selected").click();
            }
            if (e.which === 40) {
                // Down Arrow
                e.preventDefault();
                if ($("tbody tr.selected").length) {
                    if ($("tbody tr.selected").next().length) {
                        $("tbody tr.selected")
                            .removeClass("selected")
                            .next()
                            .addClass("selected");
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
            if (e.which === 83) {
                // S Key
                e.preventDefault();
                log("Keydown: Opening Settings Page");
                $("#SettingsButton").click();
            }
        }
    });
}

function SetupAllEvents() {
    SetupTableEvents();
    SetupKeydownEvents();
}

function init() {
    $("title").text("Index of " + location.pathname + " @ " + location.hostname);
    GetSettingsFromFile(Settings["JsonSettingsFile"]);
    SetSideBarInfo();
    GenBreadCrumb();
    SetupTable();
    SetupAllEvents();
    SetMobileSettings();
}
