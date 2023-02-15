<?php $appver='2.1.100'; ?>
<!DOCTYPE HTML>
<html>
<head>
<title>LiveScore</title>
<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
<!-- START - CODE REQUIRED WHEN USER CLICKS BROWSERS REFRESH BUTTON -->
    <script>
        window.location = location.origin + "/?br-" + Date.now();
    </script>
<!-- END - CODE REQUIRED WHEN USER CLICKS BROWSERS REFRESH BUTTON -->
</head>
<body>

    <div id="FinaliseMatchPage" data-role="page" data-cache="false" data-dom-cache="false">

        <div data-role="header" data-position="fixed">
            <table width="100%" style="border:none;border-collapse:collapse;">
                <tr class="header-sect">
                    <td class="iconhome finalisematch-page" style="width:50px" data-parentpage="home"><a id="back_finalise" href="#" class="ui-btn-inline ui-icon-arrow-l ui-corner-all ui-btn-icon-left"></a></td>
                    <td align="center"><img class="header-logo" src="/images/logo-new.png" /></td>
                    <td class="iconcog" style="width:50px">
                        <a id="pmenu_finalise" href="#" class="ui-btn-inline ui-corner-all ui-icon-bars ui-btn-icon-right"></a>
                    </td>
                </tr>
            </table>
        </div>

        <div data-role="content">

            <div data-role="panel" id="finalise_pmenu" class="panelmenu" data-display="overlay" data-position="right" data-position-fixed="true">
                <h3>Options</h3>
                <ul data-role="listview">
                    <li><a id="sitestatus" href="#">Status</a></li>
                    <li><a id="reloadsite" href="#">Reload Site</a></li>
                    <li><a id="logoff" href="#">Log Off</a></li>
                </ul>
            </div>

            <div id="finalisematch-div" class="container finalise-default" style="text-align:center;margin: 0px auto;">
                <div data-role="collapsible" data-collapsed="false">
                    <h3>Final Score</h3>
                    <table align="center"><tr><td id="finalhometeamname" class="finalteam"></td><td id="finalhomescore" class="finalscore"></td></tr>
                        <tr><td colspan="2" style="text-align:left;padding-left:40px;">vs</td><td>&nbsp;</td></tr>
                        <tr><td id="finalawayteamname" class="finalteam">Away Team</td><td id="finalawayscore" class="finalscore">0</td></tr>
                    </table>
                </div>
                <div data-role="collapsible" data-collapsed="false">
                    <h3>Player Summary</h3>
                    <div id="finalplayersummary"></div>
                </div>
                <div id="this-team-finalise" data-role="collapsible" data-collapsed="false">
                    <h3>Finalise Match</h3>
                    <div id="eomtasks" class="eomtasks"></div>
                </div>
            </div>

            <div id="finalise-message" class="container" style="display:none;margin:auto;">
                <h3 class="ac">Finalised Successfully!</h3>
                <div id="finalise-message-home" style="margin: auto;">
                    <p class="ac">This match is now completed for your team.</p>
                    <p class="ac">Please ensure the<p>
                    <p class="ac" style="color:red;font-weight:bold;font-size:1.2em;">OTHER TEAM FINALISES NOW</p>
                    <p class="ac">to complete the match.</p>
                    <p class="ac">&nbsp;</p>
                </div>
                <div id="finalise-message-playself" style="display:none;margin: auto;">
                    <p class="ac">This match is now completed for both teams.</p>
                </div>
                <p class="ac"><button id="exitfinalise" class="ui-btn clr-btn-green ui-btn-inline">Return to Menu</button></p>
            </div>

        </div>

        <!-- TEAM PASSWORD LOGIN POP-UP

        <div data-role="popup" id="dlgTeamLogin">
            <div data-role="header"><h1 class='nd-title'>Team Login</h1></div>
            <div data-role="content">
                <form id="getTeamPasswordpopup">
                    <label for="password">Login with Team Password:</label>
                    <input type="password" name="password" id="otherfinalisepassword" placeholder="Enter Password here..." />
                    <a href="#" id="submitpasswordfinalise" data-rel="back" data-role="button" data-inline="true" class="ui-btn ui-mini clr-btn-green" style="margin-bottom:5px;">
                    Submit</a>
                </form>
            </div>
        </div>

        -->

        <div class="noty" style="bottom:40px;min-height:0px;width:100%;display:block;position:fixed;"></div>
        <div id="pagefooter" data-role="footer" data-position="fixed" style="background-color:#efefef;">
            <div style="padding:5px;">
                <table align="center" width="5%">
                    <tr>
                        <td style="cursor:pointer;min-width:20px;height:20px;">
<!--                            <div class="cstatus cstatus-red" title="Not connected" data-notyclass="error"></div>  -->
                        </td>
                        <td id="fmfootertext" class="footertext" data-pagename="finalisematch" data-appversion="<?php echo $appver; ?>">Brella Tech Pty Ltd</td>
                        <td style="cursor:pointer;min-width:20px;height:20px;">
<!--                            <div class="cstatusother cstatus-red" title="Not connected" data-notyclass="error"></div>  -->
                        </td>
                    </tr>
                </table>
            </div>
        </div>

    </div>

</body>

</html>
