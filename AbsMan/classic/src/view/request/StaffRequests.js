Ext.define('AbsMan.view.request.StaffRequests', {
    extend: 'Ext.form.Panel',
    xtype: 'staff-req',


    requires: [
        'AbsMan.view.request.RequestList'
    ],

    iconCls: 'x-fa fa-sitemap',
    frame: true,
    title: 'My Staff Requestssss',
    closable: true,

    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch',
        reserveScrollbar: true
    },

    items: [
        {
            itemId: "requestListId",
            xtype: "requestlist",
            minHeight: 250,
            scrollable: true,
            listType: 'staff',
            flex: 1,
            title: 'My Staff Requjjjjests'
        }
    ]


});




