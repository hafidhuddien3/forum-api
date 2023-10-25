/* eslint-disable camelcase */
exports.up = (pgm) => {
    pgm.createTable('comments', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      owner: {
        type: 'TEXT',
        notNull: true,
      },
      date: {
        type: 'TEXT',
        notNull: true,
      },
      content: {
        type: 'TEXT',
        notNull: true,
      },
      threadid: {
        type: 'TEXT',
        notNull: true,
      },
      is_delete: {
        type: 'TEXT',
        notNull: true,
      },
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('comments');
  };
  