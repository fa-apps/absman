
Ext.define('AbsMan.view.main.ContentController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.content-panel',

    init: function () {

        var me = this.getView();


        me.on("newpanel", function (formType, formId, cancelChangeEvent) {

            //console.log(formType, formId, cancelChangeEvent);

            cancelChangeEvent = cancelChangeEvent || false;

            var newpanel = Ext.ComponentQuery.query('#' + formId)[0];

            if (!newpanel) {
                newpanel = me.add({
                    itemId: formId,
                    xtype: formType
                });
            }

            if (cancelChangeEvent)  me.suspendEvent("tabchange");

            me.setActiveTab(newpanel);

            me.resumeEvent("tabchange");

        }, this);

        var startupPanelCalls = [
            //'me.fireEvent("newpanel","absence-req","new-req",true)'
            //,'me.fireEvent("newpanel","my-staff","my-staff",true)'
            //,'me.fireEvent("newpanel","notification-panel","notificationFormId",true)'
            //,'me.fireEvent("newpanel","pending-req","pending-req")'
            //,'me.fireEvent("newpanel","request-details","request-details-9F1D3D10D93511E885BBA9D2E5B0230A")',
            //,'me.fireEvent("newpanel","adminmain","adminmain")'
        ];



        Ext.Array.each(startupPanelCalls, function (panelCall) {
            Ext.Function.defer(function () {
                eval(panelCall);
            }, 2000, this);
        }, this);


        me.on("tabchange", function (tabPanel, newTab, oldTab) {


            var newTabItemId = newTab.itemId.split('-'),
                itemId = newTabItemId.shift(),
                newTabController = newTab.getController(),
                requestList = newTab.down("requestlist");

            //console.log(newTab.itemId);

            if (newTabController) {

                if (newTabController.checkNeedReload) newTabController.checkNeedReload();
            }
            else if (requestList) {
                requestList.getController().checkNeedReload();

            }

        }, this);
    }

});