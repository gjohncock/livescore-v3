<?php $appver='2.1.100'; ?>
<!DOCTYPE HTML>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Livescore</title>
<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
<!-- START - CODE REQUIRED WHEN USER CLICKS BROWSERS REFRESH BUTTON -->
        <script>
            window.location = location.origin + "/?br-" + Date.now();
        </script>
<!-- END - CODE REQUIRED WHEN USER CLICKS BROWSERS REFRESH BUTTON -->
<style>
    .rhead {
        font-weight: bold;
    }
    .rowf {
        height: 35px;
        vertical-align: middle;
    }
</style>
</head>
<body>

    <div id="PlayerSelectPage" data-role="page" data-cache="false" data-dom-cache="false">

        <div data-role="header" data-position="fixed">
            <table width="100%" style="border:none;border-collapse:collapse;">
                <tr class="header-sect">
                    <td class="iconhome playerselect-page" style="width:50px" data-parentpage="home"><a id="back_playerselect" href="#" class="ui-btn-inline ui-icon-arrow-l ui-corner-all ui-btn-icon-left"></a></td>
                    <td align="center"><img class="header-logo" src="/images/logo-new.png" /></td>
                    <td class="iconcog" style="width:50px"><a id="pmenu_playerselect" href="#" class="ui-btn-inline ui-corner-all ui-icon-bars ui-btn-icon-right"></a></td>
                </tr>
            </table>
        </div>

        <div data-role="content">

            <div data-role="panel" id="playerselect_pmenu" class="panelmenu" data-display="overlay" data-position="right" data-position-fixed="true">
                <h3>Options</h3>
                <ul data-role="listview">
                    <li><a id="sitestatus" href="#">Status</a></li>
                    <li><a id="reloadsite" href="#">Reload Site</a></li>
                    <li><a id="logoff" href="#">Log Off</a></li>
                </ul>
            </div>

            <div id="msheetpreview" class="mspreview">Scoresheet View</div>

            <div id="pselect-div" class="container" style="margin: 0 auto;">
                <h4>Team: <span id="psteamname" class="teamtitle"></span></h4>
                <p>Select <span style="font-weight:bold;color:red;">ALL PLAYERS/SUBS</span> required for <span style="font-weight:bold;color:red;">THIS MATCH</span></p>
                <p id="selectinfo" data-maxpoints="0" data-minpoints="0" data-maxpos="0"></p>
                <p id="playerinfo" data-maxlegend="0" data-maxstats="0"></p>
                <div id="pselect_buttons3" class="pagebuttons">
                    <div class="mypbuttonrow">
                        <div id="ps_save" class="pbutton2 clr-bg-green clr-white">SAVE</div>
                        <div id="ps_clear" class="pbutton2 clr-bg-red clr-white">CLEAR</div>
                        <div id="ps_addplayer" class="pbutton2 clr-bg-teal clr-white">Add Player</div>
                        <div id="ps_addforfeit" class="pbutton2 clr-bg-cyan clr-white">Add Forfeit</div>
                    </div>
                </div>
                <div id="playerselect-div" class="container" style="padding-bottom:30px;">
                </div>
            </div>

            <div data-role="panel" id="mspreviewpanel" data-dismissible="false"
                 data-display="overlay" data-position="right" data-position-fixed="true" style="padding:10px;width:9em;">
                <a href="#PlayerSelectPage" title="Close" data-rel="close"><img src="/images/close-x.png" style="width:15px;" /></a>
                <div id="previewpanelcontent" style="height:100%;"></div>

            </div>

        </div>

        <div data-role="panel" id="matchpreviewpanel" data-display="overlay" data-position="right" data-position-fixed="true" style="padding:10px;"></div>
        <div class="noty" style="bottom:40px;min-height:0px;width:100%;display:block;position:fixed;"></div>
        <div id="pagefooter" data-role="footer" data-position="fixed" style="background-color:#efefef;">
            <div style="padding:5px;">
                <table align="center" width="50%">
                    <tr>
                        <td style="cursor:pointer;min-width:20px;height:20px;"></td>
                        <td id="psfootertext" class="footertext" data-pagename="playerselect" data-appversion="<?php echo $appver; ?>">Brella Tech Pty Ltd</td>
                        <td style="cursor:pointer;min-width:20px;height:20px;"></td>
                    </tr>
                </table>
            </div
        </div>

    </div>

</body>

</html>
