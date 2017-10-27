<cfsetting showdebugoutput="true">

<cfinvoke component="up" method="session_user_profile" returnvariable="get_session_user_profile"/>
<cfset file_name_on_server = "">

<!doctype html>
<head>
    <cfheader name="X-UA-Compatible" value="IE=EDGE" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge"> 
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <cfset html_title = #get_session_user_profile.first_name# >
    <title><cfoutput>#html_title#</cfoutput>, Upload Test</title>
    <meta name="author" content="Adam Cherochak">
    <meta name="description" content="Image Upload Test">
    <meta name="keywords" content="image upload">

    <link rel="stylesheet" type="text/css" href="/adpe/jqueryui/jquery-ui.min.css" />
    <link rel="stylesheet" type="text/css" href="/asdweb_main.css" />
    <script src="/adpe/jqueryui/external/jquery/jquery.js"></script>
    <script src="/adpe/jqueryui/jquery-ui.min.js"></script>
    <script src="/rqoogle/app_js.js"></script>
    <!--- image cropper scripts --->
    <script src="cropper.js"></script>
    <link rel="stylesheet" type="text/css" href="cropper.css">
    
    <style type="text/css">
        :root {
            --button-font: normal normal 14px Arial, Sans-Serif;
            --rgba_white:       rgba(255,255,255,1.00); /*#FFFFFF*/
            --rgba_blue:        rgba(0  ,48 ,143,1.00); /*#00308f*/
            --rgba_brightblue:  rgba(0  ,73 ,209,1.00); /*#0049d1*/
            --rgba_midnightblue:rgba(0  ,73 ,209,1.00); /*#1d345c*/
            --rgba_teal:        rgba(0  ,73 ,209,1.00); /*#00aef0*/
            --rgba_maroon:      rgba(119,58 ,58 ,1.00); /*#773a3a*/
            --rgba_cornFblue:   rgba(189,206,239,1.00); /*#BDCEEF*/
            --rgba_lightmaroon: rgba(199,156,157,1.00); /*#F0F0F0*/
            --rgba_cornFblue_2: rgba(215,227,248,1.00); /*#F2F5FC*/
            --rgba_lightgrey:   rgba(240,240,240,1.00); /*#F0F0F0*/
        }
        body{background-color:255,255,255,1.00;font:normal normal 16px Arial,"Helvetica Neue",Helvetica,sans-serif;color:#A6B6C2;} /* 255,255,255,1.00 */
        h2  {color:var(--rgba_white_100);text-align:center;}
        .hr_gradient      {background: linear-gradient(to right, white 0%, #83AC8E 50%, white 100%);border: 0;margin: 1.5em auto;height: 1px;width: 75%;}
        .hr_gradient      {margin-top:-0px;}
        .clear_both       {border:0px solid blue;width:100%;height:4px;margin-top:4px;clear:both;}
        .display_none     {display:none;}
        .div_wrapper_main {width:100%;display:flex;justify-content:center;align-items:center;}
        
        .modern_button       {letter-spacing:0.1px;color:#F2F5FC;text-align:center;text-decoration:none;background-color:#00308F;
        transition: background-color 0.5s ease, border 0.5s ease;border:0px solid #BDCEEF;padding:5px 8px;}
        .modern_button:hover {background-color:#0049D1;border:0px solid #D7E3F8;color:#ffffff;cursor:pointer;}
        .modern_button:active{background-color:#062AFC;border:0px solid #D7E3F8;color:#ffffff;}

        
        #label_loading    {display:none;line-height:300px;vertical-align:middle;}
        #label_drop_zone  {/*line-height:300px;*/vertical-align:middle;}
        #label_action_drop{line-height:300px;vertical-align:middle;}
        
        
        /*Drop Zone and Image Upload Area*/
        #drop_zone_container       {width:216px;height:346px;border:2px dashed #dee3e7;border-radius:3px;}
        #drop_zone_container:hover {border:2px dashed rgba(102, 102, 102, 0.69);}
        #drop_zone_container, .border_static {} 
        /*attempt to use svg through css*/

        /**/
                               
        /*custom upload button*/
        .input_select_image           {width:0.1px;height:0.1px;/**/position:absolute;overflow:hidden;opacity:0;z-index:-1;}
        .input_select_image + label * {pointer-events: none;}
        .input_select_image + label   {cursor: pointer;display:inline-block;font:var(--button-font);letter-spacing:0.1px;}
        #label_file_name              {font:var(--button-font);letter-spacing:0.1px;}
        #input_manual_select          {}
        /*END custom upload button*/
        
        .profile_img {width:200px;height:300px;}

        #image_drop_zone        {text-align:center;color:#A6B6C2/*#3b4045font:var(--special-font);#F2F5FC*/;
                                 font:bold normal 18px Arial,"Helvetica Neue",Helvetica,sans-serif;
                                 width:200px;height:300px;
                                 background-color:rgba(229, 229, 229, 0.30);transition:background-color 300ms ease,border 300ms ease;
                                                        
                                }
        #image_drop_zone:before {line-height:300px;vertical-align:middle;/*content: attr(data-action-drop);*/}
        #image_drop_zone:hover  {color:rgba(102, 102, 102, 0.69);
                                 background-color:rgba(229, 229, 229, 0.75);transition:background-color 300ms ease,border 300ms ease;}
        
        #image_display_container        {display:none;border:0px dashed #D7E3F8;text-align:center;width:200px;height:300px;margin-bottom: 4px;}
        #image_display_container:hover  {border:0px dashed #0049D1;background-color:#D7E3F8;transition:background-color 0.5s ease, border 0.5s ease;}
        #image_display_container:active {border:0px dashed rgba(199,156,157,1.00);}
        
        #drop_zone_buttons{background:linear-gradient(to right, #D7D7D7 0%, white 50%, #D7D7D 100%);}
        #btn_crop_image{margin:0 2px 0 2px;}
        #btn_change_image{}
        #btn_submit_image{}
        
        .flex_center_column {display:flex;flex-direction:column;align-items:center;justify-content:center;/*FLEX CENTER COLUMN*/}
        .flex_center_row    {display:flex;flex-direction:row;align-items:center;justify-content:center;/*FLEX CENTER ROW*/}

        .border_static{border:4.5px dashed blue;}
        .border_hover {border:4.5px dashed lightblue;}
        
        .on_drag_over{border:2px dashed #dee3e7;}
        .on_drag_leave{border:2px dashed rgba(102, 102, 102, 0.69);}
        .on_drag_drop{border:2px dashed #00308F;}
        /*
        $('#image_drop_zone').css({'border':'1px dashed #0049D1'});
        $('#image_drop_zone').css({'background-color':'#D7E3F8', 'transition':'background-color 0.5s ease, border 0.5s ease'});
        */
       
        /*END Drop Zone*/
        /**/
        .label_success_text{}
.label_warning_red{color:red;}
.label_warning_reset{color:#A6B6C2;}
.div_warning_red{background-color:red);transition:background-color 300ms ease,border 300ms ease;}
.div_warning_red:hover{background-color:red;transition:background-color 300ms ease,border 300ms ease;}
.div_warning_reset{background-color:rgba(229, 229, 229, 0.24);transition:background-color 300ms ease,border 300ms ease;}

    </style>  
<!--- set coldfusion variables to javascript variables --->
    <cfset cf_first_name = #get_session_user_profile.first_name#>
    <cfset cf_last_name = #get_session_user_profile.last_name#>
    <script>
        <cfoutput>
            var #toScript(cf_first_name, "js_first_name")#;
            var #toScript(cf_last_name,  "js_last_name")#;
        </cfoutput>	
        var currentState = history.state;
        var current_URL = window.location.href;//URL is passed to action page for use on return. also used to reset the page
        //Image File Properties ( ifp ) initialization
        var ifp_name   = '';
        var ifp_size   = '';
        var ifp_type   = '';
        var ifp_width  = '';
        var ifp_height = '';
    </script>
<!--- END set coldfusion variables --->
</head>

<body>
    <!--- DRAG and DROP --->
    <div id="drag_drop_container" class="div_wrapper_main">
                <form action="up_action.cfm" method="post"  id="form_upload_image"  name="form_upload_image">
                    <!---hidden fields--->
                    <input type="hidden" id="hidden_URL" name="hidden_URL" />
                    <input type="hidden" id="hidden_file_name" name="hidden_file_name" />
                    <input type="hidden" id="hidden_file_size" name="hidden_file_size" />
                    <input type="hidden" id="hidden_file_type" name="hidden_file_type" />                    
                    <input type="hidden" id="hidden_cropped_flag" name="hidden_cropped_flag" />
                    <input type="hidden" id="hidden_input_image_file" name="hidden_input_image_file" />
                    <input type="hidden" id="hidden_input_image_file_cropped" name="hidden_input_image_file_cropped" />
                    
                    <!---END hidden fields --->
                    <div id="drop_zone_container" class="flex_center_column">
                        <div id="image_drop_zone" data-action-drop="Drop Image Here" class="flex_center_column">
                            <!--- the image is generated through jQuery and placed into the image_drop_zone container <img id="profile_image_file" class="profile_img" --->
                                                         <!---  width="86px" height="86px" viewBox="0 250 100 150" --->
                                <style>
                                /*.svg_cloud_icon{width:50px;height:75px;}*/
                                /*.svg_cloud_icon:hover{width:50px;height:75px;}*/
                                
                                </style>
                                    <svg id="svg_cloud_icon_1" class="svg_cloud_icon" width="50" height="75" viewBox="13 0 60 75" 
                                          version="1.1" xmlns="http://www.w3.org/2000/svg"
                                          xmlns:xlink="http://www.w3.org/1999/xlink"
                                          xmlns:ev="http://www.w3.org/2001/xml-events" >
                                    
                                        <g id="g_cloud_icon_shadow" xmlns="http://www.w3.org/2000/svg">
                                            <ellipse id="cloud_icon_shadow" fill="#DEE3E7" cx="43.3" cy="73.9" rx="37.6" ry="4.1"/>
                                            <g id="g_cloud_icon_cloud">
                                                <path id="path_icon_cloud" fill="#A6B6C2"
                                                      d="M69.4,21.5C66.9,9.2,56,0,43,0C32.6,0,23.7,5.8,19.2,14.4C8.4,15.5,0,24.6,0,35.6C0,47.5,9.6,57,21.5,57
                                                         h46.6C78,57,86,49,86,39.2C86,29.8,78.6,22.2,69.4,21.5z"/>
                                                <polygon id="polygon_icon_cloud" fill="#F0F2F4" 
                                                         points="50.2,32.1 50.2,46.3 35.8,46.3 35.8,32.1 25.1,32.1 43,14.3 60.9,32.1 "/>
                                            </g>
                                        </g>
                                    </svg>
                            <span id="label_drop_zone">Drop Image Here</span>
                            <span id="label_loading" style="">loading...</span>
                        </div>
                        <div id="image_display_container"></div>
                        <div id="file_select_container" style="margin-top:4px;border:0px solid red;width:200px;">
                            <div id="upload_icon_div_2" class="modern_button">
                                <input required type="file" accept="image/*" 
                                       class="input_select_image"
                                       id="input_manual_select" name="input_manual_select" />
                                <label for="input_manual_select" style="width:100%;height:100%;">        
                                    <svg width="20" height="17" viewBox="0 0 20 17"
                                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                        <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 
                                                 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 
                                                 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 
                                                 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 
                                                 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"
                                               fill="rgba(215,227,248,1.00)" stroke-width="1" stroke="rgba(215,227,248,1.00)" />
                                    </svg> 
                                    <span id='label_manual_select'>Choose a file&hellip;</span>
                                </label>
                            </div><!---END upload_icon_div_2 --->
                        </div><!---END file_select_container--->
                        <div id="drop_zone_buttons" class="flex_center_row">                        
                        <div id="drop_zone_message" style="clear:both;text-align:center;">
                            <span id="label_after_submit"></span>
                            <hr id="hr_after_submit" class="hr_gradient" style="margin-bottom:-2px;">
                        </div>
                            <div id="btn_change_image" class="display_none modern_button">
                                <span id="label_undo_image">Change</span>
                            </div>                        
                            <div id="btn_crop_image" class="display_none modern_button">
                                <span id="label_crop_image">Crop</span>
                            </div>                        
                            <div id="btn_submit_image" class="display_none modern_button">
                                <span id="label_submit_image">Submit</span>
                            </div>
                        </div>                   
                    </div><!---END drop zone wrapper--->
                                      
                </form><!---END form --->
                
        </div><!---END drag and drop container--->

    <div id="server_image_container" class="flex_center_row" style="clear:both;display:none;margin:25px 0 25px 0;min-width:50px;">
        <img id="server_image_tag" alt="Profile Image" style="border:1px solid red;min-width:150px;min-height:150px;" src="" />
    </div><!---END server_image_container--->

<div id="dialog_modal" title="Dialog Message" style="display:none;">
    <span class="ui-icon ui-icon-circle-check" style="float:left; margin:0 7px 50px 0;"><label id="label_dialog_message"></label></span>
</div>

    <script src="profile_image_scripts.js"></script>
        <cfset cf_cacedipi_folder = #get_session_user_profile.cac_edipi#>
        <cfset cf_replace_URL = #ListLast(CGI.SCRIPT_NAME,'?')#>
<cfif structkeyexists(url, 'msg') and url.msg EQ 'success'>
<!---Success Status Parameter--->

    <!---get image name from url --->
<cfset cf_img_file_name = #url.img#>
    
    <!---<cfimage action="info" source="#cf_cacedipi_folder#/#cf_img_file_name#" name="myImage" structname = "myImage">--->
    <script>
        <cfset cf_url_msg = #url.msg#>
        <cfoutput>var #toScript(cf_url_msg, "js_url_msg")#;</cfoutput>
        <cfoutput>var #toScript(cf_img_file_name, "js_img_file_name")#;</cfoutput>
        <cfoutput>var #toScript(cf_cacedipi_folder, "js_cacedipi_folder")#;</cfoutput>
        <cfoutput>var #toScript(cf_replace_URL, "js_replace_URL")#;</cfoutput>
        Remove_URL_Parameters(js_replace_URL);
        
        var url_param = js_url_msg;
        Form_Submit_Message(url_param);
        var img_src = js_img_file_name;
            $('#label_drop_zone').hide();
            $('#label_loading').show();
            
        var img_tag = '<img id="profile_image_file" class="profile_img" src="'+js_cacedipi_folder +'/' + js_img_file_name + '" /> ';
        $('#image_display_container').prepend( $("<span class='profile_img'>").append( img_tag + '</span>') );
        $('#label_loading').hide();
        $('#label_drop_zone').fadeIn( "slow");
        //Crop_Image('#profile_image_file');
    </script>
    
<cfelseif structkeyexists(url, 'msg') and url.msg EQ 'empty'>

    <script>
        <cfset cf_url_msg = #url.msg#>
        <cfoutput>var #toScript(cf_url_msg, "js_url_msg")#;</cfoutput>
        <cfoutput>var #toScript(cf_replace_URL, "js_replace_URL")#;</cfoutput>
        var url_param = js_url_msg;
        Form_Submit_Message(url_param);
        Remove_URL_Parameters(js_replace_URL);
    </script>
    
<cfelseif structkeyexists(url, 'msg') and url.msg EQ 'not_post'>

    <script>
        <cfset cf_url_msg = #url.msg#>
        <cfoutput>var #toScript(cf_url_msg, "js_url_msg")#;</cfoutput>
        <cfoutput>var #toScript(cf_replace_URL, "js_replace_URL")#;</cfoutput>
        var url_param = js_url_msg;
        Form_Submit_Message(url_param);
        Remove_URL_Parameters(js_replace_URL);
    </script>
</cfif>     
</body>
</html>