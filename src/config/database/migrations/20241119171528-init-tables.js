'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    await queryInterface.createTable('deliveries', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
      },
      customerName: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      contact: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      origin: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      destination: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      lastKnownDelay: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      delivered: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('deliveries');
    await queryInterface.sequelize.query(`DROP EXTENSION IF EXISTS "pgcrypto";`);
  },
};
