	/* ----------------- Start Document ----------------- */
 


  
(function($){
"use strict";


$(document).ready(function(){ 
  var forms = document.querySelectorAll('.needs-validationlogin')
  var loginbtn = document.getElementById("loginbtn");
  Array.prototype.slice.call(forms)
    .forEach(function (forms) {
      loginbtn.addEventListener('click', function (event) {
      if (!forms.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
      }
      forms.classList.add('was-validated')
    }, false)
    })
  });

  $(document).ready(function(){ 
    var forms = document.querySelectorAll('.needs-validationregister')
    var regbtn = document.getElementById("regbtn");
    Array.prototype.slice.call(forms)
      .forEach(function (forms) {
        regbtn.addEventListener('click', function (event) {
        if (!forms.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
        }
        forms.classList.add('was-validated')
      }, false)
      })
    });


$(document).ready(function(){ 


  $('.truelysell_core-dashboard-action-delete').click(function(e) {
        e.preventDefault();
        if (window.confirm(truelysell_core.areyousure)) {
            location.href = this.href;
        }
    });

  $('body').on('click', ".truelysell_core-bookmark-it", function(e){

      e.preventDefault();
      if($(this).is('.clicked,.liked')){
      	return;
      }
    	$(this).addClass('clicked');


      var post_id 	= $(this).data("post_id"),
      handler 		= $(this),
      nonce 			= $(this).data("nonce"),
      addedtolist 	= $(this).data("saved-title")

      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: truelysell.ajaxurl,
         data 	: {
          action: "truelysell_core_bookmark_this", 
          post_id : post_id, 
          nonce: nonce
        },
         success	: function(response) {
            if(response.type == "success") {
               handler.removeClass('truelysell_core-bookmark-it').addClass('liked').addClass('truelysell_core-unbookmark-it').removeClass('clicked');
               var confirmed = handler.data('confirm');
               handler.children('.like-icon').addClass('liked').removeClass('clicked').parent().html('<span class="like-icon"></span> <i class="feather-heart me-2"></i> '+confirmed);
          	   
            }
            else {
               
               handler.removeClass('clicked');
               handler.children('.like-icon').removeClass('liked');
            }
         }
      })   
  });


  


  $(".truelysell_core-unbookmark-it").on('click', function(e){
      e.preventDefault();
      var handler = $(this);
      var post_id = $(this).data("post_id");
      var nonce = $(this).data("nonce");
      handler.closest('li').addClass('opacity-05');
      $.ajax({
          type: 'POST',
          dataType: 'json',
          url: truelysell.ajaxurl,
          data 	: {action: "truelysell_core_unbookmark_this", post_id : post_id, nonce: nonce},
          success	: function(response) {
            if(response.type == "success") {
                handler.closest('li').fadeOut();
                handler.removeClass('clicked');
                handler.removeClass('liked');
                handler.children('.feather-heart').removeClass('liked');
            }
            else {
               
               handler.closest('li').removeClass('opacity-05');
            }
         }
      })   
  });

  // Choose listing type step
  $(".add-listing-section.type-selection a").on('click', function(e) {
      e.preventDefault();
      var type = $(this).data('type');
      $("#listing_type").val(type);
      $("#submit-listing-form").submit();
  });

  $(".add-listing-section.type-selection a").on('click', function(e) {
      e.preventDefault();
      var type = $(this).data('type');
      $("#listing_type").val(type);
      $("#submit-listing-form").submit();
  });

  
  var elements = document.querySelectorAll('input,select,textarea');

  for (var i = elements.length; i--;) {
      elements[i].addEventListener('invalid', function () {
          this.scrollIntoView(false);
      });
  }

  
  $('.add-listing-section.availability_calendar').on("click", 'span.calendar-day-date', function(e) { 
      e.preventDefault();
      var td = $(this).parent();
      var timestamp = td.data('timestamp');
      var date = td.data('date');
      var $el = $(".truelysell-calendar-avail");

      if(td.hasClass('not_active')){
          td.removeClass('not_active');
          var current_dates = $el.val();
          current_dates = current_dates.replace(date + "|","");
          $el.val(current_dates);
      } else {
         td.addClass('not_active');
         $el.val( $el.val() + date + "|");
      }
      
      
  });

  $('.add-listing-section.availability_calendar').on("click", 'button', function(e) { 
    e.preventDefault();
      var td = $(this).parent().parent();
      var timestamp = td.data('timestamp');
      var date = td.data('date');
      var $el = $(".truelysell-calendar-avail");
      var current_price = $(this).prev('span').text();
   
      var price = (function ask() {        
        var n = prompt(truelysell_core.prompt_price);
        if (n === null) {
         return n;
        } else if ( n === '' ) {
          return current_price;
        }
         else {
          return isNaN(n) ? ask() : n;  
        }
        
      }());
      var json = {};
      var reg_price;
      if(td.hasClass('weekend')){
        reg_price = $('#_weekday_price').val();
      } else {
        reg_price = $('#_normal_price').val();
      }
      if (price != null && price != reg_price) {
        $(this).parent().find('span').html(price);
          var current_value = $(".truelysell-calendar-price").val();
          if(current_value) {
            var json = jQuery.parseJSON($(".truelysell-calendar-price").val());  
          }
          json[date] = price;
          var stringit = JSON.stringify(json);
          $(".truelysell-calendar-price").val(stringit);
      }
      if(price== reg_price){
          $(this).parent().find('span').html(price);
          var current_value = $(".truelysell-calendar-price").val();
          if(current_value) {
            var json = jQuery.parseJSON($(".truelysell-calendar-price").val());  
          }
          delete json[date];
          var stringit = JSON.stringify(json);
          $(".truelysell-calendar-price").val(stringit);
      }

  });

  $('#_normal_price').on('input', function(e) {
      e.preventDefault();
      var price = $(this).val();
      $('.truelysell-calendar-day:not(.weekend) .calendar-price span').html(price);
      submit_calendar_update_price();
  });

  $('#_weekend_price,#_weekday_price').on('input', function(e) {
      e.preventDefault();
      var price = $(this).val();
      $('.truelysell-calendar-day.weekend .calendar-price span').html(price);
      submit_calendar_update_price();
  
  });


  $('.add-listing-section.availability_calendar').on("click", '.prev', function(event) { 
      var month =  $(this).data("prev-month");
      var year =  $(this).data("prev-year");
      getCalendar(month,year);
  });
  $('.add-listing-section.availability_calendar').on("click", '.next', function(event) { 
      var month =  $(this).data("next-month");
      var year =  $(this).data("next-year");
      getCalendar(month,year);
  });
  $('.add-listing-section.availability_calendar').on("blur", '#currentYear', function(event) { 
      var month =  $('#currentMonth').text();
      var year = $('#currentYear').text();
      getCalendar(month,year);
  });

  function getCalendar(month,year){
     $.ajax({
         type   : "post",
         dataType : "json",
         url    : truelysell_core.ajax_url,
         data   : { action: "truelysell_core_calendar", month : month, year: year},
         success  : function(data) {
            $("#truelysell-calendar-outer").html(data.response);  
             var _normal_price = $('#_normal_price').val();
  $('.truelysell-calendar-day:not(.weekend) .calendar-price span').html(_normal_price);
  var _weekend_price = $('#_weekday_price').val();
   $('.truelysell-calendar-day.weekend .calendar-price span').html(_weekend_price);
            submit_calendar_update_price();
            submit_calendar_update_unav_days();
         }
      })   
  }

  function submit_calendar_update_unav_days(){
      var days = $(".truelysell-calendar-avail").val();
      if(days){
        var array = days.split("|");
        
        $.each( array, function( key, day ) {
          if( day ) {
            $("td.truelysell-calendar-day[data-date='" + day +"']").addClass('not_active');
          }
        });
      }
      
  }

  function submit_calendar_update_price(){
      var prices = $(".truelysell-calendar-price").val();
      if(prices){
         var obj = JSON.parse(prices);
      
      $.each( obj, function( day, price ) {
        if( day ) {
          $("td.truelysell-calendar-day[data-date='" + day +"'] .calendar-price span").text(price);
        }
      });
      }
     
  }
  var _normal_price = $('#_normal_price').val();
  $('.truelysell-calendar-day:not(.weekend) .calendar-price span').html(_normal_price);
  var _weekend_price = $('#_weekday_price').val();
   $('.truelysell-calendar-day.weekend .calendar-price span').html(_weekend_price);
  submit_calendar_update_price();
  submit_calendar_update_unav_days();

    // send slots in json
    var slot_container = 0;
    var slots = new Array();

    $( "#submit-listing-form" ).submit(function( e ) {
        $( ".slots-container" ).each( function() {
            var inside_slots = new Array();
            var slot_number = 0;
           $( this ).find( '.single-slot-time' ).each( function(slot_time) {
                inside_slots[slot_number] = $( this ).text() + '|' + $( this ).parent().parent().find('#slot-qty').val();
                slot_number++;
           });
           slots[slot_container] = inside_slots;
           slot_container++;
        });
        $( '#_slots' ).val(JSON.stringify(slots));
    });


  $('#truelysell-activities-list a.close-list-item').on('click',function(e) {
        var $this = $(this),
        id = $(this).data('id'),
        nonce = $(this).data('nonce');
       
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: truelysell.ajaxurl,
            data: { 
                'action': 'remove_activity', 
                'id': id,
                'nonce': nonce
               },
            success: function(data){
              
                if (data.success == true){
                  $this.parent().addClass('wait').fadeOut( "normal", function() {
                    $this.remove();
                  });
                } else {
                                      
                }

            }
        });
        e.preventDefault();
    });



    $('.notify-blk.notifications').on({
      "click":function(e) {
          e.stopPropagation();
       }
   });

    $('#dashboard_notification_list a.close-notilist-item').on('click',function(e) {
      var $this = $(this),
      id = $(this).data('id'),
      nonce = $(this).data('nonce');
     
      $.ajax({
          type: 'POST',
          dataType: 'json',
          url: truelysell.ajaxurl,
          data: { 
              'action': 'remove_notification', 
              'id': id,
              'nonce': nonce
             },
          success: function(data){
            
              if (data.success == true){
                $this.closest("li.notification-message").addClass('wait').fadeOut( "normal", function() {
                  $this.remove();
                });
              } else {
                                    
              }

          }
      });
      e.preventDefault();
  });

  $('#dashboard_notification_list_all a.close-deletetilist-item').on('click',function(e) {
    var $this = $(this),
    id = $(this).data('deid'),
    nonce = $(this).data('nonce');
   
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: truelysell.ajaxurl,
        data: { 
            'action': 'delete_notification', 
            'deid': id,
            'nonce': nonce
           },
        success: function(data){
          
            if (data.success == true){
                $this.closest("li.notification-message").addClass('wait').fadeOut( "normal", function() {
                $this.remove();
              });
            } else {
                                  
            }

        }
    });
    e.preventDefault();
});


    $('#truelysell-clear-activities').on('click',function(e) {
        var $this = $(this),
        nonce = $(this).data('nonce');
       
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: truelysell.ajaxurl,
            data: { 
                'action': 'remove_all_activities', 
                'nonce': nonce
               },
            success: function(data){
              
                if (data.success == true){

                  $this.closest("li.notification-message").addClass('wait').fadeOut( "normal", function() {
                    $this.remove();
                  });
                  
                  $('ul#dashboard_notification_list li.notification-message').remove();
                  $('li.cleared').show();
                 } else {
                                      
                }

            }
        });
        e.preventDefault();
    });

    $('#truelysell-clear-notification').on('click',function(e) {
      var $this = $(this),
      nonce = $(this).data('nonce');
     
      $.ajax({
          type: 'POST',
          dataType: 'json',
          url: truelysell.ajaxurl,
          data: { 
              'action': 'clearall_notification', 
              'nonce': nonce
             },
          success: function(data){
            
              if (data.success == true){
                $('ul#truelysell-activities-list li:not(.cleared)').remove();
                
                $this.parent().parent().find("li.notification-message").remove();

                $('li.cleared').show();
                
                ///$this.parent().parent().find('.pagination-container').remove();
              } else {
                                    
              }

          }
      });
      e.preventDefault();
  });

    $('select#sort-reviews-by').on('change',function(e) {
       var button = $(this);
       button.parents('.dashboard-list-box').addClass('loading');
       var page = button.find('#reviews_list_visitors').data('page');
       var post_id = $(this).val();
       $.ajax({
            type: 'POST', dataType: 'json',
            url: truelysell.ajaxurl,
            data: { 
                'action': 'reload_reviews', 
                'id': post_id,
                'page': page
               },
            success: function(data){
                button.parents('.dashboard-list-box').removeClass('loading');
                if (data.success == true){
                    $('#reviews_list_visitors').html(data.comments);
                    $('#visitor-reviews-pagination').html(data.pagination);
                     $('.popup-with-zoom-anim').magnificPopup({
                       type: 'inline',

                       fixedContentPos: false,
                       fixedBgPos: true,

                       overflowY: 'auto',

                       closeBtnInside: true,
                       preloader: false,

                       midClick: true,
                       removalDelay: 300,
                       mainClass: 'my-mfp-zoom-in'
                    });
                } else {
                    console.log('error');                    
                }

            }
        });
        e.preventDefault();
     });

    
    $('#visitor-reviews-pagination').on('click','a', function(e){
      
        var page = $(this).parent().data('paged');
        var post_id = $('#sort-reviews-by').val();
        $('.reviews-visitior-box').addClass('loading');
         $.ajax({
            type: 'POST', dataType: 'json',
            url: truelysell.ajaxurl,
            data: { 
                'action': 'reload_reviews', 
                'id': post_id,
                'page': page,
               
               },
            success: function(data){
                 $('.reviews-visitior-box').removeClass('loading');
                if (data.success == true){
                    $('#reviews_list_visitors').html(data.comments);
                    $('#visitor-reviews-pagination').html(data.pagination);
                     $('.popup-with-zoom-anim').magnificPopup({
                       type: 'inline',

                       fixedContentPos: false,
                       fixedBgPos: true,

                       overflowY: 'auto',

                       closeBtnInside: true,
                       preloader: false,

                       midClick: true,
                       removalDelay: 300,
                       mainClass: 'my-mfp-zoom-in'
                    });
                } else {
                    console.log('error');                                       
                }

            }
        });
        e.preventDefault();
    });


    
    $('.reviews-visitior-box').on('click','.reply-to-review-link', function(e){
        $('#comment_reply').val();
        var post_id = $(this).data('postid');
        var review_id = $(this).data('replyid');

        $('#send-comment-reply input#reply-post-id').val(post_id);
        $('#send-comment-reply input#reply-review-id').val(review_id);
    });

    $('.reviews-visitior-box').on('click','.edit-reply', function(e){
        $('#send-comment-edit-reply textarea#comment_reply').val('');
        var comment_id = $(this).data('comment-id');
         $.ajax({
            type: 'POST', dataType: 'json',
            url: truelysell.ajaxurl,
            data: { 
                'action': 'get_comment_review_details', 
                'comment':  comment_id,
               },
            success: function(data){
                var comment_content = data.comment_content;
                $('#send-comment-edit-reply textarea#comment_reply').val(comment_content);
                
            }
        });
        

        $('#send-comment-edit-reply input#reply_id').val(comment_id);
        

    });


    $('#send-comment-edit-reply').on('submit',function(e) {
        $('#send-comment-edit-reply button').addClass('loading');
        var content = $(this).find('textarea#comment_reply').val();
        var reply_id = $(this).find('input#reply_id').val();
        $.ajax({
            type: 'POST', 
            dataType: 'json',
            url: truelysell.ajaxurl,
            data: { 
                'action': 'edit_reply_to_review', 
                'reply_id':  $(this).find('input#reply_id').val(),
                'content' : content
               },
            success: function(data){
              
                if (data.success == true){
                   $('#send-comment-edit-reply button').removeClass('loading');
                    $('.edit-reply[data-comment-id="'+reply_id+'"]').data('comment-content',content);
                   $('.mfp-close').trigger('click');
                } else {
                    $('#send-comment-edit-reply button').removeClass('loading');   
                                    
                }

            }
        });
        e.preventDefault();
    })

    $('#send-comment-reply').on('submit',function(e) {

      $('#send-comment-reply button').addClass('loading');
      var review_id = $(this).find('input#reply-review-id').val();

       $.ajax({
            type: 'POST', dataType: 'json',
            url: truelysell.ajaxurl,
            data: { 
                'action': 'reply_to_review', 
                'post_id':  $(this).find('input#reply-post-id').val(),
                'review_id':  review_id,
                'content' : $(this).find('textarea#comment_reply').val(),
               },
            success: function(data){
              console.log(data);
                if (data.success == true){
                   $('#send-comment-reply button').removeClass('loading');
                   $('.mfp-close').trigger('click');
                   $('#review-'+review_id+' .reply-to-review-link').html('<i class="sl sl-icon-check"></i> '+truelysell_core.replied).off('click');
                } else {
                  $('#send-comment-reply button').removeClass('loading');   
                                    
                }

            }
        });
        e.preventDefault();
     });

  var critera = truelysell_core.review_criteria.split(',');

  $('.your-reviews-box').on('click','.edit-review', function(e){
        $('#send-comment-edit-review input[type=radio]').prop( "checked", false );
        $('#send-comment-edit-review textarea#comment_reply').val('');
        $('.message-reply').addClass('loading');
        var comment_id = $(this).data('comment-id');

         $.ajax({
            type: 'POST', dataType: 'json',
            url: truelysell.ajaxurl,
            data: { 
                'action': 'get_comment_review_details', 
                'comment':  comment_id,
               },
            success: function(data){
              
                $('#send-comment-edit-review input#reply_id').val(comment_id);
                $('#send-comment-edit-review input#rating-'+data.comment_rating).prop( "checked", true );
               $('.sub-ratings-container').html(data.ratings);
              
                $('#send-comment-edit-review textarea#comment_reply').val(data.comment_content);
                $('.message-reply').removeClass('loading');
            }
        });

    });


   $('.truelysell_core-dashboard-delete-review').click(function(e) {
        e.preventDefault();
        if (window.confirm(truelysell_core.areyousure)) {
            location.href = this.href;
        }
    });
        
    function get_url_extension( url ) {
        return url.split(/\#|\?/)[0].split('.').pop().trim();
    }

    $('body').on('submit', ".ical-import-form", function(e){

        e.preventDefault();

        $(this).find('button').addClass('loading');
        $('input.import_ical_url').removeClass('bounce');
        
        var form = $(this);
        var listing_id   = $(this).data('listing-id');
        var name         = $(this).find('input.import_ical_name').val();
        var url          = $(this).find('input.import_ical_url').val();
        var force_update = $(this).find('input.import_ical_force_update').prop('checked');
        var filetype = get_url_extension(url); //validate for .ical, .ics, .ifb, .icalendar
        
        var valid_filetypes = [ 'ical', 'ics', 'ifb', 'icalendar', 'calendar' ];
        
        if( url.indexOf('calendar') !== -1 || url.indexOf('accommodation_id') !== -1 || url.indexOf('ical') !== -1 || $.inArray( filetype, valid_filetypes ) > -1 ) {
        
            $.ajax({
              type: 'POST', 
              dataType: 'json',
              url: truelysell.ajaxurl,
              data: { 
                  'action': 'add_new_listing_ical', 
                  'name':   name,
                  'url':    url,
                  'listing_id':    listing_id,
                  'force_update': force_update
                 },
              success: function(data){
                  
                if (data.type == 'success'){
                    
                    form.find('button').removeClass('loading');
                    form.find('input.import_ical_name').val('');
                    form.find('input.import_ical_url').val('');
                    form.parents('.ical-import-dialog').find('.saved-icals').html(data.output);
                    $('.ical-import-dialog .notification').removeClass('error notice').addClass('success').show().html(data.notification);
                
                }
                
                if (data.type == 'error'){
                  form.find('button').removeClass('loading');
                  
                  $('.ical-import-dialog .notification').removeClass('success notice').addClass('error').show().html(data.notification);
                }

              }
          });
        } else {
          $(this).find('button').removeClass('loading');
          $('input.import_ical_url').addClass('bounce');
          window.setTimeout( function(){ $('input.import_ical_url').removeClass('bounce'); }, 1000);
        }
      

    });

      
    $('body').on('click', "a.ical-remove", function(e){
        e.preventDefault();
        var $this = $(this),
        index = $(this).data('remove'),
        nonce = $(this).data('nonce');
        var listing_id  = $(this).data('listing-id');
        $this.parents('.saved-icals').addClass('loading');

        $.ajax({
            type: 'POST', 
            dataType: 'json',
            url: truelysell.ajaxurl,
            data: { 
                'action':     'add_remove_listing_ical', 
                'index':      index,
                'listing_id': listing_id,
               },
            success: function(data){
                
               if (data.type == 'success'){
                  $this.parents('.saved-icals').removeClass('loading').html(data.output);

               }
               $('.ical-import-dialog .notification').show().html(data.notification);

            }
        });
    });

    $('body').on('click', "a.update-all-icals", function(e){
        e.preventDefault();
        var $this = $(this),
        listing_id  = $(this).data('listing-id');
        $this.addClass('loading');
         $.ajax({
            type: 'POST', 
            dataType: 'json',
            url: truelysell.ajaxurl,
            data: { 
                'action':     'refresh_listing_import_ical', 
                'listing_id': listing_id,
               },
            success: function(data){
                $this.removeClass('loading');
               if (data.type == 'success'){
                  $('.ical-import-dialog .notification').removeClass('error notice').addClass('success').show().html(data.notification);
               } else if(data.type == 'error') {
                  $('.ical-import-dialog .notification').removeClass('success notice').addClass('error').show().html(data.notification);
               }
             
            }
        });
    });


    $('#send-comment-edit-review').on('submit',function(e) {
        $('#send-comment-edit-review button').addClass('loading');
        var value = 'service';
        var button = $(this);
        var content = $(this).find('textarea#comment_reply').val();
        var reply_id = $(this).find('input#reply_id').val();
        var reply_rating= $(this).find('input[type="radio"]:checked').val();
        
        var data = { 
                'action': 'edit_review', 
                'reply_id':  $(this).find('input#reply_id').val(),
                'content' : content,
               }; 
        $.each( critera, function( index, value ){
          data['rating_'+value] = button.find('input[type="radio"][name="'+value+'"]:checked').val();;
        });
        console.log(data);
       
        
        $.ajax({
            type: 'POST', 
            dataType: 'json',
            url: truelysell.ajaxurl,
            data: data,
            success: function(data){
              
                if (data.success == true){
                   $('#send-comment-edit-review button').removeClass('loading');
                   
                   $('.mfp-close').trigger('click');
                } else {
                    $('#send-comment-edit-review button').removeClass('loading');   
                                    
                }

            }
        });
        e.preventDefault();
    })


    
    $('a.truelysell_core-rate-review').on('click',function(e) {

      e.preventDefault();
        var $this = $(this),
        comment = $(this).data('comment'),
        nonce = $(this).data('nonce');
       
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: truelysell.ajaxurl,
            data: { 
                'action': 'truelysell_core_rate_review', 
                'comment': comment,
               },
            success: function(data){
              
                
                 $this.html(data.output)
                
            }
        });
         e.preventDefault();
     });

    // Contact Form Ajax

    $('#send-message-from-widget').on('submit',function(e) {
      $('#send-message-from-widget button').addClass('loading').prop('disabled', true);

       $.ajax({
            type: 'POST', dataType: 'json',
            url: truelysell.ajaxurl,
            data: { 
                'action': 'truelysell_send_message', 
                'recipient' : $(this).find('textarea#contact-message').data('recipient'),
                'referral' : $(this).find('textarea#contact-message').data('referral'),
                'message' : $(this).find('textarea#contact-message').val(),
               },
            success: function(data){
              
                if(data.type == "success") {

                  $('#send-message-from-widget button').removeClass('loading');
                  $('#send-message-from-widget .notification').show().html(data.message);
                  window.setTimeout( closepopup, 3000 );
                  $(this).find('textarea#contact-message').val('');
                  
                } else {
                    $('#send-message-from-widget .notification').removeClass('success').addClass('error').show().html(data.message);
                    $('#send-message-from-widget button').removeClass('loading').prop('disabled', false);
                }

            }
        });
        e.preventDefault();
    }); 

    function closepopup(){
      var magnificPopup = $.magnificPopup.instance; 
      if(magnificPopup) {
          magnificPopup.close();   
          $('#send-message-from-widget button').removeClass('loading').prop('disabled', false);
      }
    }  

    $('#send-message-from-chat').on('submit',function(e) {
      
      var message = $(this).find('textarea#contact-message').val();

      if(message){
        $(this).find('textarea#contact-message').removeClass('error');
        $('.loading').show();
        $(this).find('button').prop('disabled', true);
         $.ajax({
              type: 'POST', dataType: 'json',
              url: truelysell.ajaxurl,
              data: { 
                  'action': 'truelysell_send_message_chat', 
                  'recipient' : $(this).find('input#recipient').val(),
                  'conversation_id' : $(this).find('input#conversation_id').val(),
                  'message' : message,
                 },
              success: function(data){
                
                  if(data.type == "success") {
                      $(this).addClass('success');                    
                      refreshMessages();
                      $('#send-message-from-chat textarea').val('');
                      $('#send-message-from-chat button').prop('disabled', false);
                  } else {
                      $(this).addClass('error')                    
                  }

              }
          });
       } else {
          $(this).find('textarea#contact-message').addClass('error');

       }
        e.preventDefault();
    }); 

    $(document).on('click', '.booking-message', function(e) {
      var recipient = $(this).data('recipient');
      var referral = $(this).data('booking_id');
    $('#send-message-from-widget textarea').val('');
    $('#send-message-from-widget .notification').hide();

    
      $('#send-message-from-widget textarea').data('referral',referral).data('recipient',recipient);
      
    
      $('.send-message-to-owner').trigger('click');
    });
    
    function refreshMessages(){
      if($('.message-bubbles').length){


        $.ajax({
            type: 'POST', dataType: 'json',
            url: truelysell.ajaxurl,
            data: { 
                'action': 'truelysell_get_conversation', 
                'conversation_id' : $('#send-message-from-chat input#conversation_id').val(),
               },
            success: function(data){
              
                if(data.type == "success") {
                    $('.message-bubbles').html(data.message);
                }
                $('.loading').hide();
             
            },
            complete: function() {
              setTimeout(refreshMessages, 4000);
            }
        });
 
      }
    }
    setTimeout(refreshMessages, 4000);

   
if($("#coupon_bg-uploader").length>0) {
   /* Upload using dropzone */
    Dropzone.autoDiscover = false;

    var couponDropzone = new Dropzone ("#coupon_bg-uploader", {
      url: truelysell_core.upload,
      maxFiles:1,
      maxFilesize:truelysell_core.maxFilesize,
      dictDefaultMessage: truelysell_core.dictDefaultMessage,
      dictFallbackMessage: truelysell_core.dictFallbackMessage,
      dictFallbackText: truelysell_core.dictFallbackText,
      dictFileTooBig: truelysell_core.dictFileTooBig,
      dictInvalidFileType: truelysell_core.dictInvalidFileType,
      dictResponseError: truelysell_core.dictResponseError,
      dictCancelUpload: truelysell_core.dictCancelUpload,
      dictCancelUploadConfirmation: truelysell_core.dictCancelUploadConfirmation,
      dictRemoveFile: truelysell_core.dictRemoveFile,
      dictMaxFilesExceeded: truelysell_core.dictMaxFilesExceeded,
        acceptedFiles: 'image/*',
      accept: function(file, done) {
         
          done();
        },
      init: function() {
            this.on("addedfile", function() {
              if (this.files[1]!=null){
                this.removeFile(this.files[0]);
              }
            });
      },   

        success: function (file, response) {
            file.previewElement.classList.add("dz-success");
            file['attachment_id'] = response; // push the id for future reference
            console.log(file['attachment_id']);
            $("#coupon_bg-uploader-id").val(file['attachment_id']);

        },
        error: function (file, response) {
            file.previewElement.classList.add("dz-error");
        },
        // update the following section is for removing image from library
        addRemoveLinks: true,
        removedfile: function(file) {
          var attachment_id = file['attachment_id'];
            $("#coupon_bg-uploader-id").val('');
            $.ajax({
                type: 'POST',
                url: truelysell_core.delete,
                data: {
                    media_id : attachment_id
                }, 
                success: function (result) {
                     console.log(result);
                  },
                  error: function () {
                      console.log("delete error");
                  }
            });
            var _ref;
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;        
        }
    });

    couponDropzone.on("maxfilesexceeded", function(file)
    {
        this.removeFile(file);
    });
    if($('.edit-coupon-photo').attr('data-photo')){
      var mockFile = { name: $('.edit-coupon-photo').attr('data-name'), size: $('.edit-coupon-photo').attr('data-size') };
        couponDropzone.emit("addedfile", mockFile);
        couponDropzone.emit("thumbnail", mockFile, $('.edit-coupon-photo').attr('data-photo'));
        couponDropzone.emit("complete", mockFile);
        couponDropzone.files.push(mockFile);
      // If you use the maxFiles option, make sure you adjust it to the
      // correct amount:
      
      couponDropzone.options.maxFiles = 1;
    }


}
    
if($("#avatar-uploader").length>0) {
   /* Upload using dropzone */
    Dropzone.autoDiscover = false;

    var avatarDropzone = new Dropzone ("#avatar-uploader", {
      url: truelysell_core.upload,
      maxFiles:1,
      maxFilesize:truelysell_core.maxFilesize,
      dictDefaultMessage: truelysell_core.dictDefaultMessage,
      dictFallbackMessage: truelysell_core.dictFallbackMessage,
      dictFallbackText: truelysell_core.dictFallbackText,
      dictFileTooBig: truelysell_core.dictFileTooBig,
      dictInvalidFileType: truelysell_core.dictInvalidFileType,
      dictResponseError: truelysell_core.dictResponseError,
      dictCancelUpload: truelysell_core.dictCancelUpload,
      dictCancelUploadConfirmation: truelysell_core.dictCancelUploadConfirmation,
      dictRemoveFile: truelysell_core.dictRemoveFile,
      dictMaxFilesExceeded: truelysell_core.dictMaxFilesExceeded,
        acceptedFiles: 'image/*',
      accept: function(file, done) {
         
          done();
        },
      init: function() {
            this.on("addedfile", function() {
              if (this.files[1]!=null){
                this.removeFile(this.files[0]);
              }
            });
      },   

        success: function (file, response) {
            file.previewElement.classList.add("dz-success");
            file['attachment_id'] = response; // push the id for future reference
            $("#avatar-uploader-id").val(file['attachment_id']);

        },
        error: function (file, response) {
            file.previewElement.classList.add("dz-error");
        },
        // update the following section is for removing image from library
        addRemoveLinks: true,
        removedfile: function(file) {
          var attachment_id = file['attachment_id'];
            $("#avatar-uploader-id").val('');
            $.ajax({
                type: 'POST',
                url: truelysell_core.delete,
                data: {
                    media_id : attachment_id
                }, 
                success: function (result) {
                     console.log(result);
                  },
                  error: function () {
                      console.log("delete error");
                  }
            });
            var _ref;
            return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;        
        }
    });

    avatarDropzone.on("maxfilesexceeded", function(file)
    {
        this.removeFile(file);
    });
    if($('.edit-profile-photo').attr('data-photo')){
      var mockFile = { name: $('.edit-profile-photo').attr('data-name'), size: $('.edit-profile-photo').attr('data-size') };
        avatarDropzone.emit("addedfile", mockFile);
        avatarDropzone.emit("thumbnail", mockFile, $('.edit-profile-photo').attr('data-photo'));
        avatarDropzone.emit("complete", mockFile);
        avatarDropzone.files.push(mockFile);
      // If you use the maxFiles option, make sure you adjust it to the
      // correct amount:
      
      avatarDropzone.options.maxFiles = 1;
    }


}


  $('.dynamic #tax-listing_category,.dynamic #tax-listing_category-panel input').on('change',function(e) {
      var cat_ids = []
      
      $('#tax-listing_feature-panel .checkboxes').addClass('loading');
      $('#tax-listing_feature-panel .panel-buttons').hide();
      var panel = false;
      if($('#tax-listing_category-panel').length>0){
          panel = true;
          
          $("#tax-listing_category-panel input[type=checkbox]:checked").each(function(){
            
              cat_ids.push($(this).val());
          });
      } else {
          if($('#tax-listing_feature-panel').length>0){
          panel = true;  
          }
          if($(this).prop('multiple')){
              $('#tax-listing_category :selected').each(function(i, sel){ 
                  cat_ids.push( $(sel).val() ); 

              });
          } else {
            cat_ids.push($(this).val());  
          }
          
      }
      $.ajax({
          type: 'POST', 
          dataType: 'json',
          url: truelysell.ajaxurl,
          data: { 
              'action': 'truelysell_get_features_from_category', 
              'cat_ids' : cat_ids,
              'panel' : panel,
             },
          success: function(data){
            $('#tax-listing_feature-panel .checkboxes').removeClass('loading');
            $('#tax-listing_feature-panel .checkboxes .row').html(data['output']).removeClass('loading');
            $('#tax-listing_feature').html(data['output']).removeClass('loading');
            if(data['success']){
              $('#tax-listing_feature-panel .panel-buttons').show();
            }

          }            
      });
  });
  $('.dynamic #tax-listing_category').trigger('change');
   $('.dynamic-taxonomies #tax-listing_category,.dynamic-taxonomies #tax-listing_category-panel input').on('change',function(e) {
      var cat_ids = []
      
        $('.dynamic-taxonomies #truelysell-search-form_tax-service_category').hide();
        $('.dynamic-taxonomies #truelysell-search-form_tax-rental_category').hide();
        $('.dynamic-taxonomies #truelysell-search-form_tax-event_category').hide();
        $('.dynamic-taxonomies #truelysell-search-form_tax-service_category select, .dynamic-taxonomies #tax-service_category-panel select').val('');
        $('.dynamic-taxonomies #truelysell-search-form_tax-rental_category select, .dynamic-taxonomies #tax-rental_category-panel select').val('');
        $('.dynamic-taxonomies #truelysell-search-form_tax-event_category select, .dynamic-taxonomies #tax-event_category-panel select').val('');
        $('.dynamic-taxonomies #tax-service_category-panel').hide();
        $('.dynamic-taxonomies #tax-rental_category-panel').hide();
        $('.dynamic-taxonomies #tax-event_category-panel').hide();
        $('.dynamic-taxonomies #tax-service_category-panel input:checkbox').prop('checked', false);
        $('.dynamic-taxonomies #tax-rental_category-panel input:checkbox').prop('checked', false);
        $('.dynamic-taxonomies #tax-event_category-panel input:checkbox').prop('checked', false);

      $('.dynamic-taxonomies #tax-event_category-panel input:checkbox').removeAttr('checked');
      var panel = false;
      if($('#tax-listing_category-panel').length>0){
          panel = true;
          
          $("#tax-listing_category-panel input[type=checkbox]:checked").each(function(){
            
              cat_ids.push($(this).val());
          });
      } else {
          if($('#tax-listing_feature-panel').length>0){
          panel = true;  
          }
          if($(this).prop('multiple')){
              $('#tax-listing_category :selected').each(function(i, sel){ 
                  cat_ids.push( $(sel).val() ); 

              });
          } else {
            cat_ids.push($(this).val());  
          }
          
      }
      $.ajax({
          type: 'POST', 
          dataType: 'json',
          url: truelysell.ajaxurl,
          data: { 
              'action': 'truelysell_get_listing_types_from_categories', 
              'cat_ids' : cat_ids,
              'panel' : panel,
             },
          success: function(data){
            if(data['success']){
               var types = data['output'];
               if(types.includes('service')){
                $('.dynamic-taxonomies #truelysell-search-form_tax-service_category').show();
                $('.dynamic-taxonomies #tax-service_category-panel').css('display', 'inline-block');
               } 
               if(types.includes('rental')){
                $('.dynamic-taxonomies #truelysell-search-form_tax-rental_category').show();
                $('.dynamic-taxonomies #tax-rental_category-panel').css('display', 'inline-block');
               }
               if(types.includes('event')){
                $('.dynamic-taxonomies #truelysell-search-form_tax-event_category').show();
                $('.dynamic-taxonomies #tax-event_category-panel').css('display', 'inline-block');
               }
            }
            

          }            
      });
  });

  $('.add-listing-section #listing_category,.add-listing-section #tax-listing_category').on('change',function(e) {
    
    var listing_id = $( "input[name='listing_id']" ).val();
    if($(this).prop('multiple')){
        var cat_ids;
        cat_ids = $(this).val();
    } else {
        var cat_ids = [];
        cat_ids.push($(this).val());  
    }
    
     $.ajax({
          type: 'POST', 
          dataType: 'json',
          url: truelysell.ajaxurl,
          data: { 
              'action': 'truelysell_get_features_ids_from_category', 
              'cat_ids' : cat_ids,
              'listing_id' : listing_id,
              'selected' :selected_listing_feature,
              'panel' : false,
             },
          success: function(data){
            $('.truelysell_core-term-checklist-listing_feature,.truelysell_core-term-checklist-tax-listing_feature').removeClass('loading');
            $('.truelysell_core-term-checklist-listing_feature,.truelysell_core-term-checklist-tax-listing_feature').html(data['output']).removeClass('loading')
            
          }            
      });
  
  });

  var selected_listing_feature = [];
  if( $('.add-listing-section').length ){
    
          $.each($("input[name='tax_input[listing_feature][]']:checked"), function(){            
              selected_listing_feature.push($(this).val());
          });
          
          $('select#listing_category').trigger('change');
          $('select#tax-listing_category').trigger('change');

  }

  if( $('body').hasClass('tax-listing_category') || $('body').hasClass('post-type-archive-listing')){
    $('select#tax-listing_category').trigger('change');
    $('#tax-listing_category-panel input:checked').trigger('change');
  }
  $('#tax-listing_category-panel input:checked').trigger('change');
  $( ".panel-dropdown-content .notification" ).each(function( index ) {
      $(this).parent().parent().find('.panel-buttons').hide();
  });

  
    var uploadButton = {
        $button    : $('.uploadButton-input'),
        $nameField : $('.uploadButton-file-name')
    };
 
    uploadButton.$button.on('change',function() {
        _populateFileField($(this));
    });
 
    function _populateFileField($button) {
        var selectedFile = [];
        for (var i = 0; i < $button.get(0).files.length; ++i) {
            selectedFile.push($button.get(0).files[i].name +'<br>');
        }
        uploadButton.$nameField.html(selectedFile);
    }


    /*----------------------------------------------------*/
  /* Time Slots
  /*----------------------------------------------------*/

    // Add validation parts
    $('.day-slots').each(function(){

      var daySlots = $(this);

    daySlots.find('.add-slot-btn').on('click', function(e) {
      e.preventDefault();

      var slotTime_Start = daySlots.find('.add-slot-inputs input.time-slot-start').val();
      var slotTimePM_AM_Start = daySlots.find('.add-slot-inputs select.time-slot-start').val();

      var slotTime_End = daySlots.find('.add-slot-inputs input.time-slot-end').val();
      var slotTimePM_AM_End = daySlots.find('.add-slot-inputs select.time-slot-end').val();

      // Checks if input values are not blank
      if( slotTime_Start.length > 0 && slotTime_End.length > 0) {

            // New Time Slot Div
          var newTimeSlot = daySlots
                  .find('.single-slot.cloned')
                  .clone(true)
                  .addClass('slot-animation')
                  .removeClass('cloned');

          setTimeout(function(){
            newTimeSlot.removeClass('slot-animation');
          }, 300);

          newTimeSlot.find('.plusminus input').val('1');

          // Plus - Minus Init
            newTimeSlot.find('.plusminus').numberPicker();

          // Check if there's am/pm dropdown
            var $twelve_hr = $('.add-slot-inputs select.twelve-hr');

            if ( $twelve_hr.length){
                newTimeSlot.find('.single-slot-time').html(slotTime_Start + ' ' + '<i class="am-pm">'+slotTimePM_AM_Start+'</i>' + ' - '+ slotTime_End + ' ' + '<i class="am-pm">'+slotTimePM_AM_End+'</i>');
            } else {
              newTimeSlot.find('.single-slot-time').html(''+ slotTime_Start + ' - ' + slotTime_End);
            }

            // Appending new slot
          newTimeSlot.appendTo(daySlots.find('.slots-container'));

          // Refresh sotrable script
          $(".slots-container").sortable('refresh');
      } 

      // Validation Error
      else {
        daySlots.find('.add-slot').addClass('add-slot-shake-error');
        setTimeout(function(){
          daySlots.find('.add-slot').removeClass('add-slot-shake-error');
        }, 600);
      }
    });

      // Removing "no slots" message
    function hideSlotInfo() {
      var slotCount = daySlots.find(".slots-container").children().length;
      if ( slotCount < 1 ) {
        daySlots.find(".no-slots")
            .addClass("no-slots-fadein")
            .removeClass("no-slots-fadeout");
      } 
    }
    hideSlotInfo();


    // Removing Slot
      daySlots.find('.remove-slot').bind('click', function(e) {
        e.preventDefault();
      $(this).closest('.single-slot').animate({height: 0, opacity: 0}, 'fast', function() { 
        $(this).remove();
      });

      // Removing "no slots" message
      setTimeout(function(){
        hideSlotInfo()
      }, 400);

    });

      // Showing "no slots" message
    daySlots.find('.add-slot-btn').on('click', function(e) {
      e.preventDefault();
      var slotCount = daySlots.find(".slots-container").children().length;
      if ( slotCount >= 1 ) {
        daySlots.find(".no-slots")
            .removeClass("no-slots-fadein")
            .addClass("no-slots-fadeout");
      } 
    });

    });

    // Sotrable Script
    $( ".slots-container" ).sortable();

  // 24 hour clock type switcher
  if ( $('.availability-slots').attr('data-clock-type') == '24hr' ) {
    $('.availability-slots').addClass('twenty-four-clock');
    $('.availability-slots').find('input[type="time"]').attr({ "max" : "24:00"});
  }




    // Switcher
  $(".add-listing-section").each(function() {

    var switcherSection = $(this);
    var switcherInput = $(this).find('.switch input');

    if(switcherInput.is(':checked')){
      $(switcherSection).addClass('switcher-on');
    }

    switcherInput.change(function(){
      if(this.checked===true){
        $(switcherSection).addClass('switcher-on');
        
        if(switcherInput.attr('id') == '_booking_status'){
          $('.add-listing-section.slots,.add-listing-section.basic_prices,.add-listing-section.availability_calendar').show();
        }
      } else {
        $(switcherSection).removeClass('switcher-on');
        if(switcherInput.attr('id') == '_booking_status'){
          $('.add-listing-section.slots,.add-listing-section.basic_prices,.add-listing-section.availability_calendar').show();
        }
      }
    });

  });

  if($('#_booking_status').is(':checked'))  {
    $('.add-listing-section.slots,.add-listing-section.basic_prices,.add-listing-section.availability_calendar').show();
  } else {
    $('.add-listing-section.slots,.add-listing-section.basic_prices,.add-listing-section.availability_calendar').show();
  }

    /*----------------------------------------------------*/
  /*  Booking Sticky Footer
  /*----------------------------------------------------*/
  $('.booking-sticky-footer a.button').on('click', function(e) {
    var $anchor = $(this);
    $("html, body").animate({ scrollTop: $($anchor.attr('href')).offset().top - 100 }, 1000);
  });
  

  /*----------------------------------------------------*/
  /* Opening Hours
  /*----------------------------------------------------*/

  $('body').on('click', ".opening-day-remove", function(e){
      e.preventDefault();
      var div_class = $(this).data('remove');
      $(this).parent().parent().remove();
      $('div.'+div_class).remove();
  }); 

  $('body').on('click', ".opening-day-add-hours", function(e){
      e.preventDefault();
      var dayname = $(this).data('dayname');
      var count = $(this).parents('.opening-day').find('.row').length;
      var id = $(this).data('id');
      var i = $(this).parents('.opening-day').find('.row').length;
      

      var newElem = $(''+
        '<div class="row"><div class="col-md-2 opening-day-tools"><a class="opening-day-remove button" data-remove="'+dayname+'-opening-hours-row'+count+'" href="#">'+truelysell_core.remove+'</a>'+
          '</div><div class="col-md-5 '+dayname+'-opening-hours-row'+count+'">'+
            '<input type="text" class="truelysell-flatpickr 1" name="_'+id+'_opening_hour[]" placeholder="'+truelysell_core.opening_time+'" value=""></div>'+
          '<div class="col-md-5 '+dayname+'-opening-hours-row'+count+'" >'+
            '<input type="text" class="truelysell-flatpickr 2" name="_'+id+'_closing_hour[]" placeholder="'+truelysell_core.closing_time+'" value="">'+
          '</div></div>'
      );

      newElem.appendTo($(this).parents('.opening-day'));
      var time24 = false;
    
      if(truelysell_core.clockformat){
        time24 = true;
      }
      $(this).parents('.opening-day').find('.row:last .truelysell-flatpickr 3').flatpickr({
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: time24,
        disableMobile: true
      });
  });

  
    
    $('input[type=radio][name=user_role]').change(function() {
       
      $('#truelysell-core-registration-fields').html('');
      if (this.value == "owner" || this.value == "vendor") {
          $("#truelysell-core-registration-fields").html(
          $("#truelysell-core-registration-owner-fields").html()
        );
      } else {
        $("#truelysell-core-registration-fields").html(
          $("#truelysell-core-registration-guest-fields").html()
        );
      }
       //$('.select2-single').select2("destroy");

      $('.select2-single').select2({
         dropdownPosition: 'below',
         
        minimumResultsForSearch: 20,
        width: "100%",
        placeholder: $(this).data('placeholder')
    });

    });
  
  /*----------------------------------------------------*/
  /* Pricing List
  /*----------------------------------------------------*/
function pricingCoverSwitcher() {
  var readURL = function (input) {
    
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      var input_obj = $(input);
      
      reader.onload = function (e) {
        $(input).parent().find(".cover-pic").attr("src", e.target.result);
         $(input).parent().find(".menu-cover-id").val("");
      };

      reader.readAsDataURL(input.files[0]);
    }
  };
  $('#pricing-list-container').on("change", '.file-upload', function(e) { 
    readURL(this);
  });
  $('#pricing-list-container').on("click", '.upload-button', function(e) { 
    $(this).next(".file-upload").click();
  });
}
pricingCoverSwitcher();

 $(".remove-cover").on("click", function (e) {
   e.preventDefault();
   $(this).next(".menu-cover-id").val('');
   $(this)
     .parent()
     .find(".cover-pic")
     .attr("src", truelysell.theme_url + "/assets/images/pricing-cover-placeholder.jpg");
 });


  function newMenuItem() {
    // var newElem = $('tr.pricing-list-item:not(.pricing-submenu)').last().clone(true);
    // console.log(newElem.length);
    // if(!newElem){
      var newElem = $(''+
        '<tr class="pricing-list-item pattern" data-iterator="0">'+
          '<td>'+
            '<div class="fm-move"><i class="fa fa-arrows"></i></div>'+
            '<div class="fm-input pricing-cover"><div class="pricing-cover-wrapper" data-tippy-placement="bottom" title="Change Avatar"><img class="cover-pic" src="'+truelysell.theme_url+'/assets/images/pricing-cover-placeholder.jpg" alt=""><div class="upload-button"></div><input class="file-upload" type="file" accept="image/*" name="_menu[0][menu_elements][0][cover]"></div></div>'+
            '<div class="fm-input pricing-name"><input type="text" placeholder="'+truelysell_core.menu_title+'" name="_menu[0][menu_elements][0][name]" /></div>'+
            '<div class="fm-input pricing-ingredients"><input type="text" placeholder="'+truelysell_core.menu_desc+'" name="_menu[0][menu_elements][0][description]"/></div>'+
            '<div class="fm-input pricing-price">'+
            '<i class="data-unit">'+truelysell_core.currency+'</i>'+
            '<input type="number" step="0.01" placeholder="'+truelysell_core.menu_price+'" name="_menu[0][menu_elements][0][price]" /></div>'+
           
                    
             '<div class="fm-close"><a class="delete" href="#"><i class="fa fa-remove"></i></a></div>'+
          '</td>'+
        '</tr>');
    //}
    
    
    newElem.find('input').val('');

    var prev_category_number = $('.pricing-submenu').last().data('number');
    var prev_data_iterator = $('tr.pricing-list-item:not(.pricing-submenu)').last().data('iterator');
    
    if(prev_category_number == undefined) {
      prev_category_number = 0;
    }
    
    var next_data_iterator = prev_data_iterator + 1;
    
    var last_table_el = $('tr.pricing-list-item').last();
    

    newElem.find('input').each(function() {
        // replace 1st number with current category title number
        
        this.name = this.name.replace(/\[\d+\]/, '[' +prev_category_number+ ']');
        this.id = this.id.replace(/\[\d+\]/, '[' +prev_category_number+ ']');
        //replace 2nd number / if it's new category start from 0, if not iterate
        if(last_table_el.hasClass('pricing-submenu')){
          next_data_iterator = 0;
          // replace 2nd number
          this.name = replaceLast( this.name, '[0]', '[' + next_data_iterator + ']'  );
          this.id = replaceLast( this.id, '[0]', '[' + next_data_iterator + ']'  );
        } else {
          // replace 2nd number
          this.name = replaceLast( this.name, '[0]', '[' + next_data_iterator + ']' ); 
          this.id = replaceLast( this.id, '[0]', '[' + next_data_iterator + ']' ); 
        }
       
    });

    newElem.find('label').each(function() {
      
        //replace 1st number with current category title number
        this.htmlFor = this.htmlFor.replace(/\[\d+\]/, '[' +prev_category_number+ ']');
        //console.log(this.htmlFor);
        
        //replace 2nd number / if it's new category start from 0, if not iterate
        if(last_table_el.hasClass('pricing-submenu')){
          next_data_iterator = 0;
          // replace 2nd number
          this.htmlFor = replaceLast( this.htmlFor, '[0]', '[' + next_data_iterator + ']'  );
        } else {
          // replace 2nd number
          this.htmlFor = replaceLast( this.htmlFor, '[0]', '[' + next_data_iterator + ']' ); 
        }
        
    });
    //console.log(newElem);
    

    newElem.appendTo('table#pricing-list-container').data('iterator',next_data_iterator).find('select').trigger("chosen:updated");

     $('#pricing-list-container').data('iterator',next_data_iterator);
  }

  
var test =  '_menu[0][menu_elements][0][bookable_quantity]';


  function replaceLast( string, search, replace ) {
    // find the index of last time word was used
    var n = string.lastIndexOf( search );

    // slice the string in 2, one from the start to the lastIndexOf
    // and then replace the word in the rest
    return string.slice( 0, n ) + string.slice( n ).replace( search, replace );
  };

  if ($("table#pricing-list-container").is('*')) {

    $('.add-pricing-list-item').on('click', function(e) {
      e.preventDefault();
      newMenuItem();
    });

    // remove ingredient
    $(document).on( "click", "#pricing-list-container .delete", function(e) {
      e.preventDefault();
      $(this).parent().parent().remove();
    });

    // add submenu
    $('.add-pricing-submenu').on('click', function(e) {
      e.preventDefault();
      var i = $('.pricing-submenu').length;

      var newElem = $(''+
        '<tr class="pricing-list-item pricing-submenu" data-number="'+i+'">'+
          '<td>'+
            '<div class="fm-move"><i class="fa fa-arrows"></i></div>'+
            '<div class="fm-input"><input name="_menu['+i+'][menu_title]" type="text" placeholder="'+truelysell_core.category_title+'" /></div>'+
            '<div class="fm-close"><a class="delete" href="#"><i class="fa fa-remove"></i></a></div>'+
          '</td>'+
        '</tr>');

      newElem.appendTo('table#pricing-list-container');
    });

    $('table#pricing-list-container tbody').sortable({
      forcePlaceholderSize: true,
      forceHelperSize: false,
      placeholder : 'sortableHelper',
      zIndex: 999990,
      opacity: 0.6,
      tolerance: "pointer",
      start: function(e, ui ){
           ui.placeholder.height(ui.helper.outerHeight());
      },
      stop: function (event, ui) {

            updateNames($(this))
        }
    });

      $(window).on('load resize', function() {
          var winWidth = $(window).width();
          if (winWidth < 992) {
            $('table#pricing-list-container tbody').sortable('disable');
          } else if (winWidth > 992) {
             $('table#pricing-list-container tbody').sortable('enable');
          }
    });
  }

  //updates list name numbers
  function updateNames($list) {
  var cat_i = 0;
  var subcat_i = 0; 
    $list.find('tr').each(function() {

      var prev_data_iterator = $(this).data('iterator');

      //category
      if($(this).hasClass('pricing-submenu')) {
        var cat_input = $(this).find('input');
        cat_input.each(function () {
              this.name = this.name.replace(/(\[\d\])/, '[' + cat_i + ']');            
          })
          $(this).data('number',cat_i)
        
      } else {
        var prev_category_number = $(this).prevAll('.pricing-submenu').first().data('number');
      
        var subcat_input = $(this).find('input');
        
        subcat_input.each(function() {  
          // replace 1st number with current category title number
          this.name = this.name.replace(/\[\d+\]/, '[' +prev_category_number+ ']');
          this.name = replaceLast( this.name, '[' + prev_data_iterator + ']', '[' + subcat_i + ']' ); 
      });
      $(this).data('iterator',subcat_i);
      subcat_i++;

      }
      
      if($(this).hasClass('pricing-submenu')) {
        cat_i++;
          subcat_i = 0;
      }
    });
}


    // Unit character
    var fieldUnit = $('.pricing-price').children('input').attr('data-unit');
    $('.pricing-price').children('input').before('<i class="data-unit">'+ fieldUnit + '</i>');


    if( $('body').hasClass('page-template-template-home-search-splash') || $('body').hasClass('page-template-template-home-search') || $('body').hasClass('page-template-template-split-map')) {
      var open_cal = 'right';
    } else {
      var open_cal = 'left';
    }
  
    $('.date_range').daterangepicker({
        "opens": open_cal,
        // checking attribute listing type and set type of calendar
        autoUpdateInput: false,
       
        minDate: moment().subtract(0, 'days'),
        locale: {
          format: wordpress_date_format.date,
          "firstDay"    : parseInt(wordpress_date_format.day),
          "applyLabel"  : truelysell_core.applyLabel,
              "cancelLabel" : truelysell_core.clearLabel,
              "fromLabel"   : truelysell_core.fromLabel,
              "toLabel"   : truelysell_core.toLabel,
              "customRangeLabel": truelysell_core.customRangeLabel,
              "daysOfWeek": [
                truelysell_core.day_short_su,
                truelysell_core.day_short_mo,
                truelysell_core.day_short_tu,
                truelysell_core.day_short_we,
                truelysell_core.day_short_th,
                truelysell_core.day_short_fr,
                truelysell_core.day_short_sa
              ],
              "monthNames": [
                  truelysell_core.january,
                  truelysell_core.february,
                  truelysell_core.march,
                  truelysell_core.april,
                  truelysell_core.may,
                  truelysell_core.june,
                  truelysell_core.july,
                  truelysell_core.august,
                  truelysell_core.september,
                  truelysell_core.october,
                  truelysell_core.november,
                  truelysell_core.december,
              ],
        
          },
    });
    
    $('.date_range').on('apply.daterangepicker', function(ev, picker) {
        $("input[name=_listing_type]").prop('disabled', false);
        $(this).val( picker.startDate.format(wordpress_date_format.date) + ' - ' + picker.endDate.format(wordpress_date_format.date)).trigger("change");;
        Cookies.set('truelysell_rental_startdate', picker.startDate.format(wordpress_date_format.date));
        Cookies.set('truelysell_rental_enddate',  picker.endDate.format(wordpress_date_format.date));

    });

    $('.date_range').on('cancel.daterangepicker', function(ev, picker) {
        $("input[name=_listing_type]").prop('disabled', true);
        $(this).val('').trigger("change");
        
    });

     $('.date_range').on('show.daterangepicker', function(ev, picker) {

        $('.daterangepicker').addClass('calendar-visible calendar-animated bordered-alt-style');
        $('.daterangepicker').removeClass('calendar-hidden');
        $("input[name=_listing_type]").prop('disabled', false);
    });
    $('.date_range').on('hide.daterangepicker', function(ev, picker) {
      
        $('.daterangepicker').removeClass('calendar-visible');
        $('.daterangepicker').addClass('calendar-hidden');
  });


$('input.slot-time-input').keydown(function (e) {
    if (e.ctrlKey || e.metaKey) {
      return true;
    }

    if (e.which >= 37 && e.which <= 40) {
      return true;
    }

    if (e.which !== 8 && e.which !== 0 && e.key.match(/[^:0-9]/)) {
      return false;
    }
  }).keyup(function (e) {
    var $this = $(this);

    if (e.ctrlKey || e.metaKey || e.which === 8 || e.which === 0 || (e.which >= 37 && e.which <= 40)) {
      return true;
    }

    var ss = parseInt(this.selectionStart);

    var v = $this.val();
    var t = v.replace(/[^0-9]/g, '');
    if ( $('.availability-slots').attr('data-clock-type') == '24hr' ) {
      var h = Math.max(0, Math.min(24, parseInt(t.substr(0, 2))));
    } else {
      var h = Math.max(0, Math.min(12, parseInt(t.substr(0, 2))));
    }
    var m = Math.max(0, Math.min(59, parseInt(t.substr(2))));

    if (t.length < 3) {
      m = '';
    }

    var r;

    if (v.length === 2) {
      r = String('0' + h).substr(String(h).length-1) + ':';
      ss++;
    } else if (v.length >= 3 && v.length < 5) {
      r = String('0' + h).substr(String(h).length-1) + ':' + m;
      ss++;
    } else if (v.length === 5) {
      r = String('0' + h).substr(String(h).length-1) + ':' + String('0' + m).substr(String(m).length-1);
    }

    if (r && r !== $this.val()) {
      $this.val(r);
      this.selectionStart = this.selectionEnd = ss;
    }
  }).blur(function (e) {
    var $this = $(this);

    var v = $this.val();
    var t = v.replace(/[^0-9]/g, '');
    var h = Math.max(0, Math.min(23, parseInt(t.substr(0, 2))));
    var m = Math.max(0, Math.min(59, parseInt(t.substr(2)))) || 0;
    var r = '';
        
    if (!isNaN(h)) {
      r = String('0' + h).substr(String(h).length-1) + ':' + String('0' + m).substr(String(m).length-1);
    }

    $this.val(r);
  });


  $( document.body ).on( 'click', '.remove-uploaded-file', function() {
    

    $(this).closest( '.job-manager-uploaded-file' ).remove();
    $(this).closest( '.truelysell-uploaded-file' ).remove();
  
    return false;
  });

  //select export ical 
  //
  $("input.truelysell-export-ical-input").blur(function() {
    if ($(this).attr("data-selected-all")) {
    //Remove atribute to allow select all again on focus        
    $(this).removeAttr("data-selected-all");
    }
  });

  $("input.truelysell-export-ical-input").click(function() {
    if (!$(this).attr("data-selected-all")) {
      try {
        $(this).selectionStart = 0;
        $(this).selectionEnd = $(this).value.length + 1;
        //add atribute allowing normal selecting post focus
        $(this).attr("data-selected-all", true);
      } catch (err) {
        $(this).select();
        //add atribute allowing normal selecting post focus
        $(this).attr("data-selected-all", true);
      }
    }
  });
// ------------------ End Document ------------------ //
});

})(this.jQuery);
/**/