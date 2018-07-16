export default (model) => {
  return {
    type: 'authors',
    id: model.id,
    attributes: {
      username: model.User.username,
      first: model.first,
      last: model.last
    },
    links: {
      self: `/authors/${model.id}`
    },
    relationships: {
      books: {
        links: {
          related: `/authors/${model.id}/books`
        }
      }
    }
  };
};
