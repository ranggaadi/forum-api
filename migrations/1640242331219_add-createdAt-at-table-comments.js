exports.up = (pgm) => {
  pgm.addColumns('comments', {
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('comments', 'created_at');
};
