import chai from 'chai'
import supertest from 'supertest'
import { faker } from '@faker-js/faker'

const expect = chai.expect
const requester = supertest('http://localhost:8080') // simula cliente 

describe('Testing E-commerce', () => {
    describe('Test de GET todos los productos', () => {
        it('El endpoint GET /api/products debe registar un nuevo producto', async () =>{
            const response = await requester.get("/api/products")
            expect (response.status).to.be.equal(200);
            })
        })

    describe('Test de POST que se encarga de crear un Carrito', () => {
        it('El endpoint POST /api/carts debe crear un carrito cuando se registra un usuario', async () => {
            const result =  await requester.post("/api/carts")
            expect (result.status).to.be.eql(201)
        })
    })

    describe('Test registro de session', () => {
        let cookie
        const testUser = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: faker.number.int({ min: 18, max: 70 }),
            password: "secret",
        }
        it('El endpoint /api/session/register debe registar un nuevo user', async () => {
            const response = await requester.post("/api/session/register").send(testUser)
            //console.log(response)
            expect(response.status).to.be.eql(302);
        })
        it('Debe loggear un user y debe devolver una cookie', async () => {
            const result = await requester.post('/api/session/login').send({
                email: testUser.email,
                password: testUser.password
            })
            const cookieResult =  result.headers['set-cookie'][0]    //el coolkieResult se ve asi cookie_name=cookie_value
            expect(cookieResult).to.be.ok
            //console.log(cookieResult)
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            }
            //console.log(cookie)
            expect(cookie.name).to.be.ok.and.eql('connect.sid')
            expect(cookie.value).to.be.ok
        })
    })

     })


