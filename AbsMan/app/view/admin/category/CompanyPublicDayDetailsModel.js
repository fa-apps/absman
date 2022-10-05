
Ext.define('AbsMan.view.admin.category.CompanyPublicDayDetailsModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.publicday-details',

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
                    return record.data.id.substr(0, 2) === "0-";
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
        saveEnabled : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function(record) {
                if (record) {
                    return (record.data.isreadonly == false && record.dirty == true);
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
                    return (record.data.isreadonly == false && record.data.isdeletable == true);
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
                    return record.data.isfavorite === true ? 'x-fa fa-heart' : 'x-fa fa-heart-o';
                }
            }
        },
        publicDayLength : {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function (record) {
                var val = record && record.isModel ? record.get('pdlength').toString() : null;
                return val ? { pdlength:val } : null;
            },
            set: function(value) {
                var val = Ext.isObject(value) ? value.pdlength : value ;
                this.get('currentRecord').set('pdlength',val);
            }
        }
    },


    stores: {

        formData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'admin.category.PublicDayDetails',

            listeners: {
                load: 'onLoadedRecord',
                beforeload: 'resetProxy'
            }

        }
    }



});