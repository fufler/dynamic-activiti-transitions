/**
 * Copyright (C) 2013 Alexey Ermakov & Charles Le Seac'h
 *
 * This file is not part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Dynamic Activiti Transitions form component.
 * It allows to dyanmically enable/disable buttons according to state of the
 * fields that are specified in Share config
 * Example:
 *    <field id="sn:propOutcome" set="response">
 *         <control template="/org/alfresco/components/form/controls/workflow/dynamic-activiti-transitions.ftl">
 *            <control-param name="mandatoryFields.transition1">sn:prop1</control-param>
 *            <control-param name="mandatoryFields.transition2">sn:prop2</control-param>
 *         </control>
 *      </field>
 *
 * @namespace Alfresco
 * @class Alfresco.DynamicActivitiTransitions
   @authors Alexey Ermakov & Charles Le Seac'h
 */
(function()
{
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
       Event = YAHOO.util.Event;

   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML;

   /**
    * DynamicActivitiTransitions constructor.
    *
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.DynamicActivitiTransitions} The new DynamicActivitiTransitions instance
    * @constructor
    */
  Alfresco.DynamicActivitiTransitions = function(htmlId)
   {
      Alfresco.DynamicActivitiTransitions.superclass.constructor.superclass.constructor.call(this, "Alfresco.DynamicActivitiTransitions", htmlId, ["button", "container"]);

      return this;
   };

   YAHOO.extend(Alfresco.DynamicActivitiTransitions, Alfresco.ActivitiTransitions,
   {
      // TODO
      buttons: [],
      form: null,
      states: [],

      /**
       * Object container for initialization options
       *
       * @property options
       * @type object
       */
      options:
      {
         /** TODO */
         mandatoryFields: null
      },

      /**
       * Fired by YUI when parent element is available for scripting.
       * Component initialisation, including instantiation of YUI widgets and event listener binding.
       *
       * @method onReady
       */
      onReady: function DynamicActivitiTransitions_onReady()
      {
         Alfresco.DynamicActivitiTransitions.superclass.onReady.call(this);
         // FIXME : test if we have one transition at least
         this.form = this.buttons[this.options.transitions[0].id].getForm();

         // SN : Process items in order tu add mutation Observer
         // List transitions
         for (var trans in this.options.mandatoryFields) {
            var fields = this.options.mandatoryFields[trans];
            for (var idx in fields) {
               var field = fields[idx];
               var input = YAHOO.util.Selector.query('input[name="prop_' + field.replace(":","_")+ '"]', this.form, true);


               var callback = (function(scope){
                  return function (mutations) {
                  var control = scope;
                  mutations.forEach(function(mutation) {
                     var control = scope;
                     var elt = mutation.target;
                     var eltName = elt.attributes['name'].value;
                     var propName = eltName.substring(5).replace("_", ":")
                     control.states[propName] =   !elt.attributes['alf-validation-msg'] ||  elt.attributes['alf-validation-msg'].value == '';
                  })

                  // loop transitions
                  for (var trans in control.options.mandatoryFields) {
                     var transitionState = true;
                     for (var idx in control.options.mandatoryFields[trans]) {
                        transitionState = transitionState && control.states[control.options.mandatoryFields[trans][idx]];
                     }
                     control.buttons[trans].set("disabled", !transitionState);
                  }


                  }})(this);
               var observer = new MutationObserver(callback);
               var config = { attributes: true, childList: false, characterData: false, attributeFilter: ["alf-validation-msg"] };
               observer.observe(input, config);
            }
         }
      },

      /**
       * Event handler called when a transition button is clicked.
       *
       * @method onClick
       * @param e {object} DomEvent
       * @param p_obj {object} Object passed back from addListener method
       */
      onClick: function DynamicActivitiTransitions_onClick(e, p_obj)
      {

         for ( var x in this.states) {
            Alfresco.forms.Form.prototype._runValidations = function() {return true; };
            break;
         }
         Alfresco.DynamicActivitiTransitions.superclass.onClick.call(this, e, p_obj);
      },


      /**
       * Generates a YUI button for the given transition.
       *
       * @method _generateTransitionButton
       * @param transition {object} An object representing the transition
       * @private
       */
      _generateTransitionButton: function DynamicActivitiTransitions__generateTransitionButton(transition)
      {
         // create a button and add to the DOM
         var button = document.createElement('input');
         button.setAttribute("id", this.id + "-" + transition.id);
         button.setAttribute("value", transition.label);
         button.setAttribute("type", "button");
         Dom.get(this.id + "-buttons").appendChild(button);

         // create the YUI button and register the event handler
         var button = Alfresco.util.createYUIButton(this, transition.id, this.onClick);

         // SN : add button to map
         // TODO : better comment
         this.buttons[transition.id] = button;
      }
   });
})();
