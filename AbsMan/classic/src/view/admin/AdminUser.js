
Ext.define('AbsMan.view.admin.AdminUser', {
    extend: 'AbsMan.view.admin.AdminForm',
    xtype: 'adminuser-panel',

    requires: [
        'AbsMan.view.admin.AdminUserModel',
        'AbsMan.view.admin.AdminUserController',
        'AbsMan.view.admin.membership.UserMembership',
        'AbsMan.view.admin.category.UserEntitled',
        'AbsMan.view.admin.category.UserLeave',
        'AbsMan.view.admin.category.UserPublicDay'
    ],

    viewModel: {
        type: 'adminuser'
    },

    controller: 'adminuser',

    iconCls : 'x-fa fa-user',

    title: 'User',

    bind: {
        title: '{currentRecord.displayname}'
    },

    items : [{

        bodyPadding: '0 10 10 10',
        defaults: {
            labelClsExtra: "a-display-label",
            labelAlign: "top",
            labelSeparator: '',
            margin: '10 0 0 0'
        },
        items:[{
            layout: "column",
            defaults: {
                labelClsExtra: "a-display-label",
                labelAlign: "top",
                labelSeparator: '',
                padding: "0 10 0 0",
                bind: {
                    readOnly: '{currentRecord.isreadonly}'
                }
            },
            items: [{
                xtype: 'combo',
                width: 75,
                fieldLabel: 'Title',
                bind: {
                    value: '{currentRecord.title}',
                    store: '{lists.titles}'
                },
                editable: true,
                minChars :1
            },{
                xtype: 'textfield',
                name: 'firstname',
                fieldLabel: 'First Name',
                allowBlank: false,
                maxLength: 256,
                width: 215,
                bind: {
                    value: '{currentRecord.firstname}'
                }
            },{
                xtype: 'textfield',
                name: 'lastname',
                fieldLabel: 'Last Name',
                allowBlank: false,
                maxLength: 256,
                width: 220,
                bind: {
                    value: '{currentRecord.lastname}'
                }
            }]
        },{
            layout: "column",
            defaults: {
                labelClsExtra: "a-display-label",
                labelAlign: "top",
                labelSeparator: '',
                padding: "0 10 5 0"
            },
            items: [{
                xtype: 'textfield',
                name:'displayname',
                fieldLabel:'Display Name',
                itemId: 'displayNameField',
                allowBlank:false,
                maxLength: 256,
                width: 300,
                bind: {
                    value: '{currentRecord.displayname}',
                    readOnly: '{currentRecord.isreadonly}'
                }
            },{
                xtype: 'fieldcontainer',
                fieldLabel: 'Display Name Format',
                items: [{
                    xtype: 'button',
                    iconCls : 'x-fa fa-legal',
                    text: 'Apply Entity Format',
                    handler: 'OnApplyEntityDisplayNameFormat',
                    bind: {
                        disabled: '{isReadOnly}'
                    }
                }]
            }]
        },{
            layout: "column",
            defaults: {
                labelClsExtra: "a-display-label",
                labelAlign: "top",
                labelSeparator: '',
                padding: "0 10 5 0",
                bind: {
                    readOnly: '{currentRecord.isreadonly}'
                }
            },
            items: [{
                xtype: 'textfield',
                name: 'email',
                vtype: 'email',
                fieldLabel: 'Email',
                allowBlank: false,
                maxLength: 256,
                width: 300,
                bind: {
                    value: '{currentRecord.email}'
                }
            },{
                xtype: 'textfield',
                name: 'username',
                fieldLabel: 'Username',
                allowBlank: false,
                maxLength: 256,
                width: 300,
                bind: {
                    value: '{currentRecord.username}'
                }
            }]
        },{
            layout: "column",
            defaults: {
                labelClsExtra: "a-display-label",
                labelAlign: "top",
                labelSeparator: '',
                padding: "0 10 5 0",
                width: 140,
                bind: {
                    readOnly: '{currentRecord.isreadonly}'
                }
            },
            items: [{
                xtype: 'textfield',
                name:'number',
                fieldLabel:'Employee Number',
                allowBlank:false,
                maxLength: 256,
                width: 300,
                bind: {
                    value: '{currentRecord.number}'
                }
            },{
                xtype: 'datefield',
                fieldLabel: 'Hire Date',
                allowBlank:  true,
                name:'hiredate',
                format: 'd M Y',
                bind: {
                    value: '{currentRecord.hiredate}'
                }
            },{
                xtype: 'datefield',
                fieldLabel: 'Birth Date',
                allowBlank:  true,
                maxLength:256,
                name:'birthdate',
                format: 'd M Y',
                bind: {
                    value: '{currentRecord.birthdate}'
                }
            }]

        },{
            xtype: 'fieldcontainer',
            fieldLabel: 'Working Days',
            itemId : 'workingDaysControl',
            defaults: {
                padding : '0 0 5 0',
                width : 110,
                style: { float: 'left' }
            },
            items : [{
                items: [
                    { xtype: 'checkbox', name: 'day-1', boxLabel: 'Monday', itemId: 'cb-1'},
                    { xtype: 'numberfield', width: 60, minValue: 0, maxValue: 100, step: 10 } ]
            },{
                items: [
                    { xtype: 'checkbox', name: 'day-2', boxLabel: 'Tuesday', itemId: 'cb-2'},
                    { xtype: 'numberfield', width: 60, minValue: 0, maxValue: 100, step: 10 } ]
            },{
                items: [
                    { xtype: 'checkbox', name: 'day-3', boxLabel: 'Wednesday', itemId: 'cb-3'},
                    { xtype: 'numberfield', width: 60, minValue: 0, maxValue: 100, step: 10 } ]
            },{
                items: [
                    { xtype: 'checkbox', name: 'day-4', boxLabel: 'Thursday', itemId: 'cb-4'},
                    { xtype: 'numberfield', width: 60, minValue: 0, maxValue: 100, step: 10 } ]
            },{
                items: [
                    { xtype: 'checkbox', name: 'day-5', boxLabel: 'Friday', itemId: 'cb-5'},
                    { xtype: 'numberfield', width: 60, minValue: 0, maxValue: 100, step: 10 } ]
            },{
                items: [
                    { xtype: 'checkbox', name: 'day-6', boxLabel: 'Saturday', itemId: 'cb-6'},
                    { xtype: 'numberfield', width: 60, minValue: 0, maxValue: 100, step: 10 } ]
            },{
                items: [
                    { xtype: 'checkbox', name: 'day-0', boxLabel: 'Sunday', itemId: 'cb-0'},
                    { xtype: 'numberfield', width: 60, minValue: 0, maxValue: 100, step: 10 } ]
            }]
        },{
            xtype: 'radiogroup',
            itemId : 'disablePublicDays',
            fieldLabel: 'Disable Public Days',
            labelWidth: 140,
            columns: [100, 100],
            bind: {
                value : '{disablePublicDays}',
                readOnly: '{currentRecord.isreadonly}'
            },
            items: [
                {boxLabel: 'No', name: 'disablepublicdays', inputValue: false },
                {boxLabel: 'Yes', name: 'disablepublicdays', inputValue: true }
            ]
        },{
            xtype: 'combo',
            width: 300,
            fieldLabel: 'Request Workflow',
            bind: {
                value: '{currentRecord.workflow}',
                store: '{lists.workflow}',
                readOnly: '{currentRecord.isreadonly}'
            },
            minChars :1
        }, {
            layout: 'hbox',
            defaults: {
                labelClsExtra: "a-display-label",
                labelAlign: 'top',
                margin: '0 10 0 0',
                xtype: 'combo',
                editable: false,
                listeners: {
                    expand: 'selectUser'
                }
            },
            items: [
                {
                    fieldLabel: 'Approver',
                    name: 'approver',
                    itemId: 'approver',
                    flex: 1,
                    bind: {
                        value: '{currentRecord.approver}'
                    }
                }, {
                    fieldLabel: 'Stand-in Approver',
                    name: 'standinapprover',
                    itemId: 'standInApprover',
                    flex: 1,
                    bind: {
                        value: '{currentRecord.standinapprover}'
                    }
                },{
                    fieldLabel: 'Substitute',
                    name: 'substitute',
                    itemId: 'substitute',
                    flex: 1,
                    bind: {
                        value: '{currentRecord.substitute}'
                    }
                }, {
                    fieldLabel: 'Notified',
                    name: 'notified',
                    itemId: 'notified',
                    flex: 1,
                    bind: {
                        value: '{currentRecord.notified}'
                    }
                }, {
                    fieldLabel: 'Proxy',
                    name: 'absproxy',
                    itemId: 'absproxy',
                    flex: 1,
                    bind: {
                        value: '{currentRecord.absproxy}'
                    }
                }
            ]
        }, {
            xtype: 'textareafield',
            fieldLabel: 'Admin Notes',
            labelAlign: 'top',
            width: 300,
            grow: false,
            bind: {
                value: '{currentRecord.adminnotes}',
                readOnly: '{currentRecord.isreadonly}'
            }
        },{
            xtype: 'radiogroup',
            itemId : 'isEnabled',
            fieldLabel: 'Account Enabled',
            labelWidth: 140,
            columns: [100, 100],
            bind: {
                value : '{isEnabled}',
                readOnly: '{currentRecord.isreadonly}'
            },
            items: [
                {boxLabel: 'No', name: 'enabled', inputValue: false },
                {boxLabel: 'Yes', name: 'enabled', inputValue: true }
            ]
        },{
            xtype : 'hidden',
            name : 'workingdays',
            itemId : 'workingDays',
            bind: {
                value: '{currentRecord.workingdays}'
            }
        },{
            xtype:'hidden',
            name:'id',
            bind: {
                value: '{currentRecord.id}'
            }
        },{
            xtype:'hidden',
            name:'approverid',
            itemId:'approverId',
            bind: {
                value: '{currentRecord.approverid}'
            }
        },{
            xtype:'hidden',
            name:'standinapproverid',
            itemId:'standInApproverId',
            bind: {
                value: '{currentRecord.standinapproverid}'
            }
        },{
            xtype:'hidden',
            name:'substituteid',
            itemId:'substituteId',
            bind: {
                value: '{currentRecord.substituteid}'
            }
        },{
            xtype:'hidden',
            name:'notifiedid',
            itemId:'notifiedId',
            bind: {
                value: '{currentRecord.notifiedid}'
            }
        },{
            xtype:'hidden',
            name:'absproxyid',
            itemId:'absproxyId',
            bind: {
                value: '{currentRecord.absproxyid}'
            }
        },{
            xtype:'hidden',
            name:'companyid',
            bind: {
                value: '{currentRecord.companyid}'
            }
        },{
            xtype:'hidden',
            name:'lastupdate',
            bind: {
                value: '{currentRecord.lastupdate}'
            }
        }]
    },{
        xtype: 'user-membership-panel',
        title:'Groups Membership',
        titleCollapse : true,
        frame : true,
        minHeight : 300,
        collapsed : true,
        collapsible: true,
        margin : 10,
        bind : {
            hidden : '{isNewRecord}'
        }
    },{
        xtype: 'user-entitled-panel',
        title:'Entitlements',
        titleCollapse : true,
        frame : true,
        minHeight : 300,
        collapsed : true,
        collapsible: true,
        margin : 10,
        bind : {
            hidden : '{isNewRecord}'
        }
    },{
        xtype: 'user-leave-panel',
        title:'Leave Categories',
        titleCollapse : true,
        frame : true,
        minHeight : 300,
        collapsed : true,
        collapsible: true,
        margin : 10,
        bind : {
            hidden : '{isNewRecord}'
        }
    },{
        xtype: 'user-publicday-panel',
        title:'Public Days',
        titleCollapse : true,
        frame : true,
        minHeight : 300,
        collapsed : true,
        collapsible: true,
        margin : 10,
        bind : {
            hidden : '{isNewRecord}'
        }
    },{
        xtype: 'history-panel',
        title:'User History',
        titleCollapse : true,
        frame : true,
        minHeight : 200,
        collapsed : true,
        collapsible: true,
        margin : 10,
        bind : {
            hidden : '{isNewRecord}'
        }
    }]

});