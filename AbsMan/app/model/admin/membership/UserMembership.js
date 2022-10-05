Ext.define('AbsMan.model.admin.membership.UserMembership', {
    extend: 'AbsMan.model.Base',


    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'isdefaultgroup', type: 'boolean' },
        { name: 'lastupdate', type: 'int' },
        { name: 'companyid', type: 'string' }
    ]

});


