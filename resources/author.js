export default (model) => {
  return {
    type: 'authors',
    id: model.id,
    attributes: {
      first: model.first,
      last: model.last
    },
    links: {
      self: `/authors/${model.id}`
    },
    relationships: {
      books: {
        links: {
          related: `/author/${model.id}/books`
        }
      }
    }
  };
};
