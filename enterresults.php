<?php $appver='2.1.100'; ?>
<!DOCTYPE HTML>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>LiveScore</title>
<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
<style>
    .rhead {
        font-weight: bold;
    }
    .rowf {
        height: 35px;
        vertical-align: middle;
    }
    .ui-btn.my-tooltip-btn,
    .ui-btn.my-tooltip-btn:hover,
    .ui-btn.my-tooltip-btn:active {
        background: none;
        border: 0;
    }
</style>
<!-- START - CODE REQUIRED WHEN USER CLICKS BROWSERS REFRESH BUTTON -->
    <script>
        window.location = location.origin + "/?br-" + Date.now();
    </script>
<!-- END - CODE REQUIRED WHEN USER CLICKS BROWSERS REFRESH BUTTON -->
</head>
<body>

    <div id="EnterResultsPage" data-role="page" data-cache="false" data-dom-cache="false" style="height:80px;box-sizing: border-box;">

        <div class="myheader">
            <table width="100%" style="border:none;border-collapse:collapse;">

                <tr class="resultsheader showscore">

                    <td class="iconhome enterresults-page" style="width:50px" data-parentpage="home"><a id="back_results" href="#" class="ui-btn-inline ui-icon-arrow-l ui-corner-all ui-btn-icon-left"></a></td>

                    <td id="resultsheader" class="refreshwait">loading...</td>

                    <td class="iconcog" style="width:50px">
                        <a id="pmenu_results" href="#" class="ui-btn-inline ui-corner-all ui-icon-bars ui-btn-icon-right"></a>
                    </td>
                </tr>

            </table>
        </div>
        <div id="padder" style="height:41px"></div>
        <div id="finalisenow" class="finalisenow twa hidden">Click HERE to FINALISE</div>
        <div id="refreshresults" class="refreshresults" style="display:none;">Refresh in <span id="refreshsecs">30</span> seconds</div>

        <div class="mycontent" data-role="content">

            <div data-role="panel" id="results_pmenu" class="panelmenu" data-display="overlay" data-position="right" data-position-fixed="true">
                <h3>Options</h3>

                <ul data-role="listview">
                    <li><a id="bigfingers" href="#">Big Finger Mode</a></li>
<!--                    <li><a id="nameformats" href="#">Name Formats</a>
                        <ul data-role="listview">
                            <li><a id="nf_fullname" href="#">Firstname Surname</a></li>
                            <li><a id="nf_fshortname" href="#">Firstname S</a></li>
                            <li><a id="nf_shortname" href="#">F Surname</a></li>
                            <li><a id="nf_initials" href="#">FS</a></li>
                        </ul> -->
                    </li>

                    <li><a id="setnameformat" href="#">Set Name Format</a></li>
                    <li><a id="switchbreaks" href="#">Switch Breaks</a></li>
                    
                    <li><a id="reloadsite" href="#">Reload Site</a></li>
                    <li><a id="logoff" class="logoff" href="#">Log Off</a></li>
                    <li><a id="refreshresults" style="display:none" href="#">Refresh Page</a></li>
                </ul>
            </div>

            <p id="enterresultsintromsg" style="margin-top:130px;text-align:center">Building Score Sheet, please wait...</p>
            <div id="eresults-div" class="container" style="margin: 0px auto;">
                <div id="enterresults-div">
                    <div id="resultset">
                    </div>
                </div>
                <div id="eresults_buttons" class="pagebuttons"></div>

            </div>
        </div>

<!-- TEAM PASSWORD LOGIN POP-UP

        <div data-role="popup" id="dlgTeamLoginBL" data-block="0">
            <div data-role="header"><h1 class='nd-title'>Other Team Password</h1></div>
            <div data-role="content">
                <form id="getTeamPasswordpopup">
                    <p>Login with Team Password:</p><p id="getTeamPasswordpopupstatus" data-count="0"></p>
                    <input type="password" name="password" id="otherpasswordblock" placeholder="Enter Password here..." />
                    <a href="#" id="submitpasswordblock" data-rel="back" data-role="button" data-inline="true" class="ui-btn ui-mini clr-btn-green" style="margin-bottom:5px;">
                    Submit</a>
                </form>
            </div>
        </div>

        <div class="noty" style="bottom:40px;min-height:0px;width:100%;display:block;position:fixed;"></div>
        <div id="pagefooter" data-role="footer" data-position="fixed" style="background-color:#efefef;">
            <div style="padding:5px;">
                <table align="center" width="50%">
                    <tr>
                        <td style="cursor:pointer;min-width:20px;height:20px;">
                        </td>
                        <td id="erfootertext" class="footertext" data-pagename="enterresults" data-appversion="2.0.00">Brella Tech Pty Ltd</td>
                        <td style="cursor:pointer;min-width:20px;height:20px;">
                        </td>
                    </tr>
                </table>
            </div>
        </div>
 -->
        <div id="erfootertext" class="footertext" data-pagename="enterresults" data-appversion="<?php echo $appver; ?>"></div>
    </div>

</body>

</html>
