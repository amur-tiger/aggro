import { Service } from "../../../core/container";
import { Repository } from "../../../core/database";
import { SourceEntity } from "./model/source-entity";

@Service()
export class SourceRepository extends Repository<SourceEntity> {
  protected readonly tableName = "source";

  public async update(entity: SourceEntity): Promise<void> {
    await this.client.query(
      `UPDATE source
       SET title       = $1,
           url         = $2,
           lastupdate  = $3,
           favicon_url = $4
       WHERE id = $5`,
      [entity.title, entity.url, entity.lastupdate, entity.favicon_url, entity.id]
    );
  }

  public async insert(entity: SourceEntity): Promise<void> {
    await this.client.query(
      `INSERT INTO source (id, userid, type, title, url, added, lastupdate, favicon_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        entity.id,
        entity.userid,
        entity.type,
        entity.title,
        entity.url,
        entity.added,
        entity.lastupdate,
        entity.favicon_url,
      ]
    );
  }
}
