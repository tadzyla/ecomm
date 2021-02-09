const fs = require('fs');

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
}
   

const test = async () => {
    const repo = new UsersRepository('users.json'); 
    const users = await repo.getAll()
        .then((val) => {
            console.log('rezultatas: ', val);
            return val;
        })
        .catch((err) => {
            console.log('blogai', err)
        })

    console.log('users are: ', users);
}; 

test ();
