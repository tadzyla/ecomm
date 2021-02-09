const fs = require('fs');
const crypto = require('crypto');

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
        attributes.id = this.randomId();
        const records = await this.getAll();
        records.push(attributes);
        await this.writeAll(records);
    }

    async writeAll(records) {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.filename, JSON.stringify(records, null, 2), (err) => {
                if(err) throw err;
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

}
   

const test = async () => {
    const repo = new UsersRepository('users.json'); 
    const user = await repo.getOne("bea0b394");
    console.log(user);
}; 

test ();
