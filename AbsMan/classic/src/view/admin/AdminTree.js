
Ext.define('AbsMan.view.admin.AdminTree', {
    extend: 'Ext.tree.Panel',
    xtype: 'admin-tree',

    requires: [
        'AbsMan.view.admin.AdminTreeModel',
        'AbsMan.view.admin.AdminTreeController'
    ],

    viewModel: {
        type: 'admintree'
    },

    controller: 'admintree',

    itemId: 'admintree-panel',
    id: 'admintree-panel',
    header : true,
    title: 'Selection',
    collapsible: true,
    rootVisible: false,
    animate: true,
    reserveScrollbar: true,
    useArrows: true,


    bind: {
        store: '{adminTreeStore}'
    },

    tools: [{
        type:'refresh',
        handler: 'onRefreshAdminTree'
    },{
        type:'search'
    }],

    listeners: {
        select: 'onAdminTreeClick'
    },

    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 0,
        listeners: {
            beforeedit: 'onAdminTreeItemBeforeEdit',
            edit: 'onAdminTreeItemEdit'
        }
    },

    viewConfig: {
        markDirty: false,
        plugins: {
            ptype: 'treeviewdragdrop',
            containerScroll: true
        },
        listeners: {
            beforedrop: 'onBeforeDrop',
            drop: 'onDrop'
        }
    },

    columns: [{
        text: 'Name',
        xtype: 'treecolumn',
        flex: 1,
        sortable: true,
        editor: {
            xtype: 'textfield',
            allowBlank: false
        },
        scrollable: true,
        dataIndex: 'name'
    },{
        width: 30,
        sortable: false,
        menuDisabled: true,
        xtype: 'actioncolumn',
        align: 'center',
        iconCls: 'x-fa fa-edit',
        handler: 'onAdminTreeActionClick',
        isDisabled: function(view, rowIdx, colIdx, item, record) {
            return !record.data.editable;
        }
    }]

});


