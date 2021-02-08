const fs = require('fs');

class usersRepository {
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
}

const repo = new usersRepository('users.json'); 

