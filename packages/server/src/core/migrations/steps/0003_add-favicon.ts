import { Migration } from "../migration";
import { FeedHandler, SourceService } from "../../../domains/source";

export const addFavicon: Migration = {
  id: 3,
  name: "Add Favicon",
  async up(client, logger) {
    logger.info('Altering table "source"');
    await client.query(
      `ALTER TABLE source
          ADD COLUMN favicon_url VARCHAR(256) NULL`
    );

    const service = new SourceService("1.3.0", null as unknown as FeedHandler);

    const entries = await client.query(`SELECT id, url
                                        FROM source`);
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
