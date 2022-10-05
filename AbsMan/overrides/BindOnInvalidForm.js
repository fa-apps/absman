Ext.define('Ext.overrides.form.field.Base', {
    override: 'Ext.form.field.Base',

    publishValue: function () {
        var me = this;
        if (me.rendered) {
            if (me.bindOnInvalid == false && me.getErrors().length) return;
            me.publishState('value', me.getValue());
        }
    }

});