
Ext.define('AbsMan.view.admin.category.LeaveDetails', {
    extend: 'AbsMan.view.admin.AdminForm',
    xtype: 'leave-detailspanel',

    deferredRender: true,
    requires: [

        'AbsMan.view.admin.category.CompanyLeaveDetailsController',
        'AbsMan.view.admin.category.CompanyLeaveDetailsModel'
    ],

    viewModel: {
        type: 'leave-details'
    },

    controller: 'leave-details',

    title: 'Leave Category Details',
    iconCls : 'x-fa fa-cog',

    defaults : {
        padding: '0 10 5 10',
        labelWidth: 140,
        bind: {
            readOnly: '{currentRecord.isreadonly}'
        }
    },
    bodyPadding: 10,

    listeners : {
        beforeclose : 'onLeaveDetailsClose'
    },

    items:[{
        xtype: 'textfield',
        fieldLabel:'Category Name',
        allowBlank:false,
        maxLength:256,
        name:'name',
        width: 450,
        bind: {
            value: '{currentRecord.name}'
        }
    },{
        xtype: 'textarea',
        fieldLabel:'Description',
        allowBlank:true,
        maxLength:2048,
        width: 450,
        name:'text',
        bind: {
            value: '{currentRecord.text}'
        }
    },{
        xtype: 'numberfield',
        allowBlank:false,
        minValue: 0,
        name:'defaultvalue',
        fieldLabel: 'Maximum ...',
        bind: {
            fieldLabel:'Maximum {currentRecord.absenceunit}',
            value: '{currentRecord.maxvalue}'
        }
    },{
        xtype: 'checkbox',
        fieldLabel:'Auto Approvable',
        name:'autoapprovable',
        bind: {
            value: '{currentRecord.autoapprovable}'
        }
    },{
        xtype: 'checkbox',
        fieldLabel:'Justification Not Required',
        name:'justificationnotrequired',
        bind: {
            value: '{currentRecord.justificationnotrequired}'
        }
    },{
        xtype:'hidden',
        name:'companyid',
        bind: '{currentRecord.companyid}'
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

