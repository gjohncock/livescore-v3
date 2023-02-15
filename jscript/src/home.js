/* 2.1.100 */

"use strict";

function jsVersion() {
    var ver = 'data-appversion="2.1.100"';
    var myver = ver.split('"');
    return myver[1];
}

class MLS
{
    constructor(storekey)
    {
        this.storekey = storekey;
        this.store = JSON.parse( localStorage.getItem(storekey) );
        console.log('localStorage.' + storekey, this.store);
        if( this.store === null ) {
            this.store = {};
        }
    }

    getval(key, valifinvalid = -1) {
        if( this.store !== null ) {
            console.log(key, this.store[key]);
            if(typeof this.store[key] === 'undefined') {
                return valifinvalid;
            }
            else {
                return this.store[key];
            }
        }
        return valifinvalid;
    }
    
    setval(key, val) {
        if( this.store !== null ) {
            this.store[key] = val;
            this.save();
        }
    }
    
    save() {
        localStorage.setItem(this.storekey, JSON.stringify(this.store));
    }
}

function getPlayerAbbrev() {
    let pa = Data.config.playerabbrev;
    let setts = new MLS('ls-settings');
    if( setts ) {
        pa = setts.getval('nameformat', pa);
    }
    return pa;
}

// let getstring = window.location.search;
// console.log(getstring);
// let getprms = getstring.split("=");
// if( getprms[0].indexOf('teampin') > -1) {
//     localStorage.setItem('teampin', getprms[1]);
//     let url = window.location.href;
//     url = url.replace(window.location.search, "");
//     window.location.href = url;
// }

var METHOD_DUAL_AUTH = "0";
var METHOD_SOLO_AUTH = "1";

var InitData = {};

var pageDirty = false;
var pageOpenData = null;

var lockcheckinterval = 0;
var finalisecheckinterval = 0;

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

var SS = new SiteStatus();

var APP_VERSION = 5;
var PWD = "Szso6oRlT6ES7jK";

var Data = {};
var Version = {};
var Players = {};
var Legend = {};
var LegendCodes = {};
var Multi = {};

var Blocks = {};
var MatchSheet = {};
var GBCodes = {};
var Totals = {};        // Result Totals by Block, Legend (Block 0) is Total of all other Blocks
var RankTotals = {};
var Spots = {};

var PAGE_NAME = '';
var PAGE_VERSION = '';

var WIN_DEFAULT = "W";
var WIN_POINTS = "WP";
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

/***** PAGE: SITES ****/

function Sites() {

    this.apiUrl = null;
    this.AppId = null;
    this.AppMode = null;
    this.AppType = null;

    this.currURL = $(location).attr('origin') + "/";
    this.memberkey = memberApiKey;
    this.env = memberApiEnv;

console.log(this.currURL);

    var sites = {
        // DEV
        '127.0.0.1': {api:'https://psl/',appid:'PSMOB2.DEV', appmode:'DEV2', apptype:'DEV'},
        'lsdev': {api:'https://psl/',appid:'PSMOB2.DEV', appmode:'DEV2', apptype:'DEV'},
        'member_dev': {api:'https://psl/',appid:'MEMBER.DEV', appmode:'DEV', apptype:'DEV'},
        // PROD
        'ls.poolstat.net.au': {api:'https://www.poolstat.net.au/',appid:'PSMOB2.AU', appmode:'LIVE2.AU',apptype:'LIVE'},
        'member_live': {api:'https://www.poolstat.net.au/',appid:'MEMBER.LIVE',appmode:'VIEW', apptype:'MEMBER'},
        // PLAY
        'lsplay.poolstat.net.au': {api:'https://play.poolstat.net.au/', appid:'PSMOB2.PLAY', appmode:'PLAY2',apptype:'LIVE'},
        'member_play': {api:'https://play.poolstat.net.au/',appid:'MEMBER.PLAY', appmode:'VIEW', apptype:'MEMBER'},
        // TEST
        'lstest.poolstat.net.au': {api:'https://test.poolstat.net.au/', appid:'PSMOB2.TEST', appmode:'TEST2',apptype:'LIVE'},
        'member_test': {api:'https://test.poolstat.net.au/', appid:'MEMBER.TEST', appmode:'VIEW', apptype:'MEMBER'},
        // PROD.UK
        'ls.poolstat.uk': {api:'https://poolstat.uk/', appid:'PSMOB2.UK', appmode:'LIVE2.UK', apptype:'MEMBER'},
        // MEMBER
    };

    var self = this;

    $.each(sites, function(k, site) {
        // if no member key, validate URL
        if(self.memberkey.length === 0 && self.currURL.indexOf(k) > -1) {
            console.log(this);
            self.apiUrl = site.api;
            self.AppId = site.appid;
            self.AppMode = site.appmode;
            self.AppType = site.apptype;
            return false;
        }
        // if member key, validate URL once connected to API endpoint
        else if(self.memberkey.length === 32 && self.env === k) {
            self.apiUrl = site.api;
            self.AppId = site.appid;
            self.AppMode = site.appmode;
            self.AppType = site.apptype;
            return false;
        }
    });

    console.log(this);
}

function isMemberApp() {
    return Site.AppType == "MEMBER";
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

if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

class Player
{
    constructor(nm) {

        this.id = 0;                // TempPlayer()
        this.teamid = 0;            // TempPlayer()
        this.fullname = "";         // TempPlayer(), first name + surname
        this.shortname = "",        // first name initial + surname
        this.fshortname = "",       // first name + surname initial
        this.initials = "",         // first name initial, surname initial
        this.firstname = "";
        this.lastname = "";

        // only used for existing clients
        this.origfullname = null,     // if player exists, is set to database name
        this.origrank = null;

        this.rank = 0;              // TempPlayer()
        this.new = 1;
        this.status =  1;
        this.type = 1;              // TempPlayer()
        this.show = 0;
        this.temp = 0;

        this.pos = -1;
        this.code = '?';
        this.legendcode = null;     // full code: HA100, AAA00
        this.framesplayed = 0;
        this.frameswon = 0;
        this.pointsfor = 0;
        this.pointsagainst = 0;

        if(isset(nm))
        {
            this.updateFormats(nm);
        }
    }

    updateFormats(nm)
    {
        if(RESTYPE_FORFEIT.indexOf(nm.id) > -1 || RESTYPE_ABANDONED.indexOf(nm.id) > -1) {
            this.firstname = nm.fullname;
            this.lastname = "";
            this.fullname = nm.fullname;
            this.initials = nm.fullname;
            this.shortname = nm.fullname;
            this.fshortname = nm.fullname;
        }
        else {
            if(isset(nm.firstname)) {
                this.fullname = nm.firstname + " " + nm.lastname;
                this.firstname = nm.firstname;
                this.lastname = nm.lastname;
            }
            else {
                var parts = nm.fullname.split(" ");
                this.fullname = nm.fullname;
                this.firstname = parts.shift();      // first word is the first name
                this.lastname = parts.join(" ");    // all remaining words are the surname
            }

            this.initials = this.firstname[0] + this.lastname[0];
            this.shortname = this.firstname[0] + "." + this.lastname;
            this.fshortname = this.firstname + " " + this.lastname[0];
        }
    }

    TempPlayer() {
        return {
            id: this.id,
            teamid: this.teamid,
            fullname: this.fullname,         // first name + surname
            rank: this.rank,
            type: this.type
        };
    }
}

var LegendInfo = function() {
    this.code = "-";
    this.pos = 0;
    this.gbcode = "none";
    this.hora = "H";
    this.playerid = 8377;
    this.showcode = '?';
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

    console.log(e);

    if(udc(e.error)) {

        console.log('ERROR OBJECT NOT VALID');

    }
    else {

        var message = e.error.toString();

        var stack = e.error.stack;

        console.log('ERROR: in ' + e.filename + ' (' + e.lineno + ')');
        console.log(message);

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
    }
});

function logError(errdata) {
    return $.ajax({
        url: apiURL + 'errlog',
        data: errdata
    });
}

var isAppInForeground = true;

/* PHONE SLEEP */
$(window).blur(function() {
    if(isAppInForeground === true) {
//        $("#msgs").append('<p>' + "Sleep at " + moment().format("HH:mm:ss") + '</p>');
//        updateLocalActivity(10,'<p>' + "Sleep at " + moment().format("HH:mm:ss") + '</p>');

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
//        updateLocalActivity(11,'<p>' + "Awake at " + moment().format("HH:mm:ss") + '</p>');
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
//            if(parseInt(obj.playerid) > 0) {
                if(codeIsNumber === false && isNaN(parseInt(obj.code))) {
                    Legend[tcode][pos].showcode = (codeString.indexOf(obj.code) + 1).toString();
                }
                else {
                    Legend[tcode][pos].showcode = obj.code;
                }
//            }
//            else {
//                Legend[tcode][pos].showcode = '-';
//            }
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

            // if(ptype == "pin") {
            //     $("#currpin").attr("data-pin", pin);
            // }

            let tokenDetails = Data.tokenDetails;

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
                        $.mobile.changePage(PAGE_HOME);

                    }
                }

                else {

                    $.mobile.changePage(PAGE_HOME);
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

    return typeof obj !== 'undefined';
}

function isEven(n) {
  n = Number(n);
  return n === 0 || !!(n && !(n%2));
}

function checkPlayerSelectData(action)
{
    console.log('checkPlayerSelectData(' + action + ')');

    var list = {};
    $.each($(".playerselect.code"), function(k,o) {
        var id = $(o).parent().attr("data-id");
        var code = $(o).parent().attr("data-code");
        if(code != "-") {
          list[id] = code + ' ' + id;
        }
    });

console.log(list);

    pageDirty = false;
    if(action == 'start') {
        pageOpenData = JSON.stringify(list);
    }
    else {
        pageDirty = pageOpenData != JSON.stringify(list);
    }

    console.log(pageDirty);
    console.log(pageOpenData);

    if(pageDirty) {
        pageDirty = false;
        var buttonText = {ok: 'OK', yes: 'Save', cancel: 'Cancel'};
        myConfirm("Unsaved Changes", "<p>You have unsaved changes.</p><p>Do you want to SAVE them now?</p>",
            buttonText,
            function(confirm) {
                if(confirm) {
                    CPage.param = 'from_unsaved';
                    $("#ps_save").trigger("click");
                }
                else {
                    $("body").pagecontainer("change", PAGE_HOME, {reload: true});
                }
            }
        );
    }
    else {
        if(action == 'end') {
            $("body").pagecontainer("change", PAGE_HOME, {reload: true});        // return to parent
        }
    }
}

function updateSequence(seqdata, gbcode, viewonly) {

    viewonly = udc(viewonly) ? false : viewonly;

    console.log('updateSequence');

    var pm = GBCodes[gbcode];           // my player
    var po = GBCodes[pm.opponent];      // other player

    var pmframes = parseInt(pm.remotedata.framecount);
    var poframes = parseInt(po.remotedata.framecount);

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
        playedframes = pmframes + poframes;
        matchcomplete = playedframes === winframes;
        winside = pmframes > winframes ? 'home' : (poframes > winframes) ? 'away' : 'none';
    }
    else if(racetomax === RTM_BESTOFMAXFRAMES) {
        winframes = parseInt((maxframes + 1) / 2);
        matchcomplete = pmframes === winframes || poframes === winframes;
        winside = pmframes === winframes ? 'home' : 'away';
    }
    else if(racetomax === RTM_RACETOMAXFRAMES) {
        matchcomplete = pmframes === winframes || poframes === winframes;
        winside = pmframes === winframes ? 'home' : 'away';
    }

    var seq = [];

    if(seqdata !== null) {
        var seq = JSON.parse(seqdata);
    }

    // set break
    if(isEven(seq.length)) {
        hasbreak = pm.break == "B" ? 'home' : 'away';
    }
    else  {
        hasbreak = pm.break == "B" ? 'away' : 'home';
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
        if(pm.remotedata.resultstatus != '8') {

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

    var teamistwla = 0;

    // twa will always have hasaccess = 1
    if(Teams.my.data.hasaccess == "1") {
        if(Teams.my.teamid != team.teamid) {
            teamistwla = 1;
        }
    }

    if((team.selplayers - team.subcount) < Teams.minplayers) {
        myAlert('warning', 'Not enough players', '<p>You have only selected ' + team.selplayers + ' players</p><p>You must select at least ' + Teams.minplayers + ' players.</p>');
        return false;
    }

    var lockmsg = '<div style="font-size:1.5em;">' + team.shortname + '</div>' +
            '<p>If you continue...<p/><p style="text-align:center;font-size:0.9em;font-weight:bold;color:red;">PLAYERS CANNOT BE ADDED or CHANGED !</p>' +
            '<p style="text-align:center;font-size:0.9em;font-weight:bold;color:red;">SUBS CANNOT BE ADDED or CHANGED !</p>' +
            '<p>You have selected ' + team.selplayers + ' players for this match:</p>' +
            '<table id="lockconfirm" style="width:95%">' +
            '<tr><td><input type="checkbox" style="margin-right:10px;" class="lockcheck" id="confirmplayers"></td>' +
                '<td>' + (team.selplayers - team.subcount) + ' starting players</td><td class="status" style="text-align:right;color:red;">not confirmed</td></tr>' +
            '<tr><td><input type="checkbox" style="margin-right:10px;" class="lockcheck" id="confirmsubs"></td>' +
                '<td>' + team.subcount + ' subs</td><td class="status" style="text-align:right;color:red;">not confirmed</td></tr></table>' +
            '<p>Confirm your selections by ticking each box.</p>' +
            '<p>Then click <b>Yes</b> to continue</p>';

    modal({
        type: 'confirm', //Type of Modal Box (alert | confirm | prompt | success | warning | error | info | inverted | primary)
        title: 'Confirm Players/Subs', //Modal Title
        text: lockmsg, //Modal HTML Content
        size: 'small', //Modal Size (normal | large | small)
        buttons: [
            {
                text: 'OK', //Button Text
                val: 'ok', //Button Value
                eKey: true, //Enter Keypress
                addClass: 'btn-light-blue button40 btnlockcancel',
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
                addClass: 'btn-light-red button40 btnlockyes ui-disabled',
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
        callback: function(answer) {
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
//                    $(".enterresultsmsg").data('lock', 1);

                            if(Teams.my.data.legendlock == 1 && Teams.other.data.legendlock == 1 && $(".enterresultsmsg").data('lock') == '0') {
console.log('showNoty::2');
                                $(".enterresultsmsg").data('lock', '1');
                                var msg = '<p style="text-align:center">All Players Locked<p><p style="text-align:center"><b>MATCH IS READY!</b></p>';
                                showNoty(msg, 'success', 'center', 4000);
                            }
                        }
                    },
                    error:function(errdata) {
                        console.log('ERROR');
                        displayErrMsg('Access Denied', errdata);    //  }
                    }
                })
            }
        },
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

//    myConfirm('Confirm Players/Subs', lockmsg,
//        function(answer) {
//            if(answer) {
//                $.ajax({
//                    url: apiURL + 'locklegend',
//                    data: {
//                        action: 'Confirm Player/Subs',
//                        remid: team.data.id,
//                        drawid: Data.draw.id,
//                        teamistwla: teamistwla
//                    },
//                    success:function(data) {
//                        console.log('locklegend:SUCCESS');
//                        console.log(data);
//                        if(typeof data.error != 'undefined') {
//                            myAlert('error', data.error.text);
//                            return false;
//                        }
//                        else {
//                            team.data.legendlock = parseInt(data[team.data.id].legendlock);
//                            if(team.teamid == Teams.other.teamid) {
//                                Data.remoteother.hasaccess = parseInt(data[Data.remoteother.id].legendlock);
////                                Teams.other.data.legendlock = parseInt(data[Teams.other.data.id].legendlock);
//                            }
//                            else {
//                                Data.remote.hasaccess = parseInt(data[Data.remote.id].legendlock);
////                                Teams.my.data.legendlock = parseInt(data[Teams.my.data.id].legendlock);
//                            }
//                            Teams.getStage();
//                            // both teams locked! match is ready
//
//console.log('MyTeam-locked:    ' + Teams.my.data.legendlock);
//console.log('OtherTeam-locked: ' + Teams.other.data.legendlock);
////                    $(".enterresultsmsg").data('lock', 1);
//
//                            if(Teams.my.data.legendlock == 1 && Teams.other.data.legendlock == 1 && $(".enterresultsmsg").data('lock') == '0') {
//console.log('showNoty::2');
//                                $(".enterresultsmsg").data('lock', '1');
//                                var msg = '<p style="text-align:center">All Players Locked<p><p style="text-align:center"><b>MATCH IS READY!</b></p>';
//                                showNoty(msg, 'success', 'center', 4000);
//                            }
//                        }
//                    },
//                    error:function(errdata) {
//                        console.log('ERROR');
//                        displayErrMsg('Access Denied', errdata);    //  }
//                    }
//                })
//            }
//        }
//    );
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

        $.mobile.changePage(PAGE_ADMIN);

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

function removeEmoji(string) {
  var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  return string.replace(regex, '');
}

function initPlayerList()
{
    Players = {};
//    var teamid = Data.players.teamid;

    var presetlegend = false;

    $.each(['H','A'], function(k, hora) {

        $.each(Data.players[hora], function(id, obj) {

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

            var nm = {};
            if(isset(obj.firstname)) {
                nm = {id: obj.id, firstname: obj.firstname, lastname: udc(obj.lastname) ? "" : obj.lastname};
            }
            else {
                nm = {id: obj.id, fullname: obj.fullname};
            }

            var np = new Player(nm);

            np.id = obj.id;
            np.teamid = obj.teamid;

            np.rank = obj.rank;
            np.new = obj.new;
            np.status = parseInt((udc(obj.status) ? 1 : obj.status));
            np.type = obj.type;
            np.pos = (udc(obj.pos) ? -1 : obj.pos);
            np.legendcode = lcode;

            if(np.new === 0) {
                np.origfullname = obj.origfullname;
                np.origrank = obj.origrank;
            }

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

//function playerNameFormats(nm) {
//
//    var this = {};
//
//    if(isset(nm.firstname)) {
//        this.fullname = nm.firstname + " " + nm.lastname;
//        nparts.firstname = nm.firstname;
//        nparts.lastname = nm.lastname;
//    }
//    else {
//        var parts = nm.fullname.split(" ");
//        nparts.fullname = nm.fullname;
//        nparts.firstname = parts.shift();      // first word is the first name
//        nparts.lastname = parts.join(" ");    // all remaining words are the surname
//    }
//
//    nparts.initials = nparts.firstname[0] + nparts.lastname[0];
//    nparts.shortname = nparts.firstname[0] + "." + nparts.lastname;
//    nparts.fshortname = nparts.firstname + " " + nparts.lastname[0];
//
//    return nparts;
//}


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
    // onsole.log(gbcode, data);

    this.id = 0;
    this.blockno = data.blockno;
    this.code = data.code;
    this.gbcode = gbcode;
    this.gcode = data.gcode;
    this.hora = data.gcode[0];
    this.name = data.name;
    this.playerid = data.playerid;
    this.playercode = udc(Players[this.hora][data.playerid]) ? 0 : Players[this.hora][data.playerid].code;
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
//        this.partner = data.partner;
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
//            var gbCode = results.attributes.gbcode;           // Object { pos: 2, type: "S", playersperside: "1", maxframes: "1", isracetomax: "0" }

            $.each(results.rows, function(row, gcodes) {      // poscode = AA0, HA0 etc
//                console.log(gcodes);
//                console.log('DATA');
                $.each(gcodes, function(gcode, data) {

//                    console.log(data);

                    var teamcode = Teams.my.teamcode;

                    var gbcode = data.gbcode;

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

                            var tmpcode = udc(Legend[teamcode]) ? {} : Legend[teamcode];

                            tmpcode[lcode.pos] = {};
                            Legend[teamcode] = {};

                            lcode.playerid = data.playerid;

                            tmpcode[lcode.pos] = lcode;
                            Legend[teamcode] = tmpcode;

                            var tmpcode = udc(LegendCodes[teamcode]) ? {} : LegendCodes[teamcode];

                            tmpcode[lcode.code] = {};
                            LegendCodes[teamcode] = {};

                            tmpcode[lcode.code] = lcode;
                            LegendCodes[teamcode] = tmpcode;
                        }

                        // update player properties
                        if(isset(Players[data.playerid])) {
                            Players[data.playerid].legendcode = Legend[teamcode][lcode.pos].gbcode;
                            Players[data.playerid].code = Legend[teamcode][lcode.pos].code;
                        }
                    }

                    if(data.remotedata.sublocked == "1") {
//                        var blockno = data.remotedata.blockno;
                        if(data.remotedata.gcode.substring(0,1) == Teams.my.team) {
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

                    GBCodes[gcode] = new GBCode(data, gbcode);

                    // create groups for Multi player records so partners can be referenced
                    if(parseInt(gbcode.playersperside) > 1) {
                        var mkey = data.blockno + '-' + gbcode.grp;
                        var hora = gcode[0] == 'H' ? 'home' : 'away';
                        if(udc(Multi[mkey])) { Multi[mkey] = {}; }
                        if(udc(Multi[mkey]['seq'])) { Multi[mkey]['seq'] = {}; }
                        if(udc(Multi[mkey]['seq'][gbcode.seq])) { Multi[mkey]['seq'][gbcode.seq] = {}; }
                        Multi[mkey]['pps'] = gbcode.playersperside;
                        Multi[mkey]['seq'][gbcode.seq][hora] = GBCodes[gcode];
                    }

                    updateSpots(blockno, data.code, GBCodes[gcode]);

//                    var newdata = data;
//                    newdata.gbcode = gbCode;
                    updateMatchsheet(gcode, GBCodes[gcode]);       // update "pos" value for block

                });
            });
        })
    });

    Teams.maxplayers = Data.msheet[1].Legend.rows.length;
    Teams.minplayers = getMaxStats();

}

function updateSpots(blockno, code, data)
{
//    console.log('Update Spots: ' + blockno + '-' + code);

    var hora = data.gcode[0];

    if(udc(Spots[blockno])) {
        Spots[blockno] = {};
    }
    if(udc(Spots[blockno][hora])) {
        Spots[blockno][hora] = {};
    }
//    if(udc(Spots[blockno][hora][code])) {
//        Spots[blockno][hora][code] = {};
//    }

    // Spots - block - HorA - 'A' = HA20
    if(isset(Data.gameblocks[blockno])) {
        // populate spots if rows are populated from Legend AND is not the first block, OR rows are NOT POPULATED from Legend
        if(Data.gameblocks[blockno].prevblock > 0 && Data.gameblocks[blockno].popfromlegend === 1) {        // if no previous block, get all legend
            Spots[blockno][hora][code] = data;
        }
        else if(Data.gameblocks[blockno].popfromlegend === 0) {
            Spots[blockno][hora][code] = data;
        }
    }
    else {
        // Legend
        if(data.playercode !== 0) {
            Spots[blockno][hora][code] = data;
        }
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
                        $.mobile.changePage(PAGE_HOME);
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
            // var player = "Select Player...";

            // // need the opposition team for the pp list
            // var ppteamid = Teams.my.teamcode == teamcode ? Teams.other.teamcode : Teams.my.teamcode;

            // html += String.format('<table style="width:100%;"><tr><td style="width:50%;text-align:right;padding:10px;">Players Player: </td>' +
            //     '<td style="text-align:left;padding:10px;" data-required="{0}">', data.required);

            var mymax = parseInt(data.mymax);

            // need the opposition team for the pp list
            var ppteamid = Teams.my.teamcode == teamcode ? Teams.other.teamcode : Teams.my.teamcode;

            html += '<table style="width:100%;">';

            for (let i = mymax; i > 0; i--) {

                var player = "Select Player...";

                var plural = i == 1 ? '' : 's';

                html += String.format('<tr><td style="width:50%;text-align:right;padding:10px;">' +
                    'Player Vote ({1} point{2}) : </td><td style="text-align:left;padding:10px;" data-required="{0}">', data.required, i, plural);

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
                //     html += String.format('<div id="player_PP_{0}" data-id="{2}">{1}</div>', teamid, player, playerid);
                // }
                // else {
                //     html += String.format('<a href="#popupPlayer_PP_{0}" data-rel="popup" id="player_PP_{0}" data-id="{2}">{1}</a>', teamcode, player, playerid);
                //     html += String.format('<div data-role="popup" id="popupPlayer_PP_{0}" data-code="." class="playerpopup">', teamcode);
                //     html += String.format('<ul id="popupPlayerList_PP_{0}" data-teamid="{0}" data-role="listview" data-inset="true" style="min-width:210px;" class="playerlistview">',
                //         teamcode);
                //     $.each(Legend[ppteamid], function(k, o) {
                //         if(o.playerid > 0) {
                //             // change the color for the player who corresponds to the legend
                //             var p = Players[aorh][o.playerid];
                //             html += String.format('<li><a href="#" class="playerppsel" data-icon="false" data-id="{0}">{1}</a></li>', o.playerid, p.fullname);
                //         }
                //     });
                //     if(data.required != "1") {
                //         html += '<li><a href="#" class="playerppsel" data-icon="false" data-id="0">NONE</a></li>';
                //     }
                
                        html += String.format('<div id="div-player_PP_{0}_{3}" data-points="{3}" data-id="{2}">{1}</div>', teamid, player, playerid, i);
                    } else {
                        html += String.format('<a href="#popupPlayer_PP_{0}_{3}" class="player-vote player_PP_{0}" data-rel="popup" id="player_PP_{0}_{3}" data-points="{3}" data-id="{2}">{1}</a>', teamcode, player, playerid, i);
                        html += String.format('<div data-role="popup" id="popupPlayer_PP_{0}_{1}" data-code="." class="playerpopup">', teamcode, i);
                        html += String.format('<ul id="popupPlayerList_PP_{0}_{1}" data-teamid="{0}" data-points="{1}" data-role="listview" data-inset="true" style="min-width:210px;" class="playerlistview">',
                            teamcode, i);
                        $.each(Legend[ppteamid], function (k, o) {
                            if (o.playerid > 0) {
                                // change the color for the player who corresponds to the legend
                                var p = Players[aorh][o.playerid];
                                html += String.format('<li><a href="#" class="playerppsel" data-icon="false" data-points="{2}" data-id="{0}">{1}</a></li>', o.playerid, p.fullname, i);
                            }
                        });
                        if (data.required != "1") {
                            html += String.format('<li><a href="#" class="playerppsel" data-icon="false" data-points="{0}" data-id="0">NONE</a></li>', i);
                        }
                
                    html += '</ul>';
    
                    html += '</div>';   // popup
                }
            }
        }
        html += '</td></tr></table>';
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
    console.log('displayPlayerSelect(' + teamcode + ')');

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

    var maxstats = Teams.minplayers;
    var maxlegend = Teams.maxplayers;

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

    $("#playerinfo").attr("data-maxlegend", maxlegend);
    $("#playerinfo").attr("data-maxstats", maxstats);

    $('#playerselect-div').trigger("create");

    var heading = '<div class="row p rh pselheader" style="height:40px;font-weight:bold;">' +
        '<div class="col-xs-2 rh ac sortswitch" data-sortmode="off"><img class="sorticonheader" src="/images/sort-off.png" />Pos</div>' +
        '<div class="col-xs-5 rh">Player Name</div><div class="col-xs-1">Opt</div></div>';

    if(Data.config.hasrankings == "1") {
        heading = '<div class="row p rh pselheader" style="height:40px;font-weight:bold;">' +
            '<div class="col-xs-2 rh ac sortswitch" data-sortmode="off"><img style="float:left;margin-top:2px;" src="/images/sort-off.png" />Pos</div>' +
            '<div class="col-xs-4 rh">Player Name</div><div class="col-xs-1 ac">Rank</div><div class="col-xs-1">Opt</div></div>';
    }

    var html = getSavedLegend(teamcode);

    displayMatchsheetPreview(teamcode);

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

    if(Data.config.hasrankings === "1") {
        calcSelectedPoints(teamcode);
    }
    else {
        $("#selectinfo").hide();
    }

    var psubs = $(".row.playerselected.sub").length;

    if(psubs > 0) {
        $("#viewhassubs").removeClass("hidden");
    }
    else {
        $("#viewnosubs").removeClass("hidden");
    }

    checkPlayerSelectData('start');

    setTimeout(function() { $("#mspreviewpanel").panel("open"); }, 1000);
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
    var selcount = 0;
    var teamcode = $("#psteamname").attr("data-side");    //Teams.my.teamid;
    var hora = teamcode[0];

    var pin = $("#psteamname").attr("data-pin");    //Teams.my.teamid;

    var teamistwla = 0;
    var unselcount = 0;

    // twa will always have hasaccess = 1
    if(Teams.my.data.hasaccess == "1") {
        if(Teams.my.teamcode != teamcode) {
            teamistwla = 1;
        }
    }

    var fftsel = 0;

    $.each($(".pselect"), function(k, o)
//    $.each($(".playerselected"), function(k, o)
    {
        if(($(o).hasClass('playerselected'))) {
            var id = parseInt($(o).attr("data-id"));
            var code = $(o).attr("data-code")
            var lcode = $(o).attr("data-legendcode");
            var pname = Players[hora][id].fullname;

            msheet[lcode.substr(0,2)] = {
                playerid: id,
                fullname: pname,
                code: code,
                gbcode: lcode,
                rank: Players[hora][id].rank,
                new: Players[hora][id].new
            };

            selcount++;
            if(RESTYPE_FORFEIT.indexOf(id) > -1) {
                fftsel++;
            }
        }
        else {
            unselcount++;
        }
    });

console.log('Players selected: ' + selcount);
console.log('FORFIEITS selected: ' + fftsel);
console.log('Players not selected: ' + unselcount);

    data = {
        action: 'savePlayerSelection',
        pin: pin,
        compid: Data.compid,
        button: button,
        msheet: msheet,
        drawid: Data.draw.id,
        teamistwla: teamistwla,
        gameblocks: Data.gameblocks
//        teamid: teamid,  //Data.myteam,
//        hora: hora,
//        drawid: Data.remote.drawid,
    };

    // team only has min players, no players to be subs
    // team has unselected players, selected player count == min players required and none of the selected players are a forfeit, prompt with message
    if(unselcount > 0 && selcount == Teams.minplayers && fftsel === 0 && selcount < Teams.maxplayers) {
        var buttonText = {ok: 'OK', yes: 'Yes', cancel: 'No'};
        myConfirm("Need Subs?", "<p><b>Will you need subs for this match?</b></p>" +
            "<p>You WILL NOT be able to add more players later</p><p>If you need to add subs, click <b>Yes</b> to select them now.</p>",
            buttonText,
            function(confirmed) {
                if(!confirmed) {
                    savePlayersToDb(data, teamcode);
                }
                else {
                    CPage.param = null;
                }

            }
        );
    }
    else {
        savePlayersToDb(data, teamcode);
    }
}

function savePlayersToDb(data, teamcode)
{
    var hora = teamcode[0];

    $.ajax({
        url: apiURL + 'postlegend',
        data: data,
        success: function(retdata)
        {
            console.log(retdata);

            pageDirty = -1;

            if(isset(retdata['error'])) {
                myAlert("error", "Selection Error", retdata.error);
                return false;
            }
            else if(isset(retdata['teams'])) {
                $.each(retdata.teams, function(tid, tdata)
                {
                    pageDirty = 0;
                    pageOpenData = {};

                    if(tid == Teams.my.teamcode) {
                        Teams.my.data.legendsave = parseInt(tdata.legendsave);
                        Teams.my.data.legendlock = parseInt(tdata.legendlock);
                    }
                    else {
                        Teams.other.data.legendsave = parseInt(tdata.legendsave);
                        Teams.other.data.legendlock = parseInt(tdata.legendlock);
                    }

                });

                // reset players
                $.each(Players[hora], function(id, plyr) {
                    plyr.pos = -1;
                    plyr.legendcode = null;
                    plyr.code = '?';
                });

                // reset Legend
                $.each(Legend[teamcode], function(pos, ldata) {
                    Legend[teamcode][pos].playerid = 0;
                    GBCodes[ldata.gbcode].id = 0;
                });

                // reset Legend
//                $.each(LegendCodes[teamcode], function(code, ldata) {
//                    LegendCodes[teamcode][code].playerid = 0;
//                });

                $.each($(".row.playerselected"), function(k,o) {

                    var pos = parseInt($(o).attr("data-pos"));
                    var id = $(o).attr("data-id");
                    var lcode = $(o).attr("data-legendcode");
                    var code = $(o).attr("data-code");

console.log(lcode);
                    if(pos > -1) {

                        Players[hora][id].pos = pos;
                        Players[hora][id].legendcode = lcode;       // AA100
                        Players[hora][id].code = code;               // A or 1 etc

                        Legend[teamcode][pos].playerid = id;
//                        LegendCodes[teamcode][code].playerid = id;

                        GBCodes[lcode].id = id;
//                    }
//                    else {
//                        Players[hora][id].pos = -1;
//                        Players[hora][id].legendcode = null;       // AA100
//                        Legend[teamcode][pos].playerid = 0;
//                        LegendCodes[teamcode][code].playerid = 0;
//                        GBCodes[lcode].id = "0";
                    }
                });

                checkPlayerSelectData('start');

//            msheet[lcode.substr(0,2)] = {
//                playerid: id,
//                fullname: pname,
//                gbcode: lcode,
//                rank: Players[hora][id].rank,
//                new: Players[hora][id].new
//            };
//
//                Players[hora][id].pos = POS_COUNT;
//                Players[hora][id].legendcode = lc.gbcode;       // AA100
//                Players[hora][id].code = lc.code;               // A or 1 etc

//                Legend[mt][POS_COUNT].playerid = id;
//                LegendCodes[mt][lc.code].playerid = id;

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

    var total = parseFloat($("#selectinfo").attr("data-maxpoints"));
    var minpts = parseFloat($("#selectinfo").attr("data-minpoints"));
    var maxpos = parseInt($("#selectinfo").attr("data-maxpos"));

    var hora = teamcode[0];

    var points = 0;
    var count = 0;

    var alert = false;
    var alert2 = false;

    $.each(Legend[teamcode], function(pos, pdata) {
//    $.each(Players[hora], function(k,o) {
        if(pos < maxpos) {
            if(isset(Players[hora][pdata.playerid])) {
                var o = Players[hora][pdata.playerid];
                points = points + parseFloat(o.rank);
                count++;
            }
            alert = (points > total);
        }
        else {
            if(minpts > 0) {
                alert2 = (points < minpts);
            }
        }
//        console.log(o);
//        console.log(o.pos);
//        if(o.pos > -1 && o.pos < maxpos) {
//            points = points + parseFloat(o.rank);
//            count++;
//        }
//        alert = (points > total);
//        if(count >= maxpos && minpts > 0) {
//            alert2 = (points < minpts);
//        }
    });

    if(total === 0 && minpts === 0) {
        $("#selectinfo").hide();
    }
    else {
        console.log(msgprefix);
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
            $("#selectinfo").text(msgprefix + points).css('color', warncolor).css('font-weight','normal');
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
    var maxstats = Teams.minplayers;

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

        if(Legend.length > 0) {

            $.each(Legend[teamcode], function(id, gbcodes) {

                // check GBCodes for allocation
                var gbc = gbcodes.gbcode;               // HA0, AA0
                //
//                var code = gbcodes.code;
                var pid = gbcodes.playerid;

                if(isset(GBCodes[gbc])) {
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
//                    $("#ps_addforfeit").addClass("ui-disabled");
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
//    console.log('selPlayerBlock');
//    console.log(lsdata);
//    console.log(sel);
//    console.log(player);

    var maxstats = Teams.minplayers;

    var startsub = player.pos >= maxstats ? "sub" : "start";

    var showcode = getShowCode(Teams.my.teamcode, player.code, 1);

    var html = String.format('<div class="row pselect p{0} {3}{4}" id="player_{1}" data-id="{1}" data-pos="{6}" data-code="{5}" data-legendcode="{2}">',
        sel, player.id, player.legendcode, startsub, player.new == 0 ? '' : ' temp', player.pos === -1 ? "-" : showcode, player.pos);

    var isEdited = '';
    if(isset(lsdata[player.id]) && player.new == 0) {
        isEdited = ' *';
    }

    var hclass = ' hidden';
    if($('div.sortswitch').length > 0) {
        if($('div.sortswitch').attr('data-sortmode') == "asc") {
            hclass = '';
        }
    }

    var opts = '<a href="#" class="editplayer ui-btn-inline"><i class="zmdi zmdi-edit"></i></a>';

    if(player.new == 1) {
        opts += '<a href="#" class="deleteplayer ui-btn-inline"><i class="zmdi zmdi-delete"></i></a>';
    }
    else {
        opts += '<a href="#" class="undoplayer ui-btn-inline' + (isEdited == ' *' ? '' : ' hidden') + '"><i class="zmdi zmdi-undo"></i></a>';
    }

    html += String.format('<div class="col-xs-2 code playerselect"><img class="sorticon' + hclass + '" src="/images/sort-on.png" />' +
        '<span class="codeval">{0}</span></div>', player.pos === -1 ? "-" : showcode);

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
    $(".ui-panel-inner").css("padding", "0px");

    console.log('displayMatchsheetPreview("' + teamcode + '")');

    var hora = teamcode[0];

    var h = $(window).height() - 20;

    var html = '<div id="mspreviewdiv" style="overflow-y:auto;padding-right:3px;height:' + h + 'px;">';

    // get list of subs

    html += '<div id="previewsubs" style="color:red;font-size:0.9em">';

    html += '<table id="viewhassubs" class="hidden">' +
                '<tr><td>Available Subs are:</td></tr>';

    for(var sub = (Teams.minplayers); sub < Teams.maxplayers; sub++) {
        var pid = Legend[teamcode][sub].playerid;
        var pname = pid == 0 ? '' : Players[hora][pid].fshortname;
        var hidden = pid == 0 ? 'hidden' : '';
        html += '<tr class="' + hidden + '"><td class="ssview subs player_' + Legend[teamcode][sub].code + '" style="padding-left:20px;">' + pname + '</td></tr>';
    }
    html += '</table>';

    html += '<p id="viewnosubs" class="hidden" style="color:red;text-align:center;font-size:0.9em"><b>NO SUBS SELECTED!</b></p>';

    html += '</div>';

    html += '<div id="gameblocks" style="margin-bottom:40px;">';

    $.each(Data.msheet, function(blockno, blockdata)
    {
        $.each(blockdata, function(bkey, obj)
        {
            var blocktype = 'stats';
            if(bkey == "Legend") {
                blocktype = 'legend';
            }
            html += '<table class="preview">' +
                    '<tr class="rowpreview ' + blocktype + '">' +
                    '<th colspan="2">' + Blocks[blockno].description + '</th></tr>';

            $.each(obj.rows, function(idx, match) {
                var ptype = "playerselected start";
                var emptyname = '';
                if(bkey == "Legend") {
                    if(idx >= Teams.minplayers) {
                        ptype = "playerselected sub";
                        emptyname = "SUB?";
                    }
                }
                $.each(match, function(code, player) {
                    var gcode = GBCodes[code];
                    if(gcode.hora == hora) {
//                            var pname = udc(Players[hora][gcode.id]) ? '' : Players[hora][gcode.id].fullname;
                        var pid = isset(LegendCodes[teamcode][gcode.code]) ? LegendCodes[teamcode][gcode.code].playerid : 0;
                        var pname = udc(Players[hora][pid]) ? emptyname : Players[hora][pid].fshortname;
                        ptype = udc(Players[hora][pid]) ? '' : ptype;
                        html += '<tr class="viewrow ' + ptype + '">' +
                            '<td class="' + blocktype + ' preview code">' + getShowCode(teamcode, gcode.code, blockno) + (gcode.break=="B" ? "*" : NBSP) + '</td>' +
                            '<td class="' + blocktype + ' preview player player_' + gcode.code + '">' + pname + '</td></tr>'
                    }
                });
            });
            html += '</table>';
        });
    });
    html += '</div>';       // id="gameblocks"
    html += '</div>';       // id="mspreviewdiv"

    $("#previewpanelcontent").empty();
    $("#previewpanelcontent").append(html);
}

function matchHasPoints() {
    if( typeof Data.config.hasmatchpoints == "undefined" ) {
        return false;
    }
    return Data.config.hasmatchpoints == "1";
}

function matchHasRankings() {
    if( typeof Data.config.hasrankings == "undefined" ) {
        return false;
    }
    return Data.config.hasrankings == "1";
}

function displayEnterResults(lsview)
{
    console.log('CPage.param: ' + (CPage.param === null ? 'null' : CPage.param));

console.log(LastUpdate);

    LastUpdate.intervalCount = 0;

    clearInterval(lockcheckinterval);
    lockcheckinterval = 0;

    clearInterval(finalisecheckinterval);
    finalisecheckinterval = 0;

//    var lsview = CPage.param == 'readOnly';

    if(lsview) {
        $(".resultsheader").removeClass('showscore').addClass('viewscore');
    }

    // params = {'ltype': LOGIN_TOKEN, 'drawid': 0}; or {'ltype': LOGIN_VIEWONLY, 'drawid': n};
    var ltype = CPage.ltype;

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

    if(isMemberApp()) {
        mydata.publickey = Site.memberkey;      // required for 3rd party lsview installs accessing poolstat
    }

console.log(mydata);

    getMatchNEW(mydata,

        function(data) {

            Data = data;

    console.log('Data received');

    console.log(data);

//            if(LastUpdate.lastTimestamp > -1) {
//                LastUpdate.lastTimestamp = Data.lastresultupdate;
//            }

            LastUpdate.lastRefresh = parseInt($.now() / 1000);

            // get the last timestamp of when data was updated
            LastUpdate.lastTimestamp = Data.lastresultupdate;

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
//                console.log('Data.config.lockgameblocks = 1 ' + (Data.config.lockgameblocks === "1" ? '(true)' : '(false)'));

                var unplayedmatches = 0;

                var htmladj = '';

                // comp has frame adjustments
                if(Data.config.frameadj == "1") {

                    htmladj = '<div id="matchfadg" class="matchset">';
                    htmladj += '<div class="fadgblock">';

                    let fadjtitle = Data.config.frameadjlabel;

                    let homeval = Teams.home.data.homeframescoreadj;
                    let awayval = Teams.away.data.awayframescoreadj;

                    if( matchHasPoints() ) {
                        homeval = Teams.home.data.homeframepointsadj;
                        awayval = Teams.away.data.awayframepointsadj;
                    }

                    let hdata = Teams.home.data;
                    let adata = Teams.away.data;

                    // prep fields for data entry
                    let hspin = String.format('<div class="home" style="display:inline-block;">' +
                            '<div class="spinner spinkey spinminus" data-rmid="{1}">-</div>' +
                            '<div id="spinvalue_{1}" class="spinner spinvalue home" data-drawid="{2}">{0}</div>' +
                            '<div class="spinner spinkey spinplus" data-rmid="{1}">+</div></div>', homeval, hdata.id, hdata.drawid);

                    let aspin = String.format('<div class="away" style="display:inline-block;">' +
                            '<div class="spinner spinkey spinminus" data-rmid="{1}">-</div>' +
                            '<div id="spinvalue_{1}" class="spinner spinvalue away" data-drawid="{2}">{0}</div>' +
                            '<div class="spinner spinkey spinplus" data-rmid="{1}">+</div></div>', awayval, adata.id, adata.drawid);

                    // if form is view only
                    if(Teams.my.data.hasaccess !== "1" || Teams.my.data.remotestatusid == "3" || Teams.other.data.remotestatusid == "3" || ltype == LOGIN_VIEWONLY) {
                        hspin = String.format('<div class="home" style="display:inline-block;">' +
                            '<div id="spinvalue_{1}" class="spinner spinview home" data-drawid="{2}">{0}</div></div>', homeval, hdata.id, hdata.drawid);

                        aspin = String.format('<div class="away" style="display:inline-block;">' +
                            '<div id="spinvalue_{1}" class="spinner spinview away" data-drawid="{2}">{0}</div></div>', awayval, adata.id, adata.drawid);
                    }

                    htmladj += String.format('<div id="{0}" class="row statsedit frameadj" style="padding:10px;">', 'frameadj');
                    htmladj += String.format('<div id="fadj_home" class="fadjhome">{0}</div>', hspin);
                    htmladj += String.format('<div id="fadj_away" class="fadjaway">{0}</div>', aspin);
                    htmladj += String.format('<div id="{0}" class=""></div>','frameadj-calc');

//                        htmladj += '</div>';       // row

                    htmladj += '</div>';       // fadgblock
                    htmladj += '</div>';       // .matchfadg

                    htmladj += '</div>';       // collapsible

                    let header = '<div id="collapse_fadg" class="resultlist" data-role="collapsible" data-collapsed="false">';

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
                                if(Data.config.block1autolock === "1" && Data.gameblocks[blockno].isfirstblock === true) {        //  && Data.config.lockgameblocks === "1" <-- DEPRECATED
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

                    var items;

                    // enumerate the matches within each block
                    $.each(blocks, function(pos, match) {
// console.log(match);
                        var fkey = Object.keys(match)[0];

                        var player1 = match[fkey].gbcode.seq === 1;
                        var lastplayer = match[fkey].gbcode.seq >= match[fkey].gbcode.playersperside;
                        var grp = match[fkey].gbcode.grp;

                        if(player1 === true) {
                            html += '<div class="span12 matches bgwhite block' + blockno + '">\n<!-- START OF GROUP ' + grp + ' -->';
                        }

                        var myMatch = {};
                        $.each(match, function(gcode, data) {
                            var hora = gcode.substr(0,1);
                            if(hora == "H") {
                                myMatch['home'] = data;
                                myMatch['home']['gcode'] = gcode;
                                myMatch['home']['gbcode'] = data.gbcode;
                                if(data.remotedata.resultcode === "X") {
                                    unplayedmatches++;
                                }
                            }
                            else {
                                myMatch['away'] = data;
                                myMatch['away']['gcode'] = gcode;
                                myMatch['away']['gbcode'] = data.gbcode;
                            }
                        });

                        var params = {
                            block: blockno,
                            pos: pos,
                            myMatch: myMatch,
                            showresult: player1
                        };

                        if(heading.label === "Legend") {
                            items = getLegendItemView(params);
                        }
                        else {
                            items = getStatsItemView(params);
                        }

                        html += items;

                        if(lastplayer === true) {
                            html += '<!-- END OF GROUP ' + grp + ' -->\n</div>';       // matches
                        }
                    });
                    html += '</div>';       // matchblock

                    html += '</div>';       // matches

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
                        collid, disabled == "1" ? 'hidden disableblock' : '', collapse, disabled, heading.description, blockno, maxpoints );

                    $('#resultset').append(header + html);
                });

                $('.resultlist').collapsible().trigger('create');

                $("#enterresultsintromsg").hide();

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

            if(CPage.page === PAGE_RESULTS) {
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

            if( $(".row.frameadj").length > 0 && matchHasPoints() ) {
                $(".row.frameadj .spinkey").hide();
                $(".row.frameadj .spinvalue").addClass('matchpoints');
            }

console.log(LastUpdate);

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
    let myMatch = params.myMatch[hora];
    let hacode = hora === 'home' ? 'H' : 'A';

    this.gbcode = myMatch.gbcode;
    this.showresult = params.showresult;

// console.log(params);

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
    this.framepoints = matchHasPoints() ? parseInt(this.match.remotedata.framepoints) : -1;

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
        else if( this.framepoints > -1 ) {
            this.result = this.match.remotedata.resultcode == "X" ? "?" : this.framepoints;
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
    this.brk = this.showcode;
    this.hasbrk = myMatch.break;
    
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
        this.prank = matchHasRankings() ? plyr.rank : -1;
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

    this.codedisabled = islegend && this.pshortname === '' ? 'codedisabled' : '';

    this.showlink = function() {

        var block = parseInt(params.block);

        this.gblock = Data.gameblocks[block];
        this.subcount = Teams[hora].subcount;

        var show = false;

        // check 1: all block codes are legend codes
        if(this.gblock[hora].popfromlegend > 0) {
            if(this.gblock[hora].codes.length === this.gblock[hora].legendcount) {
                // check 3: no results entered
                if(this.result === "?" || (this.result === "0" && this.match.remotedata.resultcode === "X")) {
                    show = true;
                }
            }
            else {
                show = true;
            }
        }
        else {
            if(this.result === "?" || (this.result === "0" && this.match.remotedata.resultcode === "X")) {
                show = true;
            }
        }

        if(show) {
            // do we disable subbing in the first block?
            if(Data.config.block1autolock === "1") {
//                if(this.gblock.prevblock === 0) {
                if(this.gblock.isfirstblock == true) {
                    show = this.gblock[hora].legendcount === 0;
// console.log('isfirstblock(' + block + ') = ' + (show ? 'true' : 'false'));
                }
//                }
            }

//            if(show) {
//                // do we disable subbing once results are published in this block?
//                if(Data.config.disablesubonfirstresult === "1") {
//                    show = Totals[block].H + Totals[block].A === 0;
//                }
//            }
        }

        return show;
    }

    var data = {}

    var obj = this.match;

    data.ppos = this.showresult ? 1 : 2;
    data.type = obj.gbcode.type;
    data.pperside = myMatch.gbcode.playersperside;
    data.grp = myMatch.gbcode.grp;
    data.seq = myMatch.gbcode.seq;

    data.player = {
        id: obj.playerid,
        gbcode: obj.remotedata.gbcode,
        rmsid: obj.remotedata.id
    };

//    if(data.type === 'D') {
//        var pobj = GBCodes[obj.partner];
//        data.partner = {
//            id: pobj.playerid,
//            gbcode: pobj.remotedata.gbcode,
//            rmsid: pobj.remotedata.id
//        };
//    };

    this.json = data;
}

function getLegendItemView(params)
{

    let blockno = params.block;
    let pos = params.pos;

    let MTH = new MatchTeam(params, 'home', true);
    let MTA = new MatchTeam(params, 'away', true);

    let html = '';
    let rowid = 'row-' + blockno + '-' + pos;
    let norank = '';

// HOME TEAM COLUMNS

    // start row 1
    html += String.format('<div id="{0}" class="row legedit" data-blockno="{1}" data-pos="{2}">', rowid, blockno, pos);

    // home code: data-id = compteamperson-id, data-recid = remotematch-id
    html += String.format('<div id="code_{0}" class="{0} ms home code{1} {5}" data-id="{2}" data-recid="{3}" data-gcode="{0}" data-code="{6}">{4}</div>',
        MTH.match.gcode, MTH.res, MTH.pid, MTH.match.remotedata.id, MTH.brk, MTH.codedisabled, MTH.code);    // ,  encodeURI(JSON.stringify(MTH.json()))
//        MTH.match.gcode, MTH.res, MTH.pid, MTH.match.remotedata.id, MTH.brk, MTH.codedisabled, MTH.code, );    // ,  encodeURI(JSON.stringify(MTH.json()))

    let clrdisabled = '';

    // rank (if applicable)
//    if(MTH.prank > -1) {
    if( matchHasRankings() ) {
        let hrank = MTH.pid == 0 ? '' : MTH.prank;
        clrdisabled = hrank == '' ? ' clrdisabled' : '';
        html += String.format('<div id="rank_{0}" class="{0} ms home rank{1}">{2}</div>', MTH.match.gcode, MTH.res, hrank, clrdisabled);
    }
    else {
        norank = 'nr';
    }

    // home player
    html += String.format('<div id="pname_{0}" class="{0} ms home pname{4}{1}">' +
        '<div id="psub_{0}" class="playersub"><span class="initials hidden {0}">{5}</span>' +
        (getPlayerAbbrev() == "0"
            ? '<span class="shortname {0}">{2}</span><span class="fshortname hidden {0}">{6}</span>'
            : '<span class="shortname hidden {0}">{2}</span><span class="fshortname {0}">{6}</span>') +
        '<span class="fullname {0}">{3}</span></div></div>', MTH.match.gcode, MTH.res, MTH.pshortname, MTH.pfullname, norank, MTH.pinitials, MTH.pfshortname);

    // home summary
    html += String.format('<div id="psum_{2}" class="{2} ms home summary score{0}">{1}</div>', MTH.res, NBSP, MTH.match.gcode);

// AWAY TEAM COLUMNS (REVERSED)

    // away summary
    html += String.format('<div id="psum_{2}" class="{2} ms away summary score{0}">{1}</div>', MTA.res, NBSP, MTA.match.gcode);

    // away player
    html += String.format('<div id="pname_{0}" class="{0} ms away pname{4}{1}">' +
        '<div id="psub_{0}" class="playersub"><span class="initials hidden {0}">{5}</span>' +
        (getPlayerAbbrev() == "0"
            ? '<span class="shortname {0}">{2}</span><span class="fshortname hidden {0}">{6}</span>'
            : '<span class="shortname hidden {0}">{2}</span><span class="fshortname {0}">{6}</span>') +
        '<span class="fullname {0}">{3}</span></div></div>', MTA.match.gcode, MTA.res, MTA.pshortname, MTA.pfullname, norank, MTA.pinitials, MTA.pfshortname);

    // rank (if applicable)
//    if(MTA.prank > -1) {
    if( matchHasRankings() ) {
        let arank = MTA.pid == 0 ? '' : MTA.prank;
        clrdisabled = arank == '' ? ' clrdisabled' : '';
        html += String.format('<div id="rank_{0}" class="{0} ms away rank{1}">{2}</div>', MTA.match.gcode, MTA.res, arank, clrdisabled);
    }

    // away code: data-id = compteamperson-id, data-recid = remotematch-id
    html += String.format('<div id="code_{0}" class="{0} ms away code{1} {5}" data-id="{2}" data-recid="{3}" data-gcode="{0}" data-code="{6}">{4}</div>',
        MTA.match.gcode, MTA.res, MTA.pid, MTA.match.remotedata.id, MTA.brk, MTA.codedisabled, MTA.code);

    // end row 1
    html += '</div>';   // row

// ADD ADDITIONAL INFO BOX

    if( matchHasPoints() )
    {
        let inputid = 'legend-info-' + blockno + '-' + pos;

        // start row 2
        html += String.format('<div id="{0}" class="legend-parent hidden" data-blockno="{1}" data-grp="{3}" data-pos="{2}" data-delay="0">'
            , inputid, blockno, pos, MTH.gbcode.grp);

        // score panel
        html += '<div class="legend-container-home">no info</div>';
        html += '<div class="legend-container-away">no info</div>';

        // end row 2
        html += '</div>';   // row
    }

    return html;
}

function getStatsItemView(params)
{
    var blockno = params.block;
    var pos = params.pos;

    var MTH = new MatchTeam(params, 'home', false);
    var MTA = new MatchTeam(params, 'away', false);

//console.log(MTH);

    var hshowlink = MTH.showlink();
    var ashowlink = MTA.showlink();

    var hres = MTH.res;
    var ares = MTA.res;

    let hbrk = MTH.hasbrk, abrk = MTA.hasbrk, brktoggle = false;

    if (Data.remote.hora == "H") {
        // check if home break first is default
        if (Data.remote.firstbreak == 'D') {
            // if home is default, set toggle based on away firstbreak = Y
            brktoggle = Data.remoteother.firstbreak == 'Y';
        }
        // home break is not default. toggle if firstbreak = Y
        else if (Data.remote.firstbreak == 'Y') {
            brktoggle = true;
        }
    } else {
        if (Data.remote.firstbreak == 'D') {
            brktoggle = Data.remoteother.firstbreak == 'Y';
        } else if (Data.remote.firstbreak == 'Y') {
            brktoggle = true;
        }
    }

    if (brktoggle) {
        hbrk = MTH.hasbrk == 'B' ? '' : 'B';
        abrk = MTA.hasbrk == 'B' ? '' : 'B';
    }
    
// always need to show player links to enable FORFEIT and ABANDONED to be used
//    var hshowlink = true;
//    var ashowlink = true;
//console.log(params);

    var ignore = '';
    if(!params.showresult) {
////console.log(MatchTeams[blockno][MTH.match.partner]);
////console.log(MatchTeams[blockno][MTA.match.partner]);
//console.log(params);
        var mkey = blockno + '-' + MTH.gbcode.grp;
        var hcode = Multi[mkey]['seq']['1']['home'].gcode;
        var acode = Multi[mkey]['seq']['1']['away'].gcode;

        hshowlink = MatchTeams[blockno][hcode].showlink();
        ashowlink = MatchTeams[blockno][acode].showlink();

        hres = MatchTeams[blockno][hcode].res;
        ares = MatchTeams[blockno][acode].res;

        ignore = ' ignore';
    }

    var html = '';
    var rowid = 'row-' + blockno + '-' + pos;
    var norank = '';

// HOME TEAM COLUMNS

    var inprogress = MTH.match.remotedata.resultstatus == "2" ? " playingnow" : "";
    var grpseq = MTH.gbcode.grp + '-' + MTH.gbcode.seq;

    // start row 1
    html += String.format('<div id="{0}" class="row statsedit{3} bgs-{4}" data-blockno="{1}" data-pos="{2}">', rowid, blockno, pos, inprogress, grpseq);

    // home code: data-id = compteamperson-id, data-recid = remotematch-id
    // html += String.format('<div id="code_{0}" class="{0} ms home code{1}" data-id="{2}" data-recid="{3}" data-gcode="{0}" data-code="{5}">{4}</div>',
    //     MTH.match.gcode, hres, MTH.pid, MTH.match.remotedata.id, MTH.brk, MTH.code);    // ,  encodeURI(JSON.stringify(MTH.json()))
    html += String.format('<div id="code_{0}" class="{0} ms home code{1}" data-id="{2}" data-recid="{3}" data-gcode="{0}" data-code="{5}">{4}{6}</div>',
        MTH.match.gcode, hres, MTH.pid, MTH.match.remotedata.id, MTH.brk, MTH.code, (hbrk=='B' ? '<span class="has-break"></span>' : ''));    // ,  encodeURI(JSON.stringify(MTH.json()))

    // rank (if applicable)
//    if(MTH.prank > -1) {
    if( matchHasRankings() ) {
        var rank = MTH.plyr === null ? '-' : (MTH.plyr.type > 1 ? '-' : MTH.prank);
        html += String.format('<div id="rank_{0}" class="{0} ms home rank{1}">{2}</div>', MTH.match.gcode, hres, rank);
    }
    else {
        norank = 'nr';
//        html += '<div " style="width:10px;"></div>';
    }

    var mformat = (MTH.ismultiframe ? 'mf' : 'sf');

    // home player
//    if(hshowlink) {
        html += String.format('<div id="pname_{0}" class="{0} ms home pname{7}{1}">' +
            '<div class="snocode home {6}">{5}</div>' +
            '<div id="psub_{0}" class="playersub ' + (hshowlink ? 'showlink' : '') + ' {4}">' +
                '<span class="initials hidden {0}">{8}</span>' +
                (getPlayerAbbrev() == "0"
                    ? '<span class="shortname {0}">{2}</span><span class="fshortname hidden {0}">{9}</span>'
                    : '<span class="shortname hidden {0}">{2}</span><span class="fshortname {0}">{9}</span>') +
                '<span class="fullname hidden {0}">{3}</span>' +
            '</div></div>', MTH.match.gcode, hres, MTH.pshortname, MTH.pfullname, MTH.orig, MTH.pshowcode, MTH.hidecode, norank, MTH.pinitials, MTH.pfshortname);
//    }
//    else {
//        html += String.format('<div id="pname_{0}" class="{0} ms home pname{7}{1}">' +
//            '<div class="snocode home {6}">{5}</div>' +
//            '<div id="psub_{0}" class="playersub {4}">' +
//                '<span class="initials hidden {0}">{8}</span><span class="shortname {0}">{2}</span><span class="fshortname hidden {0}">{9}</span>' +
//                '<span class="fullname hidden {0}">{3}</span>' +
//            '</div></div>', MTH.match.gcode, hres, MTH.pshortname, MTH.pfullname, MTH.orig, MTH.pshowcode, MTH.hidecode, norank, MTH.pinitials, MTH.pfshortname);
//    }

    // home score
    html += String.format('<div id="result_{2}" class="{2} ms home active result score{0}{3} {4}">{1}</div>', hres, MTH.result, MTH.match.gcode, ignore, mformat);

// AWAY TEAM COLUMNS (REVERSED)

    // away score
    html += String.format('<div id="result_{2}" class="{2} ms away active result score{0}{3} {4}">{1}</div>', ares, MTA.result, MTA.match.gcode, ignore, mformat);

    // away player
//    if(ashowlink) {
//         html += String.format('<div id="pname_{0}" class="{0} ms away pname{1}">' +
//            '<div id="psub_{0}" class="playersub showlink {4}"><span class="shortname {0}">{2}</span>' +
//            '<span class="fullname {0}">{3}</span></div></div>', MTA.match.gcode, ares, MTA.ShortName(), MTA.FullName(), MTA.OrigPlayer());

        html += String.format('<div id="pname_{0}" class="{0} ms away pname{7}{1}">' +
            '<div class="snocode away {6}">{5}</div>' +
            '<div id="psub_{0}" class="playersub ' + (ashowlink ? 'showlink' : '') + ' {4}">' +
                '<span class="initials hidden {0}">{8}</span>' +
                (getPlayerAbbrev() == "0"
                    ? '<span class="shortname {0}">{2}</span><span class="fshortname hidden {0}">{9}</span>'
                    : '<span class="shortname hidden {0}">{2}</span><span class="fshortname {0}">{9}</span>') +
                '<span class="fullname hidden {0}">{3}</span>' +
            '</div>' +
            '</div>', MTA.match.gcode, ares, MTA.pshortname, MTA.pfullname, MTA.orig, MTA.pshowcode, MTA.hidecode, norank, MTA.pinitials, MTA.pfshortname);
//    }
//    else {
////        html += String.format('<div id="pname_{0}" class="{0} ms away pname{1}">' +
////            '<div id="psub_{0}" class="playersub {4}"><span class="shortname {0}">{2}</span>' +
////            '<span class="fullname {0}">{3}</span></div></div>', MTA.match.gcode, ares, MTA.ShortName(), MTA.FullName(), MTA.OrigPlayer());
//
//        html += String.format('<div id="pname_{0}" class="{0} ms away pname{7}{1}">' +
//            '<div class="snocode away {6}">{5}</div>' +
//            '<div id="psub_{0}" class="playersub {4}">' +
//                '<span class="initials hidden {0}">{8}</span><span class="shortname {0}">{2}</span><span class="fshortname hidden {0}">{9}</span>' +
//                '<span class="fullname hidden {0}">{3}</span>' +
//            '</div>' +
//            '</div>', MTA.match.gcode, ares, MTA.pshortname, MTA.pfullname, MTA.orig, MTA.pshowcode, MTA.hidecode, norank, MTH.pinitials, MTH.pfshortname);
//    }

    // rank (if applicable)
//    if(MTA.prank > -1) {
    if( matchHasRankings() ) {
        var rank = MTA.plyr === null ? '-' : (MTA.plyr.type > 1 ? '-' : MTA.prank);
        html += String.format('<div id="rank_{0}" class="{0} ms away rank{1}">{2}</div>', MTA.match.gcode, ares, rank);
    }
    else {
//        html += '<div " style="width:10px;"></div>';
    }

    // away code: data-id = compteamperson-id, data-recid = remotematch-id
    // html += String.format('<div id="code_{0}" class="{0} ms away code{1}" data-id="{2}" data-recid="{3}" data-gcode="{0}" data-code="{5}">{4}</div>',
    //     MTA.match.gcode, ares, MTA.pid, MTA.match.remotedata.id, MTA.brk, MTA.code);
    html += String.format('<div id="code_{0}" class="{0} ms away code{1}" data-id="{2}" data-recid="{3}" data-gcode="{0}" data-code="{5}">{4}{6}</div>',
        MTA.match.gcode, ares, MTA.pid, MTA.match.remotedata.id, MTA.brk, MTA.code, (abrk=='B' ? '<span class="has-break"></span>' : ''));

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
        html += String.format('<div id="{0}" class="scoreparent" data-blockno="{1}" data-grp="{4}" data-pos="{2}" data-delay="0" data-mformat="{3}" style="display:none;">'
            , inputid, blockno, pos, mformat, MTH.gbcode.grp);

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
console.log('curpid: ' + curpid);

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
            // if block always starts with incumbent players, unless block starts with no players
            // sub list will show only players that do not currently appear in this block

            var excl = {};
            console.log('curcode=' + gbc.code);

            $.each(Spots[blockno][hora], function(origcode, gbdata) {

                var selcode = gbdata.playercode;
                if(Data.gameblocks[blockno].popfromlegend === 1) {
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
                        console.log('ex3=' + origcode);
                        excl[origcode] = gbdata.id;                // incumbent players cannot be subbed in
                    }
                }
                else {
                    console.log('ex4=' + selcode);

                    if(gbdata.playerid > 0) {
                        console.log('ex5=' + selcode);
                        excl[selcode] = gbdata.id;
                    }
                }
            });

            // get players from legend
            console.log(excl);
            SubList = {};
            $.each(Spots[1][hora], function(lc, sb) {
                if(udc(excl[lc])) {
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
            let rankalert = '';
            let desc = '';

            var rank = -1;
            var newrank = -1;

            var currTot = 0;
            var newTot = 0;

            if(Data.config.hasrankings === '1') {
                if(isset(PlyrList[curpid])) {
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
        (getPlayerAbbrev() == "0"
            ? '<span class="shortname {0}">{1}</span><span class="fshortname hidden {0}">{4}</span>'
            : '<span class="shortname hidden {0}">{1}</span><span class="fshortname {0}">{4}</span>') +
//        '<span class="shortname">{1}</span>' +
//        '<span class="fshortname hidden">{4}</span>' +
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
    let maxframes = parseInt(GBCodes[hcode].gbcode.maxframes);
    let racetomax = parseInt(GBCodes[hcode].gbcode.isracetomax);

    let multiframe = maxframes > 1;

    let frames = 'UNKNOWN';

    let lsview = CPage.param === 'readOnly';

    let max;

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
                $(".finalisenow").text("Scores tied, Play Tiebreaker");
                $("div.resultlist.disableblock").removeClass("hidden");
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

    var gcode = $(obj).attr("data-gcode");
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

    let homeadj = 0;
    let awayadj = 0;

    if(Data.config.frameadj == "1") {
        homeadj = parseInt(Teams.home.data.homeframescoreadj);
        awayadj = parseInt(Teams.away.data.awayframescoreadj);
        if( matchHasPoints() ) {
            homeadj = parseFloat(Teams.home.data.homeframepointsadj);
            awayadj = parseFloat(Teams.away.data.awayframepointsadj);
        }
    }

    var hscore = +(Totals[0].H + homeadj).toFixed(2);
    var ascore = +(Totals[0].A + awayadj).toFixed(2);

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

        let fadjtot = (team.team == 'H' ? team.data.homeframescoreadj : team.data.awayframescoreadj);

        if( matchHasPoints() ) {
            fadjtot = (team.team == 'H' ? team.data.homeframepointsadj : team.data.awayframepointsadj);
        }

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
            Players[hora][k].pointsfor = 0;
            Players[hora][k].pointsagainst = 0;
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

    let odata, opid, d, od, hora, aorh, oppgcode, block, disabled, rstatus, winval, pid, rescode;

    $.each(GBCodes, function(gcode, data) {

        oppgcode = data.opponent;

        d = data.remotedata;

        hora = gcode[0];
        aorh = hora == 'H' ? 'A' : 'H';

        if(d.gbtype !== "L") {        // not a legend row

            odata = GBCodes[oppgcode];

            block = parseInt(d.blockno);

            disabled = false;
            if(typeof Blocks[block] !== 'undefined') {
                disabled = Blocks[block].disabled;
            }

            if(Totals[block] === undefined) {
                Totals[block] = new SubTotal();
            }

            rstatus = parseInt(d.resultstatus);

            winval = 1;

            if(d.gbtype === 'D') {
                winval = 0.5;
            }

            // only count frames for totals where seq == 1
            if(data.gbcode.seq == 1)
            {
                if(rstatus === RMS_COMPLETED) {
                    if( matchHasPoints() ) {
                        Totals[block][data.hora] += parseFloat(d.framepoints);
                        Totals[0][data.hora] += parseFloat(d.framepoints);
                    }
                    else {
                        if (d.resultcode !== "L") {
                            Totals[block][data.hora] += winval;
                            Totals[0][data.hora] += winval;
                        }
                    }
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
            }

            // update player totals

            if(data.playerid > 0)
            {
                pid = data.playerid;
                od = odata.remotedata;

                rescode = d.resultcode;

                if(rstatus === RMS_COMPLETED) {

                    Players[hora][pid].framesplayed++;

                    Players[hora][pid].pointsfor += parseInt(d.framepoints);
                    Players[hora][pid].pointsagainst += parseInt(od.framepoints);

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

    let result = 0;
    let pdiff, pdcolor, pdind;
    $.each(['H','A'], function(o, hora) {
        $.each(Players[hora], function(k, o) {
            $("#psum_" + o.legendcode).text('');
            var row = $("#psum_" + o.legendcode).parent();
            var extra = '#legend-info-' + $(row).attr('data-blockno') + '-' + $(row).attr('data-pos');
            if( matchHasPoints() ) {
                pdiff = o.pointsfor - o.pointsagainst;
                pdcolor = pdiff === 0 ? 'black' : (pdiff > 0 ? 'green' : 'red')
                pdind = pdiff > 0 ? '+' : '';
                if(o.framesplayed > 0) {
                    result = '&nbsp;' + o.framesplayed + "-" + o.frameswon + '&nbsp;';
//                    result = '&nbsp;' + o.pointsfor + "(" + o.framesplayed + "-" + o.frameswon + ")" + o.pointsagainst + '&nbsp;';
                    var resultadv = '<div class="nowrap">PTS-F: ' + o.pointsfor + '</div><div class="nowrap">PTS-A: ' +
                        + o.pointsagainst + '</div><div class="nowrap">NETT: <span style="color:' + pdcolor + '">' +
                        pdind + pdiff + '</span></div>';
                    $("#psum_" + o.legendcode).html(result);
                    $(extra + " .legend-container-" + (hora=='H'?'home':'away')).html(resultadv);
                }
            }
            else {
                if(o.framesplayed > 0) {
                    result = '&nbsp;' + o.framesplayed + "-" + o.frameswon + '&nbsp;';
                    $("#psum_" + o.legendcode).html(result);
                }
            }
        });
    });

    var myteam = Teams.my.team;
    var othteam = Teams.other.team;

    var alert = '';
    var minalert = '';

    $('.ms.rank').removeClass('limitexceed');

    let cls, hspan, aspan, hrankmax, arankmax, hrankmin, arankmin;

    $.each(MatchSheet, function(k, o) {
        cls = "block" + k;
        if(k > 1 && $(".msscore." + cls).length > 0) {

            hspan = '<span class=';
            aspan = '<span class=';

            // if > 0 then rank is under max value - throw ALERT when < 0
            hrankmax = RankTotals[k].max - RankTotals[k].H;
            arankmax = RankTotals[k].max - RankTotals[k].A;

            // if < 0 then rank is over min value - throw ALERT when > 0
            hrankmin = RankTotals[k].min == 0 ? 0 : RankTotals[k].min - RankTotals[k].H;
            arankmin = RankTotals[k].min == 0 ? 0 : RankTotals[k].min - RankTotals[k].A;

            // if match is for points and min/max not set
            if( matchHasPoints() && (RankTotals[k].H + RankTotals[k].A) != 0 ) {
                hrankmax = '<span style="color:black;font-size:0.8em;">(' + RankTotals[k].H + ')</span>';
                arankmax = '<span style="color:black;font-size:0.8em;">(' + RankTotals[k].A + ')</span>';
            }

            if(RankTotals[k].max === 0 && RankTotals[k].min === 0 ) {

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

                if( matchHasPoints() ) {
                    $(".msscore.block" + k).html( String.format('{0} {1} - {2} {3}', hrankmax, Totals[k].H, Totals[k].A, arankmax) );
                }
                else {
                    $(".msscore.block" + k).html(Totals[k].H + " - " + Totals[k].A);
                }

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
    };

    if(isMemberApp()) {
        mydata.publickey = Site.memberkey;      // required for 3rd party lsview installs accessing poolstat
    }

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

            // check if valid token exists, if it does the livescoring landing page will load
            if(checkForToken(data)) {
                initMatchTableView(data, compid);
            }

            if(mode == 'none') {
                if(modeval !== null) {
                    $("#matchdate").attr("data-seldate", modeval);
                }
            }

            setFooter("dxfootertext");

            let teampin = localStorage.getItem('teampin');
            if( teampin !== null ) {
                console.log("PIN found in URL", teampin);
                localStorage.removeItem("teampin");
                populateHomePage('pin', teampin);
            }
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
        console.log(data);

//                console.log(data.token[LSTR_JWTTOKEN]);
        if(udc(data.token)) {
            console.log('---> NO TOKEN("undefined")');
        }
        else if(data.token === null) {
            console.log('---> NO TOKEN(null)');
            data.token = [];
        }

        $("#loadingapp").hide();

        if(isset(data.token)) {

            console.log(data.token);

            if(data.token.tokenstatus == 1)
            {
                // if the user has come from the live app via the back button, stay on the index page
                if(localStorage.getItem("loadsource") == 'livebackbutton') {
                    return true;
                }

                if(CPage.page == PAGE_RESULTS) {
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

}

class Calculator
{
    constructor(scr) {
        $(scr).addClass("calc-screen");
        let btns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.', 'C'], cls;
        this.html = '<div id="calc-container"><ul id="keyboard">';
        for (let i = 0; i < btns.length; i++) {
            cls = '';
            if (btns[i] == 'C') {
                cls = ' colred';
            }
            this.html += '<li class="letter' + cls + '">' + btns[i] + '</li>';
        }
        this.html += '</ul><div class="calc-buttons"><div class="calc-btn cancel">Cancel</div><div class="calc-btn save">Save</div></div></div>';
    }

}

function initMatchTableView(data, compid)
{
    console.log('===> initMatchTableView <===');

console.log(data);

    var needsRefresh = true;

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
    datesel += String.format('<h3 id="matchdate" data-seldate="{0}" class="matchdateselect">{1}<span id="matchcarat" class="matchcaratd"></span><span class="info-dates"><img src="/images/info.svg"></span></h3>' +
        '</td></tr><tr id="dateoptions" style="display:none;"><td><div id="datelist" class="datelist"><ul class="dateoptlist">',
        today, (sqldate == today ? "TODAY'S MATCHES" : "MATCHES: " + adate));

        // build list of dates
        datesel += '<li class="dateopt" data-date="today">TODAY\'S MATCHES</li>';
        for(var i = 1; i < 49; i++)
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

        let html = '', hscore = 0, ascore = 0;

        var collapsed = "true";

        var compcount = 0;

        var hideorglist = [0];

        let favs = localStorage.getItem("ls.favs");
        let myfavs = null, favclass;
        if( favs !== null) {
            myfavs = favs.split(',fav');
            console.log(myfavs)
        }

        $.each(data.comps, function(cid, comp)
        {
            if(compid > 0) {
//                collapsed = "false";
//            }
//            else {
                if(compid == cid) {
                    collapsed = "false";
                }
                else {
                    collapsed = "true";
                }
            }

// AEBF
    // check org
    console.log("check MEMBER = " + Site.AppId.indexOf("MEMBER"));

            // if((Site.AppId.indexOf("MEMBER") === -1 && hideorglist.indexOf(parseInt(comp.orgid)) === -1) ||          // poolstat site && org is not in hideorglist
            //         (Site.AppId.indexOf("MEMBER") > -1 && hideorglist.indexOf(parseInt(comp.orgid)) > -1)) {       // not a poolstat site and org IS in the hideorglist

                console.log(cid, myfavs);

                favclass = ' nofav';
                if( myfavs !== null ) {
                    if( myfavs.indexOf(cid) > -1 ) {
                        favclass = ' isfav';
                    }
                }


                let headhtml = String.format('<div class="activematchset set{1}" data-role="collapsible" ' +
                    'data-collapsed="{0}" data-orgid="{4}" data-compid="{1}"><h3>{2} - {3}<div class="fav' + favclass + '"></div></h3>',
                    collapsed, cid, data.orgs[comp.orgid].orgcode, comp.compnamefull, comp.orgid);

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
                            dhtml[match.drid] = String.format('<div class="divTable" style="border-collapse:separate;border-spacing:3px;">' +
                                '<div class="roundheader" data-roundid="{0}"><span class="rounddesc">{1}</span><span class="fav-star">&#9733;</span></div>', match.drid, comp.rounds[match.drid].rounddesc);
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
                        var jwt_drawid = isset(myJWT.drawid) ? myJWT.drawid : 0;

                        var msg = "Match was not Livescored";
                        if(noresults) {
                            nrhtml = String.format('<tr class="nomatch hidden"><td colspan="{0}" style="text-align:center;">{1}</td></tr>', cols, msg);
                        }
                        else {
                            if( panelcolor == "matchwait" || panelcolor == "matchpend" || panelcolor == 'matchnoshow' ) {
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
                            else if(drawid === jwt_drawid) {
                                msg = "Cannot view a match you are currently editing";
                            }
                            cols = 4;
                            nrhtml = String.format('<tr class="nomatch hidden">' +
                                '<td class="no-narrow" style="width:12%;">&nbsp;</td>' +
                                '<td colspan="{0}" style="text-align:center;">{1}</td></tr>', cols, msg);
                        }

                        hscore = parseInt(match.home.framescore) + parseInt(match.home.framescoreadj);
                        ascore = parseInt(match.away.framescore) + parseInt(match.away.framescoreadj);

                        if( comp.ls.hasmatchpoints == "1" ) {
                            hscore = +(parseFloat(match.home.framepoints) + parseFloat(match.home.framepointsadj)).toFixed(2);
                            ascore = +(parseFloat(match.away.framepoints) + parseFloat(match.away.framepointsadj)).toFixed(2);
                        }

                        dhtml[match.drid] += String.format('<div class="divTableRow"><div class="divTableCell matchrowview {2}" data-drawid="{1}" style="padding:5px;">' +
                            '<table class="matchtbl" width="100%"><tr class="matchok" id="draw_{1}">' +
                            '<td class="no-narrow" style="width:12%;' + ((panelcolor == 'matchdone' || noresults) ? '' : '') + '">{3}</td>' +
                            '<td class="ar{8}" style="width:32%;">{6}</td>' +
                            '<td id="score_{0}" class="ac on isset ' + (noresults ? 'none;' : 'valid') + '">' + (noresults ? '' : '{4} : {5}') + '</td>' +
                            '<td class="{9}" style="width:32%">{7}</td>' +
                            '</tr>' + nrhtml + '</table></div></div>', match.drid, drawid, panelcolor, minsabbr, hscore, ascore,
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
//            }
        });

        needsRefresh = false;

        if(compcount === 0) {
            console.log('NO MATCHES because compcount = 0');
            html = "<h3 style='color:red;text-align:center;'>No Matches!</h3>";
            nomatches = true;
            needsRefresh = false;
        }
        else {
//            html = "<p style='text-align:center;'>Select match to view Live Scoresheet</p>" + (needsRefresh ? '<div id="refreshstatushome"></div>' : '') + html;
            nomatches = false;
        }


        if(Site.AppId.indexOf("MEMBER") === -1) {
//            html = '<p style="text-align:center;">View <b>AEBF Junior Nationals</b> Match Info <a href="https://lsview.aebf.com.au" target="_blank">HERE</a></p>' + html;
        }

        let showfavs = '<p><span class="hidden"><b><u>Showing Favourites</u></b>, <a class="show-all" href="#">show All</a></span><span className=""><b><u>Showing All</u></b>, <a class="show-fav" href="#">only show Favourites</a></span><span class="info-fav"><img src="/images/info.svg"</span></p>';

        $("#activematchset").append(datesel + showfavs + html).collapsibleset("refresh");
        $(".compmenu").listview().listview("refresh");
    }

    $(".lslogin.return").addClass("hidden");
    $(".lslogin.login").addClass("hidden");
   // $(".social-icons").addClass("hidden");

console.log('nomatches: ' + (nomatches ? 'true' : 'false'));

    if(Site.AppId.indexOf("MEMBER") === -1 ) {
        if(localStorage.getItem("loadsource") == 'livebackbutton') {
            $(".lslogin.login").addClass("hidden");
            $(".lslogin.return").removeClass("hidden");
        }
        else {
            if(moment().format("Y-MM-DD") === moment(data.today).format("Y-MM-DD")) {
                if(["today", data.today].indexOf($("#matchdate").attr("data-seldate")) > -1) {
                    $(".lslogin.return").addClass("hidden");
                    $(".lslogin.login").removeClass("hidden");
                }
            }
        }
    }

//    if(nomatches === false && Site.AppId.indexOf("MEMBER") === -1 ) {
//console.log(localStorage.getItem("loadsource"));
//        if(localStorage.getItem("loadsource") == 'livebackbutton') {
//            $(".lslogin.login").addClass("hidden");
//            $(".lslogin.return").removeClass("hidden");
//        }
//        else {
//            if(moment().format("Y-MM-DD") === moment(data.today).format("Y-MM-DD")) {
//                if(["today", data.today].indexOf($("#matchdate").attr("data-seldate")) > -1) {
//                    $(".lslogin.return").addClass("hidden");
//                    $(".lslogin.login").removeClass("hidden");
//                }
//            }
//        }
//    }

    LastUpdate.intervalCount = 0;
    LastUpdate.lastTimestamp = 0;

needsRefresh = false;

    console.log('needsRefresh: ' + (needsRefresh ? "YES" : "NO"));

    LastUpdate.lastRefresh = phpTime();

//needsRefresh = false;
    if(needsRefresh) {
        $("#refreshstatushome").show();
        updateMatchData();
        IDX_INTERVAL = setInterval(function() { updateMatchData() }, 5000);
    }
    else {
        if(IDX_INTERVAL !== null) {
            clearInterval(IDX_INTERVAL);
            IDX_INTERVAL = 0;
            $("#refreshstatushome").hide();
        }
    }


//$('.activematchsheet').bind('expand', function () {
//    console.log('Expanded');
//}).bind('collapse', function () {
//    console.log('Collapsed');
//});

}

function phpTime() {
    return parseInt($.now() / 1000);
}

function updateMatchData()
{
    var elem = $("#refreshstatushome");

    //lastTimestamp: 0, lastRefresh: 0, intervalCount: 0;
    if(LastUpdate.intervalCount < 6) {
        $(elem).text("Refreshed at " + moment.unix(LastUpdate.lastRefresh).format("h:mm:ss a") + ", update in " + ((6 - LastUpdate.intervalCount) * 5) + " secs");
        LastUpdate.intervalCount++;
    }
    else {
        var rounds = [];
        $(elem).text("Refreshed at " + moment.unix(LastUpdate.lastRefresh).format("h:mm:ss a") + ", updating, please wait...");
        $.each($(".roundheader"), function(k,o) {
            rounds.push($(o).attr("data-roundid"));
        });

        var mydata = {
            action: 'updatematchdata',
            rounds: rounds,
            lastTimestamp: LastUpdate.lastTimestamp,
        };

        if(isMemberApp()) {
            mydata.publickey = Site.memberkey;
        }

        $.ajax({
            url: apiURL + 'refreshmatchscores',
            data: mydata,
            success: function(data) {
                console.log('SUCCESS::updateMatchData()');
                console.log(data);
                LastUpdate.intervalCount = 0;
                LastUpdate.lastRefresh = phpTime();
                LastUpdate.lastTimestamp = phpTime();
            },
            error: function(err) {
                console.log('SUCCESS::updateMatchData()');
                console.log(err);
            }
        });
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

        var mydata = {
                action: 'refreshmatchupdatesV2',
                ids: [Teams.twa.data.id, Teams.twla.data.id],
                lastTimestamp: LastUpdate.lastTimestamp,
                timeouts: LastUpdate.timeoutCount,
                lastRefresh: LastUpdate.lastRefresh
            };

        if(isMemberApp()) {
            mydata.publickey = Site.memberkey;
        }

        $.ajax({
            url: apiURL + 'refreshmatchupdatesV2',
            data: mydata,
            success: function(retdata) {

                console.log('Process took ' + (($.now() - startTime)/1000) + ' seconds');

                console.log('success.refreshmatchupdatesV2');
                console.log(retdata);

                var resultfields = ['framecount','framesequence','resultcode','resultstatus'];

                if(retdata.reccount + retdata.remcount > 0) {

                    // frame adjustments
                    if(retdata.remcount > 0) {
                        if($(".spinview.home").length > 0) {
                            $(".spinview.home").text(retdata.rems.H.homeframescoreadj);
                            $(".spinview.away").text(retdata.rems.H.awayframescoreadj);
                            if( matchHasPoints() ) {
                                $(".spinview.home").text(retdata.rems.H.homeframepointsadj);
                                $(".spinview.away").text(retdata.rems.H.awayframepointsadj);
                            }
                        }

                        Teams.home.data.homeframescoreadj = retdata.rems.H.homeframescoreadj;
                        Teams.away.data.awayframescoreadj = retdata.rems.H.awayframescoreadj;

                        Teams.home.data.homeframepointsadj = retdata.rems.H.homeframepointsadj;
                        Teams.away.data.awayframepointsadj = retdata.rems.H.awayframepointsadj;

                        Teams.home.data.homeframepointsadj = retdata.rems.H.homeframepointsadj;
                        Teams.away.data.awayframepointsadj = retdata.rems.H.awayframepointsadj;

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

                            if(isset(hgbc.partner)) {
                                if(hgbc.partner.length > 0) {
                                    var dgbc = null;
                                    if(isset(GBCodes[hgbc.partner])) {
                                        var dgbc = GBCodes[hgbc.partner]
                                    }
                                    dblkey = dgbc.blockno + '-' + dgbc.row;
                                }
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
    this.minplayers = 0;
    this.maxplayers = 0;

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
                            $(".menuli.o4").find(".enterresultsmsg").data('lock', '0');
                            $(".menuli.o4").find(".refreshsecs").addClass("show");
                        }
                        else {
                            $(".menuli.o14").find(".enterresultsmsg").show();
                            $(".menuli.o14").find(".enterresultsmsg").data('lock', '0');
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

                                console.log('finalisecheckinterval = ' + finalisecheckinterval);

//                                if(finalisecheckinterval === 0) {
//                                    finalisecheckinterval = setInterval(checkFinaliseStatus, 1000);
//                                }
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
                        else {
                            if($(".enterresultsmsg").data('lock') == '0') {
console.log('showNoty::3');
                                clearInterval(lockcheckinterval);
                                lockcheckinterval = 0;

                                $(".enterresultsmsg").data('lock', '1');
                                var msg = '<p style="text-align:center">All Players Locked<p><p style="text-align:center"><b>MATCH IS READY!</b></p>';
                                showNoty(msg, 'success', 'center', 4000);
                            }
                        }
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

        clearInterval(finalisecheckinterval);
        finalisecheckinterval = 0;

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
                    if(finalisecheckinterval === 0 && trigger_interval) {
                        finalisecheckinterval = setInterval(checkFinaliseStatus, 1000);
                    }
                    else {
                        myAlert('error', 'Finalise Error', 'Other team as updated data recently', function () { $.mobile.changePage(PAGE_HOME); });
                    }
                }
                else {
                    if(finalisecheckinterval !== 0) {
                        clearInterval(finalisecheckinterval);
                        finalisecheckinterval = 0;
                    }
                    $(".finalisesmsg").hide();
                    $(".finaliseawaymatch").removeClass("ui-disabled");
                    var reason = getLastResultUpdateSecs() === 0 ? 'Wait period has elapsed' : 'Other Team has Finalised(x)';
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
    if($(".refreshsecs.show").length > 0) {

        var secs = parseInt($(".refreshsecs.show").text());
        secs = secs - 1;

    console.log("checkLockStatus::" + secs);

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
                },
                error:function(errdata) {
                    console.log('ERROR');
                    displayErrMsg('Error', errdata);    //  }
                }
            });
        }
        $(".refreshsecs").text(secs);
    }
}

// update pos value for block
function updateMatchsheet(code, data)
{
    var scode;
    var block;

//console.log(code);
//console.log(data);

    if(isset(data.remotedata.blockno)) {

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

        var blockobj = udc(MatchSheet[block]) ? {} : MatchSheet[block];
        var hora = udc(blockobj[scode.pos]) ? {} : blockobj[scode.pos];

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

function myConfirm(title, msg, buttonText, answer)
{
    if(udc(buttonText) || buttonText === null) {
        buttonText = {ok: 'OK', yes: 'Yes', cancel: 'Cancel'};
    }

    modal({
        type: 'confirm', //Type of Modal Box (alert | confirm | prompt | success | warning | error | info | inverted | primary)
        title: title, //Modal Title
        text: msg, //Modal HTML Content
        size: 'small', //Modal Size (normal | large | small)
        buttons: [
            {
                val: 'ok', //Button Value
                eKey: false, //Enter Keypress
                addClass: 'btn-light-blue button40 btn-ok',
                // Button Classes (btn-large | btn-small | btn-green | btn-light-green | btn-purple | btn-orange | btn-pink |
                // btn-turquoise | btn-blue | btn-light-blue | btn-light-red | btn-red | btn-yellow | btn-white | btn-black |
                // btn-rounded | btn-circle | btn-square | btn-disabled)
                onClick: function (d) {
//                    console.log(d);
                },
            },
            {
                val: 'cancel', //Button Value
                eKey: false, //Enter Keypress
                addClass: 'btn-light-red button40 btn-cancel',
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
        buttonText: buttonText,
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

function updatePointsScoreDialog(obj, pointsUpdate_Success, pointsUpdate_Error)
{
    let winner = 'away';
    let loser = 'home';
    let aScore = 10;
    let hScore = 0;

    let hCode = $(obj).parent().find(".home.code").attr("data-gcode");
    let aCode = $(obj).parent().find(".away.code").attr("data-gcode");

    let hCScore = $(obj).parent().find(".home.result").text();
    let aCScore = $(obj).parent().find(".away.result").text();

    // if the score is already set load the form with the current scores
    if( hCScore != '?') {
        hScore = parseInt(hCScore);
        aScore = parseInt(aCScore);
    }

    let hPlayer = $(obj).parent().find('.pname.home span:visible').text();
    let aPlayer = $(obj).parent().find('.pname.away span:visible').text();

    if ($(obj).hasClass('home') ) {
        winner = 'home';
        loser = 'away';
        if (hCScore + aCScore == '??') {
            hScore = 10;
            aScore = 0;
        }
    }

    console.log(obj);

    let html = String.format('<div class="matchpoints update home">' +
        '<div class="spinner-points playername">{0}</div>' +
        '<div class="spinner-points spinkey spinminus">-</div>' +
        '<div id="spinner_{1}" class="spinner-points spinvalue home" data-scoreid="result_{1}">{2}</div>' +
        '<div class="spinner-points spinkey spinplus">+</div>' +
    '</div>', hPlayer, hCode, hScore);

    html += String.format('<div class="matchpoints update away">' +
        '<div class="spinner-points playername">{0}</div>' +
        '<div class="spinner-points spinkey spinminus">-</div>' +
        '<div id="spinner_{1}" class="spinner-points spinvalue away" data-scoreid="result_{1}">{2}</div>' +
        '<div class="spinner-points spinkey spinplus">+</div>' +
    '</div>', aPlayer, aCode, aScore);

    let buttonText = {ok: 'OK', yes: 'Save', cancel: 'Cancel'};

    myConfirm('Update Points', html, buttonText,
        function(answer) {
            if(answer) {
                console.log(this);
                // user clicked save
                let hObj = $("div.modal-text").find('.spinvalue.home');
                let aObj = $("div.modal-text").find('.spinvalue.away');
                console.log(hObj, aObj);
                // let hRes = "#" + $(hObj).attr("data-scoreid");
                // let aRes = "#" + $(aObj).attr("data-scoreid");
                // console.log(hRes, aRes);
                // console.log($(hObj).text(), $(aObj).text());
                // $(hRes).text($(hObj).text());
                // $(aRes).text($(aObj).text());

                saveResultToDb(obj, 'frame-points', { 'h': parseInt( $(hObj).text() ), 'a': parseInt( $(aObj).text() ) }, 0, function () {
                    console.log("Updating Scores as Points");
                });
            }
        }
    );
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
            '<input type="text" style="width:80px;" id="dlgRank" value="' + rank + '" class="otherpwdinput" />'
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

    //        var teamcode = $("#psteamname").attr("data-side");
    //        var hora = teamcode[0];
            var pin = $("#psteamname").attr("data-pin");
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

//                var reg = /^\d+(\.\d{2})?$/;    // allows "77" or "77.5" but not "77." or "77.55"

//                newrank = trank.match(reg);

                 newrank[0] = trank;

                // if(newrank === null) {
                //     $("#addplayersubmitmsg").text("Rank is not Valid.  Must be number, ie: '77', '77.5'. optional 'T' at end if rank is temporary").css("color","red");
                //     return false;
                // }

                var minpr = parseInt(Data.config.minplayerrank);
                var maxpr = parseInt(Data.config.maxplayerrank);
                var newpr = newrank[0]; // parseFloat(newrank[0]);

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

                                var buttonText = {ok: 'OK', yes: 'Unlock', cancel: 'Cancel'};

                                myConfirm('Unlock Players', '<p>Select teams that require players to be unlocked for this match:</p>' +
                                    '<p><input id="unlockhometeam" type="checkbox" name="unlockhometeam" value="' + Teams.H.hteamid + '"><span style="margin-left:10px;">' + Teams.H.shortname + '</span></p>' +
                                    '<p><input id="unlockawayteam" type="checkbox" name="unlockawayteam" value="' + Teams.A.hteamid + '"><span style="margin-left:10px;">' + Teams.A.shortname + '</span></p>' +
                                    '<p>Click <b>Unlock</b> to unlock Players for selected teams</p>',
                                    buttonText,
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
                                    }
                                );
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
