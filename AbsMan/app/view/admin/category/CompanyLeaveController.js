
Ext.define('AbsMan.view.admin.category.CompanyLeaveController', {
    extend: 'AbsMan.view.admin.category.CompanyCategoryController',

    alias: 'controller.companyleavepanel',


    init: function () {

        this.getView().down('#saveSortingButton').setVisible(true);
        this.callParent();

    },


    onAdd : function() {

        this.getView().ownerCt.controller.adminPanels.fireEvent("newpanel","adminform-lea-0-" + this.ownerId);
    },

    onEdit : function() {

        var selectedRecord = this.getView().getSelectionModel().getSelected().items[0];

        if (selectedRecord) this.getView().ownerCt.controller.adminPanels.fireEvent("newpanel","adminform-lea-" + selectedRecord.id);

    },

    onSaveSorting : function() {

        var records = this.categoryStore.data.items,
            url = this.categoryStore.proxy.baseUrl,
            ids = [];

        for (var i=0 ; i < records.length ; i++) {
            ids.push(records[i].data.id);
        }

        Ext.Ajax.request({
            scope: this,
            url: url + 'order/' + this.ownerId,
            method: "POST",
            jsonData: {
                ordering : ids,
                category: 'leave'
            },
            success: function (serverResponse) {

                var response = Ext.JSON.decode(serverResponse.responseText);

                if (response.success) {

                    AbsMan.util.mess(response.mess || "Sorting saved.");

                } else {

                    AbsMan.util.mess(response.mess || "Sorting not saved.",  AbsMan.util.ERROR);
                }

            },
            failure: function () {

                AbsMan.util.mess("Server Error",  AbsMan.util.CRITICAL);
            }
        });
    },



    onLoad : function() {

        this.parentLoadedSubForms["lea"] = this.getOldestTimeStamp();
    }


});