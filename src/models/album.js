'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class album extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.album.belongsTo(models.artist, {
        foreignKey: 'artistId',
      });
      models.album.hasMany(models.track, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
        foreignKey: 'albumId',
      });
    }
  };
  album.init({
    albumId: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: 'albums',
        key: 'albumId',
      },
      allowNull: false,
    },
    name: DataTypes.STRING,
    genre: DataTypes.STRING,
    artist_url: DataTypes.STRING,
    tracks_url: DataTypes.STRING,
    self_url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'album',
  });
  return album;
};
