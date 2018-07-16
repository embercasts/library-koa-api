export default (model) => {
  return {
    type: 'reviews',
    id: model.id,
    attributes: {
      username: model.User.username,
      body: model.body,
      'created-at': model.createdAt
    },
    links: {
      self: `/reviews/${model.id}`
    },
    relationships: {
      book: {
        links: {
          related: `/reviews/${model.id}/book`
        }
      }
    }
  };
};
