
Ext.define('AbsMan.view.util.PickUserModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.pick-user',


    formulas: {
        currentUser: {
            bind: {
                bindTo: '{userPickGrid.selection}',
                deep: true
            },
            get : function (user) {
                return user;
            },
            set : function(user) {
                if (!user.isModel()) {
                    user = this.get('userData').getById(user);
                }
                this.set('currentUser',user);
            }
        }
    },

    stores: {

        userData: {

            autoLoad: false,
            autoSync: false,
            remoteSort: true,
            remoteFilter: true,
            pageSize: 10,
            model: 'util.pickUser'
        }


    }
});