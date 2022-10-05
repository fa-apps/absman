Ext.define('AbsMan.model.request.RequestList', {
    extend: 'AbsMan.model.Base',

    fields: [
        {name: 'userid', type: 'string'},
        {name: 'user', type: 'string'},
        {name: 'approver', type: 'string'},
        {name: 'leavedate', type: 'date', dateReadFormat: 'Y-m-d'},
        {name: 'leavetime', type: 'number'},
        {name: 'returndate', type: 'date', dateReadFormat: 'Y-m-d'},
        {name: 'returntime', type: 'number'},
        {name: 'status', type: 'string'},
        {name: 'totalrequest', type: 'number'},
        {name: 'requestdate', type: 'date', dateReadFormat: 'c'}
    ]

});