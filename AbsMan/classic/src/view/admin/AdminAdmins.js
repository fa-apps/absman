
Ext.define('AbsMan.view.admin.AdminAdmins', {
    extend: 'Ext.grid.Panel',
    xtype: 'admins-panel',
    reference: 'adminsPanel',


    requires: [
        'AbsMan.view.admin.AdminsPanelModel',
        'AbsMan.view.admin.AdminsPanelController',
        'AbsMan.view.util.PickUser'
    ],

    viewModel: {
        type: 'adminspanel'
    },

    controller: 'adminspanel',

    iconCls: 'fa fa-cog',

    listeners: {
        beforeexpand: 'onBeforeExpand',
        focusenter: 'onFocus',
        expand: 'onExpand'
    },

    bind: {
        store: '{subFormData}'
    },


    plugins: {
        ptype: 'cellediting',
        pluginId: 'cellEditorId',
        clicksToEdit: 1
    },

    columns: [
        {   header: 'Name',
            flex:1,
            sortable: true,
            dataIndex: 'user'
        },{
            header: 'Role',
            sortable: true,
            dataIndex: 'rolename',
            flex: 1,
            editor: {
                xtype: 'combobox',
                queryMode: 'local',
                triggerAction: 'all',
                autoSelect: true,
                editable: false,
                displayField: 'name',
                emptyText: 'Please select...',
                valueField: 'name',
                bind: {
                    store : '{adminsRoles}',
                    disabled : '{!canManageAdmins}'
                },
                listeners: {
                    select: 'onAdminsRoleSelect'
                }
            }
        },{
            header: 'Edit',
            width: 70,
            sortable: false,
            xtype: 'actioncolumn',
            menuDisabled: true,
            align: 'center',
            iconCls: 'x-fa fa-edit',
            handler: 'onAdminsPanelEditClick',
            isDisabled: function(view, rowIdx, colIdx, item, record) {
                return !record.data.iseditable;
            },
            bind : {
                disabled : '{!canManageAdmins}'
            }
        },{
            header: 'Remove',
            width: 70,
            sortable: false,
            xtype: 'actioncolumn',
            menuDisabled: true,
            align: 'center',
            iconCls: 'x-fa fa-remove',
            handler: 'onAdminsPanelRemoveClick',
            isDisabled: function(view, rowIdx, colIdx, item, record) {
                return !record.data.isdeletable;
            },
            bind : {
                disabled : '{!canManageAdmins}'
            }
        }
    ],
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
        displayMsg: 'Displaying topics {0} - {1} of {2}',
        emptyMsg: "No items to display"
    }, {
        xtype: 'toolbar',
        dock: 'top',
        itemId: 'top-bar',
        defaults: {
            baseCls: 'x-btn x-btn-default-small ',
            cls: 'absman-small-button'
        },
        items: [{
            text: 'Add',
            iconCls: 'x-fa fa-plus',
            handler: 'onAdminsFormAdd',
            bind : {
                disabled : '{!canManageAdmins}'
            }
        },{
            text: 'Save',
            iconCls: 'x-fa fa-save',
            handler: 'onSave',
            reference: 'adminsSaveButton',
            bind : {
                disabled : '{!canManageAdmins}'
            }
        },{
            text: 'Cancel',
            iconCls: 'x-fa fa-undo',
            handler: 'onAdminsFormCancel',
            bind : {
                disabled : '{!canManageAdmins}'
            }
        },'->', {
            text: 'Reload',
            iconCls: 'x-fa fa-refresh',
            tooltip: 'Click here to reload the form. <br>All modifications will be lost!',
            handler: 'onAdminsFormReload'
        }]
    }]


});




