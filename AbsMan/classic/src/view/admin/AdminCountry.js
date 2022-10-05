
Ext.define('AbsMan.view.admin.AdminCountry', {
    extend: 'AbsMan.view.admin.AdminForm',
    xtype: 'admincountry-panel',

    requires: [
        'AbsMan.view.admin.AdminCountryModel',
        'AbsMan.view.admin.AdminCountryController',
        'AbsMan.view.admin.AdminAdmins',
        'AbsMan.view.history.HistoryPanel'
    ],

    viewModel: {
        type: 'admincountry'
    },

    controller: 'admincountry',

    iconCls : 'x-fa fa-globe',

    bind: {
        title: '{currentRecord.name}'
    },

    items : [{

        bodyPadding: 10,
        items:[{
            xtype: 'textfield',
            name:'name',
            labelClsExtra: "a-display-label",
            fieldLabel:'Country Name',
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
            xtype:'hidden',
            name:'id',
            bind: '{currentRecord.id}'
        },{
            xtype:'hidden',
            name:'lastupdate',
            bind: '{currentRecord.lastupdate}'
        }]
    },{
        xtype: 'admins-panel',
        title:'Country administrators',
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
        title:'Country History',
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