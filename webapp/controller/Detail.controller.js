sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "com/bootcamp/sapui5/freestyle/utils/HomeHelper",
    "sap/m/MessageBox",
    "com/bootcamp/sapui5/freestyle/model/formatter"
], (Controller, JSONModel, Fragment, HomeHelper, MessageBox, formatter) => {
    "use strict";

    return Controller.extend("com.bootcamp.sapui5.freestyle.controller.Detail", {
        formatter: formatter,

        onInit() {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            const sSupplierID = oEvent.getParameter("arguments").SupplierID;

            this.getView().bindElement({
                path: "/Suppliers(" + sSupplierID + ")",
                parameters: {
                    expand: "Products,Products/Category"
                }
            });

            const oModel = this.getView().getModel();
            oModel.read(`/Suppliers(${sSupplierID})/Products`, {
                success: (oData) => {
                    HomeHelper.setSimulatedProductsModel(this.getOwnerComponent(), oData.results);
                },
                error: () => {
                    HomeHelper.setSimulatedProductsModel(this.getOwnerComponent(), []);
                }
            });
        },

        onAddProduct: function () {
            HomeHelper.setEmptyProductModel(this.getOwnerComponent());
            this._openProductDialog(true);
        },

        onProductPress: function (oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oContext = oItem.getBindingContext("SimulatedProductsModel");
            const oProduct = oContext.getObject();
            const oProductModel = HomeHelper.createProductModelFromExisting(oProduct);
            this.getOwnerComponent().setModel(oProductModel, "ProductModel");
            this._openProductDialog(false);
        },

        _openProductDialog: async function (isCreating) {
            const oView = this.getView();
            oView.setModel(new JSONModel({ isCreating }), "viewFlags");

            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    name: "com.bootcamp.sapui5.freestyle.view.fragments.ProductFormDialog",
                    controller: this
                }).then(oDialog => {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            const oDialogInstance = await this._pDialog;
            oDialogInstance.open();
        },

        onCreateProduct: async function () {
            const oProductModel = this.getView().getModel("ProductModel");
            const oProduct = oProductModel.getData();
            let bIsValid = true;

            const aFieldsToValidate = [
                { path: "/ProductName", statePath: "/ProductNameState" },
                { path: "/UnitPrice", statePath: "/UnitPriceState" },
                { path: "/UnitsInStock", statePath: "/UnitsInStockState" },
                { path: "/CategoryID", statePath: "/CategoryIDState" }
            ];

            aFieldsToValidate.forEach(field => {
                const value = oProductModel.getProperty(field.path);

                if (!value) {
                    oProductModel.setProperty(field.statePath, "Error");
                    bIsValid = false;
                } else {
                    oProductModel.setProperty(field.statePath, "None");
                }
            });

            if (!bIsValid) {
                sap.m.MessageToast.show("Please fill all required fields.");
                return;
            }

            const oModel = this.getView().getModel("SimulatedProductsModel");
            const aProducts = oModel.getData();
            const isCreating = this.getView().getModel("viewFlags").getProperty("/isCreating");

            if (isCreating) {
                aProducts.push(oProduct);
                oModel.refresh();
            }

            const oDialog = await this._pDialog;
            oDialog.close();
        },

        onDeleteProduct: function (oEvent) {
            const iIndex = this._getProductIndexFromEvent(oEvent);
            if (iIndex === null) return;
            this._confirmAndDeleteProduct(iIndex);
        },

        _getProductIndexFromEvent: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext("SimulatedProductsModel");
            if (!oContext) return null;
            const sPath = oContext.getPath();
            const iIndex = parseInt(sPath.replace("/", ""), 10);
            return isNaN(iIndex) ? null : iIndex;
        },

        _confirmAndDeleteProduct: function (iIndex) {
            const oModel = this.getView().getModel("SimulatedProductsModel");
            const aData = oModel.getData();

            MessageBox.confirm("Are you sure you want to delete this product?", {
                title: "Confirm Deletion",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        aData.splice(iIndex, 1);
                        oModel.refresh();
                        sap.m.MessageToast.show("Product deleted");
                    }
                }
            });
        },

        onCloseDialog: async function () {
            const oDialog = await this._pDialog;
            oDialog.close();
        },

        onNavBack: function () {
            const oHistory = sap.ui.core.routing.History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();
        
            if (sPreviousHash) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteHome", {}, true);
            }
        }
        
    });
});
