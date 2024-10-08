import app from '../app.js'
import request from 'supertest'
import { expect } from 'chai'
import { usersService } from '../repositories/index.js';

const testUser = { first_name: 'Juan', last_name: 'Perez', email: 'jperez@gmail.com', age: 18, password: 'abc445' };
let cookie;
describe("Tests Sessions", () => {

    after(async () => {
        //logout the user and delete de user from de database
        await request(app).get("/logout");
        await usersService.deleteUser({email: testUser.email});
    })

    it("POST /api/sessions/register deberia registrar un usuario y redirigir a /login",async () => {
        const res = await request(app).post("/api/sessions/register").send(testUser)
        expect(res.status).to.be.equals(302);
        expect(res.header.location).to.be.equals('/login');
        const users = await usersService.getAllUsers();
        expect(users).to.be.an('array');
    })

    it("POST /api/sessions/login deberia loguear un usuario y redirigir a /home",async () => {
        const result = await request(app).post("/api/sessions/login").send({email: testUser.email, password: testUser.password})
        expect(result.status).to.be.equals(302);
        expect(result.header.location).to.be.equals('/home');
        const cookieData = result.headers['set-cookie'][0];
        cookie = { name: cookieData.split('=')[0], value: cookieData.split('=')[1] };
        expect(cookieData).to.be.ok;
        expect(cookie.name).to.be.equals('auth');
        expect(cookie.value).to.be.ok;
    })

    it("GET /api/sessions/current deberia devolver el usuario logueado y renderizar correctamente",async () => {
        const res = await request(app).get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(res).to.be.ok;
        expect(res.status).to.be.equals(200);
        expect(res.text).to.include("jperez@gmail.com");
    })
})


// describe('Pruebas de redireccionamiento y renderizado', () => { 
//     it('Debería redirigir correctamente', async () => { 
//         const res = await request(app).get('/ruta-que-redirige'); 
//         // Verifica que se haya redirigido 
//         expect(res.status).to.equal(302);
//         // Verifica el destino de la redirección 
//         expect(res.header.location).to.equal('/ruta-de-destino'); 

//     });

//     it('Debería renderizar correctamente', async () => { 
//         const res = await request(app).get('/ruta-que-renderiza'); 
//         // Verifica que se haya render 
//         expect(res.status).to.equal(200); 
//         // Verifica contenido HTML (o lo que se renderice) 
//         expect(res.text).to.include('<html>'); 
//     });

// })