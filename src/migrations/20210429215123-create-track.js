'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tracks', {
      trackId: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      albumId: {
        type: Sequelize.STRING,
        references: {
          model: 'albums',
          key: 'albumId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
      },
      duration: {
        type: Sequelize.FLOAT,
      },
      times_played: {
        type: Sequelize.INTEGER,
      },
      artist_url: {
        type: Sequelize.STRING,
      },
      album_url: {
        type: Sequelize.STRING,
      },
      self_url: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tracks');
  }
};