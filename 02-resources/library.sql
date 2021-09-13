-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 13, 2021 at 12:03 PM
-- Server version: 10.6.4-MariaDB
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `teswt`
--

-- --------------------------------------------------------

--
-- Table structure for table `administrator`
--

DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `administrator`
--

INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `is_active`) VALUES
(1, 'ognjen', '$2b$11$BlWgwJPoeXGfyZNOYwZfIOlwOpR.fMYBQDtxqDCYPZW8VSrZoU99O', 1);

-- --------------------------------------------------------

--
-- Table structure for table `author`
--

DROP TABLE IF EXISTS `author`;
CREATE TABLE IF NOT EXISTS `author` (
  `author_id` int(10) NOT NULL AUTO_INCREMENT,
  `author_name` varchar(50) NOT NULL DEFAULT '',
  `books_id` int(10) NOT NULL,
  PRIMARY KEY (`author_id`),
  UNIQUE KEY `author_name` (`author_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `author`
--

INSERT INTO `author` (`author_id`, `author_name`, `books_id`) VALUES
(1, 'Harlan Koben', 1),
(2, 'Kalderon Adižes', 2),
(3, 'Isak Kalderon Adižes', 3),
(4, 'Karlos Fuentes', 4);

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
CREATE TABLE IF NOT EXISTS `books` (
  `books_id` int(10) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `books_title` varchar(60) NOT NULL,
  `title_originaly` varchar(60) NOT NULL,
  `print_year` varchar(64) NOT NULL,
  `pages_number` int(50) NOT NULL,
  `language` varchar(20) NOT NULL,
  `isbn` varchar(64) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `author_id` int(10) NOT NULL,
  `publisher_id` int(10) DEFAULT NULL,
  `category_id` int(10) NOT NULL,
  `shelf_id` int(10) NOT NULL,
  PRIMARY KEY (`books_id`),
  UNIQUE KEY `uq_book_books_title` (`books_title`),
  UNIQUE KEY `isbn` (`isbn`),
  KEY `fk_books_category_id` (`category_id`),
  KEY `fk_books_publisher_id` (`publisher_id`),
  KEY `fk_books_shelf_id` (`shelf_id`),
  KEY `fk_books_author_id` (`author_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`books_id`, `created_at`, `books_title`, `title_originaly`, `print_year`, `pages_number`, `language`, `isbn`, `is_active`, `author_id`, `publisher_id`, `category_id`, `shelf_id`) VALUES
(1, '2021-05-19 15:10:35', 'Pravi se mrtav', 'He pretends to be dead', '17. januar 2020', 512, 'Srpski', '978-86-521-3580-6', 1, 1, 1, 1, 1),
(2, '2021-05-20 16:10:47', 'Adižes o menadžmentu', 'Adizes about management', '10. mart 2010', 331, 'Srpski', '978-86-7956-056-8', 1, 2, 3, 3, 3),
(3, '2021-05-21 19:10:35', 'Adam u raju', 'Adam in paradise', '10. mart 2010', 168, 'Srpski', '978-86-86933-94-2', 1, 4, 2, 2, 2),
(4, '2021-05-21 19:10:35', 'Adižes o politici', 'Adizes about politics', '18. februara 2017', 255, 'Srpski', '9788679560551', 1, 2, 3, 3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int(10) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(64) NOT NULL,
  `parent__category_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`category_name`),
  KEY `fk_category_parent__category_id` (`parent__category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `category_name`, `parent__category_id`) VALUES
(1, 'Triler', NULL),
(2, 'Beletristika', NULL),
(3, 'Komunikacije', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `photo`
--

DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int(10) NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) NOT NULL,
  `books_id` int(10) NOT NULL,
  PRIMARY KEY (`photo_id`),
  KEY `fk_photo_books_id` (`books_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `photo`
--

INSERT INTO `photo` (`photo_id`, `image_path`, `books_id`) VALUES
(1, 'https://www.laguna.rs/_img/korice/4522/pravi_se_mrtav-harlan_koben_v.jpg', 1),
(2, 'https://salonknjiga.rs/wp-content/uploads/2017/08/Adizes-o-mng-r-.jpg', 2),
(3, 'https://salonknjiga.rs/wp-content/uploads/2017/09/Karlos-Fuentes-Adam-u-raju.jpg', 3),
(4, 'https://salonknjiga.rs/wp-content/uploads/2017/08/adizes-o-politici-R.jpg', 4);

-- --------------------------------------------------------

--
-- Table structure for table `publisher`
--

DROP TABLE IF EXISTS `publisher`;
CREATE TABLE IF NOT EXISTS `publisher` (
  `publisher_id` int(11) NOT NULL AUTO_INCREMENT,
  `publisher_name` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `year_establishment` varchar(50) NOT NULL,
  PRIMARY KEY (`publisher_id`),
  UNIQUE KEY `publisher_name` (`publisher_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `publisher`
--

INSERT INTO `publisher` (`publisher_id`, `publisher_name`, `city`, `country`, `year_establishment`) VALUES
(1, 'Laguna', 'Beograd', 'Srbija', '1990'),
(2, 'Arhipelag', 'Novi Beograd', 'Srbija', '1991'),
(3, 'HERAedu', 'Novi Beograd', 'Srbija', '1989');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE IF NOT EXISTS `rooms` (
  `rooms_id` int(10) NOT NULL AUTO_INCREMENT,
  `rooms_name` varchar(64) NOT NULL,
  PRIMARY KEY (`rooms_id`),
  UNIQUE KEY `rooms_name` (`rooms_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`rooms_id`, `rooms_name`) VALUES
(1, 'soba1'),
(2, 'soba2'),
(3, 'soba3');

-- --------------------------------------------------------

--
-- Table structure for table `shelf`
--

DROP TABLE IF EXISTS `shelf`;
CREATE TABLE IF NOT EXISTS `shelf` (
  `shelf_id` int(11) NOT NULL AUTO_INCREMENT,
  `shelf_name` varchar(50) NOT NULL,
  `rooms_id` int(10) NOT NULL,
  PRIMARY KEY (`shelf_id`),
  UNIQUE KEY `uq_shelf_shelf_name` (`shelf_name`),
  KEY `fk_shelf_rooms_id` (`rooms_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `shelf`
--

INSERT INTO `shelf` (`shelf_id`, `shelf_name`, `rooms_id`) VALUES
(1, '1', 1),
(2, '2', 2),
(3, '3', 3);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `surname` varchar(50) NOT NULL,
  `forename` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `password_reset_code` varchar(255) NOT NULL,
  `phone_number` varchar(54) NOT NULL,
  `email` varchar(50) NOT NULL,
  `postal_address` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `created_at`, `surname`, `forename`, `password_hash`, `password_reset_code`, `phone_number`, `email`, `postal_address`, `is_active`) VALUES
(1, '2021-05-19 15:10:35', 'Pera', 'Perić', '$2b$11$BlWgwJPoeXGfyZNOYwZfIOlwOpR.fMYBQDtxqDCYPZW8VSrZoU99O', 'NULL', '+381114231433', 'perper@example.com', 'Periceva 1, 11010 Beograd, R. Srbija', 1),
(2, '2021-05-19 15:10:35', 'Stana', 'Perić', '$2y$10$skPZp74nDvuUHxpiBhUEmOv2DMbbKlBwqP8MtdjRpBmr0A0fvLDGa', 'NULL', '+38111345123', 'stanaper@example.com', 'Gundulićeva 1, 11010 Beograd, R. Srbija', 1),
(3, '2021-05-19 15:10:35', 'Mihajlo', 'Perić', '$2y$10$.mX1YY8KYChN5quWdNIZxeyMuCXeunzcYelnresjRY1xcArtu0Dva', 'NULL', '+38111458765', 'mihajloper@example.com', 'Mala ulica 12, 11010 Beograd, R. Srbija', 1),
(4, '2021-05-19 15:10:35', 'Goran', 'Perić', '$2y$10$VKUYAJ3clSmHbsfn1MCo9.7pxBlPLwvx9QJTJQF3xsmt6FlUKdHoK', 'NULL', '+38111123456', 'goranper@example.com', 'Velika 22, 11010 Beograd, R. Srbija', 1),
(5, '2021-05-19 15:10:35', 'Aca', 'Perić', '$2y$10$.xFaCY9t88suI8DVBZ8bl.i0isUyRZ2rnnznsxEhC3fiW717HSMeq', 'NULL', '+38111497432', 'acaper@example.com', 'Niška 31, 11010 Beograd, R. Srbija', 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `author` (`author_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `books_ibfk_2` FOREIGN KEY (`publisher_id`) REFERENCES `publisher` (`publisher_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `books_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `books_ibfk_4` FOREIGN KEY (`shelf_id`) REFERENCES `shelf` (`shelf_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`parent__category_id`) REFERENCES `category` (`category_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `photo`
--
ALTER TABLE `photo`
  ADD CONSTRAINT `photo_ibfk_1` FOREIGN KEY (`books_id`) REFERENCES `books` (`books_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `shelf`
--
ALTER TABLE `shelf`
  ADD CONSTRAINT `shelf_ibfk_1` FOREIGN KEY (`rooms_id`) REFERENCES `rooms` (`rooms_id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
