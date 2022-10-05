
Ext.define('AbsMan.view.admin.AdminContentController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.admincontent',

    init: function () {

        var adminPanels = this.getView();

        adminPanels.on("newpanel", function (formId) {

            if (formId !== 'adminform-browse' && formId !== 'adminform-favorites') {

                formId = "-fav" == formId.substr(-4) ? formId.substr(0, formId.search("-fav")) : formId;

                var formDetails = formId.split('-'),
                    formType = AbsMan.formRoutes[formDetails[1]],
                    newpanel = Ext.ComponentQuery.query('#' + formId)[0];

                if (!newpanel) {
                    newpanel = adminPanels.add({
                        itemId: formId,
                        xtype: formType
                    });
                }

                adminPanels.setActiveTab(newpanel);
            }

        }, this, {stopPropagation: true});


        adminPanels.on("tabchange", function (tabPanel, newTab, oldTab) {

            //console.log('tab change admin content', tabPanel, newTab);

            var newTabItemId = newTab.itemId.split('-'),
                itemId = newTabItemId.shift(),
                treeItemId = newTabItemId.join('-'),
                treePanel = Ext.ComponentQuery.query('#admintree-panel')[0],
                treeItems = treePanel.getView().getSelectionModel(),
                treeModelIndex = treePanel.getStore().find('id', treeItemId);

            treeItems.select(treeModelIndex, false, true);
            if (newTab.controller) newTab.controller.checkForm();

        }, this);


        var startupPanelCalls = [
            //'adminPanels.fireEvent("newpanel","admingroup-panel","adminform-gro-E62FB6001CEA11E6BC0471BA70174CFC")',
            //'adminPanels.fireEvent("newpanel","adminform-ent-9063D8C02A8211E695DC45C4D4B06018")',
            'adminPanels.fireEvent("newpanel","adminform-use-1215FD20655211E6BADF1BAEA0E1CC68")'
            //,'adminPanels.fireEvent("newpanel","adminform-use-8F0A3870660C11E6A534E9FF0E4E71E3")',
            //'adminPanels.fireEvent("newpanel","adminform-com-E62DBC901CEA11E6B6AF2B58865A46E0")'
            //'adminPanels.fireEvent("newpanel","adminform-gro-09A93230317D11E6954B85F7946ABF66")',
            //'adminPanels.fireEvent("newpanel","adminform-ued-A82044E0660A11E6AD1087F79F17ADEC")'
        ];

        Ext.Array.each(startupPanelCalls, function (panelCall) {
            Ext.Function.defer(function () {
                eval(panelCall);
            }, 10, this);
        }, this);


    }
});