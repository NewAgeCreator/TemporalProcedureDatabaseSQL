DROP TABLE IF EXISTS Warstwa_w_temacie, Temat, Obiekt_opisowy, Opis, Obiekt, Warstwa;

CREATE TABLE IF NOT EXISTS `Temat` (
	`Id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    	`Nazwa` VARCHAR(32) NOT NULL,
    	`Opis` VARCHAR(255) NOT NULL,
    	`Data_utworzenia` DATE NOT NULL,
    	`Imie_autora` VARCHAR(32),
    	`Nazwisko_autora` VARCHAR(32),
    	PRIMARY KEY(`Id`)
)ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;


CREATE TABLE IF NOT EXISTS `Warstwa`(
	`Id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    	`Nazwa` VARCHAR(32) NOT NULL,
    	`Opis` VARCHAR(255) NOT NULL,
    	`Data_utworzenia` DATE NOT NULL,
    	`Imie_autora` VARCHAR(32),
    	`Nazwisko_autora` VARCHAR(32),
    	PRIMARY KEY(`Id`)
)ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;


CREATE TABLE IF NOT EXISTS `Warstwa_w_temacie`(
	`Id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    	`Warstwa_id` INT UNSIGNED NOT NULL,
    	`Temat_id` INT UNSIGNED NOT NULL,
    	PRIMARY KEY(`Id`),
    CONSTRAINT `Warstwa_fk` FOREIGN KEY(`Warstwa_id`) REFERENCES `Warstwa`(`Id`),
    CONSTRAINT `Temat_fk` FOREIGN KEY(`Temat_id`) REFERENCES `Temat`(`Id`)
)ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;


CREATE TABLE IF NOT EXISTS `Obiekt`(
	    `Id_stanu` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    	`Id_obiektu` INT UNSIGNED NOT NULL,
    	`Warstwa_id` INT UNSIGNED NOT NULL,
    	`Nazwa` VARCHAR(32),
    	`Rodzaj_stanu` VARCHAR(1),
    	`Typ_wydarzenia`VARCHAR(128),
   		`Id_stan_poprzedni` INT UNSIGNED,
    	`GEO` JSON,
    	`VTs` Date,
    	`VTe` Date,
    	`TTs` DATETIME,
    	`TTe` DATETIME,
    	PRIMARY KEY(`Id_stanu`),
    	CONSTRAINT `Warstwa_fk2` FOREIGN KEY(`Warstwa_id`) REFERENCES `Warstwa`(`Id`),
    	CONSTRAINT `Obiekt_fk` FOREIGN KEY(`Id_stan_poprzedni`) REFERENCES `Obiekt`(`Id_stanu`)
)ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;

CREATE TABLE IF NOT EXISTS `Opis`(
	`Id_stanu` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `Id_opisu` INT UNSIGNED NOT NULL,
    `Nazwa_skrocona` VARCHAR(32),
    `Opis` VARCHAR(1024),
    `Imie_autora` VARCHAR(32),
    `Nazwisko_autora` VARCHAR(32),
    `Rodzaj_stanu` VARCHAR(1),
    `Id_stan_poprzedni` INT UNSIGNED,
    	`VTs` Date,
    	`VTe` Date,
    	`TTs` DATETIME,
    	`TTe` DATETIME,
    PRIMARY KEY(`Id_stanu`),
CONSTRAINT `Opis_FK` FOREIGN KEY (`Id_stan_poprzedni`) REFERENCES `Opis`(`Id_stanu`)
)ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;

CREATE TABLE IF NOT EXISTS `Obiekt_opisowy`(
	`Id_stanu` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `Id_stan_obiektu` INT UNSIGNED NOT NULL,
    `Id_stan_opisu` INT UNSIGNED NOT NULL,
    `Rodzaj_stanu` VARCHAR(1) NOT NULL,
    	`VTs` DATE,
    	`VTe` DATE,
    	`TTs` DATETIME,
    	`TTe` DATETIME,
    
    PRIMARY KEY(`Id_stanu`),
    CONSTRAINT `OpisK_FK1` FOREIGN KEY (`Id_stan_obiektu`) REFERENCES `Obiekt`(`Id_stanu`),
    CONSTRAINT `OpisK_FK2` FOREIGN KEY (`Id_stan_opisu`) REFERENCES `Opis`(`Id_stanu`)

)ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;;



