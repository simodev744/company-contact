const { body, validationResult } = require('express-validator');

module.exports = (prisma, upload) => {
    const router = require('express').Router();


// Route to display the company list with pagination and search
   router.get('/admin/company', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Number of items per page
    const skip = (page - 1) * limit;

    const searchParams = {
        category: req.query.category || '',
        capital: req.query.capital || '',
        city: req.query.city || '',
        country: req.query.country || '',
        numberSalarie: req.query.numberSalarie || '',
        activity: req.query.activity || '',
    };

    const query = {
        where: {
            AND: [
                searchParams.category ? { category: { contains: searchParams.category } } : {},
                searchParams.capital ? { capital: { equals: parseFloat(searchParams.capital) } } : {},
                searchParams.city ? { city: { contains: searchParams.city } } : {},
                searchParams.country ? { country: { contains: searchParams.country } } : {},
                searchParams.numberSalarie ? { numberSalarie: { equals: parseInt(searchParams.numberSalarie) } } : {},
                searchParams.activity ? { activity: { contains: searchParams.activity } } : {}
            ]
        },
        skip,
        take: limit,
    };

    try {
        const [companies, total] = await prisma.$transaction([
            prisma.company.findMany(query),
            prisma.company.count({ where: query.where })
                 ]);


        const totalPages = Math.ceil(total / limit);

        const companyfields= await prisma.company.findMany({select:{category:true,city:true,country:true,activity:true}});
        console.log(companyfields);

        res.render('company', {
            companies,
            currentPage: page,
            totalPages,
            searchParams,
            queryString: new URLSearchParams(req.query).toString(),
            companyfields
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to display the company list with pagination and search
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Number of items per page
    const skip = (page - 1) * limit;

    const searchParams = {
        category: req.query.category || '',
        capital: req.query.capital || '',
        city: req.query.city || '',
        country: req.query.country || '',
        numberSalarie: req.query.numberSalarie || '',
        activity: req.query.activity || '',
    };

    const query = {
        where: {
            AND: [
                searchParams.category ? { category: { contains: searchParams.category } } : {},
                searchParams.capital ? { capital: { equals: parseFloat(searchParams.capital) } } : {},
                searchParams.city ? { city: { contains: searchParams.city } } : {},
                searchParams.country ? { country: { contains: searchParams.country } } : {},
                searchParams.numberSalarie ? { numberSalarie: { equals: parseInt(searchParams.numberSalarie) } } : {},
                searchParams.activity ? { activity: { contains: searchParams.activity } } : {}
            ]
        },
        skip,
        take: limit,
    };

    try {
        const [companies, total] = await prisma.$transaction([
            prisma.company.findMany(query),
            prisma.company.count({ where: query.where })
                 ]);


        const totalPages = Math.ceil(total / limit);

        const companyfields= await prisma.company.findMany({select:{category:true,city:true,country:true,activity:true}});
        console.log(companyfields);

        res.render('index', {
            companies,
            currentPage: page,
            totalPages,
            searchParams,
            queryString: new URLSearchParams(req.query).toString(),
            companyfields
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


    router.get('/create', (req, res) => {
        res.render('create');
    });

    router.post('/create', upload.single('logo'), [
        body('companyName').notEmpty().withMessage('Company name is required'),
        // Add other validations as needed
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('create', { errors: errors.array() });
        }

        const { companyName, activity, status, category, address, city, country, tel1, tel2, email, capital, dateCreation, numberSalarie } = req.body;
        const logo = req.file ? req.file.filename : null;

        await prisma.company.create({
            data: { companyName, activity, status, category, address, city, country, tel1, tel2, email, capital: parseFloat(capital), dateCreation: new Date(dateCreation), numberSalarie: parseInt(numberSalarie), logo }
        });

        res.redirect('/');
    });

    router.get('/edit/:id', async (req, res) => {
        const company = await prisma.company.findUnique({ where: { id: parseInt(req.params.id) } });
        res.render('edit', { company });
    });

    router.post('/edit/:id', upload.single('logo'), async (req, res) => {
        const { companyName, activity, status, category, address, city, country, tel1, tel2, email, capital, dateCreation, numberSalarie } = req.body;
        
        const logo = req.file ? req.file.filename : undefined;

        await prisma.company.update({
            where: { id: parseInt(req.params.id) },
            data: { companyName, activity, status, category, address, city, country, tel1, tel2, email, capital: parseFloat(capital), dateCreation: new Date(dateCreation), numberSalarie: parseInt(numberSalarie), logo }
        });

        res.redirect('/');
    });

    router.get('/delete/:id', async (req, res) => {
        await prisma.company.delete({ where: { id: parseInt(req.params.id) } });
        res.redirect('/');
    });

    router.get('/show/:id', async (req, res) => {
        const company = await prisma.company.findUnique({ where: { id: parseInt(req.params.id) } });
        res.render('show', { company });
    });

    return router;
};
