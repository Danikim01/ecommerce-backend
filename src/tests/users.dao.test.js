import app from '../app.js'
import request from 'supertest'
import { expect } from 'chai'
import { usersService } from '../repositories/index.js';
import config from '../config/config.js';


describe("Test Users",()=>{
    let userId;

    before(async () => {
        // Paso el día en segundos a milisegundos 
        const currentDate = new Date().getTime();
        const dia = config.user_timeout  * 1000;  // Multiplica por 1000 para convertir a milisegundos
        let sub = currentDate - dia;
        sub = new Date(sub).toISOString();
        const testUser = {
            first_name: 'Juan',
            last_name: 'Perez',
            email: 'jperez@gmail.com',
            age: 18,
            password: 'abc445',
        };

        usersService.createUser(testUser);
        const res = await usersService.getUserByEmail(testUser.email);
        await usersService.updateField(res._id, { last_connection: sub });
        userId = res._id;
    });

    after(async () => {
        // Eliminar el usuario dummy
        await usersService.deleteUser({ email: "jperez@gmail.com"});
    });
    

    it("GET /api/users deberia devolver un array de usuarios",async () => {
        const res = await request(app).get("/api/users");
        expect(res.status).to.be.equals(200);
        expect(res._body.payload).to.be.an('array');
        expect(res._body.payload).to.be.not.empty;
    });

    it("DELETE /api/users debería marcar a los usuarios inactivos como inactivos", async () => {        
        const res = await request(app)
            .delete(`/api/users`);

        expect(res.status).to.be.equals(200);
        expect(res.body.status).to.be.equals('success');
        expect(res.body.inactive_users).to.be.an('array');
        expect(res.body.inactive_users[0]).to.have.property('_id');
        //testea que por lo menos uno de los usuarios inactivos sea el usuario dummy
        expect(res.body.inactive_users.some(user => user._id === userId.toString())).to.be.true;
    });

})