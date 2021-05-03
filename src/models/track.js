'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class track extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.album.belongsTo(models.track, { foreignKey: 'albumId'});
    }
  };
  track.init({
    trackId: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: 'tracks',
        key: 'trackId',
      },
    },
    name: DataTypes.STRING,
    duration: DataTypes.FLOAT,
    times_played: DataTypes.INTEGER,
    artist_url: DataTypes.STRING,
    album_url: DataTypes.STRING,
    self_url: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'track',
  });
  return track;
};