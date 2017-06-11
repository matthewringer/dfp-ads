/**
 * Javascript for Google Ads
 *
 **/

var dfp_ads =  (function() {

	// Object from Ajax
	var dfp_ad_data = dfp_ad_object[0],
		acct_id = dfp_ad_data.account_id;

	/**
	 * Check if mobile device.
	 */
	function isMobileDevice() {
		return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
	}

	/**
	 * Loads Ad Position
	 *
	 * @param {Object} position - Array of ad positions
	 */
	function define_ad_slot(position) {

		var slot = googletag.defineSlot(
			acct_id + position.ad_name,
			position.sizes,
			position.position_tag
		);

		if(position.size_mapping !== undefined && position.size_mapping !== null) {
			var mapping = JSON.parse(position.size_mapping);
			slot.defineSizeMapping(mapping);
			if( false === isMobileDevice()) { // Don't resize on mobile touch events cause ad flicker...
				var resizeTimer;
				var startWidth;
				$(window).resize({size_mapping: mapping, ad_slot: slot}, function(e){
					if (resizeTimer) {
						clearTimeout(resizeTimer);   // clear any previous pending timer
					} else {
						startWidth = window.innerWidth;
					}
					resizeTimer = setTimeout(function() {
						var resizeRange = [startWidth, window.innerWidth];
						resizeRange.sort(function(a, b) {return a - b;});
						e.data.size_mapping.forEach(function(size) {
							var width = size[0][0];
							if( width > resizeRange[0] && width < resizeRange[1]) {
								googletag.pubads().refresh([e.data.ad_slot]);
								startWidth = null;
								resizeTimer = null;
								return;
							}
						}, this);
					}, 500);
				});
			}
		}

		slot.addService(googletag.pubads());

		if (position.out_of_page === true) {
			googletag.defineOutOfPageSlot(
				acct_id + position.ad_name,
				position.position_tag + '-oop'
			).addService(googletag.pubads());
		}

		return slot;
	}

	/** 
	 * Create a new ad position based using the ad unit info as a template.
	 * 
	 * @param {string} id - div id of the ad postion wrapper
	*/
	function display_ad_position(id){
			'use strict';
			var ad_slot = document.querySelector('#'+id);
			var ad_pos = ad_slot.dataset.adpos;
			var pos_template = dfp_ad_data.positions.find(function(p){return p.position_tag === ad_pos;});
			var new_pos = Object.create(pos_template);
			new_pos.position_tag = id;
			var position = define_ad_slot(new_pos);
			googletag.pubads().refresh(position);
			googletag.display(id);
	}

	/**
	 * Sets Page level targeting
	 * @param {object} targeting
	 */
	function set_targeting(targeting) {
		for (var target in targeting) {
			var key = target.toLowerCase();
			googletag.pubads().setTargeting(key, targeting[target]);
		}
	}

	return { 'display_ad_position' : display_ad_position };
}());

/**
 * Ad Position Creation
 */
googletag.cmd.push(function () {
	// Object from Ajax
	var dfp_ad_data = dfp_ad_object[0],
		acct_id = dfp_ad_data.account_id;
	
	// Asynchronous Loading
	if (dfp_ad_data.asynch === true) {
		googletag.pubads().enableAsyncRendering();
	}
	// Go
	googletag.enableServices();
});
