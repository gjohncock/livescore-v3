/***** PAGE: INDEX ****/

var apiURL;
var CURR_TEAM = null;

var METHOD_DUAL_AUTH = "0";
var METHOD_SOLO_AUTH = "1";

var InitData = {};

var lockcheckinterval = 0;

var FinaliseInterval = 0;

var FinLockUpdateTime = 0;

var NBSP = '&nbsp;';

var MY_WIN = "#88CC88";
var OTHER_WIN = "#FFAAAA";

var CONTROL_NONE = 1;
var CONTROL_HAS = 2;

var SEQ_BTN_HOME = 'blue';
var SEQ_BTN_AWAY = 'red';

var Site = new Sites();

var IDX_INTERVAL;

var Blocks = {};
var MatchSheet = {};
var GBCodes = {};
var Totals = {};        // Result Totals by Block, Legend (Block 0) is Total of all other Blocks
var Spots = {};

var PAGE_NAME = '';
var PAGE_VERSION = '';

var WIN_DEFAULT = "W";
var WIN_FORFEIT = "F";
var WIN_ABANDONED = "A";
var WIN_UNDO = "U";

var RESTYPE_FORFEIT = [999991,999992];
var RESTYPE_ABANDONED = [999993,999994];

var _gaq = _gaq || [];

var POS_COUNT = 0;

var CONFIRM_ENABLED = false;

var RTM_PLAYALLMAXFRAMES = 0;
var RTM_BESTOFMAXFRAMES = 1;
var RTM_RACETOMAXFRAMES = 2;
var RTM_IGNOREMAXFRAMES = 3;

var isAppInForeground = true;

var SS = new SiteStatus();

var APP_VERSION = 5;
var PWD = "Szso6oRlT6ES7jK";

var Data = {};
var Version = {};
var Players = {};
var Legend = {};
var LegendCodes = {};

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

var LastUpdate = {
    lastTimestamp: 0,
    lastRefresh: 0,
    intervalCount: 0,
    lastReqStatus: "none",
    timeoutCount: 0
};

var MS_INTERVAL = null;
var IDX_INTERVAL = null;

var EH = [];


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

console.log('index.html SCRIPTS');

console.log('Site');
console.log(Site);

apiURL = Site.apiUrl + 'liveapi/v2/';       // see header for declaration
var APPMODE = Site.AppMode;     // "DEV";
var APPID = Site.AppId;         // "PSMOB.AU";
var APPTYPE = Site.AppType;

var devURL = "https://lsp/";
//APPID = "PSMOB2.DEV";
//var serviceURL = "https://psl/";
//var apiURL;

console.log(apiURL);
console.log(APPID);
console.log(APPMODE);

var vp = ViewPortSize();

//console.log(vp);

function ViewPortSize() {
    var height = window.innerHeight;
    var width = window.innerWidth;
    return { height: height, width: width };
}

if(vp.width < 321) {
    $('body').css('font-size', '0.8em');
}
//var items = STAGES[6].na;
//var parts = items.split(" ");

var thispage = window.location.href;

var CPage = new CurrPage();
//console.log(CPage);

function CurrPage(newpage)
{
    this.page = 'index.html';
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

var CID = new ClientID;

console.log('ClientID');
console.log(CID);

// need to remove other token if app is restarted - other team user will need to log in again
localStorage.removeItem(LSTR_JWTTOKENOTHER);

var myJWT = {};
var othJWT = {};

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

//    if(tokenok === false && actiononfalse !== null) {
//        actiononfalse();
//    }
    return tokenOK
}

//  = parseInt($.now() / 1000) + (60 * this.expiremins)
var Settings = {

    dataDefaults: {
//        device: null,
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
//        this.data.device = DEVICE_ID;
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
//    console.log('getTokenID');
//    console.log(tokenid);
    if(typeof tokenid == 'undefined') {
//        console.log(1);
        tokenid = [];
        tokenid.push(LSTR_JWTTOKEN);
    }
//    else {
//        console.log(2);
//        tokenid.push(tokenid);
//    }
//console.log(tokenid);
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
            if(typeof settings.data !== 'undefined' && settings.type === "POST") {
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
    if(typeof tokenid === 'undefined') {
        return headerParams;
    }
    else {
        // otherwise, return true/false for the specified tokenid
        return typeof headerParams[tokenid] !== 'undefined';
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

// if there are current Settings, automatically re-load the match
if(Settings.load()) {
    initLandingPage("pin", Settings.data.pin);
}

// PIN  LOGIN MODE
else if(thispage.indexOf("?pin=") > -1) {
    var pin = getParameterByName("pin");
    console.log("pin = " + pin);
    initLandingPage("pin", pin);
}

// TEAM PASSWORD MODE
else if(thispage.indexOf("?team=") > -1) {
    var team = getParameterByName("team");
    console.log("team = " + team);
    initLandingPage("team", team);
}

// TEAM PASSWORD MODE
else if(thispage.indexOf("?setpwd=") > -1) {
    var pwd = getParameterByName("setpwd");
    console.log("pwd = " + pwd);
    initLandingPage("setpwd", pwd);
}

// ADMIN MODE - MOVED TO LSVIEW TEMPLATE
else if(thispage.indexOf("?comp=") > -1) {
    var comp = getParameterByName("comp");
    console.log("comp = " + comp);
    IS_ADMIN = true;
    initLandingPage("comp", comp);
}

else {
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

//$(document).on("taphold", ".mycoltitle", function() {
//
//});

var xobj;

$(document).on("click", ".pbutton2", function(e) {
//    console.log($(this).attr("id"));
});

/******************************************************
 * PAGES
 */
$(document).on('pagebeforeshow', '#IndexPage', function ()
{
    CPage.setPage('index.html');

    for(var i = 1; i < 11; i++)
    {
        today = moment().subtract(i, "d");
        var sqldate = today.format("Y-MM-DD");
        var date = today.format("ddd, D-MM-Y");
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
    console.log('pagebeforeshow-HomePage');

    CPage.setPage('home.html');

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
        $("#accessteamname").text(Teams.my.teamname + hora_array[twa]);
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
        var multi = '<div class="divTable" style="border-collapse:separate;border-spacing:3px;">';
        // font-family: "Roboto Condensed","RobotoDraft","Roboto","Helvetica Neue",sans-serif;font-weight: 400;
        var homelose = '';
        var awaylose = '';
        var mstatus = "matchdone";
        $.each(Data.rounds.matches, function(mtime,o) {
            console.log(o);
            if(Data.draw.id == o.drawid) {
                mstatus = "matchactive";
            }
            else {
                var status = Teams.my.team == "H" ? o.homestatus : o.awaystatus;
                if(status < "3") {
                    mstatus = "matchwait";
                }
            }
            var starttime = moment.unix(mtime).format('h:mma');
            var panelcolor = Data.draw.id == o.drawid ? ' style="background-color: rgb(150,255,150);"' : '';
            multi += String.format('<div class="divTableRow"><div class="divTableCell selteam matchrowview {10}" {2} data-drawid="{0}">' +   //  style="padding:5px;"
                '<table class="matchtbl" width="100%"><tr class="matchok" id="draw_{0}">' +
                '<td class="no-narrow" style="width:12%;min-width:65px;font-size:0.8em;">{3}</td>' +
                '<td class="ar{8}" style="width:32%">{6}</td>' +
                '<td id="score_{0}" class="ac matchscore">{4} : {5}</td>' +
                '<td class="{9}" style="width:32%">{7}</td>' +
                '</tr></table></div></div>', o.drawid, o.drawid, panelcolor, starttime,
                parseInt(o.homeframescore) + parseInt(o.homeframescoreadj), parseInt(o.awayframescore) + parseInt(o.awayframescoreadj),
                o.homeshortlabel, o.awayshortlabel, homelose, awaylose, mstatus);
        });
        $('.myteaminfocontent').html(multi + "</div>");
    }
    else {
        $("#myteaminfo").hide();
    }

    setAutoApproveText();

    var status = LegendSaveCount();

    if(status.id < 2) {
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

$(document).on('pagebeforehide', '#PlayerSelectPage', function () {
    console.log('pagebeforehide-PlayerSelectPage');
    clearInterval(lockcheckinterval);
    lockcheckinterval = 0;
});

$(document).on('pagebeforeshow', '#PlayerSelectPage', function () {

    CPage.setPage('playerselect.html');

    console.log('pagebeforeshow-PlayerSelectPage');

    console.log('displayPlayerSelect(' + CURR_TEAM + ')');

    loadershow();

    displayPlayerSelect(CURR_TEAM);
});

$(document).on('pagebeforeshow', '#EnterResultsPage', function (data) {

    CPage.setPage('enterresults.html');

    console.log('pagebeforeshow-EnterResultsPage');

    loadershow();

    // Livescore App users
    if(CPage.param != 'readOnly') {

        if(myJWT.exists === 1) {

            CURR_TEAM = myJWT.teamid == 0 ? Teams.my.teamcode : myJWT.teamcode;
            CURR_TOKEN = LSTR_JWTTOKEN;

            console.log('CURR_TEAM: ' + CURR_TEAM);

            CPage.ltype = LOGIN_TOKEN;
            CPage.drawid = 0;
        }
    }

    console.log(CPage);

    displayEnterResults();

    $("#resultsheader").removeClass('refreshwait');
});

$(document).on('pageshow', '#EnterResultsPage', function () {

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

    CPage.setPage('finalisematch.html');

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

$(document).on("change", "#select-round", function() {
    console.log('click');
    var rmid = $(this).val();
    loadershow();
    populateHomePage('remote', rmid);
    return false;
});

$(document).on('click', '#msheetpreview', function() {

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
    console.log('playingnow');

    var row = $(this).parent();
    var gcode = $(this).data("gcode");

    if($(row).hasClass('playingnow')) {
        // cannot delete when match is in progress
        if(GBCodes[gcode].remotedata.resultstatus == "2") {
            if($(row).find(".ms.result").text() == "00" || $(row).find(".ms.result").text() == "??") {
                updateInProgress(0, row, gcode)
//                $(row).removeClass("playingnow");
            }
        }
        else {
            updateInProgress(0, row, gcode)
//            $(row).removeClass("playingnow");
        }
    }
    else {
        var result = $(row).find(".ms.result").text();
        console.log(result);
        if("??00".indexOf(result) > -1) {
            updateInProgress(1, row, gcode)
            //$(row).addClass("playingnow");
        }
    }

});

function updateInProgress(newstatus, row, gcode)
{
    var blockno = $(row).data("blockno");
    var pos = $(row).data("pos");
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

    var hcode = $(obj).parent().find(".ms.home.code").data("gcode");
    var acode = $(obj).parent().find(".ms.away.code").data("gcode");

    var hjson = MatchTeams[block][hcode].json;
    var ajson =  MatchTeams[block][acode].json;

    openMatchOptionsPanel(obj, { hgbcode: hjson.player.gbcode, agbcode: ajson.player.gbcode }, parseInt(Data.config.autoclosetime) );
});

$(document).on("tap", ".ms.active.result", function()
{
    console.log('".ms.active.result" tapped');

    var obj = $(this);

    var block = parseInt($(obj).parent().attr("data-blockno"));

    var hcode = $(obj).parent().find(".ms.home.code").data("gcode");
    var acode = $(obj).parent().find(".ms.away.code").data("gcode");

    var hjson = MatchTeams[block][hcode].json;
    var ajson =  MatchTeams[block][acode].json;

    var pmiss = playersMissing({home: hcode, away: acode});

    if(pmiss > 0) {
        myAlert('error',"Players Missing", "There are " + pmiss + " players to be selected for this match", function() { });
        return false;
    }

    // is result field for partner of doubles match, no click allowed
    if($(obj).hasClass('ignore')) {
        return false;
    }

    if($(obj).hasClass("mf")) {
        $(obj).trigger("taphold");
    }
    else {
        // if first score in block, disable all player links in the block

        var wintype = WIN_DEFAULT;

        // get the player ids so we can check if any players are set to forfeit or abandoned
        var hpid = parseInt($(obj).closest('div.statsedit').find('.home.code').data('id'));
        var apid = parseInt($(obj).closest('div.statsedit').find('.away.code').data('id'));

        // check if either player or both players are set to FORFEIT or ABANDONED
        if(RESTYPE_FORFEIT.indexOf(hpid) > -1 || RESTYPE_FORFEIT.indexOf(apid) > -1) {

            wintype = WIN_FORFEIT;

            // if both players set to forfeit, match is ABANDONED
            if(RESTYPE_FORFEIT.indexOf(hpid) > -1 && RESTYPE_FORFEIT.indexOf(apid) > -1) {

                wintype = WIN_ABANDONED;
            }
    //        else {
    //            if(RESTYPE_FORFEIT.indexOf(hpid) > -1) {
    //
    //            }
    //            else {
    //
    //            }
    //        }
        }
        else if(RESTYPE_ABANDONED.indexOf(hpid) > -1 || RESTYPE_ABANDONED.indexOf(apid) > -1) {

            wintype = WIN_ABANDONED;
        }

        saveResultToDb(obj, 'score-code', wintype, false, function(){console.log("normal WIN only, no extra code");});
    }
});

$(document).on("taphold", ".ms.active.result", function()
{
    console.log('taphold.ms.active.result');

    var obj = $(this);

    var block = parseInt($(obj).parent().attr("data-blockno"));

    var hcode = $(obj).parent().find(".ms.home.code").data("gcode");
    var acode = $(obj).parent().find(".ms.away.code").data("gcode");

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

    var sides = ['home','away'];
    var miss = 0;

    for(s = 0; s < sides.length; s++) {
        var code = data[sides[s]];
        var obj = parseInt($("#code_" + code).attr("data-id"));
        miss += (obj === 0 ? 1 : 0);
        if(GBCodes[code].gbcode.type == "D") {
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

    var block = parseInt($(parent).data("blockno"));
    var pos = parseInt($(parent).data("pos"));

    var hcode = $(parent).find(".ms.home.code").data("gcode");
    var acode = $(parent).find(".ms.away.code").data("gcode");

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
    var newplayerid = $(this).find(".msub.code").data("id");

    var gcode = $(this).closest("div.player-sublist-head").data("gcode");
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
            if(typeof Spots[cblock][hora][code] != 'undefined') {
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
    var block = GBCodes[gcode].block;

    var showcode = getShowCode(Teams[gcode[0]].teamcode, plyr.code, block);

    if(notorig) {
        if(plyr.type == 1) {
            $("#psub_" + gcode).parent().find(".snocode").removeClass('hidden').text(showcode);
            $("#psub_" + gcode).addClass('subnotorig');
        }
        else {
            $("#psub_" + gcode).addClass('fftaban');
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
//                $.mobile.changePage("finalisematch.html");
//            }
//        }
//    );
//});

$(document).on("click", ".ui-btn.advres, .more.advres", function()
{
    console.log("advres-button");

    // clear the timeout setting, recreate when save request is complete
    var advpanel = $(this).closest("div.scoreparent");

    var closebtn = $(this).hasClass("more") ? $(this).closest("div.moremenu").find(".closemorebtn") : null;

    var multiframe = $(advpanel).data("mformat") == "mf" ? 1 : 0;

    var btn = $(this);
    var wintype = $(btn).data('rescode');

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
//        $(advpanel).data("delay", tmout2);
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

$(document).on("click", ".spinner.spinkey", function() {
    if(!$(this).hasClass(".spinkeydisabled")) {
        $(".spinner.spinkey").addClass(".spinkeydisabled");
        var valobj = "#spinvalue_" + $(this).data("rmid");
        var spinval = parseInt($(valobj).text());
        var fadj = $(this).parent().hasClass("home") ? "homeframescoreadj" : "awayframescoreadj";
        if($(this).hasClass("spinminus")) {
            spinval--;
        }
        else {
            spinval++;
        }
        var data = {
            drawid: $(valobj).data("drawid"),
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
        })
    }
});

function openMatchOptionsPanel(obj, params, timer) {

    var parts = $(obj).attr("id").split("_");
//console.log(params);
    // player code
    var gcode = parts[1];
    var p1 = GBCodes[gcode];

    // partner code
    var pcode = GBCodes[gcode].partner;
    var p2 = GBCodes[pcode];

    var advpid = String.format('#input-{0}-{1}', p1.blockno, p1.row);

    if(gcode !== pcode) {       // singles player
        if($(obj).hasClass('result')) {
            advpid = String.format('#input-{0}-{1}', p2.blockno, p2.row);
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

    console.log(allresult);

    var data = {};

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

        // if a score already exists - user either tapping L or any of the wintypes
        if(curresult !== "?")
        {
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
                    change = true;
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
            data.awayresult = 'X';
            data.awayframecount = 0;
        }
        else if(wintype == 'A') {
            // if forfeit, find which player is the forfeit and set the other as winner
//            if(RESTYPE_FORFEIT.indexOf(data.home.player.id) > -1) {
//                // check if both players are set to forfeit, if so, match is abandoned
//                if(RESTYPE_FORFEIT.indexOf(data.away.player.id) > -1) {
//                    console.log(2);
//                    data.resultstatus = 16;
//                    data.awayresult = WIN_ABANDONED;
//                    data.awayframecount = 0;
//                    data.homeresult = WIN_ABANDONED;
//                    data.homeframecount = 0;
//                }
//                else {
//                    console.log(3);
//                    // home player is FORFEIT
//                    data.resultstatus = 8;
//                    data.awayresult = wintype;
//                    data.awayframecount = 1;
//                    data.homeresult = 'L';
//                    data.homeframecount = 0;
//                }
//            }
//            else if(RESTYPE_FORFEIT.indexOf(data.away.player.id) > -1) {
//                    console.log(31);
//                    // home player is FORFEIT
//                    data.resultstatus = 8;
//                    data.homeresult = wintype;
//                    data.homeframecount = 1;
//                    data.awayresult = 'L';
//                    data.awayframecount = 0;
//            }
//            if(wintype === 'F') {
//                // if there are 2 valid players and the user has clicked the FFT button in ASP
//                if($(obj).hasClass('home')) {
//                    console.log('wintype2: ' + wintype + '-H');
//                    data.resultstatus = 8;
//                    data.homeresult = wintype;
//                    data.homeframecount = 1;
//                    data.awayresult = 'L';
//                    data.awayframecount = 0;
//                }
//                else {
//                    console.log('wintyp3: ' + wintype + '-A');
//                    data.resultstatus = 8;
//                    data.awayresult = wintype;
//                    data.awayframecount = 1;
//                    data.homeresult = 'L';
//                    data.homeframecount = 0;
//                }
//            }
//            else {
            console.log('wintype2: ' + wintype + '-A');
            data.resultstatus = 32;
            data.awayresult = WIN_ABANDONED;
            data.awayframecount = 0;
            data.homeresult = WIN_ABANDONED;
            data.homeframecount = 0;
//            }
            // if either abandoned, set both results as 'A'
        }
        else {
            // ALL VALID WIN TYPES W, [B, S, C], F
            if($(obj).hasClass('home')) {
                console.log('wintype3: ' + wintype + '-A');
                data.resultstatus = 8;
                data.homeresult = wintype;
                data.homeframecount = 1;
                data.awayresult = 'L';
                data.awayframecount = 0;
            }
            else {
                console.log('wintype4: ' + wintype + '-A');
                data.resultstatus = 8;
                data.homeresult = 'L';
                data.homeframecount = 0;
                data.awayresult = wintype;
                data.awayframecount = 1;
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

    var hjson = MatchTeams[block][$(hcode).data('gcode')].json;
    var ajson = MatchTeams[block][$(acode).data('gcode')].json;

    data.homeid = parseInt(homeid);
    data.awayid = parseInt(awayid);

    data.home = hjson;
    data.away = ajson;

    data.action = 'saveResultToDb';
    data.multiframe = multiframe;

    console.log(data);

    if(undo === true || change === true) {
        var title = 'Confirm ' + (undo === true ? 'Undo' : 'Change');
        var msg = 'Do you wish to ' + (undo === true ? 'Reset this Game?' : 'Change the score to <b>' + wintype + '</b>?');
        myConfirm(title, msg, function(answer) {
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

    var multiframe = parseInt(data.multiframe);

    // current data
    h.p1 = data.home.player;
    a.p1 = data.away.player;
    h.p2 = null;
    a.p2 = null;

    // updated data
    h.d1 = retdata.home[h.p1.gbcode];
    a.d1 = retdata.away[a.p1.gbcode];
    h.d2 = null;
    a.d2 = null;

    if(isset(data.home.partner)) {
        h.p2 = data.home.partner;
        a.p2 = data.away.partner;
        h.d2 = retdata.home[h.p2.gbcode];
        a.d2 = retdata.away[a.p2.gbcode];
    }

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
        if(h.d1.resultcode === "L") {
            // away team won
            updateResult(a, result, multiframe);
            updateResult(h, "L", multiframe);
        }
        else {
            // home team won
            updateResult(h, result, multiframe);
            updateResult(a, "L", multiframe);
        }
//                else {
//                    updateResult(h, "D", multiframe);
//                    updateResult(a, "D", multiframe);
//                }
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

    if(Data.config.disablesubonfirstresult === "1")
    {
        if(Totals[block].H + Totals[block].A === 0)
        {
            console.log("show all links for block " + block);
            if($(obj).closest('div.matchset').hasClass("block1lock")) {
                // do nothing - this is the first block and block1autolock = "1"
            }
            else {
                $(obj).closest("div.matchblock").find(".playersub").addClass("showlink");
            }
        }
        else {
            console.log("hide all links for block " + block);
            $(obj).closest("div.matchblock").find(".playersub").removeClass("showlink");
        }
    }
    else if(h.d1.resultstatus === "1") {
        if($(obj).closest('div.matchset').hasClass("block1lock")) {
            // do nothing - this is the first block and block1autolock = "1"
        }
        else {
            if(!isUpdate) {
                $(obj).closest(".statsedit").find(".playersub").addClass("showlink");
            }
        }
    }
    else {
        if($(obj).closest('div.matchset').hasClass("block1lock")) {
            // do nothing - this is the first block and block1autolock = "1"
        }
        else {
            $(obj).closest(".statsedit").find(".playersub").removeClass("showlink");
        }
    }
}

function updateResult(o, val, multiframe) {

    console.log(o.d1);
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

    var win = wintypes.indexOf(val);
    win = win > 2 ? 2 : win;

    var fld = $("#result_" + o.p1.gbcode);

    var rescode = val;

    if(multiframe == 1) {
        // show frame wins for multi-frame matches
        var fcount = o.d1.framecount;
        $(fld).text(fcount);
        $("#bigresult_" + o.p1.gbcode).text(fcount);
    }
    else {
        // show win type for single frame matches
        $(fld).text(rescode);
    }
    $(fld).attr("data-prev", rescode);

    var wincss = ['msaban', 'mswinfft', 'mswin'];

    var horacls = ".ms" + (o.p1.gbcode[0] === "H" ? ".home" : ".away");

    // clear all previous shading
    $(fld).parent().find(horacls).removeClass("mswin mswinfft msaban");
    if(o.p2 !== null) {
        $("#result_" + o.p2.gbcode).parent().find(horacls).removeClass("mswin mswinfft msaban");
    }

    if(win > -1) {
        $(fld).parent().find(horacls).addClass(wincss[win]);
        if(o.p2 !== null) {
            $("#result_" + o.p2.gbcode).parent().find(horacls).addClass(wincss[win]);
        }
    }

    console.log('update scores: (' + o.p1.gbcode + (o.p2 === null ? '' : ' & ' + o.p2.gbcode) + ") = " + val);

    GBCodes[o.p1.gbcode].remotedata.resultcode = o.d1.resultcode;
    GBCodes[o.p1.gbcode].remotedata.resultstatus = o.d1.resultstatus;
    GBCodes[o.p1.gbcode].remotedata.framecount = o.d1.framecount;
    GBCodes[o.p1.gbcode].remotedata.updatedatetime = o.d1.updatedatetime;
    GBCodes[o.p1.gbcode].remotedata.framesequence = o.d1.framesequence;

    if(o.d2 !== null) {
        GBCodes[o.p2.gbcode].remotedata.resultcode = o.d2.resultcode;
        GBCodes[o.p2.gbcode].remotedata.resultstatus = o.d2.resultstatus;
        GBCodes[o.p2.gbcode].remotedata.framecount = o.d2.framecount;
        GBCodes[o.p2.gbcode].remotedata.updatedatetime = o.d2.updatedatetime;
    }
}

function getMatchDetails(gbcode)
{
    var md = {};
    var mydata = GBCodes[gbcode];
    var othdata = GBCodes[mydata.opponent];
    var mypdata = null;
    var othpdata = null;
    if(mydata.gcode !== mydata.partner) {
        mypdata = GBCodes[mydata.partner];
    }
    if(othdata.gcode !== othdata.partner) {
        othpdata = GBCodes[othdata.partner];
    }

    md[mydata.gcode[0]][0] = GBCodes[gbcode];
    if(mypdata !== null) {
        var last = mydata.gcode.length - 1;
        var lastp = mypdata.gcode.length - 1;
        if(parseInt(mydata.gcode[last]) < parseInt(mypdata.gcode[lastp])) {
            md["H"][1] = GBCodes[mydata.partner];
        }
        else {
            md["H"][0] = GBCodes[mydata.partner];
            md["H"][1] = GBCodes[gbcode];
        }
    }

    md[othdata.gcode[0]][0] = GBCodes[mydata.opponent];
    if(othpdata !== null) {
        var last = othdata.gcode.length - 1;
        var lastp = othpdata.gcode.length - 1;
        if(parseInt(othdata.gcode[last]) < parseInt(othpdata.gcode[lastp])) {
            md["H"][1] = GBCodes[othdata.partner];
        }
        else {
            md["H"][0] = GBCodes[othdata.partner];
            md["H"][1] = GBCodes[mydata.opponent];
        }
    }
    return md;
}

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

//    var parentpage = $(this).attr("data-parentpage") + ".html";
    var parentpage = CPage.prevpage;
console.log(CPage);
    if(parentpage == "index.html") {
        if($(this).hasClass("home-page")) {
            localStorage.setItem("loadsource",'livebackbutton');
        }
        window.location.href = "index.html";
    }
    else {
        if(CPage.page == "enterresults.html" && CPage.prevpage == "home.html" && CPage.param == "readOnly") {
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
            var teamid = $(this).data("teamid");
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
        1: "playerlist.html",
        2: "playerselect.html",
        3: "locklegend",
        4: "enterresults.html",
        5: "finalisematch.html",
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
                    if(CURR_TEAM === Teams.twla.teamcode) {
                        if(Data.config.appmethod !== "1") {
                            authreqd = true;
                        }
                        else {
                            if(item === 5) {
                                authreqd = true;
                            }
                        }
                    }
                }

                if(authreqd) {
                    if(othJWT.status == 1 && CURR_TOKEN === LSTR_JWTTOKENOTHER) {
                        console.log('othJWT token found');
                        $.mobile.changePage(pagetoload);
                    }
                    else {
                        console.log('no valid token, TWLA user to log in');
                        otherteampwddialog('.menuitem_click',
                            function(data) {

                                console.log("menuitem_click_success");
                                console.log(data);

                                $.mobile.changePage(pagetoload);
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

                    $.mobile.changePage(pagetoload);
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
                if(pagetoload.indexOf('.html') > -1) {
                    $.mobile.changePage(pagetoload);
                }
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
        myConfirm("Ready to Finalise", "If you are ready to Finalise, click <b>Yes</b> to Continue",
            function(answer) {
                if(answer) {
                    $.mobile.changePage("finalisematch.html");
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

// $(".cstatus").removeClass("cstatus-red cstatus-green cstatus-greendisc cstatus-yellow");
// $(".cstatus").addClass("cstatus-yellow").attr("title","Waiting to connect...");

//$(document).on("click", "#btnLockSelection", function()
//{
//    var teamid = $("#psteamname").attr("data-side");
//    var title = "Confirm My Team";
//    var msg = "Do you wish to LOCK Player Selections for " + Teams.my.teamname + "?";
//    if(Teams.other.teamid == teamid) {
//        title = "Confirm Other Team";
//        msg = "Do you wish to LOCK Player Selections for " + Teams.other.teamname + "?";
//    }
//
//    var data = {
//        action: '#btnLockSelection.click',
//        pin: Data.remoteother.remotepin
//    };
//
//    $.ajax({
//        url: apiURL + 'updateautoapprove',
//        data: data
//    })
//    .done(function(data) {
//        // if the command was successful, get the current setting
//        if(typeof data.releaselocks != 'undefined') {
//            console.log('UpdateAutoApprove_Success');
//            Data.remoteother.releaselocks = data.releaselocks;
//        }
//        else {
//            console.log('UpdateAutoApprove_Fail');
//        }
//        myConfirm(title, msg, function(answer) {
//            if(answer) {
//                if(Teams.other.teamid == teamid) {
//                    var locks = getLocks();
//                    console.log(locks.total);
//                    if(locks.total == 1 || locks.total == 3) {
//                        savePlayerSelection(BTN_LOCKLEGEND);
//                    }
//                    else {
//                        otherteampwddialog("#btnLockSelection",
//                            function(data) {
//                                savePlayerSelection(BTN_LOCKLEGEND);
//                            },
//                            function(err) {
//
//                            }
//                        );
//                    }
//                }
//                else {
//                    savePlayerSelection(BTN_LOCKLEGEND);
//                }
//            }
//        });
//    });
//});

// SELECT-PLAYER PAGE - SAVE SELECTIONS V2
$(document).on("click", "#ps_save", function()
{
    console.log('savePlayerSelection(BTN_SAVELEGEND)');
    savePlayerSelection(BTN_SAVELEGEND);
});

// SELECT-PLAYER PAGE - CLEAR SELECTIONS V2
$(document).on("click", "#ps_clear", function()
{
    var data = {};
    var msheet = {};

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

    $.each($("#playerselect-div").find(".row"), function(key, obj) {
        if($(obj).hasClass("playerselect")) {
            var pos = $(obj).find(".code");
            var id = $(obj).attr("data-id");
            $(obj).attr('id')
            var lcode = LegendCode($(obj).attr("data-legendcode"));
            if(lcode !== null) {
                console.log(lcode.hora + lcode.code);
                console.log($(obj).attr('id'));
                msheet[lcode.hora + lcode.code] = {
                    obj: "#" + $(obj).attr('id'),
                    origid: id,
                    playerid: 0,
                    fullname: "",
                    gbcode: lcode,
                    rank: 0,
                    new: Players[hora][id].new,
                    status: Players[hora][id].status,
                    type: Players[hora][id].type,
                    pos: -1,
                };
            }
        }
    });

    data = {
        action: '#ps_clear.click',
        pin: pin,
        button: BTN_CLEARLEGEND,
        msheet: msheet,
        drawid: Data.draw.id,
        teamistwla: teamistwla,
        gameblocks: Data.gameblocks
    };

    $.ajax({
        url: apiURL + 'postlegend',
        data: data,
        success: function(retdata) {
            console.log(retdata);
            console.log(msheet);
            if(retdata['error'] !== undefined) {
                myAlert("error", "Clear Error", retdata.error);
                return false;
            }
            $.each(msheet, function(k, o) {
                var id = o.origid;
                var obj = $(o.obj);
//                var pos = $(obj).find(".code");

                Players[hora][id].pos = -1;
                Players[hora][id].code = '?';
                Players[hora][id].legendcode = null;

//                $(pos).text("-");
//                $(obj).attr("data-legendcode", "null");
//                $(obj).removeClass("playerselected start sub");
            });

            $(".row.pselect").find(".code").text("-");
            $(".row.pselect").attr("data-legendcode", "null");
            $(".row.pselect").removeClass("playerselected start sub");

            if(teamistwla === 0) {
                Teams.my.data.legendsave = 0;
            }
            else {
                Teams.other.data.legendsave = 0;
            }
            myAlert("success", "Clear Legend", "Legend CLEARED!");
        },
        error: function(errdata) {
            console.log("ERROR");
            displayErrMsg("Error", errdata, function() { populateHomePage("token", myJWT.remoteid); });

        }
    });
    initGBCodes();
    POS_COUNT = 0;
});

// SELECT-PLAYER PAGE - ADD PLAYER V2
$(document).on("click", "#ps_addplayer", function() {
    var teamid = $("#psteamname").data("side");
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
//    if(isset(Players[hora][playerid])) {
//        Players[hora][playerid].fullname == pname;
//    }

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

                var np = Players[hora][playerid];

                var data = retdata[playerid];

                np.fullname = data.fullname;
                np.shortname = null;
                np.firstname = data.fname;
                np.lastname = data.sname;
                np.rank = data.rank;

                if(Teams.myishome) {
                    Data.remote.livescoredata = retdata.lsdata;
                }
                else {
                    Data.remoteother.livescoredata = retdata.lsdata;
                }

                Players[hora][playerid] = np;

                if(Teams.my.teamcode == data.teamcode) {
                    Teams.my.players[playerid] = np;
                }
                else if(Teams.other.teamcode == data.teamcode) {
                    Teams.other.players[playerid] = np;
                }

                if(np.new == 0 && np.fullname !== np.origfullname) {
                    $("#player_" + playerid).find(".pname").text(np.fullname + '*');
                    $("#player_" + playerid).find(".undoplayer").removeClass('hidden');
                }
                else {
                    $("#player_" + playerid).find(".pname").text(np.fullname);
                    $("#player_" + playerid).find(".undoplayer").addClass('hidden');
                }

                $("#player_" + playerid).find(".prank").text(np.rank);

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
                var now = $.now();

                var np = new Player();

                np.id = data.id;
                np.teamid = data.teamid;
                np.fullname = data.fullname;
                np.origfullname = data.fullname;
                np.shortname = data.fullname;
                //            np.fshortname = fshortname;
                //            np.initials = initials;
                np.firstname = data.firstname;
                np.lastname = data.lastname;
                np.rank = data.rank;
                np.type = data.type;
                //            np.new = 1,
                //            np.status = 1,
                //            np.pos = -1,
                np.code = '?';

                Players[hora][data.id] = np;

                if(Teams.my.teamcode == data.teamcode) {
                    Teams.my.players[data.id] = np;
                }
                else if(Teams.other.teamcode == data.teamcode) {
                    Teams.other.players[data.id] = np;
                }

                Teams[hora].data.livescoredata = retdata['lsdata'];

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

    var teamcode = $("#psteamname").data("side");
    var hora = teamcode[0];

    var obj = $(this).closest('div.pselect');
    var pid = parseInt($(obj).data("id"));
    var player = Players[hora][pid];
    var hasrank = Data.config.hasrankings == '1';
    var msg = "<p>Do you wish to undo all changes made to this player?</p><p>The player info will be reset to:</p>" +
            "<ul><li><b>Player Name: </b>" + player.origfullname + "</li>" + (hasrank ? "<li><b>Rank: </b>" + player.origrank + "</li>" : "");
    myConfirm("Undo Player changes", msg,
        function(confirm) {
            if(confirm) {
                // update database (remove edit record from livescoredata
                // update fullname, firstname and lastname
                // remove undo icon
                // update name in list
            }
        }
    );
});

// Click EDIT icon for player, loads Edit Dialog
$(document).on("click", ".editplayer", function() {

    var row = $(this).closest('div.pselect');

    var teamcode = $("#psteamname").data("side");
    var index = $(row).attr("data-id");

console.log(teamcode);
console.log(index);

    addplayerdialog('Player', teamcode, index);

});

$(document).on("click", ".deleteplayer", function(e)
{
    console.log('deleteplayer');

    var teamcode = $("#psteamname").data("side");
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

            myConfirm("Confirm Delete", "<p>Do you wish to delete '" + pname + "'?</p>", function(answer) {
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
    var obj = $(this).parent();
    var id = $(obj).attr("data-id");
    var code = $(obj).find(".code");     // the position column for the selected player
    var row = $(code).closest(".row");   // row div for selected player
    var pid = parseInt($(code).parent().attr("data-id"));

    /* TODO 15/01
     * new calc to total the number of legend codes that are specified in all the stats blocks
     * */
    var maxstats = getMaxStats();

//    var sub = '<span class="subplayer" style="color:red;font-weight:bold">SUB</span>';

    POS_COUNT = $(".playerselected").length;

console.log('POS_COUNT: ' + POS_COUNT);

    if(!$(row).hasClass("plocked"))
    {
        var mt = $("#psteamname").attr("data-side");
        var hora = mt[0];

        if(!$(row).hasClass("playerselected"))
        {

            var lc = Legend[mt][POS_COUNT];

            if(isset(lc)) {

                console.log(lc);
                console.log(POS_COUNT + " " + id);

                if(POS_COUNT >= maxstats) {
//                    $(row).find(".subplayer").show();
                    $(row).addClass("sub");
console.log('add sub');
                }
                else {
//                    $(row).find(".subplayer").hide();
                    $(row).addClass("start");
console.log('add start');
                }
                $(row).addClass("playerselected");
                $(row).attr("data-legendcode", lc.gbcode);      // AA100
                Players[hora][id].pos = POS_COUNT;
                Players[hora][id].legendcode = lc.gbcode;       // AA100
                Players[hora][id].code = lc.code;               // A or 1 etc
                Legend[mt][POS_COUNT].playerid = id;
                LegendCodes[mt][lc.code].playerid = id;
                // reset show codes after player assigned
                updateShowCodes();
                GBCodes[lc.gbcode].id = id;
                $(code).text(lc.showcode);
                $(".player_" + lc.code).text(Players[hora][pid].fullname);
//                POS_COUNT++;
            }
        }
        else if($(code).text() == Legend[mt][POS_COUNT - 1].showcode)
        {
            var lc = Legend[mt][POS_COUNT-1];
            $(code).text("-");
            var lcode = Players[hora][id].legendcode
            $(row).attr("data-legendcode", "null");
            Players[hora][id].pos = -1;
            Players[hora][id].legendcode = null;
            Legend[mt][POS_COUNT-1].playerid = 0;
            LegendCodes[mt][lc.code].playerid = 0;
            // reset show codes after player unassigned
            updateShowCodes();
            GBCodes[lcode].id = "0";
            $(row).removeClass("playerselected sub start");
//            $(row).find(".subplayer").hide();
            $(".player_" + lc.code).text("");
//            POS_COUNT--;
        }
        calcSelectedPoints(mt);
    }
});

//function navRefresh(match)
//{
////        var m = { code: code, othcode: othcode, recid: recid, othid: othid, spots: Spots };
////        refreshFromAbly(m, false);
//        var block = $(match).closest('.matchblock')
//        var hcode = $(block).find(".home").attr("data-gbcode");
//        var acode = $(block).find(".away").attr("data-gbcode");
//
//        var spots = {};
//        $.each(Spots, function(k,o) {
//            spots[k] = o;
//        });
//
//        var data = {
//            action: 'navRefresh',
//            drawid: Data.remote.drawid,
//            hcode: hcode,
//            acode: acode,
//            spots: spots,
//            pin: Data.remote.remotepin
//        }
//
//        $.ajax({
//            url: apiURL + 'refreshblock',
//            type: "POST",
//            dataType: "json",
//            data: data,
//            success: function(retdata) {
//
//                console.log('navRefresh.success');
//                console.log(retdata);
//
//                var thiscode;
//                var status;
//                $.each(retdata, function(gbcode, obj) {
//
//                    var pid = obj.stats.playerid;
//                    GBCodes[gbcode].playerid = pid;
//                    if(Players[pid] !== undefined) {
//                        GBCodes[gbcode].name = Players[pid].fullname;
//                        GBCodes[gbcode].rank = Players[pid].rank;
//                    }
//
//                    if(obj.isspot === false) {
//                        GBCodes[gbcode].remotedata.resultcode = obj.stats.resultcode;
//                        GBCodes[gbcode].remotedata.resultstatus = obj.stats.resultstatus;
//                        GBCodes[gbcode].remotedata.updatedatetime = obj.stats.updatedatetime;
//
//                        if(Teams.my.team == obj.remote.hora) {         // gbcode.substring(0,1)
//                            thiscode = gbcode;
//                            status = parseInt(obj.stats.resultstatus);
//                        }
//                    }
//
//                    var newdata = GBCodes[gbcode];
//
//                    updateMatchsheet(gbcode, newdata);       // update "pos" value for block
//
//                    setBlockAndNavBar(gbcode, status);
//                });
//
//                calcTotals();
//
//                var n = $(".noty").noty({
//                    theme: 'relax',
//                    layout: "bottom",
//                    type: 'information',
//                    text: 'Refresh complete',
//                    timeout: 1000,
//                    modal: false,
//                });
//            },
//            error:function(errdata) {
//                console.log('ERROR');
//                displayErrMsg('Error', errdata);    //  }
//            }
//        });
//
//        return false;
//}

$(document).on("click", ".playerppsel", function() {
    console.log('.playerppsel click');

    console.log($(this));

    var id = $(this).attr("data-id");       // database unique id for player
    var teamid = $(this).closest('ul.playerlistview').attr("data-teamid");       // team id
    var player = $(this).text();
    if(id == "0") {
        player = "Select Player..."
    }
    console.log("#player_PP_" + teamid);
    $("#player_PP_" + teamid).attr("data-id", id).text(player);
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
            myConfirm('Auto-Approve Confirm', ormsg, oranswer);
        }
//        console.log("the answer " + action + " is " + ans);
    }

    myConfirm('Set Auto-Approve', msg, answer);
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
        "<textarea rows=\"3\" id=\"forfeitreason\" style=\"width:97%\" placeholder=\"Reason for Forfeit (required)\" />" +
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
    myConfirm("Forfeit Match", prompt, answer);
});

/* PANEL MENUS: HOME */
$(document).on('click', "#adminlogin", function() {

    closePanelMenu(this);

    console.log("adminlogin");

    adminpwddialog(function() {
        console.log("adminlogin-success");
    },
    function() {
        console.log("adminlogin-error");
    });
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

/* PANEL MENUS: HOME */
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
    myConfirm("Confirm Switch", prompt, answer);
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
    // return to the start page
//    if(currURL === devURL) {
//        return currURL + DEV_FOLDER;
//    }
//    else {
        return Site.currURL;
//    }
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

function refreshPage() {
    var id = '';
    if(CPage.page == 'enterresults.html') {
        id = "#refreshresults";
    }
}
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
    var button = $(this).hasClass('acceptfinal') ? 'accept' : 'dispute';
    var teamcode = $(this).attr("data-teamid");                             // H-20270
    var hora = teamcode[0];                                                 // H
    var tasks = "#" + $(this).closest('div.eomtasks').attr("id");
    var playfld = "#player_PP_" + teamcode;                                 // player_PP_H-20270
    var pplayer = null;
    var ppname = null;

    var pin = Data.remote.remotepin;
    var otherpin = Data.remoteother.remotepin;
    var remoteid = Data.remote.id;

    if(Teams.my.teamcode != teamcode) {
        pin = Data.remoteother.remotepin;
        otherpin = Data.remote.remotepin;
        remoteid = Data.remoteother.id;
    }

//console.log('pp-' + playfld)    ;
    if($(playfld).length > 0) {
//console.log('pp-2')    ;
        var reqd = $(playfld).parent().data("required");
        pplayer = $(playfld).attr("data-id");
//console.log(pplayer)    ;
        ppname = udc(Players[hora][pplayer]) ? "Not Selected" : $(playfld).text();
        if(reqd == "1" && pplayer == "") {
            myAlert("info", "Select Player Error", "You must select a Players Player");
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

    myConfirm("Confirm", msg, function(answer) {
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
                    finaldata: { pp: pplayer, ppname: ppname, comment: comment, lockupdatetime: lockupdatetime },
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
    $("body").pagecontainer("change", "home.html", {reloadPage:false});
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
//    if($(this).hasClass("cstatus-green")) {
//        ABLY_PRESENCE.leave();
//    }
//    else if($(this).hasClass("cstatus-greendisc")) {
//        ABLY_PRESENCE.enter();
//    }
    var title = $(this).attr("title");
    var notyclass = $(this).attr("data-notyclass");
//// console.log(notyclass + '-' + title);
    var n = $(".noty").noty({
        theme: 'relax',
        layout: "bottom",
        type: notyclass,
        text: title,
        timeout: 1000,
        modal: false,
    });
});

//$(document).on("click", ".admtname", function()
//{
//    var team = $(this).text();
//    var index = parseInt($(this).parent().attr("data-index"));
//    $(this).parent().addClass("selected");
//    var hora = $(this).parent().hasClass("home") ? "H" : "A";
//
//    var pin = Data.draws[index].remote.A.remotepin;
//    var drawid = Data.draws[index].remote.A.drawid;
//    var teamid = Data.draws[index].awayteamid;
////    var device = Data.draws[index].remote.A.remotedeviceid;
////    var finalised = Data.draws[index].remote.A.remotestatusid == "3";
////    var rid = Data.draws[index].remote.A.id;
//    var legendlock = parseInt($(this).attr("data-lock"));   // Data.draws[index].remote.A.legendlock;
//    var hasaccess = $(this).attr("data-access");
//
//    if(hora == "H") {
//        pin = Data.draws[index].remote.H.remotepin;
////        device = Data.draws[index].remote.H.remotedeviceid;
//        teamid = Data.draws[index].hometeamid;
////        finalised = Data.draws[index].remote.H.remotestatusid == "3";
////        rid = Data.draws[index].remote.H.id;
////        legendlock = Data.draws[index].remote.H.legendlock;
//    }
////    console.log(team + ' clicked');
//    var html = '<h4>' + team + '</h4>';
//    $("#selteaname").text(team);
//
//    html += '<p id="selteampin" data-index="' + index + '" data-hora="' + hora + '" data-pin="' + pin + '">PIN: ' + pin;
//    html += '<p><a href="#" data-rel="popup" id="admCreatePin" class="admaction ui-btn clr-btn-blue ui-mini">Create New Pin</a></p>';
//    html += '<p><a href="#" data-rel="popup" id="admResetPassword" data-teamid="' + teamid + '" class="admaction ui-btn clr-btn-cyan ui-mini">Reset Password</a></p>';
//    html += '<p><a href="#" data-rel="popup" id="admUnlockLegend" class="admaction ui-btn clr-btn-yellow ui-mini' +
//            (legendlock == 1 ? '' : ' ui-disabled') + '">Unlock Legend</a></p>';
//    html += '<p><a href="#" data-rel="popup" id="admSwitchAccess" data-drawid="' + drawid + '" class="admaction ui-btn data-pin ' +
//            (hasaccess==1 ? 'clr-btn-red' : 'clr-btn-green') + ' ui-mini">' + (hasaccess==1 ? 'Remove' : 'Assign') + ' Access</a></p>';
//
////    html += '<p><a href="#" data-rel="popup" id="admAcceptResult" data-remoteid="' + rid + '" class="admaction ui-btn clr-btn-green ui-mini' +
////            (finalised ? " ui-disabled" : "") + '">Finalise Match</a></p>';
////    html += '<p><a href="#" data-rel="popup" id="admViewMatch" class="admaction ui-btn clr-btn-green ui-mini">View Match</a></p>';
////    html += '<p><a href="#" data-rel="popup" id="admResetMatch" class="admaction ui-btn clr-btn-red ui-mini">Verify Game Status Data</a></p>';
////    html += '<p><a href="#" data-rel="popup" id="admCopyPinURL" class="urlcopy admaction ui-btn clr-btn-black ui-mini" ' +
////        'data-clipboard-text="' + currURL + '?pin=' + pin + '">Copy Auto-Login URL</a></p>';
////    html += '<p><a href="#" data-rel="popup" id="admCopyTeamURL" class="urlcopy admaction ui-btn clr-btn-black ui-mini" ' +
////        'data-clipboard-text="' + currURL + '?team=' + teamid + '">Copy Team Password Login URL</a></p>';
//
//    $("#teamoptionspanel").empty();
//    $("#teamoptionspanel").append(html);
//
//    $("#teamoptionspanel").panel({beforeclose: function(event, ui) {
//        $(".row").removeClass("selected");
//    }});
//
//    $("#teamoptionspanel").panel("open");
//
//    var clipboard = new Clipboard(".urlcopy");
//
//    //  update dynamic content $( "#teamoptionspanel" ).trigger( "updatelayout" );
//    return false;
//});

//$(document).on("click", ".admtime", function()
//{
//    var team = $(this).parent().find(".admtname").text();
//    var teamid = parseInt($(this).parent().attr("data-teamid"));
//
//    $(this).parent().addClass("selected");
//
//    var captname = 'Not found';
//    var phone = 'Not found';
//    var email = 'Not found';
//
//    var cobj = Data.contacts[teamid];
//    if(cobj != undefined) {
//        captname = cobj.captainname;
//        phone = cobj.phone;
//        email = cobj.email;
//    }
//
//    var info = '<h4>' + team + '</h4>';
//    info += '<p><b>Captain:</b> ' + captname + '</p>';
//    info += '<p><b>Phone:</b> ' + phone + '</p>';
//    info += '<p><b>Email:</b> ' + email + '</p>';
//
//    $("#teaminfopanel").empty();
//    $("#teaminfopanel").append(info);
//
//    $("#teaminfopanel").panel({beforeclose: function(event, ui) {
//        $(".row").removeClass("selected");
//    }});
//
//    $("#teaminfopanel").panel("open");
//
//    //  update dynamic content $( "#teamoptionspanel" ).trigger( "updatelayout" );
//    return false;
//});
//
//$(document).on("click", ".admaction", function() {
//
//    var action = $(this).attr("id");
//
//    var prompt = null;
//    var answer = null;
//    var confirm = true;
//
//    if(action == "admCreatePin") {
//        prompt = "You are about to reset the PIN for this Team, Continue?";
//        answer = function(ans) {
//            if(ans) {
//                $.ajax({
//                    url: apiURL + "createpin",
//                    type: "POST",
//                    dataType: "json",
//                    data: {
//                        action: 'admCreatePin',
//                        pin: $("#selteampin").attr("data-pin"),
//                    },
//                    success: function(data) {
//                        $("#selteampin").attr("data-pin", data.newpin);
//                        var index = parseInt($("#selteampin").attr("data-index"));
//                        if($("#selteampin").attr("data-hora") == "H") {
//                            Data.draws[index].remote.H.remotepin = data.newpin;
//                        }
//                        else {
//                            Data.draws[index].remote.A.remotepin = data.newpin;
//                        }
//
//                        $("#selteampin").text("NEW PIN: " + data.newpin).css("color", "red");
//                    },
//                    error:function(errdata) {
//                        console.log('ERROR');
//                        displayErrMsg('Error', errdata);    //  }
//                    }
//                });
//            }
//            console.log("the answer " + action + " is " + ans);
//        }
//    }
////    else if(action == "admResetDevice") {
////        if($("#seldevice").attr("data-device") == "null") {
////            myAlert("info", "Reset Device", "There is no device to reset");
////            return false;
////        }
////        prompt = "You are about to reset the device id for this Team.  This will disable the current user and allow a new user to connect, Continue?";
////        answer = function(ans) {
////            if(ans) {
////                $.ajax({
////                    url: apiURL + "resetdevice",
////                    type: "POST",
////                    dataType: "json",
////                    data: {
////                        pin: $("#selteampin").attr("data-pin"),
////                    },
////                    success: function(data) {
////                        $("#seldevice").attr("data-device", "null");
////                        var index = parseInt($("#seldevice").attr("data-index"));
////                        if($("#seldevice").attr("data-hora") == "H") {
////                            Data.draws[index].remote.H.remotedeviceid = null;
////                        }
////                        else {
////                            Data.draws[index].remote.A.remotedeviceid = null;
////                        }
////
////                        $("#seldevice").text("Device: not set").css("color", "red");
////                    },
////                    error: function(data) {
////
////                    }
////                });
////            }
////            console.log("the answer " + action + " is " + ans);
////        }
////    }
//    else if(action == "admResetPassword")
//    {
//        var teamid = $(this).attr("data-teamid");
//        var chars = 'ghjklpqrswxz';
//        var vowels = 'aeiou';
//        var numbers = '123456789';
//
//        var char = [];
//        char[0] = chars.charAt(Math.floor(Math.random() * chars.length));
//        char[1] = vowels.charAt(Math.floor(Math.random() * vowels.length));
//        char[2] = chars.charAt(Math.floor(Math.random() * chars.length));
//        char[3] = numbers.charAt(Math.floor(Math.random() * numbers.length));
//        char[4] = numbers.charAt(Math.floor(Math.random() * numbers.length));
//        char[5] = numbers.charAt(Math.floor(Math.random() * numbers.length));
//
//        var temppwd = char.join('');
//
//        prompt = "You are about to Reset the password for this Team, Continue?";
//        answer = function(ans) {
//            if(ans) {
//                var pin = $("#selteampin").attr("data-pin");
//                $.ajax({
//                    url: apiURL + "settemppassword",
//                    data: {
//                        action: 'admResetPassword',
//                        teamid: teamid,
//                        temppwd: temppwd
//                    },
//                    success: function(data) {
//                        if(data.ok == "1") {
//                            myAlert('success','Set Temp Password','Temp password = <b>' + temppwd + '</b>.');
//                        }
//                        else {
//                            myAlert('error','Set Temp Password','Temp password not saved, try again');
//                       }
//                    },
//                    error:function(errdata) {
//                        console.log('ERROR');
//                        displayErrMsg('Error', errdata);    //  }
//                    }
//                });
//            }
//            console.log("the answer " + action + " is " + ans);
//        }
//    }
//    else if(action == "admSwitchAccess") {
//        prompt = "You are about to Switch Access for this match, Continue?";
//        answer = function(ans) {
//            if(ans) {
//                var pin = $("#selteampin").attr("data-pin");
//                var drawid = $("#admSwitchAccess").attr("data-drawid");
//                var swch = switchAccess(drawid);
//            }
//            console.log("the answer " + action + " is " + ans);
//        }
//    }
//    else if(action == "admUnlockLegend") {
//        prompt = "You are about to Unlock the Legend for this Team, Continue?";
//        answer = function(ans) {
//            if(ans) {
//                var pin = $("#selteampin").attr("data-pin");
//                $.ajax({
//                    url: apiURL + "unlocklegend",
//                    type: "POST",
//                    dataType: "json",
//                    data: {
//                        action: 'admUnlockLegend',
//                        pin: pin,
//                    },
//                    success: function(data) {
//                        if(data.locked == "0") {
//                            myAlert('success','Unlock Legend','Legend unlocked successfully. Advise user to log out and log back in again');
//                            var team = $(".row." + h);
//                            $(team).find(".admtname").attr("data-lock", data.locked);
//                        }
//                    },
//                    error:function(errdata) {
//                        console.log('ERROR');
//                        displayErrMsg('Error', errdata);    //  }
//                    }
//                });
//            }
//            console.log("the answer " + action + " is " + ans);
//        }
//    }
//    else if(action == "admAcceptResult") {
//        prompt = "You are about to Finalise the match for this Team.  This will disable access to the match, Continue?";
//        answer = function(ans) {
//            if(ans) {
//                var pin = $("#selteampin").attr("data-pin");
//                var finaldata = { pp: 0, comment: "Finalised by ADMIN"};
//                $.ajax({
//                    url: apiURL + "finalisegame",
//                    data: {
//                        action: 'admAcceptResult',
//                        pin: pin,
//                        remoteid: $("#admAcceptResult").attr("data-remoteid"),
//                        finaldata: finaldata,
//                        button: 'accept'          //accept or dispute
//                    },
//                    success: function(data) {
//                        var fintime = moment().format('D-MM-YYYY H:mm:ss');
//                        var findata = {action: "accept", fintime: fintime, pin: pin, finaldata: finaldata};
////                        "{"action":"accept","pin":"938442","finaldata":{"pp":"0","comment":"\ud83d\udc4c\ud83c\udffc\ud83d\udc76\ud83c\udfff"}}"
//                        console.log(data);
//                        var index = $("#seldevice").attr("data-index");
//                        $("#admAcceptResult").addClass("ui-disabled");
//                        if($("#seldevice").attr("data-hora") == "H") {
//                            Data.draws[index].remote.H.remotestatusid = 3;
//                            Data.draws[index].remote.H.finaldata = JSON.stringify(findata);
//                        }
//                        else {
//                            Data.draws[index].remote.A.remotestatusid = 3;
//                            Data.draws[index].remote.A.finaldata = JSON.stringify(findata);;
//                        }
//                        var score = $("#admin-div").find(".row.selected").find(".admscore").text();
//                        $("#admin-div").find(".row.selected").find(".admscore").text(score + ".F")
//                        $("#seldevice").text("Device: not set").css("color", "red");
//                    },
//                    error:function(errdata) {
//                        console.log('ERROR');
//                        displayErrMsg('Error', errdata);    //  }
//                    }
//                });
//            }
//            console.log("the answer " + action + " is " + ans);
//        }
//    }
//    else if(action == "admViewMatch") {
//
//    }
//    else if(action == "admResetMatch") {
//        answer = function(ans) {
//            if(ans) {
//
//            }
//            console.log("the answer to " + action + " is " + ans);
//        }
//    }
//    else if(action == "admCopyPinURL") {
//        confirm = false;
//        prompt = "Auto Login URL Copied!"
//    }
//    else if(action == "admCopyTeamURL") {
//        confirm = false;
//        prompt = "Team Password Login URL Copied!"
//    }
//    if(confirm) {
//        myConfirm("Confirm", prompt, answer);
//    }
//    else {
//        myAlert("success", "Copy URL", prompt);
//    }
//});

function switchAccess(drawid, callback)
{
    return $.ajax({
        url: apiURL + "switchaccess",
        type: "POST",
        dataType: "json",
        data: {
            action: 'switchAccess',
            drawid: drawid
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

        myConfirm("Confirm", msg, function(answer) {
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

$(document).on("click", ".favorg", function() {
    window.event.stopPropagation();
//    if (!e) var e = window.event;
//    e.cancelBubble = true;
//    if (e.stopPropagation) e.stopPropagation();
    console.log('favorg');
    return false;
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

    if($(obj).hasClass('selteam')) {
        if($(obj).hasClass('matchwait') || $(obj).hasClass('matchactive')) {
            return false;
        }
    }

    if($(obj).find(".nomatch").hasClass("hidden") || CPage.page == 'home.html') {

        var drawid = $(obj).attr("data-drawid");
    //console.log("clicked " + drawid + " " + $.now());

        // only show scoresheet if match is Active, or is Done
        var showscoresheet = $(obj).hasClass("matchactive") || $(obj).hasClass("matchdone");

        if(showscoresheet) {

            CPage.ltype = LOGIN_VIEWONLY;
            CPage.param = 'readOnly';
            CPage.drawid = drawid;

            var compid = $(this).closest('div.activematchset').attr('data-compid');
            var seldate = $("#matchdate").attr('data-seldate');

            CPage.refresh = !$(obj).hasClass("matchdone");

            localStorage.setItem('lastview', JSON.stringify({seldate: seldate, compid: compid }));

            $.mobile.changePage('enterresults.html');
        //        displayEnterResults(LOGIN_VIEWONLY, drawid);
        }
        else {

            var cclass = "matchnone";
            var calert = "nomatchalert2";

            if($(obj).hasClass("matchwait")) {
                cclass = "matchwait";
            }
            else if($(obj).hasClass("matchpend")) {
                cclass = "matchpend";
                calert = "nomatchalert";
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
    }
});

$(document).on("click", ".favourite", function() {
    console.log('select fav');
    return false;
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

/***** PAGE: HOME *****/

function Player()
{
    this.id = 0;
    this.teamid = 0;
    this.fullname = "";         // first name + surname
    this.origfullname = null,     // if player exists, is set to database name
    this.shortname = "",        // first name initial + surname
    this.fshortname = "",       // first name + surname initial
    this.initials = "",         // first name initial, surname initial
    this.firstname = "";
    this.lastname = "";

    this.rank = 0;
    this.origrank = 0;
    this.new = 1;
    this.status =  1;
    this.type = 1;
    this.show = 0;
    this.temp = 0;

    this.pos = -1;
    this.code = '?';
    this.legendcode = null;     // full code: HA100, AAA00
    this.framesplayed = 0;
    this.frameswon = 0;
//    this.mbreak = 0;
//    this.mshot = 0;
}

if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

var LegendInfo = function() {
    var code = "-";
    var pos = 0;
    var gbcode = "none";
    var hora = "H";
    var playerid = 8377;
    var showcode = '?';
}

window.addEventListener('error', function (e)
{
    loaderhide();     // hide the loader if it is visible

//    var checkURL = $(location).attr('origin') + "/";     // ie: "https:/livescoretest.poolstat.net.au/"

//    var baseurl = "https://www.poolstat.net.au/";
//
//    if(checkURL.indexOf("poolstat-local") > -1) {
//        baseurl = "https://poolstat-local/"
//    }
//    else if(checkURL.indexOf("test.poolstat") > -1) {   //livescoretest, lsviewtest & test
//        baseurl = "https://test.poolstat.net.au/"
//    }
//    else if(checkURL.indexOf("poolstat.uk") > -1) {   //livescoretest, lsviewtest & test
//        baseurl = "https://www.poolstat.uk/"
//    }

    var message = e.error.toString();
    var stack = e.error.stack;

    console.log('ERROR: in ' + e.filename + ' (' + e.lineno + ')');
    console.log(message);
    console.log(e);

    alert(message + '\nApp will reload');

    if (stack) {
        message += '\n' + stack;
    }

    if(isset(apiURL)) {

        var errdata = {
            action: 'errlog',
            msg: message,
            stack: stack,
            datetime: moment().format("Y-MM-DD H:mm:ss"),
            filename: e.filename,
            lineno: e.lineno,
            lsversion: jsVersion(),
            useragent: navigator.userAgent,
            lsdata: (udc(Data) ? {0: 'no-data'} : Data)
        };

        var errlog = logError(errdata);

        errlog.done(function(data) {
            console.log("*** logged OK ***");
            console.log(data);

            reloadSite();
        });

        errlog.error(function(error) {
            console.log('*** logging failed ***');
            console.log(error);
        });
    }
});

function logError(errdata) {
    return $.ajax({
        url: apiURL + 'errlog',
        data: errdata
    });
}

/* PHONE SLEEP */
$(window).blur(function() {
    if(isAppInForeground === true) {
//        $("#msgs").append('<p>' + "Sleep at " + moment().format("HH:mm:ss") + '</p>');
        updateLocalActivity(10,'<p>' + "Sleep at " + moment().format("HH:mm:ss") + '</p>');

        CPage.scrollpos = $(window).scrollTop();
        CPage.save();
//        console.log(cpage);
    }
    isAppInForeground = false;
});

/* PHONE AWAKE */
$(window).focus(function() {
    if(isAppInForeground === false) {
//        $("#msgs").append('<p>' + "Awake at " + moment().format("HH:mm:ss") + '</p>');
        updateLocalActivity(11,'<p>' + "Awake at " + moment().format("HH:mm:ss") + '</p>');
    }
    isAppInForeground = true;
});

function updateLocalActivity(cls, msg) {
    var data = localStorage.getItem("poolstat.activity");
    var temp = [];
    if(data !== null) {
        temp = JSON.parse(data);
    }
    if(isset(CURR_TEAM)) {
        // create a new entry
        var newrow = {'datetime': parseInt($.now()/100), 'team':CURR_TEAM, 'class':cls, 'msg': msg};
        // append it to the array
        temp.push(newrow);
        // convert the array to string
        data = JSON.stringify(temp);
        // add the activity to the localStorage
        localStorage.setItem("poolstat.activity", data);
    }
}

function jsVersion() {
    var ver = 'data-appversion="2.1.78"';
    var myver = ver.split('"');
    return myver[1];
}

function setFooter(footer) {
    SS.pageName = $("#" + footer).attr('data-pagename');
    SS.pageVersion = $("#" + footer).attr('data-appversion');
    SS.libVersion = jsVersion();
    SS.dbVersion = Version.appVersion;
    $("#" + footer).html("PoolStat LS &copy - v" + SS.getVersion());
    console.log(footer);
    console.log(SS);
//    getClientList();
}

var RMS_READY = 1;
//var RMS_AWAIT_SETWINNER = 2;
var RMS_INPROGRESS = 2;
//var RMS_SETWINNER = 4;
var RMS_COMPLETED = 8;
//var RMS_UNLOCK = 16;
var RMS_ABANDONED = 32;
//var RMS_AWAIT_UNLOCK = 32;

function getMatchNEW(updata, success_handler, error_handler)
{
    return $.ajax({
        url: apiURL + 'getmatchnew',
        data: updata,
        success: success_handler,
        error: error_handler
    });
}

//function getMatch(pin)
//{
//    var data = {
////        device: DEVICE_ID,
//        pin: pin,
//        logintype: Settings.logintype
//    }
//
//    return $.ajax({
//        url: apiURL + 'getmatch',
//        type: "POST",
//        dataType: "json",
//        data: data,
//    });
//}
//
//function getMatchFromTeam(teamid, password)
//{
//    console.log('getMatchFromTeam');
//    console.log(teamid);
//    console.log(password);
//
//    //pvalue = password, loads the home page if password is validated
//    data = {
////        device: DEVICE_ID,
//        teampassword: password,
//        teamid: teamid,
//        currdate: gettoday()
//    }
//
//    return $.ajax({
//        url: apiURL + 'getmatchfromteam',
//        type: "POST",
//        dataType: "json",
//        data: data,
//    });
//}
//
//function getMatchFromTeamPin(pin)
//{
//    console.log('getMatchFromTeamPin');
//    console.log(pin);
//
//    //pvalue = password, loads the home page if password is validated
//    data = {
//        pin: pin,
//    }
//
//    return $.ajax({
//        url: apiURL + 'getmatchfromteampin',
//        type: "POST",
//        dataType: "json",
//        data: data,
//    });
//}
//
//// multi match team password UNLIKELY TO BE USED
//function getMatchFromRemote(remote)
//{
//    console.log('getMatchFromRemoteId');
//    console.log(remote);
//
//    //pvalue = password, loads the home page if password is validated
//    data = {
////        device: DEVICE_ID,
//        remoteid: remote,
//        teamid: Data.myteam,
//    }
//
//    return $.ajax({
//        url: apiURL + 'getmatchfromremote',
//        type: "POST",
//        dataType: "json",
//        data: data,
//    });
//}

//function getMatchFromDevice()
//{
//    var data = {
//        deviceid: DEVICE_ID,
//    }
//
//    return $.ajax({
//        url: apiURL + 'getmatchfromdevice',
//        type: "POST",
//        dataType: "json",
//        data: data,
//    });
//}

// admin login
function getMatchesForComp(comp, adminpassword)
{
    var data = {
//        device: DEVICE_ID,
        action: 'getMatchesForComp',
        comp: comp,
        adminpwd: adminpassword
    }

    return $.ajax({
        url: apiURL + 'getmatchesfromcomp',
        data: data,
    });
}

function updateShowCodes()
{

    $.each(Legend, function(tcode, legdata)
    {
        var codeIsNumber = false;
        var codeString = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        var lorder = Data.msheet[1].Legend.attributes.homeorder;
        if(Teams.away.teamcode == tcode) {
            lorder = Data.msheet[1].Legend.attributes.awayorder;
        }

        codeIsNumber = isNaN(parseInt(lorder[0]))

        $.each(legdata, function(pos, obj) {
            if(parseInt(obj.playerid) > 0) {
                if(codeIsNumber === false && isNaN(parseInt(obj.code))) {
                    Legend[tcode][pos].showcode = (codeString.indexOf(obj.code) + 1).toString();
                }
                else {
                    Legend[tcode][pos].showcode = obj.code;
                }
            }
            else {
                Legend[tcode][pos].showcode = '-';
            }
        });
    });
}

function getShowCode(teamcode, code, block) {

    var hora = teamcode[0] == 'H' ? 'home' : 'away';

    var codeisnum = !isNaN(parseInt(Legend[teamcode][0].code));
    if(block > 1) {
        codeisnum = Data.gameblocks[block][hora].codeisnum;
    }

//    console.log('getShowCode(' + teamcode + ', ' + code + ', ' + block + ': ' + (codeisnum ? 'true' : 'false') + ')');

    var vcode = code;
    if(codeisnum) {
        if(isset(LegendCodes[teamcode][code])) {
            vcode = LegendCodes[teamcode][code].showcode;
//            console.log('code converted to ' + vcode)
        }
    }

    return vcode;
}

//function getTeamLoginPage(data)
//{
//    $("#currteam").attr("data-team", data.teamid);
//
//    $(".indexteamname").text("My Team: " + data.myteamname);
//    $("#getpinform").hide();
//    $("#getteamloginform").show();
//    $("#getadminloginform").hide();
//}

function populateHomePage(ptype, pvalue)
{
    var pinexists = false;

    if(isset(Data)) {
        if(isset(Data.remote)) {
            if(isset(Data.remote.remotepin)) {
                pinexists = Data.remote.remotepin == pvalue;
            }
        }
    }

    console.log('populateHomePage("' + ptype + '", "' + pvalue + '")');

    var reload = false;

    Settings.logintype = 0;

    if(!pinexists)
    {
        var data = {
            action: 'populateHomePage',
            userip: Settings.userip,
            userAgent: CID.userAgent,
            uuid: CID.uuid,
            logintype: LOGIN_NONE,
            drawid: null,
            teamid: null,
            remid: null,
            pinorpwd: null,
        };

        if(ptype == "pin") {
            Settings.logintype = LOGIN_MATCHPIN;
            data.pinorpwd = pvalue;
        }
        else if(ptype == "teampin") {       // team
            Settings.logintype = LOGIN_TEAMPIN;
            data.pinorpwd = pvalue;
        }
        else if(ptype == "token") {       // team
            Settings.logintype = LOGIN_TOKEN;
            data.remid = pvalue;
        }

        data.logintype = Settings.logintype;

        getMatchNEW(data, function(retdata) {

            if($(".teampinbtncancel").length > 0) {
                $(".teampinbtncancel").trigger('click');
                console.log("teampinbtncancel.click");
            }

            Data = {};

            console.log('Data received');

            console.log(retdata);

            saveTokenLocal(retdata, LSTR_JWTTOKEN);

            loaderhide();

            if(isset(retdata.error)) {
                if(retdata.error.id != 41) {
                    myAlert("error", "Submit Error", retdata.error.text);
                }
                return false;
            }

            Data = retdata;

            // add new fields for subcount
            Data.hometeam.subcount = 0;
            Data.awayteam.subcount = 0;

            Teams = new TeamsData();

            CID.deviceid = Data.deviceid;

            setAutoApproveText();

            if(ptype == "pin") {
                $("#currpin").attr("data-pin", pin);
            }

            tokenDetails = Data.tokenDetails;

            var autolegend = initPlayerList();

            initGBCodes();

            LegendSaveCount();

            if(autolegend && Teams.myistwa) {   //Data.remote.hasaccess === "1"
                saveAutoLegend();
            }

            $("#hmoptions").popup();

            if(reload) {
                console.log("Reload Home Page");
                refreshPage();
            }
            else {

                var matchcount = 0;

                if(typeof Data.multidraws !== 'undefined' && (Settings.logintype === LOGIN_TEAMPWD || Settings.logintype === LOGIN_TEAMPIN))
                {
                    var dcount = 0;
                    $.each(Data.multidraws, function(k,o) {
                        console.log(o);
                        dcount++;
                    });

                    if(dcount > 0) {        // show dropdown

                        $.each(Data.multidraws, function(drawid, matches)
                        {
                            var mt = matches.times; // mtimes[drawid];

                        // console.log('Now: ' + mt.nowtimeshow + ' Act: ' + mt.activatetimeshow + ' Str: ' + mt.starttimeshow + ' DAc: ' + mt.deactivatetimeshow);

//                        console.log('Now after activate? ' + (mt.nowtime > mt.activatetime ? 'YES' : 'no'));
//                        console.log('Now before deactivate? ' + (mt.nowtime < mt.deactivatetime ? 'YES' : 'no'));

                            if(mt.isactive == 1) {
//                                        if(mt.nowtime >= mt.activatetime && mt.nowtime <= mt.deactivatetime) {
                                console.log('MATCH ' + drawid + " IS ACTIVE");
                                matchcount++;
                                // if match is not finalised by either party then it becomes the selected match
                            }
                            else {
                                console.log('MATCH ' + drawid + ' IS "NOT" ACTIVE');
                            }
                        });
                    }

                    if(matchcount === 0) {

                        myAlert("error", "No Matches", "<p>There are no active matches for your Team</p><p>Please try again later...</p>",
                        function() {
                            Settings.clear();
                            logoff(Data.remote.id, function() { window.location = getRootURL(); });
                        });
                    }
                    else {
                        $.mobile.changePage('home.html');

                    }
                }

                else {

                    $.mobile.changePage('home.html');
                }
            }
        },
        function(errdata) {
            console.log("ERROR");
            console.log(errdata);

            displayErrMsg('Access denied!', errdata, function() {
                localStorage.removeItem(LSTR_JWTTOKEN);
//                    reloadSite();
            });

            return false;
        });
    }
    else {
        initLandingPage('none', 'null');
    }
}

function udc(obj) {
    return typeof obj === 'undefined';
}

function isset(obj) {

    return typeof obj != 'undefined';
}

function isEven(n) {
  n = Number(n);
  return n === 0 || !!(n && !(n%2));
}


function updateSequence(seqdata, gbcode, viewonly) {

    viewonly = udc(viewonly) ? false : viewonly;

    console.log('updateSequence');

    var p1 = GBCodes[gbcode];
    var p2 = GBCodes[p1.opponent];

    var p1frames = parseInt(p1.remotedata.framecount);
    var p2frames = parseInt(p2.remotedata.framecount);

    var maxframes = GBCodes[gbcode].gbcode.maxframes;
    var racetomax = GBCodes[gbcode].gbcode.isracetomax;

    var winframes = 0;
    var playedframes = 0;
    var matchcomplete = false;

    var hasbreak = null;

    winframes = maxframes;
    var winside = 'home';

    // check if match completed
    if(racetomax === RTM_PLAYALLMAXFRAMES) {
        playedframes = p1frames + p2frames;
        matchcomplete = playedframes === winframes;
        winside = p1frames > winframes ? 'home' : (p2frames > winframes) ? 'away' : 'none';
    }
    else if(racetomax === RTM_BESTOFMAXFRAMES) {
        winframes = parseInt((maxframes + 1) / 2);
        matchcomplete = p1frames === winframes || p2frames === winframes;
        winside = p1frames === winframes ? 'home' : 'away';
    }
    else if(racetomax === RTM_RACETOMAXFRAMES) {
        matchcomplete = p1frames === winframes || p2frames === winframes;
        winside = p1frames === winframes ? 'home' : 'away';
    }

    var seq = [];

    if(seqdata !== null) {
        var seq = JSON.parse(seqdata);
    }

    // set break
    if(isEven(seq.length)) {
        hasbreak = p1.break == "B" ? 'home' : 'away';
    }
    else  {
        hasbreak = p1.break == "B" ? 'away' : 'home';
    }

    var lastitem = null;
    var shtml = '';

    var i = 0;
    var litem = "";

    $.each(seq, function(k, obj) {
        var hora = obj[0];
        var horacolor = SEQ_BTN_HOME; // blue
        if(hora == "A") {
            horacolor = SEQ_BTN_AWAY;    // red
        }
        var win = obj[1] === "W" ? "&nbsp;" : obj[1];
        if(i === seq.length - 1) {
            lastitem = obj[0] == 'H' ? 'home' : 'away';
            litem = " last";
        }
        shtml += '<div class="res-btn clr-bg-' + horacolor + litem + '">' + win + '</div>';
        i++;
    });

    $("#seqitems_" + gbcode).html(shtml);
    var parent = $("#seqitems_" + gbcode).closest('div.scorecontainer');
    $(parent).find(".mfscorebox").removeClass("break");
    if(matchcomplete) {
        if(p1.remotedata.resultstatus != '8') {

            $(parent).find(".finishrow").removeClass('home away none');
            $(parent).find(".finishrow").addClass(winside);
            if(!viewonly) {
                $(parent).find(".finishrow").removeClass('hidden');
            }
        }

        $(parent).find(".advres").addClass('ui-disabled');
        $(parent).find(".moremenu").addClass('hidden');

    }
    else {
        $(parent).find(".mfscorebox." + hasbreak).addClass("break");
        $(parent).find(".advres").removeClass('ui-disabled');
        $(parent).find(".finishrow").addClass('hidden');
        $(parent).find(".moremenu").removeClass('hidden');
        $(parent).find(".advres.undo").addClass('ui-disabled');

    }

    $(parent).find(".advres.undo." + lastitem).removeClass('ui-disabled');

    console.log('updateSequence::END');
}

function displayErrMsg(errtitle, data, msgcallback) {

    var msg = '';
    var category = 0;

    console.log('===> displayErrMsg <===');
    console.log(data);

    if(isset(data.tokenstatus) && isset(data.payload)) {

        category = 1;
        errtitle = data.statusText;
        msg = data.reason;
        msgcallback = function() { reloadSite(); }
    }
    else if(isset(data.responseJSON)) {

        if(isset(data.responseJSON.tokenstatus) && isset(data.responseJSON.payload)) {

            category = 2;
            errtitle = data.status + ': ' + data.statusText;
            msg = data.responseJSON.reason;
            msgcallback = function() { reloadSite(); }
        }
        else {
            category = 3;
            $.each(data.responseJSON.error, function(k, err) {
                if(err.id == 321) {
                    errtitle = "Site Error";
                    var url = err.text;
                    msg = '<p>Wrong Site. Click <b>OK</b> to go to</p><p>' + url + '</p>';
                    msgcallback = function() { window.location.replace(url); }
                }
                else {
                    msg += '<p>E-' + err.id + ': ' + err.text + '</p>';
                    // err 11 = twa team tried to update info for twla but has no control
                    if(k === 0 && err.id == 11) {
                        msgcallback = function() { populateHomePage("token", myJWT.remoteid); };
                    }
                }
            });
        }
    }
    else if(isset(data.responseText)) {
//console.log('errtext found');
        msg = data.responseText;
        if(data.responseText == "") {
            category = 4;
            errtitle = "System Error";
            msg = '<p>E-500: A Server Error occurred.</p><p>Contact Support</p>';
        }
    }
    else {
console.log('format not found');

    }

console.log('error category: ' + category);

    myAlert('error', errtitle, msg, msgcallback);
}

function lockPlayersDialog(team) {

    getSavedLegend(team.teamcode);

    var maxstats = getMaxStats();

    var teamistwla = 0;

    // twa will always have hasaccess = 1
    if(Teams.my.data.hasaccess == "1") {
        if(Teams.my.teamid != team.teamid) {
            teamistwla = 1;
        }
    }

    if((team.selplayers - team.subcount) < maxstats) {
        myAlert('warning', 'Not enough players', '<p>You have only selected ' + team.selplayers + ' players</p><p>You must select at least ' + maxstats + ' players.</p>');
        return false;
    }

    myConfirm('Confirm Players/Subs', '<div style="font-size:1.5em;">' + team.shortname + '</div><p>You have selected ' + team.selplayers + ' players for this match:</p><ul><li>' +
            (team.selplayers - team.subcount) + ' starting players</li><li>' + team.subcount + ' subs</li></ul>' +
        '<p>If you continue...<p/><p><span style="font-weight:bold;color:red;">PLAYERS CANNOT BE CHANGED!</span></p>' +
        '<p>Click <b>Yes</b> to continue</p>',
        function(answer) {
            if(answer) {
                $.ajax({
                    url: apiURL + 'locklegend',
                    data: {
                        action: 'Confirm Player/Subs',
                        remid: team.data.id,
                        drawid: Data.draw.id,
                        teamistwla: teamistwla
                    },
                    success:function(data) {
                        console.log('locklegend:SUCCESS');
                        console.log(data);
                        if(typeof data.error != 'undefined') {
                            myAlert('error', data.error.text);
                            return false;
                        }
                        else {
                            team.data.legendlock = parseInt(data[team.data.id].legendlock);
                            if(team.teamid == Teams.other.teamid) {
                                Data.remoteother.hasaccess = parseInt(data[Data.remoteother.id].legendlock);
//                                Teams.other.data.legendlock = parseInt(data[Teams.other.data.id].legendlock);
                            }
                            else {
                                Data.remote.hasaccess = parseInt(data[Data.remote.id].legendlock);
//                                Teams.my.data.legendlock = parseInt(data[Teams.my.data.id].legendlock);
                            }
                            Teams.getStage();
                            // both teams locked! match is ready

console.log('MyTeam-locked:    ' + Teams.my.data.legendlock);
console.log('OtherTeam-locked: ' + Teams.other.data.legendlock);

                            if(Teams.my.data.legendlock == 1 && Teams.other.data.legendlock == 1) {
                                var msg = '<p style="text-align:center">All Players Locked<p><p style="text-align:center"><b>MATCH IS READY!</b></p>';
                                showNoty(msg, 'success', 'center', 0);
                            }
                        }
                    },
                    error:function(errdata) {
                        console.log('ERROR');
                        displayErrMsg('Access Denied', errdata);    //  }
                    }
                })
            }
        }
    );
}

function saveTokenLocal(retdata, jwt) {

    console.log('saveTokenLocal');

    // check for jwtToken and if found store locally
    if(isset(retdata.token))
    {
        console.log('token found');
        if(localStorage.getItem(jwt) === null) {
            console.log('Saving Token "' + jwt + '" to localStorage');
            localStorage.setItem(jwt, retdata.token);
            if(jwt == LSTR_JWTTOKEN) {
                myJWT = new JWT(jwt);
            }
            else {
                othJWT = new JWT(jwt);
            }
        }

        // if other team token exists, delete from localStorage and clear variable
//        if(localStorage.getItem(LSTR_JWTTOKENOTHER) !== null) {
//            localStorage.removeItem(LSTR_JWTOKENOTHER);
//            othJWT = new JWT(LSTR_JWTTOKENOTHER);
//        }
//                var parts = retdata.jwtToken.split(".");
    }
}

function populateAdminPage(comp, password)
{
    $(document).prop('title', 'test');


    var result = getMatchesForComp(comp, password);
//    var horas;

    result.done(function(data) {

        Data = data;

        $("#hmoptions").popup();

        $.mobile.changePage('admin.html');

        loaderhide();
    });
}

function loadershow() {
    $(".ui-loader").show();
}

function loaderhide() {
    $(".ui-loader").hide();
}
/* PLAYER PROPERTIES
id
teamid
fullname
origfullname
firstname
lastname = surname
rank = rank
new
status            // 1 = Active, 2 = Disabled
type              // 1 = Player, 2 = Forfeit, 3 = Abandoned
pos
legendcode
*/

function initPlayerList()
{
    Players = {};
//    var teamid = Data.players.teamid;

    var presetlegend = false;

    $.each(['H','A'], function(k, hora) {

        $.each(Data.players[hora], function(id, obj) {

            var shortname = trim(obj.firstname[0] + "." + obj.lastname);      // G.Smith (0)
            var fshortname = trim(obj.firstname + " " + (obj.lastname.length > 1 ? obj.lastname[0] : obj.lastname));     // Geoff S (1)
            var initials = (trim(obj.firstname).length > 0 ? obj.firstname[0] : "") + (trim(obj.lastname).length > 0 ? obj.lastname[0] : "");          // GS

    //        if(Data.config.playernameformat == 1) {
    //            shortname = trim(obj.firstname + " " + (obj.lastname.length > 0 ? obj.lastname[0] : ""));
    //        }

            if(Data.config.playerabbrev == 1) {
                shortname = fshortname;
            }

            if(obj.new == 1) {
                var parts = obj.fullname.split(" ");
                if(parts.length > 1) {
                    shortname = parts[0].substr(0,1);
                    parts.shift();
                    shortname += "." + parts.join(" ");
                }
                else if(parts.length == 1) {
                  shortname = obj.fullname;
                }
            }

            // legend code for each player is the list of legend codes for their team ie ABCDEFG, 12345678
            var lcode = obj.legendcode;
            if(Data.remote.legendsave === 0 && Data.remoteother.legendsave === 0) {
    //            console.log(obj);
                if(obj.pos > -1 && obj.legendcode !== null && obj.legendcode.length > 1) {
                    presetlegend = true;
                    lcode = (Teams.my.teamid === obj.teamid ? Teams.my.teamid : Teams.other.teamid) +
                        obj.legendcode.substr(obj.pos, 1) + obj.pos;
                    console.log(obj.pos + ' = ' + lcode);
                }
            }

            var np = new Player();

            np.id = obj.id;
            np.teamid = obj.teamid;
            np.fullname = obj.fullname;
            np.origfullname = obj.origfullname;
            np.shortname = shortname;
            np.fshortname = fshortname;
            np.initials = initials;
            np.firstname = obj.firstname;
            np.lastname = obj.lastname;
            np.rank = obj.rank;
            np.origrank = obj.origrank;
            np.new = obj.new;
            np.status = obj.status;
            np.type = obj.type;
            np.pos = obj.pos;
            np.legendcode = lcode;

    //console.log(np);

            if(obj.type === 3) {
                if(obj.fullname[0] == 'F') {
                    np.code = 'f';
                }
                else {
                    np.code = 'a';
                }
            }

            if(Data.Version === '5')
            {
                if(trim(obj.legendcode).length > 2) {
                    lcode = LegendCode(obj.legendcode);
                    np.code = lcode.code;
                    np.legendcode = obj.legendcode;
                }

                if(Teams.my.team == hora) {
                    Teams.my.players[obj.id] = np;
                    if(np.type === 3) {
                        Teams.my.sublist[obj.id] = { id: obj.id, show: 0 };
                    }
                    else if(obj.pos > -1) {
    //                    Teams.my.sublist[obj.pos] = { id: obj.id, show: 0 };
                        Teams.my.sublist[obj.id] = { id: obj.id, show: 0 };
                    }
                }
                else {
                    Teams.other.players[obj.id] = np;
                    if(np.type === 3) {
                        Teams.other.sublist[obj.id] = { id: obj.id, show: 0 };
                    }
                    else if(obj.pos > -1) {
    //                    Teams.other.sublist[obj.pos] = { id: obj.id, show: 0 };
                        Teams.other.sublist[obj.id] = { id: obj.id, show: 0 };
                    }

                }
            }

            if(udc(Players[hora])) {
                Players[hora] = {};
            }
            Players[hora][obj.id] = np;

        });
    });

    console.log('Players');
    console.log(Players);

    return presetlegend;
}

function trim(val) {
    if(typeof val === 'object') {
        if(val === null) {
            return "";
        }
        return val.toString();
    }
    else if(typeof val === 'undefined') {
        return "";
   }
   return $.trim(val);
}

function GBCode(data, gbcode)
{
//    console.debug(data, gbcode);

    this.id = 0;
    this.blockno = data.blockno;
    this.code = data.code;
    this.gbcode = gbcode;
    this.gcode = data.gcode;
    this.hora = data.gcode[0];
    this.name = data.name;
    this.playerid = data.playerid;
    this.playercode = typeof Players[data.playerid] === 'undefined' ? 0 : Players[data.playerid].code;
    this.rank = data.rank;
    this.recid = parseInt(data.remotedata.id);
    this.remotedata = data.remotedata;
    this.row = data.row;

    if(gbcode.type !== 'L')
    {
        this.break = data.break;
        this.disabled = data.disabled;
        this.hashtag = data.hashtag;
        this.id = data.playerid;
        this.mstatus = data.mstatus;
        this.opponent = data.opponent;
        this.partner = data.partner;
        this.points = data.points;
        this.won = data.won;
//        this.maxframes = parseInt(gbcode.maxframes);
//        this.isracetomax = parseInt(gbcode.isracetomax);
//        this.ismultiframe = this.gbcode.maxframes > 1;
    }
}

function initGBCodes()
{
    console.log('initGBCodes');

    GBCodes = {};
    Legend = {};
    LegendCodes = {};
    MatchSheet = {};

//    var teams = new Teams();
    $.each(Data.msheet, function(blockno, gblock) {       // pos = 1-n, gblock = Legend, Stats etc

        $.each(gblock, function(label, results) {     // label = Legend, Stats - Results = attributes & rows

            Blocks[blockno] = {
                label: label,
                description: results.attributes.label,
                maxpoints: results.attributes.maxpoints,
                minpoints: results.attributes.minpoints,
                disabled: results.attributes.disabled,
                mysublocked: 0,
                othersublocked: 0
            };

            if(label=="Legend") {
                Data.config.hasrankings = results.attributes.maxpoints;
            }
            var gbCode = results.attributes.gbcode;           // Object { pos: 2, type: "S", playersperside: "1", maxframes: "1", isracetomax: "0" }

            $.each(results.rows, function(row, gcodes) {      // poscode = AA0, HA0 etc
//                console.log(gcodes);
//                console.log('DATA');
                $.each(gcodes, function(gcode, data) {
//                    console.log(data);
                    var teamcode = Teams.my.teamcode;

                    if(label=="Legend") {

                        var lcode = LegendCode(gcode);  // ie: HA20 --> { hora: "H", code: "A", pos: 20, gbcode: "HA20", playerid: 0 }
//console.log(lcode);
                        if(lcode.hora == Teams.my.team)
                        {
                            var tmpcode = Legend[teamcode] === undefined ? {} : Legend[teamcode];

                            tmpcode[lcode.pos] = {};
                            Legend[teamcode] = {};

                            lcode.playerid = data.playerid;

                            tmpcode[lcode.pos] = lcode;
                            Legend[teamcode] = tmpcode;

                            var tmpcode = LegendCodes[teamcode] === undefined ? {} : LegendCodes[teamcode];

                            tmpcode[lcode.code] = {};
                            LegendCodes[teamcode] = {};

                            tmpcode[lcode.code] = lcode;
                            LegendCodes[teamcode] = tmpcode;
                        }
                        else {
                            teamcode = Teams.other.teamcode;

                            var tmpcode = Legend[teamcode] === undefined ? {} : Legend[teamcode];

                            tmpcode[lcode.pos] = {};
                            Legend[teamcode] = {};

                            lcode.playerid = data.playerid;

                            tmpcode[lcode.pos] = lcode;
                            Legend[teamcode] = tmpcode;

                            var tmpcode = LegendCodes[teamcode] === undefined ? {} : LegendCodes[teamcode];

                            tmpcode[lcode.code] = {};
                            LegendCodes[teamcode] = {};

                            tmpcode[lcode.code] = lcode;
                            LegendCodes[teamcode] = tmpcode;
                        }

                        // update player properties
                        if(typeof Players[data.playerid] !== 'undefined') {
                            Players[data.playerid].legendcode = Legend[teamcode][lcode.pos].gbcode;
                            Players[data.playerid].code = Legend[teamcode][lcode.pos].code;
                        }
                    }

                    if(data.remotedata.sublocked == "1") {
//                        var blockno = data.remotedata.blockno;
                        if(data.remotedata.gbcode.substring(0,1) == Teams.my.team) {
                            Blocks[blockno].mysublocked++;
                        }
                        else {
                            Blocks[blockno].othersublocked++;
                        }
                    }

                    data.blockno = blockno;
                    data.row = row;
                    data.gcode = gcode;

                    updateShowCodes();

                    GBCodes[gcode] = new GBCode(data, gbCode);

                    updateSpots(blockno, data.code, GBCodes[gcode]);

//                    var newdata = data;
//                    newdata.gbcode = gbCode;
                    updateMatchsheet(gcode, GBCodes[gcode]);       // update "pos" value for block

                });
            });
        })
    });
}

function updateSpots(blockno, code, data)
{
    var hora = data.gcode[0];
    if(udc(Spots[blockno])) {
        Spots[blockno] = {};
    }
    if(udc(Spots[blockno][hora])) {
        Spots[blockno][hora] = {};
    }
    // Spots - block - HorA - 'A' = HA20
    if(isset(Data.gameblocks[blockno])) {
        if(Data.gameblocks[blockno].prevblock > 0) {        // if no previous block, get all legend
            Spots[blockno][hora][code] = data;
        }
    }
    else {
        Spots[blockno][hora][code] = data;
    }
}

function displayFinaliseMatch()
{
    var data = {
        action: 'displayFinaliseMatch',
        remid: (CURR_TEAM == Teams.my.teamcode ? Data.remote.id : Data.remoteother.id),
        remotherid: (CURR_TEAM == Teams.other.teamcode ? Data.remote.id : Data.remoteother.id),
    };
console.log(data);

    FinLockUpdateTime = 0;

    if(CURR_TEAM === Teams.twla.teamcode && getLastResultUpdateSecs() < 1) {
        getLastUpdateTime(true);
        console.log('FinLockUpdateTime: ' + FinLockUpdateTime);
    }

    $.ajax({
        url: apiURL + 'getfinalisestatus',
        data: data,
        success: function(retdata) {

console.log(retdata);

            Teams.twa.data.remotestatusid = retdata.remote.remotestatusid;
            Teams.twla.data.remotestatusid = retdata.remoteother.remotestatusid;

            Data.lastresultupdate = parseInt(retdata.lastresultupdate);

            if(Data.remote.remotestatusid === "3" && Data.remoteother.remotestatusid === "3") {
                myAlert('warning', 'Access Denied', 'Both teams have finalised, nothing to do');
                return false;
            }
            else {
                if(!Teams.myistwa) {              // not the team in control      Data.remote.hasaccess != "1"
                    if(Teams.other.data.remotestatusid == "3") {
                        displayFinaliseMatchOK();
                    }
                    else if(Teams.other.data.remotestatusid != "3" && getLastResultUpdateSecs() > 0) {                                // Data.remoteother
                        myAlert('warning', 'Access Denied', 'Access will be allowed once the other Team has finalised');
                        $.mobile.changePage('home.html');
                    }
                    else {
                        displayFinaliseMatchOK();
                    }
                }
                else {
                    displayFinaliseMatchOK();
                }
            }
        },
        error:function(errdata) {
            console.log('ERROR');
            displayErrMsg('Error', errdata);    //  }
        }
    });
}

function displayFinaliseMatchOK()
{
    var othteamid = Teams.other.teamcode;

    calcTotals();

    setFooter("fmfootertext");

    var html = '';

//    var htmlother = '<div id="finaliseother">';
//    if(Data.remoteother.remotestatusid != "3") {
//        htmlother = '<p><a id="otherteamfinalise" href="#" data-code="' + Teams.other.teamid +
//            '" class="ui-btn ui-mini clr-btn-light-green ui-btn-inline btnteamlogin">' +
//            'Log in as ' + Teams.other.teamname + '</a></p>' +
//            '<div id="finaliseother" style="display:none;">';
//    }

    html = getPPlist(CURR_TEAM);
//    htmlother += getPPlist(othteamid) + '</div>';

    setTeamName("fmteamname");

    $('#finalisematch-div').trigger("create");
//    if(Data.config.appmethod == METHOD_SOLO_AUTH) {
//        $('#finalisematch-div-other').show();
//        $('#finalisematch-div-other').trigger("create");
//    }

    var hscore = TeamTotal("H");
    var ascore = TeamTotal("A");

    $("#finalhometeamname").html('<h3 style="font-weight:bold;">' + Data.hometeam.teamlabel + '</h3>');
    $("#finalawayteamname").html('<h3 style="font-weight:bold;">' + Data.awayteam.teamlabel + '</h3>');
    $("#finalhomescore").html('<h3 style="font-weight:bold;">' + hscore + '</h3>');
    $("#finalawayscore").html('<h3 style="font-weight:bold;">' + ascore + '</h3>');

    finalPlayerSummary();

    $("#eomtasks").html(html);
//    if(Data.config.appmethod == METHOD_SOLO_AUTH && Teams.myistwa){     //  Data.remote.hasaccess === "1"
//        $("#finalisematch-div-other").show();
//        $("#eomtasksother").html(htmlother);
//    }
//    else {
//        $("#finalisematch-div-other").hide();
//    }

    $(".playerpopup").popup();  // {afteropen: function( event, ui ) {getSelectablePlayerList(this, 'displayFinaliseMatch');}}
    $(".playerlistview").listview().listview("refresh");

    // if the sel team is finalised, hide the block
//    if(Data.remote.remotestatusid === "3") {
//        $("#this-team-finalise").hide();
//    }

}

function getPPlist(teamcode)
{
    console.log('getPPlist.' + teamcode);

    var teamname = Teams.my.teamcode == teamcode ? Teams.my.teamname : Teams.other.teamname;
    var hora = teamcode[0];

    var html = '';
    var readonly = false;

    var findata = teamcode == Teams.my.teamcode ? Data.finalise : Data.finaliseother;

    var disabled = '';
    var disabledta = '';

    var aorh = hora == "H" ? "A" : "H";

    $.each(Data.hashtags, function(ht, data)
    {
        // if the org captures players player votes
        if(data.hashtag == "pp" && data.enabled == "1")
        {
            var player = "Select Player...";

            // need the opposition team for the pp list
            var ppteamid = Teams.my.teamcode == teamcode ? Teams.other.teamcode : Teams.my.teamcode;

            html += String.format('<table style="width:100%;"><tr><td style="width:50%;text-align:right;padding:10px;">Players Player: </td>' +
                '<td style="text-align:left;padding:10px;" data-required="{0}">', data.required);

            var playerid = "";

            if(readonly) {
                if(findata !== null) {
                    if(typeof findata.finaldata != 'undefined') {
                        if(typeof Players[hora][findata.finaldata.pp] == 'undefined') {
                            player = "No Selection";
                        }
                        else {
                            player = Players[hora][findata.finaldata.pp].fullname;
                            playerid = findata.finaldata.pp;
                        }
                    }
                    else {
                        player = "No Selection";

                    }
                }
                html += String.format('<div id="player_PP_{0}" data-id="{2}">{1}</div>', teamid, player, playerid);
            }
            else {
                html += String.format('<a href="#popupPlayer_PP_{0}" data-rel="popup" id="player_PP_{0}" data-id="{2}">{1}</a>', teamcode, player, playerid);
                html += String.format('<div data-role="popup" id="popupPlayer_PP_{0}" data-code="." class="playerpopup">', teamcode);
                html += String.format('<ul id="popupPlayerList_PP_{0}" data-teamid="{0}" data-role="listview" data-inset="true" style="min-width:210px;" class="playerlistview">',
                    teamcode);
                $.each(Legend[ppteamid], function(k, o) {
                    if(o.playerid > 0) {
                        // change the color for the player who corresponds to the legend
                        var p = Players[aorh][o.playerid];
                        html += String.format('<li><a href="#" class="playerppsel" data-icon="false" data-id="{0}">{1}</a></li>', o.playerid, p.fullname);
                    }
                });
                if(data.required != "1") {
                    html += '<li><a href="#" class="playerppsel" data-icon="false" data-id="0">NONE</a></li>';
                }
                html += '</ul>';

                html += '</div>';   // popup
            }

            html += '</td></tr></table>';
        }
    });

    var comment = '';
    if(readonly) {
        if(findata !== null) {
            comment = findata.action == "accept" ? "** ACCEPTED RESULT **\n\n" : "** DISPUTED RESULT **\n\n";
            comment += findata.finaldata.comment
        }
    }

    html += String.format('<p><b>' + teamname + '</b>: CAPTAINS COMMENT</p><p><textarea id="matchcomment_{0}" style="width:90%;height:200px;" {2}>{1}</textarea></p>', teamcode, comment, disabledta);

    html += String.format('<p><button class="acceptfinal ui-btn clr-btn-light-green ui-btn-inline {1}" style="margin-right:30px;" data-teamid="{0}">ACCEPT RESULT</button>',
        teamcode, disabled);
    html += String.format('<button class="disputefinal ui-btn clr-btn-red ui-btn-inline {1}" data-teamid="{0}">DISPUTE RESULT</button></p>', teamcode, disabled);

    return html;
}

function displayPlayerSelect(teamcode)
{
    // could be TWLA
    if(!Teams.myistwa || Teams.other.teamcode === teamcode) {
        console.log('*** TWLA TEAM ACCESSING PLAYER SELECT');
        // check if TWA token is set in AjaxSetup
//        if(checkAjaxHeaders(LSTR_JWTTOKEN)) {
//            // if so, update ajaxSetup to the Other Token
//            updateAjaxSetup([LSTR_JWTTOKENOTHER]);
//        }
    }
    else {
        console.log('*** TWA TEAM ACCESSING PLAYER SELECT');
    }

    setTeamName("psteamname");

    var maxstats = getMaxStats();
    var rank1 = 99;
    var maxp = 0;
    var minp = 0;


    //get the highest positioned stats block on sheet that has rank points and set max / min
    $.each(Data.msheet, function(blockno, gblock) {       // pos = 1-n, gblock = Legend, Stats etc
        $.each(gblock, function(label, results) {     // label = Legend, Stats - Results = attributes & rows
            if(label === 'Stats' && parseInt(results.attributes.maxpoints) > 0) {
                rank1 = parseInt(blockno < rank1 ? blockno : rank1);
            }
        });
    });

    if(rank1 > 0 && rank1 < 99) {

console.log('first block with max/min ranks = ' + rank1);

        maxp = Data.msheet[rank1]['Stats'].attributes.maxpoints;
        minp = Data.msheet[rank1]['Stats'].attributes.minpoints;
    }

    $("#selectinfo").attr("data-maxpoints", maxp);
    $("#selectinfo").attr("data-minpoints", minp);
    $("#selectinfo").attr("data-maxpos", maxstats);

    $("#playerinfo").attr("data-maxlegend", Data.msheet[1].Legend.rows.length);
    $("#playerinfo").attr("data-maxstats", maxstats);

    var maxlegend = Data.msheet[1].Legend.rows.length;

//    setFooter("psfootertext");

    $('#playerselect-div').trigger("create");

    var heading = '<div class="row p rh" style="height:40px;font-weight:bold;"><div class="col-xs-1 rh ac">Pos</div>' +
        '<div class="col-xs-5 rh">Player Name</div><div class="col-xs-1">Opt</div></div>';

    if(Data.config.hasrankings == "1") {
        heading = '<div class="row p rh" style="height:40px;font-weight:bold;"><div class="col-xs-1 rh ac">Pos</div>' +
            '<div class="col-xs-4 rh">Player Name</div><div class="col-xs-1 ac">Rank</div><div class="col-xs-1">Opt</div></div>';
    }

    var html = getSavedLegend(teamcode);

//    var popup = 'href="#" id="btnLockSelection"';
    if(Teams.other.teamcode === teamcode) {
        $("#psteamname").removeClass("teamtitle").addClass("otherteamtitle")
    }

    $('#playerselect-div').append(heading + html);

//    var locked = html.indexOf('plocked') > -1 ? ' ui-disabled' : '';      //  Data.remote.hasaccess != "1"

    if(maxstats == maxlegend) {
        $("#playerinfo").html('Select <b> ' + maxstats + ' players</b> for this match');
    }
    else {
        $("#playerinfo").html('Select <b>between ' + maxstats + ' and ' + maxlegend + ' players</b> for this match');
    }

    displayMatchsheetPreview(teamcode);

    if(Data.config.hasrankings === "1") {
        calcSelectedPoints(teamcode);
    }
    else {
        $("#selectinfo").hide();
    }
}

function saveAutoLegend()
{
    var data = {};
    var msheet = {};
    var i = 0;
//    var button = BTN_SAVELEGEND;

    $.each(Players, function(key, obj)
    {
        if(!obj.legendcode === null) {

            msheet[obj.legendcode.substr(0,2)] = {
                playerid: obj.id,
                fullname: obj.fullname,
                gbcode: obj.legendcode,
                rank: obj.rank,
                new: obj.new
            };
        }
        i++;
    });

    data = {
        action: 'saveAutoLegend',
        pin: Data.remote.remotepin,
        otherpin: Data.remoteother.remotepin,
//        device: DEVICE_ID,
//        compid: Data.compid,
//        teamid: teamid,  //Data.myteam,
        drawid: Data.remote.drawid,
        button: BTN_SAVELEGEND,
        msheet: msheet,
        gameblocks: Data.gameblocks
    };

    $.ajax({
        action: 'saveAutoLegend.save',
        url: apiURL + 'postlegend',
        data: data,
        success: function(retdata)
        {
            console.log('saveAutoLegend.Success');

            console.log(retdata);

            if(retdata['error'] !== undefined) {
                myAlert("error", "Selection Error", retdata.error);
                return false;
            }

            var notymsg = "Legend SAVED";

//                if(button == BTN_LOCKLEGEND) {
//                    notymsg = "Legend SAVED & LOCKED";
//                    if(typeof retdata.locked !== 'undefined') {
//                        if(retdata.locked == "1") {
//                            if(Teams.my.teamid == teamid) {
//                                Data.remote.legendlock = '1';
//                            }
//                            else {
//                                Data.remoteother.legendlock = '1';
//                            }
//                            $(".playerselected").addClass("plocked");
//                            $(".pselbtn").addClass("ui-disabled");
//                        }
//                    }
//                }
            var n = $(".noty").noty({
                theme: 'relax',
                layout: "bottom",
                type: "information",
                text: notymsg,
                timeout: 4000,
                modal: false,
            });
        },
        error:function(errdata) {
            console.log('ERROR');
            displayErrMsg("Player Select Error", errdata);
        }
    });
}

function savePlayerSelection(button)
{
    var data = {};
    var msheet = {};
    var i = 0;
    var teamcode = $("#psteamname").attr("data-side");    //Teams.my.teamid;
    var hora = teamcode[0];
//    var teamid = Teams[hora].teamid;
    var pin = $("#psteamname").attr("data-pin");    //Teams.my.teamid;

    var teamistwla = 0;

    // twa will always have hasaccess = 1
    if(Teams.my.data.hasaccess == "1") {
        if(Teams.my.teamcode != teamcode) {
            teamistwla = 1;
        }
    }

    $.each($(".playerselected"), function(k, o)
    {
        var id = $(o).attr("data-id");
        var lcode = $(o).attr("data-legendcode");
        var pname = Players[hora][id].fullname;

        msheet[lcode.substr(0,2)] = {
            playerid: id,
            fullname: pname,
            gbcode: lcode,
            rank: Players[hora][id].rank,
            new: Players[hora][id].new
        };
        i++;
    });

    data = {
        action: 'savePlayerSelection',
        pin: pin,
//        device: DEVICE_ID,
        compid: Data.compid,
//        teamid: teamid,  //Data.myteam,
//        hora: hora,
//        drawid: Data.remote.drawid,
        button: button,
        msheet: msheet,
        drawid: Data.draw.id,
        teamistwla: teamistwla,
        gameblocks: Data.gameblocks
    };

    $.ajax({
        url: apiURL + 'postlegend',
        data: data,
        success: function(retdata)
        {
            console.log(retdata);

            if(typeof retdata['error'] !== 'undefined') {
                myAlert("error", "Selection Error", retdata.error);
                return false;
            }
            else if(typeof retdata['teams'] !== 'undefined') {
                $.each(retdata.teams, function(tid, tdata)
                {
                    if(tid == Teams.my.teamcode) {
                        Teams.my.data.legendsave = parseInt(tdata.legendsave);
                        Teams.my.data.legendlock = parseInt(tdata.legendlock);
                    }
                    else {
                        Teams.other.data.legendsave = parseInt(tdata.legendsave);
                        Teams.other.data.legendlock = parseInt(tdata.legendlock);
                    }
                });
                var n = new Noty({
                    text: '<p style="text-align:center">LEGEND SAVED<p><p style="text-align:center">Return to Main page?</p>',
                    layout: 'center',
                    type: 'alert',
                    theme: 'relax',
                    timeout: 4000,
                    progressBar: true,
                    buttons: [
                        Noty.button('YES', 'ui-btn ui-btn-inline ui-mini clr-bg-green clr-white', function () {
                            console.log('button 1 clicked');
                            $(".iconhome").trigger("click");
                            n.close();
                        },
                        {id: 'button1', 'data-status': 'ok', style:"text-align:center"}),
                        Noty.button('NO', 'ui-btn ui-btn-inline ui-mini clr-bg-red clr-white', function () {
                            console.log('button 2 clicked');
                            n.close();
                        })
                    ],
                    callbacks: {
                        onShow: function() { $(".noty_buttons").css("text-align","center"); },
                    }
                }).show();
            }
        },
        error: function(errdata)
        {
            console.log("ERROR");
            displayErrMsg("Not Authorised", errdata, function() { populateHomePage("token", myJWT.remoteid); });
        }
    });
}

function testNoty(layout) {
    if(typeof layout === 'undefined') {
        layout = "center";
    }
    var n = $(".noty").noty({
        theme: 'relax',
        layout: layout,
        type: "success",
        text: 'success message',
        timeout: 4000,
        modal: false,
    });
}

function calcSelectedPoints(teamcode)
{
    console.log('calcSelectedPoints(' + teamcode + ')');

    var total = parseFloat($("#selectinfo").data("maxpoints"));
    var minpts = parseFloat($("#selectinfo").data("minpoints"));
    var maxpos = parseInt($("#selectinfo").data("maxpos"));

    var hora = teamcode[0];

    var points = 0;
    var count = 0;

    var alert = false;
    var alert2 = false;

    $.each(Players[hora], function(k,o) {
        console.log(o);
        if(o.pos > -1 && o.pos < maxpos) {
            points = points + parseFloat(o.rank);
            count++;
        }
        alert = (points > total);
        if(count >= maxpos && minpts > 0) {
            alert2 = (points < minpts);
        }
    });

    if(total === 0 && minpts === 0) {
        $("#selectinfo").hide();
    }
    else {
        var msgprefix = 'Points (' + (minpts > 0 ? 'Min: ' + minpts + ', ' : '') + 'Max: ' + total + '): ';
        if(alert) {
            $("#selectinfo").text('MAX WARNING! - ' + msgprefix + points).css('color', 'red').css('font-weight','bold');
            myAlert("warning", "Max Points exceeded!", "Please reselect your top " + maxpos + " positions to ensure the total points do not exceed " + total);
        }
        else if(alert2) {
            $("#selectinfo").text('MIN WARNING! - ' + msgprefix + points).css('color', 'red').css('font-weight','bold');
            myAlert("warning", "Min Points not reached!", "Please reselect your top " + maxpos + " positions to ensure the total points are " + minpts + ' or more');
        }
        else {
            var warncolor = points >= minpts && points <= total ? 'blue' : 'red';
            $("#selectinfo").text(msgprefix + points).css('color', warncolor).css('font-weight','normal');;
        }
    }

}

function displayPlayerList(teamcode)
{
    console.log('displayPlayerList(' + teamcode + ')');
    var hora = teamcode[0];

    setTeamName("plteamname");

    setFooter("plfootertext");

    $('#playerlist-div').trigger("create");

    var html = '';
    var newhtml = '';

    calcTotals();

    var hasstats = 0;
    if(Totals[0] !== undefined) {
        hasstats = Totals[0].H + Totals[0].A;
    }

    if(Teams.other.teamcode == teamcode) {
        $("#plteamname").removeClass("teamtitle").addClass("otherteamtitle")
    }

    var heading = '<div class="row p rh" style="height:35px;font-weight:bold;"><div class="col-xs-5 rh">Player Name</div>' +
            (Data.config.hasrankings == "1" ? '<div class="col-xs-2 rh">Rank</div>' : '') +
            '<div class="col-xs-2 rh">Options</div></div>';

//console.log(teamid);

    var isEdited;

    // get existing and new players from poolstat, list existing players first
    $.each(Players[hora], function (id, player) {
        console.log(player.fullname + isEdited);
        if(player.status == 1) {
            if(player.new == 1) {
                newhtml += '<div class="row p" id="player_' + id + '" data-id="' + player.id + '" data-id="' + id + '">';
                newhtml += '<div class="col-xs-5 pname">' + escapeHtml(player.fullname) + '</div>';
                newhtml += Data.config.hasrankings == "1" ? '<div class="col-xs-2 rank">' + player.rank + '</div>' : '';
                newhtml += '<div class="col-xs-2 opt" style="white-space:nowrap;">';
                if(hasstats === 0 && Teams.myistwa) {       // Data.remote.hasaccess == "1"
                    newhtml += '<a href="#dlgEditPlayer" data-rel="popup" class="ui-btn ui-mini ui-btn-inline playeredit" data-index="' + id + '" title="Edit">' +
                        '<i class="zmdi zmdi-edit"></i></a>';
                    if(player.pos === -1) {
                        newhtml += '<a href="#" class="ui-btn ui-mini ui-btn-inline playerdelete" data-index="' + id + '">' +
                            '<i class="zmdi zmdi-delete"></i></a>';
                    }
                }
                newhtml += '</div></div>';
            }
            else {
                isEdited = isset(Teams[hora].data.livescoredata[player.id]) ? '*' : '';
                html += '<div class="row p" id="player_' + id + '" data-id="' + player.id + '" data-id="' + id + '">';
                html += '<div class="col-xs-5 pname">' + escapeHtml(player.fullname) + isEdited + '</div>';
                html += Data.config.hasrankings == "1" ? '<div class="col-xs-2 rank">' + player.rank + '</div>' : '';
                if(hasstats === 0) {       // Data.remote.hasaccess == "1"
                    html += '<div class="col-xs-2 opt"><a href="#dlgEditPlayer" data-rel="popup" class="ui-btn ui-mini ui-btn-inline playeredit" ' +
                        'data-index="' + id + '" title="Edit"><i class="zmdi zmdi-edit"></i></a>';
                    if(isEdited == '*') {
                        html += '<a href="#" class="ui-btn ui-mini ui-btn-inline playerundo" data-index="' + id + '">' +
                            '<i class="zmdi zmdi-undo"></i></a>';
                    }
                }
                html += '</div></div>';
            }
        }
    });

    $('#playerlist-div').append(heading + html + newhtml);

    $("#plist_buttons").html('<a href="#dlgAddPlayer" data-rel="popup" id="btnAddNewPlayer" class="ui-btn clr-btn-blue ui-mini">Add Player</a>');
}

function getMaxStats() {

    var used = '';
    var hleg = '';
    var aleg = '';
    var ml = 0;

    $.each(Data.msheet, function(key, gb) {
      $.each(gb, function(gkey, obj) {
          if(gkey === 'Legend') {
              hleg = obj.attributes.homeorder;
              aleg = obj.attributes.awayorder;
//                console.log(hleg + " " + aleg);
              return false;
          }
      });
    })

    $.each(Data.gameblocks, function(k,o) {

        if(o.popfromlegend > 0) {
            var codes = o.home.codes.split("");
            $.each(codes, function(k, c) {
                if(used.indexOf(c) === -1) {
                    if(hleg.indexOf(c) > -1) {
                        used += c;
                    }
                }
//              console.log(used);
            })
        }
        else {
            ml = ml > o.home.codes.length ? ml : o.home.codes.length;
        }
    });

    // manual selection of players for all blocks
    if(used.length === 0) {
        return ml;
    }

    return used.length;
}

function getSavedLegend(teamcode)
{
    console.log('getSavedLegend: ' + teamcode);

    var hora = teamcode[0];

    calcTotals();

    updateShowCodes();

//    var maxlegend = Data.msheet[1].Legend.rows.length;
    var maxstats = getMaxStats();

    //Data.msheet[2].Stats.rows.length;

    var html = '';
    var newhtml = '';

    var hasstats = 0;
    if(Totals[0] !== undefined) {
        hasstats = Totals[0].H + Totals[0].A;
    }

    var playercount = 0;

    if(isset(Data.hometeam))
    {
        var allocPlayers = {};
//        var teamcode = teamcode; // Teams.my.teamcode;
//        console.log(Legend);
//        console.log(teamcode);
        if(Legend.length > 0) {
            $.each(Legend[teamcode], function(id, gbcodes) {
                // check GBCodes for allocation
                var gbc = gbcodes.gbcode;               // HA0, AA0
                var code = gbcodes.code;
                var pid = gbcodes.playerid;

                if(pid > 0) {
                    if($(".player_" + code).length > 0) {
                        $(".player_" + code).text(Players[pid].fullname);
                    }
                }

                if(typeof GBCodes[gbc] !== 'undefined') {
                    allocPlayers[pid] = {legendcode: gbc, code: gbcodes.code};
                }
            });
        }

//console.log(allocPlayers);

        var legendlock = 0;

        // if locklegends is set to YES
        if(Data.config.locklegends === "1") {
            if(Teams.my.teamcode === teamcode) {
                legendlock = parseInt(Teams.my.data.legendlock);
            }
            else {
                legendlock = parseInt(Teams.other.data.legendlock);
            }
        }

//        console.log('legendlock = ' + legendlock);

//        var teamPlayers = Teams.my.players;
//        if(Teams.my.teamcode != teamcode) {
//            teamPlayers = Teams.other.players;
//        }

        $.each(Teams[hora].players, function (team, player)
        {
            if(parseInt(player.status) == 1 && (parseInt(player.type) == 1 || parseInt(player.type) === 2))
            {
                if(RESTYPE_FORFEIT.indexOf(player.id) > -1) {
                    $("#ps_addforfeit").addClass("ui-disabled");
                }

                if(isset(allocPlayers[player.id]))
                {
                    player.legendcode = allocPlayers[player.id].legendcode;
                    player.code = allocPlayers[player.id].code;
                    player.pos = LegendCodes[teamcode][player.code].pos;
                    LegendCodes[teamcode][player.code].playerid = player.id;
                }
                if(player.pos > -1) {
                    playercount++;
                }

                var sel = player.pos === -1 ? "" : " playerselected";
                if(hasstats > 0 || legendlock == 1) {     // Data.remote.hasaccess != "1"
                    sel = sel + " plocked";
                }
                var tcode = Teams[hora].teamcode;
                if(player.new == 1) {
                    newhtml += selPlayerBlock(sel, player, Teams[hora].data.livescoredata, Legend[tcode][0].gbcode);
                }
                else {
                    html += selPlayerBlock(sel, player, Teams[hora].data.livescoredata, Legend[tcode][0].gbcode);
                }
            }
        });
        console.log("total: " + playercount);

        $.each(GBCodes, function(gbcode, rows)
        {
            var gbc = GBCodes[gbcode].code
            if(LegendCodes[teamcode][gbc] !== undefined) {
                GBCodes[gbcode].id = LegendCodes[teamcode][gbc].playerid;
            }
        });
    }
console.log(playercount + ' ' + maxstats);

    var subcount = playercount > maxstats ? playercount - maxstats : 0;

console.log(subcount);

    if(teamcode == Teams.my.teamcode) {
        Teams.my.subcount = subcount;
    }
    else {
        Teams.other.subcount = subcount;
    }

    return html + newhtml;
}


function selPlayerBlock(sel, player, lsdata)
{
    console.log('selPlayerBlock');
    console.log(lsdata);
    console.log(sel);
    console.log(player);

    var rank = '';
    if(Data.config.hasrankings == "1") {
        rank = " (" + player.rank + ")";
    }
    var maxstats = getMaxStats();

//    var show = player.pos >= maxstats ? '' : 'display:none;';

    var startsub = player.pos >= maxstats ? "sub" : "start";

    var showcode = getShowCode(Teams.my.teamcode, player.code, 1);

    var html = String.format('<div class="row pselect p{0} {3}{4}" id="player_{1}" data-id="{1}" data-legendcode="{2}">',
        sel, player.id, player.legendcode, startsub, player.new == 0 ? '' : ' temp');

    var isEdited = '';
    if(isset(lsdata[player.id]) && player.new == 0) {
        isEdited = ' *';
    }

    var opts = '<a href="#" class="editplayer ui-btn-inline"><i class="zmdi zmdi-edit"></i></a>';

    if(player.new == 1) {
        opts += '<a href="#" class="deleteplayer ui-btn-inline"><i class="zmdi zmdi-delete"></i></a>';
    }
    else {
        opts += '<a href="#" class="undoplayer ui-btn-inline' + (isEdited == ' *' ? '' : ' hidden') + '"><i class="zmdi zmdi-undo"></i></a>';
    }

    html += String.format('<div class="col-xs-1 code playerselect">{0}</div>', player.pos === -1 ? "-" : showcode);

    if(Data.config.hasrankings == "1") {
        html += String.format('<div class="col-xs-4 pname playerselect">{0}</div>', escapeHtml(player.fullname) + isEdited);
        html += String.format('<div class="col-xs-1 rank ac playerselect">{0}</div>', player.rank);
    }
    else {
        html += String.format('<div class="col-xs-5 pname playerselect">{0}</div>', escapeHtml(player.fullname) + isEdited);
    }
    html += '<div class="col-xs-1 action" style="min-width:60px;">' + opts + '</div></div>';
//    html += '</div></div>';    // <span class="subplayer" style="margin-left:10px;color:red;{1}">SUB</span>

    return html;
}

function displayMatchsheetPreview(teamcode)
{
    var h = $(window).height() - 20;

    var html = '<div id="mspreviewdiv" style="overflow-y:auto;padding-right:3px;height:' + h + 'px;">';

    var hora = '';
    if(Teams.my.teamcode == teamcode) {
        hora = Teams.my.team;
    }
    else {
        hora = Teams.other.team;
    }

    $.each(Data.msheet, function(blockno, blockdata) {
        $.each(blockdata, function(bkey, obj) {
            if(bkey == "Stats") {
//                console.log(obj);
//                console.log(obj.attributes.label);
                html += '<table style="width:100%;margin-bottom:3px;border:1px solid #ddd;font-size:0.9em;">' +
                        '<tr style="background-color:rgb(230,230,230);border:1px solid #ccc;">' +
                        '<th colspan="2">' + Blocks[blockno].description + '</th></tr>'
                $.each(obj.rows, function(idx, match) {
                    $.each(match, function(code, player) {
                        var gcode = GBCodes[code];
                        if(gcode.hora == hora) {
                            var pname = typeof Players[gcode.id] === 'undefined' ? '' : Players[gcode.id].fullname;
                            html += '<tr><td style="color:red;min-width:30px;text-align:center;">' + gcode.code + (gcode.break=="B" ? "*" : NBSP) + '</td>' +
                                '<td class="player_' + gcode.code + '" style="width:100%;">' + pname + '</td></tr>'
                        }
                    });
                });
                html += '</table>';
            }
        });
    });
    html += '</div>';
/*
    $.each(Data.msheet, function(blockno, blocks) {
      if(Blocks[blockno].label == "Stats") {
       console.log(Blocks[blockno].description);
       html += '<table style="width:100%;"><tr style="background-color:rgb(230,230,230);"><th colspan="2">' + Blocks[blockno].description + '</th></tr>'
        $.each(blocks, function(idx, match) {
          $.each(match, function(code, player) {
            if(code.substr(0,1) == hora) {
                var pname = typeof Players[player.playerid] === 'undefined' ? '' : Players[player.playerid].fullname;
                html += '<tr><td style="color:red;min-widthwidth:30px;text-align:center;">' + player.code + (player.break=="B" ? "*" : NBSP) + '</td>' +
                    '<td class="player_' + player.code + '" style="width:100%;">' + pname + '</td></tr>'
            }
          });
        });
        html += '</table>';

      }
    });
*/
    $("#mspreviewpanel").empty();
    $("#mspreviewpanel").append(html);

}

function displayEnterResults()
{
    console.log('CPage.param: ' + (CPage.param === null ? 'null' : CPage.param));

    LastUpdate.intervalCount = 0;

    clearInterval(lockcheckinterval);
    lockcheckinterval = 0;

    var lsview = CPage.param == 'readOnly';

    if(lsview) {
        $(".resultsheader").removeClass('showscore').addClass('viewscore');
    }

    // params = {'ltype': LOGIN_TOKEN, 'drawid': 0}; or {'ltype': LOGIN_VIEWONLY, 'drawid': n};
    var ltype = CPage.ltype;

    if(LastUpdate.lastTimestamp > -1) {
        LastUpdate.lastTimestamp = Data.lastupdate;
    }

    LastUpdate.lastRefresh = parseInt($.now() / 1000);

    // clear the intex page refresh interval
    if(IDX_INTERVAL !== null) {
        clearInterval(IDX_INTERVAL);
        IDX_INTERVAL = 0;
    }

    var firstblocknosub = 0;

    //if one or more teams have finalised, make matchsheet readonly
    var readonly = false;

    var mydata = {
        action: 'displayEnterResults',
        userip: Settings.userip,
        userAgent: CID.userAgent,
        uuid: CID.uuid,
        logintype: ltype,
        drawid: CPage.drawid == 0 ? null : CPage.drawid,
        teamid: null,
        remid: null,
        pinorpwd: 0,
    };

    getMatchNEW(mydata,

        function(data) {

            Data = data;

    console.log('Data received');

    console.log(data);

            LastUpdate.lastRefresh = parseInt($.now() /1000);

            // get the last timestamp of when data was updated
            LastUpdate.lastTimestamp = Data.lastUpdate;

            Teams = new TeamsData();

            if(isset(data.status)) {
                if(data.status === 0) {
                    myAlert('error', 'Access denied!', data.text, function() {
                        reloadSite();
                    });
                    return false;
                }
            }

            if(Teams.twla.data.legendlock === 0) {
                if(ltype == LOGIN_VIEWONLY) {
                    myAlert('error', 'Access Denied', 'Players are not ready yet', function() {return false;});
                }
                else {
                    myAlert('error', 'Access Denied', 'Other Team is not ready', function() {return false;});
                }
                return false;
            }

//            else {

// BUILD SCORESHEET

            if(Data.remote.remotestatusid === "3" || Data.remoteother.remotestatusid === "3" || CPage.refresh === false) {
                LastUpdate.lastTimestamp = -1;
            }

            readonly = LastUpdate.lastTimestamp === -1;

            var refresh = true;
            if(lsview === true) {		// guest or any logged in user
                console.log('refresh: 1: ' + LastUpdate.lastTimestamp);
                refresh = LastUpdate.lastTimestamp !== -1;
            }
            else {						// only logged in users
                if(Data.remote.hasaccess != "1") {
                console.log('refresh: 2');
                    refresh = LastUpdate.lastTimestamp !== -1
                }
                else {
                    refresh = false;
                }
            }

console.log('refresh: ' + refresh);

            if(refresh) {
                $("#refreshresults").show();
                $("#refreshresults").text("Refreshed at " + moment.unix(LastUpdate.lastRefresh).format("h:mm:ss a") + ", update in " + (6 * 5) + " secs")
            }

            initPlayerList();

            initGBCodes();

            getSavedLegend(Teams.my.teamcode);

            getSavedLegend(Teams.other.teamcode);

//            var msg = LegendSaveCount();
//
//            // if legendlock is true and legends are not locked, exit.  if legendlock is false and both legends do not contain players, exit
//            if(msg.id < 2) {
//                myAlert("warning", msg.title, msg.text,
//                function() {
//                    $("body").pagecontainer("change", "home.html", {reloadPage:false});
//                });
//                return false;
//            }
//            else {

                $(".resultlistview").trigger("create");

                var html;
                var collapse = "true";

                // enumerate each block of results ie Legend, Singles #1 etc
                var usemaxpoints = 0;

                console.log('First block autolock criteria (both to be true)');
                console.log('Data.config.block1autolock = 1 ' + (Data.config.block1autolock === "1" ? '(true)' : '(false)'));
                console.log('Data.config.lockgameblocks = 1 ' + (Data.config.lockgameblocks === "1" ? '(true)' : '(false)'));

                var unplayedmatches = 0;

                var htmladj = '';

                // comp has frame adjustments
                if(Data.config.frameadj == "1") {

                    htmladj = '<div id="matchfadg" class="matchset">';
                    htmladj += '<div class="fadgblock">';

                    var fadjtitle = Data.config.frameadjlabel;

                    var homeval = Teams.home.data.homeframescoreadj;
                    var awayval = Teams.away.data.awayframescoreadj;

                    var hdata = Teams.home.data;
                    var adata = Teams.away.data;

                    var hspin = String.format('<div class="home" style="display:inline-block;">' +
                            '<div class="spinner spinkey spinminus" data-rmid="{1}">-</div>' +
                            '<div id="spinvalue_{1}" class="spinner spinvalue home" data-drawid="{2}">{0}</div>' +
                            '<div class="spinner spinkey spinplus" data-rmid="{1}">+</div></div>', homeval, hdata.id, hdata.drawid);

                    var aspin = String.format('<div class="away" style="display:inline-block;">' +
                            '<div class="spinner spinkey spinminus" data-rmid="{1}">-</div>' +
                            '<div id="spinvalue_{1}" class="spinner spinvalue away" data-drawid="{2}">{0}</div>' +
                            '<div class="spinner spinkey spinplus" data-rmid="{1}">+</div></div>', awayval, adata.id, adata.drawid);

                    if(Teams.my.data.hasaccess !== "1" || Teams.my.data.remotestatusid == "3" || Teams.other.data.remotestatusid == "3" || ltype == LOGIN_VIEWONLY) {
                        hspin = String.format('<div class="home" style="display:inline-block;">' +
                            '<div id="spinvalue_{1}" class="spinner spinview home" data-drawid="{2}">{0}</div></div>', homeval, hdata.id, hdata.drawid);

                        aspin = String.format('<div class="away" style="display:inline-block;">' +
                            '<div id="spinvalue_{1}" class="spinner spinview away" data-drawid="{2}">{0}</div></div>', awayval, adata.id, adata.drawid);
                    }

                    htmladj += String.format('<div id="{0}" class="row statsedit frameadj" style="padding:10px;">', 'frameadj');
                    htmladj += String.format('<div id="fadj_home" class="fadjhome">{0}</div>', hspin);
                    htmladj += String.format('<div id="fadj_away" class="fadjaway">{0}</div>', aspin);
//                        htmladj += '</div>';       // row

                    htmladj += '</div>';       // fadgblock
                    htmladj += '</div>';       // .matchfadg

                    htmladj += '</div>';       // collapsible

                    var header = '<div id="collapse_fadg" class="resultlist" data-role="collapsible" data-collapsed="false">';
                    header += '<h3><table class="mshead" style="width:100%;"><tr><td class="requireaction"></span></td>' +
                        '<td class="msscore title">' + fadjtitle + '</td>' +
                        '<td id="blockfadj" class="msscore last drawn">' + homeval + ' - ' + awayval + '</td></tr></table></h3>';

                    htmladj = header + htmladj;
                }

                $.each(MatchSheet, function(blockno, blocks) {

                    if(firstblocknosub === 0) {

                        if(typeof Data.gameblocks[blockno] !== 'undefined') {
                            // block must have code references in the legend
                            if(Data.gameblocks[blockno].away.legendcount > 0 && Data.gameblocks[blockno].home.legendcount > 0) {
                                // check config settings and the status of the target block
                                if(Data.config.block1autolock === "1") {        //  && Data.config.lockgameblocks === "1" <-- DEPRECATED
                                    firstblocknosub = blockno;
                                    console.log('First Block for Locking: ' + firstblocknosub);
                                }
                            }
                        }
                    }

                    var heading = Blocks[blockno];

                    html = '<div id="matchset' + blockno + '" class="matchset ' + (firstblocknosub === blockno ? 'block1lock' : '') + '" data-matchid="' + blockno + '">';

                    var maxpoints = 0;
//                    var lockstatus = 0;

                    if(heading.label === "Legend") {
                        usemaxpoints = parseFloat(heading.maxpoints);
                    }
                    else {
                        if(!readonly) {
//                            html += lockStatsBlock(blockno, lockstatus);
                        }
                        if(usemaxpoints == 1) {
                            maxpoints = parseFloat(heading.maxpoints);
                        }
                    }

html += '<div class="matchblock">';

                    var player1 = true;
                    var showresult = true;

                    var items;

                    // enumerate the matches within each block
                    $.each(blocks, function(pos, match) {

                        if(player1 === true) {
                            html += '<div class="span12 matches bgwhite block' + blockno + '">';
                        }

                        var myMatch = {};
                        $.each(match, function(gbcode, data) {
                            var hora = gbcode.substr(0,1);
                            if(hora == "H") {
                                myMatch['home'] = data;
                                myMatch['home']['gcode'] = gbcode;
                                if(data.remotedata.resultcode === "X") {
                                    unplayedmatches++;
                                }
                                if(data.partner != gbcode) {
                                    player1 = !player1;
                                }
                            }
                            else {
                                myMatch['away'] = data;
                                myMatch['away']['gcode'] = gbcode;
                            }
                        });

                        var params = {block: blockno, pos: pos, myMatch: myMatch, showresult: showresult};

                        showresult = player1;

                        if(heading.label === "Legend") {
                            items = getLegendItemView(params);
                        }
                        else {
                            items = getStatsItemView(params);
                        }

                        html += items;
                        if(player1 === true) {
                            html += '</div>';       // matches
                        }
                    });
                    html += '</div>';       // matchblock

                    html += '</div>';       // .matchset
                    html += '</div>';       // collapsible

                    html += htmladj;
                    htmladj = '';

                    var collid = 'collapse_' + blockno;

                    var disabled = Blocks[blockno].disabled;

                    collapse = (disabled == 1 || heading.label === "Legend") ? "true" : "false";

                    if(ltype == LOGIN_VIEWONLY) {
                        collapse = 'false';
                    }

                    var header = String.format('<div id="{0}" class="resultlist {1}" data-role="collapsible" data-collapsed="{2}" data-disabled="{3}">' +
                        '<h3><table class="mshead" style="width:100%;"><tr><td class="requireaction"></span></td><td class="msscore title">{4}</td>' +
                        '<td class="msscore last drawn block{5}" data-maxpoints="{6}">0 - 0</td></tr></table></h3>',
                        collid, disabled == "1" ? 'hidden' : '', collapse, disabled, heading.description, blockno, maxpoints );

                    $('#resultset').append(header + html);
                });

                $('.resultlist').collapsible().trigger('create');

                $("#enterresultsmsg").hide();

// MAKE READ ONLY ACCESS TO RESULTS PAGE

                if(Teams.my.data.hasaccess !== "1" || Teams.my.data.remotestatusid == "3" || Teams.other.data.remotestatusid == "3" || ltype == LOGIN_VIEWONLY) {
                    $(".playersub.showlink").addClass("clicklock").removeClass("showlink");
                    if($(".ms.result").hasClass("mf")) {
                        $(".ms.result").addClass("clicklockmf").removeClass("active");
                    }
                    else {
                        $(".ms.result").addClass("clicklock").removeClass("active");
                    }
                }

                // if first block needs to be locked, do it now
                if(firstblocknosub > 0) {
                    if($("#btnblocklock-" + firstblocknosub).attr("data-status") === "0") {
                        console.log('FIRST BLOCK (' + firstblocknosub + ") TO BE LOCKED");
                        // set the block lock to bypass prompts
                        $("#btnblocklock-" + firstblocknosub).attr("data-auto", "1");
                        // lock the block automatically
                        $("#btnblocklock-" + firstblocknosub).trigger("click");
                    }
                    else {
                        console.log('FIRST BLOCK (' + firstblocknosub + ") ALREADY LOCKED");
                    }
                }

//            }

            var matchsets = $("div.matchset");
            $.each(matchsets, function(k, matchset) {
                if($(matchset).find(".navaccept").length !== 0) {
                    $(matchset).parent().parent().find(".requireaction").addClass("actions");
                }
                else {
                    $(matchset).parent().parent().find(".requireaction").removeClass("actions");
                }
            });

            calcTotals();

            var mpage = ltype == LOGIN_VIEWONLY ? 'view' : 'results';

            updateMatchScorePanel(mpage);

            $(".fullname").hide();

            if(CPage.page === "enterresults.html") {
                console.log('scroll to position ' + CPage.scrollpos);
                $("html").scrollTop(CPage.scrollpos);
            }

            if(MS_INTERVAL !== null) {
                console.log('clearing current interval = ' + MS_INTERVAL);
                clearInterval(MS_INTERVAL);
                MS_INTERVAL = 0;
            }

            // if lastTimestamp > 0 then Matchsheet data exists
            if(refresh === true) {
                if(LastUpdate.lastTimestamp > -1) {
                    MS_INTERVAL = setInterval(ajaxUpdateScoresheet2, 5000);
                    console.log('new interval = ' + MS_INTERVAL);
                }
            }

console.log(LastUpdate);

//            }   // ELSE Teams.twla.data.legendlock === 0
        },
        function(err) {
            console.log(err);
//            displayErrMsg('Data error', err, function() { reloadSite(); });
//            alert("Errors occurred loading data");
        });
}

var MatchTeams = {};

function MatchTeam(params, hora, islegend)
{
    var myMatch = params.myMatch[hora];

    var hacode = hora === 'home' ? 'H' : 'A';

    this.showresult = params.showresult;

    this.match = myMatch;

    var plyr = null;
    this.plyr = null;

    if(isset(Players[hacode][myMatch.playerid])) {
        plyr = Players[hacode][myMatch.playerid];
        this.plyr = Players[hacode][myMatch.playerid];
    }

    /*  RESULT CODES
     *  X = new, no score, reset
     *  W = Standard Win
     *  L = Loss
     *  F = Forfeit Win
     *  B = Master Break
     *  S = Master Shot
     *  C = Master Clearance
     *  A = Abandoned
     *  P = In Progress (multiframe games only)
     */

    /* RESULT STATUS
     * 1 = New
     * 2 = In Progress
     * 4 = UNUSED
     * 8 = Match Completed
     * 16 = Forfeit
     * 32 = Non standard match complete (abandoned)
     */
    this.rescode = this.match.remotedata.resultcode;
    this.framecount = this.match.remotedata.framecount;

    // result format info
    this.maxframes = myMatch.gbcode.maxframes;
    this.isracetomax = myMatch.gbcode.isracetomax;

    this.ismultiframe = this.maxframes > 1;

    //    this.result = !params.showresult ? NBSP : this.match.remotedata.resultcode == "X" ? "?" : this.rescode;
    this.result = NBSP;
    if(params.showresult) {
        if(this.ismultiframe) {
            // resultcode = "P" means match in progress (scores have not reached required number to complete the match
            this.result = this.match.remotedata.resultcode == "X" ? "0" : this.framecount;
        }
        else {
            this.result = this.match.remotedata.resultcode == "X" ? "?" : this.rescode;
        }
    }

    this.res = "";
    if(this.ismultiframe) {
        if("P".indexOf(this.result) > -1) {
            this.res = " msprogress";
        }
    }

    if(this.match.remotedata.resultstatus == '8') {
        var wtags = [];
        $.each(Data.hashtags, function(k,o) {
            if(o.enabled == "1" && o.hashtagtypeid == "1") {
                wtags.push(o.hashtag[1].toUpperCase());
            }
        });

        var wtlist = "W-" + wtags.join("-");
//        console.log('wtlist = ' + wtlist);
        if(wtlist.indexOf(this.match.remotedata.resultcode) > -1) {
            this.res = " mswin";
        }
        else if(this.match.remotedata.resultcode == "F") {
            this.res = " mswinfft";
        }
    }
//    else if(this.match.remotedata.resultstatus == '16') {
//        if("F".indexOf(this.match.remotedata.resultcode) > -1) {
//            this.res = " mswinfft";
//        }
//    }
    else if(this.match.remotedata.resultstatus == '32') {
        if("A".indexOf(this.match.remotedata.resultcode) > -1) {
            this.res = " msaban";
        }
    }

    this.code = myMatch.code;
    this.teamid = Teams[hora].teamid;
    this.teamcode = Teams[hora].teamcode;
    this.showcode = getShowCode(this.teamcode, this.code, params.block);

    this.brk = myMatch.break == "B" ? "(" + this.showcode + ")" : this.showcode;

    // player info
    this.pid = 0;
    this.pshortname = islegend ? NBSP : "?";
    this.pfshortname = islegend ? NBSP : "?";
    this.pinitials = islegend ? NBSP : "?";
    this.pfullname = islegend ? NBSP : "?";
    this.prank = Data.config.hasrankings == "0" ? -1 : 0;
    this.pcode = '?';

    this.orig = '';
    this.hidecode = 'hidden';

    if(plyr !== null) {
        this.pid = plyr.id;
        this.pshortname = plyr.shortname;
        this.pfshortname = plyr.fshortname;
        this.pinitials = plyr.initials;
        this.pfullname = plyr.fullname;
        this.prank = Data.config.hasrankings == "0" ? -1 : plyr.rank;
        this.pcode = plyr.code;
        this.pshowcode = getShowCode(this.teamcode, this.pcode, params.block);
        if(plyr.type > 1) {
            this.orig = 'fftaban';
            this.hidecode = 'hidden';
        }
        else {
            if(this.pcode !== '?' && this.code !== this.pcode) {
                this.orig = 'subnotorig';
                this.hidecode = '';
            }
        }
    }

    this.codedisabled = islegend && this.pshortname == "" ? 'codedisabled' : '';

    this.showlink = function() {

        var block = parseInt(params.block);

        this.gblock = Data.gameblocks[block];
        this.subcount = Teams[hora].subcount;

        var show = false;

        // check 1: all block codes are legend codes
//        if(this.gblock[hora].popfromlegend > 0) {
            if(this.gblock[hora].codes.length === this.gblock[hora].legendcount) {
                // check 3: no results entered
                if(this.result === "?" || (this.result === "0" && this.match.remotedata.resultcode === "X")) {
                    show = true;
                }
            }
            else {
                show = true;
            }
//        }

        if(show) {
            // do we disable subbing in the first block?
            if(Data.config.block1autolock === "1") {
                if(this.gblock.prevblock === 0) {
                    show = this.gblock[hora].legendcount === 0;
                }
            }

            if(show) {
                // do we disable subbing once results are published in this block?
                if(Data.config.disablesubonfirstresult === "1") {
                    show = Totals[block].H + Totals[block].A === 0;
                }
            }
        }

        return show;
    }

    var data = {}

    var obj = this.match;

    data.ppos = this.showresult ? 1 : 2;
    data.type = obj.gbcode.type;

    data.player = {
        id: obj.playerid,
        gbcode: obj.remotedata.gbcode,
        rmsid: obj.remotedata.id
    };

    if(data.type === 'D') {
        var pobj = GBCodes[obj.partner];
        data.partner = {
            id: pobj.playerid,
            gbcode: pobj.remotedata.gbcode,
            rmsid: pobj.remotedata.id
        };
    };

    this.json = data;
}

function getLegendItemView(params)
{
    var blockno = params.block;
    var pos = params.pos;

    var MTH = new MatchTeam(params, 'home', true);
    var MTA = new MatchTeam(params, 'away', true);

    var html = '';
    var rowid = 'row-' + blockno + '-' + pos;
    var norank = '';

// HOME TEAM COLUMNS

    // start row 1
    html += String.format('<div id="{0}" class="row legedit" data-blockno="{1}" data-pos="{2}">', rowid, blockno, pos);

    // home code: data-id = compteamperson-id, data-recid = remotematch-id
    html += String.format('<div id="code_{0}" class="{0} ms home code{1} {5}" data-id="{2}" data-recid="{3}" data-gcode="{0}" data-code="{6}">{4}</div>',
        MTH.match.gcode, MTH.res, MTH.pid, MTH.match.remotedata.id, MTH.brk, MTH.codedisabled, MTH.code);    // ,  encodeURI(JSON.stringify(MTH.json()))

    var clrdisabled = '';

    // rank (if applicable)
    if(MTH.prank > -1) {
        var hrank = MTH.prank == 0 ? NBSP : MTH.prank;
        clrdisabled = hrank == '' ? ' clrdisabled' : '';
        html += String.format('<div id="rank_{0}" class="{0} ms home rank{1}">{2}</div>', MTH.match.gcode, MTH.res, hrank, clrdisabled);
    }
    else {
        norank = 'nr';
    }

    // home player
    html += String.format('<div id="pname_{0}" class="{0} ms home pname{4}{1}">' +
        '<div id="psub_{0}" class="playersub"><span class="initials hidden {0}">{5}</span><span class="shortname {0}">{2}</span><span class="fshortname hidden {0}">{6}</span>' +
        '<span class="fullname {0}">{3}</span></div></div>', MTH.match.gcode, MTH.res, MTH.pshortname, MTH.pfullname, norank, MTH.pinitials, MTH.pfshortname);

    // home summary
    html += String.format('<div id="psum_{2}" class="{2} ms home summary score{0}">{1}</div>', MTH.res, NBSP, MTH.match.gcode);

// AWAY TEAM COLUMNS (REVERSED)

    // away summary
    html += String.format('<div id="psum_{2}" class="{2} ms away summary score{0}">{1}</div>', MTA.res, NBSP, MTA.match.gcode);

    // away player
    html += String.format('<div id="pname_{0}" class="{0} ms away pname{4}{1}">' +
        '<div id="psub_{0}" class="playersub"><span class="initials hidden {0}">{5}</span><span class="shortname {0}">{2}</span><span class="fshortname hidden {0}">{6}</span>' +
        '<span class="fullname {0}">{3}</span></div></div>', MTA.match.gcode, MTA.res, MTA.pshortname, MTA.pfullname, norank, MTA.pinitials, MTA.pfshortname);

    // rank (if applicable)
    if(MTA.prank > -1) {
        var arank = MTA.prank == 0 ? NBSP : MTA.prank;
        clrdisabled = arank == '' ? ' clrdisabled' : '';
        html += String.format('<div id="rank_{0}" class="{0} ms away rank{1}">{2}</div>', MTA.match.gcode, MTA.res, arank, clrdisabled);
    }

    // away code: data-id = compteamperson-id, data-recid = remotematch-id
    html += String.format('<div id="code_{0}" class="{0} ms away code{1} {5}" data-id="{2}" data-recid="{3}" data-gcode="{0}" data-code="{6}">{4}</div>',
        MTA.match.gcode, MTA.res, MTA.pid, MTA.match.remotedata.id, MTA.brk, MTA.codedisabled, MTA.code);

    // end row 1
    html += '</div>';   // row

    return html;
}

function getStatsItemView(params)
{
    var blockno = params.block;
    var pos = params.pos;

    var MTH = new MatchTeam(params, 'home', false);
    var MTA = new MatchTeam(params, 'away', false);

console.log(MTH);

    var hshowlink = MTH.showlink();
    var ashowlink = MTA.showlink();

    var hres = MTH.res;
    var ares = MTA.res;

// always need to show player links to enable FORFEIT and ABANDONED to be used
//    var hshowlink = true;
//    var ashowlink = true;
//console.log(params);

    var ignore = '';
    if(!params.showresult) {
////console.log(MatchTeams[blockno][MTH.match.partner]);
////console.log(MatchTeams[blockno][MTA.match.partner]);
        hshowlink = MatchTeams[blockno][MTH.match.partner].showlink();
        ashowlink = MatchTeams[blockno][MTA.match.partner].showlink();
        hres = MatchTeams[blockno][MTH.match.partner].res;
        ares = MatchTeams[blockno][MTA.match.partner].res;
        ignore = ' ignore';
    }

    var html = '';
    var rowid = 'row-' + blockno + '-' + pos;
    var norank = '';

// HOME TEAM COLUMNS

    var inprogress = MTH.match.remotedata.resultstatus == "2" ? " playingnow" : "";

    // start row 1
    html += String.format('<div id="{0}" class="row statsedit{3}" data-blockno="{1}" data-pos="{2}">', rowid, blockno, pos, inprogress);

    // home code: data-id = compteamperson-id, data-recid = remotematch-id
    html += String.format('<div id="code_{0}" class="{0} ms home code{1}" data-id="{2}" data-recid="{3}" data-gcode="{0}" data-code="{5}">{4}</div>',
        MTH.match.gcode, hres, MTH.pid, MTH.match.remotedata.id, MTH.brk, MTH.code);    // ,  encodeURI(JSON.stringify(MTH.json()))

    // rank (if applicable)
    if(MTH.prank > -1) {
        var rank = MTH.plyr === null ? '-' : (MTH.plyr.type > 1 ? '-' : MTH.prank);
        html += String.format('<div id="rank_{0}" class="{0} ms home rank{1}">{2}</div>', MTH.match.gcode, hres, rank);
    }
    else {
        norank = 'nr';
    }

    var mformat = (MTH.ismultiframe ? 'mf' : 'sf');

    // home player
    if(hshowlink) {
        html += String.format('<div id="pname_{0}" class="{0} ms home pname{7}{1}">' +
            '<div class="snocode home {6}">{5}</div>' +
            '<div id="psub_{0}" class="playersub showlink {4}">' +
                '<span class="initials hidden {0}">{8}</span><span class="shortname {0}">{2}</span><span class="fshortname hidden {0}">{9}</span>' +
                '<span class="fullname hidden {0}">{3}</span>' +
            '</div></div>', MTH.match.gcode, hres, MTH.pshortname, MTH.pfullname, MTH.orig, MTH.pshowcode, MTH.hidecode, norank, MTH.pinitials, MTH.pfshortname);
    }
    else {
        html += String.format('<div id="pname_{0}" class="{0} ms home pname{7}{1}">' +
            '<div class="snocode home {6}">{5}</div>' +
            '<div id="psub_{0}" class="playersub {4}">' +
                '<span class="initials hidden {0}">{8}</span><span class="shortname {0}">{2}</span><span class="fshortname hidden {0}">{9}</span>' +
                '<span class="fullname hidden {0}">{3}</span>' +
            '</div></div>', MTH.match.gcode, hres, MTH.pshortname, MTH.pfullname, MTH.orig, MTH.pshowcode, MTH.hidecode, norank, MTH.pinitials, MTH.pfshortname);
    }

    // home score
    html += String.format('<div id="result_{2}" class="{2} ms home active result score{0}{3} {4}">{1}</div>', hres, MTH.result, MTH.match.gcode, ignore, mformat);

// AWAY TEAM COLUMNS (REVERSED)

    // away score
    html += String.format('<div id="result_{2}" class="{2} ms away active result score{0}{3} {4}">{1}</div>', ares, MTA.result, MTA.match.gcode, ignore, mformat);

    // away player
    if(ashowlink) {
//         html += String.format('<div id="pname_{0}" class="{0} ms away pname{1}">' +
//            '<div id="psub_{0}" class="playersub showlink {4}"><span class="shortname {0}">{2}</span>' +
//            '<span class="fullname {0}">{3}</span></div></div>', MTA.match.gcode, ares, MTA.ShortName(), MTA.FullName(), MTA.OrigPlayer());

        html += String.format('<div id="pname_{0}" class="{0} ms away pname{7}{1}">' +
            '<div class="snocode away {6}">{5}</div>' +
            '<div id="psub_{0}" class="playersub showlink {4}">' +
                '<span class="initials hidden {0}">{8}</span><span class="shortname {0}">{2}</span><span class="fshortname hidden {0}">{9}</span>' +
                '<span class="fullname hidden {0}">{3}</span>' +
            '</div>' +
            '</div>', MTA.match.gcode, ares, MTA.pshortname, MTA.pfullname, MTA.orig, MTA.pshowcode, MTA.hidecode, norank, MTH.pinitials, MTH.pfshortname);
    }
    else {
//        html += String.format('<div id="pname_{0}" class="{0} ms away pname{1}">' +
//            '<div id="psub_{0}" class="playersub {4}"><span class="shortname {0}">{2}</span>' +
//            '<span class="fullname {0}">{3}</span></div></div>', MTA.match.gcode, ares, MTA.ShortName(), MTA.FullName(), MTA.OrigPlayer());

        html += String.format('<div id="pname_{0}" class="{0} ms away pname{7}{1}">' +
            '<div class="snocode away {6}">{5}</div>' +
            '<div id="psub_{0}" class="playersub {4}">' +
                '<span class="initials hidden {0}">{8}</span><span class="shortname {0}">{2}</span><span class="fshortname hidden {0}">{9}</span>' +
                '<span class="fullname hidden {0}">{3}</span>' +
            '</div>' +
            '</div>', MTA.match.gcode, ares, MTA.pshortname, MTA.pfullname, MTA.orig, MTA.pshowcode, MTA.hidecode, norank, MTH.pinitials, MTH.pfshortname);
    }

    // rank (if applicable)
    if(MTA.prank > -1) {
        var rank = MTA.plyr === null ? '-' : (MTA.plyr.type > 1 ? '-' : MTA.prank);
        html += String.format('<div id="rank_{0}" class="{0} ms away rank{1}">{2}</div>', MTA.match.gcode, ares, rank);
    }

    // away code: data-id = compteamperson-id, data-recid = remotematch-id
    html += String.format('<div id="code_{0}" class="{0} ms away code{1}" data-id="{2}" data-recid="{3}" data-gcode="{0}" data-code="{5}">{4}</div>',
        MTA.match.gcode, ares, MTA.pid, MTA.match.remotedata.id, MTA.brk, MTA.code);

    // end row 1
    html += '</div>';   // row

    if(typeof MatchTeams[blockno] === 'undefined') { MatchTeams[blockno] = {}; }
    MatchTeams[blockno][MTH.match.gcode] = MTH;
    MatchTeams[blockno][MTA.match.gcode] = MTA;

// ADD ADVANCED SCORE BOX BENEATH GAME ROW

//    if((MTH.json.ppos === 2 && MTH.json.type == 'D') || (MTH.json.ppos == 1 && MTH.json.type == 'S'))
//    {
        var inputid = 'input-' + blockno + '-' + pos;
//        if(MTH.json.ppos === 2) {
//            inputid = 'input-' + blockno + '-' + (pos - 1);
//        }
        // start row 2
        html += String.format('<div id="{0}" class="scoreparent" data-blockno="{1}" data-pos="{2}" data-delay="0" data-mformat="{3}" style="display:none;">'
            , inputid, blockno, pos, mformat);

        // score panel
        html += '<div class="scorecontainer">';

        // end row 1
        html += '</div></div>';   // row
//    }

    return html;
}

function getGBCode(obj) {
    var parts = $(obj).attr("id").split("_");
    var myobj = GBCodes[parts[1]];
    if(typeof myobj === 'undefined') {
        return null;
    }
    return myobj;
}

function getPlayerSubContainer(obj, json, closebtn)
{
/*
    appmethod: "1"
    autoclosetime: "5000"
    block1autolock: "1"
    canswitchpositions: 0       // deprecated
    hasrankings: "1"
    lockgameblocks: 0
    locklegends: 0
    subinoroutonly: "1"
    subsallsremainingspots: "1"
    ​​undoprompt: "1"
 */
console.log('getPlayerSubContainer');

    var id = $(obj).attr('id');
    var cobj = '#' + id.replace('psub','code');
    var gcode = $(cobj).data('gcode');
    var gbc = GBCodes[gcode];
    var hora = gbc.hora;

    var curpid = 0;
    if(isset(gbc.playerid)) {
        curpid = parseInt(gbc.playerid);
    }

    console.log('checking for previous player[0]');
    if(isset(Teams[hora].players[0])) {
        console.log('removing previous player[0]');
        delete Teams[hora].players[0];
        delete Teams[hora].sublist[0];
    }
console.log(Teams[hora].players);

    var PlyrList = Teams[hora].players;
    var SubList = Teams[hora].sublist;

    // STEP 1: build the subs list, flag everyone as selectable
    $.each(PlyrList, function(pid, pobj)
    {
        // sub list only contains normal players who have been selected in the legend
        if(pobj.pos > -1) {
            SubList[pid] = pobj;
            SubList[pid].show = 1;
        }
    });

console.log(SubList);

    var blockno = parseInt(gbc.blockno);

    if(parseInt(Data.config.subinandout) === 0) {

        console.log('---------------------------');
        console.log('** Current Block (' + blockno + ') **');

        if(parseInt(Data.config.subsallsremainingspots) === 0)
        {
            // SUBS ARE ADDED TO THIS ROUND ONLY
            // block always starts with incumbent players
            // sub list will show only players that do not currently appear

            // get players from legend
            var excl = {};
            console.log('curcode=' + gbc.code);
            $.each(Spots[blockno][hora], function(code, gbdata) {
                var origcode = code;
                var selcode = gbdata.playercode;
                console.log(origcode + " " + selcode);
                if(origcode !== selcode) {        // selected player is original player, only sho
                    console.log('ex1=' + selcode);
                    excl[selcode] = gbdata.playerid;
                    if(origcode !== gbc.code) {
                        console.log('ex2=' + origcode);
                        excl[origcode] = gbdata.id;                // incumbent players cannot be subbed in
                    }
                }
                else {
                    console.log('ex3=' + code);
                    excl[code] = gbdata.id;                // incumbent players cannot be subbed in
                }
            });
            console.log(excl);
            SubList = {};
            $.each(Spots[1][hora], function(lc, sb) {
                if(typeof excl[lc] === 'undefined') {
                    if(sb.playerid > 0) {
                        SubList[sb.playerid] = Teams[hora].players[sb.playerid];
                        SubList[sb.playerid].show = 1;
                    }
                }
            });
            console.log(SubList);
        }
        else {
            // SUBS ARE COPIED INTO ALL REMAINING BLOCKS
            //
            // STEP 2a: go through all positions in the current block and deselect players if they appear
            $.each(Spots[blockno][hora], function(code, gbdata) {
                var pid = gbdata.playerid;
                if(pid > 0) {
                    if(SubList[pid].show == 1) {
                        console.log('--> Removing: ' + PlyrList[pid].fullname);
                        SubList[pid].show = 0;
                    }
                    else {
                        console.log('--> SHOWING: ' + PlyrList[pid].fullname);
                    }
                }
            });

            // STEP 2: go through all positions in the prev block and deselect players if they appear
            var prevblock = Data.gameblocks[blockno].prevblock;

            if(prevblock > 0) {
                console.log('---------------------------');
                console.log('** Previous Block (' + prevblock + ') **');
                $.each(Spots[prevblock][hora], function(code, gbdata) {
                    var pid = gbdata.playerid;
                    if(SubList[pid].show == 1) {
                        console.log('--> Removing: ' + PlyrList[pid].fullname);
                        SubList[pid].show = 0;
                    }
                });

                // STEP 3: find current selection and if not matching code from prevblock make the previous player in this position re-selectable
                var currplayer = Spots[blockno][hora][gbc.code];
                var prevplayer = Spots[prevblock][hora][gbc.code];

                console.log('Current Player is ' + currplayer.playercode + ' in Pos = ' + currplayer.code);

                if(typeof prevplayer != 'undefined') {
                    console.log('Prev Player in Pos = ' + prevplayer.code + ' is ' + prevplayer.code);

                    if(currplayer.playercode != prevplayer.playercode) {
                        var pid = prevplayer.playerid;
                        console.log('---------------------------');
                        console.log('** Adding incumbent player to list for re-selection **');
                        console.log('--> Adding: ' + PlyrList[pid].fullname);
                        SubList[pid].show = 1;
                    }
                }
            }
        }
    }

    var hhtml = '';
    var ahtml = '';

    var html = String.format('<div class="player-sublist-head" data-gcode="{0}">', gbc.gcode);

    console.log('---------------------');
    console.log('** Selectable Subs **');
    console.log('** curpid = ' + curpid + ' **');

    if(Data.gameblocks[blockno].popfromlegend == "0") {

        if(curpid > 0) {

            var undo = new Player();

            undo.firstname = "Undo";
            undo.fullname = "Undo";
            undo.fshortname = "Undo";
            undo.shortname = "Undo";
            undo.initials = "Undo";
            undo.teamid = Teams[hora].teamid;
            undo.id = 0;

            SubList[undo.id] = undo;
            SubList[undo.id].show = 1;
            if(udc(Teams[hora].players[undo.id])) {
                Teams[hora].players[undo.id] = undo;
            }
        }
    }

//console.log(SubList);

    var selsubs = 0;
    $.each(SubList, function(pos, pobj)
    {
        // get rank, check points total, flag potential sub if will breach points limits
        // if player in previous block AND Data.settings.subinoroutonly = "1"

        if(pobj.show == 1)
        {
console.log('Pos: ' + pos);
console.log(pobj);

            var pid = pobj.id;
            var plyr = pobj;

            if(isset(PlyrList[pid])) {
                plyr = PlyrList[pid];
            }

            var comment = ' ==> ' + plyr.fullname;
//            var disabled = '';
//            var rankalert = '';
//            var desc = '';

            var rank = -1;
            var newrank = -1;

            var currTot = 0;
            var newTot = 0;

            if(Data.config.hasrankings === '1') {
                if(typeof PlyrList[curpid] !== 'undefined') {
                    if(PlyrList[curpid].type == 1) {
                        rank = typeof PlyrList[curpid] === 'undefined' ? 0 : parseInt(PlyrList[curpid].rank);
                        newrank = PlyrList[pid].rank;
                        currTot = RankTotals[blockno][hora];
                        newTot = currTot - rank + parseInt(newrank);
                        if(newTot > RankTotals[blockno].max && RankTotals[blockno].max > 0) {
                            rankalert = ' rankalert';
                            desc = ' - rank points over max';
                        }
                    }
                }
                comment += ' (Old Total = ' + currTot + ', New Total = ' + newTot + ')';
            }

//            console.log(plyr);
/******************************************************/

            if(plyr.id === 0) {
                if(hora === "H") {
                    hhtml = PlayerSubRow(hora, plyr, blockno) + hhtml;
                }
                else {
                    ahtml = PlayerSubRow(hora, plyr, blockno) + ahtml;
                }
            }
            else {
                if(hora === "H") {
                    hhtml += PlayerSubRow(hora, plyr, blockno);
                }
                else {
                    ahtml += PlayerSubRow(hora, plyr, blockno);
                }
            }

            // HOME TEAM COLUMNS
            selsubs++;
/******************************************************/

        }

    });

    if(selsubs === 0) {
        if(hora === "H") {

            hhtml += PlayerSubRow(hora, null, blockno);
        }
        else {

            ahtml += PlayerSubRow(hora, null, blockno);
        }
    }

    var hcolor = '';
    var acolor = ''

    if(hhtml.length > 0)
    {
        hhtml = html + hhtml + closebtn + '</div></div>';
        hcolor = 'background-color: rgb(255,255,180);'
    }
    if(ahtml.length > 0)
    {
        ahtml = html + ahtml + closebtn + '</div></div>';
        acolor = 'background-color: rgb(255,255,180);'
    }

    var xhtml = String.format('<table style="width:100%;"><tr><td style="width:50%;{2}">{0}</td><td style="width:50%;{3}">{1}</td></tr></table>',
        hhtml, ahtml, hcolor, acolor);

    return xhtml;
//    return '<p>players subs go here</p>';
}

function PlayerSubRow(hora, plyr, block)
{
    var code = '';
    var side = hora === 'H' ? 'home' : 'away';
    var rank = '';
    var row = [];
    var pcode = '';
    var pid = 0;
    var psn = 'No Subs Available';
    var pinit = 'No Subs Available';
    var pfsn = 'No Subs Available';
    var pfn = 'No Subs Available';
    var subsel = 'none';

//console.log(plyr);

    if(plyr !== null) {
        code = plyr.type > 2 ? '-' : getShowCode(Teams[hora].teamcode, plyr.code, block);
        side = hora === 'H' ? 'home' : 'away';
        rank = plyr.type > 1 ? '-' : plyr.rank;
        pid = plyr.id;
        pcode = plyr.code;
        psn = plyr.shortname;
        pfsn = plyr.fshortname;
        pinit = plyr.initials;
        pfn = plyr.fullname;
        subsel = '';
    }

    // code: data-id = compteamperson-id, data-recid = remotematch-id
    row[0] = String.format('<div id="code_{0}" class="msub {2} code" data-id="{1}">{3}</div>', pcode, pid, side, code);    // ,  encodeURI(JSON.stringify(MTH.json()))

    // rank (if applicable)
    row[1] = String.format('<div id="rank_{0}" class="msub {2} rank">{1}</div>', pcode, rank, side);

    // player
    row[2] = String.format('<div id="pname_{0}" class="{0} msub {3} pname">' +
        '<div id="plyrsub_{0}" class="plyrsub">' +
        '<span class="initials hidden">{5}</span>' +
        '<span class="shortname">{1}</span>' +
        '<span class="fshortname hidden">{4}</span>' +
        '<span class="fullname hidden">{2}</span></div></div>', pcode, psn, pfn, side, pfsn, pinit);

    // score
    row[3] = String.format('<div id="result_{0}" class="msub {2} result score">{1}</div>', pcode, NBSP, side);


    // start row 1
    var html = '<div class="row statsedit subselect ' + subsel + '">';

    if(hora === 'H') {
        html += row[0] + (Data.config.hasrankings === '1' ? row[1] : '') + row[2] + row[3];
    }
    else {
        html += row[3] + row[2] + (Data.config.hasrankings === '1' ? row[1] : '') + row[0];
    }

    html += '</div>';

    return html;
}

function getScoreContainer(hcode, acode, closebtn, hscore, ascore)
{
    var maxframes = parseInt(GBCodes[hcode].gbcode.maxframes);
    var racetomax = parseInt(GBCodes[hcode].gbcode.isracetomax);

    var multiframe = maxframes > 1;

    var frames = 'UNKNOWN';

    var lsview = CPage.param === 'readOnly';

    if(racetomax === RTM_PLAYALLMAXFRAMES) {
        frames = "P/A " + maxframes + ":";   //.' frame'.($maxframes != 1 ? 's' : '');
    }
    else if(racetomax === RTM_BESTOFMAXFRAMES) {
        max = parseInt((maxframes + 1) / 2);
        frames = "B/O " + maxframes + ":";    // .' frames';
    }
    else if(racetomax === RTM_RACETOMAXFRAMES) {
        frames = "R/T " + maxframes + ":";  //.' frames';
    }

    var htag = getWinTypes(); // {'mb':{'enabled': 0}, 'ms': {'enabled': 0}, 'mc': {'enabled': 0}};

    var html = '<table style="width:100%;text-align:center;margin-top:10px;">';

/* BIG SCORE DISPLAY: MULTI-FRAME ONLY */

    if(multiframe && Teams.myistwa && lsview === false) {
        html += String.format('<tr class="sc-scorebox"><td class="mfscore {0}" style="width:50%;text-align:center;"><div id="bigresult_{1}" class="mfscorebox {0}">{2}</div></td>', 'home', hcode, hscore) +
            String.format('<td style="width:50%;text-align: center;"><div id="bigresult_{1}" class="mfscorebox {0}">{2}</div></td>', 'away', acode, ascore) + '</tr>';
    }

/* SEQUENCE SECTION: MULTI-FRAME ONLY */

    if(multiframe)
    {
        html += String.format('<tr class="sc-sequence"><td colspan="2"><div id="sequence_{0}" class="scoresequence mf">' +
            '<div><div class="matchformatdesc">{1}</div><div id="seqitems_{0}"></div></td></tr>', hcode, frames);

        html += '<tr class="sc-sequence" style="text-align:left;font-size:0.8em;"><td colspan="2">' +
            '<a href="" class="sc-seqinfolink off hidden">Info</a>' +
            '<div class="sc-sequenceinfo">' +
            '<b>Frame Sequence:</b> shows boxes for the sequence in which frames were won, in order, from left to right. ' +
            'The box with a black border indicates the last frame played.<br />' +
            '<span style="color:#2196F3;">Blue Box = Home Player</span><br />' +
            '<span style="color:red;">Red Box = Away Player</span><br />' +
            'A letter in a box indicates a win that was not usual (ie B = Master Break)</br /><a class="sc-seqinfolink" href="">Hide</a></div></td></tr>';
    }

/* MAIN BUTTON ROW */

    if(Teams.myistwa && lsview === false) {
        html += '<tr class="sc-extended">' +
            '<td style="width:50%"><div id="team_' + hcode + '" class="advscore home">' + createNavbarNew(multiframe, 'home', htag) + '</div></td>' +
            '<td style="width:50%"><div id="team_' + acode + '" class="advscore away">' + createNavbarNew(multiframe, 'away', htag) + '</div></td>' +
        '</tr>';
    }

/* FINALISE MATCH BUTTON ROW: MULTI-FRAME ONLY */

    if(multiframe)
    {
        html += '<tr class="finishrow hidden">' +
            '<td colspan="2"><div id="team_' + hcode + '" class="advscore finish">' +
                '<button type="button" class="finish ui-btn clr-btn-green">FINISH GAME</button>' +
            '</div></td>' +
        '</tr>';
    }

/* MORE OPTIONS SECTION */

    html += '<tr>' +
            '<td style="vertical-align:top;"><div id="team_' + hcode + '" class="morescore home">' + createMoreNavbar(multiframe, htag, 'home') + '</div></td>' +
            '<td style="vertical-align:top;"><div id="team_' + acode + '" class="morescore away">' + createMoreNavbar(multiframe, htag, 'away') + '</div></td>' +
        '</tr>';

    return html + '</table>' + closebtn;
}

function getWinTypes()
{
    var htag = {} ; // {'mb':{'enabled': 0}, 'ms': {'enabled': 0}, 'mc': {'enabled': 0}};
    $.each(Data.hashtags, function(ht, data) {
        if(typeof data.enabled === 'string' && data.enabled === '1')
        {
//            if(o.hashtagtypeid === "1" && o.enabled === "1") {
            var wc = data.hashtag[1].toUpperCase();
            if(udc(htag[wc]) && data.hashtagtypeid == '1') {
                htag[wc] = {'code': data.hashtag, 'descr': data.comment};
            }
        }
    });

    console.log("HASHTAGS:WINTYPES");
    console.log(htag);

    return htag;
}

function createNavbarNew(multiframe, side, extrabtns)
{
    var html = '';

    var rows = [];

    if(multiframe) {
        html += '<table style="width:100%;"><tr>';

        rows.push('<td style="width:50%;">' + getButton("W", "wstd", "mf", side, "WIN") + '</td>');
        rows.push('<td style="width:50%;">' + getButton("U", "undo", "mf", side, "UNDO") + '</td>');
    }
    else {
        $.each(extrabtns, function(k,o) {
            rows.push(getButton(k, "w" + o.code, "sf", side, o.code.toUpperCase()));        //o.code[1].toUpperCase()
        });
    }

    for(var i = 0; i < rows.length; i++) {
        html += rows[i];
    }

    html += (multiframe ? '</tr></table>' : '');

    return html;
}

function getButton(rcode, bcode, fmt, side, text) {
    var btncolor = SEQ_BTN_HOME;      // blue
    if(side==='away') {
        btncolor = SEQ_BTN_AWAY;     // red
    }
    var btnformat = 'ui-btn ui-mini ' + (fmt == 'sf' ? 'ui-btn-inline' : '');
    return String.format('<button type="button" data-rescode="{0}" class="advres {1} {2} {5} {6} clr-btn-{3}">{4}</button>',
        rcode, bcode, fmt, btncolor, text, side, btnformat)
}

function createMoreNavbar(multiframe, extrabtns, side)
{
    var html = '';
    var btncolor = SEQ_BTN_HOME;      // blue
    if(side==='away') {
        btncolor = SEQ_BTN_AWAY;     // red
    }
    var hrows = [];

    if(multiframe) {
        $.each(extrabtns, function(k, o) {
            var btnclass = "w" + o.code;
            var btndesc = o.descr + " (" + k + ")";
            hrows.push(getMenuItem(k, btnclass, "mf sf", side, "<span style='color:blue;'>Frame</span>: " + btndesc, false));
        });

//        hrows.push(getMenuItem("F", "wfft", "mf sf", side, "<span style='color:blue;'>Frame</span>: Won by Forfeit (F)", false));
//        hrows.push(getMenuItem("A", "ab", "mf sf", side, "<span style='color:blue;'>Frame</span>: Abandon (A)", false));

//        hrows.push(getMenuItem("F", "gfft", "mf sf", side, "<span style='color:black;font-weight:bold;'>Game</span>: Won by Forfeit (F)", true));
        hrows.push(getMenuItem("A", "gab", "mf sf", side, "<span style='color:black;font-weight:bold;'>Game</span>: Abandon (A)*", false));
    }
    else {
        hrows.push(getMenuItem("F", "wfft", "mf sf", side, "Won by Forfeit (F)", false));
        hrows.push(getMenuItem("A", "ab", "mf sf", side, "Abandon (A)", false));
    }

    html += '<div class="moremenu">';

    if(hrows.length > 0) {
        html += '<button id="closemorebtn_' + side + '" type="button" class="closemorebtn ui-btn ui-mini clr-btn-' + btncolor + '">' +
            '<i class="zmdi zmdi-chevron-down"></i></button>';
        for(var i = 0; i < hrows.length; i++) {
            html += hrows[i];
        }
    }

    html += '</div>';   // </div></div>

    return html;
}

function getMenuItem(rcode, bcode, fmt, side, text, topsep) {
    return String.format('<div data-rescode="{0}" class="advres more {3} {1} {2} {5} hidden">{4}</div>', rcode, bcode, fmt, side, text, (topsep ? 'topsep' : ''))
}

function updateMatchScorePanel(page)
{
    console.log('updateMatchScorePanel(' + page + ')');

    calcTotals();

    var hteam = Teams.my.shortname; // + ' : ' + Totals[0].H.toString();
    var ateam = Teams.other.shortname;

    if(Teams.my.team == "A") {
        hteam = Teams.other.shortname;
        ateam = Teams.my.shortname;
    }

    var matchscore = '<table width="100%">' +
        '<tr>' +
            '<td class="scorepanelteamname" style="width:48%;text-align:right;overflow:hidden;" class="ar">' + hteam + '</td>' +
            '<td style="cursor:pointer;width:4%;">' +
                '<span class="score">' + TeamTotal("H") + '</span><span class="score">:</span><span class="score">' + TeamTotal("A") +'</span>' +
            '</td>' +
            '<td class="scorepanelteamname" style="width:48%;text-align:left;overflow:hidden;">' + ateam +'</td>' +
        '</tr></table>';

//    $(".resultsheader").removeClass('finalise showscore');

    $("#resultsheader").html(matchscore);

    if(Teams.H.data.remotestatusid == "3" || Teams.H.data.remotestatusid == "3") {
        $("#refreshresults").addClass("hidden");
    }

    // Public Users
    if(CPage.param == 'readOnly') {
        $(".finalisenow").addClass('hidden');
    }
    else {

        if(Totals[0].unplayed === 0 && page === 'results') {

            // if there is an optional block that is not used and scores are level, neeed to play optional block
            $(".finalisenow").removeClass('twa twla wait ok done hidden');
            $(".refreshresults").removeClass('wait');                   // push down the page
            $(".mycontent").removeClass('wait2').addClass('wait');      // push down the page

            // Match is tied, show TIEBREAKER instead of finalise now message
            if(Totals[0].disabled > 0 && (Totals[0].H === Totals[0].A))
            {
                $(".finalisenow").addClass('tiebreaker');
                $(".finalisenow").text("Scores tied, Play Tiebreaker")
            }
            else {

//console.log('Last Update: ' + getLastResultUpdateSecs());

                if(Teams.myistwa) {

                    // TWA and FINALISED: display COMPLETED and make sheet read only
                    // refreshing NO
                    if(Teams.twa.data.remotestatusid == "3") {
                        $(".finalisenow").text("COMPLETED");
                        $(".finalisenow").addClass('done');
                    }
                    else {

                        // TWA and yet to FINALISE: display MSG
                        // refreshing NO
                        $(".finalisenow").addClass('twa');
                        $(".finalisenow").text("Click HERE to FINALISE");
                    }
                }
                else {

                    // TWLA and FINALISED: display COMPLETED and make sheet read only
                    // refreshing NO
                    if(Teams.twla.data.remotestatusid == "3") {
                        $(".finalisenow").text("COMPLETED");
                        $(".finalisenow").addClass('done');
                    }
                    else {
                        $(".finalisenow").addClass('twla');
                        $(".refreshresults").addClass("wait");
                        $(".mycontent").removeClass('wait').addClass('wait2');

                        // TWLA and not finalised, TWA has FINALISED: make sheet readonly
                        // refreshing YES
                        if(Teams.twa.data.remotestatusid == "3") {   // finalised
                            $(".finalisenow").addClass('ok');
                            $(".finalisenow").text("Click HERE to FINALISE");
                        }
                        else {
                            // TWLA and not finalised, TWA has not FINALISED: show WAIT message
                            // refreshing YES
//                            var now = parseInt($.now() / 1000);
//                            var lastUpdate = 0;
//                            if(parseInt(Data.config.finalisedelaymins) > 0) {
//                                lastUpdate = getLastResultUpdate();
//                            }
                            var secs = getLastResultUpdateSecs();

                            $(".finalisenow").addClass('wait');

                            if(secs === -1) {
                                $(".finalisenow").html("Waiting for Other Team to Finalise");
                            }
                            else {
                                if(secs > 0) {
                                    $(".finalisenow").html('You can Finalise in <span id="finaliseupdate" data-secs="' + secs + '">' + formatSeconds(secs) + '</span>');
                                    FinaliseInterval = setInterval(countdownFinalise, 1000);
                                }
                                else {
                                    $(".finalisenow").removeClass('wait').addClass('ok');
                                    $(".finalisenow").html("Click HERE to FINALISE");
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            $(".finalisenow").addClass('hidden');
            $(".refreshresults").removeClass('wait');
            $(".mycontent").removeClass("wait wait2");
        }

    }

}

function formatSeconds(secs) {

    var tm = '';
    if(secs === 0) {
        return '0s';
    }
    if(secs > 60) {
        var min = parseInt(secs / 60);
        secs = secs - (min * 60);
        tm += min + 'm ';
    }
    if(secs > 0) {
        tm += secs + 's';
    }
    return tm;
}

function playerOptions(gbcode, mt, pos, playerlegcode)
{
    var GBC = GBCodes[gbcode];
    var id = GBC.playerid;
    var p = Players[id]
    var player = "Select Player...";
    var recid = GBC.remotedata.id;
    var poslegcode = "none";
    var hora = gbcode.substr(0,1);

    var teamid = Teams[hora].teamid;

    var newstyle = '';
    if(p !== undefined) {     // ie: LegendCodes["C"]
        poslegcode = gbcode.substr(1,1);
        player = p.fullname + (Data.config.hasrankings == "1" ? ' (' + p.rank + ')' : '');
// if player is not in correct legend spot, show actual legend position after name
// console.log(gbcode + " Pos: " + poslegcode + " - Player: " +  playerlegcode);
        if(poslegcode != playerlegcode) {
            newstyle = ' style="color:blue;"';
            player = p.legendcode.substr(1,1) + ": " + player;
        }
        if(p.type == "2") {
            player = p.fullname;
        }
    }

    var html = '<div class="col-xs-7 pname">';

        //player link
        html += String.format('<a id="player_{0}" class="playeropt {5}" href="#popupPlayer_{0}" data-rel="popup" data-orig="{1}" ' +
            'data-id="{2}" data-recid="{3}" {4}>{1}</a>', gbcode, player, id, recid, newstyle,(hora == "H" ? "home" : "away"));

        //popup player list
        html += String.format('<div data-role="popup" id="popupPlayer_{0}" data-code="{0}" class="playerpopup">', gbcode);

            html += String.format('<ul id="popupPlayerList_{0}" data-role="listview" data-inset="true" style="min-width:210px;" class="playerlistview">', gbcode);

                $.each(Legend[teamid], function(k, o) {
                    if(o.playerid > 0) {
                        var style = '';
                        var p = Players[o.playerid];
                        html += String.format('<li class="player_{3}"><a href="#" class="playersel" data-icon="false" {0} data-rank="{1}" data-code="{2}" ' +
                            'data-id="{3}" data-player="{4}">{2}: {4}' + (Data.config.hasrankings == 1 ? ' ({1})' : '') + '</a></li>', style, p.rank, o.code, o.playerid, p.fullname);
                    }
                });

                html += '<li class="player_FFT-' + hora + '"><a href="#" class="playersel" data-icon="false"  data-rank="0" data-code="." ' +
                    'data-id="FFT-' + hora + '" data-player="FORFEIT">FORFEIT</a></li>';
            //
//                html += '<li class="player_ABN-' + hora + '"><a href="#" class="playersel" data-icon="false" data-rank="0" data-code="." ' +
//                    'data-id="ABN-' + hora + '" data-player="ABANDONED">ABANDONED</a></li>';

            html += '</ul>';
        html += '</div>';   // data-role="popup"
    html += '</div>';       // table cell: col-xs-7

    return html;
}

//function lockStatsBlock(blockno, lockstatus)
//{
//    var html = '';
//
//    if(Data.config.appmethod == METHOD_DUAL_AUTH)
//    {
//        html += '<div id="blocklock' + blockno + '" class="blocklock" style="width:100%;">';
//        html += '<div id="navlockbar_' + blockno + '" style="overflow:auto;">';
//        html += '<div class="navul navul_' + blockno + '" data-block="' + blockno + '">';
//
//        var myid = Teams.my.teamcode + '-' + blockno;
//        if(Blocks[blockno].mysublocked === 0){
//            html += '<button id="' + myid + '" class="navblock ' + Teams.my.teamcode +
//                    ' ui-btn clr-btn-teal ui-btn-inline">LOCK MY SUBS</button>';                        // MINE LOCKED (DISABLED)
//        }
//        else {
//            html += '<button id="' + myid + '" class="navblock ' + Teams.my.teamcode +
//                    ' ui-btn clr-btn-orange ui-btn-inline ui-disabled">MY SUBS LOCKED</button>';                        // MINE LOCKED (DISABLED)
//        }
//        var otherid = Teams.other.teamcode + '-' + blockno;
//        if(Blocks[blockno].othersublocked === 0){
//            html += '<button id="' + otherid + '" class="navblock ' + Teams.other.teamcode +
//                    '  ui-btn clr-btn-teal ui-btn-inline ui-disabled">OTHER SUBS OK</button>';     // UNLOCK OTHER (ENABLED)
//        }
//        else {
//            html += '<button id="' + otherid + '" class="navblock ' + Teams.other.teamcode +
//                    '  ui-btn clr-btn-orange ui-btn-inline">UNLOCK OTHER SUBS</button>';     // UNLOCK OTHER (ENABLED)
//        }
//
//        html += '</div></div></div>';
//    }
//    else if(Data.config.lockgameblocks == "1")
//    {
//        // only create the lock blocks if either or both teams have subs, if neither have subs, do not have lock blocks
//        if(Teams.my.subcount > 0 || Teams.other.subcount > 0) {
//
////            console.log(lockstatus);
//
//            var status = 'locked';
//            var myid = 'btnblocklock-' + blockno;
//            var btn;
//
//            if(Blocks[blockno].mysublocked === 0){
//                btn = String.format('<button id="{0}" data-blockno="{1}" data-status="0" data-auto="0" ' +
//                    'class="navblockwide ui-btn clr-btn-teal ui-btn-inline">LOCK SUBS</button>', myid, blockno);
//                status ='unlocked';
//                lockstatus = 0;
//            }
//            else {
//                btn = String.format('<button id="{0}" data-blockno="{1}" data-status="1" data-auto="0" ' +
//                    'class="navblockwide ui-btn clr-btn-orange ui-btn-inline">UNLOCK SUBS</button>', myid, blockno);
//                lockstatus = 1;
//            }
////            btn += '<a class="TeamLoginBL" href="#dlgTeamLoginBL" id="' + myid + '" data-rel="popup"></a>';
//
//            html += '<div id="blocklock-' + blockno + '" class="blocklock" data-status="' + status + '" style="width:100%;">';
//            html += '<div id="navlockbar_' + blockno + '" style="overflow:auto;">';
//            html += '<div class="navul navul_' + blockno + '" data-block="' + blockno + '">';
//
//            html += btn;
//
//            html += '</div></div></div>';
//        }
//    }
//    return html;
//}

function LegendSaveCount() {

    var PlaySet = {};

console.log('LegendSaveCount');

    var tcode = Teams.my.teamcode;
    var otcode = Teams.other.teamcode;

    PlaySet[tcode] = 0;
    PlaySet[otcode] = 0;

    $.each(['H','A'], function(k, hora) {

        //enumerate the players to check if both legends are populated
        $.each(Players[hora], function(pk, pv) {
            if(pv.pos !== -1) {
                if(Teams.my.team === hora) {
                    PlaySet[tcode] = PlaySet[tcode] + 1;
                }
                else {
                    PlaySet[otcode] = PlaySet[otcode] + 1;
                }
            }
        });
    });

    Teams.my.selplayers = PlaySet[tcode];
    Teams.other.selplayers = PlaySet[otcode];

    var msg = {
        id: 2,
        title: "Matchsheet not Ready",
        text: "",
        myteam: {
            id: tcode,
            hora: Teams.my.team,
            total: PlaySet[tcode],
            subs: 0
        },
        otherteam: {
            id: otcode,
            hora: Teams.other.team,
            total: PlaySet[otcode],
            subs: 0
        }
    }

//    if(Data.config.locklegends == "0")  {
//        if(PlaySet[tcode] === 0 && PlaySet[otcode] === 0) {
//            msg.text = "Legends for BOTH TEAMS have not been saved";
//            msg.id = 0;
//        }
//        else if(PlaySet[tcode] === 0) {
//            msg.text = "Legend for <b>" + Teams.my.teamname + "</b> team has not been saved";
//            msg.id = 1;
//        }
//        else if(PlaySet[tcode] === 0) {
//            msg.text = "Legend for <b>" + Teams.other.teamname + "</b> has not been saved";
//            msg.id = 1;
//        }
//    }
//    else {  // (Data.config.locklegends == "1")  {
//        if(Data.remote.legendlock === 0 && Data.remoteother.legendlock === 0) {
//            msg.text = "Legends for BOTH TEAMS have not been LOCKED";
//            msg.id = 0;
//        }
//        else if(Data.remote.legendlock === 0) {
//            msg.text = "Legend for <b>" + Teams.my.teamname + "</b> team has not been LOCKED";
//            msg.id = 1;
//        }
//        else if(Data.remoteother.legendlock === 0) {
//            msg.text = "Legend for <b>" + Teams.other.teamname + "</b> has not been LOCKED";
//            msg.id = 1;
//        }
//    }

console.log(PlaySet);

    return msg;
}

function playerSubList(obj)
{
    var id = $(obj).attr('id');
    var cobj = '#' + id.replace('psub','code');
    var gcode = $(cobj).data('gcode');
    var gbc = GBCodes[gcode];

    // STEP 1: get full list of players
    var allplayers = {};
    $.each(Teams[gbc.hora].players, function(pid, pobj)
    {
        allplayers[pid] = pobj;
    });

    var usedpids = {};

    // STEP 2: go through all positions in the prev block and tag the players as no-show if they appear
    var blockno = parseInt(gbc.blockno);
    var prevblock = Data.gameblocks[blockno].prevblock;
    $.each(Spots[prevblock][gbc.hora], function(code, gbdata) {
        var pid = gbdata.playerid;
        usedpids[pid] = gbdata;
    });
    console.log('allplayers');
    console.log(allplayers);
    console.log(usedpids);

    // STEP 3: find current selection and if not matching code from prevblock make it selectable
    var currplayer = Spots[blockno][gbc.hora][gbc.code];
    var prevplayer = Spots[prevblock][gbc.hora][gbc.code];
    console.log('Current Player is ' + currplayer.playercode + ' in Pos = ' + currplayer.code);
    console.log('Prev Player in Pos = ' + currplayer.code + ' is ' + prevplayer.code);

    if(currplayer.playercode != prevplayer.code) {
        delete usedpids[prevplayer.playerid];
    }

}

function getSelectablePlayerList(obj, func)
{
    console.log(func + ' --> getSelectablePlayerList');
    console.log(obj);

    var gcode = $(obj).data("gcode");
    var gbc = GBCodes[gcode];
    var hora = gbc.hora;
    var homeaway = (hora == "H" ? "home" : "away");
    var rowcode = gbc.code;     //gcode.substr(1,1);

    var list = {};
    var blockno = parseInt(gbc.blockno);

    // get the players in the current block and the previous block - these form the list of players that cannot be selected
//    var blocks = [];

//    var bPlayers = {};
    var mblocks = {};
    mblocks[blockno] = $("#matchset" + blockno).find('.playeropt.' + homeaway);
    var prevno = Data.gameblocks[blockno].prevblock;

    if($("#matchset" + prevno).length > 0) {
        mblocks[1] = $("#matchset" + prevno).find('.playeropt.' + homeaway);
    }
    console.log(mblocks)
    $.each(mblocks, function(bno, rows) {
        console.log('BLOCK ' + bno);
        $.each(rows, function(key, mobj) {
//            console.log($(mobj).closest('div.row'));
            var code = $(mobj).closest('div.row').attr("data-gbcode");
            console.log(code + " " + $(mobj).attr("data-id"));
            if(code.substr(1,1) != rowcode) {
                var pid = parseInt($(mobj).attr("data-id"));
                console.log('pid = ' + pid + ": " + code + " " + $(mobj).text());
                if(pid > 0) {
                    var p = 'player_' + pid;
                    if(typeof list[p] == 'undefined') {
                        list[p] = Players[pid];
                    }
                }
            }
        });
    });

    // list of players already used, the exclusion list
    console.log(list);

    //enumerate the player list in the selectable list and hide all players found in "list"
    var player = null;
    $.each(list, function(id, prop) {
//        console.log(prop);
        player = $(obj).find('li.' + id);
//        console.log(player);
        $(player).show();
        if($(player).length > 0) {
            $(player).find('a').css('color','black');
//            console.log(GBCodes[gcode].playerid + ' == ' + id);
            var pid = 'player_' + GBCodes[gcode].playerid;
            if(pid == id) {
                $(player).find('a').css('color','rgb(0,180,0)');
            }
            else {
                $(player).hide();
            }
        }
    });
}

function TeamTotal(hora) {

    var homeadj = 0;
    var awayadj = 0;

    if(Data.config.frameadj == "1") {
        homeadj = parseInt(Teams.home.data.homeframescoreadj);
        awayadj = parseInt(Teams.away.data.awayframescoreadj);
    }

    var hscore = (Totals[0].H + homeadj).toString();
    var ascore = (Totals[0].A + awayadj).toString();

    if(hora == "H") {
        return hscore;
    }
    else {
        return ascore;
    }
}

function finalPlayerSummary()
{
    var valid = ","
    $.each(Data.hashtags, function(k,o) {
        if(o.hashtagtypeid === "1" && o.enabled === "1") {
            valid += o.hashtag + ",";
        }
    });

    var html = '';
    var htag = getWinTypes();

    $.each([Teams.my, Teams.other], function(id, team) {

        html += '<p style="font-size:1.2em;font-weight:bold;color:rgb(150,150,150);">' + team.teamname + '</p>' +
            '<table class="finplayersummary" style="margin:10px;"><tr><th>Code</th>' +
            '<th style="text-align:left;padding:5px;">Player</th>' +
            '<th style="width:10%;">Plyd</th>' +
            '<th style="width:10%;">Won</th>';
            $.each(htag, function(hk, o) {
                html += '<th style="width:10%;">' + o.code.toUpperCase() + '</th>';
            });
        html += '</tr>';

        var hora = team.teamcode[0];

        $.each(Legend[team.teamcode], function(lk, lo) {

            if(lo.playerid > 0) {
                var pid = lo.playerid;
                var plyr = Players[hora][pid];
                html += '<tr><td style="color:red;font-weight:bold;width:40px;text-align:center;">' + lo.showcode + '</td>' +
                    '<td style="text-align:left;">' + plyr.fullname + '</td>' +
                    '<td style="width:10%;">' + plyr.framesplayed + '</td>' +
                    '<td style="width:10%;">' + plyr.frameswon + '</td>';
                    $.each(htag, function(hk,o) {
                        html += '<td style="width:10%;">' + plyr['wtype_' + o.code] + '</td>';
                    });
                html += '<tr>';
            }
        });

        var fadjtot = (team.team == 'H' ? team.data.homeframescoreadj : team.data.awayframescoreadj);

        if(Data.config.frameadj == "1") {
            html += '<tr><td style="color:red;font-weight:bold;width:40px;text-align:center;">&nbsp;</td>' +
                '<td style="text-align:left;">' + Data.config.frameadjlabel + '</td>' +
                '<td>&nbsp;</td>' +
                '<td>' + fadjtot + '</td>' +
                '<td>&nbsp;</td>' +
                '<td>&nbsp;</td>' +
                '<td>&nbsp;</td><tr>';
        }

        html += '</table>';

    })

    $("#finalplayersummary").append(html);
}

function highlightWins()
{
    $.each($(".row.s"), function(k, o) {
        if($(o).parent().hasClass("bggreen")) {
            if($(o).hasClass("home")) {
                if($(o).find(".score").text() != "L") {
                    if(Teams.my.team == "H") {
                        $(o).css('background-color', "#88CC88");
                    }
                    else {
                        $(o).css('background-color', "#FFAAAA");
                    }
                }
            }
            else {
                if($(o).find(".score").text() != "L") {
                    if(Teams.my.team == "H") {
                        $(o).css('background-color', "#FFAAAA");
                    }
                    else {
                        $(o).css('background-color', "#88CC88");
                    }
                }
            }
        }
    });
}

function SubTotal()
{
    this.H = 0;
    this.A = 0;
    this.disabled = 0;
    this.unplayed = 0;
    this.abandoned = 0;
}

function RankSubTotal(maxpts, minpts)
{
    this.H = 0;
    this.A = 0;
    this.max = maxpts;
    this.min = minpts;
}

function calcTotals()
{
    Totals = {};
    RankTotals = {};

    var htag = getWinTypes();

    var rescodes = {}
    rescodes['W'] = 'W';    // Standard Win
    rescodes['F'] = 'F';    // Forfeit Win

    // reset player stats
    $.each(['H','A'], function(o, hora) {
    $.each(Players[hora], function(k, p) {
        Players[hora][k].framesplayed = 0;
        Players[hora][k].frameswon = 0;
        $.each(htag, function(hk, o) {
            Players[hora][k]['wtype_' + o.code] = 0;
            rescodes[hk] = o.code;
        });
//        Players[k].mbreak = 0;
//        Players[k].mshot = 0;
//        Players[k].mclear = 0;
    });
    });

console.log('===> rescodes <===');
console.log(rescodes);

    Totals[0] = new SubTotal();

    $.each(GBCodes, function(gcode, data) {

        var d = data.remotedata;
        var hora = gcode[0];

        if(d.gbtype !== "L") {        // not a legend row

            var block = parseInt(d.blockno);

            var disabled = false;
            if(typeof Blocks[block] !== 'undefined') {
                disabled = Blocks[block].disabled;
            }

            if(Totals[block] === undefined) {
                Totals[block] = new SubTotal();
            }

            var rstatus = parseInt(d.resultstatus);

            var winval = 1;

            if(d.gbtype === 'D') {
                winval = 0.5;
            }

            if(rstatus === RMS_COMPLETED && d.resultcode !== "L") {
                Totals[block][data.hora] += winval;
                Totals[0][data.hora] += winval;
            }
            else if(rstatus === RMS_ABANDONED) {
                Totals[block].abandoned++;
                Totals[0].abandoned++;
            }
            else if(rstatus === RMS_INPROGRESS) {
                Totals[block].unplayed++;
                Totals[0].unplayed++;
            }
            else if(rstatus === RMS_READY) {
                if(disabled == 1) {
                    Totals[0].disabled++;
                    Totals[block].disabled++;
                }
                else {
                    Totals[block].unplayed++;
                    Totals[0].unplayed++;
                }

            }

            // update player totals
            if(data.playerid > 0) {
                var pid = data.playerid;
                var rescode = d.resultcode;
                if(rstatus === RMS_COMPLETED) {
                    Players[hora][pid].framesplayed++;
                    if(typeof rescodes[rescode] != 'undefined') {
                        Players[hora][pid].frameswon++;
                        if(typeof htag[rescode] != 'undefined') {
                            var wc = htag[rescode]
                            Players[hora][pid]['wtype_' + wc.code]++;
                        }
                    }
                }
            }

            // only run this part if legend has been created
            if(isset(Blocks[block])) {
                if(udc(RankTotals[block])) {
                    RankTotals[block] = new RankSubTotal(parseFloat(Blocks[block].maxpoints), parseFloat(Blocks[block].minpoints));
                }

                RankTotals[block][data.hora] += parseFloat(data.rank);
            }
        }
    });

    $.each(['H','A'], function(o, hora) {
        $.each(Players[hora], function(k, o) {
            $("#psum_" + o.legendcode).text('');
            if(o.framesplayed > 0) {
                var result = '&nbsp;' + o.framesplayed + "-" + o.frameswon + '&nbsp;';
                $("#psum_" + o.legendcode).html(result);
            }
        });
    });

    var myteam = Teams.my.team;
    var othteam = Teams.other.team;

    var alert = '';
    var minalert = '';

    $('.ms.rank').removeClass('limitexceed');

    $.each(MatchSheet, function(k, o) {
        var cls = "block" + k;
        if(k > 1 && $(".msscore." + cls).length > 0) {

            var hspan = '<span class=';
            var aspan = '<span class=';

            // if > 0 then rank is under max value - throw ALERT when < 0
            var hrankmax = RankTotals[k].max - RankTotals[k].H;
            var arankmax = RankTotals[k].max - RankTotals[k].A;

            // if < 0 then rank is over min value - throw ALERT when > 0
            var hrankmin = RankTotals[k].min == 0 ? 0 : RankTotals[k].min - RankTotals[k].H;
            var arankmin = RankTotals[k].min == 0 ? 0 : RankTotals[k].min - RankTotals[k].A;

            if(RankTotals[k].max === 0 && RankTotals[k].min === 0) {

                $(".msscore.block" + k).removeClass("alert winning drawn");
                if(Totals[k].H === Totals[k].A) {
                    $(".msscore.block" + k).addClass("drawn");
                }
                else if(Totals[k].H > Totals[k].A && myteam === "H") {
                    $(".msscore.block" + k).addClass("winning");
                }
                else if(Totals[k].H < Totals[k].A && myteam === "A") {
                    $(".msscore.block" + k).addClass("winning");
                }
                else {
                    $(".msscore.block" + k).addClass("alert");
                }

                $(".msscore.block" + k).html(Totals[k].H + " - " + Totals[k].A);

            }
            else {

                if(RankTotals[k].max > 0)
                {
                    if(hrankmax > 0) { hspan += '"msscore winning">(+' + hrankmax + ') </span>'; }
                    else if(hrankmax < 0) {
                        hspan += '"msscore alert">(-' + Math.abs(hrankmax) + ') </span>';
                        alert += "Home: " + $("td." + cls).parent().find(".title").text() + ' - ' + Math.abs(hrankmax) + ' points over!<br />';
                        $(".matches." + cls).find('.ms.home.rank').addClass('limitexceed');
                    }
                    else { hspan += '"msscore drawn">(' + hrankmax + ') </span>'; }

                    if(arankmax > 0) { aspan += '"msscore winning"> (+' + arankmax + ')</span>'; }
                    else if(arankmax < 0) {
                        aspan += '"msscore alert"> (-' + Math.abs(arankmax) + ')</span>';
                        alert += "Away: " + $("td." + cls).parent().find(".title").text() + ' - ' + Math.abs(arankmax) + ' points over!<br />';
                        $(".matches." + cls).find('.ms.away.rank').addClass('limitexceed');
                    }
                    else { aspan += '"msscore drawn"> (' + arankmax + ')</span>'; }

                    var txt = Totals[k].H + " - " + Totals[k].A;
                    $(".msscore." + cls).removeClass("alert winning drawn");
                    if(Totals[k].H === Totals[k].A) {
                        $(".msscore." + cls).addClass("drawn");
                    }
                    else if(Totals[k].H > Totals[k].A && myteam === "H") {
                        $(".msscore." + cls).addClass("winning");
                    }
                    else if(Totals[k].H < Totals[k].A && myteam === "A") {
                        $(".msscore." + cls).addClass("winning");
                    }
                    else {
                        $(".msscore." + cls).addClass("alert");
                    }
                    $(".msscore." + cls).html(hspan + txt + aspan);
                }
                if(RankTotals[k].min > 0)
                {
                    if(hrankmin < 0) { hspan += '"msscore winning">(+' + hrankmin + ') </span>'; }
                    else if(hrankmin > 0) {
                        hspan += '"msscore alert">(-' + Math.abs(hrankmin) + ') </span>';
                        alert += "Home: " + $("td." + cls).parent().find(".title").text() + ' - ' + Math.abs(hrankmin) + ' points under!<br />';
                        $(".matches." + cls).find('.ms.home.rank').addClass('limitexceed');
                    }
                    else { hspan += '"msscore drawn">(' + hrankmin + ') </span>'; }

                    if(arankmin < 0) { aspan += '"msscore winning"> (+' + arankmin + ')</span>'; }
                    else if(arankmin > 0) {
                        aspan += '"msscore alert"> (-' + Math.abs(arankmin) + ')</span>';
                        alert += "Away: " + $("td." + cls).parent().find(".title").text() + ' - ' + Math.abs(arankmin) + ' points under!<br />';
                        $(".matches." + cls).find('.ms.away.rank').addClass('limitexceed');
                    }
                    else { aspan += '"msscore drawn"> (' + arankmin + ')</span>'; }
                }
            }
        }
    });

    $(".msscore.block1").removeClass("alert winning drawn");
    if(Totals[0].H === Totals[0].A) {
        $(".msscore.block1").addClass("drawn");
    }
    else if(Totals[0].H > Totals[0].A && myteam === "H") {
        $(".msscore.block1").addClass("winning");
    }
    else if(Totals[0].H < Totals[0].A && myteam === "A") {
        $(".msscore.block1").addClass("winning");
    }
    else {
        $(".msscore.block1").addClass("alert");
    }

    $(".msscore.block1").html(Totals[0].H + " - " + Totals[0].A);

    if(alert != '') {
        myAlert("error", "Warning - points too high!", alert);
    }
    else if(minalert != '') {
        myAlert("error", "Warning - points too low!", minalert);
    }
    console.log('RankTotals');
    console.log(RankTotals);
}

function toggleTeamName(teamfield) {
    var teamcode;
    if($("#" + teamfield).attr("data-side") == Teams.my.teamcode) {
//        $("#" + teamfield).text(Teams.other.teamname);
//        $("#" + teamfield).attr("data-side", Teams.other.teamid);
        teamcode = Teams.other.teamcode;
    }
    else {
//        $("#" + teamfield).text(Teams.my.teamname);
//        $("#" + teamfield).attr("data-side", Teams.my.teamcode);
        teamcode = Teams.my.teamcode;
    }
    $("#playerlist-div").empty().listview("refresh");

    displayPlayerList(teamcode);
//    $.mobile.pageContainer.pagecontainer('change', window.location.href, {
//      allowSamePageTransition: true,
//      transition: 'none',
//      reloadPage: true
//      // 'reload' parameter not working yet: //github.com/jquery/jquery-mobile/issues/7406
//    });
//    return teamcode;
}

function setTeamName(teamfield)
{
//    console.log(teamfield);
    if(CURR_TEAM == Teams.my.teamcode) {
        $("#" + teamfield).text(Teams.my.teamname);
        $("#" + teamfield).attr("data-side", Teams.my.teamcode);
        $("#" + teamfield).attr("data-pin", Data.remote.remotepin);
        return Teams.my.team;
    }
    else {
        $("#" + teamfield).text(Teams.other.teamname);
        $("#" + teamfield).attr("data-side", Teams.other.teamcode);
        $("#" + teamfield).attr("data-pin", Data.remoteother.remotepin);
        return Teams.other.team;
    }
}

function initLandingPage(mode, modeval)
{
    console.log('initLandingPage("' + mode + '")');

    var compid = 0;
    if(isset(CPage.compid)) {
        compid = CPage.compid;
    }
    console.log('compid=' + compid);

    var mydata = {
        action: 'initLandingPage',
        userip: Settings.userip,
        userAgent: CID.userAgent,
        mode: mode,                                                          // none, pin, team, admin, device
        modevalue: modeval,
//        currdate: gettoday(),
    };

    $.ajax({
        url: apiURL + 'initdata',
        data: mydata,
        success: function(data) {

            Version = data.version;

            InitData = data;

            console.log(data);

            var versionOk = Version.appVersion === jsVersion() && jsVersion() === $(".footertext").attr("data-appversion");

            console.log("**********************");
            console.log("* VERSIONS - " + (versionOk ? "OK" : "ERROR!"));
            console.log("* js-lib: " + jsVersion());
            console.log("* pages:  " + $(".footertext").attr("data-appversion"));
            console.log("* Server: " + Version.appVersion);
            console.log("**********************");

            $("#activematchset").empty();

// <editor-fold defaultstate="collapsed" desc="Data Object">
            /*
             version (object)
             appVersion (string)
             viewVersion (string)
             ids (string)
             today (string)
             orgs (object)
             [7] (object)
             orgid (string)
             orgcode (string)
             orgname (string)
             matches (object)
             [119029H] (object)
             orgid (string)
             compid (string)
             drawid (string)
             drawroundid (string)
             teamid (string)
             framescore (string)
             hora (string)
             teamname (string)
             remotepin (string)
             timezone (string)
             tzdiff (number)
             match (object)
             compid (string)
             drid (string)
             drindex (string)
             roundno (string)
             weekno (string)
             compdate (string)
             starttime (string)
             published (string)
             drawid (string)
             playdate (string)
             hometeamid (string)
             hometeamstatus (string)
             awayteamid (string)
             awayteamstatus (string)
             matchstatus (string)
             livestatus (string)
             matchcode (string)
             liveupdating (string)
             shortname (string)
             venuename (string)
             timezone (string)
             remotematchid (string)
             remotepin (string)
             hora (string)
             homeframescore (string)
             awayframescore (string)
             remotestatusid (string)
             legendlock (string)
             lastupdatetime (object)
             compname (string)
             grade (string)
             teamlabel (string)
             orgid (string)
             orgcode (string)
             orgname (string)
             legendcount (string)
             comps (object)
             [747] (object)
             orgid (string)
             compid (string)
             timezone (string)
             compname (string)
             grade (string)
             compnamefull (string)
             activated (object)
             time (string)
             status (number)
             started (object)
             time (string)
             status (number)
             completed (object)
             time (string)
             status (number)
             ls (object)
             timezone (string)
             adminpassword (string)
             appmethod (string)
             activateschedule (string)
             createpintime (string)
             activatetime (string)
             activatetimemins (string)
             compstarttime (string)
             deactivatetime (string)
             deactivatetimemins (string)
             notifyemaillist (string)
             subsallsremainingspots (string)
             locklegends (string)
             lockgameblocks (string)
             allowotheraccess (boolean)
             passwordtype (string)
             teamcontactrolecode (string)
             nonsubplayercount (number)
             block1autolock (string)
             subinoroutonly (string) // replaces canswitchpositions
             nostatsonforfeit (string)
             rounds (object)
             19935 (object)
             activated (object)
             time (string)
             status (number)
             started (object)
             time (string)
             status (number)
             completed (object)
             time (string)
             status (number)
             id (string)
             compid (string)
             drindex (string)
             roundno (string)
             weekno (string)
             compdate (string)
             starttime (string)
             published (string)
             roundlabelid (string)
             roundtypeid (string)
             customlabel (string)
             disabled (string)
             lastpubdate (string)
             overridematchformat (string)
             maxframes (string)
             isracetomax (string)
             overridesettings (object)
             msheetid (string)
             rounddesc (string)
             *
             */
// </editor-fold>

            // check if valid token exists, if it does the livescoring home page will load
            if(checkForToken(data)) {
                initMatchTableView(data, compid);
            }

            if(mode == 'none') {
                if(modeval !== null) {
                    $("#matchdate").attr("data-seldate", modeval);
                }
            }

            setFooter("dxfootertext");
        },
        error:function(errdata) {
            console.log('ERROR');
            displayErrMsg('Error', errdata);    //  }
        }
    });

}

function checkForToken(data)
{
        console.log('TOKEN CHECK RESULTS');

//                console.log(data.token[LSTR_JWTTOKEN]);
        if(udc(data.token)) {
            console.log('---> NO TOKEN(undefined)');
        }
        else if(data.token === null) {
            console.log('---> NO TOKEN(null)');
            data.token = [];
        }

        if(isset(data.token)) {
            console.log(data.token);
            if(data.token.tokenstatus == 1)
            {
                // if the user has come from the live app via the back button, stay on the index page
                if(localStorage.getItem("loadsource") == 'livebackbutton') {
                    return true;
                }

                if(CPage.page == 'enterresults.html') {
                    $.mobile.changePage(CPage.page);
                }
                else {
                    populateHomePage("token", myJWT.remoteid);
                }
                return false;
            }
            else {
                console.log('---> TOKEN Status = 0');
                return false;
            }
        }
        else {
            return true;
        }

        $("#loadingapp").hide();

}

function initMatchTableView(data, compid)
{
    console.log('===> initMatchTableView <===');

console.log(data);

    var needsRefresh = false;

    $("#loadingapp").hide();

    const MOMENT_MYSQL = "Y-MM-DD";
    const MOMENT_FORMATTED = "ddd, D-MM-Y";

    // get todays date
    var today = moment().format(MOMENT_MYSQL);

    // get selected date
    var sqldate = data.today;   // eg: 2019-04-09. defaults to today but otherwise contains the date selected in this dropdown
    var ddate = moment(sqldate, MOMENT_MYSQL);
    var adate = ddate.format(MOMENT_FORMATTED);

    var datesel = '<table width="100%"><tr><td>';
    datesel += '<h3 id="matchdate" data-seldate="' + today + '" class="matchdateselect">' +
        (sqldate == today ? "TODAY'S MATCHES" : "MATCHES: " + adate) + '<span id="matchcarat" class="matchcaratd"></span></h3>' +
        '</td></tr><tr id="dateoptions" style="display:none;"><td><div id="datelist" class="datelist"><ul class="dateoptlist">';

        // build list of dates
        datesel += '<li class="dateopt" data-date="today">TODAY\'S MATCHES</li>';
        for(var i = 1; i < 16; i++)
        {
            today = moment().subtract(i, "d");
            var sqldate = today.format(MOMENT_MYSQL);
            var fdate = today.format(MOMENT_FORMATTED);
    //        $('#select-match-date').append('<option value="' + sqldate + '>' + date + '</option>');
            datesel += '<li class="dateopt" data-date="' + sqldate + '">' + fdate + '</li>';
        //    console.log(sqldate);
        }
    datesel += '</ul></div></td></tr></table>';

console.log(data.comps);

    var nomatches = false;

    if(udc(data.comps)) {
        console.log('NO MATCHES because data.comps is undefined');
        $("#activematchset").append(datesel + "<h3 style='color:red;text-align:center;'>No Matches!</h3>");
//                    $("#activematchset").append("<p style='text-align:center;'>Current Time: " + moment().format('D-MMM-Y h:m:s a') + "</p>");
        nomatches = true;
    }
    else {

        $("#activematchset").collapsibleset().trigger('create');

        var html = '';

        var collapsed = "true";

        var compcount = 0;

        $.each(data.comps, function(cid, comp)
        {
            if(compid == 0) {
                collapsed = "false";
            }
            else {
                if(compid == cid) {
                    collapsed = "false";
                }
                else {
                    collapsed = "true";
                }
            }

            var headhtml = String.format('<div class="activematchset" data-role="collapsible" data-collapsed="{0}" data-compid="{1}"><h3>{2} - {3}</h3>',
                collapsed, cid, data.orgs[comp.orgid].orgcode, comp.compnamefull);

            var dhtml = {};

            var panelcolor;

            $.each(comp.matches, function(drawid, match) {

                var status;

                // do not show matches whose rstatus = 0
                if(match.rstatus.id != 0) {

// SET STATUS OF MATCH

                    var status = "<b>" + match.rstatus.desc + "</b>";
//console.log(match);
                    if(match.rstatus.id == 5) {
                        panelcolor = 'matchnone';
                    }
                    else if(match.rstatus.id == 4) {
                        panelcolor = 'matchdone';
//                            if(match.home.remotestatusid != 3) {
//                                hteamalert = ' alert';
//                            }
//                            if(match.away.remotestatusid != 3) {
//                                ateamalert = ' alert';
//                            }
                    }
                    else if(match.rstatus.id == 3) {
//                                    status += ' For ' + match.rstatus.mins;
                        // current time is now past the scheduled start time
                        // - if the matchsheet has been created then show match-success panel with mins as time elapsed since start
                        // - otherwise, show match-warn panel with mins showing as negative
                        if(parseInt(match.home.legendlock) > 0 && parseInt(match.away.legendlock) > 0) {
                            panelcolor = 'matchactive';
                        }
                        else {
                            panelcolor = 'matchpend';
                            match.rstatus.minsabbr = "-" + match.rstatus.minsabbr;
                        }
                    }
                    else if(match.rstatus.id == 2) {
                        panelcolor = 'matchpend';
                    }
                    else if(match.rstatus.id == 1) {
                        panelcolor = 'matchwait';
                    }
//console.log(panelcolor);
// CREATE ROUND HEADING (if required)

                    if(udc(dhtml[match.drid]))
                    {
                        dhtml[match.drid] = '<div class="divTable" style="border-collapse:separate;border-spacing:3px;">' +
                            '<div style="color:blue;" class="divTableRow">' + comp.rounds[match.drid].rounddesc + '</div>';
                    }
                    // style="width:60px;padding: 0px 10px 0px 0px;"  style="width:60px;padding: 0px 10px 0px 0px;"  rowspan="2"

                    var minsabbr = '<span>' + match.rstatus.minsabbr + '</span>';
                    if(match.rstatus.minsabbr.indexOf('-') > -1) {
                        minsabbr = '<span style="color:red;">' + match.rstatus.minsabbr.replace('-','') + '</span>';
                    }

                    var homelose = '';
                    var awaylose = '';
                    if(parseInt(match.home.framescore) > parseInt(match.away.framescore)) { awaylose=" loser"; }
                    if(parseInt(match.home.framescore) < parseInt(match.away.framescore)) { homelose=" loser"; }

                    var noresults = panelcolor == 'matchnone';

                    var nrhtml = '';
                    var cols = 3;

// SET MESSAGE IF MATCHSHEET NOT AVAILABLE

                    var msg = "Match was not Livescored";
                    if(noresults) {
                        nrhtml = String.format('<tr class="nomatch hidden"><td colspan="{0}" style="text-align:center;">{1}</td></tr>', cols, msg);
                    }
                    else {
                        if(panelcolor == "matchwait" || panelcolor == "matchpend") {
                            if(match.rstatus.minsabbr.indexOf('-') > -1) {
                                msg = "Match has not started yet";
                            }
                            else {
                                if(panelcolor == "matchwait") {
                                    msg = "Match activates in ";
                                }
                                else {
                                    msg = "Match starts in ";
                                }
                                if(match.rstatus.minsabbr.indexOf('0:') > -1) {
                                    msg += match.rstatus.mins;
                                }
                                else {
                                    msg += match.rstatus.minsabbr.replace(':','h ') + 'm';
                                }
                            }
                        }
                        cols = 4;
                        nrhtml = String.format('<tr class="nomatch hidden">' +
                            '<td class="no-narrow" style="width:12%;">&nbsp;</td>' +
                            '<td colspan="{0}" style="text-align:center;">{1}</td></tr>', cols, msg);
                    }

                    dhtml[match.drid] += String.format('<div class="divTableRow"><div class="divTableCell matchrowview {2}" data-drawid="{1}" style="padding:5px;">' +
                        '<table class="matchtbl" width="100%"><tr class="matchok" id="draw_{1}">' +
                        '<td class="no-narrow" style="width:12%;' + ((panelcolor == 'matchdone' || noresults) ? '' : '') + '">{3}</td>' +
                        '<td class="ar{8}" style="width:32%;">{6}</td>' +
                        '<td id="score_{0}" class="ac matchscore ' + (noresults ? 'none;' : 'valid') + '">' + (noresults ? '' : '{4} : {5}') + '</td>' +
                        '<td class="{9}" style="width:32%">{7}</td>' +
                        '</tr>' + nrhtml + '</table></div></div>', match.drid, drawid, panelcolor, minsabbr,
                        parseInt(match.home.framescore) + parseInt(match.home.framescoreadj), parseInt(match.away.framescore) + parseInt(match.away.framescoreadj),
                        match.home.shortlabel, match.away.shortlabel, homelose, awaylose);
                }
//console.log(dhtml);
            });

            var subhtml = '';
            $.each(dhtml, function(key, thtml) {
//                if(!udc(dhtml[key])) {
                    thtml += '</div>'; // </table></div></div>
                    subhtml += thtml;
//                }
            });
//console.log(subhtml.length > 0);

            if(subhtml.length > 0) {
                compcount++;
                html += headhtml + subhtml + '</div></div>';
                html += '</div>';
            }

        });

        if(compcount === 0) {
            console.log('NO MATCHES because compcount = 0');
            html = "<h3 style='color:red;text-align:center;'>No Matches!</h3>";
            nomatches = true;
        }
        else {
            html = "<p style='text-align:center;'>Select match to view Live Scoresheet</p>" + html;
            nomatches = false;
        }

        $("#activematchset").append(datesel + html).collapsibleset("refresh");
        $(".compmenu").listview().listview("refresh");
    }

    $(".lslogin.return").addClass("hidden");
    $(".lslogin.login").addClass("hidden");

    if(nomatches === false) {
        if(localStorage.getItem("loadsource") == 'livebackbutton') {
            $(".lslogin.login").addClass("hidden");
            $(".lslogin.return").removeClass("hidden");
        }
        else {
            if(moment().format("Y-MM-DD") === moment(data.today).format("Y-MM-DD")) {
                if(["today", data.today].indexOf($("#matchdate").data("seldate")) > -1) {
                    $(".lslogin.return").addClass("hidden");
                    $(".lslogin.login").removeClass("hidden");
                }
            }
        }
    }

    console.log('needsRefresh: ' + (needsRefresh ? "YES" : "NO"));

    if(needsRefresh) {
//        $("#refreshstatushome").show();
        updateMatchData();
        IDX_INTERVAL = setInterval(function() { updateMatchData() }, 5000);
    }
    else {
        if(IDX_INTERVAL !== null) {
            clearInterval(IDX_INTERVAL);
            IDX_INTERVAL = 0;
//            $("#refreshstatushome").hide();
        }
    }
}

//#region

//#endregion

function countdownFinalise()
{
    var secs = getLastResultUpdateSecs();

    console.log('countdownFinalise::' + secs);

    if(Teams.other.data.remotestatusid == "3") {

        // if other team has FINALISED
        clearInterval(MS_INTERVAL);
        MS_INTERVAL = 0;
        clearInterval(FinaliseInterval);
        FinaliseInterval = 0;

        $(".finalisenow").removeClass('wait').addClass('ok');
        $(".finalisenow").html("Click HERE to FINALISE");
    }
    else {
        if($("#finaliseupdate").length > 0) {

            if(secs > 0) {
                $("#finaliseupdate").text(formatSeconds(secs));
            }
            else {

                clearInterval(FinaliseInterval);
                FinaliseInterval = 0;

                $.ajax({
                    url: apiURL + 'lastupdatetime',
                    data: { drawid: Data.draw.id, remoteid: Teams.twa.data.id },
                    success: function(data) {
                        console.log('SUCCESS');
                        console.log(data);
                        // check if the home users details have changed since the last refresh
                        if(Data.lastresultupdate != parseInt(data.lastupdate) || Teams.twa.data.remotestatusid != data.otherstatusid) {
        console.log('info has changed! ' + Data.lastresultupdate + ' != ' + parseInt(data.lastupdate) + ', ' + Teams.twa.data.remotestatusid + ' != ' + data.otherstatusid);
                            LastUpdate.intervalCount = 6;
                            clearInterval(MS_INTERVAL);
                            MS_INTERVAL = 0;
                            MS_INTERVAL = setInterval(ajaxUpdateScoresheet2, 5000);
                        }
                        else {
                            getLastUpdateTime(true);
                            clearInterval(FinaliseInterval);
                            FinaliseInterval = 0;
//                            clearInterval(MS_INTERVAL);
                            $(".finalisenow").removeClass('wait').addClass('ok');
                            $(".finalisenow").html("Click HERE to FINALISE");
                        }
                   },
                   error: function(err) {
                       console.log('ERROR');
                       console.log(err);
                   }
                });
            }
        }
    }
}

function ajaxUpdateScoresheet2()
{
    var startTime = $.now();

    var elem = '#refreshresults';

    LastUpdate.intervalCount++;

    //lastTimestamp: 0, lastRefresh: 0, intervalCount: 0;
    if(LastUpdate.intervalCount < 6) {
        $(elem).text("Refreshed at " + moment.unix(LastUpdate.lastRefresh).format("h:mm:ss a") + ", update in " + ((6 - LastUpdate.intervalCount) * 5) + " secs");
//        if($("#finaliseupdate").length > 0) {
//            var now = parseInt($.now() / 1000);
//            var lastUpdate = 0;
//            if(parseInt(Data.config.finalisedelaymins) > 0) {
//                lastUpdate = getLastResultUpdate();
//            }
//            var secs = lastUpdate - now;
//            if(lastUpdate > now) {
//                $("#finaliseupdate").text(formatSeconds(secs));
//            }
//        }
    }
    else
    {
//        console.log('lastTimestamp: ' + LastUpdate.lastTimestamp + ' - ' + getunix(LastUpdate.lastTimestamp));
//        console.log('lastRefresh  : ' + LastUpdate.lastRefresh + ' - ' + getunix(LastUpdate.lastRefresh));

        var reftext = $(elem).text();
        $(elem).html(reftext + ': <span style="color: rgb(100,180,100)">refreshing...</span>');

        LastUpdate.intervalCount = 0;

        $.ajax({
            url: apiURL + 'refreshmatchupdatesV2',
            data: {
                action: 'refreshmatchupdatesV2',
                ids: [Teams.twa.data.id, Teams.twla.data.id],
                lastTimestamp: LastUpdate.lastTimestamp,
                timeouts: LastUpdate.timeoutCount,
                lastRefresh: LastUpdate.lastRefresh
            },
            success: function(retdata) {

                console.log('Process took ' + (($.now() - startTime)/1000) + ' seconds');

                console.log('success.refreshmatchupdatesV2');
                console.log(retdata);

                var resultfields = ['framecount','framesequence','resultcode','resultstatus'];

                if(retdata.reccount + retdata.remcount > 0) {

                    // frame adjustments
                    if(retdata.remcount > 0){
                        if($(".spinview.home").length > 0) {
                            $(".spinview.home").text(retdata.rems.H.homeframescoreadj);
                            $(".spinview.away").text(retdata.rems.H.awayframescoreadj);
                        }

                        Teams.home.data.homeframescoreadj = retdata.rems.H.homeframescoreadj;
                        Teams.away.data.awayframescoreadj = retdata.rems.H.awayframescoreadj;

                        Teams.home.data.remotestatusid = retdata.rems.H.remotestatusid;
                        Teams.away.data.remotestatusid = retdata.rems.A.remotestatusid;

                        updateMatchScorePanel('results');
                    }

                    Data.lastresultupdate = parseInt(retdata.lastupdate);

                    Teams.home.data.lastresultupdate = retdata.rems.H.lastresultupdate;
                    Teams.away.data.lastresultupdate = retdata.rems.A.lastresultupdate;

                    $.each(retdata.recs, function(key, team) {

                        var playerupdate = {};
                        var resultupdate = {};

                        resultupdate.home = {};
                        resultupdate.away = {};

                        var hcode = null;
                        var acode = null;

                        var hgbc = {};
                        var agbc = {};

                        var resupdates = 0;
                        var dblkey = null;

                        // determine if changes are results or players
                        if(isset(team.home)) {

                            hcode = Object.keys(team.home)[0];
                            hgbc = GBCodes[hcode];

                            if(hgbc.partner.length > 0) {
                                var dgbc = null;
                                if(isset(GBCodes[hgbc.partner])) {
                                    var dgbc = GBCodes[hgbc.partner]
                                }
                                dblkey = dgbc.blockno + '-' + dgbc.row;
                            }

                            if(parseInt(team.home[hcode].playerid) != hgbc.remotedata.playerid) {
                                console.log(hcode + ": player updated");
                                playerupdate[hcode] = team.home[hcode];
                            }

                            $.each(resultfields, function(idx, fld) {
                                if(team.home[hcode][fld] !== hgbc.remotedata[fld]) {
                                    resupdates++;
                                }
                            });
    //console.log(resupdates);
                        }

                        if(isset(team.away)) {
                            acode = Object.keys(team.away)[0];
                            agbc = GBCodes[acode];
                            if(parseInt(team.away[acode].playerid) != agbc.remotedata.playerid) {
                                console.log(acode + ": player updated");
                                playerupdate[acode] = team.away[acode];
                            }
                        }

                        if(resupdates > 0) {    // if results updates, both sides have changes
                            console.log(hcode + '-' + acode + ": results updated");
                            resultupdate.home[hcode] = team.home[hcode];
                            resultupdate.away[acode] = team.away[acode];
                            if(isset(retdata.recs[dblkey])) {
                                var team2 = retdata.recs[dblkey];
                                var h2code = Object.keys(team2.home)[0];
                                var a2code = Object.keys(team2.away)[0];
                                console.log(h2code + '-' + a2code + ": results updated (partner)");
                                resultupdate.home[h2code] = team2.home[h2code];
                                resultupdate.away[a2code] = team2.away[a2code];
                            }
                        }

                        // if there are result updates, process them
                        if(isset(resultupdate.home[hcode]) && isset(resultupdate.away[acode])) {

                            var block = resultupdate.home[hcode].blockno;

                            var hjson = MatchTeams[block][hcode].json;
                            var ajson = MatchTeams[block][acode].json;

                            if(MatchTeams[block][hcode].showresult === true) {

                                var data = {};

                                data.home = hjson;
                                data.away = ajson;
                                data.multiframe = hgbc.gbcode.maxframes === 1 ? 0 : 1;

                                var result = resultupdate.home[hcode].resultcode;
                                var obj = $("#result_" + hcode);
                                if(result == "L") {
                                        result = resultupdate.away[acode].resultcode;
                                        obj = $("#result_" + acode);
                                }

                                processResultUpdate(data, resultupdate, result, obj, block, true)
                            }
                        }
                        console.log(Object.keys(playerupdate));
                        $.each(playerupdate, function(gcode, pdata) {
                            var gbc = GBCodes[gcode];
                            console.log(pdata);
                            if(pdata.playerid == 0) {
                                var newplyr = new Player();
                                updateSubSelect( gcode, newplyr, false );
                            }
                            else {
                                var newplyr = Teams[gbc.hora].players[pdata.playerid];
                                updateSubSelect( gcode, newplyr, (newplyr.code == '?' ? false : gbc.code !== newplyr.code) );
                            }
                        });
                    });
                }

                LastUpdate.lastRefresh = retdata.lastrefresh;
                LastUpdate.lastTimestamp = retdata.lastupdate;

                Teams.H.data.remotestatusid = retdata.rems.H.remotestatusid;
                Teams.A.data.remotestatusid = retdata.rems.A.remotestatusid;

                updateMatchScorePanel('results');

                $(elem).text("Refreshed at " + moment.unix(LastUpdate.lastRefresh).format("h:mm:ss a") + ", update in " + ((6 - LastUpdate.intervalCount) * 5) + " secs");

            },
            error: function(err) {
                console.log('error.refreshmatchupdatesV2');
                console.log(err);
            }
        });
    }
}

function LegendCode(lcode)
{
    if(lcode !== null && lcode !== "null") {
        return {hora: lcode[0], code: lcode[1], pos: parseInt(lcode.slice(-2)), gbcode: lcode, playerid: 0};
    }
    return null;
}

function StatsCode(scode, block) {
//    console.log("StatsCode: " + scode);
//    var char = scode.split("");
//    if(char.length===4) {
    return {hora: scode[0], code: scode[1], block: block, pos: parseInt(scode.slice(-2)), gbcode: scode, playerid: 0};
}

function getNewPlayerSeed(teamcode) {
    // if hometeam set a different starting number for temporary player ids
    console.log("**** getNewPlayerSeed(" + teamcode + ")");
    if(teamcode == Teams.H.teamcode) {
        return 999900;
    }
    else {
        return 999950;
    }
}

function TeamsData()        // ihora
{
    console.log('----> TEAMDATA!!! <-----');

    // teams are paired:
    //      my (this logged in team) / other (the not logged in team),
    //      home / away,
    //      twa (team with access) / twla (team with no access)
    // data is primarily set as my and other then other references are created for home, away, twa, twla
    // true/false variables are created to show "myishome" (logged in team is home team) and "myistna" (logged in team is team with access)
    // Processing Stages of a match (which items disabled)

    /***********************
     * CONFIGURATION TYPES
     *
     * 1.   TWA enters all information under their own login on one device
     * 2.   TWA enters own info, TWLA enters own info after authenticating in TWA session on one device
     * 3.   TWA enters own info on one device, TWLA enters own info on another device
     *
     * MENU OPTIONS
     *
     * TEAM LOGGED IN & TEAM WITH ACCESS
     *
     * MY TEAM SECTION
     * o2   Select Players & Subs
     * o3   LOCK IN PLAYERS
     * o4   Enter Results
     * o5   Finalise Match
     *
     * OTHER TEAM SECTION
     * o12  Select Players & Subs
     * o13  LOCK IN PLAYERS
     * o15  Finalise Match
     *
     */

    var STAGES = {
        0:{a:'o3 o4 o5', na:'o12 o13 o14 o15'},
        1:{a:'o3 o4 o5', na:'o13 o14 o15'},
        2:{a:'o4 o5', na:'o14 o15'},
        3:{a:'o2 o3 o5', na:'o12 o13 o15'},
        4:{a:'o2 o3', na:'o12 o13'},
        5:{a:'o2 o3 o5', na:'o12 o13 o15'},
//        6:{a:'o2 o3 o4 o5', na:'o11 o12 o13 o15'}
    };

    if(typeof Data == "object")
    {
        if(isset(Data.myteam) && isset(Data.hometeam))
        {
            CURR_TEAM = Data.myteamid;
            CURR_TOKEN = LSTR_JWTTOKEN;

//            if(udc(ihora))
//            {
//                ihora = Data.myhora;
//
////                if(Data.myteam != Data.hometeam.id)
////                {
////                    ihora = "A"
////                }
////                else {
////                    ihora = "H";
////                }
//            }

            // 1.   all home no auth
            // 2.   home device requires auth
            this.appmethod = Data.config.appmethod;

            Data.remote.legendsave = parseInt(Data.remote.legendsave);
            Data.remote.legendlock = parseInt(Data.remote.legendlock);

            Data.remoteother.legendsave = parseInt(Data.remoteother.legendsave);
            Data.remoteother.legendlock = parseInt(Data.remoteother.legendlock);

            var hora = Data.myhora;
            var aorh = hora == "H" ? "A" : "H";

            var myteam = Data.hometeam;
            var othteam = Data.awayteam;

            var mydata = Data.remote;
            var othdata = Data.remoteother;

            if(hora == "A")
            {
                myteam = Data.awayteam;
                othteam = Data.hometeam;
            }

            this.my = {
                team: hora,
                teamid: myteam.id,
                teamcode: hora + "-" + myteam.id,
                teamname: myteam.teamlabel,
                shortname: myteam.shortlabel,
                sellockopt: 0,      // 0 = n/a, 1=twa has control, 2=twla has control
                subcount: myteam.subcount,
                gbcode: '',
                data: mydata,
                selplayers: parseInt(mydata.legendsave),
                players: {},
                sublist: {},
                hasPlayer: function(pname) {
                    var foundplayer = null
                    console.log('hasPlayer');
                    $.each(this.players, function(k,o) {
                        if(o.fullname === pname) {
                            foundplayer = o;
                        }
                    });
                    return foundplayer;
                }
            };

            this.resetsublists = function() {
                $.each(this.my.sublist, function(k,o) {
                    o.show = 1;
                });
                $.each(this.other.sublist, function(k,o) {
                    o.show = 1;
                });
            }

            this.other = {
                team: aorh,
                teamid: othteam.id,
                teamcode: aorh + "-" + othteam.id,
                teamname: othteam.teamlabel,
                shortname: othteam.shortlabel,
                sellockopt: 0,
                subcount: othteam.subcount,
                gbcode: '',
                data: othdata,
                selplayers: parseInt(othdata.legendsave),
                players: {},
                sublist: {},
                hasPlayer: function(pname) {
                    var foundplayer = null
                    console.log('hasPlayer');
                    $.each(this.players, function(k,o) {
                        if(o.fullname === pname) {
                            foundplayer = o;
                        }
                    });
                    return foundplayer;
                }
            };

            // Data.config
            if(this.my.data.hasaccess === "1")
            {
                this.twa = this.my;
                this.twla = this.other;
                this.myistwa = true;
            }
            else {
                this.twa = this.other;
                this.twla = this.my;
                this.myistwa = false;
            }

            // check which option the away team has selected if appmethod = 1
            if(this.appmethod == "1") {
                if(this.twla.data.hasaccess === "2") {
                    this.twla.sellockopt = CONTROL_HAS;      // 2: twla has control
                    this.twa.sellockopt = CONTROL_NONE;      // 1:
                }
                else {
                    this.twla.sellockopt = CONTROL_NONE;
                    this.twa.sellockopt = CONTROL_HAS;
                }
            }

            this.hometeamid = Data.hometeam.id;
            this.awayteamid = Data.awayteam.id;

            if(this.my.teamid === this.hometeamid)
            {
                this.home = this.my;
                this.H = this.my;
                this.away = this.other;
                this.A = this.other
                this.myishome = true;
            }
            else {
                this.home = this.other;
                this.H = this.other
                this.away = this.my;
                this.A = this.my;
                this.myishome = false;
            }
        }
        console.log('done');
    }

    this.myLoggedIn = function() {
        return myJWT.current === 1;
    }

    this.otherLoggedIn = function() {
        return otherJWT.current === 1;
    }

    this.enterResultsOK = function()
    {
        return (this.twa.data.legendlock > 0 && this.twla.data.legendlock > 0);
    }

    this.getStage = function()
    {
        var temp = '';
        var disableitems;

        console.log('Checking Stage...');

        $(".enterresultsmsg").hide();
        $(".devicestatus").addClass("hidden");

        // STAGE 0: TWLA team has not Finalised a previous match
        // STAGE 1: Select Players
        // STAGE 2: LOCK Players
        // STAGE 3: Enter Results
        // STAGE 4: Finalise
        // STAGE 5: Match Complete

        var access = this.myistwa ? 'a' : 'na';
        var ret = 0;

        calcTotals();

        if(this.my.data.remotestatusid === "3" || this.other.data.remotestatusid === "3") {
            // if either team has finalised, Stage 5
            temp = '';
            if(this.twa.data.remotestatusid === "3") {
                temp += STAGES[5].a;
            }
            else {
                temp += STAGES[4].a;
            }
            if(this.twla.data.remotestatusid === "3") {
                temp += " " + STAGES[5].na;
                console.log('Stage 5');
            }
            else {
                temp += " " + STAGES[4].na;
                console.log('Stage 5a');
            }
            // only "VIEW RESULTS" IS ENABLED ON BOTH DEVICES
        }
//        else if(this.my.data.remotestatusid === "3") {
//            temp = STAGES[5].a
//        }
        else {

//            var lastupdate = getLastResultUpdate();

            // if legend is not locked, stage could be 1 or 2.  if it is locked stage could be 3 or 4
            if(this.my.data.legendlock === 0)   {   // || this.twla.data.legendlock === "1")   // 3 both legends locked

                // STAGE 1 or 2
                if(this.my.data.legendsave === 0) {

                    // STAGE 1
                    if(access == "na") {
                        $(".devicestatus").removeClass("hidden");
                    }
                    if(Data.config.appmethod == "1" && access == "na" && this.twla.sellockopt == 1) {
            console.log('Stage 1: twla no control');
                        temp += STAGES[0].na;       //'o12 o13 o14 o15';
                    }
                    else {
                        if(access == "a" && Data.draw.id !== Data.otherdrawid.toString() && myJWT.auth != LOGIN_MATCHPIN) {
                            // other team has not finalised an earlier match
                            $(".twla-finalise-old").removeClass("hidden");
                            temp += STAGES[0].na;
                        }

                        console.log('Stage 1');
                        temp += STAGES[1][access];
                    }
                }
                else {
                    // STAGE 2
                    if(access == "na") {
                        $(".devicestatus").removeClass("hidden");
                    }
                    if(Data.config.appmethod == "1" && access == "na" && this.twla.sellockopt == 1) {
                        console.log('Stage 2: twla no control');
                        temp += STAGES[0].na;       //'o12 o13 o14 o15';
                    }
                    else {
                        console.log('Stage 2');
                        temp += STAGES[2][access];
                    }
                }

                if(access == "na")
                {
                    if(this.my.sellockopt == 1) {
                        $(".devicestatus").addClass('nocontrol').html("OTHER TEAM HAS <b>SELECT/LOCK PLAYER</b> CONTROL<br /><span class='smalltext'>Tap here to change</span>");
                        $(".devicestatus").removeClass('control');
                    }
                    else if(this.my.sellockopt === 2) {
                        $(".devicestatus").addClass('control').html("YOUR TEAM HAS <b>SELECT/LOCK PLAYER</b> CONTROL<br /><span class='smalltext'>Tap here to change</span>");
                        $(".devicestatus").removeClass('nocontrol');
                    }
                    else {
                        $(".devicestatus").addClass('hidden');
                    }
                }
            }
            else {

                // STAGE 3 or 4

//                $(".menuli.o4").find(".enterresultsmsg").hide();
//                $(".menuli.o14").find(".enterresultsmsg").hide();

                if(Totals[0].H + Totals[0].A === 0) {       // no scores recorded yet

                    // STAGE 3.x
                    temp += STAGES[3][access];

//                    if(this.other.data.legendlock === 2) {
//            console.log('Stage 3 confirmed');
//
//                    }
//                    else {
                        // this.my.data.legendlock must be 1

                console.log('Stage 3 pending');

                    if(this.other.data.legendlock === 0) {
                        // WAITING FOR OTHER TEAM TO LOCK
                        // disable menuitem
                        if(this.myistwa) {
                            $(".menuli.o4").find(".enterresultsmsg").show();
                            $(".menuli.o4").find(".refreshsecs").addClass("show");
                        }
                        else {
                            $(".menuli.o14").find(".enterresultsmsg").show();
                            $(".menuli.o14").find(".refreshsecs").addClass("show");
                            // DISPLAY A DIFFERENT MESSAGE FOR THE AWAY TEAM
                        }

                        console.log('lockcheckinterval = ' + lockcheckinterval);

                        if(lockcheckinterval === 0) {
                            lockcheckinterval = setInterval(checkLockStatus, 1000);
                        }
                    }
                    else {

            console.log('Stage 3');

                        if(!Teams.myistwa) {
                            ret = 1;
                        }
                    }
//                    }
                }
                else {
                    if(Totals[0].unplayed === 0)   // 4 all matches are scored but TWA has not finalised
                    {
            console.log('Stage 4');
                        temp = STAGES[4].a + " " + STAGES[4].na;
                        if(this.twla.data.remotestatusid === "2") {
                            if(this.twa.data.remotestatusid === "2" && getLastResultUpdateSecs() !== 0) {

                                if(!this.myistwa) {
                                    if(getLastResultUpdateSecs() !== -1) {
                                        $(".menuli.o15").find(".finalisesmsg").html('Other team has <span class="waitsecs">' + formatSeconds(getLastResultUpdateSecs()) + '</span> to FINALISE (Check Status in <span class="refreshsecs">15</span> secs)');
                                    }
                                    $(".menuli.o15").find(".finalisesmsg").show();
                                    $(".menuli.o15").find(".refreshsecs").addClass("show");
                                }

                                $(".menuli.o15").find(".finaliseawaymatch").addClass("ui-disabled");

                                console.log('finalisecheckinterval = ' + lockcheckinterval);

                                if(lockcheckinterval === 0) {
                                    lockcheckinterval = setInterval(checkFinaliseStatus, 1000);
                                }
                            }
                            else {
                                $(".menuli.o15").find(".finalisesmsg").hide();
                                $(".menuli.o15").find(".finaliseawaymatch").removeClass("ui-disabled");
                            }
                            console.log('Stage 4 message');
                        }
                        else {
                            $(".menuli.o15").find(".finalisesmsg").hide();
                        }
                    }
                    else {
                        temp = STAGES[3].a + " " + STAGES[3].na;
            console.log('Stage 4 pending');
                    }
                }
            }

            calcTotals();

            // if the user is TWA, format the TWLA menu panel
            if(this.myistwa === true)
            {
                if(this.other.data.legendlock === 0)   {   // || this.twla.data.legendlock === "1")   // 3 both legends locked
                    // STAGE 1 or 2
                    if(this.other.data.legendsave === 0) {
                        // STAGE 1
                        console.log('Stage 1-na');
                        temp += " " + STAGES[1].na;
                    }
                    else {
                        // STAGE 2
                        console.log('Stage 2-na');
                        temp += " " + STAGES[2].na;
                    }
                }
                else {
                    // STAGE 3 or 4
                    if(Totals[0].H + Totals[0].A === 0) {       // no scores recorded yet
                        // STAGE 3.x
                        console.log('Stage 3-na');
                        temp += " " + STAGES[3].na;
                        if(this.my.data.legendlock === 0) {
                            // WAITING FOR OTHER TEAM TO LOCK
                            temp += " " + STAGES[3].na;
                            // disable menuitem
                            if(!this.myistwa) {
                                $("#enterresultsmsg").show();
                            }
                            else {
                                // DISPLAY A DIFFERENT MESSAGE FOR THE AWAY TEAM
                            }
                        }
//                        else {
//                            var msg = '<p style="text-align:center">All Players Locked<p><p style="text-align:center"><b>MATCH IS READY!</b></p>';
//                            showNoty(msg, 'success', 'center', 0);
//                        }
                    }
                }
            }
        }

        temp = $.trim(temp);

        console.log('~' + temp + '~');

        disableitems = temp.split(" ");

console.log(disableitems);

        if(this.myistwa) {
            $(".menuli.o16").hide();
        }

        $(".menuli").removeClass("ui-disabled");
        $.each(disableitems, function(k,o) {
            console.log(o);
            $("." + o).addClass("ui-disabled");
        });

        return ret;
    }
}

function getLastUpdateTime(lock) {
    if(udc(lock)) { lock === false; }
    var lastedit = Data.lastresultupdate;
    if(lock === true) {
        FinLockUpdateTime = lastedit;
    }
    return lastedit;
}

function getLastResultUpdateSecs()
{
    var retval = 0;
    if(parseInt(Data.config.finalisedelaymins) > 0) {
        var lastedit = getLastUpdateTime();
        var now = parseInt($.now() / 1000);
        var secstogo = lastedit + (parseInt(Data.config.finalisedelaymins) * 60);
        if(secstogo > now) {
            retval = secstogo - now;
        }
    }
    else {
        retval = -1;
    }
//    console.log('getLastResultUpdateSecs:' + retval);

    return retval;
}

function showNoty(msg, type, position, timeout, anim) {
    console.log('Noty: ' + msg);
    var animation = {};
    if(typeof anim != 'undefined') {
        animation = anim;
    }
    var n = new Noty({
        text: msg,  //'<p style="text-align:center">LEGEND SAVED<p><p style="text-align:center">Return to Main page?</p>',
        layout: position,   //'center',
        type: type, //'alert',
        theme: 'relax',
        timeout: timeout,   // 4000,
        modal: false,
        animation: animation,
    });
    n.show();
}

/* Process that runs from the menu page */
function checkFinaliseStatus()
{
    var secs = 0;
    var trigger_interval = false;

    if($(".refreshsecs.show").length > 0) {
        secs = parseInt($(".refreshsecs.show").text());
        trigger_interval = true;
    }

    secs = secs - 1;

//console.log('checkFinaliseStatus::' + secs);

    if(secs < 0) {

        clearInterval(lockcheckinterval);
        lockcheckinterval = 0;

        var waitsecs = getLastResultUpdateSecs();

//console.log('** waitsecs1::' + secs);

        secs = 15;
        if(waitsecs > 0 && waitsecs < secs) {
            secs = waitsecs;
            $(".refreshsecs.show").text(secs);
        }

//console.log('** waitsecs2::' + secs);

        $.ajax({
            url: apiURL + 'checkfinalisestatus',
            data: {
                action: 'checkfinalisestatus',
                drawid: Teams.twa.data.drawid,
                twapin: Teams.twa.data.remotepin
            },
            success: function(data) {

                console.log(data);

                Teams.twa.data.remotestatusid = data.remotestatusid;

                Teams.twa.data.remotestatusid = data.remotestatusid;
                Data.lastresultupdate = parseInt(data.lastupdate.my);

                Teams.other.data.lastresultupdate = parseInt(data.lastupdate.other);
                Teams.my.data.lastresultupdate = parseInt(data.lastupdate.my);

                Teams.getStage();

//                console.log(Teams.twa.data.remotestatusid);
//                console.log(getLastResultUpdateSecs());

                if(Teams.twa.data.remotestatusid == "2" && waitsecs !== 0) {
                    if(lockcheckinterval === 0 && trigger_interval) {
                        lockcheckinterval = setInterval(checkFinaliseStatus, 1000);
                    }
                    else {
                        myAlert('error', 'Finalise Error', 'Other team as updated data recently', function () { $.mobile.changePage('home.html'); });
                    }
                }
                else {
                    if(lockcheckinterval > 0) {
                        clearInterval(lockcheckinterval);
                        lockcheckinterval = 0;
                    }
                    $(".finalisesmsg").hide();
                    $(".finaliseawaymatch").removeClass("ui-disabled");
                    var reason = getLastResultUpdateSecs() === 0 ? 'Wait period has elapsed' : 'Other Team has Finalised';
                    var msg = '<p style="text-align:center">' + reason + '<p><p style="text-align:center"><b>FINALISE NOW</b></p>';
                    showNoty(msg, 'success', 'center', 0);
                }
            },
            error:function(errdata) {
                console.log('ERROR');
                displayErrMsg('Error', errdata);    //  }
            }
        });
    }

    if($(".waitsecs").length > 0) {
        $(".waitsecs").text(formatSeconds(getLastResultUpdateSecs()));
    }

    $(".refreshsecs").text(secs);
}

function checkLockStatus()
{
    var secs = parseInt($(".refreshsecs.show").text());
    secs = secs - 1;
    if(secs < 0) {

        clearInterval(lockcheckinterval);
        lockcheckinterval = 0;

        secs = 15;
        $.ajax({
            url: apiURL + 'checkplayerlockstatus',
            data: {
                action: 'checkplayerlockstatus',
                otherpin: Teams.other.data.remotepin
            },
            success: function(data) {
                console.log(data);
                Teams.other.data.legendlock = parseInt(data.legendlock);
                Teams.getStage();
                if(Teams.other.data.legendlock === 0) {
                    lockcheckinterval = setInterval(checkLockStatus, 1000);
                }
                else {
                    $(".enterresultsmsg").hide();
                    var msg = '<p style="text-align:center">All Players Locked<p><p style="text-align:center"><b>MATCH IS READY!</b></p>';
                    showNoty(msg, 'success', 'center', 0);
                }
            },
            error:function(errdata) {
                console.log('ERROR');
                displayErrMsg('Error', errdata);    //  }
            }
        });
    }
    $(".refreshsecs").text(secs);
}

// update pos value for block
function updateMatchsheet(code, data)
{
    var scode;
    var block;

//console.log(code);
//console.log(data);

    if(data.remotedata.blockno !== undefined) {

        block = data.blockno;

        if(data.gbcode.type == "L") {           // LEGEND
            scode = LegendCode(code);
        }
        else {
            scode = StatsCode(code, block);
        }
        //    var blockobj = {};
        var hora = {};

//console.log(scode);

        var blockobj = MatchSheet[block] === undefined ? {} : MatchSheet[block];
        var hora = blockobj[scode.pos] === undefined ? {} : blockobj[scode.pos];

        hora[scode.gbcode] = data;
        blockobj[scode.pos] = hora;

        MatchSheet[block] = blockobj;
    }
}

function validatePwds(pwd1, pwd2, errobj)
{
    if(pwd1.length > 0) {
        if(pwd1.length > 5) {
            if(pwd1 === pwd2) {
                return true
            }
            else {
                $(errobj).text("Not the same");
            }
        }
        else {
            $(errobj).text("Must be 6 or more characters");
        }
    }
    else {
        $(errobj).text("Cannot be blank");
    }
    return false;
}

// <editor-fold defaultstate="collapsed" desc="MyAlert/Confirm">
function myAlert(type, title, msg, callback)
{
    modal({
        type: type, //Type of Modal Box (alert | confirm | prompt | success | warning | error | info | inverted | primary)
        title: title, //Modal Title
        text: msg, //Modal HTML Content
        size: 'small', //Modal Size (normal | large | small)
        buttons: [{
                text: 'OK', //Button Text
                val: 'ok', //Button Value
                eKey: true, //Enter Keypress
                // Button Classes (btn-large | btn-small | btn-green | btn-light-green | btn-purple | btn-orange | btn-pink |
                // btn-turquoise | btn-blue | btn-light-blue | btn-light-red | btn-red | btn-yellow | btn-white | btn-black |
                // btn-rounded | btn-circle | btn-square | btn-disabled)
                addClass: 'btn-light-blue',
                onClick: function (dialog) {
                    return true;
                }
            }, ],
        center: true, //Center Modal Box?
        autoclose: false, //Auto Close Modal Box?
        callback: callback, //Callback Function after close Modal (ex: function(result){alert(result); return true;})
        onShow: function (r) {

        }, //After show Modal function
        closeClick: true, //Close Modal on click near the box
        closable: true, //If Modal is closable
        theme: 'atlant', //Modal Custom Theme (xenon | atlant | reseted)
        animate: false, //Slide animation
        background: 'rgba(0,0,0,0.35)', //Background Color, it can be null
        zIndex: 2000, //z-index
        buttonText: {
            ok: 'OK',
            yes: 'Yes',
            cancel: 'Cancel'
        },
        template: '<div class="modal-box"><div class="modal-inner"><div class="modal-title">' +
                '<a class="modal-close-btn"></a></div><div class="modal-text"></div><div class="modal-buttons"></div></div></div>',
        _classes: {
            box: '.modal-box',
            boxInner: ".modal-inner",
            title: '.modal-title',
            content: '.modal-text',
            buttons: '.modal-buttons',
            closebtn: '.modal-close-btn'
        }
    });
}

function myConfirm(title, msg, answer)
{
    modal({
        type: 'confirm', //Type of Modal Box (alert | confirm | prompt | success | warning | error | info | inverted | primary)
        title: title, //Modal Title
        text: msg, //Modal HTML Content
        size: 'small', //Modal Size (normal | large | small)
        buttons: [
            {
                text: 'OK', //Button Text
                val: 'ok', //Button Value
                eKey: true, //Enter Keypress
                addClass: 'btn-light-blue button40',
                // Button Classes (btn-large | btn-small | btn-green | btn-light-green | btn-purple | btn-orange | btn-pink |
                // btn-turquoise | btn-blue | btn-light-blue | btn-light-red | btn-red | btn-yellow | btn-white | btn-black |
                // btn-rounded | btn-circle | btn-square | btn-disabled)
                onClick: function (d) {
//                    console.log(d);
                },
            },
            {
                text: 'Cancel', //Button Text
                val: 'cancel', //Button Value
                eKey: false, //Enter Keypress
                addClass: 'btn-light-red button40',
                // Button Classes (btn-large | btn-small | btn-green | btn-light-green | btn-purple | btn-orange | btn-pink |
                // btn-turquoise | btn-blue | btn-light-blue | btn-light-red | btn-red | btn-yellow | btn-white | btn-black |
                // btn-rounded | btn-circle | btn-square | btn-disabled)
                onClick: function (d) {
//                    console.log(d);
                },
            }
        ],
        center: true, //Center Modal Box?
        autoclose: false, //Auto Close Modal Box?
        callback: answer, //Callback Function after close Modal (ex: function(result){alert(result); return true;})
        onShow: null, //After show Modal function
        closeClick: false, //Close Modal on click near the box
        closable: true, //If Modal is closable
        theme: 'atlant', //Modal Custom Theme (xenon | atlant | reseted)
        animate: false, //Slide animation
        background: 'rgba(0,0,0,0.35)', //Background Color, it can be null
        zIndex: 2000, //z-index
        buttonText: {
            ok: 'OK',
            yes: 'Yes',
            cancel: 'Cancel'
        },
        template: '<div class="modal-box"><div class="modal-inner"><div class="modal-title">' +
                '<a class="modal-close-btn"></a></div><div class="modal-text"></div><div class="modal-buttons"></div></div></div>',
        _classes: {
            box: '.modal-box',
            boxInner: ".modal-inner",
            title: '.modal-title',
            content: '.modal-text',
            buttons: '.modal-buttons',
            closebtn: '.modal-close-btn'
        }
    });
}

function addplayerdialog(playerType, teamcode, playerid, createPlayer_Success, createPlayer_Error)
{
    var mode = parseInt(playerid) === 0 ? 'Add ' : 'Edit ';
    var hora = teamcode[0];

    var pname = '';
    var origpname = ''
    var rank = '0';
    var origrank = '';
    var readonly = '';

    var isEdited = false;
    if(isset(Teams[hora].data.livescoredata[playerid])) {
        isEdited = true;
    }

    if(playerid > 0) {
        pname = Players[hora][playerid].fullname;
        rank = Players[hora][playerid].rank;
        if(isEdited) {
            origpname = ' (' + Players[hora][playerid].origfullname + ')';
            origrank = ' (' + Players[hora][playerid].origrank + ')';
        }
        if(Players[hora][playerid].new == '0') {
            readonly = 'color:blue;pointer-events:none;';
        }
    }
    console.log('pname: ' + pname +  ', rank: ' + rank );

    var title = mode + playerType;

    var teamname = Teams.my.teamname;

    if(Teams.other.teamcode == teamcode) {
        teamname = Teams.other.teamname;
    }

    var msg = '<p>' + mode + playerType + ' in <b>' + teamname + ':</b></p>' +
            '<form id="addplayer"><label for="dlgFullName" class="modallbl">Player Name' + origpname + '</label>' +
            '<input type="text" id="dlgFullName" value="' + pname + '" class="otherpwdinput" />' +
            //            '<div class="rankinput" style="padding-top:10px;">' +
    (Data.config.hasrankings == '1' ?
        '<label for="dlgRank" class="modallbl">Player Rank' + origrank + '</label>' +
            '<input type="text" style="width:80px;' + readonly + '" id="dlgRank" value="' + rank + '" class="otherpwdinput" />'
        :
            '<input type="hidden" id="dlgRank" value="0" class="otherpwdinput" />'
            ) +
            '<div id="addplayersubmitmsg" class="submitresult" data-result="null"></div>' +
            //            '</div>';
    '</form>';

    console.log('myAddPlayerDialog->enter');

    myAddPlayerDialog(title, msg,
        function() {

            console.log('add player submit button clicked');

    //        var teamcode = $("#psteamname").data("side");
    //        var hora = teamcode[0];
            var pin = $("#psteamname").data("pin");
            var pname = $.trim($("#dlgFullName").val());
            var trank = $.trim($("#dlgRank").val().toUpperCase());
            var prank = 0;
            var temp = 0;

            if(pname.length === 0 || pname.indexOf(" ") === -1) {
                $("#addplayersubmitmsg").text("Player Name must include First name & Surname").css("color","red");
                return false;
            }

            var newrank = [];

            if(Data.config.hasrankings == '1') {

                if(trank.indexOf('T') > -1) {
                    trank = trank.replace('T','');
                    temp = 1;
                }

                var reg = /^\d+(\.\d{1})?$/;    // allows "77" or "77.5" but not "77." or "77.55"

                newrank = trank.match(reg);

                if(newrank === null) {
                    $("#addplayersubmitmsg").text("Rank is not Valid.  Must be number, ie: '77', '77.5'. optional 'T' at end if rank is temporary").css("color","red");
                    return false;
                }

                var minpr = parseInt(Data.config.minplayerrank);
                var maxpr = parseInt(Data.config.maxplayerrank);
                var newpr = parseInt(newrank[0]);

                if(minpr + maxpr > 0) {
                    if(newpr < minpr || newpr > maxpr) {
                        $("#addplayersubmitmsg").text("Rank is not Valid. Must be in range of " + minpr + " to " + maxpr).css("color","red");
                        return false;
                    }
                }
                newrank[1] = temp;
            }
            else {
                newrank[0] = 0;
                newrank[1] = 0;
            }

            // team, pin, pname, prank, ptype, createPlayer_success, createPlayer_fail

            console.log(String.format('createPlayer({0}, {1}, {2}, {3}, {4})', teamcode, pin, pname, prank, 1));

            if(parseInt(playerid) === 0) {
                createPlayer(teamcode, pin, pname, newrank, 1);     // teamid, pin, pname, prank, ptype
            }
            else {
                updatePlayer(teamcode, pin, playerid, pname, newrank, 1);
            }
        }
        ,
        createPlayer_Error
    );
}

function myAddPlayerDialog(title, msg, addplayer_success, addplayer_fail)
{
    modal({
        type: 'primary', //Type of Modal Box (alert | confirm | prompt | success | warning | error | info | inverted | primary)
        title: title, //Modal Title
        text: msg, //Modal HTML Content
        size: 'small', //Modal Size (normal | large | small)
        buttons: [
            {
                text: 'Submit', //Button Text
                val: 'submit', //Button Value
                eKey: true, //Enter Keypress
                addClass: 'btn-light-green button40',
                onClick: function(d) {

                    addplayer_success(d);
                }
            },
            {
                text: 'Cancel', //Button Text
                val: 'cancel', //Button Value
                eKey: false, //Enter Keypress
                addClass: 'btn-light-red button40 addplayer btncancel',
                onClick: function(d) {
                    console.log('add player cancel button clicked');
                    console.log(d.val);
                    return true;
                }
            }
        ],
        center: true, //Center Modal Box?
        autoclose: false, //Auto Close Modal Box?
        callback: null, //Callback Function after close Modal (ex: function(result){alert(result); return true;})
        onShow: function(r) {
            //            $("#otherpassword").focus();
        }, //After show Modal function
        closeClick: false, //Close Modal on click near the box
        closable: true, //If Modal is closable
        theme: 'atlant', //Modal Custom Theme (xenon | atlant | reseted)
        animate: false, //Slide animation
        background: 'rgba(0,0,0,0.35)', //Background Color, it can be null
        zIndex: 3000, //z-index
        template: '<div class="modal-box"><div class="modal-inner"><div class="modal-title">' +
                '<a class="modal-close-btn"></a></div><div class="modal-text"></div><div class="modal-buttons"></div></div></div>',
        _classes: {
            box: '.modal-box',
            boxInner: ".modal-inner",
            title: '.modal-title',
            content: '.modal-text',
            buttons: '.modal-buttons',
            closebtn: '.modal-close-btn'
        }
    });
}
//</editor-fold>

//<editor-fold defaultstate="collapsed" desc="Team Pin Dialog">
function adminpindialog(adminpinLogin_Success, adminpinLogin_Error)
{
    var title = 'Admin Pin Login';

    var msg = '<p>Enter Admin/Match Pin:</p>' +
            '<form id="adminpinform">' +
            '<input type="password" name="teampin" id="teampin" placeholder="Enter PIN here..." class="otherpwdinput" />' +
            '<div id="teampinsubmitmsg" class="submitresult" data-result="null"></div>' +   // <div class="teampinbuttons">
    '</form>';

    console.log('adminpindialog()');
    myTeamPinDialog(title, msg, adminpinLogin_Success, adminpinLogin_Error);
}

//<editor-fold defaultstate="collapsed" desc="Team Pin Dialog">
function teampindialog(teampinLogin_Success, teampinLogin_Error)
{
    var title = 'Team Pin Login';

    var msg = '<p>Enter Team Pin:</p>' +
            '<form id="teampinform">' +
            '<input type="password" name="teampin" id="teampin" placeholder="Enter PIN here..." class="otherpwdinput" />' +
            '<div id="teampinsubmitmsg" class="submitresult" data-result="null"></div>' +   // <div class="teampinbuttons">
    '</form>';

    console.log('adminpwddialog()');
    myTeamPinDialog(title, msg, teampinLogin_Success, teampinLogin_Error);
}

function myTeamPinDialog(title, msg, teampinLogin_Success, teampinLogin_Error)  // checkpwd_success, checkpwd_error)
{
    var now = $.now();

    var teampin = title == 'Team Pin Login';

    if(teampin) {
        console.log('TeamPinDialog');
    }
    else {
        console.log('AdminPinDialog');
    }

    modal({
        type: 'primary', //Type of Modal Box (alert | confirm | prompt | success | warning | error | info | inverted | primary)
        title: title, //Modal Title
        text: msg, //Modal HTML Content
        size: 'small', //Modal Size (normal | large | small)
        buttons: [
            {
                text: 'Submit', //Button Text
                val: 'submit', //Button Value
                eKey: true, //Enter Keypress
                addClass: 'btn-light-green button40',
                onClick: function(e) {

                    $("#teampinsubmitmsg").text("Connecting, please wait...").css("color","rgb(0,180,0)");

                    var pin = $.trim($("#teampin").val());

                    if(pin.length != 6) {
                        if((pin.length != 8 && teampin) || !teampin) {
                            //                            e.preventDefault();
                            //                            myAlert("error", "Pin Error", "PIN is not valid(1)");   // must be 6 or 8 digits
                            $("#teampinsubmitmsg").text("PIN is not valid (E:1)").css("color","red");
                            return false;
                        }
                    }

                    // if 6 digits, all characters must be numeric
                    if(pin.length === 6 && /^\d+$/.test(pin) === false) {
                        //                        e.preventDefault();
                        $("#teampinsubmitmsg").text("PIN is not valid (E:2)").css("color","red");
                        return false;
                    }

                    if(pin.length === 8 && teampin) {

                        var pin1 = pin.slice(0,4);  // lower case char only
                        var pin2 = pin.slice(4,8);  // number only

                        //  must first 4 chars, last 4 numbers
                        if(/^[a-z]+$/.test(pin1) === false) {
                            //                            e.preventDefault();
                            //                            myAlert("error", "Pin Error", "PIN is not valid(3)");
                            $("#teampinsubmitmsg").text("PIN is not valid (E:3)").css("color","red");
                            return false;
                        }

                        //  must first 4 chars, last 4 numbers
                        if(/^\d+$/.test(pin2) === false) {
                            //                            e.preventDefault();
                            //                            myAlert("error", "Pin Error", "PIN is not valid(4)");
                            $("#teampinsubmitmsg").text("PIN is not valid (E:4)").css("color","red");
                            return false;
                        }
                    }

                    $("#teampinsubmitmsg").text("Connecting, please wait...").css("color","rgb(0,180,0)");

                    if(pin.length == 6) {
                        populateHomePage("pin", pin);
                    }
                    else {
                        populateHomePage("teampin", pin);
                    }

                    return false;

                }
            },
            {
                text: 'Cancel', //Button Text
                val: 'cancel', //Button Value
                eKey: false, //Enter Keypress
                addClass: 'btn-light-red button40 teampinbtncancel btncancel' + now,
                onClick: function(d) {
                    console.log(d.val);
                    return true;
                }
            }
        ],
        center: true, //Center Modal Box?
        autoclose: false, //Auto Close Modal Box?
        callback: null, //Callback Function after close Modal (ex: function(result){alert(result); return true;})
        onShow: function(r) {
            $("#otherpassword").focus();
        }, //After show Modal function
        closeClick: false, //Close Modal on click near the box
        closable: true, //If Modal is closable
        theme: 'atlant', //Modal Custom Theme (xenon | atlant | reseted)
        animate: false, //Slide animation
        background: 'rgba(0,0,0,0.35)', //Background Color, it can be null
        zIndex: 3000, //z-index
        template: '<div class="modal-box"><div class="modal-inner"><div class="modal-title">' +
                '<a class="modal-close-btn"></a></div><div class="modal-text"></div><div class="modal-buttons"></div></div></div>',
        _classes: {
            box: '.modal-box',
            boxInner: ".modal-inner",
            title: '.modal-title',
            content: '.modal-text',
            buttons: '.modal-buttons',
            closebtn: '.modal-close-btn'
        }
    });
}
//</editor-fold>

//<editor-fold defaultstate="collapsed" desc="Admin Pwd Dialog">
function adminpwddialog(adminLogin_Success, adminLogin_Error)
{
    var title = 'Admin Login';

    var msg = '<p>Enter Admin Password or Unlock PIN:</p>' +
            '<form id="adminpwd">' +
            '<input type="password" name="admin2password" id="admin2password" placeholder="Enter Password here..." class="otherpwdinput" />' +
            '<div id="pwdsubmitmsg" class="submitresult" data-result="null"></div>' +     // <div class="adminpwdbuttons">
    '</form>';

    console.log('adminpwddialog()');
    myAdminPwdDialog(title, msg, adminLogin_Success, adminLogin_Error);
}

function myAdminPwdDialog(title, msg, checkpwd_success, checkpwd_error)
{
    var now = $.now();

    modal({
        type: 'inverted', //Type of Modal Box (alert | confirm | prompt | success | warning | error | info | inverted | primary)
        title: title, //Modal Title
        text: msg, //Modal HTML Content
        size: 'small', //Modal Size (normal | large | small)
        buttons: [
            {
                text: 'Submit', //Button Text
                val: 'submit', //Button Value
                eKey: true, //Enter Keypress
                addClass: 'btn-light-green button40',
                onClick: function(d) {

                    $("#pwdsubmitmsg").text("Connecting, please wait...").css("color","rgb(0,180,0)");

                    var data = {
                        action: 'myAdminPwdDialog',
                        userip: Settings.userip,
                        userAgent: CID.userAgent,
                        uuid: CID.uuid,
                        deviceid: CID.deviceid,     // table auto-id for this device
                        logintype: LOGIN_ADMIN,
                        teamid: Teams.my.teamid,
                        remid: Teams.my.data.id,
                        pinorpwd: $("#admin2password").val(),
                        timezone: Data.config.timezone,
                        drawid: Data.draw.id
                    };

                    $.ajax({
                        url: apiURL + 'checkadminpassword',
                        data: data,
                        success: function(data) {
                            console.log("SUCCESS");
                            //                            console.log(data);
                            if(data.result == 'SUCCESS') {
                                $("#pwdsubmitmsg").text("password verified").css("color","rgb(0,180,0)");
                                $("#pwdsubmitmsg").attr("data-result", "ok");

                                // ALLOW ADMIN ACCESS

                                console.log("success");
                                //                                if(typeof data !== 'undefined') {
                                //                                    saveTokenLocal(data, LSTR_JWTTOKENOTHER);
                                //                                }
                                //                                checkpwd_success(data);     // otherTeamLogin_Success
                                myConfirm('Unlock Players', '<p>Select teams that require players to be unlocked for this match:</p>' +
                                        '<p><input id="unlockhometeam" type="checkbox" name="unlockhometeam" value="' + Teams.H.hteamid + '"><span style="margin-left:10px;">' + Teams.H.shortname + '</span></p>' +
                                        '<p><input id="unlockawayteam" type="checkbox" name="unlockawayteam" value="' + Teams.A.hteamid + '"><span style="margin-left:10px;">' + Teams.A.shortname + '</span></p>' +
                                        '<p>Click <b>Yes</b> to unlock Players for selected teams</p>',
                                function(answer) {
                                    if(answer) {
                                        console.log('cancel.click');
                                        $(".btncancel" + now).trigger('click');
                                        var mydata = {
                                            drawid: Data.draw.id,
                                            hteamid: Teams.H.teamid,
                                            hteamchecked: $("#unlockhometeam").is(":checked") ? 1 : 0,
                                            ateamid: Teams.A.teamid,
                                            ateamchecked: $("#unlockawayteam").is(":checked") ? 1 : 0,
                                        }
                                        $.ajax({
                                            url: apiURL + 'unlocklegend',
                                            data: mydata,
                                            success: function(data) {
                                                console.log(data);
                                                myAlert('alert', 'Unlock Complete', '<p>Unlock command successful!</p><p>App will now reload</p>', function() { reloadSite(); });
                                            },
                                            error: function(err) {
                                                console.log('ERROR');
                                                console.log(err);
                                            }
                                        });

                                    }
                                });
                            }
                            else {
                                $("#pwdsubmitmsg").text(data.msg + ", try again").css("color", "red");
                                $("#pwdsubmitmsg").attr("data-result", "fail");
                                console.log('fail');
                                //                                checkpwd_fail();
                            }
                        },
                        error: function(err) {
                            $("#pwdsubmitmsg").text(err.statusText + ", try again").css("color","red");
                            $("#pwdsubmitmsg").attr("data-result", "error");
                            console.log('error');
                            console.log(err);

                            checkpwd_error();
                        }
                    });
                }
            },
            {
                text: 'Cancel', //Button Text
                val: 'cancel', //Button Value
                eKey: false, //Enter Keypress
                addClass: 'btn-light-red button40 btncancel' + now,
                onClick: function(d) {
                    console.log(d.val);
                    return true;
                }
            }
        ],
        center: true, //Center Modal Box?
        autoclose: false, //Auto Close Modal Box?
        callback: null, //Callback Function after close Modal (ex: function(result){alert(result); return true;})
        onShow: function(r) {
            $("#adminpassword").focus();
        }, //After show Modal function
        closeClick: false, //Close Modal on click near the box
        closable: true, //If Modal is closable
        theme: 'atlant', //Modal Custom Theme (xenon | atlant | reseted)
        animate: false, //Slide animation
        background: null, // 'rgba(0,0,0,0.35)', //Background Color, it can be null
        zIndex: 2500, //z-index
        template: '<div class="modal-box"><div class="modal-inner"><div class="modal-title">' +
                '<a class="modal-close-btn"></a></div><div class="modal-text"></div><div class="modal-buttons"></div></div></div>',
        _classes: {
            box: '.modal-box',
            boxInner: ".modal-inner",
            title: '.modal-title',
            content: '.modal-text',
            buttons: '.modal-buttons',
            closebtn: '.modal-close-btn'
        }
    });

}
// #endregion
//</editor-fold>

//<editor-fold defaultstate="collapsed" desc="Team Login Dialog">
function otherteampwddialog(callingfunc, otherTeamLogin_Success, otherTeamLogin_Error)
{
    console.log('*** otherteampwddialog, (called from ' + callingfunc + ')');

    var ltype = "Team PIN";
    if(Settings.logintype === LOGIN_TEAMPWD) {
        ltype = "Team Password";
    }
    var title = ltype + ' Required';

    var msg = '<p>Enter ' + ltype + ' for ' + Teams.other.teamname + ':</p>' +
            '<form id="therteampwd">' +
            '<input type="password" name="password" id="otherpassword" placeholder="Enter Password here..." class="otherpwdinput" />' +
            '<div id="pwdsubmitmsg" class="submitresult" data-result="null"></div>' +   // <div class="otherpwdbuttons">
    '</form>';

    myPwdDialog(title, msg, otherTeamLogin_Success, otherTeamLogin_Error);
}

function myPwdDialog(title, msg, otherTeamLogin_Success, otherTeamLogin_Error)  // checkpwd_success, checkpwd_error)
{
    var now = $.now();

    console.log('myPwdDialog');

    modal({
        type: 'primary', //Type of Modal Box (alert | confirm | prompt | success | warning | error | info | inverted | primary)
        title: title, //Modal Title
        text: msg, //Modal HTML Content
        size: 'small', //Modal Size (normal | large | small)
        buttons: [
            {
                text: 'Submit', //Button Text
                val: 'submit', //Button Value
                eKey: true, //Enter Keypress
                addClass: 'btn-light-green button40',
                onClick: function(d) {

                    $("#pwdsubmitmsg").text("Connecting, please wait...").css("color","rgb(0,180,0)");

                    // set the default token to the other team
                    CURR_TOKEN = LSTR_JWTTOKENOTHER;

                    var data = {
                        action: 'myPwdDialog',
                        userip: Settings.userip,
                        userAgent: CID.userAgent,
                        uuid: CID.uuid,
                        deviceid: CID.deviceid,     // table auto-id for this device
                        logintype: Data.config.passwordtype === "1" ? LOGIN_TEAMPIN : LOGIN_TEAMPWD,
                        teamid: Teams.other.teamid,
                        hora: Teams.other.team,
                        remid: Teams.other.data.id,
                        pinorpwd: $("#otherpassword").val(),
                        timezone: Data.config.timezone,
                        drawid: Data.draw.id
                    };

                    $.ajax({
                        url: apiURL + 'checkteampassword',
                        data: data,
                        success: function(data) {
                            console.log("SUCCESS");
                            //                            console.log(data);
                            if(data.result == 'SUCCESS') {
                                $("#pwdsubmitmsg").text("password verified").css("color","rgb(0,180,0)");
                                $("#pwdsubmitmsg").attr("data-result", "ok");
                                if(typeof data !== 'undefined') {
                                    saveTokenLocal(data, LSTR_JWTTOKENOTHER);
                                }

                                otherTeamLogin_Success(data);     // otherTeamLogin_Success

                                console.log('cancel.click');
                                $(".btncancel" + now).trigger('click');
                            }
                            else {
                                $("#pwdsubmitmsg").text(data.error.text + ", try again").css("color", "red");
                                $("#pwdsubmitmsg").attr("data-result", "fail");
                                console.log('fail');
                                //                                checkpwd_fail();
                            }
                        },
                        error: function(err) {
                            $("#pwdsubmitmsg").text(err.statusText + ", try again").css("color","red");
                            $("#pwdsubmitmsg").attr("data-result", "error");
                            console.log('error');
                            console.log(err);

                            otherTeamLogin_Error(err);
                        }
                    });
                }
            },
            {
                text: 'Cancel', //Button Text
                val: 'cancel', //Button Value
                eKey: false, //Enter Keypress
                addClass: 'btn-light-red button40 btncancel' + now,
                onClick: function(d) {
                    console.log(d.val);
                    return true;
                }
            }
        ],
        center: true, //Center Modal Box?
        autoclose: false, //Auto Close Modal Box?
        callback: null, //Callback Function after close Modal (ex: function(result){alert(result); return true;})
        onShow: function(r) {
            $("#otherpassword").focus();
        }, //After show Modal function
        closeClick: false, //Close Modal on click near the box
        closable: true, //If Modal is closable
        theme: 'atlant', //Modal Custom Theme (xenon | atlant | reseted)
        animate: false, //Slide animation
        background: 'rgba(0,0,0,0.35)', //Background Color, it can be null
        zIndex: 3000, //z-index
        template: '<div class="modal-box"><div class="modal-inner"><div class="modal-title">' +
                '<a class="modal-close-btn"></a></div><div class="modal-text"></div><div class="modal-buttons"></div></div></div>',
        _classes: {
            box: '.modal-box',
            boxInner: ".modal-inner",
            title: '.modal-title',
            content: '.modal-text',
            buttons: '.modal-buttons',
            closebtn: '.modal-close-btn'
        }
    });
}
//</editor-fold>

function getMultiDrawTimes()
{
    var acttime = parseInt(Data.config.activatetimemins);
    var deacttime = parseInt(Data.config.deactivatetimemins);

    console.log('activate: ' + acttime + ', deactivate: ' + deacttime);


    var servertz = "10:00";
    var d, t;

    var mtimes = {};

    $.each(Data.multidraws, function(k,o)
    {
      $.each(o.teams, function(kk, oo)
      {
        console.log(oo);

        d = oo.ddate;
        t = oo.dtime === null ? oo.drtime : oo.dtime;

        var mval = d + "T" + t + "+" + servertz;
        console.log(d + "T" + t + "+10:00");

        var stime = moment(mval);
        var atime = stime.clone().subtract(acttime, 'm');
        var dtime = stime.clone().add(deacttime, 'm');

        mtimes[k] = {
          atime: atime.unix(), atimeobj: { datetime: atime.format('YYYY-MM-DD HH:mm A'), date: atime.format('YYYY-MM-DD'), time: atime.format('HH:mm A')},
          stime: stime.unix(), stimeobj: { datetime: stime.format('YYYY-MM-DD HH:mm A'), date: stime.format('YYYY-MM-DD'), time: stime.format('HH:mm A')},
          dtime: dtime.unix(), dtimeobj: { datetime: dtime.format('YYYY-MM-DD HH:mm A'), date: dtime.format('YYYY-MM-DD'), time: dtime.format('HH:mm A')},
        };
        return false;
      });
    });

    return mtimes;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var Base64 = {
    characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" ,

    encode: function( string )
    {
        var characters = Base64.characters;
        var result     = '';

        var i = 0;
        do {
            var a = string.charCodeAt(i++);
            var b = string.charCodeAt(i++);
            var c = string.charCodeAt(i++);

            a = a ? a : 0;
            b = b ? b : 0;
            c = c ? c : 0;

            var b1 = ( a >> 2 ) & 0x3F;
            var b2 = ( ( a & 0x3 ) << 4 ) | ( ( b >> 4 ) & 0xF );
            var b3 = ( ( b & 0xF ) << 2 ) | ( ( c >> 6 ) & 0x3 );
            var b4 = c & 0x3F;

            if( ! b ) {
                b3 = b4 = 64;
            } else if( ! c ) {
                b4 = 64;
            }

            result += Base64.characters.charAt( b1 ) + Base64.characters.charAt( b2 ) + Base64.characters.charAt( b3 ) + Base64.characters.charAt( b4 );

        } while ( i < string.length );

        return result;
    } ,

    decode: function( string )
    {
        var characters = Base64.characters;
        var result     = '';

        var i = 0;
        do {
            var b1 = Base64.characters.indexOf( string.charAt(i++) );
            var b2 = Base64.characters.indexOf( string.charAt(i++) );
            var b3 = Base64.characters.indexOf( string.charAt(i++) );
            var b4 = Base64.characters.indexOf( string.charAt(i++) );

            var a = ( ( b1 & 0x3F ) << 2 ) | ( ( b2 >> 4 ) & 0x3 );
            var b = ( ( b2 & 0xF  ) << 4 ) | ( ( b3 >> 2 ) & 0xF );
            var c = ( ( b3 & 0x3  ) << 6 ) | ( b4 & 0x3F );

            result += String.fromCharCode(a) + (b?String.fromCharCode(b):'') + (c?String.fromCharCode(c):'');

        } while( i < string.length );

        return result;
    }
}

/***** PAGE: SITES ****/

function Sites() {

    this.apiUrl = null;
    this.AppId = null;
    this.AppMode = null;
    this.AppType = null;

    var currUrl = $(location).attr('origin') + "/";
    this.currURL = currUrl;

console.log(this.currURL);

    var sites = {
        // DEV
        'https://lsp': {   api:'https://psl/',appid:'PSMOB2.DEV',    appmode:'DEV2',apptype:'LIVE'},
        'https://lsview': {api:'https://psl/',appid:'PSMOB.VIEW.DEV',appmode:'DEV ',apptype:'VIEW'},
        // PROD
        'ls.poolstat.net.au': {    api:'https://www.poolstat.net.au/',appid:'PSMOB2.AU',    appmode:'LIVE2.AU',apptype:'LIVE'},
        'lsview.poolstat.net.au': {api:'https://www.poolstat.net.au/',appid:'PSMOB.VIEW.AU',appmode:'LIVE',    apptype:'VIEW'},
        // PLAY
        'lsplay.poolstat.net.au': {    api:'https://play.poolstat.net.au/',appid:'PSMOB2.PLAY',    appmode:'PLAY2',apptype:'LIVE'},
        'lsviewplay.poolstat.net.au': {api:'https://play.poolstat.net.au/',appid:'PSMOB.VIEW.PLAY',appmode:'PLAY', apptype:'VIEW'},
        // TEST
        'lstest.poolstat.net.au': {    api:'https://test.poolstat.net.au/',appid:'PSMOB2.TEST',    appmode:'TEST2',apptype:'LIVE'},
        'lsviewtest.poolstat.net.au': {api:'https://test.poolstat.net.au/',appid:'PSMOB.VIEW.TEST',appmode:'TEST', apptype:'VIEW'},
        // PROD.UK
        'ls.poolstat.uk': {    api:'https://www.poolstat.uk/',appid:'PSMOB2.UK',    appmode:'LIVE2.UK',apptype:'LIVE'},
        'lsview.poolstat.uk': {api:'https://www.poolstat.uk/',appid:'PSMOB.VIEW.UK',appmode:'LIVE.UK', apptype:'VIEW'},
        // MEMBER
        'member_live': {api:'https://www.poolstat.net.au/',appid:'MEMBER.LIVE',appmode:'LIVE',apptype:'LIVE'},
        'member_view': {api:'https://www.poolstat.net.au/',appid:'MEMBER.VIEW',appmode:'VIEW',apptype:'VIEW'},
    };

    var self = this;
    $.each(sites, function(k, site) {
        if(currUrl.indexOf(k) > -1) {
            console.log(this);
            self.apiUrl = site.api;
            self.AppId = site.appid;
            self.AppMode = site.appmode;
            self.AppType = site.apptype;
            return false;
        }
    });
}

function SiteStatus()
{
    this.pageName;
    this.pageVersion;
    this.libVersion;
    this.dbVersion;

    this.getVersion = function() {
        var ASTER = '';
        if(this.pageVersion === this.dbVersion) {
            if(this.libVersion !== this.dbVersion) {
                ASTER = '*';
            }
        }
        else {
            ASTER = '*';
        }
        return this.dbVersion + ASTER;
    }
    this.getUptime = function() {
        var now = moment();
    }
    this.showStatus = function() {
        var msg = '<table style="width:100%"><tr><td style="width:40%;"><b>Page Name:</b></td><td style="width:60%;">' + SS.pageName + '</td>';
        msg += "<tr><td><b>Page Version:</td><td>" + SS.pageVersion + '</td>';
        msg += "<tr><td><b>Lib Version:</td><td>" + SS.libVersion + '</td>';
        msg += "<tr><td><b>Db Version:</td><td>" + SS.dbVersion + '</td>';
//        msg += "<tr><td><b>Real-time:</td><td>" + SS.ablyStatus + '</td>';
//        msg += "<tr><td><b>Uptime:</td><td>" + SS.ablyUptime + '</td></tr></table>';
        return msg;
    }
}
