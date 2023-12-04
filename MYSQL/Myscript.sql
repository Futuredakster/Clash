-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema clash
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema clash
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `clash` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `clash` ;

-- -----------------------------------------------------
-- Table `clash`.`accounts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clash`.`accounts` (
  `account_id` INT NOT NULL AUTO_INCREMENT,
  `account_type` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`account_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clash`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clash`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clash`.`tournaments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clash`.`tournaments` (
  `tournament_id` INT NOT NULL AUTO_INCREMENT,
  `tournament_name` VARCHAR(100) NOT NULL,
  `start_date` DATE NULL DEFAULT NULL,
  `end_date` DATE NULL DEFAULT NULL,
  `account_id` INT NULL DEFAULT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `logo_url` VARCHAR(1000) NULL DEFAULT NULL,
  PRIMARY KEY (`tournament_id`),
  INDEX `account_id` (`account_id` ASC) VISIBLE,
  CONSTRAINT `tournaments_ibfk_1`
    FOREIGN KEY (`account_id`)
    REFERENCES `clash`.`accounts` (`account_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clash`.`attendees`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clash`.`attendees` (
  `attendee_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `tournament_id` INT NULL DEFAULT NULL,
  `account_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`attendee_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `tournament_id` (`tournament_id` ASC) VISIBLE,
  INDEX `account_id` (`account_id` ASC) VISIBLE,
  CONSTRAINT `attendees_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `clash`.`users` (`user_id`),
  CONSTRAINT `attendees_ibfk_2`
    FOREIGN KEY (`tournament_id`)
    REFERENCES `clash`.`tournaments` (`tournament_id`),
  CONSTRAINT `attendees_ibfk_3`
    FOREIGN KEY (`account_id`)
    REFERENCES `clash`.`accounts` (`account_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clash`.`brackets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clash`.`brackets` (
  `bracket_id` INT NOT NULL AUTO_INCREMENT,
  `tournament_id` INT NULL DEFAULT NULL,
  `bracket_type` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`bracket_id`),
  INDEX `tournament_id` (`tournament_id` ASC) VISIBLE,
  CONSTRAINT `brackets_ibfk_1`
    FOREIGN KEY (`tournament_id`)
    REFERENCES `clash`.`tournaments` (`tournament_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clash`.`participants`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clash`.`participants` (
  `participant_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `tournament_id` INT NULL DEFAULT NULL,
  `account_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`participant_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `tournament_id` (`tournament_id` ASC) VISIBLE,
  INDEX `account_id` (`account_id` ASC) VISIBLE,
  CONSTRAINT `participants_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `clash`.`users` (`user_id`),
  CONSTRAINT `participants_ibfk_2`
    FOREIGN KEY (`tournament_id`)
    REFERENCES `clash`.`tournaments` (`tournament_id`),
  CONSTRAINT `participants_ibfk_3`
    FOREIGN KEY (`account_id`)
    REFERENCES `clash`.`accounts` (`account_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clash`.`schedule`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clash`.`schedule` (
  `schedule_id` INT NOT NULL AUTO_INCREMENT,
  `tournament_id` INT NULL DEFAULT NULL,
  `match_date` DATETIME NULL DEFAULT NULL,
  `location` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`schedule_id`),
  INDEX `tournament_id` (`tournament_id` ASC) VISIBLE,
  CONSTRAINT `schedule_ibfk_1`
    FOREIGN KEY (`tournament_id`)
    REFERENCES `clash`.`tournaments` (`tournament_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `clash`.`users_accounts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clash`.`users_accounts` (
  `user_account_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `account_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`user_account_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `account_id` (`account_id` ASC) VISIBLE,
  CONSTRAINT `users_accounts_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `clash`.`users` (`user_id`),
  CONSTRAINT `users_accounts_ibfk_2`
    FOREIGN KEY (`account_id`)
    REFERENCES `clash`.`accounts` (`account_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
