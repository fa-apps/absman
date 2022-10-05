
Ext.define('AbsMan.view.admin.category.PublicDayDetails', {
    extend: 'AbsMan.view.admin.AdminForm',
    xtype: 'publicday-detailspanel',

    deferredRender: true,
    requires: [

        'AbsMan.view.admin.category.CompanyPublicDayDetailsController',
        'AbsMan.view.admin.category.CompanyPublicDayDetailsModel'
    ],

    viewModel: {
        type: 'publicday-details'
    },

    controller: 'publicday-details',

    title: 'PublicDay Details',
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
        beforeclose : 'onPublicDayDetailsClose'
    },

    items:[{
        xtype: 'textfield',
        fieldLabel:'Public Day Name',
        allowBlank:false,
        maxLength:256,
        name:'name',
        width: 450,
        bind: {
            value: '{currentRecord.name}'
        }
    },{
        xtype: 'datefield',
        fieldLabel: 'Date',
        allowBlank:  false,
        name:'date',
        format: 'd M Y',
        bind: {
            value: '{currentRecord.date}'
        }
    },{
        xtype: 'radiogroup',
        fieldLabel: 'Length',
        columns: 1,
        defaults: { padding: '0 10 5 0' },
        bind: {
            value : '{publicDayLength}'
        },
        items: [
            {boxLabel: 'Whole Day', name: 'pdlength', inputValue: 0 },
            {boxLabel: 'Morning', name: 'pdlength', inputValue: 1 },
            {boxLabel: 'Afternoon', name: 'pdlength', inputValue: 2 }
        ]
    },{
        xtype:'hidden',
        name:'companyid',
        bind : '{currentRecord.companyid}'
    },{
        xtype:'hidden',
        name:'id',
        bind : '{currentRecord.id}'
    },{
        xtype:'hidden',
        name:'lastupdate',
        bind : '{currentRecord.lastupdate}'
    }]
});

