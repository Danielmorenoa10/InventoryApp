import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Ubicacion = db.define("ubicaciones", {
    sitio:{
        type: DataTypes.STRING(20),
        allowNull: false
    }
});

export default Ubicacion;
