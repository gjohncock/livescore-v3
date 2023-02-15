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
        'ls.poolstat.net.au': {    api:'https://poolstat.net.au/',appid:'PSMOB2.AU',    appmode:'LIVE2.AU',apptype:'LIVE'},
        'lsview.poolstat.net.au': {api:'https://poolstat.net.au/',appid:'PSMOB.VIEW.AU',appmode:'LIVE',    apptype:'VIEW'},
        // PLAY
        'lsplay.poolstat.net.au': {    api:'https://play.poolstat.net.au/',appid:'PSMOB2.PLAY',    appmode:'PLAY2',apptype:'LIVE'},
        'lsviewplay.poolstat.net.au': {api:'https://play.poolstat.net.au/',appid:'PSMOB.VIEW.PLAY',appmode:'PLAY', apptype:'VIEW'},
        // TEST
        'lstest.poolstat.net.au': {    api:'https://test.poolstat.net.au/',appid:'PSMOB2.TEST',    appmode:'TEST2',apptype:'LIVE'},
        'lsviewtest.poolstat.net.au': {api:'https://test.poolstat.net.au/',appid:'PSMOB.VIEW.TEST',appmode:'TEST', apptype:'VIEW'},
        // PROD.UK
        'ls.poolstat.uk': {    api:'https://poolstat.uk/',appid:'PSMOB2.UK',    appmode:'LIVE2.UK',apptype:'LIVE'},
        'lsview.poolstat.uk': {api:'https://poolstat.uk/',appid:'PSMOB.VIEW.UK',appmode:'LIVE.UK', apptype:'VIEW'},
        // MEMBER
        'member_live': {api:'https://poolstat.net.au/',appid:'MEMBER.LIVE',appmode:'LIVE',apptype:'LIVE'},
        'member_view': {api:'https://poolstat.net.au/',appid:'MEMBER.VIEW',appmode:'VIEW',apptype:'VIEW'},
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

var SiteStatus = function()
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
        return moment();
    }

    this.showStatus = function() {
        return '<table style="width:100%"><tr><td style="width:40%;"><b>Page Name:</b></td><td style="width:60%;">' + this.pageName + '</td>' +
            "<tr><td><b>Page Version:</td><td>" + this.pageVersion + '</td>' +
            "<tr><td><b>Lib Version:</td><td>" + this.libVersion + '</td>' +
            "<tr><td><b>Db Version:</td><td>" + this.dbVersion + '</td>';
    }
}



