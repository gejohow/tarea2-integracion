'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('artists', {
      artistId: {
        type: Sequelize.STRING,
        primaryKey: true,
        onDelete: 'cascade',
        onUpdate: 'cascade',
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
      },
      age: {
        type: Sequelize.INTEGER,
      },
      albums_url: {
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
    await queryInterface.dropTable('artists');
  }
};