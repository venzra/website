import { SES } from 'aws-sdk';
import * as moment from 'moment';

import * as config from '../config';
import { IAccountModel } from '../models/account';

interface IActivationData {
    subject: string;
    marketingUrl: string;
    managementUrl: string;
    account: IAccountModel;
}

interface IContactData {
    subject: string;
    alias: string;
    emailAddress: string;
    message: string;
}

export const mailer = {
    send: (subject: string, destination: string, message: string, origin = config.environment.replyEmail): Promise<SES.SendEmailResponse> => {
        const ses = new SES({ region: 'eu-west-1' });

        const request: SES.SendEmailRequest = {
            Source: origin,
            Destination: {
                ToAddresses: [destination]
            },
            Message: {
                Subject: {
                    Data: subject
                },
                Body: {
                    Html: {
                        Data: message
                    }
                }
            }
        };

        return ses.sendEmail(request).promise();
    }
};

export const email = {
    header: (data): string => `
        <!DOCTYPE html>
        <html>
            <head>
                <title>${data.subject}</title>

                <style type="text/css">
                    * { font-family:Roboto, "Helvetica Neue"; }
                    html { background-color:#eee; }
                    table { background-color:#fafafa; border-collapse:collapse; border-width:1px 1px 2px 1px; border-color:#ccc; border-style:solid; margin:2em auto; width:600px; }
                    td, tr { margin:0; }
                    td { padding:1em; }
                    p { padding:0; margin:0; font-size:14px; }
                    a { color: #673ab7; }
                    a.btn { color:#fff; display:inline-block; border:0px; border-radius:2px; height:36px; padding:0 26px; margin:6px 0; font-size:14px; font-weight:500; line-height:36px; text-transform:uppercase; text-decoration:none; background-color:#673ab7; box-shadow:0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12); }
                    a.btn:hover { background-color:#8565c3; box-shadow:none; }
                    .centered { text-align:center; }
                    .caption { font-size:10px; }
                </style>
            </head>
            <body>
                <table>
                    <tr style="background-color:#673ab7;">
                        <td class="centered" style="padding:3em;">
                            <img src="https://www.venzra.com/assets/logo/white/venzra-logo-md.png" alt="Venzra" title="Venzra" />
                        </td>
                    </tr>
    `,

    activation: (data: IActivationData): string => {
        const validationUrl = `${data.managementUrl}/auth/activate/${data.account._id}?token=${data.account.validation.key}`;

        const template = `
                    <tr>
                        <td>
                            <h2>Welcome to Venzra,</h2>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>Thank you for registering, to conclude your registration please follow the activation link in this email. If you have previously registered you will be able to use this link to also recover your account details.</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>Please notice that this activation link will only be <strong>valid until ${moment(data.account.validation.expires).format('Do MMM YYYY [at] HH:mm')}</strong>. After this time you would be required to <a href="${data.marketingUrl}">register</a> again to receive an updated activation link.</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="centered">
                            <a class="btn" href="${validationUrl}">Activate account</a>
                        </td>
                    </tr>
                    <tr>
                        <td class="centered">
                            <a href="${validationUrl}">${validationUrl}</a>
                        </td>
                    </tr>
        `;

        return email.header(data) + template + email.footer(data);
    },

    contact: (data: IContactData): string => {
        const template = `
                    <tr>
                        <td>
                            <h2>${data.subject}</h2>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>Alias: ${data.alias}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>Email: ${data.emailAddress}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>Message:</p>
                            <pre>${data.message}</pre>
                        </td>
                    </tr>
        `;

        return email.header(data) + template + email.footer(data);
    },

    footer: (data): string => `
                    <tr>
                        <td>
                            <p style="font-weight:500">Kind regards,</p>
                            <p style="font-weight:500">The Venzra support team</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p class="caption">If you did not request this email, please discard.</p>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `
};
