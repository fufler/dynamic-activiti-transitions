(function(){var e=YAHOO.util.Dom,c=YAHOO.util.Event;var b=Alfresco.util.encodeHTML;Alfresco.DynamicActivitiTransitions=function(g){Alfresco.DynamicActivitiTransitions.superclass.constructor.superclass.constructor.call(this,"Alfresco.DynamicActivitiTransitions",g,["button","container"]);YAHOO.Bubbling.on("afterFormRuntimeInit",this._patchFormsRuntime,this);return this};YAHOO.extend(Alfresco.DynamicActivitiTransitions,Alfresco.ActivitiTransitions,{buttons:{},form:null,states:{},options:{mandatoryFields:null},_generateNewValidationHandler:function(g,h){return function(q,p,j,k){var n=h;var o=g(q,p,j,k);var m=q.id.split("_");var s=m[m.length-2]+":"+m[m.length-1];h.states[s]=o;for(var t in n.options.mandatoryFields){var l=true;for(var r in n.options.mandatoryFields[t]){var i=n.options.mandatoryFields[t][r];if(i==""){continue}l=l&&n.states[i]}n.buttons[t].set("disabled",!l)}return o}},_patchFormsRuntime:function a(k,h){var j=h[1].component.formsRuntime;var i=e.get(this.id);while(i.tagName!="FORM"){i=i.parentElement}if(i.id!=j.formId){return}this.jsForm=j;this.form=i;for(var g in j.validations){var l=j.validations[g];l.handler=this._generateNewValidationHandler(l.handler,this)}},onClick:function d(g,h){this.jsForm._runValidations=function(){return true};Alfresco.DynamicActivitiTransitions.superclass.onClick.call(this,g,h)},_generateTransitionButton:function f(h){var g=document.createElement("input");g.setAttribute("id",this.id+"-"+h.id);g.setAttribute("value",h.label);g.setAttribute("type","button");e.get(this.id+"-buttons").appendChild(g);var g=Alfresco.util.createYUIButton(this,h.id,this.onClick);this.buttons[h.id]=g}})})();