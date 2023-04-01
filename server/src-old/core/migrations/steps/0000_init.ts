import { Migration } from "../migration";

export const init: Migration = {
  id: 0,
  name: "Init",
  async up(client, _container, logger) {
    logger.info('Creating table "user"');
    await client.query(
      `CREATE TABLE "user"
       (
           id         UUID         NOT NULL PRIMARY KEY,
           username   VARCHAR(32)  NOT NULL UNIQUE,
           mail       VARCHAR(128) NOT NULL UNIQUE,
           password   VARCHAR(512) NOT NULL,
           registered TIMESTAMPTZ  NOT NULL,
           lastlogin  TIMESTAMPTZ  NULL
       )`
    );

    logger.info('Creating table "session"');
    await client.query(
      `CREATE TABLE session
       (
           id       UUID        NOT NULL PRIMARY KEY,
           userid   UUID        NOT NULL,
           token    CHAR(32)    NOT NULL,
           created  TIMESTAMPTZ NOT NULL,
           accessed TIMESTAMPTZ NULL,

           CONSTRAINT FK_user_id FOREIGN KEY (userid) REFERENCES "user" (id)
       )`
    );
  },
};
