<?php
/**
 * Class for Ad Positions
 *
 * Holds data for an ad position.
 *
 * @link       http://www.chriwgerber.com/dfp-ads/
 * @since      0.0.1
 *
 * @package    WordPress
 * @subpackage DFP-Ads
 */
namespace DFP_Ads;

class Position {

	/**
	 * ID of the CPT
	 *
	 * @access public
	 * @since  0.0.1
	 *
	 * @var int
	 */
	public $post_id;

	/**
	 * Title of the position
	 *
	 * @access public
	 * @since  0.0.1
	 *
	 * @var string
	 */
	public $title;

	/**
	 * Name of the Ad Slot
	 * Ex. SNG_ROS_Leaderboard
	 *
	 * @access public
	 * @since  0.0.1
	 *
	 * @var string
	 */
	public $ad_name;

	/**
	 * Div ID of the ad position
	 * Ex. div-gpt-ad-1375829763909
	 *
	 * @access public
	 * @since  0.0.1
	 *
	 * @var string
	 */
	public $position_tag;

	/**
	 * Ad sizes. Slot with multiple sizes needs to be nested.
	 * Ex. [728, 90] or [ [728, 90], [970, 90] ]
	 *
	 * @access public
	 * @since  0.0.1
	 *
	 * @var array
	 */
	public $sizes = array();

	/**
	 * Ad size mapping. Maps device browser sizes to ad size.
	 * Ex. [ [[1024, 768],[970, 250]], [[980, 690],[728, 90]] ]
	 *
	 * @access public
	 * @since  0.0.1
	 *
	 * @var array
	 */
	public $size_mapping = array();

	/**
	 * Defines whether the slot should include Out of Page position
	 *
	 * @access public
	 * @since  0.0.1
	 *
	 * @var bool
	 */
	public $out_of_page = false;

	/**
	 * Defines targeting for the ad slot
	 *
	 * Targeting should be defined as an array of key => value pairs
	 *
	 * @access public
	 * @since  0.0.1
	 *
	 * @var array
	 */
	public $targeting = array();

	/**
	 * The class to add to the ad position.
	 *
	 * @since
	 * @access private
	 *
	 * @var string
	 */
	private $position_class = 'dfp_ad_pos';

	/**
	 * The sequence number of the ad position.
	 * @since
	 * 
	 * @var int
	 */
	 private $seq = 0;

	/**
	 * PHP5 Constructor
	 *
	 * Constructs the object using the information provided by default in every installation. Values
	 * will come from CPT meta data.
	 *
	 * @access public
	 * @since  0.0.1
	 *
	 * @param $id int|null Post ID to grab the post object and create the position
	 */
	public function __construct( $id = null ) {

		/**
		 * @param $position WP_Post
		 */
		if (
			(
				$id !== null &&
				$position = get_post( $id )
			) &&
			$position->post_type === 'dfp_ads'
		) {
			$meta               = get_post_meta( $position->ID );
			$this->post_id      = $id;
			$this->title        = $position->post_title;
			$this->ad_name      = $meta['dfp_ad_code'][0];
			$this->position_tag = strtolower( 'Ad_Pos_' . $this->ad_name );
			$this->sizes        = dfp_get_ad_sizes( $meta['dfp_position_sizes'][0] );
			$this->size_mapping = $meta['dfp_position_size_mapping'];
			$this->out_of_page  = ( isset( $meta['dfp_out_of_page'][0] ) ? true : false );
		}
	}

	/**
	 * Echo out the ad position
	 *
	 * Takes the HTML generated by DFP_Ad_Position::get_position and echoes it out
	 * to the browser.
	 *
	 * @access public
	 * @since  0.0.1
	 *
	 * @return void
	 */
	public function display_position() {
		echo $this->get_position();
	}

	/**
	 * Generates HTML to display position
	 *
	 * Useful when trying to get the HTML data back to run through a shortcode or
	 * if trying to wrap it in more html.
	 *
	 * @access public
	 * @since  0.3.0
	 *
	 * @return string HTML string that contains ad position
	 */
	public function get_position($unique=null) {

		if( !isset($unique) ) {
			$time    = microtime(true);
			$mSecs   =  $time - floor($time);
			$unique   =  str_replace('.','', substr($mSecs,1));
		}

		ob_start();
		$this->create_position($unique);
		$position_html = ob_get_contents();
		ob_end_clean();

		return $position_html;
	}

	/**
	 * The Ad Position.
	 *
	 * This is a nasty, ugly way of storing HTML. But it works, so I'm going to use
	 * it for now. In the future, it can be updated to return HTML that is used by
	 * other functions.
	 *
	 * @since  0.3.0
	 * @access private
	 *
	 * @return mixed
	 */
	private function create_position($unique) {

		$position_tag = $this->position_tag.'-'.$unique;

		printf( __( '<!-- %1s -->', 'dfp-ads' ), $this->ad_name );
		?>
		<div id="<?php _e( $position_tag, 'dfp-ads' ); ?>" class="<?php _e( $this->position_tag, 'dfp-ads' ); ?> <?php _e( $this->ad_name, 'dfp-ads' ); ?> <?php _e( $this->position_class, 'dfp-ads' ); ?>" data-adpos = "<?php _e( $position_tag, 'dfp-ads' ); ?>">
			<script type='text/javascript'>
				googletag.cmd.push(function () {
					dfp_ads.display_ad_position('<?php _e( $position_tag, 'dfp-ads'); ?>');
				});
			</script>
		</div>
		<?php
	}

}
