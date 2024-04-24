import { DataTypes, STRING } from "sequelize";
import db from "../config/db.js";

const Assets = db.define("assets", {
  id: {
    type: DataTypes.UUID,
    default: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  marca: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  modelo: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  serial: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  usuario: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  ubicacion:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado:{
    type: DataTypes.INTEGER,
    allowNull: false
  }

});

export default Assets;
