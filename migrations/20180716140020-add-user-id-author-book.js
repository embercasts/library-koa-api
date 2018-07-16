export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Authors', 'UserId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    });

    await queryInterface.addColumn('Books', 'UserId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Authors', 'UserId');
    await queryInterface.removeColumn('Books', 'UserId');
  }
};
