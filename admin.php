<?php $appver='2.1.98'; ?>
<!DOCTYPE HTML>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Admin: LiveScore</title>    
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
        
        <div id="AdminPage" data-role="page" data-cache="false" data-dom-cache="false">
            <div data-role="header" data-position="fixed">
                <table width="100%" style="border:none;border-collapse:collapse;">
                    <tr style="background-color:#A2C300;">
                        <td style="width:50px"><a href="#" class="ui-btn-a ui-icon-home ui-btn-icon-left"></a></td>
                        <td align="center" style="padding:5px 5px;background-color:#A2C300;"><img src="images/logo-live.png" /></td>
                        <td style="width:50px">
                            <a href="#settingmenuplist" data-rel="popup" class="ui-corner-all ui-btn-inline ui-icon-gear ui-btn-icon-right ui-btn-a"></a>
                            <div data-role="popup" id="settingmenuplist" data-theme="a">
                                <ul class="popupmenu" data-role="listview" style="min-width:210px;">
                                    <li><a id="sitestatus" href="#">Status</a></li>
                                    <li><a id="reloadsite" href="#">Reload Site</a></li>
                                    <li><a id="logoff" href="#">Log Off</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>

            <div data-role="content">
            <div id="adm-div" class="container" style="margin: 0 auto;">
                <div id="admin-div" class="container" style="padding-bottom:30px;"></div>
                <div data-role="panel" id="teamoptionspanel" data-display="overlay" data-position="right" data-position-fixed="true" style="padding:10px;"></div>                
                <div data-role="panel" id="teaminfopanel" data-display="overlay" data-position="left" data-position-fixed="true" style="padding:10px;"></div>                
            </div>
            </div>

            <div id="pagefooter" data-role="footer" data-position="fixed">
                <div style="padding:5px;">
                    <table align="center" width="5%">
                        <tr>
                            <td style="cursor:pointer;min-width:20px;height:20px;"><div class="cstatus cstatus-red" data-notyclass=""></div></td>
                            <td id="adfootertext" class="footertext" data-pagename="admin" data-appversion="<?php echo $appver; ?>">Brella Tech Pty Ltd</td>
                        </tr>
                    </table>
                </div>
            </div>		

        </div>
    </body>
</html>
