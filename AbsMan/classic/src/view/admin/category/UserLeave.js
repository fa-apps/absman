
Ext.define('AbsMan.view.admin.category.UserLeave', {
    extend: 'Ext.grid.Panel',
    xtype: 'user-leave-panel',


    requires: [
        'AbsMan.view.admin.category.UserLeaveModel',
        'AbsMan.view.admin.category.UserLeaveController'
    ],

    viewModel: {
        type: 'adminuserleave'
    },

    controller: 'adminuserleave',

    iconCls: 'fa fa-cog',

    listeners: {
        beforeexpand: 'onBeforeExpand',
        expand: 'onExpand'

    },

    bind: {
        store: '{subFormData}'
    },


    flex:1,
    minHeight: 320,

    columns: [
        {
            xtype: 'rownumberer'
        },{
            header: 'Name',
            tooltip: 'Leave Category Name',
            flex:1,
            sortable: true,
            dataIndex: 'name'
        },{
            header: 'Description',
            tooltip: 'Leave Category Description',
            flex:1,
            sortable: true,
            dataIndex: 'text'
        },{
            header: 'Max Value',
            xtype: 'numbercolumn',
            tooltip: 'Maximum that can be taken in one request',
            width: 120,
            sortable: true,
            dataIndex: 'maxvalue'
        },{
            header: 'Auto Approvable',
            tooltip: 'Leave Category is Auto-Approvable',
            dataIndex: 'autoapprovable',
            width: 120,
            sortable: true,
            xtype: 'booleancolumn',
            trueText: 'Yes',
            falseText: 'No'
        },{
            header: 'Justification Not Required',
            tooltip: 'Justification Is Not Required',
            dataIndex: 'justificationnotrequired',
            width: 120,
            sortable: true,
            xtype: 'booleancolumn',
            trueText: 'Yes',
            falseText: 'No'
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




