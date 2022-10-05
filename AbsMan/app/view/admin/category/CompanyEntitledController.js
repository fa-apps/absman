
Ext.define('AbsMan.view.admin.category.CompanyEntitledController', {
    extend: 'AbsMan.view.admin.category.CompanyCategoryController',


    alias: 'controller.companyentitledpanel',


    onAdd : function() {

        this.getView().ownerCt.controller.adminPanels.fireEvent("newpanel","adminform-ent-0-" + this.ownerId);
    },


    onEdit : function() {

        var selectedRecord = this.getView().getSelectionModel().getSelected().items[0];

        if (selectedRecord) this.getView().ownerCt.controller.adminPanels.fireEvent("newpanel","adminform-ent-" + selectedRecord.id);

    },

    onSaveSorting : function() {

    },

    onLoad : function() {

        this.parentLoadedSubForms["ent"] = this.getOldestTimeStamp();
    }

});