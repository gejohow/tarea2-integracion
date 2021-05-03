'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class artist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.artist.hasMany(models.album, {
        foreignKey: 'artistId',
        onDelete: 'cascade',
        onUpdate: 'cascade',
      });
    }
  };
  artist.init({
    artistId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    albums_url: DataTypes.STRING,
    tracks_url: DataTypes.STRING,
    self_url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'artist',
  });
  return artist;
};