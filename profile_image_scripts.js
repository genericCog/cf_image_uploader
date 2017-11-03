/*  File: profile_image_scripts.js
    Called From: index.cfm  Associated Files: index.cfm, profile_image_scripts.js, image_cropper.js, up_action.cfm, up.cfc
    Purpose: Implements image upload functionality with error handling.
    Functions:
        1. Remove_URL_Parameters(base_URL)
        2. Create_Toggle_Label(lbl_class, lbl_text, toggle_mode)
        3. Toggle_Button(btn_id_1, btn_id_2, btn_id_3, toggle_mode)
        4. Prevent_Default(e)
        5. Drop_Zone_Hover()
        6. Drop_Zone_Normal()
        7. Trigger_On_Click()
        8. Preview_File(file)
        9. Initialize_Display_Area()
        10. Reset_Upload_Area()
        11. Form_Submit_Message(url_param)
        12. Success_Display_Server_Image(url_msg_parameter, session_cacedipi, img_file_name_parameter, replace_URL)
        13. Image_File_Properties(input_element_id)
*/
    function Remove_URL_Parameters(base_URL){window.history.pushState("object", "Select New Image", base_URL);}//Remove URL Parameters Used In: template_URL_parameters.cfm

    
    $(function() { $('#hidden_URL').val(current_URL); });//TO DO: URL is passed to action page for use on return. also used to reset the page    
    
    ///*_____Modal Dialog______________________________________*/
    function Display_Dialog_Modal(temp_title, temp_msg, temp_class, form_submit){
        console.log('*_*_*Modal Event'+'\nform_submit: '+form_submit+'\ntemp_title: '+temp_title+'\ntemp_msg:'+temp_msg+'\ntemp_class: '+temp_class+'\n_____'); 
        var temp_title = temp_title || 'Notice';
        var temp_msg   = temp_msg   || 'No message sent';
        var temp_class = temp_class || 'temp_modal_default';
        var form_submit=form_submit || 'false';   
        $('#dialog_modal').html('<p class="temp_modal '+ temp_class + '">' + temp_msg + '</p>');
            if(form_submit=='true'){
                $('#dialog_modal').dialog({ title: temp_title, 
                    buttons: {
                        Edit: function(){$(this).dialog('close');temp_title=''; temp_msg=''; temp_class=''; form_submit='';},
                        Close: function(){$(this).dialog('close');temp_title=''; temp_msg=''; temp_class=''; form_submit='';},
                        Submit: function(){$('#form_upload_image').submit();temp_title=''; temp_msg=''; temp_class=''; form_submit='';}
                    } 
                });
            }else if(form_submit=='false'){
                $('#dialog_modal').dialog({ title: temp_title, buttons: {Ok: function(){$(this).dialog('close');temp_title=''; temp_msg=''; temp_class=''; form_submit='';}} });
            }
                
    }///*_____END Modal Dialog__________________________________*/
    
    ///*_____Toggle Labels & Buttons______________________________________*/
    function Create_Toggle_Label(lbl_class, lbl_text, toggle_mode){
        var lbl_class = lbl_class || "defaultValue";
        var lbl_text = lbl_text || "defaultValue"; 
        var toggle_mode = toggle_mode || 'hide';       
         switch(toggle_mode){
            case( 'show' ):
                var $temp_label = $('<label />',{id:'temp_label',className:lbl_class,html:lbl_text});
                $('#drop_zone_buttons').append($temp_label);
                $('#temp_label').fadeIn("slow");
                break;
            case( 'hide' ):
            console.log('Show buttons:\n' + lbl_class, lbl_text, btn_id_1, btn_id_2, btn_id_3, toggle_lbl_btn);
                $('#temp_label').hide();
                break;
            default:
            break;
         } 
    }
    function Toggle_Button(btn_id_1, btn_id_2, btn_id_3, toggle_mode){
        var btn_id_1 = btn_id_1 || "defaultValue";
        var btn_id_2 = btn_id_2 || "defaultValue";
        var btn_id_3 = btn_id_3 || "defaultValue";  
        var toggle_mode = toggle_mode || 'show';         
         switch(toggle_mode){
            case( 'show' ):
                $('#drop_zone_buttons').show();        
                $('#btn_id_1').fadeIn('slow');
                $('#btn_id_2').fadeIn('slow');
                $('#btn_id_3').fadeIn('slow');
                break;
            case( 'hide' ):       
                $('#btn_change_image').hide();
                $('#btn_crop_image').hide();
                $('#btn_submit_image').hide();
                break;
            default:
            break;
         } 
    }
///*_____END Toggle Labels & Buttons______________________________________*/



///*_____Image Loader__________________________*/
    var max_file_size = 2500000;

    
    
    ///*_____ drag & drop _____*/
    //  Images dragged onto the dz or selected through file system are in base64 then converted and saved to the server
    var img   = '';
    var dataTransfer  = '';
    var file_name     = '';
    var manual_upload = '';
    var error_message = '';
    var b64_img_tag_open  = '';
    var b64_img_tag_close = '';
    
    function Prevent_Default(e){e.preventDefault(); e.stopPropagation(); console.log('*_*_*EVENT: Prevent_Default(e) function called | e.type: ' + e.type+'\n_____'); }
    function Drop_Zone_Hover(){
        $('#drop_zone_container').addClass('dz_container_over');
        $('#image_drop_zone').addClass('dz_over');
    }
    function Drop_Zone_Normal(){
        $('#drop_zone_container').removeClass('dz_container_over');
        $('#drop_zone_container').addClass('dz_container_normal');
        $('#image_drop_zone').removeClass('dz_over');
    }
    
    function Trigger_On_Click(){$('#input_manual_select').trigger('click');}
    
    $('#input_manual_select').on('change', function(e) {console.log('*_*_*EVENT: change on the upload_icon_div_2 | e.type:' + e.type+'\n_____');
        var files = document.querySelector('input[type=file]').files;
        Image_File_Properties(this);
        if (files[0].size > max_file_size) {
            Display_Dialog_Modal('File Size Too Big', 'Please limit file size to 4Mb.','temp_modal_red');
            Reset_Upload_Area();
            return;
        }
        Preview_File(files);
    });
    
    $('#btn_change_image').on('click', function(e){ Reset_Upload_Area(); });    
    $('#btn_submit_image').on('click', function(){ 
        Create_Toggle_Label('temp_label_blue', 'Loading...', 'show');
        Toggle_Button('#btn_change_image', '#btn_crop_image', '#btn_submit_image', 'hide');
        $('#form_upload_image').submit();
    });
    
    $the_drop_zone = $('#image_drop_zone');

    $the_drop_zone.on({
        //'click':     function(e) {try{$('#input_manual_select').trigger('click');}catch(error_info){console.log('ERROR click\n'+e.type+'\n'+error_info);}},
        'click':     function(e) {console.log('event on the drop zone ' + e.type);Trigger_On_Click();},
        'dragstart': function(e) {try{Prevent_Default(e);Drop_Zone_Hover();}catch(error_info){console.log('ERROR dragstart\n'+e+'\n'+error_info);}}, //END dragstart
        'dragover':  function(e) {try{Prevent_Default(e);Drop_Zone_Hover();}catch(error_info){console.log('ERROR dragover\n'+e+'\n'+error_info);}},   //END dragover
        'dragend':   function(e) {try{Prevent_Default(e);Drop_Zone_Normal();}catch(error_info){console.log('ERROR dragend\n'+e+'\n'+error_info);}},     //END dragend
        'dragleave': function(e) {try{Prevent_Default(e);Drop_Zone_Normal();}catch(error_info){console.log('ERROR dragleave\n'+e+'\n'+error_info);}},   //END dragleave
        
        'drop': function(e) {
            Prevent_Default(e);
            Drop_Zone_Normal();
            //console.log(e.originalEvent instanceof DragEvent);
            try{
                dataTransfer =  e.originalEvent.dataTransfer;
                Image_File_Properties(dataTransfer);//show me the file properties
                
                if( dataTransfer && dataTransfer.files.length) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (dataTransfer.files[0].size > max_file_size) { //TO DO: in action page check file size and restrict
                        Reset_Upload_Area();
                        Display_Dialog_Modal('File Size Too Big', 'Please limit file size to 4Mb.','temp_modal_red');
                        return;
                    }//END if file size > 4Mb
                    
                    $.each( dataTransfer.files, function(i, file) {
                        console.log('*_*_*EVENT: drop: function(e) | file info:' +file+'\n_____');
                        Preview_File(dataTransfer.files);
                    });//END each loop            
                    
                }//END if dataTransfer 
                else{ Display_Dialog_Modal('File Type Incorrect', 'Image must be of type jpg, png, or gif.\nPlease select a different image.','temp_modal_red'); }      
            }catch(e){Display_Dialog_Modal('Unknown Error', 'Please contact webmaster.\nError Message:Unknown error in drop event.','temp_modal_red');}
        }//END drop function
    });//
    /*_____ END drag & drop _____*/


    ///*_____display image after drag/drop or select event_____*/
    function Preview_File(file){
        console.log('*_*_*EVENT: Preview_File(file) | file info:' +file+'\n_____');
        function Read_Preview(file) {
            try{
                if ( /\.(jpe?g|png|gif)$/i.test(file.name) ){// file extension pre-check
                    var reader = new FileReader();    
                    
                    $('#label_drop_zone').hide();
                    $('#label_loading').show();
                    
                    reader.onload = $.proxy(function(file, $image_display_container, event) {
                        img = file.type.match('image.*') ? '<img id="profile_image_file" class="profile_img" src="' + event.target.result + '" /> ' : '';//file extension check
                        $image_display_container.prepend( $("<span class='profile_img'>").append( img + '</span>') );
                        
                        $('#image_display_container').show();   //diaplay the image in a new field
                        $('#hidden_input_image_file').val(img); //prep send to server
                        
                        Initialize_Display_Area();
                        Crop_Image_Intitializer('#profile_image_file', '#btn_crop_image', '#hidden_input_image_file_cropped', '#hidden_input_image_file', true);
                        
                    }, this, file, $("#image_display_container"));//END reader.onload
                    reader.readAsDataURL(file);
                }//END file extension pre-check 
                else{  Display_Dialog_Modal('File Type Incorrect', 'Image must be of type jpg, png, or gif.\nPlease select a different image.', 'temp_modal_red');}        
            }catch(e){ Display_Dialog_Modal('Unknown Error', 'Please contact webmaster\nError Message: Unknown error occured, in function Preview_File()\n'+e, 'temp_modal_red'); }//END try/catch
            
        }//END Read_Preview()    
        
        if (file) {[].forEach.call(file, Read_Preview);}
        
    }///*_____END Preview_File(file)_____*/


    ///*_____Initialize Display*/
    function Initialize_Display_Area(){
        //used in: Form_Submit_Message
        try{
            $('#file_select_container').hide();
            $('#image_drop_zone').hide();
            $('#btn_change_image').fadeIn( "slow").removeClass('display_none');
            $('#btn_submit_image').fadeIn( "slow").removeClass('display_none');
            $('#btn_crop_image').fadeIn( "slow").removeClass('display_none');
            $('#label_loading').hide();
            $('#label_drop_zone').fadeIn( "slow");
        }catch(e){
            console.log('*_*_*ERROR: Initialize_Display_Area() | e:' +e+'\n_____');
        }//END try/catch
    }///*_____END Initialize Display*/
    
    
    ///*_____Reset upload area_____*/
    function Reset_Upload_Area(){
        //used in: Form_Submit_Message
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
            console.log('*_*_*ERROR: Reset_Upload_Area() | e:' +e+'\n_____');
        }//END try/catch
    }///*_____END Reset_Upload_Area()_____*/
///*_____END Image Loader__________________________*/

    /*_____Return Action_____*/
    function Form_Submit_Message(url_param){
        // used in template.cfm
        switch(url_param){
            case( 'empty' ):
                Reset_Upload_Area();
                Display_Dialog_Modal('Upload Failed', 'Please try again with a different image.', 'temp_modal_red');
                console.log('*_*_*ERROR: Empty URL Parameter | url_param:' +url_param+'\n_____');
            break;
            case( 'success' ):
                Reset_Upload_Area();
                Initialize_Display_Area();
                $( '#image_display_container' ).show();
                $('#hr_after_submit').show();
/*        Create_Toggle_Label('temp_label_green', 'Successful Image Upload', 'show');
        Toggle_Button('#btn_change_image', '', '', 'show');*/
                //Toggle_Labels_Buttons('temp_label_green', '', '#btn_change_image', '', '', 'show_btn');

                $( '#btn_submit_image' ).hide();
                $( '#btn_crop_image' ).hide();
                $('#btn_change_image').hide();
                $( '#label_after_submit' ).text('Successful Image Upload');
                $( '#label_after_submit' ).attr('class','label_success_text');
                //TO DO: create space to prevent shifting up and down
                $('#btn_change_image').css({'width':'100%'}).hide('slow').delay(5000).show(0);
                $( '#label_after_submit' ).text('Successful Image Upload');
                $( '#label_after_submit' ).attr('class','label_success_text');
                $( '#drop_zone_message').show('slow').delay(3799).fadeOut( "slow");
                $('#hr_after_submit').show('slow').delay(5000).hide(0);
                console.log('*_*_*SUCCESS: Image upload | url_param:' +url_param+'\n_____');
            break;
            case( 'not_post' ):
                Reset_Upload_Area();
                Display_Dialog_Modal('Upload Failed', 'Please contact the webmaster.\nError Message: Form submit is not POST', 'temp_modal_red');
                console.log('*_*_*ERROR: Not Form POST | url_param:' +url_param+'\n_____');
            break;
            default:
                Reset_Upload_Area();
                Display_Dialog_Modal('Unknown URL Parameter', 'Please contact the webmaster.\nError Message: Unknown URL Parameter '+url_param, 'temp_modal_red');
                console.log('*_*_*ERROR: Unknown URL Parameter | url_param:' +url_param+'\n_____');
            break;
        }
    }///*_____END Return Action__________________________*/

    function Success_Display_Server_Image(url_msg_parameter, session_cacedipi, img_file_name_parameter, replace_URL){
        //Used In: template_URL_parameters.cfm
        Form_Submit_Message(url_msg_parameter);
        $('#label_drop_zone').hide();
        $('#label_loading').show();
        
        var img_tag = '<img id="profile_image_file" class="profile_img" src="' + session_cacedipi +'/' + img_file_name_parameter + '" /> ';
        $('#image_display_container').prepend( $("<span class='profile_img'>").append( img_tag + '</span>') );
        
        $('#label_loading').hide();
        $('#label_drop_zone').fadeIn( "slow");
    }//END Success_Display_Server_Image()

    function Image_File_Properties(input_element_id){
    /*Used In: input_manual_select on change, 
      Purpose: Called on the change event of an HTML input element.
               Writes console log.
               */
        ifp_name   = input_element_id.files[0].name;
        ifp_size   = input_element_id.files[0].size;
        ifp_type   = input_element_id.files[0].type;
        ifp_width  = input_element_id.files[0].width;
        ifp_height = input_element_id.files[0].height;
        console.log('*_*_*Image File Properties ( ifp ) assignment\n' + 'File Type : ' + ifp_type + '\n' + 'File Name : ' + ifp_name + '\n' + 'File Size : ' + ifp_size + ' bytes'  + '\n' + 'File Width : ' + ifp_width  + ' pixels' + '\n' + 'File Height : ' + ifp_height + ' pixels');
    }//END Image File Properties ( ifp )
