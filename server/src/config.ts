export const environment = {
    marketingPortal: process.env.MARKETING_URL || 'http://localhost:8080',
    managementPortal: process.env.ADMIN_URL || 'http://localhost:8181',
    contactEmail: 'contact@venzra.com',
    replyEmail: `Venzra <${process.env.REPLY_TO || 'noreply@venzra-test.com'}>`
};
