'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('invoices', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending', // Sets existing rows to 'pending'
      after: 'pending_amount' // (MySQL only) Places it after the 'amount' column
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('invoices', 'status');
  }
};
