
    $(function() {
        $('#hidden_URL').val(current_URL);//URL is passed to action page for use on return. also used to reset the page
    });
    
    $('#btn_submit_image').on('click', function(){
        Submit_Form();
    });
    
    function Submit_Form() {
        $('#form_upload_image').submit();
    }

///*_____Remove URL Parameters__________________*/
    function Remove_URL_Parameters(base_URL){
        window.history.pushState("object", "Select New Image", base_URL);
    }
///*_____END Remove URL Parameters______________*/

///*_____Image Cropper__________________________*/  


    function Crop_Image_Intitializer(image_element){
        var $image = $(image_element);
        var $cropper = $image.cropper({
                aspectRatio: 200/300,
                minCanvasWidth:200,
                minCanvasHeight:300,
                minContainerHeight:300,
                minContainerWidth:200,
                minCropBoxWidth:50,
                minCropBoxHeight:100,
                crop: function(e) {
                    console.log('Center X: ' + e.x + '   Center Y: ' + e.y);
                    console.log('natural width: ' + e.width + '   natural height: ' + e.height);
                    console.log('rotate: ' + e.rotate + '\nscale X: ' + e.scaleX + '\nscale Y: ' + e.scaleY);
                }//END crop: function(e)
            });//END new Cropper()
             
        $('#btn_crop_image').on('click', function(){
            $('#hidden_cropped_flag').val('cropped');
            var canvas = $image.cropper('getCroppedCanvas');
            var dataURL = canvas.toDataURL();
            console.log('Crop click funcion\n'+dataURL);
            $('#server_image_container').fadeIn();
            $('#server_image_tag').attr( 'src',dataURL);
            var image = document.createElement('img');
            img.src = dataURL;
            var html_img_tag = '<img id="profile_image_file" class="profile_img" src="' + dataURL + '" /> '
            //$('#server_image_container').appendChild(image);
            $('#profile_image_file').fadeOut('slow');
            $('#profile_image_file').val('');
            $('#profile_image_file').attr( 'src',dataURL);
            $('#profile_image_file').show();
            //TODO: reduce data to server by reseting the original base64 string to nothing before submit $('#hidden_input_image_file').val('cropped');
            $('#hidden_input_image_file_cropped').val(html_img_tag);
            $('#hidden_input_image_file').val('');
            

        });//END btn_crop_image on click
    }//END Crop_Image_Intitializer()ropped
///*_____END Image Cropper______________________*/


///*_____Image Loader__________________________*/
//  The image_loader.js file relies on jQuery to create a drop zone area
//  Image dragged onto the dz are in base64 and are converted and saved to the server

    ///*_____Image File Properties on drop/select_____*/
    $('#input_manual_select').change(function(){
        console.log();
        Image_File_Properties(this);
    });
    ///*END Image File Properties*/

    function Image_File_Properties(input_element_id){
        //Image File Properties ( ifp ) assignment
        ifp_name   = input_element_id.files[0].name;
        ifp_size   = input_element_id.files[0].size;
        ifp_type   = input_element_id.files[0].type;
        ifp_width  = input_element_id.files[0].width;
        ifp_height = input_element_id.files[0].height;
        console.log('Image File Properties ( ifp ) assignment\n' + 
                'File Type : '   + ifp_type   + '\n'      +
                'File Name : '   + ifp_name   + '\n'      +
                'File Size : '   + ifp_size   + ' bytes'  + '\n' +
                'File Width : '  + ifp_width  + ' pixels' + '\n' +
                'File Height : ' + ifp_height + ' pixels');
    }
    ///*_____ drag & drop _____*/
    var reset_flag=0;
    var count_binding=0;
    var img = '';
    var dataTransfer  = '';
    var file_name     = '';
    var manual_upload = '';
    var error_message = '';
    
    function Prevent_Default_Propigation(e){
        e.preventDefault(); e.stopPropagation();
    }
    function Drag_Event_Over (e) {
        console.log('Drag_Event_Over '+e);$('#drop_zone_container').addClass('on_drag_over');
        /*$('#drop_zone_container').css({'border':'2px dashed rgba(102, 102, 102, 0.69)','border-radius':'3px'});*/
    }
    function Drag_Event_End  (e) {
        console.log('Drag_Event_End '+e);$('#drop_zone_container').addClass('on_drag_leave');
        /*$('#drop_zone_container').css({'border':'2px dashed #dee3e7','border-radius':'3px'});*/
    }
    function Drag_Event_Drop (e) {
        console.log('Drag_Event_Drop '+e);
        $('#drop_zone_container').css({'border':'2px dashed #00308F','border-radius':'3px'});/*$('#drop_zone_container').addClass('on_drag_drop');*/
    }
    
    $the_drop_zone = $('#image_drop_zone');
    $the_drop_zone.on({
        'dragover':  function(e) {try{Prevent_Default_Propigation(e);Drag_Event_Over(e);}catch(error_info){console.log('dragover\n'+error_info);}},//END dragover
        'dragstart': function(e) {try{Prevent_Default_Propigation(e);Drag_Event_Over(e);}catch(error_info){console.log('dragover\n'+error_info);}},//END dragstart
        'dragover':  function(e) {try{Prevent_Default_Propigation(e);Drag_Event_Over(e);}catch(error_info){console.log('dragover\n'+error_info);}},//END dragover
        'dragend':   function(ev){try{Prevent_Default_Propigation(e);Drag_Event_Over(e);}catch(error_info){console.log('dragover\n'+error_info);}},//END dragend
        'dragleave': function(ev){try{Prevent_Default_Propigation(e);Drag_Event_Over(e);}catch(error_info){console.log('dragover\n'+error_info);}},//END dragleave
        
        'drop': function(e) {
            Prevent_Default_Propigation(e);
            Drag_Event_Drop(e);
            //console.log(e.originalEvent instanceof DragEvent);
            try{
                dataTransfer =  e.originalEvent.dataTransfer;
                Image_File_Properties(dataTransfer);//show me the file properties
                
                if( dataTransfer && dataTransfer.files.length) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (dataTransfer.files[0].size > 4000000) { //TO DO: in action page check file size and restrict
                        Display_Dialog_Modal('File Size Too Big', 'Please limit file size to 4Mb.');
                        return;
                    }//END if file size > 4Mb

                    
                    $.each( dataTransfer.files, function(i, file) {
                        console.log('drop: function(e):\n' + file);
                        Preview_File(dataTransfer.files);
                        
                    });//END each loop            
                }//END if dataTransfer 
                else{alert('Warning: Image must be of type jpg, png, or gif.\nPlease select a different image.');}      
            }catch(e){
                console.log('ERROR in the drop event function:\n' + e);
            }//END try/catch
        }//END drop function
    });//
    /*_____ END drag & drop _____*/
    
    $('#input_manual_select').on('change', function() {
        var files   = document.querySelector('input[type=file]').files;
        console.log('on(change:\n' + files);
        Preview_File(files);
    });//END #input_manual_select
    
    
    ///*_____Modal Dialog______________________________________*/
    
    function Display_Dialog_Modal(temp_title, temp_message){
       // $('#label_dialog_message').html(temp_message);
        $('#dialog_modal').html('<p style="color:red;">' + temp_message + '</p>');
        $('#dialog_modal').dialog({
            title: temp_title,
            buttons: {Ok: function(){$(this).dialog('close');}}//END buttons
        });        
    }//END Display_Dialog_Modal()
    ///*_____END Modal Dialog__________________________________*/
    
    
    ///*_____display image after drag/drop or select event_____*/
    function Preview_File(file){
    console.log('Preview_File() function is:\n' + file);
        function Read_Preview(file) {
            try{
                if ( /\.(jpe?g|png|gif)$/i.test(file.name) ){// file extension pre-check
                    var reader = new FileReader();    
                    
                    $('#label_drop_zone').hide();
                    $('#label_loading').show();
                    reader.onload = $.proxy(function(file, $image_display_container, event) {
                        img = file.type.match('image.*') ? '<img id="profile_image_file" class="profile_img" src="' + event.target.result + '" /> ' : '';
                        $image_display_container.prepend( $("<span class='profile_img'>").append( img + '</span>') );//$image_display_container.append( $("<span class='image_name'>").append( file.name ) );
                        reset_flag=2;
                        //diaplay the image in a new field
                        $('#image_display_container').show();
                        $('#hidden_input_image_file').val(img);
                        Initialize_Display_Area();
                        Crop_Image_Intitializer('#profile_image_file');
                    }, this, file, $("#image_display_container"));//END reader.onload
                    reader.readAsDataURL(file);
                }//END if image match 
                else{alert('Warning: Image must be of type jpg, png, or gif.\nPlease select a different image.');}        
            }catch(e){
                console.log('ERROR Read_Preview(file):\n' + e);
            }//END try/catch       
        }//END Read_Preview()    
        if (file) {[].forEach.call(file, Read_Preview);}
    }///*_____END Preview_File(file)_____*/

    ///*_____ Change image _____*/
    $('#btn_change_image').on('click', function(e){
        Reset_Upload_Area();
    });///*_____ ENDChange image _____*/
    
    ///*_____Initialize Display*/
    function Initialize_Display_Area(){
        try{
            $('#file_select_container').hide();
            $('#image_drop_zone').hide();
            $('#btn_change_image').fadeIn( "slow");
            $('#btn_submit_image').fadeIn( "slow");
            $('#btn_crop_image').fadeIn( "slow");
            $('#label_loading').hide();
            $('#label_drop_zone').fadeIn( "slow");
        }catch(e){
            console.log('ERROR Initialize_Display_Area():\n' + e);
        }//END try/catch
    }///*_____END Initialize Display*/
    
    ///*_____Reset upload area_____*/
    function Reset_Upload_Area(){
        try{
            $('#file_select_container').show();
            $('#image_display_container').empty();//empty the image container
            $('#image_display_container').wrap('<form>').closest('form').get(0).reset();//wrap then unwrap element to perform a reset
            $('#image_display_container').unwrap();
            $('#image_display_container').hide();
            $('#input_manual_select').empty();//empty the image container
            $('#input_manual_select').wrap('<form>').closest('form').get(0).reset();//wrap then unwrap element to perform a reset
            $('#input_manual_select').unwrap();
            $('#input_manual_select').hide();
            $('#btn_change_image').hide();
            $('#image_drop_zone').fadeIn( "slow");
            $('#btn_submit_image').hide();
            $('#btn_crop_image').hide();
            $('#label_file_name' ).hide();
            $('#label_file_name' ).val('');
            $('#hidden_input_image_file').val('');
            $('#drop_zone_message').hide();
            //$('#hr_after_submit').hide();
            $('#label_after_submit' ).val('Select an image');
            //$('#label_after_submit').hide();
            
            $('#label_manual_select' ).html('Choose a file&hellip;');
        }catch(e){
            console.log('ERROR Reset_Upload_Area():\n' + e);
        }//END try/catch
    }///*_____END Reset_Upload_Area()_____*/
///*_____END Image Loader__________________________*/

    /*_____Return Action_____*/
    function Form_Submit_Message(url_param){
        switch(url_param){
            case( 'empty' ):
                //$( '#label_after_submit' ).text('Please select an image.').show( 'slow' );
                $('#label_after_submit').text('Please select an image.').show('slow').delay(5000).fadeOut( "slow");
                $('#hr_after_submit').show('slow').delay(5000).hide(0);
                //document.getElementById( '#label_after_submit' ).setAttribute( 'required', true );
                Reset_Upload_Area();
                Display_Dialog_Modal('Upload Failed', 'Please try again with a different image.');
                console.log('Please select an image. '+url_param);
            break;
            case( 'success' ):
                Reset_Upload_Area();
                Initialize_Display_Area();
                $( '#image_display_container' ).show();
                $( '#btn_submit_image' ).hide();
                $( '#btn_crop_image' ).hide();
                $('#btn_change_image').hide();
                //create space to prevent shifting up and down
                $('#btn_change_image').hide('slow').delay(5000).show(0);
                $( '#label_after_submit' ).text('Successful Image Upload');
                $( '#label_after_submit' ).attr('class','label_success_text');
                $( '#drop_zone_message').show('slow').delay(3799).fadeOut( "slow");
                //$('#hr_after_submit').show('slow').delay(5000).hide(0);
                console.log('Successful image upload. '+url_param);
            break;
            case( 'not_post' ):
                $( '#label_after_submit' ).text('Error. Please contact the webmaster: Form submit not POST').show('slow').delay(5000).fadeOut( "slow");
                $('#hr_after_submit').show('slow').delay(5000).hide(0);
                console.log('Error... '+url_param);
            break;
            default:
                $( '#label_after_submit' ).text('Default Text').show('slow').delay(5000).fadeOut( "slow");
                $('#hr_after_submit').show('slow').delay(5000).hide(0);
                console.log('Error... '+url_param);
            break;
        }
    }///*_____END Return Action__________________________*/