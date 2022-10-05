
Ext.define('AbsMan.view.main.Notification', {
    extend: 'Ext.form.Panel',
    xtype: 'notification-panel',

    itemId: 'notificationPanelId',

    requires: [
        'AbsMan.view.main.NotificationController'
    ],

    controller: 'notification',

    title: 'Notifications',
    iconCls: 'x-fa fa-flag',
    closable: true,

    scrollable: true,

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',

        items: [{
            text: 'Reload',
            iconCls: 'x-fa fa-refresh',
            handler: 'onReloadNotifications'
        }, {
            text: 'Clear',
            iconCls: 'x-fa fa-trash',
            handler: 'onClearNotifications',
            tooltip: 'Clear all notifications'
        }]
    }],

    items: [{
        xtype: 'dataview',
        itemSelector: 'div.notifications',

        tpl: new Ext.XTemplate([
            '<div class="notifications">',
            '<tpl for=".">',
                '<div>',
                '<span class="severity-title {severityObj.iconCls} "></span><span>{severityObj.title}</span>',
                '<span>{text}</span>',
                '<span class="notif-date">{[this.elapsed(values.dateObj)]}</span>',
                '</div>',
            '</tpl>',
            '</div>',
            {
                elapsed: function (date) {

                    return Ext.String.capitalize(AbsMan.util.elapsed(date)) + ", " + Ext.Date.format(date,"l j, H:i:s");
                }
            }
        ])
    }]

});