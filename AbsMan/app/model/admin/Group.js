Ext.define('AbsMan.model.admin.Group', {
    extend: 'AbsMan.model.Base',


    fields: [
        { name: 'id', type: 'string' },
        { name: 'companyid', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'workingdays', type: 'string'},
        { name: 'disablepublicdays', type: 'boolean'},
        { name: 'lastupdate', type: 'int' },
        { name: 'isdeletable', type: 'boolean' },
        { name: 'isreadonly', type: 'boolean' },
        { name: 'isfavorite', type: 'boolean' },
        { name: 'isdefaultgroup', type: 'boolean' }
    ],

    proxy: {
        type: 'rest',
        baseUrl: 'admin/group/',
        url: 'admin/group/',
        writer: {
            writeAllFields : true
        }
    },

    validators: {
        name: {
            type: 'length',
            min: 2,
            max: 256,
            minOnlyMessage: "Minimum 2 characters are required.",
            maxOnlyMessage: "Maximum 256 characters are required."
        }
    }

});


