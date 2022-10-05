
Ext.define('AbsMan.view.admin.category.UserEntitledDetails', {
    extend: 'AbsMan.view.admin.AdminForm',
    xtype: 'user-entitled-details-panel',

    deferredRender: true,
    requires: [

        'AbsMan.view.admin.category.UserEntitledDetailsController',
        'AbsMan.view.admin.category.UserEntitledDetailsModel'
    ],

    viewModel: {
        type: 'user-entitled-details'
    },

    controller: 'user-entitled-details',

    title: 'User Entitlement Details',
    iconCls : 'x-fa fa-cog',


    bodyPadding: 10,

    listeners : {
        beforeclose : 'onEntitledDetailsClose'
    },

    defaults : {
        padding: '0 0 0 10',
        labelWidth: 120,
        labelClsExtra: "a-display-label"
    },
    items:[{
        xtype: 'displayfield',
        fieldLabel: 'User',
        name:'name',
        width: 450,
        bind : {
            value: '{currentRecord.user}'
        }
    },{
        xtype : 'fieldcontainer',
        fieldLabel: 'Category',
        defaults: {
            hideLabel: false,
            margin: '0 20 0 0',
            labelWidth: 100,
            labelClsExtra: "a-display-label"
        },
        items: [{
            xtype: 'displayfield',
            fieldLabel:'Name',
            name:'name',
            width: 450,
            bind : {
                value: '{currentRecord.name}'
            }
        },{
            xtype: 'displayfield',
            fieldLabel:'Description',
            width: 450,
            name:'text',
            bind : {
                value: '{currentRecord.text}',
                hidden: '{!currentRecord.text}'
            }
        },{
            xtype : 'fieldcontainer',
            fieldLabel: 'Validity',
            layout: 'hbox',
            defaults: {
                hideLabel: false,
                margin: '0 20 0 0',
                labelSeparator: ' ',
                labelWidth: 30,
                labelClsExtra: "a-display-label"
            },
            items: [{
                xtype: 'displayfield',
                fieldLabel: '',
                readOnly: true,
                name:'validfrom',
                renderer: Ext.util.Format.dateRenderer('d M Y'),
                bind: {
                    value: '{currentRecord.validfrom}'
                }
            },{
                xtype: 'displayfield',
                fieldLabel: 'To',
                readOnly: true,
                name:'validto',
                renderer: Ext.util.Format.dateRenderer('d M Y'),
                bind: {
                    value: '{currentRecord.validto}'
                }
            }]
        },{
            xtype : 'fieldcontainer',
            fieldLabel: 'Default ...',
            layout: 'hbox',
            bind : {
                fieldLabel:'Default {currentRecord.absenceunit}'
            },
            defaults: {
                hideLabel: false,
                margin: '0 20 0 0',
                labelWidth:100,
                labelClsExtra: "a-display-label"
            },
            items: [{
                xtype: 'displayfield',
                name:'defaultvalue',
                bind : {
                    value: '{currentRecord.defaultvalue}'
                }
            },{
                xtype: 'displayfield',
                name: 'ondemanddefaultvalue',
                fieldLabel: 'On Demand',
                bind: {
                    value: '{currentRecord.ondemanddefaultvalue}',
                    hidden: '{!currentRecord.manageondemand}'
                }
            }]
        }]
    },{
        xtype : 'fieldcontainer',
        fieldLabel: 'Value...',
        layout: 'hbox',
        bind : {
            fieldLabel:'{currentRecord.absenceunit}'
        },
        defaults: {
            labelAlign: 'top',
            margin: '0 20 0 0',
            width: 80,
            labelSeparator: '',
            labelClsExtra: "a-display-label"
        },
        items: [{
            xtype: 'numberfield',
            fieldLabel: 'Allocated',
            name:'allocated',
            bind : {
                value: '{currentRecord.allocated}'
            }
        },{
            xtype: 'textfield',
            name:'taken',
            fieldLabel: 'Taken',
            readOnly: true,
            bind : {
                value: '{currentRecord.taken}'
            }
        },{
            xtype: 'numberfield',
            name: 'left',
            fieldLabel: 'Left',
            bind: {
                value: '{currentRecord.left}'
            }
        }]
    },{
        xtype : 'fieldcontainer',
        fieldLabel: 'On demand',
        layout: 'hbox',
        defaults: {
            labelAlign: 'top',
            margin: '0 20 0 0',
            width: 80,
            labelSeparator: '',
            labelClsExtra: "a-display-label"
        },
        bind: {
            hidden: '{!currentRecord.manageondemand}'
        },
        items: [{
            xtype: 'numberfield',
            fieldLabel: 'Allocated',
            name:'ondemandallocated',
            bind : {
                value: '{currentRecord.ondemandallocated}'
            }
        },{
            xtype: 'textfield',
            name:'ondemandtaken',
            fieldLabel: 'Taken',
            readOnly: true,
            bind : {
                value: '{currentRecord.ondemandtaken}'
            }
        },{
            xtype: 'numberfield',
            name: 'ondemandleft',
            fieldLabel: 'Left',
            bind: {
                value: '{currentRecord.ondemandleft}'
            }
        }]
    },{
        xtype: 'combobox',
        editable: false,
        fieldLabel: 'Hidden',
        triggerAction: 'all',
        margin: '20 0 0 0',
        width : 205,
        store: [
            [true, 'Yes'],
            [false, 'No']
        ],
        bind: {
            disabled: '{isReadOnly}',
            value: '{currentRecord.hidden}'
        }
    },{
        xtype:'hidden',
        name:'userid',
        bind: '{currentRecord.userid}'
    },{
        xtype:'hidden',
        name:'categoryid',
        bind: '{currentRecord.categoryid}'
    },{
        xtype:'hidden',
        name:'id',
        bind: '{currentRecord.id}'
    },{
        xtype:'hidden',
        name:'lastupdate',
        bind: '{currentRecord.lastupdate}'
    }]
});

