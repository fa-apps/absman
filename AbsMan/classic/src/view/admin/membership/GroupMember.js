
Ext.define('AbsMan.view.admin.membership.GroupMember', {
    extend: 'Ext.grid.Panel',
    xtype: 'group-members-panel',
    reference: 'adminGroupMemberPanel',


    requires: [
        'AbsMan.view.admin.membership.GroupMemberModel',
        'AbsMan.view.admin.membership.GroupMemberController',
        'AbsMan.view.util.PickUser',
        'Ext.ux.grid.PageSize'
    ],

    viewModel: {
        type: 'admingroupmember'
    },

    controller: 'admingroupmember',

    iconCls: 'fa fa-cog',


    listeners: {
        beforeexpand: 'onBeforeExpand',
        expand: 'onExpand',
        beforeitemdblclick: 'onRowDoubleClick',
        afterrender: 'initView'
    },

    selModel: {
        mode: 'MULTI'
    },

    bind: {
        store: '{subFormData}'
    },

    columns: [{
        header: 'Number',
        sortable: true,
        dataIndex: 'number',
        width: 120
    },{
        header: 'Display Name',
        flex:1,
        sortable: true,
        dataIndex: 'displayname'
    },{
        header: 'Title',
        width: 60,
        sortable: true,
        dataIndex: 'title'
    },{
        header: 'Last Name',
        flex:1,
        sortable: true,
        dataIndex: 'lastname'
    },{
        header: 'First Name',
        flex:1,
        sortable: true,
        dataIndex: 'firstname'
    },{
        header: 'Email',
        flex:1,
        sortable: true,
        dataIndex: 'email'
    },{
        header: 'Edit',
        width: 70,
        sortable: false,
        xtype: 'actioncolumn',
        menuDisabled: true,
        align: 'center',
        iconCls: 'x-fa fa-edit',
        handler: 'onRowEdit'
    }, {
        header: 'Remove',
        width: 70,
        sortable: false,
        xtype: 'actioncolumn',
        menuDisabled: true,
        align: 'center',
        iconCls: 'x-fa fa-remove',
        handler: 'onRowRemove',
        bind: {
            hidden: '{currentRecord.isdefaultgroup}',
            disabled: '{isReadOnly}'
        }
    }],

    flex: 1,
    height: 300,



    dockedItems: [{
        xtype: 'pagingtoolbar',
        dock: 'bottom',
        bind: {
            store: '{subFormData}'
        },
        pageSize: 25,
        displayInfo: true,
        displayMsg: 'Displaying items {0} - {1} of {2}',
        plugins: 'pagesize',
        emptyMsg: "No item to display"
    }, {
        xtype: 'toolbar',
        dock: 'top',
        itemId: 'top-bar',
        defaults: {
            baseCls: 'x-btn x-btn-default-small ',
            cls: 'absman-small-button'
        },
        items: [{
            text: 'Edit',
            iconCls: 'x-fa fa-edit',
            handler: 'onEdit',
            itemId: 'editButton',
            bind: {
                disabled: '{editDisabled}'
            }
        },{
            text: 'Add',
            iconCls: 'x-fa fa-plus',
            handler: 'onAdd',
            bind : {
                disabled : '{isReadOnly}',
                text: '{addMemberButtonText}'
            }
        },{
            text: 'Remove Selected',
            iconCls: 'x-fa fa-minus',
            itemId: 'removeButton',
            handler: 'onRemove',
            bind : {
                hidden: '{currentRecord.isdefaultgroup}',
                disabled : '{removeDisabled}'
            }
        },'->', {
            text: 'Reload',
            iconCls: 'x-fa fa-refresh',
            handler: 'onReload'
        }]
    }]


});




