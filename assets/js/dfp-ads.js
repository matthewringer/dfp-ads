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
   * 
   * @param {string} id - div id of the ad postion wrapper
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
   * @param {Object} position - Array of ad positions
   */
  function define_ad_slot(position) {

    let slot = googletag.defineSlot(
      acct_id + position.ad_name,
      position.sizes,
      position.position_tag
    );

    if(position.size_mapping !== undefined && position.size_mapping !== null) {
      let mapping = JSON.parse(position.size_mapping);
      //console.log( mapping );
      // let mapping = googletag.sizeMapping().
      // addSize([970, 0], [970, 250]).
      // addSize([0, 0], [300, 250]).
      // build();

      slot.defineSizeMapping(mapping);
      
      //addSize([1024, 768], [970, 250]).
      //addSize([0, 0], [970, 250]).

      $(window).resize({ad_slot: slot}, function(e){
        console.log('resized');
        console.log(e.data);
        googletag.pubads().refresh([e.data.ad_slot])
      });
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
