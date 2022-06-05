import { Migration } from "../migration";

export const uriToUrl: Migration = {
  id: 2,
  name: "Uri to Url",
  async up(client, _container, logger) {
    logger.info('Altering table "source"');
    await client.query(
      `ALTER TABLE source
          RENAME COLUMN uri TO url`
    );
  },
};
