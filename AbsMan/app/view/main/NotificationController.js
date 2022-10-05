
Ext.define('AbsMan.view.main.NotificationController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.notification',

    stores: ['Notification'],


    init: function () {

        this.notificationStore = AbsMan.getApplication().getStore("Notification");
        this.updateView();

    },

    checkNeedReload: function () {

        this.updateView();
    },

    updateView: function () {


        this.notificationStore.sort("date","DESC");

        var items = Ext.Array.map(this.notificationStore.getData().items,

            function (item) {
                item.data.severityObj = Ext.JSON.decode(item.data.severity);
                item.data.dateObj = Ext.Date.parse(item.data.date,"Y-m-d H:i:s");
                return item.data;
            }
        );

        //console.log(items);

        this.getView().down("dataview").update(items);

    },

    onClearNotifications: function () {

        this.notificationStore.removeAll();
        this.updateView();

    },

    onReloadNotifications : function () {

        this.updateView();
    }

});
