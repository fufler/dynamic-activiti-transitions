<#if form.mode == "edit" && ((form.data['prop_bpm_status']?? && form.data['prop_bpm_status'] != 'Completed') || form.data['prop_bpm_status']?? == false)>
<#assign mandatoryFieldsParams=[] />
<#list field.control.params?keys as key>
    <#assign keys=key?split(".") />
    <#if keys[0]="mandatoryFields">
        <#assign mandatoryFieldsParams=mandatoryFieldsParams + [keys[1]] />
    </#if>
</#list>

<script type="text/javascript">//<![CDATA[
(function()
{
   new Alfresco.DynamicActivitiTransitions("${fieldHtmlId}").setOptions(
   {
      currentValue: "${field.control.params.options?js_string}",
	  mandatoryFields : {  <#list mandatoryFieldsParams as param>
							<#assign fields=field.control.params["mandatoryFields."+param]?split(",") />
							"${param}": [
								<#list fields as field>
									"${field}"<#if field_has_next>,</#if>
								</#list>
							]<#if param_has_next>,</#if>
						</#list>},
      hiddenFieldName: "${field.name}"
   }).setMessages(
      ${messages}
   );
})();
//]]></script>

<div class="form-field suggested-actions" id="${fieldHtmlId}">
   <div id="${fieldHtmlId}-buttons">
   </div>
</div>
</#if>
