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
        case "date.greater":
            err.message = "Początek musi być przed końcem"; break;
        default: break;
        }
});
    return errors;
}

const OpisSchema = Joi.object({
    Id_stanu: Joi.number()
        .optional()
        .allow(""),
    Nazwa_skrocona: Joi.string()
        .min(2)
        .max(32)
        .required()
        .error(errMessages),
    Opis: Joi.string()
        .min(2)
        .max(1024)
        .required()
        .error(errMessages),
    Imie_autora: Joi.string()
        .min(2)
        .max(32)
        .required()
        .error(errMessages),
    Nazwisko_autora: Joi.string()
        .min(2)
        .max(32)
        .required()
        .error(errMessages),
    Id_opisu: Joi.number()
        .optional()
        .allow("")
    
})

module.exports = OpisSchema;