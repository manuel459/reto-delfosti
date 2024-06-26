import { Knex } from "knex";
import { InjectKnex } from "nestjs-knex";
import { ProductosRepository } from "src/domain/repositories/productos.repository";

export class PostgresqlProductosRepository implements ProductosRepository {
    constructor(@InjectKnex() private readonly knex: Knex){}

    async dbContext():Promise<Knex>{
        return this.knex;
    }
    async getAll(sku: string, nombre: string){
        const query = this.knex('productos').select();
        if(sku && sku != 'null'){
            query.whereRaw(`LOWER(sku) like LOWER('%${sku}%')`)
        }
        if(nombre && nombre != 'null'){
            query.orWhereRaw(`LOWER(nombre) like LOWER('%${nombre}%')`);
        }

        return await query;
    }

    async getById(SKU:string, trx?: Knex){
        if(trx) return await trx('productos').where('sku', SKU).first();
        return await this.knex('productos').where('sku', SKU).first();
    }
}