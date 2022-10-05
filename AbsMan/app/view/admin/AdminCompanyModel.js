
Ext.define('AbsMan.view.admin.AdminCompanyModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.admincompany',

    formulas: {
        currentRecord: {
            get: function (get) {
                return get('formData').getAt(0);
            }
        },
        isNewRecord : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return record.get('id').substr(0, 2) === "0-";
                }
            }
        },
        isDirtyRecord : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return record.dirty === true;
                }
            }
        },
        favoriteIconCls : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return record.get('isfavorite')  ? 'x-fa fa-heart' : 'x-fa fa-heart-o';
                }
            }
        },
        saveEnabled : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return (!record.get('isreadonly')  && record.dirty );
                }
            }
        },
        isReadOnly : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return record.get('isreadonly');
                }
            }
        },
        canManageAdmins : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return !record.get('isreadonly');
                }
            }
        },
        manageOnDemand : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return record.get('manageondemand');
                }
            }
        },
        deleteEnabled : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return (!record.get('isreadonly') && record.get('isdeletable'));
                }
            }
        },
        absenceUnit : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function (record) {
                var val = record && record.isModel ? record.get('absenceunit').toString() : null;
                return val ? { absenceunit:val } : null;
            },
            set: function(value) {
                var val = Ext.isObject(value) ? value.absenceunit : value ;
                this.get('currentRecord').set('absenceunit',val);
            }
        }
    },


    stores: {

        formData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'admin.Company',

            listeners: {
                load: 'onLoadedRecord',
                beforeload: 'resetProxy'
            }

        },

        minAbsLengthDays: {
            fields: [
                {name: 'value', type: 'number'},
                {name: 'text', type: 'string'}
            ],
            data: [
                [25, 'quarter of a day'],
                [50, 'half day'],
                [100, 'one day']
            ]
        },

        minAbsLengthHours: {
            fields: [
                {name: 'value', type: 'number'},
                {name: 'text', type: 'string'}
            ],
            data: [
                [25, 'quarter of an hour (15 min)'],
                [50, 'half an hour (30 min)'],
                [100, 'one hour'],
                [200, 'two hours'],
                [300, 'three hours'],
                [400, 'four hours'],
                [500, 'five hours']
            ]
        }

    }
});