Ext.define('AbsMan.view.request.PendingController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.pending',


    init: function () {


        this.getView().on("tabchange", function (tabPanel, newTab, oldTab) {


            var newTabItemId = newTab.itemId.split('-'),
                itemId = newTabItemId.shift(),
                newTabController = newTab.getController(),
                requestList = newTab.down("requestlist"),
                newTabStore = newTab.getViewModel().getStore('requestListData');

            if (!newTabStore.isLoaded()) {

                this.loadRequestList(itemId);
            }

            if (newTabController) {

                if (newTabController.checkNeedReload) newTabController.checkNeedReload();
            }
            else if (requestList) {

                requestList.getController().checkNeedReload();

            }

        }, this);


        this.loadRequestList("requestListId");

    },


    loadRequestList: function (itemId) {

        var requestListView = this.getView().down("#"+itemId);
        if (requestListView) {

            requestListView.getController().loadFilterList();

        }
    },


    onListTypeClick: function ( button ) {

        var requestListView = this.getView().down("#" + this.getView().getActiveTab().itemId);
        if (requestListView) {

            requestListView.getController().listPending = button.value;
            requestListView.getController().loadFilterList();


            requestListView.getController().listStore.getFilters().add({
                property: "listPending",
                value: button.value
            });

        }
    }




});