Ext.define('AbsMan.model.request.Absence', {
    extend: 'AbsMan.model.Base',

    fields: [
        {name: 'userid', type: 'string'},
        {name: 'username', type: 'string'},
        {name: 'workflowid', type: 'int'},
        {name: 'approver', type: 'string'},
        {name: 'approverid', type: 'string'},
        {name: 'requirestandinapprover', type: 'boolean'},
        {name: 'standinapprover', type: 'string'},
        {name: 'standinapproverid', type: 'string'},
        {name: 'requiresubstitute', type: 'boolean'},
        {name: 'substitute', type: 'string'},
        {name: 'substituteid', type: 'string'},
        {name: 'requirenotified', type: 'boolean'},
        {name: 'notified', type: 'string'},
        {name: 'notifiedid', type: 'string'},
        {name: 'absenceunit', type: 'int'}, //todo remove and use context
        {name: 'manageondemand', type: 'boolean'}, //todo remove and use context
        {name: 'minabsencelength', type: 'number'}, //todo remove and use context
        {name: 'leavetime', type: 'number'},
        {name: 'returntime', type: 'number'},
        {name: 'requestdate', type: 'date', dateReadFormat: 'c'},
        {name: 'leavedate', type: 'date', dateFormat: 'Y-m-d'},
        {name: 'returndate', type: 'date', dateFormat: 'Y-m-d'},
        {name: 'comments', type: 'string'},
        {name: 'status', type: 'string'},
        {name: 'statusid', type: 'int'},
        {name: 'totalrequest', type: 'number'},
        //{name: 'requestcontext', type: 'string'},
        {name: 'requestedby', type: 'string'},
        {name: 'approvalby', type: 'string'},
        {name: 'approvaltext', type: 'string'},
        {name: 'canceltext', type: 'string'},
        {name: 'approvaldate', type: 'date', dateReadFormat: 'c'},
        {name: 'requiresubstituteack', type: 'boolean'},
        {name: 'substituteack', type: 'boolean'},
        {name: 'substituteacktext', type: 'string'},
        {name: 'substituteackdate', type: 'date', dateFormat: 'c'},
        {name: 'lastupdate', type: 'int'},
        {name: 'entitledlastupdate', type: 'int'}
    ],

    proxy: {

        type: 'rest',
        baseUrl: 'request/absence/',
        url: 'request/absence/',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }

});