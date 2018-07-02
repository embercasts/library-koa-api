export default (model) => {
  return {
    type: 'books',
    id: model.id,
    attributes: {
      title: model.title,
      isbn: model.isbn,
      'publish-date': model.publishDate
    },
    links: {
      self: `/books/${model.id}`
    },
    relationships: {
      author: {
        links: {
          related: `/books/${model.id}/author`
        }
      },
      reviews: {
        links: {
          related: `/books/${model.id}/reviews`
        }
      }
    }
  };
};
