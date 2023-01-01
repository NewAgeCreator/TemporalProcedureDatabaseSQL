
DELIMITER $$
CREATE OR REPLACE PROCEDURE opis_call(
    IN INPUT_ID_OPISU INT,
    IN INPUT_ID_OBIEKTU INT,
    IN INPUT_NAZWA_SKROCONA VARCHAR(32),
    IN INPUT_OPIS VARCHAR(1024),
    IN INPUT_IMIE_AUTORA VARCHAR(32),
    IN INPUT_NAZWISKO_AUTORA VARCHAR(32),
    IN OPERACJA VARCHAR(32)
) BEGIN 

    IF OPERACJA = 'DODAJ' THEN
        BEGIN
               	CALL operacja_dodaj_opis(INPUT_NAZWA_SKROCONA, INPUT_OPIS,
                                         INPUT_IMIE_AUTORA, INPUT_NAZWISKO_AUTORA);
        END;
    	END IF;
    
    IF OPERACJA = 'EDYTUJ' THEN 
        BEGIN
			IF(SELECT COUNT(*) FROM Opis WHERE Id_opisu = INPUT_ID_OPISU) = 0 THEN
            	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'BRAK OPISU O PODANYM ID'; END IF;
                
                CALL operacja_edytuj_opis(INPUT_ID_OPISU, INPUT_NAZWA_SKROCONA, INPUT_OPIS,
                                          INPUT_IMIE_AUTORA, INPUT_NAZWISKO_AUTORA);
        END;
    	END IF;
        
     IF OPERACJA = 'PRZYPISZ' THEN
    	BEGIN
        	IF(SELECT COUNT(*) FROM Opis WHERE Id_opisu = INPUT_ID_OPISU) = 0 THEN
            	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'BRAK OPISU O PODANYM ID'; END IF;
            IF(SELECT COUNT(*) FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU) = 0 THEN
            	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'BRAK OBIEKTU O PODANYM ID'; END IF;
                
            CALL operacja_przypisz_opis(INPUT_ID_OPISU, INPUT_ID_OBIEKTU);
        END;
        END IF;
        
     IF OPERACJA = 'ODEPNIJ' THEN
    	BEGIN
        	IF(SELECT COUNT(*) FROM Opis WHERE Id_opisu = INPUT_ID_OPISU) = 0 THEN
            	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'BRAK OPISU O PODANYM ID'; END IF;
            IF(SELECT COUNT(*) FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU) = 0 THEN
            	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'BRAK OBIEKTU O PODANYM ID'; END IF;
                
            CALL operacja_odepnij_opis(INPUT_ID_OPISU, INPUT_ID_OBIEKTU);
        END;
        END IF;
        
        
    IF OPERACJA = 'ZAKONCZ' THEN
    	BEGIN
        	IF(SELECT COUNT(*) FROM Opis WHERE Id_opisu = INPUT_ID_OPISU  and Rodzaj_stanu = 'A') = 0 THEN
            	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'BRAK OPISU O PODANYM ID'; END IF;
                
            CALL operacja_zakoncz_opis(INPUT_ID_OPISU);
        END;
        END IF;
        
   IF OPERACJA = 'WZNOW' THEN
   		BEGIN
            IF(SELECT COUNT(*) FROM Opis WHERE Id_opisu = INPUT_ID_OPISU  and Rodzaj_stanu = 'H' ) = 0 THEN
                    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'BRAK OPISU O PODANYM ID '; END IF;
          		
          CALL operacja_wznow_opis(INPUT_ID_OPISU);
              
        END;
        END IF;
    
  IF OPERACJA != 'DODAJ' AND OPERACJA != 'EDYTUJ' AND OPERACJA !='PRZYPISZ' AND
  OPERACJA !='ODEPNIJ' AND OPERACJA != 'ZAKONCZ' AND OPERACJA != 'WZNOW' THEN
  
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'NIE POPRAWNY ARGUMENT OPERACJA'; END IF;
	
END $$

#OPERACJA DODAJ 

DELIMITER $$
CREATE OR REPLACE PROCEDURE operacja_dodaj_opis(
        IN INPUT_NAZWA_SKROCONA VARCHAR(32),
        IN INPUT_OPIS VARCHAR(1024),
        IN INPUT_IMIE_AUTORA VARCHAR(32),
        IN INPUT_NAZWISKO_AUTORA VARCHAR(32)
    ) BEGIN
    
	SET @ID_OPISU = (SELECT MAX(Id_opisu) FROM  Opis);
	IF @ID_OPISU IS NOT NULL THEN BEGIN 
		SET @ID_OPISU = @ID_OPISU + 1;
	END; ELSE BEGIN 
			SET @ID_OPISU =  1;
	END; END IF;
	
    INSERT INTO `Opis`( `Id_opisu`,`Nazwa_skrocona`, `Opis`,
                                       `Imie_autora`, `Nazwisko_autora`, `Rodzaj_stanu`,
                                       `Id_stan_poprzedni`, `VTs`, `VTe`, `TTs`, `TTe`) 
                                       VALUES (@ID_OPISU, INPUT_NAZWA_SKROCONA, INPUT_OPIS,
                                               INPUT_IMIE_AUTORA, INPUT_NAZWISKO_AUTORA, 'A', NULL,
                                               NOW(), '9999-12-31', NOW(), '9999-12-31 23:59:59');
                                                                                    
    END $$
    
#EDYTUJ 

DELIMITER $$
CREATE OR REPLACE PROCEDURE operacja_edytuj_opis(
        IN INPUT_ID_OPISU INT,
        IN INPUT_NAZWA_SKROCONA VARCHAR(32),
        IN INPUT_OPIS VARCHAR(1024),
        IN INPUT_IMIE_AUTORA VARCHAR(32),
        IN INPUT_NAZWISKO_AUTORA VARCHAR(32)
    )
    BEGIN
  	
    UPDATE `Opis` SET TTe = NOW()
    WHERE Id_opisu = INPUT_ID_OPISU AND 
    	Id_stanu = (SELECT MAX(Id_stanu) FROM `Opis` WHERE Id_opisu = INPUT_ID_OPISU);
        
	SELECT Id_stanu, Vts, VTe, Rodzaj_stanu INTO @Id_stan_poprzedni, @VTS, @VTE, @Rodzaj_stanu FROM `Opis` WHERE Id_opisu = INPUT_ID_OPISU AND 
    	Id_stanu = (SELECT MAX(Id_stanu) FROM `Opis` WHERE Id_opisu = INPUT_ID_OPISU);
    
    INSERT INTO `Opis`(`Id_opisu`, `Nazwa_skrocona`, `Opis`,
                                       `Imie_autora`, `Nazwisko_autora`, `Rodzaj_stanu`,
                                       `Id_stan_poprzedni`, `VTs`, `VTe`, `TTs`, `TTe`) 
                                       VALUES (INPUT_ID_OPISU, INPUT_NAZWA_SKROCONA, INPUT_OPIS,
                                               INPUT_IMIE_AUTORA, INPUT_NAZWISKO_AUTORA, @Rodzaj_stanu, @Id_stan_poprzedni,
                                               @VTS, @VTE, NOW(), '9999-12-31 23:59:59');
                    
     
      CALL zaktualizuj_relacje_opisu(INPUT_ID_OPISU);
      


    END $$
    


	
	
	#PRZYPISZ 
DELIMITER $$
CREATE OR REPLACE PROCEDURE operacja_przypisz_opis(
    IN INPUT_ID_OPISU INT,
    IN INPUT_ID_OBIEKTU INT)
BEGIN 
    IF (SELECT COUNT(*) FROM `Obiekt_opisowy`
       WHERE Id_stan_opisu IN (SELECT Id_stanu FROM `Opis` WHERE Id_opisu = INPUT_ID_OPISU) 
       AND 	 Id_stan_obiektu IN (SELECT Id_stanu FROM `Obiekt` WHERE Id_obiektu = INPUT_ID_OBIEKTU) 
       AND   Rodzaj_stanu = 'A') > 0 THEN
       BEGIN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'OPIS JUŻ WCZEŚNIEJ ZOSTAŁ PRZYPISANY DO OBIEKTU'; END; END IF;
   
   
   	SELECT MAX(Id_stanu) INTO @Id_stan_opisu FROM `Opis` WHERE Id_opisu = INPUT_ID_OPISU;
	SELECT MAX(Id_stanu) INTO @Id_stan_obiektu FROM `Obiekt` WHERE Id_obiektu = INPUT_ID_OBIEKTU;
    
	INSERT INTO `Obiekt_opisowy`(`Id_stan_obiektu`, `Id_stan_opisu`, `Rodzaj_stanu`,
                                                     `VTs`, `VTe`, `TTs`, `TTe`) 
                                                        VALUES (@Id_stan_obiektu, @Id_stan_opisu, 'A',
                                                        NOW(), '9999-12-31' , NOW(), '9999-12-31 23:59:59');

                             
END $$


#ODEPNIJ 
DELIMITER $$
CREATE OR REPLACE PROCEDURE operacja_odepnij_opis(
    IN INPUT_ID_OPISU INT,
    IN INPUT_ID_OBIEKTU INT
    )
BEGIN 
    IF (SELECT COUNT(*) FROM `Obiekt_opisowy`
       WHERE Id_stan_opisu IN (SELECT Id_stanu FROM `Opis` WHERE Id_opisu = INPUT_ID_OPISU) 
       AND 	 Id_stan_obiektu IN (SELECT Id_stanu FROM `Obiekt` WHERE Id_obiektu = INPUT_ID_OBIEKTU) ) = 0 THEN
       BEGIN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'OPIS NIE JEST PRZYPISANY DO OBIEKTU'; END; END IF;

		UPDATE `Obiekt_opisowy` 
        SET Rodzaj_stanu = 'H', VTe = NOW(), TTe = NOW()
        WHERE Id_stan_opisu IN (SELECT MAX(Id_stanu) FROM `Opis` WHERE Id_opisu = INPUT_ID_OPISU) 
       	AND	  Id_stan_obiektu IN (SELECT MAX(Id_stanu) FROM `Obiekt` WHERE Id_obiektu = INPUT_ID_OBIEKTU) ;

     
END $$



#ZAKONCZ

DELIMITER $$
CREATE OR REPLACE PROCEDURE operacja_zakoncz_opis(IN INPUT_ID_OPISU INT)
BEGIN

	SELECT Max(Id_stanu), Nazwa_skrocona, Opis, Imie_autora, Nazwisko_autora, VTs, VTe
  	INTO @id_stanu, @nazwa_skrocona, @opis, @imie_autora, @nazwisko_autora, @vts, @vte
  	FROM Opis
  	WHERE Id_opisu = INPUT_ID_OPISU and Id_stanu = (SELECT MAX(Id_stanu) FROM Opis WHERE Id_opisu = INPUT_ID_OPISU);

	UPDATE `Opis` SET TTe = NOW() WHERE Id_opisu = INPUT_ID_OPISU and 
    	Id_stanu = (SELECT MAX(Id_stanu) FROM `Opis` WHERE Id_opisu = INPUT_ID_OPISU);
    

    INSERT INTO `Opis`(`Id_opisu`, `Nazwa_skrocona`, `Opis`,
                                       `Imie_autora`, `Nazwisko_autora`, `Rodzaj_stanu`,
                                       `Id_stan_poprzedni`, `VTs`, `VTe`, `TTs`, `TTe`) 
                                       VALUES (INPUT_ID_OPISU, @nazwa_skrocona, @opis,
                                                @imie_autora,  @nazwisko_autora, 'H', @Id_stanu,
                                               @VTS, NOW(), NOW(), '9999-12-31 23:59:59');
    
	
    call zaktualizuj_relacje_opisu(INPUT_ID_OPISU);
   	
    
    
    
    
END $$


#WZNOW


DELIMITER $$
CREATE OR REPLACE PROCEDURE operacja_wznow_opis(IN INPUT_ID_OPISU INT)
BEGIN

  SELECT Max(Id_stanu), Nazwa_skrocona, Opis, Imie_autora, Nazwisko_autora, VTs, VTe
  INTO @id_stanu, @nazwa_skrocona, @opis, @imie_autora, @nazwisko_autora, @vts, @vte
  FROM Opis
  WHERE Id_opisu = INPUT_ID_OPISU and Id_stanu = (SELECT MAX(Id_stanu) FROM Opis WHERE Id_opisu = INPUT_ID_OPISU);

UPDATE `Opis` SET TTe = NOW() WHERE Id_opisu = INPUT_ID_OPISU and 
    	Id_stanu = (SELECT MAX(Id_stanu) FROM `Opis` WHERE Id_opisu = INPUT_ID_OPISU);

  INSERT INTO `Opis`(`Id_opisu`, `Nazwa_skrocona`, `Opis`,
                                       `Imie_autora`, `Nazwisko_autora`, `Rodzaj_stanu`,
                                       `Id_stan_poprzedni`, `VTs`, `VTe`, `TTs`, `TTe`) 
                                       VALUES (INPUT_ID_OPISU, @nazwa_skrocona, @opis,
                                               @imie_autora,  @nazwisko_autora, 'A', @id_stanu,
                                               @vts, '9999-12-31', NOW(), '9999-12-31 23:59:59');
                                             
                                             
CALL zaktualizuj_relacje_opisu(INPUT_ID_OPISU);
   	
END $$


DELIMITER $$
CREATE OR REPLACE PROCEDURE zaktualizuj_relacje_opisu(IN INPUT_ID_OPISU INT)
BEGIN 
 IF(SELECT COUNT(*) FROM Obiekt_opisowy WHERE Id_stan_opisu IN
             (SELECT Id_stanu FROM Opis WHERE Id_opisu = INPUT_ID_OPISU)) > 0 THEN
          BEGIN
 			SELECT MAX(Id_stanu) INTO @Id_stan_opisu FROM `Opis` WHERE Id_opisu = INPUT_ID_OPISU;
           
			
           CREATE TEMPORARY TABLE `ob_temp` 
           SELECT * FROM `Obiekt_opisowy` 
           WHERE Id_stan_opisu IN (SELECT Id_stanu FROM `Opis` WHERE Id_opisu = INPUT_ID_OPISU) and Rodzaj_stanu = 'A';
           
           UPDATE `Obiekt_opisowy` SET TTe = NOW(), Rodzaj_stanu = 'H'  
           WHERE Id_stan_opisu IN (SELECT Id_stanu FROM `Opis` WHERE Id_opisu = INPUT_ID_OPISU) and Rodzaj_stanu = 'A';
           
           UPDATE `ob_temp` SET Id_stan_opisu =  @Id_stan_opisu ,  TTs = NOW(), TTe = '9999-12-31 23:59:59';

          INSERT INTO Obiekt_opisowy(Id_stan_opisu, Id_stan_obiektu, Rodzaj_stanu, VTs, VTe, TTs, TTe) 
                             SELECT Id_stan_opisu, Id_stan_obiektu, Rodzaj_stanu, VTs, VTe, TTs, TTe FROM `ob_temp`;
          
    END; END IF;

END $$ 
