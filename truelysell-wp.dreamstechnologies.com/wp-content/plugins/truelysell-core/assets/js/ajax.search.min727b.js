/* ----------------- Start Document ----------------- */
(function($){
"use strict";

$(document).ready(function(){ 

	if($('#truelysell_core-search-form').hasClass('ajax-search')){
		$('.fullwidth-filters ').addClass('ajax-search');
	}
	$( '#truelysell-listings-container' ).on( 'update_results', function ( event, page, append, loading_previous ) {
		var results      = $('#truelysell-listings-container');
		
		var filter 			= $('#truelysell_core-search-form');
		var data 			= filter.serializeArray();
		var style 			= results.data( 'style' );
		var grid_columns 	= results.data( 'grid_columns' );
		var tax_region	 	= results.data( 'region' );
		var tax_category	= results.data( 'category' );
		var tax_service_category	= results.data( 'service-category' );
		var tax_rental_category	= results.data( 'rental-category' );
		var tax_event_category	= results.data( 'event-category' );
		
		var tax_feature	 	= results.data( 'feature' );
		var per_page 		= results.data( 'per_page' );
		var custom_class 	= results.data( 'custom_class' );
		var order 	= results.data( 'orderby' );


		data.push({name: 'action', value: 'truelysell_get_listings'});
		data.push({name: 'page', value: page});
		data.push({name: 'style', value: style});
		data.push({name: 'grid_columns', value: grid_columns});
		data.push({name: 'per_page', value: per_page});
		data.push({name: 'custom_class', value: custom_class});
		data.push({name: 'order', value: order});

		var has_listing_category_search = false;
		var has_service_category_search = false;
		var has_rental_category_search = false;
		var has_event_category_search = false;
		var has_listing_feature_search = false;
		var has_region_search = false;

		$.each(data, function(i, v) {
			console.log();
	        if (v.name.substring(0, 15) == 'tax-listing_cat' ) {
	            if(v.value){ has_listing_category_search = true; }
	        }
	        if (v.name.substring(0, 15) == 'tax-listing_cat' ) {
	            if(v.value){ has_listing_category_search = true; }
	        }

	        if ( v.name.substring(0, 15) == 'tax-listing_fea' ) {
	            if(v.value){ has_listing_feature_search = true; }
	        }
	        if (v.name.substring(0, 9) == 'tax-regio' ) {
	            if(v.value){ has_region_search = true; }
	        }
	    });
		if(!has_region_search) {	if(tax_region) { data.push({name: 'tax-region', value: tax_region}); } };
		if(!has_listing_category_search) { if(tax_category) { data.push({name: 'tax-listing_category', value: tax_category}); } };
		if(!has_listing_feature_search) { if(tax_feature) { data.push({name: 'tax-listing_feature', value: tax_feature}); } };
		if(!has_rental_category_search) { if(tax_rental_category) { data.push({name: 'tax-rental_category', value: tax_rental_category}); } };
		if(!has_event_category_search) { if(tax_event_category) { data.push({name: 'tax-event_category', value: tax_event_category}); } };
		if(!has_service_category_search) { if(tax_service_category) { data.push({name: 'tax-service_category', value: tax_service_category}); } };

		$.ajax({
         	type 		: "post",
	        dataType 	: "json",
	        url 		: truelysell_core.ajax_url,
	        data 		: data,
			beforeSend:function(xhr){
				results.addClass('loading');
			},
			success:function(data){
				
				results.removeClass('loading');
				$( results ).html( data.html );	
				$( 'div.pagination-container' ).html( data.pagination );
				$('.numerical-rating').numericalRating();	
				$('.star-rating').starRating();	
				$( '#truelysell-listings-container' ).triggerHandler('update_results_success');
				if(truelysell_core.map_provider == 'google'){
					var map =  document.getElementById('map');
	    			if (typeof(map) != 'undefined' && map != null) {
					}
				}
				
			}
		});
	});
	$(document).on( 'change', '.sort-by-select .orderby, #truelysell_core-search-form.ajax-search select, .ajax-search input:not(#location_search,#_price_range,.bootstrap-range-slider)', function(e) { 
		console.log('change test');
		var target   = $('div#truelysell-listings-container' );
		target.triggerHandler( 'update_results', [ 1, false ] );
	} ).on( 'keyup', function(e) {
		
		if ( e.which === 13 ) {
			e.preventDefault();
			$( this ).trigger( 'change' );
		}
	});
	$('.bootstrap-range-slider').on('slideStop', function () {
		var target   = $('div#truelysell-listings-container' );
		target.triggerHandler( 'update_results', [ 1, false ] );
	});

	if($('#truelysell_core-search-form:not(.main-search-form)').length) {
		
		document.getElementById("truelysell_core-search-form").onkeypress = function(e) {
		  var key = e.charCode || e.keyCode || 0;     
		  if (key == 13) {
		  	if ($('#location_search:focus').length){ return false; }
		    var target   = $('div#truelysell-listings-container' );
			target.triggerHandler( 'update_results', [ 1, false ] );
		    e.preventDefault();
		  }
		}
	}
	
	

	$(document).on('click', 'span.panel-disable,.slider-disable', function(e) {
		var results      = $('#truelysell-listings-container');
		results.triggerHandler( 'update_results', [ 1, false ] );
	});

	
	$( 'div.pagination-container.ajax-search').on( 'click', 'a', function(e) {
		e.preventDefault();
		var results      = $('#truelysell-listings-container');
		var filter = $('#truelysell_core-search-form');
		var page   = $(this).parent().data('paged');
		console.log(page);
		if(page=='next'){
			var page = $('.pagination li.current').data('paged') + 1
		}
		if(page=='prev'){
			var page = $('.pagination li.current').data('paged') - 1
		}
		results.triggerHandler( 'update_results', [ page, false ] );

		$( 'body, html' ).animate({
			scrollTop: $('.fs-inner-container .search,#titlebar, .ajax-search,.breadcrumb-bar,#map-container').offset().top
		}, 600 );

		return false;
	} );

	var init_layout = $( '#truelysell-listings-container' ).data('style');

	if(init_layout == 'list') {
		$('.layout-switcher a').removeClass('active');
		$('.layout-switcher a.list').addClass('active');
	} else {
		$('.layout-switcher a:not(.list)').addClass('active');
	}


	$('.tax-listing_category #tax-listing_category').on('change',function(e) {
			var label = $(this).find(":selected").html();
			$('.page-title').html(label);
	});


	$('.layout-switcher').on('click', 'a', function(e) {
		e.preventDefault();
		$('.layout-switcher a').removeClass('active');
		$(this).addClass('active');
		var layout = $(this).data('layout');
		var results = $('#truelysell-listings-container');
		results.data('style',layout);
		var page   = 1;
		results.triggerHandler( 'update_results', [ page, false ] );
	});
// ------------------ End Document ------------------ //
});

})(this.jQuery);
/**/