/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

const roles = [
    { name: "CLIENT" },
    { name: "MANAGER" }
]
const users = [
    {
        email: 'ana@store.com',
        username: 'azevallos',
        fullName: 'Ana Zeballos',
        password: 'contrasena123',
        emailVerified: true,
        hashActivation: 'caracteresaleatorios1',
    },
    {
        email: 'rocio@store.com',
        username: 'rduran',
        fullName: 'Rocio Duran',
        password: 'contrasena456',
        emailVerified: true,
        hashActivation: 'caracteresaleatorios2',
    },
    {
        email: 'julio@store.com',
        username: 'jalvarez',
        fullName: 'Julio Alvarez',
        password: 'contrasena123',
        emailVerified: true,
        hashActivation: 'caracteresaleatorios3',
    },
    {
        email: 'laura@store.com',
        username: 'laura',
        fullName: 'Laura Jimenez',
        password: 'contrasena456',
        emailVerified: true,
        hashActivation: 'caracteresaleatorios4',
    },
    {
        email: 'edith@store.com',
        username: 'edith',
        fullName: 'Edith Rivero',
        password: 'contrasena456',
        emailVerified: true,
        hashActivation: 'caracteresaleatorios5',
    },
    {
        email: 'super@store.com',
        username: 'super',
        fullName: 'Super Man',
        password: 'contrasena456',
        emailVerified: true,
        hashActivation: 'caracteresaleatorios6',
    }
];
const userRoles = [
    { userId: 1, roleId: 1 },
    { userId: 2, roleId: 1 },
    { userId: 3, roleId: 1 },
    { userId: 4, roleId: 2 },
    { userId: 5, roleId: 2 },
    { userId: 6, roleId: 1 },
    { userId: 6, roleId: 2 }
]

const categories = [
    { name: 'comedy' },
    { name: 'fiction' },
    { name: 'novel' },
    { name: 'scientific' },
    { name: 'poetry' },
    { name: 'historical' },
    { name: 'fantasy' },
    { name: 'horror' },
]

const books = [
    {
        name: 'Don Quijote de La Mancha I',
        authors: ['Miguel de Cervantes'],
        editorial: 'Anaya',
        price: 125.50,
        stock: 12,
        categoryId: 3
    },
    {
        name: 'Historias de Nueva Orleans',
        authors: ['William Faulkner'],
        editorial: 'Alfaguara',
        price: 35.50,
        stock: 5,
        categoryId: 6
    },
    {
        name: 'El principito',
        authors: ['Antoine Saint-Exupery'],
        editorial: 'Andina',
        price: 14.00,
        stock: 8,
        categoryId: 7
    },
    {
        name: 'El príncipe S.M.',
        authors: ['Antoine Saint-Exupery'],
        editorial: 'Maquiavelo',
        price: 54.00,
        stock: 4,
        categoryId: 3
    },
    {
        name: 'El Último Emperador',
        authors: ['CaraltPu-Yi'],
        editorial: 'AutobiografíasChina',
        price: 127.30,
        stock: 3,
        categoryId: 2
    },
    {
        name: 'Fortunata',
        authors: ['Jacinta Plaza', 'Janés Pérez'],
        editorial: 'Galdos',
        price: 27.20,
        stock: 13,
        categoryId: 3
    },
    {
        name: 'Poema de Gilgamesh',
        authors: ['Anonimo'],
        editorial: 'Suma',
        price: 57.50,
        stock: 6,
        categoryId: 5
    },
    {
        name: 'Las mil y una noches',
        authors: ['Anonimo'],
        editorial: 'Suma',
        price: 73.00,
        stock: 125,
        categoryId: 3
    },
    {
        name: 'Cuentos infantiles',
        authors: ['Hans Christian Andersen'],
        editorial: 'Dinamarca',
        price: 87.70,
        stock: 113,
        categoryId: 7
    },
    {
        name: 'Divina comedia',
        authors: ['Dante Alighieri'],
        editorial: 'Bruno',
        price: 481.50,
        stock: 10,
        categoryId: 5
    },
    {
        name: 'Orgullo y prejuicio',
        authors: ['Jane Austed'],
        editorial: 'Suma',
        price: 33.20,
        stock: 23,
        categoryId: 1
    },
    {
        name: 'Ficciones',
        authors: ['Jorge Luis Borges'],
        editorial: 'Arin',
        price: 93.00,
        stock: 3,
        categoryId: 7
    },
    {
        name: 'El extrajero',
        authors: ['Albert Camus'],
        editorial: 'Editimo',
        price: 19.50,
        stock: 3,
        categoryId: 3
    },
    {
        name: 'Los cuentos de Canterbury',
        authors: ['Geoffrey Chaucer'],
        editorial: 'Libret',
        price: 199.00,
        stock: 4,
        categoryId: 1
    },
    {
        name: 'El futuro de nuestra mente',
        authors: ['Michio Kaku'],
        editorial: 'Debate',
        price: 49.00,
        stock: 6,
        categoryId: 4
    },
    {
        name: 'Breve historia de mi vida',
        authors: ['Stephen Hawking'],
        editorial: 'Crítica',
        price: 67.50,
        stock: 4,
        categoryId: 4
    },
    {
        name: 'Somos nuestro cerebro: cómo pensamos, sufrimos y amamos',
        authors: ['Dick Swaab'],
        editorial: 'Plataforma',
        price: 39.00,
        stock: 30,
        categoryId: 4
    },
    {
        name: 'El bonobo y los diez mandamientos',
        authors: ['Frans de Waal'],
        editorial: 'Tusquts',
        price: 55.30,
        stock: 5,
        categoryId: 4
    },
    {
        name: 'Hex',
        authors: ['Thomas Olde Heuvelt'],
        editorial: 'Espana',
        price: 45.40,
        stock: 5,
        categoryId: 8
    },
    {
        name: 'La chica de al lado',
        authors: ['Jack Ketchum'],
        editorial: 'Vladilla',
        price: 25.00,
        stock: 15,
        categoryId: 8
    },
    {
        name: 'Apartamento 16',
        authors: ['Adam Neville'],
        editorial: 'Bruno',
        price: 33.50,
        stock: 10,
        categoryId: 8
    },
]

const clearDatabase = async function () {
    const tableNames = ['User', 'Role', 'UserRole', 'Category', 'Book', 'Cart']
    try {
        for (const tableName of tableNames) {
            await prisma.$queryRaw(`DELETE FROM "${tableName}";`)
            if (!['Store'].includes(tableName)) {
                await prisma.$queryRaw(
                    `ALTER SEQUENCE "${tableName}_id_seq" RESTART WITH 1;`
                )
            }
        }
    } catch (err) {
        console.error(err)
    } finally {
        await prisma.$disconnect()
    }
}

const prisma = new PrismaClient()

async function main() {
    await clearDatabase()

    for (const role of roles) {
        await prisma.role.create({ data: role });
    }
    for (const user of users) {
        await prisma.user.create({ data: user });
    }
    for (const ur of userRoles) {
        await prisma.userRole.create({ data: ur });
    }
    for (const category of categories) {
        await prisma.category.create({ data: category });
    }
    for (const book of books) {
        await prisma.book.create({ data: book });
    }
}
main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })