const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const moment = require('moment');
const belvo = require('belvo').default;

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Fill in your Belvo API keys - https://dashboard.belvo.com
BELVO_SECRET_ID = process.env.BELVO_SECRET_ID
BELVO_SECRET_PASSWORD = process.env.BELVO_SECRET_PASSWORD
// Use `sandbox` to test with Belvo's Sandbox environment
// Use `production` to go live
// Use `development` to test with real data
BELVO_ENV = process.env.BELVO_ENV || 'sandbox'

//Customization widget
COMPANY_ICON_URL = process.env.COMPANY_ICON_URL
COMPANY_LOGO_URL = process.env.COMPANY_LOGO_URL
COMPANY_NAME = process.env.COMPANY_NAME
COMPANY_BENEFIT_HEADER = process.env.COMPANY_BENEFIT_HEADER
COMPANY_BENEFIT_CONTENT = process.env.COMPANY_BENEFIT_CONTENT
COMPANY_OPPORTUNITY_LOSS = process.env.COMPANY_OPPORTUNITY_LOSS

if (BELVO_ENV == 'production') {
    BELVO_ENV_URL = 'https://api.belvo.com'
} else if (BELVO_ENV == 'development') {
    BELVO_ENV_URL = 'https://development.belvo.com'
} else {
    BELVO_ENV_URL = 'https://sandbox.belvo.com'
}

const client = new belvo(
    BELVO_SECRET_ID,
    BELVO_SECRET_PASSWORD,
    BELVO_ENV_URL
);

// Request an access token to be used when loading the Widget
// https://developers.belvo.co/docs/connect-widget#section--3-generate-an-access_token-
app.get("/get_token", (req, res, next) => {

    // Widget branding
    // https://developers.belvo.com/docs/widget-branding-and-customization
    const widget = {
        branding: {
            company_icon: COMPANY_ICON_URL,
            company_logo: COMPANY_LOGO_URL,
            company_name: COMPANY_NAME,
            company_benefit_header: COMPANY_BENEFIT_HEADER,
            company_benefit_content: COMPANY_BENEFIT_CONTENT,
            opportunity_loss: COMPANY_OPPORTUNITY_LOSS
        }
    }
    const options = { scopes: 'read_institutions,write_links,read_links', widget: widget };
    client.connect()
        .then(() => {
            client.widgetToken.create(options)
                .then((response) => {
                    res.json(response);
                })
                .catch((error) => {
                    res.status(500).send({
                        message: error.message
                    });
                });
        });
});

app.post("/accounts", (req, res, next) => {
    const { link_id } = req.body;
    client.connect()
        .then(() => {
            client.accounts.retrieve(link_id)
                .then((response) => {
                    res.json(response);
                })
                .catch(function (error) {
                    res.status(500).send({
                        message: error.message
                    });
                });
        });
});

app.post("/transactions", (req, res, next) => {
    const { link_id } = req.body;
    const date_from = moment().subtract(150, "days").format('YYYY-MM-DD');
    const date_to = moment().format('YYYY-MM-DD');

    client.connect()
        .then(function () {
            client.transactions.retrieve(link_id, date_from, { dateTo: date_to })
                .then((response) => {
                    res.json(response);
                })
                .catch((error) => {
                    console.log('error', error)
                    res.status(500).send({
                        message: error.message
                    });
                });
        });
});


app.post("/balances", (req, res, next) => {
    const { link_id } = req.body;
    const date_from = moment().subtract(150, "days").format('YYYY-MM-DD');
    const date_to = moment().format('YYYY-MM-DD');

    client.connect()
        .then(function () {
            client.balances.retrieve(link_id, date_from, { dateTo: date_to })
                .then((response) => {
                    res.json(response);
                })
                .catch((error) => {
                    console.log('error', error)
                    res.status(500).send({
                        message: error.message
                    });
                });
        });
});

app.post("/owners", (req, res, next) => {
    const { link_id } = req.body;

    client.connect()
        .then(function () {
            client.owners.retrieve(link_id)
                .then((response) => {
                    res.json(response);
                })
                .catch((error) => {
                    console.log('error', error)
                    res.status(500).send({
                        message: error.message
                    });
                });
        });
});


app.listen(port, () => console.log(`Server running on port ${port}!`))
