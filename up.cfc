<cfcomponent>
<!---common queries for image upload--->



    <!--- establish user profile info --->
    <cffunction name="session_user_profile" access="public" returntype="query">
        <!---<cfset variables.impersonate_id=1563>---> <!---Impersonate User here for testing (4607 cherochak)--->
        <cfquery name="get_session_user_profile" datasource="#request_the_database.source#">
            SELECT id, cac_edipi, first_name,  last_name,  middle_initial,  symbol,  phone_number
            FROM user_info
            WHERE 
                <cfif isdefined("variables.impersonate_id")>
                    id=<cfqueryparam value="#variables.impersonate_id#">
                <cfelse>
                    user_info.cac_edipi='#trim(listlast(cgi.cert_subject,"."))#'
                </cfif>
        </cfquery>
        <cfreturn get_session_user_profile>
    </cffunction>




<!------>
</cfcomponent>
