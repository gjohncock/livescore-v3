import '../node_modules/@pwabuilder/pwaupdate';
import '../node_modules/@pwabuilder/pwainstall';

if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('pwab/pwabuilder-sw.js');
	});
}