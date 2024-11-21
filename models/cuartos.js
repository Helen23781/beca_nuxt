const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const Cuartos = sequelize.define("cuartos", {
    numero_cuarto: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
   capacidad_maxima: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    
}, {
    timestamps: true,
    paranoid: true,
});


module.exports = Cuartos;