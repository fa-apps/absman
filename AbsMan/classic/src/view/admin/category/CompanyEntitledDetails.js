
Ext.define('AbsMan.view.admin.category.EntitledDetails', {
    extend: 'AbsMan.view.admin.AdminForm',
    xtype: 'entitled-detailspanel',

    deferredRender: true,
    requires: [

        'AbsMan.view.admin.category.CompanyEntitledDetailsController',
        'AbsMan.view.admin.category.CompanyEntitledDetailsModel'
    ],

    viewModel: {
        type: 'entitled-details'
    },

    controller: 'entitled-details',

    title: 'Entitled Category Details',
    iconCls : 'x-fa fa-cog',


    bodyPadding: 10,

    listeners : {
        beforeclose : 'onEntitledDetailsClose'
    },

    defaults : {
        padding: '0 10 5 10',
        labelWidth: 140,
        bind: {
            readOnly: '{currentRecord.isreadonly}'
        }
    },

    items:[{
        xtype: 'textfield',
        fieldLabel:'Category Name',
        allowBlank:false,
        maxLength:256,
        name:'name',
        width: 450,
        bind : {
            value: '{currentRecord.name}'
        }
    },{
        xtype: 'textarea',
        fieldLabel:'Description',
        allowBlank:true,
        maxLength:2048,
        width: 450,
        name:'text',
        bind : {
            value: '{currentRecord.text}'
        }
    },{
        xtype: 'numberfield',
        allowBlank:false,
        minValue: 0,
        name:'defaultvalue',
        fieldLabel: 'Default ...',
        bind : {
            fieldLabel:'Default {currentRecord.absenceunit}',
            value: '{currentRecord.defaultvalue}'
        }
    },{
        xtype: 'datefield',
        fieldLabel: 'Valid From',
        allowBlank:  false,
        maxLength:256,
        name:'validfrom',
        format: 'd M Y',
        bind: {
            value: '{currentRecord.validfrom}'
        }
    },{
        xtype: 'datefield',
        fieldLabel: 'Valid To',
        allowBlank:  false,
        maxLength:256,
        name:'validto',
        submitFormat: 'Y-m-d',
        format: 'd M Y',
        bind: {
            value: '{currentRecord.validto}'
        }
    },{
        xtype: 'checkbox',
        fieldLabel:'Enforce Validation',
        name:'enforcevalidity',
        bind: {
            value: '{currentRecord.enforcevalidity}'
        }
    },{
        xtype: 'checkbox',
        fieldLabel:'Auto Expires',
        name:'autoexpires',
        bind: {
            value: '{currentRecord.autoexpires}'
        }
    }, {
        xtype: 'numberfield',
        allowBlank: true,
        minValue : 0,
        name: 'ondemand',
        fieldLabel: 'On Demand ...',
        bind: {
            fieldLabel: 'On Demand {currentRecord.absenceunit}',
            value: '{currentRecord.ondemanddefaultvalue}',
            hidden: '{!currentRecord.manageondemand}'
        }
    },{
        xtype: 'textfield',
        fieldLabel:'Auto Incrementation',
        name:'autoincrement',
        maxLength:256,
        bind: {
            value: '{currentRecord.autoincrement}'
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

