/**
 * Javascript for Google Ads
 *
 **/
/**
 * Ad Position Creation
 */
googletag.cmd.push(function () {
  // Object from Ajax
  var dfp_ad_data = dfp_ad_object[0],
    acct_id = dfp_ad_data.account_id;

  /**
   * Loads Ad Position
   *
   * @param {Array} positions - Array of ad positions
   */
  function load_ad_positions(positions) {
    var ad_pos, len;
    let slots = [];
    // Run through positions
    for (ad_pos = 0, len = positions.length; ad_pos < len; ++ad_pos) {
      slots.push( define_ad_slot(positions[ad_pos]) );
    }
    //Listen for resize
    window.addEventListener("resize", ()=> { var resizeTimer; clearTimeout(resizeTimer); resizeTimer = setTimeout( () => googletag.pubads().refresh(slots) , 250); });

  }

  /**
   * Loads Ad Position
   *
   * @param {Object} position - Array of ad positions
   */
  function define_ad_slot(position) {

    //todo: not sure how siteMaps effect OOPS
    let slot = googletag.defineSlot(
      acct_id + position.ad_name,
      position.sizes,
      position.position_tag
    );
    
    if(position.size_mapping !== undefined) {
      //let sizeMap = define_size_mapping(position.size_mapping);
      slot.defineSizeMapping(position.size_mapping);
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
   * Define sizemapping
   * @param sizes 728x90, 320x50
   * TODO: hardcoded
   */
  function define_size_mapping(size_mapping) {
      var sizeMapping = googletag.sizeMapping();
      size_mapping.forEach( (m) => {
        sizeMapping.addSize(m[0], m[1]);
        //sizeMapping.addSize([980, 690], [728, 90]);
      });
      var retval = sizeMapping.build();
      console.log(retval);
      return retval;
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

  // Generates Ad Slots
  load_ad_positions(dfp_ad_data.positions);
  // Collapse Empty Divs
  googletag.pubads().collapseEmptyDivs(true);
  // Targeting
  set_targeting(dfp_ad_data.page_targeting);
  // Asynchronous Loading
  if (dfp_ad_data.asynch === true) {
    googletag.pubads().enableAsyncRendering();
  }
  // Go
  googletag.enableServices();
});
