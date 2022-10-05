
Ext.define('AbsMan.view.admin.request.CompanyWorkflow', {
    extend: 'Ext.grid.Panel',
    xtype: 'company-workflow-panel',

    reference: 'companyWorkflowPanel',

    requires: [
        'AbsMan.view.admin.request.CompanyWorkflowModel',
        'AbsMan.view.admin.request.CompanyWorkflowController'
    ],

    viewModel: {
        type: 'companyworkflowpanel'
    },

    controller: 'companyworkflowpanel',

    iconCls: 'fa fa-cog',

    listeners: {
        beforeexpand: 'onBeforeExpand',
        focusenter: 'onFocus',
        expand: 'onExpand',
        select: 'onSelect'
    },

    bind: {
        store: '{subFormData}'
    },

    plugins: [{
        ptype: 'cellediting',
        pluginId: 'entitledCellEditorId',
        clicksToEdit: 2
    }],

    flex: 1,
    height: 400,

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        itemId: 'top-bar',
        items: [{
            text: 'Add',
            iconCls: 'x-fa fa-plus',
            handler: 'onAdd',
            itemId: 'addButton',
            bind: {
                disabled: '{isReadOnly}'
            }
        },{
            text: 'Edit',
            iconCls: 'x-fa fa-edit',
            handler: 'onEdit',
            itemId: 'editButton',
            bind: {
                disabled: '{isReadOnly}'
            }
        },{
            text: 'Save',
            iconCls: 'x-fa fa-save',
            handler: 'onSave',
            itemId: 'saveButton',
            bind: {
                disabled: '{isReadOnly}'
            }
        },{
            text: 'Cancel',
            iconCls: 'x-fa fa-undo',
            handler: 'onCancel',
            itemId: 'cancelButton',
            bind: {
                disabled: '{isReadOnly}'
            }
        },{
            text: 'Save Sorting',
            iconCls: 'x-fa fa-list-ol',
            handler: 'onSaveSorting',
            itemId: 'saveSortingButton',
            hidden: true,
            bind: {
                disabled: '{isReadOnly}'
            }
        },'->',{
            text: 'Reload',
            iconCls: 'x-fa fa-refresh',
            tooltip: 'Click here to reload. <br>All modifications will be lost!',
            handler: 'onReload',
            itemId: 'reloadButton'
        }]
    }]


});




