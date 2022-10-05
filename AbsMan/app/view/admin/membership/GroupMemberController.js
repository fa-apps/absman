
Ext.define('AbsMan.view.admin.membership.GroupMemberController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.admingroupmember',

    init : function () {

        var membersPanel = this.getView(),
            membersStore = this.getView().getViewModel().getStore("subFormData");

        membersPanel.on("newmember", function (users){

            var userIds = [];
            Ext.Array.each(users, function (user) {
                userIds.push(user.get('id'));
            }, this);

            Ext.Ajax.request({
                scope: this,
                params: { ids: Ext.JSON.encode(userIds)},
                url: 'admin/group/addmembers/' + this.ownerId,
                success: function (ajaxResponse) {

                    var response = Ext.decode(ajaxResponse.responseText);

                    if (response.success ) {

                        if (response.newid ) {

                            this.getRecords()[0].setId(response.newid);
                        }

                        AbsMan.util.mess(response.mess || "Employee has been added to group.");

                        this.onReload();

                        this.addedCategories = [];
                        this.removedCategories = [];

                    } else {

                        AbsMan.util.mess(response.mess || "Error during member creation", 2);
                    }
                },
                failure: function(ajaxResponse) {

                    AbsMan.util.mess("Server Error " + ajaxResponse.status, 3);
                }
            });
        }, this);

        this.membersStore = membersStore;

    },

    initView: function() {

        this.ownerId = this.getView().up().getController().recordId;
        this.ownerShortType = this.getView().up().getController().shortType;

    },

    onBeforeExpand : function () {

        this.parentLoadedSubForms = this.getView().up().getController().loadedSubForms;
        if (!this.membersStore.loadCount) this.membersStore.load();

    },

    onExpand : function() {

        this.getView().up().scrollBy(0, this.getView().getY() - this.getView().up().getY() - 40  );

    },

    resetProxy : function() {

        this.membersStore.getProxy().url =  this.membersStore.getProxy().baseUrl + this.getView().up().getController().recordId;

    },

    onReload : function() {

        this.membersStore.reload();
    },

    onAdd : function() {

        var adminPanels = Ext.ComponentQuery.query('admin-panels[itemId=adminpanels]')[0],
            companyId = this.getView().up().getForm().findField('companyid').getValue(),
            groupId = this.getView().up().getViewModel().get('currentRecord.id'),
            isDefaultGroup = this.getView().up().getViewModel().get('currentRecord.isdefaultgroup');

       if (isDefaultGroup)  {

           adminPanels.fireEvent("newpanel","adminform-use-0-" + companyId);

       } else {

           var userSelection = new AbsMan.view.util.PickUser({
               allowMultiple: true,
               opener: this.getView(),
               openerEvent: "newmember",
               openerFilters: [{ property: 'outgroup' , value: groupId } , { property: 'company' , value: companyId }]
           });
           userSelection.show();

       }

    },

    onRemove : function() {

        var isDefaultGroup = this.getView().up().getViewModel().get('currentRecord.isdefaultgroup'),
            userSelection = this.getView().getSelectionModel().getSelection(),
            userIds = [];

        if (isDefaultGroup)  {

            AbsMan.util.mess("Unable to remove the default group.", 3);


        } else {


            Ext.Array.each(userSelection, function (user) {
                userIds.push(user.get('id'));
            }, this);

            Ext.Ajax.request({
                scope: this,
                url: 'admin/group/removemembers/' + this.ownerId,
                params: { ids: Ext.JSON.encode(userIds)},
                success: function (ajaxResponse) {

                    var response = Ext.decode(ajaxResponse.responseText);

                    if (response.success ) {

                        if (response.newid ) {

                            this.getRecords()[0].setId(response.newid);
                        }

                        AbsMan.util.mess(response.mess || "Employee has been removed from group.");

                        this.onReload();

                        this.addedCategories = [];
                        this.removedCategories = [];

                    } else {

                        AbsMan.util.mess(response.mess || "Error during remove member operation.", 2);
                    }
                },
                failure: function(ajaxResponse) {

                    AbsMan.util.mess("Server Error " + ajaxResponse.status, 3);
                }
           });

        }

    },

    onEdit : function() {

        var selectedRecord = this.getView().getSelectionModel().getSelected().items[0];
        this.editRecord(selectedRecord.get('id'));
    },

    onRowEdit : function(grid, rowIndex, colIndex) {

        this.editRecord(this.membersStore.getAt(rowIndex).get('id'));

    },

    onRowRemove : function(grid, rowIndex, colIndex) {

        grid.select(rowIndex);
        this.onRemove();

    },

    onRowDoubleClick : function( button, record, item) {

        this.editRecord(record.get('id'));

    },

    editRecord: function (recordId) {

        var adminPanels = Ext.ComponentQuery.query('admin-panels[itemId=adminpanels]')[0];
        adminPanels.fireEvent("newpanel","adminform-use-" + recordId);

    },

    getOldestTimeStamp : function() {

        var oldestTimeStamp = 0;
        Ext.Array.each(this.membersStore.getData().items, function (record) {
            oldestTimeStamp =  record.get("lastupdate") > oldestTimeStamp ?  record.get("lastupdate") : oldestTimeStamp;
        }, this);

        return oldestTimeStamp;
    },

    onLoad : function() {

        this.parentLoadedSubForms["mem"] = this.getOldestTimeStamp();

    }
});