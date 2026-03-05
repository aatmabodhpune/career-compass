import type { HttpFunction } from '@google-cloud/functions-framework';

export const alignCareers: HttpFunction = (req, res) => {
    res.status(200).send({
        message: 'Career alignment scoring engine placeholder',
    });
};
