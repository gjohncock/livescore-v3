/* 2.1.100 */

"use strict";

/***** PAGE: INDEX ****/
const PAGE_ADMIN   = 'admin.php';
const PAGE_RESULTS = 'enterresults.php';
const PAGE_FINAL   = 'finalisematch.php';
const PAGE_HOME    = 'home.php';
const PAGE_INDEX   = 'index.php';
const PAGE_PLAYER  = 'playerselect.php';
const PAGE_SINGLES = 'singles.php';
const PAGE_VIEWRES = 'viewresults.php';

var apiURL;
var CURR_TEAM = null;

var DEV_FOLDER = "";
//var DEVICE_ID = null;
var LAST_MSG_TIME = null;
var IS_ADMIN = false;
var BTN;

var Teams;

// Legend Page Buttons
var BTN_SAVELEGEND = 0;
var BTN_LOCKLEGEND = 1;
var BTN_CLEARLEGEND = 2;

var LOGIN_NONE = 0;
var LOGIN_MATCHPIN = 1;
var LOGIN_TEAMPWD = 2;
var LOGIN_TEAMPIN = 3;
var LOGIN_TOKEN = 4;
var LOGIN_ADMIN = 5;
var LOGIN_VIEWONLY = 6;

var LSTR_JWTTOKEN = "myjwtToken";
var LSTR_JWTTOKENOTHER = "otherjwtToken";
var LSTR_CURRPAGE = 'poolstat.currpage';

var DTFORMAT = 'D-MM-Y h:mm:ss a';
var DTFORMATEXT = 'D-MM-Y h:mm:ss.SSS a';

// var CURR_TEAM = null;  see header for declaration
var CURR_TOKEN = LSTR_JWTTOKEN;

var SHOW_FRAME_SEQ = true;

var MS_INTERVAL = null;
var IDX_INTERVAL = null;

var EH = [];

var CID = new ClientID;
var myJWT = {};
var othJWT = {};

console.log(PAGE_INDEX + ' SCRIPTS');

console.log('Site');
console.log(Site);

apiURL = Site.apiUrl + 'liveapi/v2/';       // see header for declaration

var APPMODE = Site.AppMode;     // "DEV";
var APPID = Site.AppId;         // "PSMOB.AU";
var APPTYPE = Site.AppType;

var devURL = "lsdev";

// Ad Network via Googla Ad Manager
var GAM_CODE = "21923499197"; 	// GOOGLE AD MANAGER NETWORK CODE

//function setAdSlot(slot, dims, tag)
//{
//    googletag.cmd.push(function() {
//      googletag.defineSlot(slot, dims, tag).addService(googletag.pubads());
//      googletag.enableServices();
//      googletag.display(tag);
//  });
//}

function loadgtag(page, mode) {
    mode = udc(mode) ? '' : '-' + mode;
    console.log('loadgtag(' + page + mode + ')');
    if(APPMODE === 'LIVE2.AU') {
        if(page !== 'start') {
            gtag('config', 'UA-51766463-3', {'page_path': page + mode});
        }
        var drawid = 0;
        if(isset(Data.draw)) {
            drawid = Data.draw.id;
        }
        $.ajax({
            url: apiURL + 'pagehit',
            type: 'POST',
            data: { page: page, drawid: drawid } ,
            timeout: 5000,
            dataType: 'json',
            success: function(data) {
                console.log(data);
            },
            error: function(err) {

            }
        });
    }
}

function loadAdsenseAds(page,cls) {

    console.log('LOADING SUCCESS');

    if(page == "INDEX") {
        $.getScript( "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" );
    }

    let adsbygoogle;

    $.ajax({
        url: apiURL + 'getadsenseads',
        type: 'POST',
        dataType: 'json',
        data: {ads: 'list'},
        success: function(data)
        {
            console.log('ADSENSE SUCCESS');
            console.log(data);

            if(data.status == "1")
            {
                var adtop = data.top.code;
                var adbottom = data.bottom.code;

                $("#PS_" + page + "_TOP_CONTAINER").append(adtop);
                $("#PS_" + page + "_BOTTOM_CONTAINER").append(adbottom);

                $(".ps-" + cls + "-advertisement").removeClass('hidden');
                $(".ps-" + cls + "-container").removeClass('hidden');

                (adsbygoogle = window.adsbygoogle || []).push({});
            }
        },
        error: function(err) {
            console.log('ADSENSE ERROR');
        }
    });

}

var vp = ViewPortSize();

var LastUpdate = {
    lastTimestamp: 0,
    lastRefresh: 0,
    intervalCount: 0,
    lastReqStatus: "none",
    timeoutCount: 0
};

function getnow(micro) {
    if(micro === true) {
        return moment().format(DTFORMAT);
    }
    else {
        return moment().format(DTFORMATEXT);
    }
}

function gettoday() {
    return moment().format('Y-MM-DD');
}

function getunix(unix) {
    return moment.unix(unix).format(DTFORMAT);
}

var LastUpdate = {
    lastTimestamp: 0,
    lastRefresh: 0,
    intervalCount: 0,
    lastReqStatus: "none",
    timeoutCount: 0
};

if(vp.width < 321) {
    $('body').css('font-size', '0.8em');
}
//var items = STAGES[6].na;
//var parts = items.split(" ");

var thispage = window.location.href;

// remove any activity, turning the feature off
localStorage.removeItem('poolstat.activity');

var CPage = new CurrPage();
//console.log(CPage);

function CurrPage(newpage)
{
    this.page = PAGE_INDEX;
    this.prevpage = 'none';
    this.param = null;
    this.scrollpos = 0;
    this.ltype = LOGIN_VIEWONLY;
    this.refresh = true;
    this.compid = 0;
    this.drawid = 0;

    this.pages = [];

//    this.params = {};
    this.collapsibles = {};

    this.setPage = function(page, param) {
        // check if the page exists in the pages array (a parent page)
        var pid = this.pages.indexOf(page);
        // if page does not exist, add it to the end of the array
        if(pid === -1) {
            this.prevpage = this.page
            this.pages.push(page);
        }
        else {
            // if it does exist, the user has clicked the back button.
            // remove the last page in the array and set the prev page to the parent of the current page
            this.prevpage = this.pages[pid - 1];
            this.pages.pop();
        }
        this.page = page;

        if(isset(param)) {
            this.param = param;
        }
//        if(isset(a)) {
//            this.ltype = isset(a.ltype) ? a.ltype : 0;
//            this.compid = isset(a.compid) ? a.compid : 0;
//            this.drawid = isset(a.drawid) ? a.drawid : 0;
//        }
//        else {
//            this.ltype = LOGIN_VIEWONLY;
//            this.compid = 0;
//            this.drawid = 0;
//        }
console.log('CPage.setPage(' + this.page + '), ' + this.prevpage);
console.log(this.pages);
        this.save();
    }

    this.save = function()
    {
        var pagedata = {
            page: this.page,
            prevpage: this.prevpage,
            param: udc(this.param) ? null : this.param,
            pages: udc(this.pages) ? [] : this.pages,
            scrollpos: this.scrollpos,
            ltype: this.ltype,
            compid: this.compid,
            drawid: this.drawid,
            collapsibles: this.collapsibles
        };

        localStorage.setItem(LSTR_CURRPAGE, JSON.stringify(pagedata));
    }

    this.init = function()
    {
        console.log('CurrPage.init()');

        this.prevpage = 'none';

        if(isset(newpage)) {
            this.page = newpage;
            this.save();
        }
        else {

            var json = localStorage.getItem(LSTR_CURRPAGE);

            if(json !== null) {
                var data = JSON.parse(json);
                this.page = data.page;
                this.param = udc(data.param) ? null : data.param,
                this.pages = [];
                this.scrollpos = data.scrollpos;
                this.collapsibles = data.collapsibles;
            }
        }
        console.log('CurrPage');
        console.log(this);
    }

    this.init();

}

function ViewPortSize() {
    var height = window.innerHeight;
    var width = window.innerWidth;
    return { height: height, width: width };
}

// gets device info to identify client
function ClientID()
{
    this.userAgent = null;
    this.mimeTypes = 0;
    this.plugins = 0;
    this.shortsize = 0;
    this.tallsize = 0;
    this.pixelDepth = 0;
    this.uuid = null;
    this.ipaddress = "";    // retrieve from php
    this.deviceid = 0;      // created after login request

    this.init = function()
    {
        var navinfo = window.navigator;
        var scrinfo = window.screen;

        this.mimeTypes = navinfo.mimeTypes.length;
        this.userAgent = navinfo.userAgent;
        this.plugins = navinfo.plugins.length;

        var height = scrinfo.height || 0;
        var width = scrinfo.width || 0;

        if(height > width) {
            this.shortsize = width;
            this.tallsize = height;
        }
        else {
            this.shortsize = height;
            this.tallsize = width;
        }

        this.pixelDepth = scrinfo.pixelDepth || 0;

        this.uuid = this.mimeTypes + '.' + this.plugins + '.' +
            this.shortsize + '.' + this.tallsize + '.' + this.pixelDepth;       // this.userAgent.replace(/\D+/g, '') + '.' +
    }

    this.init();
}

// calle with: var tkn = new JWT
function JWT(tokenid) {

    // properties
//    this.org = 0;
    this.compid = 0;
    this.deviceid = 0;
    this.drawid = 0;
    this.teamid = 0;
    this.teamcode = null;
    this.uat = 0;
    this.exp = 0;
    this.remoteid = 0;
    this.auth = 0;

    this.current = 0;
    this.valid = 1;
    this.status = 1;
    this.exists = 1;

    this.tokenstring = null;

    // call when token exists
    this.parseToken = function(tokenid) {

        this.tokenstring = localStorage.getItem(tokenid);

        console.log('token = ' + this.tokenstring);

        if(this.tokenstring === null) {
            localStorage.removeItem(tokenid);
            this.valid = 0;
            this.status = 0;
        }
        else {
            // split token
            var parts = this.tokenstring.split(".");
            var payload = parts[1];

            // extract payload from token, header not required
            this.payload = JSON.parse(Base64.decode(payload));

            // payload items
//            this.org = this.payload.org;
            this.compid = this.payload.comp;
            this.deviceid = this.payload.dev;
            this.drawid = this.payload.draw;
            this.exp = parseInt(this.payload.exp);
            this.iat = parseInt(this.payload.iat);
            this.teamid = this.payload.team
            this.teamcode = this.payload.hora + "-" + this.teamid
            this.remoteid = this.payload.rem
            this.auth = this.payload.auth

            var now = parseInt($.now() / 1000);
            if(parseInt(this.exp) > now) {
                this.current = 1;
            }
            console.log('expire: ' + this.exp + '. now: ' + now);
            this.minstoexpire = parseInt((this.exp - now) / 60);
        }
    }

    // initiate the token if it exists;
    this.parseToken(tokenid);

}

// need to remove other token if app is restarted - other team user will need to log in again
localStorage.removeItem(LSTR_JWTTOKENOTHER);

tokenCheck(true, 'none');

function tokenCheck(refresh, func)
{
    console.log('tokenCheck: checking for Tokens');

    myJWT = new JWT(LSTR_JWTTOKEN);
    othJWT = new JWT(LSTR_JWTTOKENOTHER);

    var tokenOK = true;

    if(myJWT.status === 0) {
        console.log("myJWT is NOT valid (valid/missing: " + myJWT.valid + ", current: " + myJWT.current + ")");
        myJWT.exists = false;
        tokenOK = false;
    }
    else {
        if(myJWT.minstoexpire < 0) {
            console.log("myJWT EXISTS but EXPIRED " + Math.abs(myJWT.minstoexpire) + " mins ago");
//            showNoty('Your token has expired, please log in again', 'error', 'center', 4000);

            localStorage.removeItem(LSTR_JWTTOKEN);
            localStorage.removeItem('loadsource');

            myJWT = new JWT(LSTR_JWTTOKEN);
            myJWT.exists = false;
            tokenOK = false;
        }
        else {
            console.log("myJWT is VALID and CURRENT (expires in " + myJWT.minstoexpire + " mins)");
        }
    }

    if(othJWT.status === 0) {
        console.log("othJWT is NOT valid (valid/missing: " + othJWT.valid + ", current: " + othJWT.current + ")");
        othJWT.exists = false;
        tokenOK = false;
    }
    else {
        if(LSTR_JWTTOKENOTHER.minstoexpire < 0) {
            console.log("othJWT EXISTS but EXPIRED " + Math.abs(myJWT.minstoexpire) + " mins ago");
//            showNoty('Your token has expired, please log in again', 'error', 'center', 4000);
            localStorage.removeItem(LSTR_JWTTOKENOTHER);
            othJWT = new JWT(LSTR_JWTTOKENOTHER);
            othJWT.exists = false;
//            tokenOK = false;
        }
        else {
            console.log("othJWT is VALID and CURRENT (expires in " + othJWT.minstoexpire + " mins)");
        }
    }

    return tokenOK
}

var Settings = {

    dataDefaults: {
        teamid: null,
        pin: null,
        token: null,
        created: null,
        renewed: null,
        expiry: null,
    },
    userip: null,
    logintype: 0,
    loadfromlocal: null,
    key: 'pstat.livescore',
    data: null,
    items() {
        return this.data;
    },
    load() {
        try {
            this.loadfromlocal = false;
            this.data = this.dataDefaults;
            var s = localStorage.getItem(this.key);
            if(s) {
                var d = JSON.parse(s);
                var now = $.now();
                console.log(((d.expiry - now) / 1000 / 60 / 60) + ' mins to expiry');
                if(now < d.expiry) {
                    this.data = d;
                    this.loadfromlocal = true
                    return true;
                }
                else {
                    this.clear();
                }
            }
            return false;
        }
        catch(exception){
            return false;
        }
    },
    save() {
        localStorage.setItem(this.key, JSON.stringify(this.data));
        return true;
    },
    create(rdata) {
        this.data.created = $.now();
        this.data.expiry = parseInt(rdata.expires / 1000);
        this.data.pin = Data.remote.remotepin;
        this.data.teamid = Data.myteam;
        this.data.hora = Data.myhora;
        this.data.token = rdata;
        this.save();
        console.log('CREATE');
        console.log(this.data);
    },
    renew(token) {
        this.data.renewed = $.now();
        this.data.expiry = parseInt(token.expires / 1000);
        this.data.token = token;
        this.save();
        console.log('RENEW');
        console.log(this.data);
    },
    clear() {
        localStorage.removeItem(this.key);
        this.data = this.dataDefaults;
    },
    isCurrent() {
        var o = JSON.parse(localStorage.getItem(this.key));
        if(o) {
            if(o.expiry <= parseInt($.now()/1000)) {
                localStorage.removeItem(this.key);
            }
            else {
                return true;
            }
        }
        return false;
    }
};

function getTokenID(tokenid) {
    if(udc(tokenid)) {
        tokenid = [];
        tokenid.push(LSTR_JWTTOKEN);
    }
    return tokenid;
}

/* START - AJAX GLOBAL FUNCTIONS */

var headerParams = {};

updateAjaxSetup();

//function updateAjaxSetup(tokenid)
function updateAjaxSetup()
{
    // if tokenid not specified, default to "my" team token
//    tokenid = getTokenID(tokenid);

    $.ajaxSetup({
        beforeSend: function(jqXHR, settings) {
//            console.log('AJAXSETUP:beforeSend');
//            console.log(jqXHR);
//            console.log(settings);
            var segments = settings.url.split('/');
            var action = segments[segments.length - 1];
//            var requiresToken = ['initdata'].indexOf(action) === -1;
            if(isset(settings.data) && settings.type === "POST") {
                headerParams = {};
//                console.log('CURR_TOKEN');
//                console.log(CURR_TOKEN);
                this.data += '&application_id=' + APPID;
//                if(this.data.indexOf('action=') === -1) {
//                    this.data += '&action=' + action;
//                }
//                this.data += '&password=' + PWD;

                if(myJWT.status == 1 && CURR_TOKEN === LSTR_JWTTOKEN)
                {
                    console.log('myJWT');
                    console.log(myJWT);
                    this.data += '&mytoken=' + myJWT.tokenstring;
                }
                else if(othJWT.status == 1 && CURR_TOKEN === LSTR_JWTTOKENOTHER)
                {
                    console.log(othJWT);
                    this.data += '&othtoken=' + othJWT.tokenstring;
                }
//                console.log(settings.data);
            }
        },
        type: "POST",
        dataType: "json",
        timeout: 15000,     // allow 15 seconds
        data: {
//            application_id: APPID,
//            password: PWD
        }
    });
    console.log($.ajaxSetup());
}

function checkAjaxHeaders(tokenid)
{
    // if token not defined, return the headers object
    if(udc(tokenid)) {
        return headerParams;
    }
    else {
        // otherwise, return true/false for the specified tokenid
        return isset(headerParams[tokenid]);
    }

}

// fires if there are NO CURRENT AJAX REQUESTS running
$( document ).ajaxStart(function() {
    console.log("===> ajaxStart <===")
    loadershow();
//    $(".ms.result").css("pointer-events", "none");
//    $(".playersub.showlink").css("pointer-events", "none");

});

// fires when an ajax request completes
$( document ).ajaxComplete(function() {
    console.log("===> ajaxComplete <===")
    loaderhide();
});

// fires when an ajax request completes there are NO MORE CURRENT AJAX REQUESTS running
$( document ).ajaxStop(function() {
    console.log("===> ajaxStop <===")
//    $(".ms.result").css("pointer-events", "auto");
//    $(".playersub.showlink").css("pointer-events", "auto");
});

$(document).on("click", ".sc-seqinfolink", function() {
    console.log(SHOW_FRAME_SEQ);
    if(SHOW_FRAME_SEQ) {
        $(".sc-sequenceinfo").addClass("hidden");
        $(".sc-seqinfolink.off").removeClass("hidden");
        SHOW_FRAME_SEQ = false;
    }
    else {
        $(".sc-sequenceinfo").removeClass("hidden");
        $(".sc-seqinfolink.off").addClass("hidden");
        SHOW_FRAME_SEQ = true;
    }
    return false;
});

$(document).ajaxSuccess(function(event, jqXHR, settings) {
    console.log("===> ajaxSuccess <===");
//    console.log(event);
//    console.log(jqXHR);
//    console.log(settings);
});

$(document).ajaxError(function(event, jqxhr, settings, thrownError) {
    console.log("===> ajaxError <===")
    displayErrMsg('Error', jqxhr);
});

/* END - AJAX GLOBAL FUNCTIONS */
// 7895233249
// PS_PUBLIC_BOTTOM

var LOAD_ADSENSE = false;

// if there are current Settings, automatically re-load the match
if(Settings.load()) {
    console.log('Settings.load() EXISTS, bypassing Index and Loading Home Page');
    initLandingPage("pin", Settings.data.pin);
}

// PIN  LOGIN MODE
// else if(thispage.indexOf("?pin=") > -1) {
//     var pin = getParameterByName("pin");
//     console.log("pin = " + pin);
//     initLandingPage("pin", pin);
// }

// TEAM PASSWORD MODE
//else if(thispage.indexOf("?team=") > -1) {
//    var team = getParameterByName("team");
//    console.log("team = " + team);
//    initLandingPage("team", team);
//}
//
//// TEAM PASSWORD MODE
//else if(thispage.indexOf("?setpwd=") > -1) {
//    var pwd = getParameterByName("setpwd");
//    console.log("pwd = " + pwd);
//    initLandingPage("setpwd", pwd);
//}

// ADMIN MODE - MOVED TO LSVIEW TEMPLATE
//else if(thispage.indexOf("?comp=") > -1) {
//    var comp = getParameterByName("comp");
//    console.log("comp = " + comp);
//    IS_ADMIN = true;
//    initLandingPage("comp", comp);
//}

else {
    // SHOW ONLY SELECTED COMP
    if(thispage.indexOf("?compid=") > -1) {
        var cids = getParameterByName("compid");
        console.log("cids = " + pin);
    }

    console.log("none = null");

    var prevset = JSON.parse(localStorage.getItem('lastview'));

    if(prevset === null) {
        initLandingPage("none", null);
    }
    else {
        console.log(prevset);

        CPage.compid = prevset.compid;

        initLandingPage("none", prevset.seldate);

        localStorage.removeItem('lastview');

        CPage.compid = 0;
    }
}

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

function escapeHtml(string) {
    var data = $.trim(string);
    return String(data).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}

$( document ).bind( "mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!
    $.mobile.allowCrossDomainPages = true;
});

$(document).on("click", ".mycoltitle", function() {
    var mycoll = $(this).parent();
    if($(this).hasClass("ui-icon-minus")) {
//        $(mycoll).find(".menuli").hide("slow");
        $(mycoll).find(".mycollcontent").slideUp("slow");
        $(this).removeClass("ui-icon-minus").addClass("ui-icon-plus");
        $(mycoll).addClass("collapsed").removeClass("expanded");
    }
    else {
//        $(mycoll).find(".menuli").show("slow");
        $(mycoll).find(".mycollcontent").slideDown("slow");
        $(this).removeClass("ui-icon-plus").addClass("ui-icon-minus");
        $(mycoll).removeClass("collapsed").addClass("expanded");
    }
});

var startdata = "{\"accordion\":[],\"scrollpos\":0}";

$( ".activematchset" ).on( "collapsibleexpand", function( event, ui ) {
    var id = $(this).attr("data-compid");
    console.log("ADD " + id);
    var openlist = localStorage.getItem("opencomppanels") ? localStorage.getItem("opencomppanels") : startdata;
    var data = JSON.parse(openlist);
    console.log(data);
    var key = (udc(data.accordion) ? -1 : data.accordion.indexOf(id));
    console.log(key);
    if(key === -1) {
        if(udc(data.accordion)) {
            data.accordion = [];
        }
        data.accordion.push(id);
    }
    console.log(data);
    localStorage.setItem("opencomppanels", JSON.stringify(data));

});

$( ".activematchset" ).on( "collapsiblecollapse", function( event, ui ) {
    var id = $(this).attr("data-compid");
    console.log("==> REMOVE " + id);
    var openlist = localStorage.getItem("opencomppanels") ? localStorage.getItem("opencomppanels") : startdata;
    var data = JSON.parse(openlist);
    console.log(data);
    var key = (udc(data.accordion) ? -1 : data.accordion.indexOf(id));
    console.log(key);
    if(key > -1) {
        data.accordion.splice(key, 1);
    }
    console.log(data);
    localStorage.setItem("opencomppanels", JSON.stringify(data));
});

var xobj;

$(document).on("click", ".pbutton2", function(e) {
//    console.log($(this).attr("id"));
});

/******************************************************
 * PAGES
 */
$(document).on('pagebeforeshow', '#IndexPage', function ()
{
    CPage.setPage(PAGE_INDEX);

    let today, sqldate, date;

    for(var i = 1; i < 11; i++)
    {
        today = moment().subtract(i, "d");
        sqldate = today.format("Y-MM-DD");
        date = today.format("ddd, D-MM-Y");
//        $('#select-match-date').append('<option value="' + sqldate + '>' + date + '</option>');
        $('<option>').attr({'value': sqldate}).html(date).appendTo('#select-match-date');
    //    console.log(sqldate);
    }
//    $("#select-match-date").selectmenu();
//    $("#select-match-date").selectmenu('refresh', true);
});

$(document).on('pageshow', '#IndexPage', function ()
{
    $(".logoff").hide();
    if(isset(myJWT)) {
        if(myJWT.current === 1) {
            $(".logoff").show();
        }
    }
});

$(document).on("change", "#select-match-date", function() {
    var seldate = $(this).val();
    $(".ui-loader").show();
    initLandingPage('none', seldate, function() {
        $(".ui-loader").hide();
    });
});

$(document).on('pagebeforeshow', '#HomePage', function ()
{
    loadgtag('home');

    console.log('pagebeforeshow-HomePage');

    CPage.setPage(PAGE_HOME);

    if(Data.config.appmethod == METHOD_DUAL_AUTH) {
        $(".singleauth").hide();
    }

    Teams.getStage();

    calcTotals();

});

$(document).on('pageshow', '#HomePage', function ()
{
    console.log('===>> pageshow-HomePage');

    clearInterval(FinaliseInterval);
    FinaliseInterval = 0;

    clearInterval(MS_INTERVAL);
    MS_INTERVAL = 0;

//    console.log($("#switchaccess").length);

    // if passwordtype = 1 (Team PASSWORD = 0, Team PIN = 1) OR logintype = 1 (Match PIN)
    // LOGIN_MATCHPIN = 1;
    // LOGIN_TEAMPWD = 2
//    if(Settings.logintype !== LOGIN_TEAMPWD) {
//        $("#setpassword").hide();
//    }
    var hora_array = [' (home)',' (away)'];
    var twa = 0;
    var twla = 1;
    if(!Teams.myishome) {
        twa = 1;
        twla = 0;
    }

    if(Teams.myistwa) {
        $("#accessteamname").text(Teams.my.shortname + hora_array[twa]);
        $("#noaccessteamname").text(Teams.other.shortname + hora_array[twla]);
    }
    else {
        $("#noaccessteamname").text(Teams.my.shortname + hora_array[twa]);
    }

    if(Teams.myistwa) {     // Data.remote.hasaccess === "1"

        console.log("setting ACCESS: method = " + Data.config.appmethod);

        // Data.config.appmethod = 1;  // Both Teams on Home Page - No Auth Reqd
        // Data.config.appmethod = 2;  // Both Teams on Home Page - Auth Reqd
        // Data.config.appmethod = 3;  // One Team on Home Page

        $(".noaccessteam").addClass('hidden');
        $(".accessteam").removeClass('hidden');
        // show switch access option
        $("#switchaccess").show();

        // if the other jwt token exists, expose the options
        console.log("setting NO-ACCESS: method = " + Data.config.appmethod);

        if(Data.config.appmethod === "1") {
            if(Teams.myistwa) {
                if(Teams.twa.sellockopt === 2) {
                    // default away team has no access
                    $(".noaccesslogin").parent().addClass("hidden");
                    showNoAccessOptions();
                }
                else {
                    if(localStorage.getItem(LSTR_JWTTOKENOTHER) !== null) {
                        showNoAccessOptions();
                    }
                }
            }
            else {
                $(".noaccesslogin").parent().addClass("hidden");
            }
        }
        else if(Data.config.appmethod === "2") {
            if(localStorage.getItem(LSTR_JWTTOKENOTHER) !== null) {
                showNoAccessOptions();
            }
        }
        else if(Data.config.appmethod === "3") {
            $(".noaccessteam.mycollapsible").addClass("hidden");
        }
    }
    else {
//console.log("setting NOACCESS");
        //devicestatus nocontrol hidden
//        $(".devicestatus").removeClass('hidden control nocontrol');
//        if(Teams.twla.sellockopt == 1) {
//            $(".devicestatus").addClass('nocontrol');
//        }
//        else if(Teams.twla.sellockopt === 2) {
//            $(".devicestatus").addClass('control');
//        }
//        else {
//            $(".devicestatus").addClass('hidden');
//        }

        $(".accessteam").addClass('hidden');
        $(".noaccessteam").removeClass('hidden');
        // hide switch access option
        $("#switchaccess").hide();

    }

    updateMatchScorePanel('home');      // home page

    if(Data.rounds.count > 1) {
        $("#myteaminfo").show();
        let multi = '<div class="divTable" style="border-collapse:separate;border-spacing:3px;">';
        // font-family: "Roboto Condensed","RobotoDraft","Roboto","Helvetica Neue",sans-serif;font-weight: 400;
        let homelose = '';
        let awaylose = '';
        let mstatus = "matchdone", status;
        $.each(Data.rounds.matches, function(mtime,o) {
            console.log(o);
            if(Data.draw.id == o.drawid) {
                mstatus = "matchactive";
            }
            else {
                status = Teams.my.team == "H" ? o.homestatus : o.awaystatus;
                if(status < "3") {
                    mstatus = "matchwait";
                }
            }
            let starttime = moment.unix(mtime).format('h:mma');
            let panelcolor = Data.draw.id == o.drawid ? ' style="background-color: rgb(150,255,150);"' : '';

            let hscore = parseInt(o.homeframescore) + parseInt(o.homeframescoreadj);
            let ascore = parseInt(o.awayframescore) + parseInt(o.awayframescoreadj);

            if( matchHasPoints() ) {
                hscore = +(parseFloat(o.homeframepoints) + parseFloat(o.homeframepointsadj)).toFixed(2);
                ascore = +(parseFloat(o.awayframepoints) + parseFloat(o.awayframepointsadj)).toFixed(2);
            }

            multi += String.format('<div class="divTableRow"><div class="divTableCell selteam matchrowview {10}" {2} data-drawid="{0}">' +   //  style="padding:5px;"
                '<table class="matchtbl" width="100%"><tr class="matchok" id="draw_{0}">' +
                '<td class="no-narrow" style="width:12%;min-width:65px;font-size:0.8em;">{3}</td>' +
                '<td class="ar{8}" style="width:32%">{6}</td>' +
                '<td id="score_{0}" class="ac matchscore">{4} : {5}</td>' +
                '<td class="{9}" style="width:32%">{7}</td>' +
                '</tr></table></div></div>', o.drawid, o.drawid, panelcolor, starttime, hscore, ascore,
                o.homeshortlabel, o.awayshortlabel, homelose, awaylose, mstatus);
        });
        $('.myteaminfocontent').html(multi + "</div>");
    }
    else {
        $("#myteaminfo").hide();
    }

    setAutoApproveText();

    let lstatus = LegendSaveCount();

    if(lstatus.id < 2) {
        $("#enterresults").addClass("ui-disabled");
    }

    if(Teams.twa.data.legendsave > 0) {
        $("#playerselect_access").find('span').text(" (" + Teams.twa.data.legendsave + " selected)");
    }

    if(Teams.twla.data.legendsave > 0) {
        $("#playerselect_noaccess").find('span').text(" (" + Teams.twla.data.legendsave + " selected)");
    }

    var hscore = TeamTotal("H");
    var ascore = TeamTotal("A");

    if(Teams.myistwa) {
        if(Teams.twa.data.remotestatusid == "3" || Teams.myistwa === false) {
            $("#enterresultslabel").html("View Results (" + hscore + " : " + ascore + ")");   // <p>Enter your match results</p>
            if($("#score_" + Data.draw.id).length > 0) {
                $("#score_" + Data.draw.id).text(hscore + " : " + ascore);
            }
        }
        else {
            $("#enterresultslabel").html("Enter Results (" + hscore + " : " + ascore + ")");   // <p>Enter your match results</p>
        }
    }
    else {
        $("#viewresultslabel").html("View Results (" + hscore + " : " + ascore + ")");   // <p>Enter your match results</p>
    }

    // update the TODAYS MATCHES info if it exists
    if($("#score_" + Data.draw.id).length > 0) {
        $("#score_" + Data.draw.id).text(hscore + " : " + ascore);
    }

    if(!checkAjaxHeaders(LSTR_JWTTOKEN)) {
        // if so, update ajaxSetup to the Other Token
        console.log('**** RESETTING DEFAULT TOKEN TO TWA USER');
        updateAjaxSetup([LSTR_JWTTOKEN]);
    }

    Teams.getStage();

    setFooter('hmfootertext');

});

$(document).on("click", ".show-all", function() {
    console.log("show-all");
    $(this).closest('span').addClass("hidden");
    $('.show-fav').closest('span').removeClass("hidden");
    $(".nofav").closest(".activematchset").removeClass("hidden");
    return false;
});

$(document).on("click", ".show-fav", function() {
    console.log("show-fav");
    $(this).closest('span').addClass("hidden");
    $('.show-all').closest('span').removeClass("hidden");
    $(".nofav").closest(".activematchset").addClass("hidden");
    return false;
});

$(document).on("click", ".info-fav", function() {
    let msg = "<p>Open a comp then tap the red star on the right to be prompted to update the the favourite status of the selected Comp</p>" +
        "<p>A green dot will appear on the left side of the comp header to indicate the comp is set as a Favourite</p>" +
        "<p>You can switch between a list of your favourites and a list of all comps using the link to the left of the info icon</p>";

    myAlert("info", "Manage Favourites", msg);
    return false;
});

$(document).on("click", ".info-dates", function() {
    let msg = "<p>Click TODAYS MATCHES to select a date from the last 48 days</p>";

    myAlert("info", "Manage Favourites", msg);
    return false;
});

$(document).on('tap', '.fav-star', function () {
    let obj = $(this).closest(".activematchset");
    let compid = $(obj).attr("data-compid");
    let thisFav = ",fav" + compid;
    let favs = localStorage.getItem("ls.favs");
    console.log(compid, thisFav, favs);
    let isfav = $(obj).find(".fav").hasClass("isfav");
    let msg = "Add this Comp to favourites?";
    if(isfav) {
        msg = "Remove from favourites?";
    }
    myConfirm("Favourites", msg, {ok: 'OK', yes: 'Yes', cancel: 'No'}, function(answer) {
        console.log(answer);
        if(answer) {
            console.log($(obj).find(".fav"));
            if( isfav  ) {
                $(obj).find(".fav").removeClass("isfav").addClass("nofav");;
                favs = favs.replace(thisFav, "");
            }
            else {
                $(obj).find(".fav").addClass("isfav").removeClass('nofav');
                favs += thisFav;
            }
            localStorage.setItem("ls.favs", favs);
        }
    });
    return false;
});

$(document).on('pagebeforehide', '#PlayerSelectPage', function () {
    console.log('pagebeforehide-PlayerSelectPage');
    clearInterval(lockcheckinterval);
    lockcheckinterval = 0;
});

$(document).on('pagebeforeshow', '#PlayerSelectPage', function () {

    loadgtag('playerselect');

    CPage.setPage(PAGE_PLAYER);

    console.log('pagebeforeshow-PlayerSelectPage');

    if(udc(CURR_TEAM)) {
        throw 'CURR_TEAM has not been set';

    }
//    console.log('displayPlayerSelect(' + CURR_TEAM + ')');

    loadershow();

    displayPlayerSelect(CURR_TEAM);

    var hora = CURR_TEAM[0];

    initSortable();

    // if legend entries exist, set sorting on
    if(Teams[hora].data.legendsave > 0) {
        setSortMode('asc');
    }
});

$(document).on('pagebeforeshow', '#ViewResultsPage', function (data) {

    loadgtag('viewresults');

    console.log(data);

    CPage.setPage(PAGE_VIEWRES);

    console.log('pagebeforeshow-ViewResultsPage');

    loadershow();

    displayEnterResults(true);

    $("#resultsheader").removeClass('refreshwait');
});

$(document).on('pageshow', '#ViewResultsPage', function () {
    if(myJWT.current === 0) {
//        loadAdsenseAds('VIEW', 'view');
    }
    else {
        console.log("ADSENSE INGORED!");
    }
});

$(document).on('pagebeforeshow', '#EnterResultsPage', function (data) {

    loadgtag('enterresults');

    console.log(data);

    CPage.setPage(PAGE_RESULTS);

    console.log('pagebeforeshow-EnterResultsPage');

    loadershow();

    // Livescore App users
//    if(CPage.param != 'readOnly') {

        if(myJWT.exists === 1) {

            CURR_TEAM = myJWT.teamid == 0 ? Teams.my.teamcode : myJWT.teamcode;
            CURR_TOKEN = LSTR_JWTTOKEN;

            console.log('CURR_TEAM: ' + CURR_TEAM);

            CPage.ltype = LOGIN_TOKEN;
            CPage.drawid = 0;
        }
//    }

    console.log(CPage);

    displayEnterResults(false);

    $("#resultsheader").removeClass('refreshwait');
});

$(document).on('pageshow', '#EnterResultsPage', function () {

    gtag('config', 'UA-51766463-3', {'page_path': '/' + PAGE_RESULTS});

    console.log('pageshow-EnterResultsPage');
    console.log($("#logoff").length);

    $(".logoff").hide();

    if(isset(Teams)) {
        if(Teams.myLoggedIn()) {
            $(".logoff").show();
        }
    }
});

$(document).on('pagebeforeshow', '#FinaliseMatchPage', function () {

    loadgtag('finalisematch');

    CPage.setPage(PAGE_FINAL);

    console.log('pagebeforeshow-FinaliseMatchPage');

    displayFinaliseMatch();
});

function getQueryVariable(url, variable)
{
    var query = url.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

//$(document).on('pagebeforeshow', '#AdminPage', function () {
//
//    console.log('pagebeforeshow-AdminPage');
//
//    var html = '<h4>' + Data.compname + ': Matches for ' + Data.playdate + '</h4>';
//
//    var i = 0;
//    $.each(Data.draws, function(k, o) {
//
//        //rows
//        var hid = "H-" + o.hometeamid;
//        var aid = "A-" + o.awayteamid;
//
//        var htstatus = "tstatus-red";
//        var atstatus = "tstatus-red";
//        if(o.remote.length > 0) {
//            if(o.remote.H.remotedeviceid != null) {
//                htstatus = "tstatus-yellow";
//            }
//            if(o.remote.A.remotedeviceid != null) {
//                atstatus = "tstatus-yellow";
//            }
//        }
//
//        html += '<div class="adm-match">';                                      // adm-match
//
//        html += '<div class="row a home ' + hid + '" data-index="' + k + '" data-teamid="' + o.hometeamid + '">';        // row
//        html += '<div class="col-xs-8 admcell admtname" data-lock="' + o.remote.H.legendlock + '" data-access="' + o.remote.H.hasaccess +
//                '" data-teamname="' + o.hometeam + '">' + o.hometeam + (o.remote.H.hasaccess == "1" ? " *" : "") + '</div>';
//        html += '<div class="col-xs-2 admcell admscore score">' + o.homescore + (o.remote.H.remotestatusid == "3" ? ".F" : "") + '</div>';
//        html += '<div class="col-xs-2 admcell admtime ' + htstatus + '">0</div>';
//        html += '</div>';                                                       // row
//
//        i++;
//
//        html += '<div class="row a away ' + aid + '" data-index="' + k + '" data-teamid="' + o.awayteamid + '">';        // row
//        html += '<div class="col-xs-8 admcell admtname" data-lock="' + o.remote.A.legendlock + '" data-access="' + o.remote.A.hasaccess +
//                '" data-teamname="' + o.awayteam + '">' + o.awayteam + (o.remote.A.hasaccess == "1" ? " *" : "") + '</div>';
//        html += '<div class="col-xs-2 admcell admscore score">' + o.awayscore + (o.remote.A.remotestatusid == "3" ? ".F" : "") + '</div>';
//        html += '<div class="col-xs-2 admcell admtime ' + atstatus + '">0</div>';
//        html += '</div>';                                                       // row
//
//        i++;
//
//        html += '</div>';                                                       // adm-match
//    });
//
//    $("#admin-div").append(html);
//
//    setFooter('adfootertext');
//
//});

/******************************************************
 * ELEMENT EVENTS
 */
function getSorted(selector, attrName, dir) {
    return $($(selector).toArray().sort(function(a, b){
        var aVal = parseInt(a.getAttribute(attrName)),
            bVal = parseInt(b.getAttribute(attrName));
        return (dir === 'asc' ? aVal - bVal : bVal - aVal);
    }));
}

var sortmode = { off: 'asc', asc: 'off' };

function setSortMode(newsort) {

console.log('setSortMode');

    var obj = $(".sortswitch");

    $(obj).attr("data-sortmode", newsort);
    $(obj).find("img").attr("src", "/images/sort-" + newsort + ".png");

    var newhtml = null;
    if(newsort === "off") {
        console.log("SORT DISABLED");
        newhtml = getSorted('div.pselect.row', 'data-id', 'asc');
        $(".playerselect.code").find("img").addClass("hidden");
        $('#playerselect-div').sortable('disable');
    }
    else {
        $('#playerselect-div').sortable('enable');
        if(newsort == "asc") {
            console.log("SORT ASCENDING");
            newhtml = getSorted('div.playerselected.row', 'data-pos', 'asc');
        }
        else {
            console.log("SORT DESCENDING");
            var newhtml = getSorted('div.playerselected.row', 'data-pos', 'desc');
        }
        $(".playerselect.code").find("img").removeClass("hidden");
    }
    $(newhtml).insertAfter("div.row.pselheader");
}

$(document).on("tap", ".sortswitch", function() {

    var currsort = $(this).attr("data-sortmode");

    var newsort = sortmode[currsort];

    setSortMode(newsort);

});

//$('#playerselect-div').sortable({
//    items: 'div.playerselected',
//    placeholder: "rgb(220, 255, 220)"
//});

var fixHelper = function(e, ui) {
    ui.children().each(function() {
        $(this).width($(this).width());
    });
    return ui;
};

function initSortable()
{
    $('#playerselect-div').sortable({
        items: '.playerselected',
        forcePlaceholderSize: true,
        forceHelperSize: true,
        handle: '.code.playerselect',
        update : function () {

            var teamcode = $("#psteamname").attr("data-side");

            $('.row.playerselected').each(function(pos, row) {

                var pid = $(row).attr("data-id");
                var lc = Legend[teamcode][pos];

                updateLegendPlayer(row, teamcode, pid, pos, lc.code, lc.gbcode);

            });
        },
        helper: fixHelper
    }).disableSelection();

    $('#playerselect-div').sortable("disable");
}

$(document).on("change", "#select-round", function() {
    console.log('click');
    var rmid = $(this).val();
    loadershow();
    populateHomePage('remote', rmid);
    return false;
});

$(document).on('click', '#msheetpreview', function() {

//    displayMatchsheetPreview(CURR_TEAM);
    $("#mspreviewpanel").panel("open");
});

$(document).on("panelopen", "#mspreviewpanel", function() {
    var h = $(this).height();
    console.log(h);
    $("#mspreviewdiv").height(h - 20);
});

/* PANEL MENU EVENTS */

$(document).on('click', '#pmenu_index', function() {

    $("#index_pmenu").panel("open");
});

$(document).on("panelopen", "#index_pmenu", function() {
    var h = $(this).height();
    console.log(h);
});

$(document).on('click', '#pmenu_home', function() {

    $("#home_pmenu").panel("open");
});

$(document).on("panelopen", "#home_pmenu", function() {
    var h = $(this).height();
    console.log(h);
});

$(document).on("panelopen", ".panelmenu", function() {
    console.log("openpanel::#" + $(this).attr("id"));
    let url = $(location).attr('origin');
    let src = "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=" + url + "&choe=UTF-8";
    if( $(this).find(".qrcode").length === 0) {
        $(this).append('<img class="qrcode" />');
        $(this).find(".qrcode").attr('src', src);
    }
});

$(document).on('click', '#pmenu_playerselect', function() {

    $("#playerselect_pmenu").panel("open");
});

$(document).on("panelopen", "#playerselect_pmenu", function() {
    var h = $(this).height();
    console.log(h);
});

$(document).on('click', '#pmenu_results', function() {

    $("#results_pmenu").panel("open");
});

$(document).on("panelopen", "#results_pmenu", function() {
    var h = $(this).height();
    console.log(h);
});

$(document).on('click', '#pmenu_finalise', function() {

    $("#finalise_pmenu").panel("open");
});

$(document).on("panelopen", "#finalise_pmenu", function() {
    var h = $(this).height();
    console.log(h);
});

$.event.special.tap.emitTapOnTaphold = false;

$(document).on("tap", ".ms.home.code", function()
{
    let row = $(this).parent();
    let gcode = $(this).attr("data-gcode");

    if( GBCodes[gcode].gbcode.type == 'L' ) {
        return false;
    }

    let result = $(row).find(".ms.result").text();

    console.log(result);

    if($(row).hasClass('playingnow')) {
        // cannot delete when match is in progress
        if(GBCodes[gcode].remotedata.resultstatus == "2") {
            if("??00".indexOf(result) > -1) {
                updateInProgress(0, row, gcode)
            }
        }
        else {
            updateInProgress(0, row, gcode)
        }
    }
    else {
        if("??00".indexOf(result) > -1) {
            updateInProgress(1, row, gcode)
        }
    }

});

function updateInProgress(newstatus, row, gcode)
{
    var blockno = $(row).attr("data-blockno");
    var pos = $(row).attr("data-pos");
    console.log(gcode);
    var ogcode = GBCodes[gcode].opponent;

    $.ajax({
        url: apiURL + 'updateinprogress',
        data: {
            action: 'updateinprogress',
            newstatus: newstatus,
            blockno: blockno,
            pos: pos,
            remid: GBCodes[gcode].remotedata.id,
            oremid: GBCodes[ogcode].remotedata.id,
        },
        success: function(data) {
            console.log(data);
            if(data.newstatus === '1') {
                $(row).addClass("playingnow");
            }
            else {
                $(row).removeClass("playingnow");
            }
        },
        error: function(errdata) {
            console.log(errdata);
        }
    })
}

$(document).on("click", ".clicklockmf", function()
{
    console.log('click.clicklockmf');

    var obj = $(this);

    var block = parseInt($(obj).parent().attr("data-blockno"));

    var hcode = $(obj).parent().find(".ms.home.code").attr("data-gcode");
    var acode = $(obj).parent().find(".ms.away.code").attr("data-gcode");

    var hjson = MatchTeams[block][hcode].json;
    var ajson =  MatchTeams[block][acode].json;

    openMatchOptionsPanel(obj, { hgbcode: hjson.player.gbcode, agbcode: ajson.player.gbcode }, parseInt(Data.config.autoclosetime) );
});

$(document).on("tap", ".ms.active.result", function()
{
    console.log('".ms.active.result" tapped');

    let obj = $(this);

    let block = parseInt($(obj).parent().attr("data-blockno"));

    let hcode = $(obj).parent().find(".ms.home.code").attr("data-gcode");
    let acode = $(obj).parent().find(".ms.away.code").attr("data-gcode");

    let gbcode = GBCodes[hcode];

    let hjson = MatchTeams[block][hcode].json;
    let ajson =  MatchTeams[block][acode].json;

    let pmiss = playersMissing({home: hcode, away: acode});

    if(pmiss > 0) {
        myAlert('error',"Players Missing", "There are " + pmiss + " players to be selected for this match", function() { });
        return false;
    }

    // is result field for partner of doubles match, no click allowed
    if($(obj).hasClass('ignore')) {
        return false;
    }

    // if the match is multiframe, trigger the extra section
    if($(obj).hasClass("mf")) {
        $(obj).trigger("taphold");
    }
    else {

        // if first score in block, disable all player links in the block

        let wintype = WIN_DEFAULT;

        // get the player ids so we can check if any players are set to forfeit or abandoned
        let hpid = parseInt($(obj).closest('div.statsedit').find('.home.code').data('id'));
        let apid = parseInt($(obj).closest('div.statsedit').find('.away.code').data('id'));

        // check if either player or both players are set to FORFEIT or ABANDONED
        if (RESTYPE_FORFEIT.indexOf(hpid) > -1 || RESTYPE_FORFEIT.indexOf(apid) > -1) {
            wintype = WIN_FORFEIT;

            // if both players set to forfeit, match is ABANDONED
            if (RESTYPE_FORFEIT.indexOf(hpid) > -1 && RESTYPE_FORFEIT.indexOf(apid) > -1) {
                wintype = WIN_ABANDONED;
            }

        } else if (RESTYPE_ABANDONED.indexOf(hpid) > -1 || RESTYPE_ABANDONED.indexOf(apid) > -1) {
            wintype = WIN_ABANDONED;
        }

        if( matchHasPoints() && wintype == WIN_DEFAULT ) {
            updatePointsScoreDialog(obj);
        }
        else {

            saveResultToDb(obj, 'score-code', wintype, false, function () {
                console.log("normal WIN only, no extra code");
            });
        }
    }
});

$(document).on("taphold", ".ms.active.result", function()
{
    console.log('taphold.ms.active.result');

    var obj = $(this);

    var block = parseInt($(obj).parent().attr("data-blockno"));

    var hcode = $(obj).parent().find(".ms.home.code").attr("data-gcode");
    var acode = $(obj).parent().find(".ms.away.code").attr("data-gcode");

    var pmiss = playersMissing({home: hcode, away: acode});

    var hjson = MatchTeams[block][hcode].json;
    var ajson =  MatchTeams[block][acode].json;

    if(pmiss > 0) {
        myAlert('error',"Players Missing", "There are " + pmiss + " players to be selected for this match", function() { });
        return false;
    }

    openMatchOptionsPanel(obj, { hgbcode: hjson.player.gbcode, agbcode: ajson.player.gbcode }, parseInt(Data.config.autoclosetime) );
});

function playersMissing(data) {

    let sides = ['home','away'];
    let miss = 0;

    let code, obj;

    for(let s = 0; s < sides.length; s++) {
        code = data[sides[s]];
        obj = parseInt($("#code_" + code).attr("data-id"));
        miss += (obj === 0 ? 1 : 0);
        if(GBCodes[code].gbcode.playersperside > 1) {
            var pobj = parseInt($("#code_" + GBCodes[code].partner).attr("data-id"));
            miss += (pobj === 0 ? 1 : 0);
        }
    };

    return miss;
}

$(document).on("tap", ".playersub.showlink", function()
{
    var obj = $(this);
console.log(obj);
    // if there is no existing player, show player list on single tap
    if(getPlayerId(obj) === 0) {
        $(this).trigger("taphold");
    }
});

function getPlayerId(obj) {
    var hora = $(obj).parent().hasClass("home") ? "home" : "away"
    var fcode = $(obj).closest('div.statsedit').find(".ms." + hora + ".code");
    var playerid = parseInt($(fcode).attr("data-id"));
    console.log('getPlayerId=' + playerid);
    return playerid;
}

$(document).on("taphold", ".playersub.showlink", function()
{
    console.log('.playersub.showlink');

    var obj = $(this);
    var parent = $(obj).closest('div.statsedit');

//    toggleDisabled(obj);

    var block = parseInt($(parent).attr("data-blockno"));
    var pos = parseInt($(parent).attr("data-pos"));

    var hcode = $(parent).find(".ms.home.code").attr("data-gcode");
    var acode = $(parent).find(".ms.away.code").attr("data-gcode");

    var hjson = MatchTeams[block][hcode].json;
    var ajson =  MatchTeams[block][acode].json;

    openMatchOptionsPanel(obj, { hjson: hjson, ajson: ajson }, parseInt(Data.config.autoclosetime) );
});

$(document).on("click", ".subselect", function()
{
    if($(this).hasClass("none")) {
        // no subs avalable
        return false;
    }

    var newcode = $(this).find(".msub.code").text();
    var newplayerid = $(this).find(".msub.code").attr("data-id");

    var gcode = $(this).closest("div.player-sublist-head").attr("data-gcode");
    var gbc = GBCodes[gcode];
    var newplyr;

    newplyr = Teams[gbc.hora].players[newplayerid];

console.log(newplyr);
console.log('gcode: ' + gcode);

    var hora = gbc.hora;
    var code = gbc.code;

    var data = {};

    var gcodes = {};
    var recids = [];

    gcodes[gcode] = {recid: gbc.recid, playerid: newplyr.id, pcode: newcode, rank: newplyr.rank};
    recids.push(gbc.recid);

    if(Data.config.subsallsremainingspots === "1" && newplyr.type == 1) {
        var cblock = parseInt(GBCodes[gcode].blockno);
//console.log('cblock: ' + cblock);
//        var cblock = Data.gameblocks[blockno];
        while(Data.gameblocks[cblock].nextblock > 0)
        {
            cblock = Data.gameblocks[cblock].nextblock;
//console.log(cblock + ' ' + hora + ' ' + code);
            // if the code exists in the next block, assign it
            if(isset(Spots[cblock][hora][code])) {
                gcode = Spots[cblock][hora][code].gcode;
                gbc = GBCodes[gcode];

                gcodes[gcode] = {recid: gbc.recid, playerid: newplyr.id, pcode: newcode, rank: newplyr.rank};
                recids.push(gbc.recid);
            }
//console.log(gcode);
        }
    }

    data['playerid'] = newplayerid;
    data['recids'] = recids;

    console.log(data);

    $.ajax({
        url: apiURL + 'updateplayersub',
        data: data,
        success: function(retdata) {
            console.log(retdata);
            $.each(gcodes, function(gcode, obj) {
                console.log(code + ' ' + newplyr.code);
                updateSubSelect(gcode, newplyr, (newplyr.code == '?' ? false : code !== newplyr.code) );
            })
            calcTotals();
            $("#closeadvres").trigger("click");
        },
        error:function(errdata) {
            console.log('ERROR');
            displayErrMsg('Error', errdata);    //  }
        }
    });

});

function updateSubSelect(gcode, plyr, notorig) {

    console.log('updateSubSelect: ' + gcode);
    var block = GBCodes[gcode].blockno;
    var showcode = getShowCode(Teams[gcode[0]].teamcode, plyr.code, block);
    if(notorig || Data.gameblocks[block].popfromlegend === 0) {
        if(showcode == '?') {
            $("#psub_" + gcode).parent().find(".snocode").addClass('hidden');
            $("#psub_" + gcode).removeClass('subnotorig fftaban');
        }
        else {
            if(plyr.type == 1) {
                $("#psub_" + gcode).parent().find(".snocode").removeClass('hidden').text(showcode);
                $("#psub_" + gcode).addClass('subnotorig');
            }
            else {
                $("#psub_" + gcode).addClass('fftaban');
            }
        }
    }
    else {
        $("#psub_" + gcode).parent().find(".snocode").addClass('hidden');
        $("#psub_" + gcode).removeClass('subnotorig fftaban');
    }

    if(plyr.id === 0) { // undo
        plyr.initials = '?';
        plyr.shortname = '?';
        plyr.fshortname = '?';
        plyr.fullname = '?';
    }

    $("#code_" + gcode).attr("data-id", plyr.id);
    $("." + gcode + ".initials").text(plyr.initials);
    $("." + gcode + ".shortname").text(plyr.shortname);
    $("." + gcode + ".fshortname").text(plyr.fshortname);
    $("." + gcode + ".fullname").text(plyr.fullname);
    $("." + gcode + ".rank").text(plyr.type > 1 ? '-' : plyr.rank);

    GBCodes[gcode].playerid = plyr.id;
    GBCodes[gcode].playercode = plyr.code;
    GBCodes[gcode].rank = plyr.rank;
}

$(document).on("click", ".finishrow", function()
{
    console.log("finishrow-button");

    var side = $(this).hasClass('home') ? 'home' : 'away';
    var obj = $(this).closest("div.matches").find(".ms.active.result." + side);

//    console.log(obj);
//    console.log(side);

    saveResultToDb(obj, 'fin-button', 'Y', 1, function() { $("#closeadvres").trigger("click"); } );
});

//$(document).on("click", ".more.advres.ab", function()
//{
//    myConfirm("Complete Score Sheet", "All unplayed games will be set to <b>ABANDONED</b>, click <b>Yes</b> to Continue",
//        function(answer) {
//            if(answer) {
//                $.mobile.changePage(PAGE_FINALISE);
//            }
//        }
//    );
//});

$(document).on("click", ".row.legedit", function()
{
    console.log('toggle legend row');

    let blockno = $(this).attr("data-blockno");
    let pos =  $(this).attr("data-pos");
    let id = '#legend-info-' + blockno + '-' + pos;
    if( $(id).hasClass('hidden') ) {
        $(id).removeClass('hidden');
        console.log('close panel');
    }
    else {
        $(id).addClass('hidden');
        console.log('open panel');
    }
});

$(document).on("click", ".legend-container-home, .legend-container-away", function()
{
   $(this).parent().addClass("hidden");
});

$(document).on("click", ".ui-btn.advres, .more.advres", function()
{
    console.log("advres-button");

    // clear the timeout setting, recreate when save request is complete
    var advpanel = $(this).closest("div.scoreparent");

    var closebtn = $(this).hasClass("more") ? $(this).closest("div.moremenu").find(".closemorebtn") : null;

    var multiframe = $(advpanel).attr("data-mformat") == "mf" ? 1 : 0;

    var btn = $(this);
    var wintype = $(btn).attr('data-rescode');

    var source = $(btn).hasClass('more') ? 'ext-more' : 'ext-button';

    var side = "home";
    if($(btn).hasClass('away')) {
        side = "away";
    }
    var match = $(this).closest("div.matches");
    var obj = $(match).find(".ms.active.result." + side);

    saveResultToDb(obj, source, wintype, multiframe, function() { if($(closebtn !== null)) { $(closebtn).trigger("click"); } }
//    function() {
//        console.log("restart timeout for advanced result");
//        var tmout2 = setTimeout(function() { closeMatchOptionsPanel($(advpanel), $(obj)); }, parseInt(Data.config.autoclosetime) );
//        $(advpanel).attr("data-delay", tmout2);
//        console.log('timeout2 = ' + tmout2);
//    }
    );

});

$(document).on("click", ".closemorebtn", function() {
    console.log("#closemorebtn");
    var rows = $(this).parent().find(".advres.more.hidden");
    if($(rows).length === 0) {
        rows = $(this).parent().find(".advres.more");
        $(rows).addClass("hidden");
        $(this).find('i').removeClass('zmdi-chevron-up').addClass('zmdi-chevron-down');
    }
    else {
        $(rows).removeClass("hidden");
        $(this).find('i').removeClass('zmdi-chevron-down').addClass('zmdi-chevron-up');
    }
});

//$(document).on("click", ".ui-btn.advres", function()
$(document).on("click", "#closeadvres", function() {
    console.log("#closeadvres");
    var advpanel = $(this).closest("div.scoreparent");
    var obj = $(this).data('obj');
    console.log(obj);
    console.log($(obj));
    closeMatchOptionsPanel($(advpanel), $(obj));
});

$(document).on("click", ".spinvalue.matchpoints", function() {

    if( ! $(this).hasClass("calc-screen")) {
        let calc = new Calculator(this);
        $("#frameadj-calc").append(calc.html);
        if ($(this).hasClass('home')) {
            $(".spinvalue.away").hide();
            $(".spinvalue.home").data("orig-value", $(".spinvalue.home").text());
        } else {
            $(".spinvalue.home").hide();
            $(".spinvalue.away").data("orig-value", $(".spinvalue.away").text());
        }
    }
    else {
        $(".calc-buttons .cancel").trigger("click");
    }
});

$(document).on("click", ".calc-buttons .cancel", function() {
    let screen = $(".fadgblock .calc-screen");
    let val = $(screen).data("orig-value");
    $(screen).data("orig-value","0");
    $(screen).text(val);
    $(screen).removeClass("calc-screen");
    $(".spinvalue.matchpoints").show();
    $("#frameadj-calc").empty();
});


$(document).on("click", ".calc-buttons .save", function() {

    let valobj = $("#matchfadg .calc-screen");
    let spinval =  $.trim($(valobj).text()) == "" ? "0" : $(valobj).text();

    let fadj = $(valobj).hasClass("home") ? "homeframepointsadj" : "awayframepointsadj";
    let data = {
        drawid: $(valobj).attr("data-drawid"),
        updatefield: fadj,
        updatevalue: spinval
    };
    $.ajax({
        url: apiURL + 'updateframeadj',
        type: "POST",
        dataType: "json",
        data: data,
        success: function(retdata) {
            $(valobj).text(spinval);
            $(valobj).data("orig-value", spinval);
            $(".calc-buttons .cancel").trigger("click");
        },
        error: function(error) {
            console.log(error);
        },
        complete: function() {

            var homeval = $(".spinvalue.home").text();
            var awayval = $(".spinvalue.away").text();

            Teams.home.data.homeframepointsadj = homeval;
            Teams.away.data.awayframepointsadj = awayval;

            $("#blockfadj").text(homeval + " - " + awayval);

            $(".spinner.spinkey").removeClass(".spinkeydisabled");
            console.log(valobj + " " + fadj + " " + spinval);

            updateMatchScorePanel('results');
        }
    });
});

$(document).on("click", "#calc-container .letter", function() {
    console.log('letter clicked');
    let screen = $(".fadgblock .calc-screen");
        let val = $(this).text();
    if( val === 'C' ) {
        $(screen).text("");
    }
    else if( val === '.' ) {
        let result = $(screen).text();
        if( result.indexOf('.') === -1 ) {
            result += val.toString();
            $(screen).text(result);
        }
    }
    else {
        let result = $(screen).text();
        result = result == '0' ? '' : result;
        result += val.toString();
        $(screen).text(result);
    }
});

$(document).on("click", ".spinner-points.spinkey", function()
{
    let thisObj = $(this).parent().find('.spinvalue');
    let thisVal = parseInt( $(thisObj).text() );   //spinner_H1200

    let oppRef = $(thisObj).hasClass('home') ? '.spinvalue.away' : '.spinvalue.home';
    let oppObj = $(thisObj).closest('div.modal-text').find(oppRef);
    let oppVal = parseInt( $(oppObj).text() );

    if ($(this).hasClass("spinminus")) {
        if(thisVal == 0) {
            thisVal = 10;
        }
        else if(thisVal == 10) {
            thisVal = 7;
        }
        else {
            thisVal--;
        }
    }
    else {
        if(thisVal == 10) {
            thisVal = 0;
        }
        else if(thisVal == 7) {
            thisVal = 10;
        }
        else {
            thisVal++;
        }
    }
    $(thisObj).text(thisVal);
    $(oppObj).text(oppVal);
});

$(document).on("click", ".spinner.spinkey", function() {
    if(!$(this).hasClass(".spinkeydisabled")) {
        $(".spinner.spinkey").addClass(".spinkeydisabled");
        var valobj = "#spinvalue_" + $(this).attr("data-rmid");
        var spinval = parseInt($(valobj).text());
        var fadj = $(this).parent().hasClass("home") ? "homeframescoreadj" : "awayframescoreadj";
        if($(this).hasClass("spinminus")) {
            spinval--;
        }
        else {
            spinval++;
        }
        var data = {
            drawid: $(valobj).attr("data-drawid"),
            updatefield: fadj,
            updatevalue: spinval
        };
        $.ajax({
            url: apiURL + 'updateframeadj',
            type: "POST",
            dataType: "json",
            data: data,
            success: function(retdata) {
                $(valobj).text(spinval);
                console.log(retdata);
            },
            error: function(error) {
                console.log(error);
            },
            complete: function() {

                var homeval = $(".spinvalue.home").text();
                var awayval = $(".spinvalue.away").text();

                Teams.home.data.homeframescoreadj = homeval;
                Teams.away.data.awayframescoreadj = awayval;

                $("#blockfadj").text(homeval + " - " + awayval);

                $(".spinner.spinkey").removeClass(".spinkeydisabled");
                console.log(valobj + " " + fadj + " " + spinval);

                updateMatchScorePanel('results');
            }
        });
    }
});

function openMatchOptionsPanel(obj, params, timer) {

    var parts = $(obj).attr("id").split("_");
//console.log(params);
    // player code
    var gcode = parts[1];
    var pm = GBCodes[gcode];

    var advpid = String.format('#input-{0}-{1}', pm.blockno, pm.row);

    if(pm.gbcode.playersperside > 1) {
        if($(obj).hasClass('result')) {
            advpid = String.format('#input-{0}-{1}', pm.blockno, ((pm.row + pm.gbcode.playersperside) - 1));
        }
    }

    var panel = $(advpid).find(".scorecontainer");

    $(panel).empty();

    var closebtn = String.format('<div class="closeadvres">' +
        '<button id="closeadvres" type="button" class="ui-btn ui-mini clr-btn-amber" data-obj="{0}" style">' +
        '<i class="zmdi zmdi-chevron-up"></i></button></div>', '#' + $(obj).attr("id"));

    // populate
    if($(obj).hasClass('result')) {

        console.log('load results form');

        var hcode = params.hgbcode;
        var hfcount = parseInt(GBCodes[hcode].remotedata.framecount);
        var acode = params.agbcode
        var afcount = parseInt(GBCodes[acode].remotedata.framecount);

        // advanced results
        $(panel).append(getScoreContainer(hcode, acode, closebtn, hfcount, afcount));

        $(".sc-seqinfolink").trigger("click");

        $(".mfscorebox").removeClass("win");
        if(hfcount > afcount) {
            $("#bigresult_" + hcode).addClass("win");
        }
        else if(hfcount < afcount) {
            $("#bigresult_" + acode).addClass("win");
        }

        if(GBCodes[hcode].gbcode.maxframes > 1) {
            updateSequence(GBCodes[hcode].remotedata.framesequence, hcode, (CPage.param == 'view' ? true : false));
        }
    }
    else {
        // player subs
        console.log('load player subs form');
        if(gcode[0]==="H") {
            $(panel).append(getPlayerSubContainer(obj, params.hjson, closebtn));
        }
        else {
            $(panel).append(getPlayerSubContainer(obj, params.ajson, closebtn));
        }

    }

    if($(obj).hasClass('clickmf')) {
        $(".sc-scorebox").hide();
        $(".sc-extended").hide();
    }

    // open the panel
    var advpanel = $(panel).parent();   // closest("div.matches").find("div.scoreparent");
    $(advpanel).slideToggle("slow");

    if(timer > 0) {
        var tmout = setTimeout(function() { closeMatchOptionsPanel($(advpanel), $(obj)); }, timer);
        $(advpanel).attr("data-delay", tmout);
        console.log('timeout = ' + tmout);
    }
}

function closeMatchOptionsPanel(advpanel, obj) {

    console.log('sliding up');
    console.log(advpanel);
    console.log(obj);

    $(advpanel).slideToggle("slow", function() {
        $(advpanel).find('.scorecontainer').empty();
    });
}

function saveResultToDb(obj, source, wintype, multiframe, success_extra) {

    // obj = $(obj).attr("id") = result_HO402
    // source = score-code, ext-more, ext-button, fin-button
    // wintype = W

    console.log('***(1) saveResultToDb:' + $(obj).attr("id") + " = " + source + "." + wintype);

    var block = parseInt($(obj).parent().attr("data-blockno"));

    var allresult = $.trim($(obj).closest('div.matches').find(".ms.active.result").text());

    var curresult = $.trim($(obj).text());

    var change = false;
    var undo = false;

    let hwin = 0;
    let awin = 0;

    let hfpoints = 0;
    let afpoints = 0;
    let chagescore;
    let data = {};

    data.hasmatchpoints = matchHasPoints() ? 1 : 0;

    if(source === 'frame-points') {

        console.log(source, wintype);

        hfpoints = wintype.h;
        afpoints = wintype.a;

        if( hfpoints === 10 && hfpoints === afpoints ) {
            myAlert('error', 'Invalid Score', 'Only one player can be assigned 10 points');
            return false;
        }
        else if( ! (hfpoints === 10 || afpoints === 10) && hfpoints + afpoints > 0 ) {
            myAlert('error', 'Invalid Score', 'One player must be assigned 10 points');
            return false;
        }

        hwin = hfpoints === 10 ? 1 : 0;
        awin = afpoints === 10 ? 1 : 0;

        wintype = 'W';
    }

    console.log(allresult);

    let changescore;
    
    if(multiframe == 1) {

        data.resultstatus = 2;

        // UNDO A SCORE
        if(['U'].indexOf(wintype) > -1) {
            console.log('multi-U');
            undo = (allresult === "01" || allresult === "10");
            if($(obj).hasClass('home')) {
                data.homeresult = wintype;
                data.awayresult = 'P';
            }
            else {
                data.homeresult = 'P';
                data.awayresult = wintype;
            }
        }

        // FINISH GAME (no changes to scores
        else if(['Y'].indexOf(wintype) > -1) {
            wintype = 'W';
            console.log('multi-Y: FINISH');
            data.resultstatus = 8;
            if($(obj).hasClass('home')) {
                data.homeresult = 'W';
                data.awayresult = 'L';
            }
            else if($(obj).hasClass('away')) {
                data.homeresult = 'L';
                data.awayresult = 'W';
            }
            else {
                data.homeresult = 'D';
                data.awayresult = 'D';
            }
        }

        // ABANDON
        else if(wintype == 'A') {

            console.log('multi-A');
            data.resultstatus = 32;
            data.homeresult = 'A';
            data.awayresult = 'A';
        }
        else if(wintype == 'F') {

            data.resultstatus = 16;
            if($(obj).hasClass('home')) {
                console.log('multi-FH');
                data.homeresult = wintype;
                data.awayresult = 'L';
            }
            else {
                console.log('multi-FA');
                data.homeresult = 'L';
                data.awayresult = wintype;
            }
        }
        else {

        // WIN, WIN-BY-FORFEIT, MB, MS, MC
            if($(obj).hasClass('home')) {
                console.log('multi-H[W/B/S/C]');
                data.homeresult = wintype;
                data.awayresult = 'L';
            }
            else {
                console.log('multi-A[W/B/S/C/F]');
                data.homeresult = 'L';
                data.awayresult = wintype;
            }
        }

        if(undo === true) {
            data.resultstatus = 1;
//            data.homeresult = 'X';
//            data.homeframecount = 0;
//            data.awayresult = 'X';
//            data.awayframecount = 0;
        }
    }
    else {
        // curresult = existing score code
        // wintype = new score code to replace curresult

        console.log(source, afpoints, hfpoints);

        let changescore;

        // if a score already exists - user either tapping L or any of the wintypes
        if(curresult !== "?")
        {
            changescore = 'Change the score to <b>' + wintype + '</b>?';
            if(curresult == "L") {
                change = true;      // prompt user to switch results
                // change to the wintype of the match
                if(source === 'score-code') {
                    wintype = allresult.replace("L","");
                }
            }
            else {
                if(source === 'score-code') {
                    undo = true;       // reverse any wintype back to ?
                }
                else {
                    if(source === 'frame-points') {
                        // undo is true if points are set to 0-0

                        if( hfpoints + afpoints === 0 ) {
                            undo = true;
                        }
                        else {
                            change = true;
                            changescore = 'Change the score?';
                        }
                    }
                    else {
                        change = true;
                    }
                }
            }
        }

        // source
        // score-code:  the score value in the game row
        // ext-button:  one of the buttons in the extended panel
        // ext-more:    one of the items in the extended panel "more" list
        // ext-fin:     the finish button in multi-frame mode

        console.log('- source:    ' + source);
        console.log('- wintype:   ' + wintype);
        console.log('- curresult: ' + curresult);
        console.log('- undo:      ' + (undo ? 'true' : 'false'));
        console.log('- change:    ' + (change ? 'true' : 'false'));

        if(undo === true) {
            // undo result
            console.log('wintype1: ' + wintype + '-A');
            data.resultstatus = 1;
            data.homeresult = 'X';
            data.homeframecount = 0;
            data.homeframepoints = 0;
            data.awayresult = 'X';
            data.awayframecount = 0;
            data.awayframepoints = 0;
        }
        else if(wintype == 'A') {           // ABANDONED

            console.log('wintype2: ' + wintype + '-A');
            data.resultstatus = 32;
            data.homeresult = WIN_ABANDONED;
            data.homeframecount = 0;
            data.homeframepoints = 0;
            data.awayresult = WIN_ABANDONED;
            data.awayframecount = 0;
            data.awayframepoints = 0;
        }
        else {
            if(source === 'frame-points') {
                console.log('wintype5: ' + wintype + '-A');
                data.resultstatus = 8;
                data.homeresult = hfpoints === 10 ? 'W' : 'L';
                data.homeframecount = hfpoints === 10 ? 1 : 0;
                data.homeframepoints = hfpoints;
                data.awayresult = afpoints === 10 ? 'W' : 'L';
                data.awayframecount = afpoints === 10 ? 1 : 0;
                data.awayframepoints = afpoints;
            }
            else {
                // ALL VALID WIN TYPES W, [B, S, C], F
                if ($(obj).hasClass('home')) {
                    console.log('wintype3: ' + wintype + '-A');
                    data.resultstatus = 8;
                    data.homeresult = wintype;
                    data.homeframecount = 1;
                    data.homeframepoints = hfpoints;
                    data.awayresult = 'L';
                    data.awayframecount = 0;
                    data.awayframepoints = 0;
                } else {
                    console.log('wintype4: ' + wintype + '-A');
                    data.resultstatus = 8;
                    data.homeresult = 'L';
                    data.homeframecount = 0;
                    data.homeframepoints = 0;
                    data.awayresult = wintype;
                    data.awayframecount = 1;
                    data.awayframepoints = 0;
                }
            }
        }
    }

    var hcode = $(obj).parent().find(".ms.home.code");
    var acode = $(obj).parent().find(".ms.away.code");

    data.drawid = parseInt(Teams.H.data.drawid);
    data.homermid = parseInt(Teams.H.data.id);
    data.awayrmid = parseInt(Teams.A.data.id);

    var homeid = $(hcode).attr("data-recid");
    var awayid = $(acode).attr("data-recid");

    var hgcode = $(hcode).attr('data-gcode');
    var agcode = $(acode).attr('data-gcode');

console.log(block + "-" + hgcode);
console.log(block + "-" + agcode);

    var hjson = MatchTeams[block][hgcode].json;
    var ajson = MatchTeams[block][agcode].json;

    data.homeid = parseInt(homeid);
    data.awayid = parseInt(awayid);

    data.home = hjson;
    data.away = ajson;

    data.action = 'saveResultToDb';
    data.multiframe = multiframe;
    data.partners = {};

    if(hjson.pperside > 1) {
        var mkey = block + '-' + hjson.grp;
        for(let i=2; i<=hjson.pperside; i++) {
            data.partners[i] = Multi[mkey]['seq'][i];
        }
    }

    if(undo === true || change === true) {
        var title = 'Confirm ' + (undo === true ? 'Undo' : 'Change');
        var msg = 'Do you wish to ' + (undo === true ? 'Reset this Game?' : changescore);
        var buttonText = {ok: 'OK', yes: 'Yes', cancel: 'No'};
        myConfirm(title, msg, buttonText, function(answer) {
           if(answer) {
               requestResultUpdate(data, wintype, obj, block, success_extra);
           }
        });
    }
    else {
        requestResultUpdate(data, wintype, obj, block, success_extra);
    }
}

function requestResultUpdate(data, result, obj, block, success_extra)
{
    console.log('***(2) requestResultUpdate ***');

    console.log( { data: data, result: result, obj: obj, block: block } );

    $.ajax({
        url: apiURL + 'updatematchscore1frame',
        data: data,
        success: function(retdata) {

            console.log(retdata);

            processResultUpdate(data, retdata, result, obj, block, false);

            success_extra();

        }
    });
}

function processResultUpdate(data, retdata, result, obj, block, isUpdate)
{
    console.log('***(3) processResultUpdate ***');

    var h = {};
    var a = {};

    isUpdate = udc(isUpdate) ? false : isUpdate;

    let multiframe = parseInt(data.multiframe);

    // current data
    h.p1 = data.home.player;
    a.p1 = data.away.player;
//    h.p2 = null;
//    a.p2 = null;

    // updated data
    h.d1 = retdata.home[h.p1.gbcode];
    a.d1 = retdata.away[a.p1.gbcode];
//    h.d2 = null;
//    a.d2 = null;

//console.log(data);
//console.log(retdata);

    if(data.home.pperside > 1) {
        for(let i=2; i<=data.home.pperside; i++ ) {
            var pc = 'p' + i;
            var dc = 'd' + i;
            h[pc] = data.partners[i].home;
            a[pc] = data.partners[i].away;
            h[dc] = retdata.home[h[pc].gcode];
            a[dc] = retdata.away[a[pc].gcode];
        }
    }

//console.log(h);
//console.log(a);

    if(h.d1.resultstatus === "1") {
        // remove score
        if(multiframe == 1) {
            updateResult(a, "0", multiframe);
            updateResult(h, "0", multiframe);
        }
        else {
            updateResult(a, "?", multiframe);
            updateResult(h, "?", multiframe);
        }
    }
    else if(h.d1.resultstatus === "2") {    // MULTI-FRAME: IN PROGRESS
        updateResult(a, 'P', multiframe);
        updateResult(h, 'P', multiframe);
    }
    else if(h.d1.resultstatus === "8") {    // FINALISED
        // add score
        if (h.d1.resultcode === "L") {
            // away team won
            updateResult(a, result, multiframe);
            updateResult(h, "L", multiframe);
        } else {
            // home team won
            updateResult(h, result, multiframe);
            updateResult(a, "L", multiframe);
        }
    }
    else if(h.d1.resultstatus === "16") {   // abandoned
        updateResult(h, result, multiframe);
        updateResult(a, result, multiframe);
    }
    else if(h.d1.resultstatus === "32") {   // abandoned
        updateResult(h, result, multiframe);
        updateResult(a, result, multiframe);
    }

    $(".mfscorebox").removeClass("win");

    if(h.d1.framecount > a.d1.framecount) {
        $("#bigresult_" + h.p1.gbcode).addClass("win");
    }
    else if(h.d1.framecount < a.d1.framecount) {
        $("#bigresult_" + a.p1.gbcode).addClass("win");
    }

    if(h.d1.resultstatus == 2) {
        $("#code_" + h.p1.gbcode).parent().addClass("playingnow");
    }
    else {
        $("#code_" + h.p1.gbcode).parent().removeClass("playingnow");
    }

    updateSequence(h.d1.framesequence, h.p1.gbcode, isUpdate);

    updateMatchScorePanel('results');

//    if(Data.config.disablesubonfirstresult === "1")
//    {
//        if(Totals[block].H + Totals[block].A === 0)
//        {
//            console.log("show all links for block " + block);
//            if($(obj).closest('div.matchset').hasClass("block1lock")) {
//                // do nothing - this is the first block and block1autolock = "1"
//            }
//            else {
//                $(obj).closest("div.matchblock").find(".playersub").addClass("showlink");
//            }
//        }
//        else {
//            console.log("hide all links for block " + block);
//            $(obj).closest("div.matchblock").find(".playersub").removeClass("showlink");
//        }
//    }
//    else if(h.d1.resultstatus === "1") {
    if(h.d1.resultstatus === "1") {
        if($(obj).closest('div.matchset').hasClass("block1lock")) {
            // do nothing - this is the first block and block1autolock = "1"
        }
        else {
            if(!isUpdate) {
                $(obj).closest(".statsedit").find(".playersub").addClass("showlink");
                if(isset(h.p2)) {
                    for(let i=2; i<=data.home.pperside; i++ ) {
                        var pc = 'p' + i;
                        $('#result_' + h[pc].gcode).closest(".statsedit").find(".playersub").addClass("showlink");
                    }
                }
            }
        }
    }
    else {
        if($(obj).closest('div.matchset').hasClass("block1lock")) {
            // do nothing - this is the first block and block1autolock = "1"
        }
        else {
            $(obj).closest(".statsedit").find(".playersub").removeClass("showlink");
            if(isset(h.p2)) {
                for(let i=2; i<=data.home.pperside; i++ ) {
                    var pc = 'p' + i;
                    $('#result_' + h[pc].gcode).closest(".statsedit").find(".playersub").removeClass("showlink");
                }
            }
        }
    }
}

function updateResult(o, val, multiframe) {

    console.log('updateResult', o);
    console.log('updateResult = ' + val + ':status=' + o.d1.resultstatus);  //
    /*
     * A = ABANDONED        - both sides red shading
     * F = FORFEIT          - win side blue shading
     * W = WIN              - win side green shading
     * B = MASTER BREAK     - win side green shading
     * S = MASTER SHOT      - win side green shading
     * C = MASTER CLEARANCE - win side green shading
     */
    var wintypes = ['A','F','W'];   //,'B','S','C'];
    $.each(Data.hashtags, function(k,o) {
        if(o.enabled == "1" && o.hashtagtypeid == "1") {
            wintypes.push(o.hashtag[1].toUpperCase());
        }
    });

//    ['A','F','W','B','S','C']

    let win = wintypes.indexOf(val);
    win = win > 2 ? 2 : win;

    let fld = $("#result_" + o.p1.gbcode);

    let rescode = val;

    if(multiframe == 1) {
        // show frame wins for multi-frame matches
        let fcount = o.d1.framecount;
        $(fld).text(fcount);
        $("#bigresult_" + o.p1.gbcode).text(fcount);
    }
    else if( matchHasPoints() ) {
        let fpoints = o.d1.framepoints;
        $(fld).text(fpoints);
//        $("#bigresult_" + o.p1.gbcode).text(fcount);
    }
    else {
        // show win type for single frame matches
        $(fld).text(rescode);
    }

    $(fld).attr("data-prev", rescode);

    let wincss = ['msaban', 'mswinfft', 'mswin'];

    let horacls = ".ms" + (o.p1.gbcode[0] === "H" ? ".home" : ".away");

    let pc;

    // clear all previous shading
    $(fld).parent().find(horacls).removeClass("mswin mswinfft msaban");
    if(isset(o.p2)) {

console.log(o);
        for(let i=2; i<=o.p2.gbcode.playersperside; i++ ) {
            pc = 'p' + i;
            $("#result_" + o[pc].gcode).parent().find(horacls).removeClass("mswin mswinfft msaban");
        }
    }

    if(win > -1) {
        $(fld).parent().find(horacls).addClass(wincss[win]);
        if(isset(o.p2)) {
            for(let i=2; i<=o.p2.gbcode.playersperside; i++ ) {
                pc = 'p' + i;
                $("#result_" + o[pc].gcode).parent().find(horacls).addClass(wincss[win]);
            }
        }
    }

    GBCodes[o.p1.gbcode].remotedata.resultcode = o.d1.resultcode;
    GBCodes[o.p1.gbcode].remotedata.resultstatus = o.d1.resultstatus;
    GBCodes[o.p1.gbcode].remotedata.framecount = o.d1.framecount;
    GBCodes[o.p1.gbcode].remotedata.framepoints = o.d1.framepoints;
    GBCodes[o.p1.gbcode].remotedata.updatedatetime = o.d1.updatedatetime;
    GBCodes[o.p1.gbcode].remotedata.framesequence = o.d1.framesequence;

    if(isset(o.p2)) {
        let dc;
        for(let i=2; i<=o.p1.gbcode.playersperside; i++ ) {
            pc = 'p' + i;
            dc = 'd' + i;
            GBCodes[o[pc].gcode].remotedata.resultcode = o[dc].resultcode;
            GBCodes[o[pc].gcode].remotedata.resultstatus = o[dc].resultstatus;
            GBCodes[o[pc].gcode].remotedata.framecount = o[dc].framecount;
            GBCodes[o[pc].gcode].remotedata.framepoints = o[dc].framepoints;
            GBCodes[o[pc].gcode].remotedata.updatedatetime = o[dc].updatedatetime;
        }
    }
}

//function getMatchDetails(gbcode)
//{
//    var md = {};
//    var mydata = GBCodes[gbcode];
//    var othdata = GBCodes[mydata.opponent];
//    var mypdata = null;
//    var othpdata = null;
//    if(mydata.gcode !== mydata.partner) {
//        mypdata = GBCodes[mydata.partner];
//    }
//    if(othdata.gcode !== othdata.partner) {
//        othpdata = GBCodes[othdata.partner];
//    }
//
//    md[mydata.gcode[0]][0] = GBCodes[gbcode];
//    if(mypdata !== null) {
//        var last = mydata.gcode.length - 1;
//        var lastp = mypdata.gcode.length - 1;
//        if(parseInt(mydata.gcode[last]) < parseInt(mypdata.gcode[lastp])) {
//            md["H"][1] = GBCodes[mydata.partner];
//        }
//        else {
//            md["H"][0] = GBCodes[mydata.partner];
//            md["H"][1] = GBCodes[gbcode];
//        }
//    }
//
//    md[othdata.gcode[0]][0] = GBCodes[mydata.opponent];
//    if(othpdata !== null) {
//        var last = othdata.gcode.length - 1;
//        var lastp = othpdata.gcode.length - 1;
//        if(parseInt(othdata.gcode[last]) < parseInt(othpdata.gcode[lastp])) {
//            md["H"][1] = GBCodes[othdata.partner];
//        }
//        else {
//            md["H"][0] = GBCodes[othdata.partner];
//            md["H"][1] = GBCodes[mydata.opponent];
//        }
//    }
//    return md;
//}

$(document).on("tap", ".scoreadvanced", function() {

    if($(this).hasClass("saveclose")) {

    }
    else {
        // revert scores to previously saved value - no need to save
        var match = $(this).closest('div.matches');
        var results = $(match).find('.result.score');
        $.each(results, function(k, o) {
            var res = $(o).attr('data-prev');
            $(o).text(res);
        });
    }
    $(this).closest("div.scoreparent").hide();
});

$(document).on("click", ".teamtitle", function() {
    var teamid = toggleTeamName($(this).attr("id"));
    console.log(teamid);
});

$(document).on("click", ".iconhome", function() {

//    var parentpage = $(this).attr("data-parentpage") + ".htm";
    var parentpage = CPage.prevpage;
console.log(CPage);
    if(parentpage == PAGE_INDEX) {
        if($(this).hasClass("home-page")) {
            localStorage.setItem("loadsource",'livebackbutton');
        }
        window.location.href = PAGE_INDEX;
    }
    else if(CPage.page == PAGE_PLAYER) {
        if(CPage.param != 'from_unsaved') {
            checkPlayerSelectData('end');
        }
        else {
            CPage.params = null;
            $("body").pagecontainer("change", parentpage, {reload: true});
        }
//        };
    }
    else {
        if(CPage.page == PAGE_RESULTS && CPage.prevpage == PAGE_HOME && CPage.param == "readOnly") {
            populateHomePage("token", myJWT.remoteid);
        }
        else {
            $("body").pagecontainer("change", parentpage, {reload: true});
        }
    }
});

$(document).on("click", ".ui-icon-refresh, .iconrefresh", function() {
    reloadSite();
});

$(document).on("click", ".ui-icon-bars", function() {

});

$(document).on('click', '.matchrow.elapse', function() {

});

$(document).on('click', '.menuitemteamsel', function() {
    if(!$(this).hasClass('disabled')) {
        var pwdtype = $(this).find('div.compset').data('passwordtype');
        console.log('team click');
        if(pwdtype === "1") {
            alert("Enter your Team PIN above to log in");
            return false;
        }
        else {
//            var compid = $(this).closest('div.activematchset').attr('data-compid');
            var teamid = $(this).attr("data-teamid");
            $("#activematchset").hide();
            initLandingPage("team", teamid);
        }
    }
});

$(document).on('click', '.menuitem', function() {

    console.log('menuitem.click - option=' + $(this).attr("data-option"));

    /*
     *      twa options:
     *          2 = Player Select
     *          3 = Lock Players
     *          4 = Enter Results
     *          5 = Finalise
     *
     *      twla options
     *          12 = Player Select
     *          13 = Lock Players
     *          14 = View Results
     *          15 = Finalise
     */

    var pages = {
//        1: "playerlist.html",
        2: PAGE_PLAYER,
        3: "locklegend",
        4: PAGE_RESULTS,
        5: PAGE_FINAL,
        6: "logoff"
    };

    var item = parseInt($(this).attr("data-option"));

    var team = Teams.my;
    CURR_TOKEN = LSTR_JWTTOKEN;
    CPage.param = 'edit';

    // logged in team has access
    if(item > 10) {
        item = item - 10;
        CPage.param = 'view';
        // if this is the TWA team accessing the Finalise option from the TWLA team block
        if(Teams.myistwa) {
            team = Teams.other;
            CURR_TOKEN = LSTR_JWTTOKENOTHER;
        }
    }

    CURR_TEAM = team.teamcode;

    console.log('CURR_TEAM: ' + CURR_TEAM);

    var authcheck = Teams.myistwa && CURR_TEAM === Teams.twla.teamcode && Data.config.appmethod === "1" && '23'.indexOf(item) > -1;

    // code that needs to be called either immediately or after an ajax call has been run
    var loadauthpages = function()
    {
        console.log('loadauthpages()');

        var pagetoload = pages[item];

        var authreqd = false;

        if(item === 6) {        // LOG OFF: no auth required
            Settings.clear();
            logoff(Data.remote.id, function() { window.location = getRootURL(); });
        }
        else if(item === 3)      // no actual page to load, just a dialog
        {
            if(Teams.myistwa) {
                if(CURR_TEAM === Teams.twla.teamcode) {
                    if(Data.config.appmethod !== "1") {
                        authreqd = true;
                    }
                }
            }

            if(authreqd === false) {
                CURR_TOKEN = LSTR_JWTTOKEN;
            }

            lockPlayersDialog(team);

        }
        else {

            var ok = true;

            if(item === 4 && Teams.enterResultsOK() === false) {
                ok = false;
            }

            if(ok) {

                console.log('loading ' + pagetoload);

                // prompt for login if settings dictate
                authreqd = false;

                if(Teams.myistwa) {

                    if(CURR_TEAM === Teams.twla.teamcode)
                    {
                        if(Data.config.appmethod !== "1")
                        {
                            authreqd = true;
                        }
                        else {
                            if(item === 5)
                            {
                                authreqd = true;
                            }
                        }
                    }
                }

                if(authreqd)
                {
                    if(othJWT.status == 1 && CURR_TOKEN === LSTR_JWTTOKENOTHER) {
                        console.log('othJWT token found');
//                        $.mobile.changePage(pagetoload);
                        $("body").pagecontainer("change", pagetoload, {reload: true});
                    }
                    else {
                        console.log('no valid token, TWLA user to log in');
                        otherteampwddialog('.menuitem_click',
                            function(data) {

                                console.log("menuitem_click_success");
                                console.log(data);

//                                $.mobile.changePage(pagetoload);
                                $("body").pagecontainer("change", pagetoload, {reload: true});
                            },
                            function(err) {
                                console.log("menuitem_click_error");
                                console.log(err);

                            }
                        );
                    }
                }
                else {

                    CURR_TOKEN = LSTR_JWTTOKEN;

                    $("body").pagecontainer("change", pagetoload, {reload: true});
                }
            }
            else {
                console.log('cannot load ' + pagetoload + ' not ready for access yet');
            }
        }
    }

    if(authcheck) {

        CURR_TOKEN = LSTR_JWTTOKEN;

        checkAwayControl(pages[item],
            function(data) {
                loadauthpages();
            },
            function(errdata) {
                console.log("ERROR");
                CURR_TOKEN = LSTR_JWTTOKEN;
                displayErrMsg("Not Authorised", errdata, function() { populateHomePage("token", myJWT.remoteid); });
                return false;
            }
        );
    }
    else {
        loadauthpages();
    }

});

function checkAwayControl(pagetoload, response_success, response_error)
{
    var teamistwla = 0;

    // twa will always have hasaccess = 1
    if(Teams.my.data.hasaccess == "1") {
        if(Teams.my.teamid != CURR_TEAM) {
            teamistwla = 1;
        }
    }

    if(teamistwla == 1) {

        var remoteid = Teams.my.teamid == CURR_TEAM ? Teams.my.data.id : Teams.other.data.id;

        var data = {
            action: 'checkawaycontrol',
            remoteid: remoteid,
            teamistwla: teamistwla
        };

        $.ajax({
            url: apiURL + 'checkawaycontrol',
            data: data,
            success: function(retdata) {
                response_success(retdata);
                console.log('SUCCESS');
//                if(pagetoload.indexOf('.html') > -1) {
////                    $.mobile.changePage(pagetoload);
//                    $("body").pagecontainer("change", pagetoload, {reload: true});
//                }
            },
            error: function(errdata) {
                console.log('ERROR');
                response_error(errdata);
            }
        });
    }
}

//$(document).on("click", "#submitpin", function(e)
//{
//    loadershow();
//
//    var pin = $.trim($("#pin").val());
//
//    if($("#getPin").find(".tapgo").length > 0) {
//        $("#getPin").find(".tapgo").remove();
//    }
//
//    if(pin.length != 6) {
//        if(pin.length != 8) {
//            e.preventDefault();
//            myAlert("error", "Pin Error", "PIN must be 6 or 8 digits");
//            loaderhide();
//            return false;
//        }
//    }
//
//    // if 6 digits, all characters must be numeric
//    if(pin.length == 6 && !/^[0-9]+$/.test(pin)) {
//        e.preventDefault();
//        myAlert("error", "Pin Error", "PIN must only be numbers");
//        loaderhide();
//        return false;
//    }
//
//    if(pin.length == 6) {
//        populateHomePage("pin", pin);
//    }
//    else {
//        populateHomePage("teampin", pin);
//    }
//    return false;
//});

$(document).on("click", "#submitpassword", function()
{
    loadershow();

    var password = $.trim($("#password").val());

    populateHomePage("password", password);

    loaderhide();

    return false;

});

$(document).on("click", "#otherteamfinalise", function()
{
    otherteampwddialog("#otherteamfinalise",
        function(data) {

            console.log('#otherteamfinalise_success');
            console.log(data);

//            console.log("otherteamfinalise-show");
            $("#finaliseother").show();
        },
        function(err) {
            console.log('#otherteamfinalise_success');
            console.log(err);
        });
});


$(document).on("click", ".mytext.resultopt", function()
{
    myAlert("info","Results Disabled","Results cannot be selected until you <br /><b>LOCK SUBS</b> first");
});

var refreshTimer = 0;
var refreshsecs = 30;

$(document).on("click", "#resultsheader", function() {
//    console.log(CPage);
//    if(CPage.ltype != LOGIN_VIEWONLY) {
        if($("#resultsheader").hasClass('refreshwait')) {
            showNoty('<p style="text-align:center">Refresh available in ' + refreshsecs + ' secs</p>', "warning", 'topCenter', 2000);
        }
        else {
            //$("#resultsheader").addClass('refreshwait');  - is default class when page reloads
            console.log("scoreboard: refresh");
            refreshsecs = 30;
            refreshTimer = setInterval(resetRefresh, 1000);
            refreshPage();
        }
//    }
});

function resetRefresh() {
    refreshsecs--;
//    console.log("Can refresh page in " + refreshsecs + " secs");
    if(refreshsecs <= 0) {
        console.log("Refresh Timer Expired");
        $("#resultsheader").removeClass('refreshwait');
        clearInterval(refreshTimer);
        refreshTimer = 0;
    }
}

$(document).on("click", "#finalisenow", function() {

    console.log("finalisenow clicked");
    var title = $("#finalisenow").text();

    if($("#finalisenow").hasClass('twla')) {
        CURR_TEAM = Teams.twla.teamcode;
    }
    else {
        CURR_TEAM = Teams.twa.teamcode;
    }
    console.log(title);
    if(title.indexOf("FINALISE") > -1) {
        // prompt with msgbox, on ok go to finalise page
        var buttonText = {ok: 'OK', yes: 'Yes', cancel: 'Cancel'};
        myConfirm("Ready to Finalise", "If you are ready to Finalise, click <b>Yes</b> to Continue",
            buttonText,
            function(answer) {
                if(answer) {
//                    $.mobile.changePage("finalisematch.html");
                    $("body").pagecontainer("change", PAGE_FINAL, {reload: true});
                }
            }
        );
    }
});

$(document).on("click", "#submitadminpassword", function()
{
    loadershow();

    var adminpassword = $.trim($("#adminpassword").val());
    var comp = $("#curradmin").attr("data-admin");

    populateAdminPage(comp, adminpassword);

    return false;

});

// SELECT-PLAYER PAGE - SAVE SELECTIONS V2
$(document).on("click", "#ps_save", function()
{
    console.log('savePlayerSelection(BTN_SAVELEGEND)');

    savePlayerSelection(BTN_SAVELEGEND);
});

// SELECT-PLAYER PAGE - CLEAR SELECTIONS V2
$(document).on("click", "#ps_clear", function()
{
    var teamcode = $("#psteamname").attr("data-side");
    var hora = teamcode[0];

    // set row properties
    $(".row.pselect").attr("data-pos", "-1");
    $(".row.pselect").attr("data-code", "-");
    $(".row.pselect").attr("data-legendcode", "null");

    // set code column value
    $(".row.pselect").find(".code").text("-");

    // clear "selected" classes from row
    $(".row.pselect").removeClass("playerselected start sub");

    // clear "selected" classes from scoresheet preview
    $(".viewrow").removeClass("playerselected start sub");

    // clear scoresheet preview player name values
    $("td.legend.player").text("");
    $("td.stats.player").text("");

    // clear subs list (above scoresheet)
    $("#viewhassubs").addClass("hidden");
    $("#viewnosubs").removeClass("hidden");

    // clear Player ID from Legend, LegendCodes Objects
    $.each(Legend[teamcode], function(pos, ldata) {
        Legend[teamcode][pos].playerid = 0;     // this will clear LegendCodes object property too
    });

    initGBCodes();
    POS_COUNT = 0;
});

// SELECT-PLAYER PAGE - ADD PLAYER V2
$(document).on("click", "#ps_addplayer", function() {
    var teamid = $("#psteamname").attr("data-side");
    addplayerdialog('Player', teamid, 0);
    // myAddPlayerDialog
    //  createPlayer
});

// SELECT-PLAYER PAGE - ADD FORFEIT V2
$(document).on("click", "#ps_addforfeit", function()
{
    var teamcode = $("#psteamname").attr("data-side");
    var hora = teamcode[0];
    var obj = this;

    var pin = $("#psteamname").attr("data-pin");

    var teamistwla = 0;
    // twa will always have hasaccess = 1
    if(Teams.my.data.hasaccess == "1") {
        if(Teams.my.teamcode != teamcode) {
            teamistwla = 1;
        }
    }

    var newid = 999991;
    if(teamcode == Teams.A.teamcode) {
        newid = 999992;
    }

    $.ajax({
        url: apiURL + "upgradeforfeit",
        data: {
            action: 'upgradeforfeit',
            pin: pin,
            playerid: newid,
            drawid: Data.draw.id,
            teamistwla: teamistwla
        },
        success: function(data) {
            console.log(data);
            var np = Players[hora][newid];
            np.type = data[newid].type;
            var html = selPlayerBlock("", np, Teams[hora].data.livescoredata);
            $("#playerselect-div").append(html);
            $(obj).addClass('ui-disabled');
        },
        error: function(errdata) {
            console.log(errdata);
            displayErrMsg("Not Authorised", errdata, function() { populateHomePage("token", myJWT.remoteid); });
        }
    });
});

function updatePlayer(teamid, pin, playerid, pname, prank, ptype)
{
    var teamcode = $("#psteamname").attr("data-side");
    var hora = teamcode[0];

    var pin = $("#psteamname").attr("data-pin");

    var teamistwla = 0;
    // twa will always have hasaccess = 1
    if(Teams.my.data.hasaccess == "1") {
        if(Teams.my.teamcode != teamcode) {
            teamistwla = 1;
        }
    }

    var nameok = true;
    var oldpname = null;
    $.each(Players[hora], function(id, obj) {
        if(id != playerid) {
            if(obj.fullname == pname) {
                myAlert("error", "Create Error", 'Players Name "' + pname + '" already exists for another player');
                nameok = false;
                return false;
            }
        }
        else {
            oldpname = obj.fullname;
        }
    });

    if(nameok) {
        $.ajax({
            url: apiURL + "updateplayer",
            type: "POST",
            dataType: "json",
            data: {
                action: 'updatePlayer',
                pin: pin,
                playerid: playerid,
                hora: hora,
//                oldfullname: oldpname,
                fullname: pname,
                rank: prank[0],
                rankistemp: prank[1],
                ptype: ptype,
                teamistwla: teamistwla,
                drawid: Data.draw.id
            },
            success: function(retdata) {

                console.log(retdata);

                var data = retdata[playerid];

                var np = Players[hora][playerid];

                np.updateFormats({fullname: data.fullname});

                np.rank = data.rank;

                Players[hora][playerid] = np;

                if(Teams.myishome) {
                    Data.remote.livescoredata = retdata.lsdata;
                }
                else {
                    Data.remoteother.livescoredata = retdata.lsdata;
                }

                if(Teams.my.teamcode == data.teamcode) {
                    Teams.my.players[playerid] = np;
                }
                else if(Teams.other.teamcode == data.teamcode) {
                    Teams.other.players[playerid] = np;
                }

                if(np.new == 0 && np.fullname !== np.origfullname) {
                    $("#player_" + playerid).find(".pname").text(np.fullname + ' *');
                    $("#player_" + playerid).find(".undoplayer").removeClass('hidden');
                }
                else {
                    $("#player_" + playerid).find(".pname").text(np.fullname);
                    $("#player_" + playerid).find(".undoplayer").addClass('hidden');
                }

                $("#player_" + playerid).find(".rank").text(np.rank);

                $("#dlgFullName").val("");
                $("#dlgRank").val("");

                $(".addplayer.btncancel").trigger("click");
            },
            error: function(error) {
                console.log(error);
                myAlert("error", "Create Error", error.responseText);
            },
        });
    }
}

function createPlayer(teamid, pin, pname, prank, ptype, createPlayer_success, createPlayer_fail)
{
    var teamcode = $("#psteamname").attr("data-side");
    var hora = teamcode[0];

    var pin = $("#psteamname").attr("data-pin");

    var teamistwla = 0;
    // twa will always have hasaccess = 1
    if(Teams.my.data.hasaccess == "1") {
        if(Teams.my.teamcode != teamcode) {
            teamistwla = 1;
        }
    }

    var newid = getNewPlayerSeed(teamcode);

console.log(newid);

    var nameok = true;
    $.each(Players[hora], function(id, obj) {
        if(obj.fullname == pname) {
            myAlert("error", "Create Error", 'Players Name "' + pname + '" already exists for another player');
            newid = 0;
            nameok = false;
            return false;
        }
    });

    if(nameok) {
        while (isset(Players[hora][newid])) {
            if(Players[hora][newid].fullname == pname) {
                newid = 0;
                break;
            }
            newid++;
        }
    }

    if(newid === 0) {
        myAlert("error", "Player Exists", "This player already exists");
    }
    else {
        $.ajax({
            url: apiURL + "createplayer",
            type: "POST",
            dataType: "json",
            data: {
                action: 'createPlayer',
                pin: pin,
                playerid: newid,
                hora: hora,
                fullname: pname,
                rank: prank[0],
                rankistemp: prank[1],
                ptype: ptype,
                teamistwla: teamistwla,
                drawid: Data.draw.id
            },
            success: function(retdata) {

                console.log(retdata);
                var data = retdata[newid];
//                var now = $.now();

                var np = new Player({fullname: data.fullname});

                np.id = data.id;
                np.teamid = data.teamid;

                np.rank = data.rank;
                np.type = data.type;

                np.code = '?';

                Players[hora][data.id] = np;

                if(Teams.my.teamcode == teamcode) {
                    Teams.my.players[data.id] = np;
                }
                else if(Teams.other.teamcode == teamcode) {
                    Teams.other.players[data.id] = np;
                }

                Teams[hora].data.livescoredata = retdata;

                // create sel player block and display * if its edited
                var html = selPlayerBlock("", np, Teams[hora].data.livescoredata);

                $('#playerselect-div').append(html);

                $("#dlgFullName").val("");
                $("#dlgRank").val("");

                $(".addplayer.btncancel").trigger("click");
            },
            error: function(error) {
                console.log(error);
                myAlert("error", "Create Error", error.responseText);
            },
        });
    }
}

$(document).on("click", ".undoplayer", function() {

    var teamcode = $("#psteamname").attr("data-side");
    var hora = teamcode[0];

    var obj = $(this).closest('div.pselect');
    var pid = parseInt($(obj).attr("data-id"));
    var player = Players[hora][pid];
    var hasrank = Data.config.hasrankings == '1';
    var msg = "<p>Do you wish to undo all changes made to this player?</p><p>The player info will be reset to:</p>" +
            "<ul><li><b>Player Name: </b>" + player.origfullname + "</li>" + (hasrank ? "<li><b>Rank: </b>" + player.origrank + "</li>" : "");
    var buttonText = {ok: 'OK', yes: 'Yes', cancel: 'No'};
    myConfirm("Undo Player changes", msg,
        buttonText,
        function(confirm) {
            if(confirm) {
                $.ajax({
                    url: apiURL + 'undoplayer',
                    data: {
                        action: 'undoplayer',
                        pin: Teams[hora].data.remotepin,
                        playerid: pid,
                    },
                    success: function(data) {
                        console.log(data)
                // update database (remove edit record from livescoredata
                // update fullname, firstname and lastname
                // remove undo icon
                // update name in list
                        $("#player_" + pid).find(".undoplayer").addClass('hidden');
                        $("#player_" + pid).find(".pname").text(player.origfullname);
                        $("#player_" + pid).find(".prank").text(player.origrank);
                    },
                    error:function(errdata) {
                        console.log('ERROR');
                        displayErrMsg('Error', errdata);    //  }
                    }
                });
            }
        }
    );
});

// Click EDIT icon for player, loads Edit Dialog
$(document).on("click", ".editplayer", function() {

    var row = $(this).closest('div.pselect');

    var teamcode = $("#psteamname").attr("data-side");
    var index = $(row).attr("data-id");

console.log(teamcode);
console.log(index);

    addplayerdialog('Player', teamcode, index);

});

$(document).on("click", ".deleteplayer", function(e)
{
    console.log('deleteplayer');

    var teamcode = $("#psteamname").attr("data-side");
    var hora = teamcode[0];

    var plyr = $(this).closest('div.pselect');
    var index = $(plyr).attr("data-id");
    var pname = $(plyr).find(".pname").text();

    var teamistwla = 0;
    // twa will always have hasaccess = 1
    if(Teams.my.data.hasaccess == "1") {
        if(Teams.my.teamcode != teamcode) {
            teamistwla = 1;
        }
    }
    console.log('player del ' + index);

    if(isset(Players[hora][index])) {
        if(Players[hora][index].pos > -1) {
            myAlert('error', 'Delete Error', '<p>Cannot Delete</p><p>' + pname + ' is selected</p>');
        }
        else {
            var delfunc = 'deleteplayer';
            if(RESTYPE_FORFEIT.indexOf(parseInt(index)) > -1) {
                // player is FORFEIT
                delfunc = 'downgradeforfeit';
            }
            var buttonText = {ok: 'OK', yes: 'Yes', cancel: 'Cancel'};
            myConfirm("Confirm Delete", "<p>Do you wish to delete '" + pname + "'?</p>", buttonText, function(answer) {
                if(answer) {
                    $.ajax({
                        url: apiURL + delfunc,
                        data: {
                            action: '.' + delfunc + '.click',
                            pin: Teams[hora].data.remotepin,
                            hora: hora,
                            playerid: index,
                            drawid: Data.draw.id,           // needed for downgradeforfeit
                            teamistwla: teamistwla          // needed for downgradeforfeit
                        },
                        success: function(data) {
                            console.log(data)
                            $("#player_" + index).remove();
                            if(delfunc == 'deleteplayer') {
                                delete Players[hora][index];
                                delete Teams[hora].players[index];
                                delete Data.players[hora][index];
                            }
                            else {
                                Players[hora][index].type = 3;
                                Teams[hora].players[index].type = 3;
                                Data.players[hora][index].type = 3;
                                $("#ps_addforfeit").removeClass("ui-disabled");
                            }
                        },
                        error:function(errdata) {
                            console.log('ERROR');
                            displayErrMsg('Error', errdata);    //  }
                        }
                    });
                }
            });
        }
    }
    else {
        myAlert('error', 'Delete Error', '<p>Player cannot be found</p>');
    }

});

$(document).on("click", ".playerselect", function()
{
    var teamcode = $("#psteamname").attr("data-side");
    var hora = teamcode[0];

    var row = $(this).closest('div.row.pselect');
    var pid = $(row).attr("data-id");
    var code = $(row).find(".codeval");     // the position column for the selected player
//    var row = $(code).closest(".row");   // row div for selected player
//    var pid = parseInt($(code).closest('div.row.pselect').attr("data-id"));

    console.log(pid, code);

    // get the count for how many players are currently selected
    POS_COUNT = $(".pselect.playerselected").length;

    $.each($(".playerselect.code"), function(k,o) {
        var lcode = $(this).parent().attr("data-legendcode");
        var sid = $(this).parent().attr("data-id");
        var scode = $(this).text();
        pageOpenData = ( typeof pageOpenData == "string" ? {} : pageOpenData )
        pageOpenData[lcode] = {"id": sid, "code": scode, "checked": 0};
    });

    var lastcode = '?';
    if(POS_COUNT > 0) {
        lastcode = Legend[teamcode][POS_COUNT - 1].code;
    }

    let currCount = POS_COUNT;

    let lc = Legend[teamcode][POS_COUNT];

    // add a player
    if(!$(row).hasClass("playerselected"))
    {
        if(isset(lc)) {

            console.log('Add Player at position ' + currCount);

            updateLegendPlayer(row, teamcode, pid, POS_COUNT, lc.code, lc.gbcode)

        }
    }
    else if($(code).text() == lastcode)               // remove a player
    {
        currCount = POS_COUNT - 1;

        console.log('Remove Player at position ' + currCount );

        lc = Legend[teamcode][currCount];

        updateLegendPlayer(row, teamcode, pid, currCount, lc.code, 'null');
    }

    calcSelectedPoints(teamcode);
});

function updateLegendPlayer(row, teamcode, pid, pos, code, legendcode)
{
    console.log('updateLegendPlayer ' + code + ' ' + legendcode);
    var hora = teamcode[0];

    var remove = legendcode === 'null';

    $(row).removeClass("playerselected sub start");
    if(!remove) {
        $(row).addClass("playerselected");
        if(pos >= Teams.minplayers) {
            $(row).addClass("sub");
        }
        else {
            $(row).addClass("start");
        }
    }

    // update the row element attributes
    $(row).attr("data-legendcode", remove ? 'null' : legendcode);      // AA100
    $(row).attr("data-code", remove ? '-' : code);
    $(row).attr("data-pos", remove ? -1 : pos);

    $("#player_" + pid).find(".codeval").text(remove ? '-' : getShowCode(teamcode, code, 1));

    if(remove)
    {
        console.log('DE-SELECTING');

        Legend[teamcode][POS_COUNT-1].playerid = "0";

        var emptytext = "";

        if(POS_COUNT - 1 >= Teams.minplayers) {
            $(".subs.player_" + code).parent().addClass("hidden");
            $(".subs.player_" + code).text("");
            emptytext = "SUB?";
        }

        if(POS_COUNT - 1 == Teams.minplayers) {
            $("#viewnosubs").removeClass("hidden");        // show has subs info
            $("#viewhassubs").addClass("hidden");            // hide no subs message
        }

        $(".legend.player_" + code).text(emptytext);
        $(".legend.player_" + code).parent().removeClass("playerselected sub start");
        $(".stats.player_" + code).text("");
        $(".stats.player_" + code).parent().removeClass("playerselected sub start");

    }
    else {

        console.log('SELECTING');

        Legend[teamcode][POS_COUNT].playerid = pid;

        $(".legend.player_" + code).text(Players[hora][pid].fshortname);

        if(pos >= Teams.minplayers) {
            var scode = code;
            $("#viewhassubs").removeClass("hidden");        // show has subs info
            $("#viewnosubs").addClass("hidden");            // hide no subs message
            $(".subs.player_" + scode).text(Players[hora][pid].fshortname);
            $(".subs.player_" + scode).parent().removeClass("hidden");
            $(".legend.player_" + code).parent().addClass("playerselected sub");
        }
        else {
            $(".legend.player_" + code).parent().addClass("playerselected start");
        }
        $(".stats.player_" + code).text(Players[hora][pid].fshortname);
        $(".stats.player_" + code).parent().addClass("playerselected start");
    }
}

$(document).on("click", ".lockcheck", function() {

    var obj = this;
    var status = $(obj).closest('tr').find(".status");

    if($(obj).is(":checked")) {
        $(status).text("CONFIRMED").css("color","rgb(100,150,100)").css("font-weight", "bold");
    }
    else {
        $(status).text("not confirmed").css("color","rgb(255,0,0)").css("font-weight", "");
    }

    var checks = 0;
    $.each($(".lockcheck"), function(k,o) {
        checks = checks + ($(o).is(":checked") ? 1 : 0);
    });

    if(checks > 1) {
        $(".btnlockyes").removeClass("ui-disabled");
    }
    else {
        $(".btnlockyes").addClass("ui-disabled");
    }
});

$(document).on("click", ".playerppsel", function() {

//     console.log('.playerppsel click');

//     console.log($(this));

//     var id = $(this).attr("data-id");       // database unique id for player
//     var teamid = $(this).closest('ul.playerlistview').attr("data-teamid");       // team id
//     var player = $(this).text();
//     if(id == "0") {
//         player = "Select Player..."
//     }
//     console.log("#player_PP_" + teamid);
//     $("#player_PP_" + teamid).attr("data-id", id).text(player);
// //    $("#player_PP" + teamid).text(player);
//     var popup = $(this).closest('div.playerpopup');
//     $(popup).popup("close");
    console.log('.playerppsel click');

    console.log($(this));

    var points = $(this).attr("data-points");
    var id = $(this).attr("data-id");       // database unique id for player
    var teamid = $(this).closest('ul.playerlistview').attr("data-teamid");       // team id
    var pid = "#player_PP_" + teamid + '_' + points;
    var player = $(this).text();
    if(id == "0") {
        player = "Select Player..."
    }
    console.log(pid);
    $(pid).attr("data-id", id).text(player);
//    $("#player_PP" + teamid).text(player);
    var popup = $(this).closest('div.playerpopup');
    $(popup).popup("close");
});

/***********************
 *
 * RESULT AND PLAYER SELECTION
 *
 */
//$(document).on("click", ".resultsel", function()
//{
//    var result = $(this).attr("data-result");
//    var popup = $(this).closest('div.resultpopup');
//    var code = $(popup).attr("data-code");
//
//    console.log(result + ' - ' + $(popup).attr("id") + ' - ' + code);
//
//    var rescode = "WL".indexOf(result) === -1 ? "M" + result : result;
////    var savebtn = $("#navbar_" + code).find(".navsave");
////    var undobtn = $("#navbar_" + code).find(".navrefresh");
//
//    var mblock = $("#result_" + code).closest('div.matchblock');
//
//    var savebtn = $(mblock).find(".navsave");
//    var undobtn = $(mblock).find(".navrefresh");
////    var hora = code.substring(0,1) == "H" ? "away" : "home";
////    var othcode = $("#result_" + code).closest('div.matchblock').find(".row." + hora).attr("data-gbcode");
//
//    $("#result_" + code).attr("data-result", result).addClass("updated").text(rescode);
//
////    $("#result_" + code).text(rescode);
////    $("#result_" + code).addClass("updated");
//    $(savebtn).removeClass("ui-disabled").text("SAVE RESULT");  //.attr("data-gbcode", code);
//    $(undobtn).addClass("clr-btn-red ui-btn ui-btn-inline navundoselect");
//    $(undobtn).removeClass("navrefresh").text("CANCEL RESULT"); //.attr("data-gbcode", code);
//
//    if(Data.config.appmethod == METHOD_SOLO_AUTH) {
//        // grey out other options
//        $(mblock).find(".playeropt").attr("data-rel", "").css("color", "rgb(180,180,180)");
//        $(mblock).find(".resultopt").not(".updated").attr("data-rel", "").css("color", "rgb(180,180,180)");
////        $("#player_" + othcode).attr("data-rel", "");
////        $("#player_" + othcode).css("color", "rgb(180,180,180)");
////        $("#result_" + othcode).attr("data-rel", "");
////        $("#result_" + othcode).css("color", "rgb(180,180,180)");
//    }
//    else {
//        $("#player_" + code).attr("data-rel", "");
//        $("#player_" + code).css("color", "rgb(180,180,180)");
//    }
//    $(popup).popup("close");
//});

$(document).on('contextmenu', ".activematchset", function() {
    return false;
});

$(document).on("click", ".lslogin", function() {

    if($(this).hasClass('login')) {
        teampindialog(
            function(data) {

                console.log('.teampinlogin_success');
                console.log(data);

                showNoAccessOptions();
            },
            function(err) { console.log('.teampinlogin_error'); console.log(err); }
        );
    }
    else {
        localStorage.removeItem("loadsource");

        populateHomePage("token", myJWT.remoteid);
    }


});

function setAutoApproveText() {
    // if this user is the authorised editor
    var locks = getLocks();
    console.log(locks);
    $("#lockoverride").text(locks.locktext);
}

function getLocks()
{
    var currlocks = Data.remote.releaselocks;
    if(Teams.myistwa) {     // Data.remote.hasaccess == "1"
        currlocks = Data.remoteother.releaselocks;
    }
    var total = (currlocks == 1 || currlocks == 3 ? 1 : 0) + (currlocks > 1 ? 1 : 0);
    return {
        'legend': (currlocks == 1 || currlocks == 3 ? 'checked' : ''),
        'gameblock': currlocks > 1 ? 'checked' : '',
        'total': total,
        'locktext': 'Set Auto-Approve (' + total + ')'
    }
}

$(document).on("click", ".locklabel", function()
{
    var id = "#" + $(this).attr("data-id");
    var checked = !$(id).prop("checked");
    $(id).prop("checked", checked);
});

function showNoAccessOptions() {
    $(".noaccesslogin").css("color","red");
    $(".noaccesslogin").attr("data-status", "1").text("LOG OUT");

    $(".noaccessteam.restricted").removeClass("hidden");
    $(".noaccessteam.menuli").removeClass("hidden");
    $(".noaccessteam.menuli.o14").addClass("hidden");   // dont show "view results" when displaying in myteam device
}

$(document).on("click", ".noaccesslogin", function() {
    if($(this).attr("data-status")=="0") {

        otherteampwddialog('.noaccesslogin',
            function(data) {

                console.log('.noaccesslogin_success');
                console.log(data);

                showNoAccessOptions();
            },
            function(err) { console.log('.noaccesslogin_error'); console.log(err); }
        );
    }
    else if($(this).attr("data-status")=="1") {
        console.log("log off");
        $(this).css("color","rgb(0,150,0)");
        $(this).attr("data-status", "0").text("LOG IN");
        $("#playerlist_noaccess").parent().hide();
        $("#playerselect_noaccess").parent().hide();
        // remove token
        localStorage.removeItem(LSTR_JWTTOKENOTHER);
    }
});

$(document).on("click", "#lockoverride", function() {
    $("#settingmenuhome").popup('close');
    if(Teams.myistwa) {         // Data.remote.hasaccess == "1"
        otherteampwddialog("#lockoverride_click",
            function(data) { console.log('.lockoverride_success'); console.log(data); setAutoApprove(); },
            function(err) { console.log('.lockoverride_error'); console.log(err); }
        );
    }
    else {
        setAutoApprove();
    }
});

function setAutoApprove()
{
    var lockteam = Teams.my.teamname;
    var recid = Data.remote.id;
    if(Teams.myistwa) {             // Data.remote.hasaccess == "1"
        lockteam = Teams.other.teamname;
        recid = Data.remoteother.id;
    }
    // legend = 1
    // gameblock = 2;
    var locks = getLocks();

    var msg = '<p>Select the locks you wish to auto-approve for <b>' + lockteam + '</b>.</p>' +
        '<p>They will no longer need to enter their password each time locking is required.</p>' +
       '<p> <input type="checkbox" id="OverrideLegend" value="0" ' + locks.legend + '><span class="locklabel" data-id="OverrideLegend"> Legend<span></p>' +
       '<p> <input type="checkbox" id="OverrideGameBlocks" value="0" ' + locks.gameblock + '><span class="locklabel" data-id="OverrideGameBlocks"> Game Blocks</p>';

    var buttonText = {ok: 'OK', yes: 'Yes', cancel: 'Cancel'};

    var answer = function(ans) {
        if(ans) {
            var actions = '';
            var lockval = 0;
            if($("#OverrideLegend").is(':checked')) {
                actions += ("<li>Legend</li>");
                lockval += 1;
            }
            if($("#OverrideGameBlocks").is(':checked')) {
                actions += ("<li>Game Blocks</li>");
                lockval += 2;
            }
            var ormsg = "<p>You have opted auto-approve:</p><ul><li>none</li></ul><p>Do you wish to continue?</p>";
            if(actions != "") {
                ormsg = "<p>You have opted auto-approve:</p><ul>" + actions + "</ul><p>Do you wish to continue?</p>";
            }
            var oranswer = function(ans) {
                if(ans) {
                    // write change to database
                    var lockdata = {
                        action: 'setAutoApprove',
                        recid: recid,
                        lockval: lockval,
                    };
                    console.log(lockdata);
                    $.ajax({
                        url: apiURL + 'setreleaselock',
                        data: lockdata,
                        success: function(data) {
                            if(Teams.my.teamid == data.teamid) {
                                Data.remoteother.releaselocks = 0;
                                Data.remote.releaselocks = data.lockval;
                            }
                            else {
                                Data.remote.releaselocks = 0;
                                Data.remoteother.releaselocks = data.lockval;
                            }
                            setAutoApproveText();
                        },
                        error:function(errdata) {
                            console.log('ERROR');
                            displayErrMsg('Error', errdata);    //  }
                        }
                    });
                }
            }
            myConfirm('Auto-Approve Confirm', ormsg, buttonText, oranswer);
        }
//        console.log("the answer " + action + " is " + ans);
    }

    myConfirm('Set Auto-Approve', msg, buttonText, answer);
}

function closePanelMenu(obj) {
    var panel = $(obj).closest("div.panelmenu");
    $(panel).panel("close");
}

/*********************************
 *
 * PANEL MENU FUNCTIONS
 *
 * STATUS:  ALL MENUS
 * RELOAD:  ALL MENUS
 * LOG OFF: ALL MENUS
 */

/* PANEL MENUS: HOME */
$(document).on("click", "#forfeitmatch", function() {

    closePanelMenu(this);

    console.log("#forfeitmatch");

    var prompt = "<p>Do you wish for <b>" + Teams.myteamname + "</b> to Forfeit this Match?</p>" +
        '<textarea rows="3" id="forfeitreason" style="width:97%" placeholder="Reason for Forfeit (required)" />' +
        '<div id="forfeitsubmitmsg" class="submitresult" data-result="null"></div>';
    var answer = function(ans) {
        if(ans) {
            if($.trim($("#forfeitreason")).length == 0) {
                $("#forfeitsubmitmsg").text("You must enter a Reason").css("color","red");
                return false;
            }
            if(Teams.myistwa == 1) {
                switchAccess(Data.draw.id,
                    function(result) {
                        // send emails to admin, other team and this team
                        // if this team has access, switch access to the other team
                        // log off user
                        console.log(result);
                        reloadSite();
                    }
                );
            }
        }
    }
    var buttonText = {ok: 'OK', yes: 'Yes', cancel: 'Cancel'};
    myConfirm("Forfeit Match", prompt, buttonText, answer);
});

$(document).on("click", "#switchbreaks", function()
{
    closePanelMenu(this);

    console.log("#switchbreaks");

    var prompt = "<p>You are about to Switch Breaks</p><p>Continue?</p>";

    var answer = function(ans) {
        if(ans) {
            switchBreaks(Data.draw.id,
                function(result) {
                    console.log(result);
                    reloadSite();
                }
            );
        }
    }
    var buttonText = {ok: 'OK', yes: 'Yes', cancel: 'Cancel'};
    myConfirm("Switch Breaks", prompt, buttonText, answer);
});

$(document).on("click", "#setnameformat", function()
{
    closePanelMenu(this);

    console.log("#setNameFormat");

    var prompt = '<p>Select your preference for Player Name format.</p>' +
        '<p>If player is "Adam Jones", display as:</p>' +
        '<p><select class="form-control" style="width:100%;" id="set-name-format">' +
        '<option value="0" selected="selected">A Jones</option>' +
        '<option value="1">Adam J</option>' +
//        '<option value="9">Adam J (Default)</option>' +
        '</select></p>' +
        '<p style="font-size:0.8rem;font-style:italics;">This setting will to all competitions on this device.<p>';

    var answer = function(ans) {
        if(ans) {
            let setts = new MLS('ls-settings');
            setts.setval( 'nameformat', $("#set-name-format").val() );
            refreshPage();
        }
    }
    var buttonText = {ok: 'OK', yes: 'Apply', cancel: 'Cancel'};
    myConfirm("Set Player Name format", prompt, buttonText, answer);
});

/* PANEL MENUS: HOME */
$(document).on('click', "#adminlogin", function() {

    closePanelMenu(this);

    var hscore = parseInt(TeamTotal("H"));
    var ascore = parseInt(TeamTotal("A"));

    if(hscore + ascore > 0) {
        myAlert("error", "Access Denied", "<p>Cannot UNLOCK Teams when scores exist!</p><p>Undo all scores from \"Enter Results\" page and try again</p>");
    }
    else {
        console.log("adminlogin");

        adminpwddialog(function() {
            console.log("adminlogin-success");
        },
        function() {
            console.log("adminlogin-error");
        });
    }

});

// only available from index page.  accepts admin/match pins
$(document).on('click', "#adminloginall", function() {

    closePanelMenu(this);

    console.log("adminlogin-all");

    adminpindialog(function() {
        console.log("adminpinlogin-success");
    },
    function() {
        console.log("adminpinlogin-error");
    });
});

$(document).on("click", "#switchaccess", function() {

    closePanelMenu(this);

    console.log("#switchaccess");

    var prompt = "<p>You are about to Switch Access to:</p><p><b>" + Teams.other.shortname + "</b></p><p>Continue?</p>";

    var answer = function(ans) {
        if(ans) {
            switchAccess(Data.draw.id,
                function(result) {
                    console.log(result);
                    reloadSite();
                }
            );
        }
    }
    var buttonText = {ok: 'OK', yes: 'Yes', cancel: 'Cancel'};
    myConfirm("Confirm Switch", prompt, buttonText, answer);
});

$(document).on("click", "#reloadsite", function() {
    reloadSite();
});

function reloadSite()
{
    console.log("reload");
    window.location = Site.currURL + (Site.currURL == devURL ? DEV_FOLDER : "");
}

$(document).on("click", "#logoff", function() {

    console.log("log-off");

    if(isset(myJWT.remoteid)) {
        if(myJWT.remoteid > 0) {
            Settings.clear();
            logoff(myJWT.remoteid,
            function() {    // complete
                window.location = getRootURL();
            });
        }
    }
});

function getRootURL()
{
    return Site.currURL;
}

function logoff(id, complete)
{
    var data = {
        action: 'logoff',
        id: id
    }

    $.ajax({
        url: apiURL + 'logoff',
        data: data,
        success: function() {},
        error: function() {},
        complete: function() {
    // clean up tokens stored locally
            localStorage.removeItem(LSTR_JWTTOKEN);
            localStorage.removeItem(LSTR_JWTTOKENOTHER);
            localStorage.removeItem('poolstat.activity');
            localStorage.removeItem('poolstat.currpage');
            localStorage.removeItem("loadsource");
            complete();
        }
    });
}
$(document).on("click", "#sitestatus", function() {
    console.log("sitestatus");
    var popup = "#" + $(this).parent().parent().parent().attr("id");
    myAlert('info','Site Status', SS.showStatus());

    $(popup).popup("close");
});

//$(document).on("click", "#setpassword", function() {
//    console.log("setpassword");
//    var popup = "#" + $(this).parent().parent().parent().attr("id");
//    setTeamPassword();
//    $(popup).popup("close");
//});

$(document).on("click", "#refreshresults", function() {
    console.log("menu option: refresh");
    refreshPage();
});

$(document).on("click", ".acceptfinal, .disputefinal", function()
{
//    if(FinLockUpdateTime > 0) {
//        if(getLastUpdateTime() !== FinLockUpdateTime) {
//            displayErrMsg("Access Denied", {'id': 111, 'text': 'Match data changed, wait period reset'}, function() { $.mobile$.mobile.changePage('home.html'); });
//            return false;
//        }
//    }
//

//     var button = $(this).hasClass('acceptfinal') ? 'accept' : 'dispute';
//     var teamcode = $(this).attr("data-teamid");                             // H-20270
//     var hora = teamcode[0];

//     var tasks = "#" + $(this).closest('div.eomtasks').attr("id");
//     var playfld = "#player_PP_" + teamcode;                                 // player_PP_H-20270
//     var pplayer = null;
//     var ppname = null;

//     var pin = Data.remote.remotepin;
//     var otherpin = Data.remoteother.remotepin;
//     var remoteid = Data.remote.id;

//     if(Teams.my.teamcode != teamcode) {
//         pin = Data.remoteother.remotepin;
//         otherpin = Data.remote.remotepin;
//         remoteid = Data.remoteother.id;
//     }

// //console.log('pp-' + playfld)    ;
//     if($(playfld).length > 0) {
// //console.log('pp-2')    ;
//         var reqd = $(playfld).parent().attr("data-required");
//         pplayer = $(playfld).attr("data-id");
// //console.log(pplayer)    ;
//         ppname = udc(Players[hora][pplayer]) ? "Not Selected" : $(playfld).text();
//         if(reqd == "1" && pplayer == "") {
//             myAlert("info", "Select Player Error", "You must select a Players Player");
//             return false;
//         }
//     }

    let button = $(this).hasClass('acceptfinal') ? 'accept' : 'dispute';
    let teamcode = $(this).attr("data-teamid");                             // H-20270
    let hora = teamcode[0] == "H" ? "A" : "H";

    let tasks = "#" + $(this).closest('div.eomtasks').attr("id");
    let playfld = ".player_PP_" + teamcode;                                 // player_PP_H-20270
    let pplayer = null;
    let ppname = null;
    let pvotes = {};
    let pcheck = [];
    let err = false;

    let pin = Data.remote.remotepin;
    let otherpin = Data.remoteother.remotepin;
    let remoteid = Data.remote.id;

    if(Teams.my.teamcode != teamcode) {
        pin = Data.remoteother.remotepin;
        otherpin = Data.remote.remotepin;
        remoteid = Data.remoteother.id;
    }

//console.log('pp-' + playfld)    ;
    if($(playfld).length > 0) 
    {
        $.each($(playfld), function(k,o) {

            var reqd = $(o).parent().attr("data-required");
            var points = $(o).attr("data-points");
            pplayer = $(o).attr("data-id");

            console.log('==============>    pp-' + points, pplayer);

            ppname = udc(Players[hora][pplayer]) ? "Not Selected" : $(o).text();
            if(reqd == "1" && pplayer == "") {
                myAlert("info", "Select Player Error", "You must vote for all Players");
                err = true;
                return false;
            }
            if(pcheck.indexOf(pplayer) > -1) {
                myAlert("info", "Select Player Error", "Player voted for more than once");
                err = true;
                return false;
            }
            pcheck.push(pplayer);
            pvotes[points] = { pp: pplayer, pname: ppname }
        });
        if(err) {
            return false;
        }
    }
    
    var comment = $("#matchcomment_" + teamcode).val();

console.log("teamcode: " + teamcode);
console.log("player: " + ppname);
console.log("comment: " + comment);

    var msg = "<p>To finalise the game, click <b>OK</b></p><p>You will no longer be able to edit this match</p><p>Continue?</p>";
    if(button == 'accept') {
//        if(Data.config.appmethod == METHOD_SOLO_AUTH) {
            msg = "<p>To finalise the game, click <b>OK</b></p><p>You will no longer be able to edit data in this match</p><p>Continue?</p>";
//        }
    }
    else {
        if($.trim(comment) == "") {
            myAlert("info", "Comment Error", "You must enter a comment to explain the reason(s) for your Dispute");
            return false;
        }
        else {
//            if(Data.config.appmethod == METHOD_SOLO_AUTH) {
                msg = "<p>To finalise the game and register your Dispute, click <b>OK</b></p><p>You will no longer be able to edit data in this match</p><p>Continue?</p>";
//            }
//            else {
//                msg = "<p>To finalise the game and register your Dispute, click <b>OK</b></p><p>You will no longer be able to access this match</p><p>Continue?</p>";
//            }
        }
    }

    var buttonText = {ok: 'OK', yes: 'Yes', cancel: 'Cancel'};

    myConfirm("Confirm", msg, buttonText, function(answer) {
        if(answer) {
            var lockupdatetime = FinLockUpdateTime === 0 ? getLastUpdateTime() : FinLockUpdateTime;
            $.ajax({
                url: apiURL + 'finalisematch',
                timeout: 25000,
                data: {
                    action: '.acceptfinal/.disputefinal.click',
                    pin: pin,
                    otherpin: otherpin,
                    remoteid: remoteid,
                    compid: Data.compid,
                    drawid: Data.draw.id,
                    appmethod: Data.config.appmethod,
                    fintime: moment().format(DTFORMAT),
                    finaldata: { pvotes: pvotes, pp: pplayer, ppname: ppname, comment: comment, lockupdatetime: lockupdatetime },
                    button: button
                },
                success: function(data) {
                    console.log(data);
                    Teams.my.data.remotestatusid = "3";
                    if(Teams.my.teamid === Teams.other.teamid) {
                        Teams.other.data.remotestatusid = "3";
                    }
                    $("#player_PP_" + teamcode).attr("href", "#");
                    $(tasks + " textarea").attr("readonly","readonly");
                    $(tasks).find(".acceptfinal").attr("disabled", true);
                    $(tasks).find(".disputefinal").attr("disabled", true);

                    // hide the currentcontent
                    $(".finalise-default").hide();

                    // display the message with options
                    $("#finalise-message").show();
console.log('finalise-message');
console.log(teamcode);
console.log(1);
                    // first to finalise
                    if(Teams.myistwa) {
console.log(2);
                        if(Teams.my.teamcode === teamcode) {
console.log(3);
                            if(Teams.other.data.remotestatusid == "3") {
console.log(4);
                                $("#finalise-message-home").hide();
                                $("#finalise-message-playself").show();
                            }
                            else {
console.log(5);
                                $("#finalise-message-home").show();
                                $("#finalise-message-playself").hide();
                            }
                        }
                        else {
console.log(6);
                            $("#finalise-message-home").hide();
                            $("#finalise-message-playself").show();
                        }
                    }
                    else {
console.log(7);
                        $("#finalise-message-home").hide();
                        $("#finalise-message-playself").show();
                    }
                },
                error:function(errdata) {
                    console.log('ERROR');
                    displayErrMsg('Error', errdata);    //  }
                }
            });
        }
    });
});

//$(document).on("click", "#allowawayfinalise", function() {
//    console.log("clicked #allowawayfinalise");
//    // hide this teams finalisation block
//    $("#finalise-message").hide();
//    $(".finalise-default").show();
//    $("#this-team-finalise").hide();
//});

$(document).on("click", "#exitfinalise", function() {
    console.log("clicked #exitfinalise");
    // hide this teams finalisation block
    $("body").pagecontainer("change", PAGE_HOME, {reloadPage:false});
});

//$(document).on("click", ".disputefinal", function()
//{
//    var teamid = $(this).attr("data-teamid");
//    var tasks = $(this).closest('div.eomtasks').attr("id");
//    var playfld = "#player_PP" + teamid;
//    var pplayer = null;
//
//    if($(playfld).length > 0) {
//        var reqd = $(playfld).parent().attr("data-required");
//        pplayer = $(playfld).attr("data-id");
//        if(reqd == "1" && pplayer == "0") {
//            myAlert("info", "Select Player Error", "You must select a Players Player");
//            return false;
//        }
//    }
//    var comment = $("#matchcomment_" + teamid).val();
//    if($.trim(comment) == "") {
//        myAlert("info", "Comment Error", "You must enter a comment to explain the reason(s) for your Dispute");
//        return false;
//    }
//    var msg = "<p>To finalise the game and register your Dispute, click <b>OK</b></p><p>You will no longer be able to access this match</p><p>Continue?</p>";
//    if(Data.config.appmethod == METHOD_SOLO_AUTH) {
//        msg = "<p>To finalise the game and register your Dispute, click <b>OK</b></p><p>You will no longer be able to edit this match</p><p>Continue?</p>";
//    }
//    myConfirm(, function(answer) {
//        if(answer) {
//            $.ajax({
//                url: apiURL + 'finalisegame',
//                type: 'POST',
//                dataType: 'json',
//                data: {
//                    pin: Data.remote.remotepin,
//                    remoteid: Data.remote.id,
//                    appmethod: Data.config.appmethod,
//                    finaldata: { pp: pplayer, comment: comment },
//                    button: 'dispute'
//                },
//                success: function(data) {
//                    $("#reloadsite").trigger("click");
//                    console.log(data);
//                },
//                error: function(error) {
//                    console.log(error);
//                }
//            });
//        }
//    });
//});

function refreshPage() {
    $.mobile.changePage(
        window.location.href,
        {
            allowSamePageTransition : true,
            transition              : 'none',
            showLoadMsg             : false,
            reloadPage              : true
        }
    );
}

$(document).on("click", "#maintpassword", function() {
    $("#getteamloginform").hide();
    $("#createTeamPasswordForm").show();
});

$(document).on("click", "#enterpassword", function() {
    $("#getteamloginform").show();
    $("#createTeamPasswordForm").hide();
});

//$("#dlgTeamLogin");

$(document).on("click", ".cstatus", function() {
    console.log($(this).attr("class"));
    var title = $(this).attr("title");
    var notyclass = $(this).attr("data-notyclass");
    var n = $(".noty").noty({
        theme: 'relax',
        layout: "bottom",
        type: notyclass,
        text: title,
        timeout: 1000,
        modal: false,
    });
});

function switchBreaks(drawid, callback)
{
    let hora = (Teams.myishome ? "H" : "A");

    return $.ajax({
        url: apiURL + "switchbreaks",
        type: "POST",
        dataType: "json",
        data: {
            action: 'switchBreaks',
            drawid: drawid,
            hora: hora
        },
        success: function(data) {
            console.log(data);
            if(udc(data.error)) {
                myAlert('success',
                    'Breaks Switched',
                    '<p>Breaks now switched</p><p>Click OK to Reload the App</p>', callback );
            }
        },
        error:function(errdata) {
            console.log('ERROR');
            displayErrMsg('Error', errdata);    //  }
        }
    });
}

function switchAccess(drawid, callback)
{
    let hora = (Teams.myishome ? "H" : "A");

    return $.ajax({
        url: apiURL + "switchaccess",
        type: "POST",
        dataType: "json",
        data: {
            action: 'switchAccess',
            drawid: drawid,
            hora: hora
        },
        success: function(data) {
            console.log(data);
            if(udc(data.error)) {
                var access = '';
                $.each(data, function(h, o) {
                    if(o.hasaccess == 1) {
                        access = h == "H" ? "H" : "A";
                    }
                })
                myAlert('success',
                    'Access Switched',
                    '<p>Access is now granted to:</p><p><b>' + Teams.other.shortname + '</b></p><p>Click OK to Reload the App</p>', callback );
            }
        },
        error:function(errdata) {
            console.log('ERROR');
            displayErrMsg('Error', errdata);    //  }
        }
    });
}

$(document).on('click', ".devicestatus", function() {
    if(Teams.myistwa === false) {

        var msg = '<div style="text-aling:center;"<p>Click <b>YES</b> to <b>TRANSFER CONTROL</b> of updating</p><p><b>Select Players & Lock Players</b></p>' +
            '<p>options to ' + (Teams.twla.sellockopt == 1 ? 'your team' : 'the other team') + '</p>';

        var buttonText = {ok: 'OK', yes: 'Yes', cancel: 'No'};
        myConfirm("Confirm", msg, buttonText, function(answer) {
            if(answer) {
                $.ajax({
                    url: apiURL + "toggleawaycontrol",
                    data: {
                        action: "toggleawaycontrol",
                        remid: Teams.my.data.id,
                        control: Teams.my.data.hasaccess,
                    },
                    success: function(data) {
                        console.log(data);
                        if(isset(data.status)) {
                            reloadSite();
                        }
                        else {
                            myAlert('error', 'Invalid', 'This option is not valid for this team');
                        }
                        console.log(data);
                    },
                    error:function(errdata) {
                        console.log('ERROR');
                        displayErrMsg('Error', errdata);    //  }
                    }
                });
            }
        });
    }
    else {

    }
});

$(document).on("click", "#matchdate", function() {
//    $("#datalist").show();
    if($("#matchcarat").hasClass("matchcaratd")) {
        $("#matchcarat").addClass("matchcaratu").removeClass("matchcaratd");
        $("#dateoptions").show();
    }
    else {
        $("#matchcarat").addClass("matchcaratd").removeClass("matchcaratu");
        $("#dateoptions").hide();
    }
    console.log("matchdate.click");
});

$(document).on("click", ".dateopt", function() {
//    $("#datalist").show();
    var sqldate = $(this).attr("data-date");
    var seldate = $(this).text();

    $("#dateoptions").hide();
    $("#matchdate").html(seldate + '<span id="matchcarat" class="matchcaratd">');

    console.log("matchdate.click");
console.log(sqldate);
    initLandingPage('none', sqldate);
});

$(document).on("click", ".matchrowview", function() {

    console.log('matchrowview.click');

    var obj = this;

    var drawid = $(obj).attr('data-drawid');

    var jwt_drawid = '';
    if(isset(myJWT)) {
        if(isset(myJWT.drawid)) {
            if(drawid == myJWT.drawid) {
                jwt_drawid = drawid;
            }
        }
    }

    // if match appears in ls app menu page in the list of matches today for team, do not respond with message
    if($(obj).hasClass('selteam')) {
        if($(obj).hasClass('matchwait') || $(obj).hasClass('matchactive')) {
            return false;
        }
    }

    if($(obj).find(".nomatch").hasClass("hidden") || drawid == jwt_drawid || CPage.page == PAGE_HOME) {

//        var drawid = $(obj).attr("data-drawid");
    //console.log("clicked " + drawid + " " + $.now());

        // only show scoresheet if match is Active, or is Done
        var showscoresheet = $(obj).hasClass("matchactive") || $(obj).hasClass("matchdone");

        var cclass = "matchnone";
        var calert = "nomatchalert2";

        if(showscoresheet) {

            CPage.ltype = LOGIN_VIEWONLY;
            CPage.param = 'readOnly';
            CPage.drawid = drawid;

            if(drawid == jwt_drawid) {
                cclass = "matchself";
                calert = "matchselfalert";
            }
            else {
                var compid = $(this).closest('div.activematchset').attr('data-compid');
                var seldate = $("#matchdate").attr('data-seldate');

                CPage.refresh = !$(obj).hasClass("matchdone");

                localStorage.setItem('lastview', JSON.stringify({seldate: seldate, compid: compid }));

    //            $.mobile.changePage(PAGE_RESULTS);
                $("body").pagecontainer("change", PAGE_VIEWRES, {reload: true});
            //        displayEnterResults(LOGIN_VIEWONLY, drawid);
                return false;
            }
        }
        else {

            if($(obj).hasClass("matchwait")) {
                cclass = "matchwait";
            }
            else if($(obj).hasClass("matchpend")) {
                cclass = "matchpend";
                calert = "nomatchalert";
            }
        }

        $(obj).addClass(calert).removeClass(cclass);
        $(obj).find(".matchok").addClass("hidden");
        $(obj).find(".nomatch").removeClass("hidden");

        $(obj).find(".nomatch").show('slow', function() { setTimeout(function() {
            $(obj).find(".nomatch").addClass("hidden");
            $(obj).removeClass(calert).addClass(cclass);
            $(obj).find(".matchok").removeClass("hidden");
        }, 2000); } );
    }
});

$(document).on('click', "#bigfingers", function() {
    $("#settingmenures").popup('close');
    if($(this).text() === "Big Finger Mode") {
        $(this).text("Normal Finger Mode");
        $(".row.statsedit").addClass("fatfingermode");
    }
    else {
        $(this).text("Big Finger Mode");
        $(".row.statsedit").removeClass("fatfingermode");
    }
});

$(document).on('keydown', "#pin, #password", function(e) {
//    console.log(e);
    if(e.which == '13') {
        e.preventDefault();
        var form = $(this).closest('form');
        if($(form).find(".tapgo").length == 0) {
            $(form).append('<div class="tapgo" style="width:100%;padding:5px 0px;margin-top:3px;text-align:center;background-color:red;color:white;">' +
                'Click/Tap the GO button</div>');
        }
    }
});

$( function() {
    $( "#dlgTeamLogin" ).enhanceWithin().popup();
});
