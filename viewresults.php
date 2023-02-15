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

    <div id="ViewResultsPage" data-role="page" data-cache="false" data-dom-cache="false" style="height:80px;box-sizing: border-box;">

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
        <div id="refreshresults" class="refreshresults" style="display:none;">Refresh in <span id="refreshsecs">30</span> seconds</div>

        <div class="mycontent" data-role="content">

            <div data-role="panel" id="results_pmenu" class="panelmenu" data-display="overlay" data-position="right" data-position-fixed="true">
                <h3>Options</h3>

                <ul data-role="listview">
                    <li><a id="reloadsite" href="#">Reload Site</a></li>
                    <li><a id="refreshresults" style="display:none" href="#">Refresh Page</a></li>
                </ul>
            </div>

            <div class="ps-view-container hidden" id="PS_VIEW_TOP_CONTAINER">

            </div>

            <p id="enterresultsintromsg" style="margin-top:130px;text-align:center">Building Score Sheet, please wait...</p>
            <div id="eresults-div" class="container" style="margin: 0px auto;">
                <div id="enterresults-div">
                    <div id="resultset">
                    </div>
                </div>
                <div id="vresults_buttons" class="pagebuttons"></div>

            </div>

            <div class="ps-view-container hidden" id="PS_VIEW_BOTTOM_CONTAINER">

            </div>

        </div>

        <div id="vrfootertext" class="footertext" data-pagename="viewresults" data-appversion="<?php echo $appver; ?>"></div>
    </div>

</body>

</html>
