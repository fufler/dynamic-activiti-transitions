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
 *     <field id="sn:propOutcome" set="response">
 *         <control template="/org/alfresco/components/form/controls/workflow/dynamic-activiti-transitions.ftl">
 *             <control-param name="mandatoryFields.transition1">sn:prop1</control-param>
 *             <control-param name="mandatoryFields.transition2">sn:prop2</control-param>
 *         </control>
 *     </field>
 *
 * @namespace Alfresco
 * @class Alfresco.DynamicActivitiTransitions
 * @authors Alexey Ermakov & Charles Le Seac'h
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
        // call super class constructor
        Alfresco.DynamicActivitiTransitions.superclass.constructor.superclass.constructor.call(
            this,
            "Alfresco.DynamicActivitiTransitions",
            htmlId,
            ["button", "container"]
        );
        // subscribe to event to be able to patch forms runtime
        YAHOO.Bubbling.on('afterFormRuntimeInit', this._patchFormsRuntime, this);
        return this;
    };

    YAHOO.extend(Alfresco.DynamicActivitiTransitions, Alfresco.ActivitiTransitions, {
        /**
         * List of buttons used to display available transitions.
         *
         * @property _buttons 
         * @type array
         */
        buttons: {},
        /**
         * Javascript object representing form.
         *
         * @property _form
         * @type object
          */
        form: null,
        /**
         * States of the transitions.
         *
         * @property states
         * @type array
         */
        states: {},

        /**
         * Object container for initialization options
         *
         * @property options
         * @type object
         */
        options:
        {
            /**
             * For each transition available contains a list of fields
             * to be validated before submission.
             *
             * @property mandatoryFields
             * @type array
             */
            mandatoryFields: null
        },

        /**
         * Generates new validation handler wrapping old one
         *
         * @method _generateNewValidationHandler
         * @param oldHandler {function} Handler to wrap
         * @param scope {object} Scope to be used
         * @return New validation handler
         * @private
         */
        _generateNewValidationHandler: function (oldHandler, scope) {
            return function(field, args, event, form) {
                var control = scope;
                // run validation
                var res = oldHandler(field, args, event, form);
                // change field state
                var parts = field.id.split('_');
                var fieldName = parts[parts.length-2] + ":" + parts[parts.length-1];
                scope.states[fieldName] = res;
                // loop through all transitions and update button states
                for (var trans in control.options.mandatoryFields) {
                    var transitionState = true;
                    for (var idx in control.options.mandatoryFields[trans]) {
                        var prop = control.options.mandatoryFields[trans][idx];
                        if (prop == "")
                           continue;
                        transitionState = transitionState && control.states[prop];
                    }
                    control.buttons[trans].set("disabled", !transitionState);
                }
                return res;
            }
        },

        /**
         * Callback called when forms runtime is ready. Patches
         * configured validation handlers by wrapping them with
         * special functions that take care of enabling and 
         * disabling transition buttons.
         *
         * @method _patchFormsRuntime
         * @param event {string} Name of the event
         * @param args {array} Arguments
         * @private
         */
        _patchFormsRuntime: function DynamicActivitiTransitions_patchFormsRuntime(event, args) {
            // get forms runtime
            var form = args[1].component.formsRuntime;
            // find parent form
            var el = Dom.get(this.id);
            while (el.tagName != "FORM")
                el = el.parentElement;
            // patch the right form
            if (el.id != form.formId)
                return;
            // unsubscrive from event to prevent invocation of callback
            // for any other form that may be displayed later
            YAHOO.Bubbling.unsubscribe('afterFormRuntimeInit', this._patchFormsRuntime, this);
            // store for futher use
            this.jsForm = form;
            this.form = el;
            // update validation handlers
            for (var v in form.validations) {
                var val = form.validations[v];
                val.handler = this._generateNewValidationHandler(val.handler, this);
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
            // skip validations on submission
            this.jsForm._runValidations = function() { return true; };
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

            // store created button
            this.buttons[transition.id] = button;
        }
    });
})();