import { Migration } from "../migration";
import { SourceService } from "../../../domains/source";

export const addFavicon: Migration = {
  id: 3,
  name: "Add Favicon",
  async up(client, container, logger) {
    const response = await client.query(
      `SELECT true AS exists
       FROM information_schema.columns
       WHERE table_schema = CURRENT_SCHEMA()
         AND table_name = 'source'
         AND column_name = 'favicon_url'`
    );

    if (response.rows[0].exists) {
      logger.warn('Column "source"."favicon_url" already exists');
    } else {
      logger.info('Altering table "source"');
      await client.query(
        `ALTER TABLE source
            ADD COLUMN favicon_url VARCHAR(256) NULL`
      );
    }

    const service = container.get(SourceService);

    const entries = await client.query(
      `SELECT id, url
       FROM source
       WHERE favicon_url IS NULL`
    );
    logger.info(`Updating ${entries.rowCount} rows`);
    for (const entry of entries.rows) {
      const faviconUrl = await service.findFavicon(entry.url);
      await client.query(
        `UPDATE source
         SET favicon_url = $1
         WHERE id = $2`,
        [faviconUrl, entry.id]
      );
    }

    logger.info('Altering table "source"');
    await client.query(`ALTER TABLE source
        ALTER COLUMN favicon_url SET NOT NULL`);
  },
};
