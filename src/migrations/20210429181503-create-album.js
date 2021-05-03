'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('albums', {
      albumId: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
          model: 'albums',
          key: 'albumId',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        allowNull: false,
      },
      artistId: {
        type: Sequelize.STRING,
        references: {
          model: 'artists',
          key: 'artistId',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      name: {
        type: Sequelize.STRING,
      },
      genre: {
        type: Sequelize.STRING,
      },
      artist_url: {
        type: Sequelize.STRING,
      },
      tracks_url: {
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
    await queryInterface.dropTable('albums');
  }
};