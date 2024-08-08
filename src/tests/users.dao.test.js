import app from '../app.js'
import request from 'supertest'
import { expect } from 'chai'
import { usersService } from '../repositories/index.js';


describe("Test Users",()=>{
    let userId;

    before(async () => {
        const currentDate = new Date();
        const lastConnectionDate = new Date(currentDate.getTime() - (365 * 24 * 60 * 60 * 1000)); // 1 año atrás
        const testUser = {
            first_name: 'Juan',
            last_name: 'Perez',
            email: 'jperez@gmail.com',
            age: 18,
            password: 'abc445',
        };

        usersService.createUser(testUser);
        const res = await usersService.getUserByEmail(testUser.email);
        await usersService.updateField(res._id, { last_connection: lastConnectionDate.toISOString() });
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
        // 1 año en segundos
        const oneYearInSeconds = 365 * 24 * 60 * 60;
        // 5 días en segundos
        const fiveDaysInSeconds = 5 * 24 * 60 * 60;
        // Total de 1 año + 5 días en segundos
        const timeInSeconds = oneYearInSeconds + fiveDaysInSeconds;
        
        const res = await request(app)
            .delete(`/api/users?time_in_seconds=${timeInSeconds}`);

        expect(res.status).to.be.equals(200);
        expect(res.body.status).to.be.equals('success');
        expect(res.body.inactive_users).to.be.an('array');
    });

})