Ext.define('AbsMan.view.request.RequestListController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.requestlist',


    init: function () {

        this.listStore = this.getViewModel().getStore("requestListData");
        this.lastUpdate = 0;
        this.listType = this.getView().listType;
        this.listPending = null;
        this.requestListUserId = this.listType === "user" ? this.getView().up().getViewModel().get('currentRecord.userid') : userId;
    },


    beforeLoadForm: function (store, operation) {

        this.requestListUserId = this.listType === "user" ? this.getView().up().getViewModel().get('currentRecord.userid') : userId;

        this.listStore.getProxy().url = this.listStore.getProxy().baseUrl + this.listType + "/" + this.requestListUserId;

        return this.requestListUserId !== null;   //cancel the load if user is not yet set. parent have to load this
    },


    afterLoadForm: function (store, records, successful, eOpts) {

        var response = Ext.JSON.decode(eOpts.getResponse().responseText);

        if (!successful) {

            AbsMan.util.mess(response.mess || "Error during load operation.", AbsMan.util.ERROR);

        } else {

            this.lastUpdate = response.lastupdate;
        }
    },


    loadFilterList: function () {

        this.listPending = this.listPending === null ? this.getViewModel().get("listPendingPreference") : this.listPending;

        this.getViewModel().set("listPending", this.listPending);

        this.listStore.getFilters().add({
            property: "listPending",
            value: this.listPending
        });

    },


    loadForm: function () {

        this.listStore.load();
    },


    checkNeedReload: function () {

        if (this.listStore.isLoaded()) {

            Ext.Ajax.request({
                scope: this,
                url: this.listStore.getProxy().baseUrl + 'check/' + this.listType + "/" + userId,
                params: {
                    requestListLastUpdate: this.lastUpdate
                },
                success: function (response) {

                    var responseData = Ext.JSON.decode(response.responseText);

                    if (responseData.success) {

                        if (responseData.data.outdated === true) {

                            AbsMan.util.mess("Reloading, some of the values are out of date.", AbsMan.util.INFO);
                            this.loadForm();
                        }

                    } else {

                        AbsMan.util.mess(responseData.mess || "Error during check for need reload operation", AbsMan.util.ERROR);
                    }
                },
                failure: function (response) {

                    AbsMan.util.mess(response.statusText + " (" + response.status + ")", AbsMan.util.CRITICAL);
                }

            });
        }
    },


    onViewDetails: function (view, col, row, item, e, record) {

        this.viewDetails(record.id);
    },


    onRowDoubleClick: function (table, record) {

        this.viewDetails(record.id);
    },


    viewDetails: function (recordId) {

        var contentPanels = this.getView().up('#tabpanels');

        contentPanels.fireEvent("newpanel", "request-details", "request-details-" + recordId);
    },


    onListTypeClick: function (button) {

        this.listPending = button.value;
        this.getViewModel().set("listPending", button.value);

        this.listStore.getFilters().add({
            property: "listPending",
            value: button.value
        });

    },


    saveUserPreference: function (button, event) {

        this.getView().up().getController().saveUserPreference(button.preference, button.prev().value);
    }


});