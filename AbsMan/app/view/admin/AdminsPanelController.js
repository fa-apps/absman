
Ext.define('AbsMan.view.admin.AdminsPanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.adminspanel',

    init : function () {

        var adminsPanel = this.getView(),
            adminsStore = this.getView().getViewModel().getStore("subFormData");

        adminsPanel.on("newadmin", function (adminSelection){

            var admin = adminSelection[0],
                adminExists =  adminsStore.find("userid",admin.data.id);

            if (adminExists == -1) {

                Ext.Ajax.request({
                    scope: this,
                    url: 'admin/isadmin/' + this.controller.ownerShortType + '/' + this.controller.ownerId + '/' + admin.data.id,
                    success: function (response) {

                        var responseData = Ext.decode(response.responseText);

                        if (!responseData.isAdmin) {

                            var newRecord = adminsStore.insert(0, [{
                                user: admin.get("name"),
                                userid: admin.get("id"),
                                iseditable: true,
                                isdeletable: true
                            }]);
                            adminsPanel.getSelectionModel().select(newRecord);
                            adminsPanel.getPlugin('cellEditorId').startEditByPosition({
                                row: 0,
                                column: 1
                            });

                        } else {

                            AbsMan.util.mess("User is already Administrator!", AbsMan.util.WARNING);
                        }
                    },
                    failure: function (response) {

                        AbsMan.util.mess("Error during isAdmin request !",  AbsMan.util.ERROR);
                    }
                });
            }
            else {

                adminsPanel.getSelectionModel().select(adminExists);
                AbsMan.util.mess("User is already Administrator!",  AbsMan.util.WARNING);
            }

        });

        this.adminsStore= adminsStore;

    },

    onFocus : function () {

        this.resetProxy();
    },


    onBeforeExpand : function () {

        this.resetProxy();
        this.ownerId = this.view.up().controller.recordId;
        this.ownerShortType = this.view.up().controller.shortType;

        if ( !this.view.ownerCt.controller.isNewRecord && this.adminsStore.loadCount === 0) {
            this.view.getViewModel().getStore("adminsRoles").load();
            this.adminsStore.load();
        }

    },

    onExpand : function() {

        this.getView().up().scrollBy(0, this.getView().getY() - this.getView().up().getY() - 40  );


    },

    onAdminsPanelEditClick : function(grid, rowIndex, colIndex) {

        this.view.getPlugin('cellEditorId').startEditByPosition({
            row: rowIndex,
            column: colIndex -1
        });
    },

    onAdminsPanelRemoveClick: function(grid, rowIndex, colIndex, actionItem, event, record) {

        this.adminsStore.remove(record);
    },


    onAdminsRoleSelect: function (combo, record) {

        this.view.getSelectionModel().getSelection()[0].set('roleid', record.data.id);
    },

    onAdminsFormCancel: function() {

        this.adminsStore.rejectChanges();
    },

    onSave: function() {

        this.adminsStore.sync({
            scope: this,
            success: function (batch, options) {

                Ext.Array.each(batch.getOperations(), function (operation) {

                    var response = Ext.decode(operation.getResponse().responseText);

                    if (response.newid ) {

                        this.getRecords()[0].setId(response.newid);
                    }
                    AbsMan.util.mess(response.mess || "Record has been saved.");
                });
            },
            failure: function (batch) {

                Ext.Array.each(batch.getOperations(), function (operation) {

                    var response = Ext.JSON.decode(operation.getResponse().responseText);

                    AbsMan.util.mess(response.mess || "Record has not been saved.", AbsMan.util.ERROR);
                });
            }
        });
    },

    resetProxy : function() {

        this.adminsStore.getProxy().url =  this.adminsStore.getProxy().baseUrl + this.view.up().controller.shortType+ "/" + this.view.up().controller.recordId;
    },

    onAdminsFormReload : function() {

        this.resetProxy();
        this.adminsStore.reload();
    },

    onAdminsFormAdd : function() {

        var userSelection = new AbsMan.view.util.PickUser({
            allowMultiple: false,
            opener: this.getView(),
            openerEvent: "newadmin"
        });

        userSelection.show();
    },

    onBeforeSort : function() {

        this.resetProxy();

        if (this.adminsStore.needsSync) return false;
    }


});