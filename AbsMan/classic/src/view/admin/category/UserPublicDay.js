
Ext.define('AbsMan.view.admin.category.UserPublicDay', {
    extend: 'Ext.grid.Panel',
    xtype: 'user-publicday-panel',


    requires: [
        'AbsMan.view.admin.category.UserPublicDayModel',
        'AbsMan.view.admin.category.UserPublicDayController'
    ],

    viewModel: {
        type: 'adminuserpublicday'
    },

    controller: 'adminuserpublicday',

    iconCls: 'fa fa-cog',

    listeners: {
        beforeexpand: 'onBeforeExpand',
        expand: 'onExpand'
    },

    bind: {
        store: '{subFormData}'
    },

    features: [{
        ftype:'grouping',
        groupHeaderTpl: '<strong>{columnName:capitalize}: {name}</strong> ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
        startCollapsed: false,
        id: 'userEntitlementGrouping'
    }],

    flex:1,
    minHeight: 320,

    columns: [
        {
            xtype: 'rownumberer'
        },{
            header: 'Name',
            width: 260,
            sortable: true,
            dataIndex: 'name'
        },{
            header: 'Date',
            width: 120,
            sortable: true,
            xtype: 'datecolumn',
            dataIndex: 'date',
            format: 'd M Y'
        },{
            header: 'Length',
            dataIndex: 'length',
            width: 160,
            sortable: true,
            renderer: 'publicDayLengthRender'
        },{
            flex:1
        }
    ],


    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        itemId: 'top-bar',
        defaults: {
            baseCls: 'x-btn x-btn-default-small ',
            cls: 'absman-small-button'
        },
        items: ['->', {
            text: 'Reload',
            iconCls: 'x-fa fa-refresh',
            tooltip: 'Click here to reload. <br>All modifications will be lost!',
            handler: 'onReload',
            itemId: 'reloadButton'
        }]
    }]

});




