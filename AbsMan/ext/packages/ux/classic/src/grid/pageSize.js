
Ext.define('Ext.ux.grid.PageSize', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'plugin.pagesize',
    beforeText: 'Rows per page: ',
    mode: 'local',
    displayField: 'text',
    valueField: 'value',
    allowBlank: false,
    triggerAction: 'all',
    width : 70,
    editable: false,

    init: function(paging) {
        paging.on('afterrender', this.onInitView, this);
        this.paging = paging;
    },

    store: new Ext.data.SimpleStore({
        fields: ['text', 'value'],
        data: [['10', 10], ['20', 20], ['50', 50], ['100', 100], ['200', 200], ['500', 500], ['All', 0]]
    }),

    onInitView: function(paging) {

        this.setValue(paging.store.pageSize);
        paging.add('-', this.beforeText, this);
        this.on('select', this.onPageSizeChanged, paging);
        /*this.on('specialkey', function(combo, e) {
            if(13 === e.getKey()) {
                this.onPageSizeChanged.call(paging, this);
            }
        });*/
    },

    onPageSizeChanged: function(combo) {

        var selectedSize = combo.getRawValue();

        combo.paging.displayMsg = selectedSize == "All" ?'Displaying items 1 - {2} of {2}' : 'Displaying items {0} - {1} of {2}';
        this.store.pageSize = parseInt(selectedSize, 10);
        this.doRefresh();
    }
}); 