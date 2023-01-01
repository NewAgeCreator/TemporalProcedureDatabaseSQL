const Joi = require('joi');

const errMessages = (errors) => {
errors.forEach(err => {
    switch(err.code){
        case "string.empty": 
            err.message = "Pole jest wymagane"; break;
        case "string.min":
            err.message = "Za małe pole"; break;
        case "string.max":
            err.message = "Za duże pole"; break;
        case "string.required":
            err.message = "Pole wymagane"; break;
        case "date.min":
            err.message = "Początek musi być przed końcem"; break;
        default: break;
        }
});
    return errors;
}

const ObiektSchema = Joi.object({
    Id_stanu: Joi.number()
        .optional()
        .allow(""),
    Id_obiektu: Joi.number()
        .optional()
        .allow(""),
    Nazwa: Joi.string()
        .min(2)
        .max(32)
        .required()
        .error(errMessages),
    Typ_wydarzenia: Joi.string()
        .min(2)
        .max(32)
        .required()
        .error(errMessages),
    Warstwa_id: Joi.number()
        .required()
        .error(errMessages),
    VTS: Joi.date()
        .required()
        .error(errMessages),
    VTE: Joi.date()
        .min(Joi.ref('VTS'))
        .required()
        .error(errMessages),
        GEO: Joi.string()
            .required()
})

module.exports = ObiektSchema;