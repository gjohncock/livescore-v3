<?php $appver='2.1.100'; ?>
<html>
    <head>
        <title>Livescore</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- START - CODE REQUIRED WHEN USER CLICKS BROWSERS REFRESH BUTTON -->
        <script>
            window.location = location.origin + "/?br-" + Date.now();
        </script>
<!-- END - CODE REQUIRED WHEN USER CLICKS BROWSERS REFRESH BUTTON -->
    </head>
    <body>
        <div id="HomePage" data-role="page" data-cache="false" data-dom-cache="false">
            <div data-role="header" data-position="fixed">
                <table width="100%" style="border:none;border-collapse:collapse;">
                    <tr class="header-sect">
                        <td class="iconhome home-page" style="width:50px"><a id="back_home" href="#" class="ui-btn-inline ui-icon-arrow-l ui-corner-all ui-btn-icon-left"></a></td>
                        <td align="center"><img class="header-logo" src="/images/logo-new.png" /></td>
                        <td class="iconcog" style="width:50px">
                            <a id="pmenu_home" href="#" class="ui-btn-inline ui-corner-all ui-icon-bars ui-btn-icon-right"></a>
                        </td>
                    </tr>
                </table>
            </div>

            <div data-role="content">

                <div data-role="panel" id="home_pmenu" class="panelmenu" data-display="overlay" data-position="right" data-position-fixed="true">
                    <h3>Options</h3>
                    <ul data-role="listview">
                        <li><a id="sitestatus" href="#">Status</a></li>
                        <li><a id="switchaccess" href="#">Switch Access</a></li>
<!--                        <li><a id="forfeitmatch" href="#">Forfeit this Match</a></li>   -->
    <!--
                        <li><a id="lockoverride" href="#">Set Auto-Approve</a></li>
                        <li><a id="refreshdata" href="#">Refresh Data</a></li>
    -->
                        <li><a id="adminlogin" href="#">Admin Login</a></li>
                        <li><a id="reloadsite" href="#">Reload Site</a></li>
                        <li><a id="logoff" href="#">Log Off</a></li>
                    </ul>
                </div>

                <div id="home-div" class="container" style="margin: 0px auto;">

                    <div id="matchMenu">
<!--
                        <div class="multiroundmode hidden" style="text-align:center;">
                            <select name="select-round" id="select-round" data-native-menu="false">
                                <option value="today">Today</option>
                            </select>
                        </div>
-->
                        <div id="myteaminfo" class="mycollapsible expanded">

                            <div class="mycoltitle ui-btn ui-icon-minus ui-btn-icon-left"><a id="myteaminfo">TODAYS MATCHES</a></div>

                            <div class="myteaminfocontent mycollcontent">

                            </div>

                        </div>

                        <div class="accessteam mycollapsible hidden expanded" data-accessteam="home">

                            <div class="mycoltitle ui-btn ui-icon-minus ui-btn-icon-left"><a id="accessteamname">ACCESS TEAM</a></div>

                            <div class="mycollcontent">

                                <div class="accessteam menuli o2">
                                    <a id="playerselect_access" class="menuitem am0 am1" data-option="2" href="#">
                                        Select Players & Subs <span style="color:green;"></span></a></div>
                                <div class="accessteam menuli o3">
                                    <a id="maketeamready_access" class="menuitem am0 am1" data-option="3" href="#">LOCK IN PLAYERS</a></div>
                                <div class="accessteam menuli o4">
                                    <div class="enterresultsmsg" style="font-size:0.8em;color:red;display:none;" data-lock="1">
                                        Waiting for other team to LOCK IN PLAYERS (Refresh in <span class="refreshsecs">15</span> secs)</div>
                                        <a id="enterresults_access" class="menuitem am0 am1 enterresults" data-option="4" href="#">
                                        <span id="enterresultslabel">Enter Results</span></a>
                                </div>
                                <div class="accessteam menuli o5">
                             <a id="finalisegame_access" class="menuitem am0 am1" data-option="5" href="#">Finalise Match</a></div>
                                <div class="accessteam menuli o6">
                             <a id="logoff_access" class="menuitem am0 am1" style="color:red;" data-option="6" href="#">LOG OFF</a></div>

                            </div>

                        </div>

                        <div class="accessteam noaccessteam mycollapsible hidden expanded">

                            <div class="mycoltitle ui-btn ui-icon-minus ui-btn-icon-left"><a id="noaccessteamname">NO ACCESS TEAM</a></div>

                            <div class="mycollcontent">

                                <div class="devicestatus nocontrol hidden">OTHER TEAM HAS SELECT/LOCK PLAYER CONTROL<br /><span class="smalltext">Tap here to change</span></div>

                                <div class="accessteam menuli"><a class="noaccesslogin" style="color:rgb(0,150,0);" data-status="0" href="#">LOG IN</a></div>

                                <div class="noaccessteam restricted hidden">
                                    <div class="twla-finalise-old hidden menuli" style="color:red;font-weight:bold;">ACCESS DENIED: Finalise Previous Match</div>
                                    <div class="noaccessteam menuli o12">
                                        <a id="playerselect_noaccess" class="menuitem am0 am1 noaccess" data-option="12" href="#">
                                            Select Players & Subs <span style="color:green;"></span></a></div>
                                    <div class="noaccessteam menuli o13">
                                        <a id="maketeamready_noaccess" class="menuitem am0 am1" data-option="13" href="#">LOCK IN PLAYERS</a><br />
                                    </div>
                                    <div class="noaccessteam menuli o14">
                                        <div class="enterresultsmsg" style="font-size:0.8em;color:red;display:none;" data-lock="1">
                                            Waiting for other team to LOCK IN PLAYERS (Refresh in <span class="refreshsecs">15</span> secs)</div>                                                                          <a id="viewresults_noaccess" class="menuitem am0 am1 viewresults" data-option="14" href="#">
                                     <span id="viewresultslabel">View Results</span></a>
                                    </div>
                                    <div class="noaccessteam menuli o15">
                                        <div class="finalisesmsg" style="font-size:0.8em;color:red;display:none;">
                                            Waiting for other team to FINALISE (Check Status in <span class="refreshsecs">15</span> secs)
                                        </div>
                                        <a id="finalisegame_noaccess" class="menuitem am0 am1 finaliseawaymatch" data-option="15" href="#">Finalise Match</a>
                                    </div>
                                    <div class="noaccessteam menuli o16">
                                     <a id="logoff_noaccess" class="menuitem am0 am1" style="color:red;" data-option="6" href="#">LOG OFF</a></div>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </div>

            <div data-role="panel" id="home_pmenu" class='' data-display="overlay" data-position="left" data-position-fixed="true"></div>
                <div data-role="popup" id="settingmenuhome" data-theme="a">
                    <ul class="popupmenu" data-role="listview" style="min-width:210px;">
                        <li><a id="setpassword" href="#">Set Team Password</a></li>
                        <li><a id="sitestatus" href="#">Status</a></li>
                        <li><a id="switchaccess" style="display:none;" href="#">Switch Access</a></li>
<!--
                        <li><a id="forfeitmatch" style="display:none;" href="#">Forfeit this Match</a></li>
                        <li><a id="lockoverride" href="#">Set Auto-Approve</a></li>
                        <li><a id="refreshdata" href="#">Refresh Data</a></li>
-->
                        <li><a id="adminlogin" href="#">Admin Login</a></li>
                        <li><a id="reloadsite" href="#">Reload Site</a></li>
                        <li><a id="logoff" href="#">Log Off</a></li>
                    </ul>
                </div>

            <div class="noty" style="bottom:40px;min-height:0px;width:100%;display:block;position:fixed;"></div>
            <div id="pagefooter" data-role="footer" data-position="fixed" style="background-color:#efefef;">
                <div style="padding:5px;">
                    <table align="center" width="50%">
                        <tr>
                            <td style="cursor:pointer;min-width:20px;height:20px;">
                            </td>
                            <td id="hmfootertext" class="footertext" data-pagename="home" data-appversion="<?php echo $appver; ?>">Brella Tech Pty Ltd</td>
                            <td style="cursor:pointer;min-width:20px;height:20px;">
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

        </div>
    </body>
</html>
