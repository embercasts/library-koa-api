export default (model) => {
  return {
    type: 'users',
    id: model.id,
    attributes: {
      username: model.username,
      email: model.email
    }
  };
};
