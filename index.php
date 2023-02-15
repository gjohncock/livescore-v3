<?php /* 2.1.100 */

$version = '2.1.100';

// make api call to poolstat.net.au to confirm version is correct
$dir = dirname(__FILE__).'/';

$domain = pathUrl();
$dompath = "../poolstat.net.au";
$site_dev = false;

if( strpos($domain, 'test.') !== false ) {
    $dompath = "../test.poolstat.net.au";
}
else if( strpos($domain, 'play.') !== false ) {
    $dompath = "../play.poolstat.net.au";
}
else if( strpos($domain, 'lsdev') !== false ) {
    $dompath = '../../poolstat';
    $site_dev = true;
}

$control_version = file_get_contents( $dir . $dompath .'/config/ls-app-version.php' );
if( strcmp($version, $control_version) != 0 ) {
    echo '<p class="ac" style="margin-top: 100px;">App failed version test Step 1: App: '.$version.' = Control: '.$control_version.'</p>';
    die(1);
}

$ext_files = [
    "index.css"     => "css/src/index.css",
    "livescore.css" => "css/src/livescore.css",
    "home.js"       => "jscript/src/home.js",
    "index.js"      => "jscript/src/index.js"
];

$new_files = $ext_files;

if( ! $site_dev )
{
    foreach ($ext_files as $key => $source)
    {
        // check version of file - see if we need to make a new version
        $file_version = fgets(fopen($dir . $source, 'r'));
        $file_version = trim(str_replace(['/', '*'], '', $file_version));

        //    echo '<p>' . $source . ' = ' . $file_version . '</p>';

        if (strcmp($version, $file_version) !== 0) {
            echo '<p class="ac" style="margin-top: 100px;">App failed version test step 2: Source: ' . $source . ' = ' . $file_version . '</p>';
            die(2);
        }

        // create the filename for the new version of the asset
        $newver = str_replace(".", "-v$version.", $source);
        $newver = str_replace("/src/", "/", $newver);

        // check if the versioned file exists
        if (!file_exists($dir . $newver))
        {
            // create the asset
            //        echo '<p>COPY ' . $dir . $source.' TO '.$dir . $newver.'</p>';
            copy($dir . $source, $dir . $newver);
        }

        $new_files[$key] = $newver;
    }
}

function pathUrl($dir = __DIR__){

    $root = "";
    $dir = str_replace('\\', '/', realpath($dir));

    //HTTPS or HTTP
    $root .= !empty($_SERVER['HTTPS']) ? 'https' : 'http';

    //HOST
    $root .= '://' . $_SERVER['HTTP_HOST'];

    //ALIAS
    if(!empty($_SERVER['CONTEXT_PREFIX'])) {
        $root .= $_SERVER['CONTEXT_PREFIX'];
        $root .= substr($dir, strlen($_SERVER[ 'CONTEXT_DOCUMENT_ROOT' ]));
    } else {
        $root .= substr($dir, strlen($_SERVER[ 'DOCUMENT_ROOT' ]));
    }

    $root .= '/';

    return $root;
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="manifest" href="/static/manifest.json">

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-51766463-3"></script>
    <script  type="text/javascript">
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-51766463-3');
    </script>

    <title>LiveScore</title>

    <meta charset="utf-8">
    <META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="mobile-web-app-capable" content="yes">

    <!-- <script src="https://browser.sentry-cdn.com/5.6.3/bundle.min.js" crossorigin="anonymous"></script> -->

    <script type="text/javascript" src="jquery/jquery-1.11.1.js"></script>
    <script type="text/javascript" src="jquery/jquery-ui.min.js"></script>
    <script type="text/javascript" src="jquery/jquery.ui.touch-punch.min.js"></script>

    <script type="text/javascript" src="jquery/jquery.mobile-1.4.5.min.js"></script>
    <script type="text/javascript" src="jquery/moment.js"></script>
    <script type="text/javascript" src="jquery/jquery.modal.min.js"></script>
    <script type="text/javascript" src="jquery/noty-3.1.4/lib/noty.min.js"></script>

    <link rel="stylesheet" href="fonts/Roboto-Condensed/css/fonts.css" type="text/css" />

    <link rel="stylesheet" href="jquery/jquery.mobile-1.4.5.min.css" type="text/css" />
    <link rel="stylesheet" href="jquery/jquery-ui.min.css" type="text/css" />

    <link rel="stylesheet" href="themes/nativeDroid2/css/nativedroid2.css?v=2.1.96" type="text/css" />
    <link rel="stylesheet" href="css/jquery.modal.css" type="text/css" />
    <link rel="stylesheet" href="jquery/noty-3.1.4/lib/noty.css" />
    <link rel="stylesheet" href="jquery/noty-3.1.4/lib/animate.css" />

    <!-- APPLE I-PHONE 4, 4s, 5 -->
    <link href="apple-touch-icon.png" rel="apple-touch-icon" />
    <link href="apple-touch-icon-76x76.png" rel="apple-touch-icon" sizes="76x76" />
    <link href="apple-touch-icon-120x120.png" rel="apple-touch-icon" sizes="120x120" />
    <link href="apple-touch-icon-152x152.png" rel="apple-touch-icon" sizes="152x152" />

    <link rel="stylesheet" href="<?php echo $new_files["index.css"]; ?>" type="text/css" />
    <link rel="stylesheet" href="<?php echo $new_files["livescore.css"]; ?>" type="text/css" />

    <script>

    //Sentry.init({ dsn: 'https://690231ff07f3435aa2ea84bdbeeafd5b@sentry.io/1454683', release: "ls-app@2.1.96" });

    // Log into PoolStat, go to Update Organisation -> API Access tab. Copy Public key and paste here.  If one does not exist, create it.
    var memberApiKey = "";
    // public key
    var memberApiEnv = "";
    // use one of "member_test", "member_play", "member_live", which corresponds to the PoolStat site you are connecting to (and where API Key is stored)
    </script>

    <script type="text/javascript" src="<?php echo $new_files["home.js"]; ?>"></script>
    <script type="text/javascript" src="<?php echo $new_files["index.js"]; ?>"></script>

    <script>
    // var adsbygoogle = {};

      loadgtag('start');

    </script>

    <style>
        .Poolstatnetau_Public_Top {
            width: 320px;
            height: 50px;
            margin-left: auto;
            margin-right: auto;
        }
        @media(min-width: 800px) {
            .Poolstatnetau_Public_Top {
                width: 728px;
                height: 90px;
                margin-left: auto;
                margin-right: auto;
            }
        }
    </style>

</head>
<body>

<div id="IndexPage" data-role="page" data-cache="false" data-dom-cache="false">

    <div data-role="header" data-position="fixed">
        <table width="100%" style="border:none;border-collapse:collapse;">
            <tr class="header-sect">
                <td class="iconrefresh" style="width:50px"><a href="#" class="ui-btn-inline ui-icon-refresh ui-corner-all ui-btn-icon-left"></a></td>
                <td align="center"><img class="header-logo" src="/images/logo-new.png" /></td>
                <td class="iconcog" style="width:50px;">
                    <a id="pmenu_index" href="#" class="ui-btn-inline ui-corner-all ui-icon-bars ui-btn-icon-right"></a>
                </td>
            </tr>
        </table>
    </div>

    <div data-role="content">

        <div data-role="panel" id="index_pmenu" class="panelmenu" data-display="overlay" data-position="right" data-position-fixed="true">
            <h3>Options</h3>
            <ul data-role="listview">
                <li><a id="sitestatus" href="#">Status</a></li>
                <li><a id="adminloginall" href="#">Admin Login</a></li>
                <li><a id="reloadsite" href="#">Reload Site</a></li>
                <li><a id="logoff" class="logoff" href="#">Log Off</a></li>
            </ul>
        </div>

        <div class="ps-ad-container hidden" id="PS_INDEX_TOP_CONTAINER">

        </div>

        <div id="lslogindiv" class="lslogin login hidden"><a href="#" class="button4 login">Team Login</a></div>
        <div id="lslogindiv2" class="lslogin return hidden"><a href="#" class="button4 return">Return to Livescoring</a></div>

        <div id="loadingapp" style="text-align:center;margin-top:100px;">Loading, please wait...</div>

        <div id="home-div" class="container" style="margin: 0px auto;">

<!-- START - CUSTOM INSTALL: SPONSOR INFO -->
<div id="sponsor-content">
    <!-- INSERT SPONSOR HTML HERE -->
    <style scoped>
        /* INSERT SPONSOR CSS HERE */
    </style>
    <script>
        /* INSERT SPONSOR JAVASCRIPT HERE */
    </script>
</div>
<!-- END - CUSTOM INSTALL: SPONSOR INFO -->

            <div class="social-icons">
                <a href="https://www.facebook.com/poolstat.net.au" target="_blank"><img src="images/facebook-logo-2428.svg"></a>
                <a href="https://twitter.com/PoolStatNet" target="_blank"><img src="images/twitter-square-blue-logo-15977.svg"></a>
            </div>

            <div data-role="collapsible-set" id="activematchset" data-collapsed="true"></div>

        </div>

    </div>

    <div class="ps-ad-container hidden" id="PS_INDEX_BOTTOM_CONTAINER">

    </div>

    <div id="pagefooter" data-role="footer" data-position="fixed" style="background-color:#efefef;">
        <div style="padding:5px;">
            <table align="center" width="50%">
                <tr>
                    <td style="cursor:pointer;min-width:20px;height:20px;"></td>
                    <td id="dxfootertext" class="footertext" data-pagename="index" data-appversion="2.1.100">Brella Tech Pty Ltd</td>
                    <td style="cursor:pointer;min-width:20px;height:20px;"></td>
                </tr>
            </table>
        </div>
    </div>

    <script>
        if(myJWT.current === 0) {
//            loadAdsenseAds('INDEX','ad');
        }
        else {
            console.log("ADSENSE INGORED!");
        }
    </script>
</div>

</body>

</html>
