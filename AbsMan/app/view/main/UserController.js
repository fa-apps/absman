Ext.define('AbsMan.view.main.UserController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.user',

    onDisconnectClick: function() {
        window.location= logoutUrl;
    },

    onChangePasswordClick: function () {
        alert('TODO');
    },

    onEditProfileClick: function () {
        alert('TODO');
    },

    onBeforeLoadRecord: function(store, operation ) {

        store.proxy.url = store.proxy.baseUrl + userId;

    }
});