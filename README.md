Dynamic Activiti Transitions
============================

Overview
----------------------------

Custom Alfresco Share workflow from control that provides a way to disable and enable transition buttons dynamically
basing on current form fields state.

Let assume we have a workflow like this (demo workflow included):
![](https://raw.github.com/fufler/dynamic-activiti-transitions/screenshots/workflow.png)

UT task has two tansitions: to UT1 and to UT2. We want end user to be able to choose one of the transitions only in
case all mandatory ***for this transition*** fields are filled. We configure Share form like this:
```xml
<config evaluator="task-type" condition="sn:utTask">
  <forms>
    <form>
      <field-visibility>
        <show id="sn:prop1"/>
        <show id="sn:prop2"/>
        <show id="sn:propOutcome"/>
      </field-visibility>
      <appearance>
        <set id="info" appearance="" label-id="workflow.set.task.info"/>
        <set id="other" appearance="title" label-id="workflow.set.other"/>
        <set id="items" appearance="title" label-id="workflow.set.items"/>
        <set id="response" appearance="title" label-id="workflow.set.response"/>
        <field id="sn:prop1" label="Property 1" set="other" mandatory="true"/>
        <field id="sn:prop2" label="Property 2" set="other" mandatory="true"/>
        <field id="sn:propOutcome" set="response">
          <control template="/org/alfresco/components/form/controls/workflow/dynamic-activiti-transitions.ftl">
              <control-param name="mandatoryFields.UT1">sn:prop1</control-param>
              <control-param name="mandatoryFields.UT2">sn:prop2</control-param>
          </control>
      </field>
      </appearance>
    </form>
  </forms>
</config>
```
So we set sn:prop1 to be mandatory for UT1 transition and sn:prop2 to be mandatory for UT2 transition. So here goes
our form:
![](https://raw.github.com/fufler/dynamic-activiti-transitions/screenshots/form.png)
Now try to click any button without any field filled:
![](https://raw.github.com/fufler/dynamic-activiti-transitions/screenshots/form_all_fields_invalid.png)
Now if we fill any field we can see corresponding button enabled and disabled dynamically:
![](https://raw.github.com/fufler/dynamic-activiti-transitions/screenshots/form_first_button_enabled.png)
![](https://raw.github.com/fufler/dynamic-activiti-transitions/screenshots/form_second_button_enabled.png)

Project status
----------------------------
This control was done as a project during Hack-a-thon session at Alfresco Summit 2013 in Barcelon so it's a bit hacky. 
It's completely non-intrusive addon for Alfresco that does not override any built-in Alfresco file, but because of that
it uses some tricks :) So at the moment it's not supposed to be used for production but feel free to send a pull request
if you know how to improve it and done in a proper way.
