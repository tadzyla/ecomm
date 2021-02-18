const fs = require('fs');
const crypto = require('crypto');
const scrypt = require('scryptsy')
const Repository = require('./repository');

class UsersRepository extends Repository{
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
}

module.exports = new UsersRepository('users.json');