import { Service } from "../../../core/container";
import { Repository } from "../../../core/database";
import { SourceEntity } from "./model/source-entity";

@Service()
export class SourceRepository extends Repository<SourceEntity> {
  protected readonly tableName = "source";

  public async update(entity: SourceEntity): Promise<void> {
    await this.client.query(
      `UPDATE source
       SET title = $1,
           uri = $2,
           lastupdate = $3
       WHERE id = $4`,
      [entity.title, entity.uri, entity.lastupdate, entity.id]
    );
  }

  public async insert(entity: SourceEntity): Promise<void> {
    await this.client.query(
      `INSERT INTO source (id, userid, type, title, uri, added, lastupdate)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        entity.id,
        entity.userid,
        entity.type,
        entity.title,
        entity.uri,
        entity.added,
        entity.lastupdate,
      ]
    );
  }
}
