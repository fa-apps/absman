

Ext.define('AbsMan.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    init: function () {

        this.userPreferenceStore = this.getViewModel().getStore("userPreference");
        this.loadUserPreferences();
    },


    loadUserPreferences: function () {


        this.userPreferenceStore.getProxy().url = this.userPreferenceStore.getProxy().baseUrl + userId;

        this.userPreferenceStore.load({


            scope: this,
            callback: function (records, operation, success) {

                if (success) {

                    var response = Ext.JSON.decode(operation.getResponse().responseText);


                   // console.log(this.userPreferenceStore.getData().items);

                } else {

                    var response = operation.getError();

                    AbsMan.util.mess(response.statusText + " (" + response.status + ")", AbsMan.util.CRITICAL);
                }

            }
        });


    },


    saveUserPreference: function (preference, value) {


        var preferenceModel = this.userPreferenceStore.findRecord("name", preference);

        if (preferenceModel) {

            preferenceModel.set("value", value);

        } else {

            preferenceModel = new AbsMan.model.main.UserPreference({name: preference, value: value});

            this.userPreferenceStore.add(preferenceModel);
        }

        this.userPreferenceStore.sync({

            scope: this,
            success: function (batch, options) {

                Ext.Array.each(batch.getOperations(), function (operation) {

                    var response = Ext.JSON.decode(operation.getResponse().responseText);

                    if (response.success) {

                        AbsMan.util.mess(response.mess || "Sync Done", AbsMan.util.INFO);

                    } else {

                        AbsMan.util.mess(response.mess || "Sync Failed", AbsMan.util.ERROR);
                    }

                }, this);
            },


            failure: function (batch) {

                var response = Ext.JSON.decode(batch.getOperations()[0].getResponse().responseText);

                AbsMan.util.mess(response.mess, AbsMan.util.CRITICAL);
            }
        });


        /*
         Ext.Ajax.request({
         scope: this,
         url: 'user/preference/' + userId,
         method: 'PUT',
         params: {
         preference: Ext.JSON.encode(preference),
         value: Ext.JSON.encode(value)
         },
         success: function (responseData) {

         var response = Ext.JSON.decode(responseData.responseText);

         if (response.success) {

         console.log(this.userPreferenceStore);

         AbsMan.util.mess(response.mess || "Preference has been saved!");

         } else {

         AbsMan.util.mess(response.mess || "Error during Preference update.", AbsMan.util.ERROR);
         }

         },
         failure: function (response) {

         AbsMan.util.mess(response.statusText + " (" + response.status + ")", AbsMan.util.CRITICAL);
         }
         });

         */

    }


});
