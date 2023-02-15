<?php $appver='2.1.100'; ?>
<html>
    <head>
        <title>Livescore</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- START - CODE REQUIRED WHEN USER CLICKS BROWSERS REFRESH BUTTON -->
        <script>
            window.location = window.origin + '/?browser-refresh';
        </script>

    <script>

    localStorage.setItem("drawid", "'.$model->drawid.'");
    localStorage.setItem("deviceid", "'.$model->remotedeviceid.'");

    console.log(localStorage);

    if(localStorage.getItem("drawid") === null) {
        localStorage.setItem("drawid", "'.$model->drawid.'");
        localStorage.setItem("deviceid", "'.$model->remotedeviceid.'");
    }

    function updateLast5(last5) {

        var last = "X";
        var res = "<table style=\"margin-left:auto;margin-right:auto;text-align:center;\"><tr>";
        if(last5 !== null) {
            var resobj = last5.split(",");
            while (resobj.length > 5) {
                resobj.shift();
            };
            $.each(resobj, function(key, obj) {
                var color = obj.charAt(0) == "H" ? "blue" : "red";
                if(obj.charAt(1)==="M") {
                    res += "<td style=\"border:1px solid white;width:25px;height:25px;background-color:" + color + ";text-align:center;color:white\">M</td>";
                }
                else if(obj.charAt(1)==="W") {
                    res += "<td style=\"border:1px solid white;width:25px;height:25px;background-color:" + color + ";color:white\"></td>";
                }
                last = obj.charAt(0);
            });
        }
        res += "</table>"

        $("#last5").html(res);

        setActiveButtons(last);

    }

    $("#storage").text("drawid = '.$model->drawid.', deviceid='.$model->remotedeviceid.'");

    updateLast5("'.$model->resultsequence.'");

    $(".v2_button").on("click", function() {
        if($(this).hasClass("active")) {
            var code = $(this).attr("data-code");
            var action = $(this).attr("data-action");
            changeScore(code, action);
        }
    });

    function setActiveButtons(last) {

        var home = parseInt($("#homescore").text());
        var away = parseInt($("#awayscore").text());
        var racetomax = parseInt($("#Remote_racetomax").val());
        var max = parseInt($("#Remote_max").val());

        // home buttons
        enableButton("#btnHomeWin");
        enableButton("#btnHomeMaster");
        enableButton("#btnHomeUndo");

        // away buttons
        enableButton("#btnAwayWin");
        enableButton("#btnAwayMaster");
        enableButton("#btnAwayUndo");

        // action buttons
        disableButton("#btnCompleteProxy");

        if(max > -1) {                  // ignore max
            if(racetomax === 0) {       // play all frames
                if(home + away === max) {
                    // disable both buttons for both home and away
                    disableButton("#btnHomeWin");
                    disableButton("#btnHomeMaster");
                    disableButton("#btnAwayWin");
                    disableButton("#btnAwayMaster");
                    enableButton("#btnCompleteProxy");
                }
            }
            else if(racetomax === 1 || racetomax === 2) {           // race to max or best of
                if(home === max) {
                    disableButton("#btnHomeWin");
                    disableButton("#btnHomeMaster");
                    enableButton("#btnCompleteProxy");
                }
                else if(away === max) {
                    disableButton("#btnHomeWin");
                    disableButton("#btnHomeMaster");
                    enableButton("#btnCompleteProxy");
                }
            }
        }

        // disable both UNDOs when there are no matches
        if(home === 0) {
            disableButton("#btnHomeUndo");
        }
        if(away === 0) {
            disableButton("#btnAwayUndo");
        }

        // only enable the UNDO button for the last match added
        if(last === "H") {
            enableButton("#btnHomeUndo");
            disableButton("#btnAwayUndo");
        }
        else if(last === "A") {
            enableButton("#btnAwayUndo");
            disableButton("#btnHomeUndo");
        }
        else {
            disableButton("#btnHomeUndo");
            disableButton("#btnAwayUndo");
        }
    }

    function disableButton(btn) {
        $(btn).removeClass("active");
        $(btn).css("cursor","auto").css("background-color", "#bdc3c7");
    }

    function enableButton(btn) {
        var btncolor = $(btn).attr("data-buttoncolor");
        $(btn).addClass("active");
        $(btn).css("cursor","pointer").css("background-color", btncolor);
    }

    $("#btnCompleteProxy").click(function() {
        $("#btnComplete").trigger("click");
    });

    $("#btnReleaseProxy").click(function() {
        $("#btnRelease").trigger("click");
    });

    setActiveButtons();

    function changeScore(code, action) {

        var elem = $("#homescore");
        if(code=="A") {
            elem = $("#awayscore");
        }

        var sdata = {
                application_id: "PSTATMOB",
                password: "T6ES7jKSzso6oRl",
                id: $("#Remote_id").val(),
                actioncode: code + action,
                pin: $("#Remote_pin").val(),
                deviceid: $("#Remote_deviceid").val(),
                currhomescore: $("#homescore").text();
                currawayscore: $("#awayscore").text();
            };

console.log(sdata);

        // make change via ajax
        $.ajax({
            url: "/api/remotescorechange",
            timeout: 6000,
            type: "POST",
            dataType: "json",
            data:  sdata,
            success: function (data) {
                $(elem).text(data.newvalue);    //.css("background-color", "white").css("color", code == "H" ? "blue" : "red");
                $("#Remote_resultsequence").val(data.resultsequence);
                updateLast5(data.resultsequence);
            },
            error: function(xmlhttprequest, textstatus, message) {
                // alert(error.responseText);
                if(textstatus == "timeout") {
                    alert("Update action expired, try again");
                }
                else {
                    alert(message);
                }
                return false;
            }
        });

    </script>

<!-- END - CODE REQUIRED WHEN USER CLICKS BROWSERS REFRESH BUTTON -->
    </head>
    <body>
        <div id="SinglesPage" data-role="page" data-cache="false" data-dom-cache="false">

            <div data-role="header" data-position="fixed">
                <table width="100%" style="border:none;border-collapse:collapse;">
                    <tr style="background-color:#005500;">
                        <td class="iconhome singles-page" style="width:50px" data-parentpage="home"></td>
                        <td align="center"><img style="height:30px;padding:4px;" src="/images/logo-new.png" /></td>
                        <td class="iconcog" style="width:50px">
                            <a href="#settingmenuhome" data-rel="popup" class="ui-corner-all ui-btn-inline ui-icon-gear ui-btn-icon-right ui-btn-a"></a>
                            <div data-role="popup" id="settingmenuhome" data-theme="a">
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

                <div id="home-div" class="container" style="margin: 0px auto;">

                    <div style="padding:10px;background-color: black;width:100%;margin-left:auto;margin-right:auto;">

                        <!--
                            $("#compname").text(data.compname);
                            $("#homeplayer").text(data.homeplayer);
                            $("#homescore").text(data.homescore);
                            $("#awayplayer").text(data.awayplayer);
                            $("#awayscore").text(data.awayscore);
                            $("#frames").text(data.frames);
                            $("#Remote_id").text(data.remote.id);
                            $("#Remote_pin").text(data.remote.pin);
                            $("#Remote_deviceid").text(data.remote.deviceid);
                            $("#Remote_maxframes").text(data.remote.frames);
                            $("#Remote_racetomax").text(data.remote.racetomax);
                            $("#Remote_max").text(data.remote.max);
                            $("#Remote_resultsequence").text(data.remote.resultsequence);
                        -->
                        <input type="hidden" name="Remote[id]" id="Remote_id" />                            <!-- $model->drawid -->
                        <input type="hidden" name="Remote[pin]" id="Remote_pin" />                          <!-- $model->remotepin -->
                        <input type="hidden" name="Remote[deviceid]" id="Remote_deviceid" />                <!-- $model->remotedeviceid -->
                        <input type="hidden" name="Remote[maxframes]" id="Remote_maxframes" />              <!-- $maxframes -->
                        <input type="hidden" name="Remote[racetomax]" id="Remote_racetomax" />              <!-- $racetomax -->
                        <input type="hidden" name="Remote[max]" id="Remote_max" />                          <!-- $max -->
                        <input type="hidden" name="Remote[resultsequence]" id="Remote_resultsequence" />    <!-- $model->resultsequence -->

                        <table class="v2_comptable">
                            <tr>
                                <td id="compname" class="v2_comp"></td>
                            </tr>
                        </table>

                        <table class="v2_playertable">
                            <tr>
                                <td id="homeplayer" class="v2_player player_home" style="border-top:1px solid #6699ff;border-left:1px solid #6699ff;"></td>
                                <td id="homescore" class="v2_score player_home" style="border-top:1px solid #6699ff;border-right:1px solid #6699ff;"></td>
                            </tr>
                        </table>

                        <table class="v2_buttontable">
                            <tr data-code="H">
                                <td id="btnHomeWin" class="v2_button button_home button_win active" data-action="W" data-buttoncolor="#1a66ff">Win</td>
                                <td id="btnHomeMaster" class="v2_button button_home button_master active" data-action="M" data-buttoncolor="#1a66ff">Master</td>
                                <td id="btnHomeUndo" class="v2_button button_home button_undo" data-action="U" data-buttoncolor="#1a66ff">Undo</td>
                            </tr>
                        </table>

                        <table class="v2_playertable">
                            <tr>
                                <td id="awayplayer" class="v2_player player_away" style="border-top:1px solid #ff7366;border-left:1px solid #ff7366;"></td>
                                <td id="awayscore" class="v2_score player_away" style="border-top:1px solid #ff7366;border-right:1px solid #ff7366;"></td>
                            </tr>
                        </table>

                        <table class="v2_buttontable">
                            <tr data-code="A">
                                <td id="btnAwayWin" class="v2_button button_away button_win active" data-action="W" data-buttoncolor="#ff2e1a">Win</td>
                                <td id="btnAwayMaster" class="v2_button button_away button_master active" data-action="M" data-buttoncolor="#ff2e1a">Master</td>
                                <td id="btnAwayUndo" class="v2_button button_away button_undo" data-code="A" data-buttoncolor="#ff2e1a">Undo</td>
                            </tr>
                        </table>

                        <table class="last5table">
                            <tr>
                                <td id="frames" colspan="2" class="v2_last5" style="padding:3px;text-align:center;"></td>
                            </tr>
                            <tr>
                                <td class="last5label">Last 5 results:</td>
                                <td class="v2_last5" id="last5" style="width:100%;font-size:20px;"></td>
                            </tr>

                        </table>

                        <table class="v2_navbuttontable">
                            <tr>
                                <td id="btnCompleteProxy" class="v2_navbuttons v2_button_complete" data-buttoncolor="#27ae60">COMPLETE</td>
                                <td id="btnReleaseProxy" class="v2_navbuttons v2_button_release" data-buttoncolor="#9b59b6">RELEASE</td>
                            </tr>
                        </table>

                        <div style="display:none;">
                            <button id="btnComplete" name="btnComplete" type="submit">complete</button>
                            <button id="btnRelease" name="btnRelease" type="submit">release</button>
                        </div>

                    </div>
                </div>
            </div>

            <div class="noty" style="bottom:40px;min-height:0px;width:100%;display:block;position:fixed;"></div>
            <div id="pagefooter" data-role="footer" data-position="fixed" style="background-color:#efefef;">
                <div style="padding:5px;">
                    <table align="center" width="50%">
                        <tr>
                            <td style="cursor:pointer;min-width:20px;height:20px;"></td>
                            <td id="hmfootertext" class="footertext" data-pagename="home" data-appversion="<?php echo $appver; ?>">Brella Tech Pty Ltd</td>
                            <td style="cursor:pointer;min-width:20px;height:20px;"></td>
                        </tr>
                    </table>
                </div>
            </div>

        </div>
    </body>

</html>
