export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Reviews', 'user');
    await queryInterface.addColumn('Reviews', 'UserId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Reviews', 'UserId');
    await queryInterface.addColumn('Reviews', 'user', {
      type: Sequelize.STRING
    });
  }
};
