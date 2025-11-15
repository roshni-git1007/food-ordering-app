(() => {
    const originalFetch = window.fetch ? window.fetch.bind(window) : null;


    // Helper: read JSON body from fetch init
    function readBody(init = {}) {
        try {
            if (!init.body) return {};
            if (typeof init.body === 'string') return JSON.parse(init.body);
            return {};
        } catch (e) {
            return {};
        }
    }

    function getDB() {
        const db = JSON.parse(localStorage.getItem('db') || '{}');
        db.users ||= [];
        return db;
    }


    function saveDB(db) {
        localStorage.setItem('db', JSON.stringify(db));
    }


    async function handleApi(url, init = {}) {
        const { method = 'GET' } = init;
        const db = getDB();


        if (url === '/api/signup' && method.toUpperCase() === 'POST') {
            const { email, password } = readBody(init);
            if (!email || !password) {
                return new Response(JSON.stringify({ message: 'Email and password are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            }
            const exists = db.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
            if (exists) {
                return new Response(JSON.stringify({ message: 'That email is already registered.' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
            }
            db.users.push({ email, password, createdAt: new Date().toISOString() });
            saveDB(db);
            return new Response(JSON.stringify({ message: 'Account created.' }), { status: 201, headers: { 'Content-Type': 'application/json' } });
        }


        if (url === '/api/login' && method.toUpperCase() === 'POST') {
            const { email, password } = readBody(init);
            const user = db.users.find(u => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password);
            if (!user) {
                return new Response(JSON.stringify({ message: 'Invalid email or password.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
            }
            localStorage.setItem('currentUser', JSON.stringify({ email: user.email, loggedInAt: Date.now() }));
            return new Response(JSON.stringify({ message: 'Logged in.', user: { email: user.email } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }


        // Unknown API endpoint
        return new Response(JSON.stringify({ message: 'Unknown endpoint.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }


    // Patch fetch
    window.fetch = async function (input, init = {}) {
        const url = typeof input === 'string' ? input : (input?.url || '');
        if (typeof url === 'string' && url.startsWith('/api/')) {
            return handleApi(url, init);
        }
        // Pass through to real fetch for non-API calls
        if (originalFetch) return originalFetch(input, init);
        // Fallback: return 404 if no network available (e.g., file://)
        return new Response('Not Found', { status: 404 });
    };
})();