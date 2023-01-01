 
DELIMITER $$
CREATE OR REPLACE PROCEDURE call_obiekt(
    IN INPUT_ID_OBIEKTU INT,
    IN INPUT_WARSTWA_ID INT,
	IN INPUT_NAZWA VARCHAR(32),
    IN INPUT_GEO JSON,
    IN INPUT_TYP_WYDARZENIA VARCHAR(128),
    IN INPUT_VTS DATE, IN INPUT_VTE DATE,
	IN OPERACJA VARCHAR(64) )
BEGIN

 
 IF OPERACJA = 'DODAJ' THEN
        BEGIN
	
				
        CALL operacja_dodaj_obiekt(INPUT_WARSTWA_ID, INPUT_NAZWA, INPUT_GEO, INPUT_TYP_WYDARZENIA, INPUT_VTS, INPUT_VTE);
               
        END;
    	END IF;
    
    IF OPERACJA = 'EDYTUJ' THEN 
        BEGIN
			IF(SELECT COUNT(*) FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU) = 0 THEN
            	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'BRAK OBIEKTU O PODANYM ID'; END IF;
        CALL operacja_edytuj_obiekt(INPUT_ID_OBIEKTU, INPUT_WARSTWA_ID, INPUT_NAZWA, INPUT_GEO, INPUT_TYP_WYDARZENIA, INPUT_VTS, INPUT_VTE);     
               
        END;
    	END IF;
        
        
    IF OPERACJA = 'ZAKONCZ' THEN
    	BEGIN
        	IF(SELECT COUNT(*) FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU and Rodzaj_stanu = 'A') = 0 THEN
            	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'BRAK OBIEKTU O PODANYM ID'; END IF;
        
        CALL operacja_zakoncz_obiekt(INPUT_ID_OBIEKTU);
           
        END;
        END IF;
        
   IF OPERACJA = 'WZNOW' THEN
   		BEGIN
            IF(SELECT COUNT(*) FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU and Rodzaj_stanu = 'H') = 0 THEN
                    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'BRAK OBIEKTU O PODANYM ID'; END IF;
          		
       CALL operacja_wznow_obiekt(INPUT_ID_OBIEKTU);   
              
        END;
        END IF;
    
  IF OPERACJA != 'DODAJ' AND OPERACJA != 'EDYTUJ' AND OPERACJA != 'ZAKONCZ' AND OPERACJA != 'WZNOW' THEN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'NIE POPRAWNY ARGUMENT OPERACJA'; END IF;
  
  END$$
  
  
  
  
  DELIMITER $$
CREATE OR REPLACE PROCEDURE operacja_dodaj_obiekt(
    IN INPUT_WARSTWA_ID INT,
	IN INPUT_NAZWA VARCHAR(32),
    IN INPUT_GEO JSON,
    IN INPUT_TYP_WYDARZENIA VARCHAR(128),
    IN INPUT_VTS DATE, IN INPUT_VTE DATE)
BEGIN
	SET @ID_OBIEKTU = (SELECT MAX(Id_Obiektu) FROM Obiekt);
	IF @ID_OBIEKTU IS NOT NULL THEN BEGIN 
		SET @ID_OBIEKTU = @ID_OBIEKTU + 1;
	END; ELSE BEGIN 
			SET @ID_OBIEKTU =  1;
	END; END IF;
	
	INSERT INTO `Obiekt`(`Id_obiektu`, `Warstwa_id`, `Nazwa`, `Typ_wydarzenia`, `Rodzaj_stanu`,`GEO`, `VTs`, `VTe`, `TTs` , `TTe`) 
        VALUES (@ID_OBIEKTU, INPUT_WARSTWA_ID, INPUT_NAZWA , INPUT_TYP_WYDARZENIA, 'A' ,INPUT_GEO , INPUT_VTS, INPUT_VTE, NOW() , '9999-12-31 23:59:59');
END $$

  DELIMITER $$
CREATE OR REPLACE PROCEDURE operacja_edytuj_obiekt(
    IN INPUT_ID_OBIEKTU INT,
    IN INPUT_WARSTWA_ID INT,
	IN INPUT_NAZWA VARCHAR(32),
    IN INPUT_GEO JSON,
    IN INPUT_TYP_WYDARZENIA VARCHAR(128),
    IN INPUT_VTS DATE, IN INPUT_VTE DATE)
    BEGIN
		UPDATE Obiekt SET TTe = NOW()
        WHERE Id_obiektu = INPUT_ID_OBIEKTU AND
        Id_stanu = (SELECT MAX(Id_stanu) FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU);
        
        SELECT Id_stanu, Rodzaj_stanu INTO @Id_stan_poprzedni, @Rodzaj_stanu FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU and 
        Id_stanu = (SELECT MAX(Id_stanu) FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU);
        
        INSERT INTO `Obiekt`( `Id_obiektu`, `Warstwa_id`, `Nazwa`, `Rodzaj_stanu`, `Typ_wydarzenia`, `Id_stan_poprzedni`, `GEO`, `VTs`, `VTe`, `TTs`, `TTe`) 
        VALUES (INPUT_ID_OBIEKTU, INPUT_WARSTWA_ID, INPUT_NAZWA, @Rodzaj_stanu, INPUT_TYP_WYDARZENIA, @Id_stan_poprzedni,  INPUT_GEO, INPUT_VTS, INPUT_VTE, NOW(), '9999-12-31 23:59:59');
        
        call zaktualizuj_relacje_obiektu(INPUT_ID_OBIEKTU);
        
	
END$$

SELECT MAX(Id_stanu), Warstwa_id, Nazwa, Typ_wydarzenia, GEO, VTs, VTe INTO @Id_stan_poprzedni, @Warstwa_id, @Nazwa, @Typ_wydarzenia, @GEO, @VTS, @VTE
    FROM Obiekt WHERE Id_obiektu = 9 and Id_stanu = (SELECT MAX(Id_stanu) FROM Obiekt WHERE Id_obiektu = 9);
    
    SELECT @Id_stan_poprzedni, @Warstwa_id, @Nazwa, @Typ_wydarzenia, @GEO, @VTS, @VTE;
    
    SELECT Id_stanu, VTs,VTe FROM Obiekt WHERE Id_obiektu = 9;
    
    
    
DELIMITER $$
CREATE OR REPLACE PROCEDURE operacja_zakoncz_obiekt(IN INPUT_ID_OBIEKTU INT)
BEGIN 
	SELECT MAX(Id_stanu),
    Warstwa_id, Nazwa, Typ_wydarzenia, GEO, VTs, VTe INTO @Id_stan_poprzedni, @Warstwa_id, @Nazwa, @Typ_wydarzenia, @GEO, @VTS, @VTE
    FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU and Id_stanu = (SELECT MAX(Id_stanu) FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU);
    
    UPDATE Obiekt SET TTe = NOW() WHERE Id_obiektu = INPUT_ID_OBIEKTU and 
    Id_stanu = (SELECT MAX(Id_stanu) FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU); 
                
    INSERT INTO `Obiekt`(`Id_obiektu`, `Warstwa_id`, `Nazwa`, `Rodzaj_stanu`, `Typ_wydarzenia`, `Id_stan_poprzedni`, `GEO`, `VTs`, `VTe`, `TTs`, `TTe`)
              	VALUES(INPUT_ID_OBIEKTU, @Warstwa_id, @Nazwa, 'H',  @Typ_wydarzenia, @Id_stan_poprzedni, @GEO, @VTS, @VTE, NOW(), '9999-12-31 23:59:59');
                       
    CALL zaktualizuj_relacje_obiektu(INPUT_ID_OBIEKTU);           
                
END $$

DELIMITER $$
CREATE OR REPLACE PROCEDURE operacja_wznow_obiekt(IN INPUT_ID_OBIEKTU INT)
BEGIN 
	SELECT MAX(Id_stanu), Warstwa_id, Nazwa, Typ_wydarzenia, GEO, VTs, VTe INTO @Id_stan_poprzedni, @Warstwa_id, @Nazwa, @Typ_wydarzenia, @GEO, @VTS, @VTE
    FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU and Id_stanu = (SELECT MAX(Id_stanu) FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU);
    
    UPDATE Obiekt SET TTe = NOW() WHERE Id_obiektu = INPUT_ID_OBIEKTU and 
    Id_stanu = (SELECT MAX(Id_stanu) FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU); 
    
     INSERT INTO `Obiekt`(`Id_obiektu`, `Warstwa_id`, `Nazwa`, `Rodzaj_stanu`, `Typ_wydarzenia`, `Id_stan_poprzedni`, `GEO`, `VTs`, `VTe`, `TTs`, `TTe`)
              	VALUES(INPUT_ID_OBIEKTU, @Warstwa_id, @Nazwa, 'A',  @Typ_wydarzenia, @Id_stan_poprzedni, @GEO, @VTS, @VTE, NOW(), '9999-12-31 23:59:59');
                
       CALL zaktualizuj_relacje_obiektu(INPUT_ID_OBIEKTU); 
END $$

DELIMITER $$ 
CREATE OR REPLACE PROCEDURE zaktualizuj_relacje_obiektu(IN INPUT_ID_OBIEKTU INT)
BEGIN
	IF(SELECT COUNT(*) FROM Obiekt_opisowy WHERE Id_stan_obiektu IN (SELECT Id_stanu FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU and Rodzaj_stanu = 'A')) > 0 THEN 
    BEGIN
    	SELECT MAX(Id_stanu) INTO @Id_stan_obiektu FROM Obiekt WHERE Id_Obiektu = INPUT_ID_OBIEKTU;
        
        CREATE TEMPORARY TABLE `ob_temp` 
        SELECT * FROM Obiekt_opisowy
        WHERE Id_stan_obiektu IN (SELECT Id_stanu FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU) and Rodzaj_stanu = 'A';
        
        UPDATE Obiekt_opisowy set TTe = NOW(), Rodzaj_stanu = 'H'
        WHERE Id_stan_obiektu IN (SELECT Id_stanu FROM Obiekt WHERE Id_obiektu = INPUT_ID_OBIEKTU) and Rodzaj_stanu = 'A';
        
        UPDATE ob_temp SET Id_stan_obiektu = @Id_stan_obiektu, TTs = NOW(), TTe = '9999-12-31 23:59:59';
		INSERT INTO Obiekt_opisowy(Id_stan_opisu, Id_stan_obiektu, Rodzaj_stanu, VTs, VTe, TTs, TTe) 
                             SELECT Id_stan_opisu, Id_stan_obiektu, Rodzaj_stanu, VTs, VTe, TTs, TTe FROM `ob_temp`;
END; END IF;
END $$