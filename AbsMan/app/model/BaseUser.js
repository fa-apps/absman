Ext.define('AbsMan.model.BaseUser', {
    extend: 'AbsMan.model.Base',


    fields: [
        { name: 'id', type: 'string' },
        { name: 'username', type: 'string' },
        { name: 'displayname', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'firstname', type: 'string' },
        { name: 'lastname', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'number', type: 'string' },
        { name: 'workingdays', type: 'string' },
        { name: 'birthdate', type: 'date' },
        { name: 'hiredate', type: 'date' },
        { name: 'disablepublicdays', type: 'boolean' },
        { name: 'enabled', type: 'boolean' },
        { name: 'lastupdate', type: 'int' },
        { name: 'companyid', type: 'string' },
        { name: 'isdeletable', type: 'boolean' },
        { name: 'isreadonly', type: 'boolean' },
        { name: 'isfavorite', type: 'boolean' },
        { name: 'manageondemand', type: 'boolean' },
        { name: 'workflow', type: 'int' },
        { name: 'approver', type: 'string' },
        { name: 'standinapprover', type: 'string' },
        { name: 'substitute', type: 'string' },
        { name: 'notified', type: 'string' },
        { name: 'absproxy', type: 'string' },
        { name: 'approverid', type: 'string' },
        { name: 'standinapproverid', type: 'string' },
        { name: 'substituteid', type: 'string' },
        { name: 'notifiedid', type: 'string' },
        { name: 'absproxyid', type: 'string' },
        { name: 'notes', type: 'string' },
        { name: 'adminnotes', type: 'string' },
        { name: 'pendingcount', type: 'int' },
        { name: 'pendingtext', type: 'string' }


    ]

});


