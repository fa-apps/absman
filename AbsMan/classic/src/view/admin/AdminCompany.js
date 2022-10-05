
Ext.define('AbsMan.view.admin.AdminCompany', {
    extend: 'AbsMan.view.admin.AdminForm',
    xtype: 'admincompany-panel',

    requires: [
        'AbsMan.view.admin.AdminCompanyModel',
        'AbsMan.view.admin.AdminCompanyController',
        'AbsMan.view.admin.category.CompanyEntitled',
        'AbsMan.view.admin.category.CompanyLeave',
        'AbsMan.view.admin.category.CompanyPublicDay'
    ],
    
    viewModel: {
        type: 'admincompany'
    },

    controller: 'admincompany',

    iconCls : 'x-fa fa-institution',

    title: 'Entity',

    bind: {
        title: '{currentRecord.name}'
    },

    items : [{

        bodyPadding: 10,
        defaults: {
            labelClsExtra: "a-display-label",
            padding: '0 10 10 0',
            labelWidth: 190
        },
        items:[{
            xtype: 'textfield',
            name:'name',
            fieldLabel:'Entity Name',
            labelAlign: "top",
            labelSeparator: '',
            allowBlank:false,
            maxLength: 256,
            width: 350,
            bind: {
                value: '{currentRecord.name}',
                readOnly: '{currentRecord.isreadonly}'
            }
        },{
            xtype: 'radiogroup',
            itemId : 'absenceUnit',
            fieldLabel: 'Absence Unit',
            columns: [100, 100],
            bind: {
                value : '{absenceUnit}',
                readOnly: '{currentRecord.isreadonly}'
            },
            items: [
                {boxLabel: 'Days', name: 'absenceunit', inputValue: 0 },
                {boxLabel: 'Hours', name: 'absenceunit', inputValue: 1 }
            ]
        },{
            xtype: 'numberfield',
            itemId : 'hoursPerDay',
            fieldLabel: 'Hours Per Day',
            bind: {
                value : '{currentRecord.hoursperday}',
                readOnly: '{currentRecord.isreadonly}',
                hidden: '{!currentRecord.absenceunit}'
            },
            hidden: true
        },{
            xtype: 'combo',
            itemId: 'minAbsenceLength',
            fieldLabel: 'Minimum Absence Length',
            bind: {
                value : '{currentRecord.minabsencelength}',
                readOnly: '{currentRecord.isreadonly}'
            },
            queryMode: 'local',
            displayField: 'text',
            valueField: 'value',
            emptyText: 'Please select...',
            forceSelection: true
        },{
            xtype: 'checkboxgroup',
            itemId : 'workingDaysControl',
            fieldLabel: 'Working Days',
            autoHeight: true,
            defaultType: 'checkbox',
            defaults: { padding: '0 10 5 0' },
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
            bind : {
                readOnly: '{currentRecord.isreadonly}'
            }
        },{
            xtype: 'checkbox',
            fieldLabel:'Manage On Demand Absences',
            name:'manageondemand',
            bind: {
                value: '{currentRecord.manageondemand}'
            }
        },{
            xtype: 'combo',
            width: 360,
            fieldLabel: 'Display Name Format',
            bind: {
                value: '{currentRecord.displaynameformat}',
                store: '{lists.displaynameformat}'
            }
        },{
            xtype: 'combo',
            width: 360,
            fieldLabel: 'Request Workflow',
            bind: {
                value: '{currentRecord.workflow}',
                store: '{lists.workflow}',
                readOnly: '{currentRecord.isreadonly}'
            }
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
            bind: '{currentRecord.id}'
        },{
            xtype:'hidden',
            name:'countryid',
            bind: '{currentRecord.countryid}'
        },{
            xtype:'hidden',
            name:'lastupdate',
            bind: '{currentRecord.lastupdate}'
        }]
    },{
        xtype: 'company-entitled-panel',
        title:'Entitled Categories',
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
        xtype: 'company-leave-panel',
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
        xtype: 'company-publicday-panel',
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
        xtype: 'admins-panel',
        title:'Entity administrators',
        titleCollapse : true,
        frame : true,
        minHeight : 200,
        collapsed : true,
        collapsible: true,
        margin : 10,
        bind : {
            hidden : '{isNewRecord}'
        }
    },{
        xtype: 'history-panel',
        title:'Entity History',
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