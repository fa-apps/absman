Ext.define('AbsMan.model.admin.category.EntitledUserBase', {
    extend: 'AbsMan.model.Base',

    fields: [
        { name: 'id', type: 'string' },
        { name: 'userid', type: 'string' },
        { name: 'user', type: 'string' },
        { name: 'categoryid', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'text', type: 'string' },
        { name: 'defaultvalue', type: 'number' },
        { name: 'allocated', type: 'number' },
        { name: 'taken', type: 'number' },
        { name: 'left', type: 'number' },
        { name: 'ondemanddefaultvalue', type: 'number' },
        { name: 'ondemandallocated', type: 'number' },
        { name: 'ondemandtaken', type: 'number' },
        { name: 'ondemandleft', type: 'number' },
        { name: 'hidden', type: 'boolean' },
        { name: 'absenceunit', type: 'string' },
        { name: 'lastupdate', type: 'int' },
        { name: 'categorylastupdate', type: 'int' },
        { name: 'validfrom', type: 'date', dateFormat:'Y-m-d'},
        { name: 'validto', type: 'date', dateFormat:'Y-m-d'},
        { name: 'displayorder', type: 'int' },
        { name: 'year', type: 'string'},
        { name: 'isdeletable', type: 'boolean' },
        { name: 'isreadonly', type: 'boolean' },
        { name: 'isfavorite', type: 'boolean' }

    ]

});
