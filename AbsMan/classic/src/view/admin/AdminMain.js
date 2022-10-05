
Ext.define('AbsMan.view.admin.AdminMain', {
    extend: 'Ext.Container',

    requires: [
		'AbsMan.view.admin.AdminMainController',
        'AbsMan.view.admin.AdminTree',
        'AbsMan.view.admin.AdminContent'
    ],

    xtype: 'adminmain',

    controller: 'adminmain',

    iconCls: 'x-fa fa-gears',

    title: 'Administration',

    border : false,

    layout: 'border',
    closable: true,

    items: [{
        region: 'west',
        split: true,
        frame: true,
        flex: .3,
        xtype: 'admin-tree',
        reference: 'admin-tree'
    },{
        region: 'center',
        xtype: 'admin-panels',
        frame: true,
        reference: 'admin-panels'
    }]

});