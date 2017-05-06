/**
 * Javascript for Google Ads
 *
 **/

var dfp_ads = function() {

  // Object from Ajax
  var dfp_ad_data = dfp_ad_object[0],
    acct_id = dfp_ad_data.account_id;

  /** 
   * Create a new ad position based using the ad unit info as a template.
  */
  function display_ad_position(id){
      let ad_slot = document.querySelector(`#${id}`);
      let ad_pos = ad_slot.dataset['adpos'];
      let pos_template = dfp_ad_data.positions.find(p=>p.position_tag == ad_pos);
      let new_pos = Object.create(pos_template);
      new_pos.position_tag = id;
      let position = define_ad_slot(new_pos);
      googletag.pubads().refresh(position);
      googletag.display(id);
  };

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
      define_ad_slot(positions[ad_pos]);
    }
  }

  /**
   * Loads Ad Position
   *
   * @param {Object} position - Array of ad positions
   */
  function define_ad_slot(position) {

    let slot = googletag.defineSlot(
      acct_id + position.ad_name,
      position.sizes,
      position.position_tag
    );

    if(position.size_mapping !== undefined) {
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
  //load_ad_positions(dfp_ad_data.positions);

  return { 'display_ad_position' : display_ad_position };
} ();

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
