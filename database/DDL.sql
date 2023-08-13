-- Group 59 DDL File
-- Group Name: "I'll take What is a Database for $200, Alex"
-- Matthew Goodroe and Samantha Affarano


SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';


-- -----------------------------------------------------
-- Table `Awards`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Awards` (
  `award_ID` INT NOT NULL AUTO_INCREMENT,
  `award` VARCHAR(45) NOT NULL,
  `ceremony` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`award_ID`)
  );


-- -----------------------------------------------------
-- Table `Members`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Members` (
  `member_ID` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `email` VARCHAR(45) NULL DEFAULT NULL,
  `address` VARCHAR(45) NULL DEFAULT NULL,
  `months_a_member` INT NULL DEFAULT NULL,
  PRIMARY KEY (`member_ID`)
  );


-- -----------------------------------------------------
-- Table `Sub_Genres`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Sub_Genres` (
  `sub_genre_ID` INT NOT NULL AUTO_INCREMENT,
  `sub_genre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`sub_genre_ID`)
  );


-- -----------------------------------------------------
-- Table `Members_fave_Sub_Genres`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Members_fave_Sub_Genres` (
  `member_ID` INT NOT NULL,
  `sub_genre_ID` INT NOT NULL,
   PRIMARY KEY (`member_ID`, `sub_genre_ID`),
   FOREIGN KEY (`member_ID`) REFERENCES `Members` (`member_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
   FOREIGN KEY (`sub_genre_ID`) REFERENCES `Sub_Genres` (`sub_genre_ID`) ON DELETE CASCADE ON UPDATE CASCADE
    );

-- -----------------------------------------------------
-- Table `Movies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Movies` (
  `movie_ID` INT NOT NULL AUTO_INCREMENT,
  `movie_name` VARCHAR(45) NOT NULL,
  `age_rating` VARCHAR(5) NULL DEFAULT NULL,
  `release_year` INT NOT NULL,
  `imdb_rating` DECIMAL(3,1) NULL DEFAULT NULL,
  `rotten_rating` INT NULL DEFAULT NULL,
  `num_times_rented` INT NOT NULL DEFAULT 0,
  `sub_genre_ID` INT NOT NULL,
  PRIMARY KEY (`movie_ID`),
  FOREIGN KEY (`sub_genre_ID`) REFERENCES `Sub_Genres` (`sub_genre_ID`) 
  ON UPDATE CASCADE
  ON DELETE CASCADE
    );


-- -----------------------------------------------------
-- Table `Members_has_Movies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Members_has_Movies` (
  `member_ID` INT NOT NULL,
  `movie_ID` INT NOT NULL,
  `overdue` TINYINT(4) NOT NULL DEFAULT 0,
  `returned` TINYINT(4) NOT NULL DEFAULT 0,
  `checked_out` DATETIME NOT NULL,
  `return_date` DATETIME NULL DEFAULT NULL,
   PRIMARY KEY (`member_ID`, `movie_ID`),
   FOREIGN KEY (`member_ID`) REFERENCES `Members` (`member_ID`)
   ON UPDATE CASCADE
   ON DELETE CASCADE,
   FOREIGN KEY (`movie_ID`) REFERENCES `Movies` (`movie_ID`)   
   ON UPDATE CASCADE
   ON DELETE CASCADE
    );


-- -----------------------------------------------------
-- Table `Movies_has_Awards`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Movies_has_Awards` (
  `movie_ID` INT NOT NULL,
  `award_ID` INT NOT NULL,
   PRIMARY KEY (`movie_ID`, `award_ID`),
   FOREIGN KEY (`award_ID`) REFERENCES `Awards` (`award_ID`) ON DELETE CASCADE,
   FOREIGN KEY (`movie_ID`) REFERENCES `Movies` (`movie_ID`) ON DELETE CASCADE
    );

-- -----------------------------------------------------
-- Inserting Sample Data
-- -----------------------------------------------------

    
insert into Members (member_ID, name, email, address, months_a_member)
values (1, 'Philip K. Dick', 'philip@gmail.com', '87569 Ubik Ave. Berkeley, CA 94701', 8),
(2, 'Jules Verne', 'julesV@yahoo.com', '908 Roles Rd. Paris, IL 61944 Apt. B', 2),
(3, 'Bray Madbury', 'iluvlibraries@gmail.com', '111 Fireplace Ln. Los Angeles, CA 90001', 25);

insert into Members_has_Movies(member_ID, movie_ID, overdue, returned, checked_out, return_date)
values (1, 1, 0, 0,'2023-7-23 17:30:00', NULL),
(2, 6, 0, 0,'2023-7-23 13:30:00', NULL),
(2, 2, 0, 0,'2023-7-23 13:30:00', NULL),
(3, 5, 0, 0,'2023-7-23 03:30:00', NULL);

insert into Movies (movie_name, age_rating, release_year, imdb_rating, rotten_rating, num_times_rented, sub_genre_ID)
values ("The 5th Element", "PG-13", 1997, 7.6, 71, 15, 2), 
("Star Wars: A New Hope", "PG", 1977, 8.6, 93, 76, 2), 
("Johnny Mnemonic", "R", 1995, 5.6, 18, 2, 3), 
("Mad Max", "R", 1980, 6.8, 91, 20, 6),
("Planet of the Apes", "G", 1968, 8.0, 87, 46, 6),
("Serenity", "PG-13", 2005, 7.8, 82, 35, 4);

insert into Movies_has_Awards (movie_ID, award_ID)
values (5,1), 
(2,5), 
(2,4), 
(4,3), 
(2,2);

insert into Members_fave_Sub_Genres(member_ID, sub_genre_ID)
values (1, 2),
(1,3),
(2, 2),
(2, 4),
(3, 6);

insert into Sub_Genres (sub_genre_ID, sub_genre)
values (1, 'Dystopia'),
(2, 'Space Opera'),
(3, 'Cyberpunk'),
(4, 'Space Western'),
(5, 'Apocalyptic'),
(6, 'Post-Apocalyptic'),
(7, 'Hard Science Fiction');


insert into Awards (award_ID, award, ceremony)
values 
(1, "Nominee: Best Costume Design", "Oscars: 1969"), 
(2, "Winner","National Film Registry: 1989"), 
(3, "Best Original Music Score","AFI Award: 1979"),
(4, "Best Sound", "BAFTA Film Award: 1979"),
(5, "Special Award Winner","Science Fiction and Fantasy Writers of America: 1978");


--- Report for Normalization:
-- SELECT member_ID,count(member_ID), Movies.movie_name AS "Checked-out Movies per Member" FROM Members_has_Movies INNER JOIN Movies ON Members_has_Movies.movie_ID = Movies.movie_ID GROUP BY member_ID;
-- SELECT * from Movies CROSS JOIN Members_has_Movies CROSS JOIN Movies_has_Awards CROSS JOIN Sub_Genres;

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
