import { Migration } from "../migration";

export const addSources: Migration = {
  id: 1,
  name: "Add Sources",
  async up(client, logger) {
    logger.info('Creating table "source"');
    await client.query(
      `CREATE TABLE source
       (
           id         UUID         NOT NULL PRIMARY KEY,
           userid     UUID         NOT NULL,
           type       VARCHAR(32)  NOT NULL,
           title      VARCHAR(128) NOT NULL,
           uri        VARCHAR(256) NOT NULL,
           added      TIMESTAMPTZ  NOT NULL,
           lastupdate TIMESTAMPTZ  NULL,

           CONSTRAINT FK_user_id FOREIGN KEY (userid) REFERENCES "user" (id)
       )`
    );
  },
};
