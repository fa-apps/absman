
Ext.define('AbsMan.view.admin.AdminGroup', {
    extend: 'AbsMan.view.admin.AdminForm',
    xtype: 'admingroup-panel',

    requires: [
        'AbsMan.view.admin.AdminGroupModel',
        'AbsMan.view.admin.AdminGroupController',
        'AbsMan.view.admin.category.GroupEntitled',
        'AbsMan.view.admin.category.GroupLeave',
        'AbsMan.view.admin.category.GroupPublicDay',
        'AbsMan.view.admin.membership.GroupMember'
    ],

    viewModel: {
        type: 'admingroup'
    },

    modelValidation: true,

    controller: 'admingroup',

    iconCls: 'x-fa fa-group',

    bind: {
        title: '{currentRecord.name}'
    },


    items: [{


        bodyPadding: 10,
        defaults: {
            labelClsExtra: "a-display-label",
            padding: '0 10 10 0',
            labelWidth: 140,
            msgTarget: 'under'
        },
        items: [{
            xtype: 'textfield',
            name: 'name',
            fieldLabel: 'Group Name',
            labelAlign: "top",
            labelSeparator: '',
            width: 350,
            bind: {
                value: '{currentRecord.name}',
                fieldLabel: '{groupNamePrefix} Group Name',
                readOnly: '{currentRecord.isreadonly}'
            }
        }, {
            xtype: 'checkboxgroup',
            itemId: 'workingDaysControl',
            fieldLabel: 'Working Days',
            autoHeight: true,
            defaultType: 'checkbox',
            defaults: {padding: '0 10 5 0'},
            columns: 4,
            items: [
                {boxLabel: 'Monday', name: 'day-1', inputValue: 100},
                {boxLabel: 'Tuesday', name: 'day-2', inputValue: 100},
                {boxLabel: 'Wednesday', name: 'day-3', inputValue: 100},
                {boxLabel: 'Thursday', name: 'day-4', inputValue: 100},
                {boxLabel: 'Friday', name: 'day-5', inputValue: 100},
                {boxLabel: 'Saturday', name: 'day-6', inputValue: 100},
                {boxLabel: 'Sunday', name: 'day-0', inputValue: 100}
            ],
            bind: {
                readOnly: '{currentRecord.isreadonly}'
            }
        }, {
            xtype: 'radiogroup',
            itemId: 'disablePublicDays',
            fieldLabel: 'Disable Public Days',
            columns: [100, 100],
            bind: {
                value: '{disablePublicDays}',
                readOnly: '{currentRecord.isreadonly}'
            },
            items: [
                {boxLabel: 'No', name: 'disablepublicdays', inputValue: false},
                {boxLabel: 'Yes', name: 'disablepublicdays', inputValue: true}
            ]
        }, {
            xtype: 'hidden',
            name: 'workingdays',
            itemId: 'workingDays',
            bind: '{currentRecord.workingdays}'
        }, {
            xtype: 'hidden',
            name: 'id',
            bind: '{currentRecord.id}'
        }, {
            xtype: 'hidden',
            name: 'companyid',
            bind: '{currentRecord.companyid}'
        }, {
            xtype: 'hidden',
            name: 'lastupdate',
            bind: '{currentRecord.lastupdate}'
        }]
    }, {
        xtype: 'group-members-panel',
        title: 'Members',
        titleCollapse: true,
        frame: true,
        minHeight: 300,
        collapsed: true,
        collapsible: true,
        margin: 10,
        bind: {
            hidden: '{isNewRecord}'
        }
    }, {
        xtype: 'group-entitled-panel',
        title: 'Entitled Categories',
        titleCollapse: true,
        frame: true,
        minHeight: 300,
        collapsed: true,
        collapsible: true,
        margin: 10,
        bind: {
            hidden: '{isNewRecord}'
        }
    }, {
        xtype: 'group-leave-panel',
        title: 'Leave Categories',
        titleCollapse: true,
        frame: true,
        minHeight: 300,
        collapsed: true,
        collapsible: true,
        margin: 10,
        bind: {
            hidden: '{isNewRecord}'
        }
    }, {
        xtype: 'group-publicday-panel',
        title: 'Public Days',
        titleCollapse: true,
        frame: true,
        minHeight: 300,
        collapsed: true,
        collapsible: true,
        margin: 10,
        bind: {
            disabled: '{currentRecord.disablepublicdays}',
            hidden: '{isNewRecord}'
        }
    }, {
        xtype: 'admins-panel',
        title: 'Group administrators',
        titleCollapse: true,
        frame: true,
        minHeight: 200,
        collapsed: true,
        collapsible: true,
        margin: 10,
        bind: {
            hidden: '{isNewRecord}'
        }
    }, {
        xtype: 'history-panel',
        title: 'Group History',
        titleCollapse: true,
        frame: true,
        minHeight: 200,
        collapsed: true,
        collapsible: true,
        margin: 10,
        bind: {
            hidden: '{isNewRecord}'
        }
    }]

});