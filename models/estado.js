import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Estado = db.define("estados", {
    status:{
        type: DataTypes.STRING(20),
        allowNull: false
    }
});

export default Estado;
