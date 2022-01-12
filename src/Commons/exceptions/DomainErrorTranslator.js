const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),

  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
  'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
  'POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat posted thread baru karena properti yang dibutuhkan tidak ada'),
  'POSTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat posted thread baru karena tipe data tidak sesuai'),

  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada'),
  'NEW_COMMENT.NOT_MEET_DATA_SPECIFICATION': new InvariantError('tidak dapat membuat komentar baru  karena tipe data tidak sesuai'),
  'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat respon komentar karena properti yang dibutuhkan tidak ada'),
  'ADDED_COMMENT.NOT_MEET_DATA_SPECIFICATION': new InvariantError('tidak dapat membuat respon komentar karena tipe data tidak sesuai'),

  'DELETE_COMMENT_FROM_THREAD_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('property payload tidak lengkap'),
  'DELETE_COMMENT_FROM_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_SPECIFICATION': new InvariantError('tipe data payload tidak sesuai'),

  'GET_THREAD_DETAILS_USE_CASE.PAYLOAD_NOT_CONTAIN_THREAD_ID': new InvariantError('payload memperlukan thread id'),
  'GET_THREAD_DETAILS_USE_CASE.PAYLOAD_NOT_MEET_DATA_SPECIFICATION': new InvariantError('tipe data payload tidak sesuai'),

  'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('property payload tidak lengkap'),
  'ADDED_REPLY.NOT_MEET_DATA_SPECIFICATION': new InvariantError('tipe data payload tidak sesuai'),

  'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('property payload tidak lengkap'),
  'NEW_REPLY.NOT_MEET_DATA_SPECIFICATION': new InvariantError('tipe data payload tidak sesuai'),

  'REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('property payload tidak lengkap'),
  'REPLY_DETAILS.NOT_MEET_DATA_SPECIFICATION': new InvariantError('tipe data payload tidak sesuai'),

  'DELETE_REPLY_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('property payload tidak lengkap'),
  'DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_SPECIFICATION': new InvariantError('tipe data payload tidak sesuai'),

  'LIKE_COMMENT_ACTION_USE_CASE.PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('property payload tidak lengkap'),
  'LIKE_COMMENT_ACTION_USE_CASE.PAYLOAD_NOT_MEET_DATA_SPECIFICATION': new InvariantError('tipe data payload tidak sesuai'),
};

module.exports = DomainErrorTranslator;
