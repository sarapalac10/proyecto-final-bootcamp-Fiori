sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'com/bootcamp/sapui5/freestyle/utils/HomeHelper'

], (Controller, HomeHelper) => {
    "use strict";

    return Controller.extend("com.bootcamp.sapui5.freestyle.controller.Home", {
        onInit() {
            console.log("Vista inicializada correctamente.");
        },

        onPress: async function(evt) {
            console.log("🖥️ Magia renderizada con éxito 🪄✨");
            let oData = await HomeHelper.getDataProducts();
            console.log(oData, 'oData');

            await HomeHelper.setProductModel(this, oData[0].results);

        }, 
    });
});