// Este es un intermedio entre el controlador de la vista y el que hace los llamados al servicio (HomeService)

// Acá puedo hacer cálculos y tranformación de datos, y aplicar reglas de negocio para no cargar el controlador

sap.ui.define([
    "com/bootcamp/sapui5/freestyle/utils/HomeService",
    "sap/ui/model/json/JSONModel",
], function (HomeService, JSONModel) {
    "use strict";

    return {
        init: function (oNorthwindModel) {
            this._oNorthwindModel = oNorthwindModel;
        },

        getDataSuppliers: async function() {
            let oFilter = [];
            return HomeService.readSuppliers(this._oNorthwindModel, []);
        },

        // mapear los datos 
        // Recibe una instancia del controller y los datos, que en este caso es un array
        setProductModel: async function (oController, aData) {
            let oListModel = oController.getOwnerComponent().getModel('ProductCollection');

            if(!oListModel) {
                const oModel = new JSONModel([]);
                oModel.setSizeLimit(10000);
                oController.getOwnerComponent().setModel(oModel, "ProductCollection");
                oListModel = oController.getOwnerComponent().getModel('ProductCollection');
            }

            oListModel.setData(aData);
            
        },

        setEmptyProductModel: function (oComponent) {
            oComponent.setModel(new JSONModel({
                ProductName: "",
                UnitPrice: "",
                UnitsInStock: "",
                CategoryID: "",
                SupplierID: "",
                ProductNameState: "None",
                UnitPriceState: "None",
                UnitsInStockState: "None",
                CategoryIDState: "None"
            }), "ProductModel");
        },

        createProductModelFromExisting: function (oProduct) {
            return new JSONModel(Object.assign({}, oProduct));
        },

        setSimulatedProductsModel: function (oComponent, aProducts) {
            const oModel = new JSONModel(aProducts || []);
            oComponent.setModel(oModel, "SimulatedProductsModel");
        }

    };
});