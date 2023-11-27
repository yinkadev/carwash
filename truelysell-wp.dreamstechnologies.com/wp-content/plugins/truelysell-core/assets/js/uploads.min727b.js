/* ----------------- Start Document ----------------- */
(function($){
"use strict";


if($("#media-uploader._gallery").length>0) {
 	var gallery_limit = $("#media-uploader._gallery").data('maxfiles');
 	if(!gallery_limit){
		gallery_limit = truelysell_core.maxFiles;
	
 	}

 	console.log('gallery_limit'+gallery_limit)
 	 /* Upload using dropzone */
    Dropzone.autoDiscover = false;

   	var galleryDropzone = new Dropzone ("#media-uploader._gallery", {
    	url: truelysell_core.upload,
    	timeout: 999999,
    	maxFiles:gallery_limit,
	    acceptedFiles: 'image/*',
	    maxFilesize:truelysell_core.maxFilesize,
	    dictMaxFilesExceeded: truelysell_core.dictMaxFilesExceeded,
	    dictDefaultMessage: truelysell_core.dictDefaultMessage,
		dictFallbackMessage: truelysell_core.dictFallbackMessage,
		dictFallbackText: truelysell_core.dictFallbackText,
		dictFileTooBig: truelysell_core.dictFileTooBig,
		dictInvalidFileType: truelysell_core.dictInvalidFileType,
		dictResponseError: truelysell_core.dictResponseError,
		dictCancelUpload: truelysell_core.dictCancelUpload,
		dictCancelUploadConfirmation: truelysell_core.dictCancelUploadConfirmation,
		dictRemoveFile: truelysell_core.dictRemoveFile,
	    init: function() {
			this.on("sending", function(file, xhr, formData) {
				var id = $('input[name=property_id]').val();
		      	formData.append("data", id);
		    });
	   		this.on("addedfile", function(file){
	   			/* Set active thumb class to preview that is used as thumbnail*/
	  
    			if(file['attachment_id'] === parseInt($('#_thumbnail_id').val())) {
    				file.previewElement.className += ' active-thumb _gallery'+file['attachment_id'];
    			} else {
    				file.previewElement.className += ' _gallery'+ parseInt(file['attachment_id']);
    			}
	             file.previewElement.addEventListener("click", function() {
	             	$('.dz-preview').removeClass('active-thumb');
				   	$(this).addClass('active-thumb'); 
				 
				   var id = file['attachment_id'];  
				   $('#_thumbnail_id').val(id); 
				});
	        })
	        ,
	        this.on("complete", function(file){
   				file.previewElement.className += ' _gallery'+file.attachment_id;
	        });
	        this.on("queuecomplete", function (file) {
	        	
	        	$('.dz-image-preview:first').trigger('click');  //file.previewElement.click();
	        	 });
	    },
	    success: function (file, response) {
	        file.previewElement.classList.add("dz-success");
	        file['attachment_id'] = response; // push the id for future reference
			
	        $("#media-uploader-ids").append('<input id="_gallery' + file['attachment_id'] +'" type="hidden" name="_gallery[' +file['attachment_id']+ ']"  value="'+file['name']+'">');
	      

	    },
	    error: function (file, response) {
	        file.previewElement.classList.add("dz-error");
	        $(file.previewElement).find('.dz-error-message').text(response);
	    },
	    // update the following section is for removing image from library
	    addRemoveLinks: true,
	    removedfile: function(file) {
	        var attachment_id = file['attachment_id'];   
	        $('input#_gallery'+attachment_id).remove();
	        /*remove thumbnail if the image was set as it*/
	        if($('#_thumbnail_id').val() == attachment_id){
				$('#_thumbnail_id').val('');
	        }
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
	
	if (typeof images !== typeof undefined && images !== false) {

		var uploaded_media = jQuery.parseJSON(images);
		for (var i = 0; i < uploaded_media.length; ++i) {
		 	
		 		var mockFile = { name: uploaded_media[i].name, size: uploaded_media[i].size, attachment_id: uploaded_media[i].attachment_id };
		        galleryDropzone.emit("addedfile", mockFile);
		        galleryDropzone.emit("thumbnail", mockFile, uploaded_media[i].thumb);
		        galleryDropzone.emit("complete", mockFile);
		        galleryDropzone.files.push(mockFile);
				// If you use the maxFiles option, make sure you adjust it to the
				// correct amount:
				var existingFileCount = 1; // The number of files already uploaded
				galleryDropzone.options.maxFiles = galleryDropzone.options.maxFiles - existingFileCount;
		}
	}

  	$(".dropzone").sortable({
        items:'.dz-preview',
        cursor: 'move',
        opacity: 0.5,
        containment: '.dropzone',
        distance: 20,
        tolerance: 'pointer',
	    update: sortinputs
    }).disableSelection();

  	function sortinputs(){
	    $('.dropzone .dz-preview').each(function(i, el){
	    	var p = $(el).attr('class').match(/\d+/g);
	    	
	        $('#media-uploader-ids input#_gallery' + p )
	            .remove()
	            .appendTo($('#media-uploader-ids'));
	                
	    });
	}
}


if($("#media-uploader._floorplans").length>0) {
	 /* Upload using dropzone */
    Dropzone.autoDiscover = false;

   	var floorDropzone = new Dropzone ("#media-uploader._floorplans", {
    	url: truelysell_core.upload,
    	maxFiles:truelysell_core.maxFiles,
    	maxFilesize:truelysell_core.maxFilesize,
	    acceptedFiles: 'image/*',
	    init: function() {

	   		this.on("addedfile", function(file){
	   			/* Set active thumb class to preview that is used as thumbnail*/
	  
	        })
	        ,
	        this.on("complete", function(file){
   				file.previewElement.className += ' _gallery'+file.attachment_id;
	        });
	    },
	    success: function (file, response) {
	        file.previewElement.classList.add("dz-success");
	        file['attachment_id'] = response; // push the id for future reference
			
	        $("#media-uploader-ids").append('<input id="_gallery' + file['attachment_id'] +'" type="hidden" name="_gallery[' +file['attachment_id']+ ']"  value="'+file['name']+'">');

	    },
	    error: function (file, response) {
	        file.previewElement.classList.add("dz-error");
	    },
	    // update the following section is for removing image from library
	    addRemoveLinks: true,
	    removedfile: function(file) {
	        var attachment_id = file['attachment_id'];   
	        $('input#_gallery'+attachment_id).remove();
	        /*remove thumbnail if the image was set as it*/
	        if($('#_thumbnail_id').val() == attachment_id){
				$('#_thumbnail_id').val('');
	        }
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
}



$(document).ready(function(){
   
	$(document).on("click", ".truelysell_core-submit-image-preview", function(){

		$('.truelysell_core-submit-image-preview').removeClass('active-thumb');
		$(this).addClass('active-thumb');
		var id = $(this).data('thumb');
	
		$('#_thumbnail_id').val(id);
	});


	/*floorplans*/
		
	if($("#media-uploader._floorplans").length>0) {

	  	$(".dropzone").sortable({
	        items:'.dz-preview',
	        cursor: 'move',
	        opacity: 0.5,
	        containment: '.dropzone',
	        distance: 20,
	        tolerance: 'pointer',
		    update: sortinputs
	    }).disableSelection();

	  	function sortinputs(){
		    $('.dropzone .dz-preview').each(function(i, el){
		    	var p = $(el).attr('class').match(/\d+/g);
		    	
		        $('#media-uploader-ids input#_gallery' + p )
		            .remove()
		            .appendTo($('#media-uploader-ids'));
		                
		    });
		}
	}
// ------------------ End Document ------------------ //
});

})(this.jQuery);
/**/
