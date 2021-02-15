const fs = require('fs');
const crypto = require('crypto');

const scrypt = require('scryptsy')

class UsersRepository {
    constructor(filename) {
        if(!filename) {
            throw new Error('Creating a repository requies a filename');
        }
        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch(err){
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll(){
        return new Promise((resolve, reject) => {
            fs.readFile(this.filename, 'utf-8', (err, data) => {
                if (err) reject(err);
                else resolve (JSON.parse(data))
            })
        })
    }

    async create(attributes) {
        // attributes === { email: '', password: ''}
        attributes.id = this.randomId();

        const salt = crypto.randomBytes(8).toString('hex');

        const buff = await scrypt(attributes.password, salt, 16384, 8, 1, 64)

        const records = await this.getAll();

        const record = {
            ...attributes,
            password: `${buff.toString('hex')}.${salt}`
        };

        records.push(record); 
        await this.writeAll(records); 
        return record;
    }

    async comparePasswords(saved, supplied) {
        // saved --- password saved in our database 'hashed.salt'
        // supplied --- password given to us by user trying to sign in
        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuf = await scrypt(supplied, salt, 16384, 8, 1, 64);
        return hashed === hashedSuppliedBuf.toString('hex');
    }

    async writeAll(records) {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.filename, JSON.stringify(records, null, 2), (err) => {
                if(err) reject (err);
                else resolve (JSON.stringify(records, null, 2));
        })
    });  
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex')
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords =  records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attributes) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);
        if(!record){
            throw new Error(`Record with id ${id} not found!`);
        }
        Object.assign(record, attributes);
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();

        for(let record of records) {
            let found = true;
          for(let key in filters){
            if(record[key] !== filters[key]){
                found = false;
            }
          }
            if(found) {
                return record;
            }
        }
    }

}

module.exports = new UsersRepository('users.json');