Ext.define('AbsMan.model.admin.Company', {
    extend: 'AbsMan.model.Base',


    fields: [
        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'countryid', type: 'string'},
        {name: 'lastupdate', type: 'int'},
        {name: 'isdeletable', type: 'boolean'},
        {name: 'isreadonly', type: 'boolean'},
        {name: 'isfavorite', type: 'boolean'},
        {name: 'absenceunit', type: 'int'},
        {name: 'hoursperday', type: 'number'},
        {name: 'manageondemand', type: 'boolean'},
        {name: 'workflow', type: 'int'},
        {name: 'minabsencelength', type: 'int'},
        {name: 'workingdays', type: 'string'},
        {name: 'displaynameformat', type: 'int'}
    ],

    proxy: {
        type: 'rest',
        baseUrl: 'admin/company/',
        url: 'admin/company/',
        writer: {
            writeAllFields: true
        }
    },

    validators: {
        name: 'presence'
    }

});


