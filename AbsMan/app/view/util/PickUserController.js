
Ext.define('AbsMan.view.util.PickUserController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.pick-user',

    init: function() {

        var me = this.getView();

        this.userStore = this.getViewModel().getStore('userData');
        this.keyTimeOut = null;
        this.pickUserGrid = me.lookupReference('userPickGrid');
        this.pickUserGrid.getSelectionModel().setSelectionMode(this.getView().allowMultiple ? 'MULTI' : 'SINGLE');
    },

    focusSearchText : function () {

        this.lookupReference('pickUserSearchText').focus();
    },

    onSearchClick : function() {

        clearTimeout(this.keyTimeOut);
        this.onSearch();
    },

    onSearch : function() {

        var searchText = this.view.lookupReference('pickUserSearchText').getValue();

        if (searchText.length > 0) {

            this.userStore.getProxy().url = this.userStore.getProxy().baseUrl + encodeURI(searchText);
            if (this.view.openerFilters) {

                this.userStore.filter(this.view.openerFilters);

            } else {

                this.userStore.load();
            }
        }

    },

    onSelectClick : function() {

        var userSelection = this.pickUserGrid.getSelectionModel().getSelection(),
            opener = this.getView().opener,
            openerEvent = this.getView().openerEvent;

        opener.fireEvent(openerEvent, userSelection);
        this.getView().close();

    },

    onKeyUp: function(el,e) {

        clearTimeout(this.keyTimeOut);
        if (e.getKey() != e.ENTER) {
            this.keyTimeOut = Ext.Function.defer(this.onSearch,1000,this)
        }
    },

    onSpecialKey: function (el, e) {

        if (e.getKey() == e.ENTER) {
            clearTimeout(this.keyTimeOut);
            this.onSearch();
        }
    }

});