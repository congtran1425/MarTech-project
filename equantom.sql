-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 25, 2019 at 01:15 AM
-- Server version: 10.1.37-MariaDB
-- PHP Version: 7.1.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `equantom`
--

-- --------------------------------------------------------

--
-- Table structure for table `product_genders`
--

CREATE TABLE `product_genders` (
  `idgender` int(11) NOT NULL,
  `gendername` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `product_genders` (`idgender`, `gendername`) VALUES
(1, 'nam'),
(2, 'nữ'),
(3, 'unisex'),
(4, 'trẻ em');

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `idcategory` int(11) NOT NULL,
  `categoryname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `product_categories` (`idcategory`, `categoryname`) VALUES
(1, 'áo thun'),
(2, 'áo sơ mi'),
(3, 'áo khoác'),
(4, 'quần jeans'),
(5, 'quần short'),
(6, 'váy/đầm'),
(7, 'hoodie'),
(8, 'phụ kiện');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `price` DECIMAL(12,2) NOT NULL,
  `img_url` varchar(255) NOT NULL,
  `category` int(11) DEFAULT NULL,
  `gender_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `products` (`id`, `name`, `rating`, `price`, `img_url`, `category`, `gender_id`) VALUES
(3, 'Áo thun basic cotton', '4.4', '59000', 'ao-thun-basic-cotton.jpg', 1, 3),
(4, 'Áo sơ mi oxford dài tay', '4.6', '79000', 'ao-so-mi-oxford-dai-tay.jpg', 2, 1),
(5, 'Áo khoác bomber unisex', '4.5', '139000', 'ao-khoac-bomber-unisex.jpg', 3, 3),
(6, 'Quần jeans slim fit', '4.3', '129000', 'quan-jeans-slim-fit.jpg', 4, 1),
(7, 'Quần short kaki', '4.1', '68000', 'quan-short-kaki.jpg', 5, 1),
(8, 'Váy midi hoa nhí', '4.7', '227000', 'vay-midi-hoa-nhi.jpg', 6, 2),
(9, 'Hoodie nỉ ấm', '4.2', '132000', 'hoodie-ni-am.jpg', 7, 3),
(10, 'Áo khoác gió nhẹ', '4.0', '68000', 'ao-khoac-gio-nhe.jpg', 3, 3),
(11, 'Áo thun graphic', '4.1', '54000', 'ao-thun-graphic.jpg', 1, 2),
(12, 'Quần jeans ống rộng', '4.5', '71000', 'quan-jeans-ong-rong.jpg', 4, 2),
(13, 'Đầm suông tối giản', '4.6', '226000', 'dam-suong-to-gian.jpg', 6, 2),
(14, 'Nón lưỡi trai', '4.0', '29000', 'non-luoi-trai.jpg', 8, 3),
(15, 'Áo hoodie trẻ em', '4.3', '52000', 'ao-hoodie-tre-em.jpg', 7, 4),
(16, 'Quần short trẻ em', '4.2', '45000', 'quan-short-tre-em.jpg', 5, 4),
(17, 'Áo khoác denim', '4.4', '65000', 'ao-khoac-denim.jpg', 3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `sizes`
--

CREATE TABLE `sizes` (
  `idsize` int(11) NOT NULL,
  `size_code` varchar(10) NOT NULL,
  `size_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `sizes` (`idsize`, `size_code`, `size_name`) VALUES
(1, 'XS', 'Extra Small'),
(2, 'S', 'Small'),
(3, 'M', 'Medium'),
(4, 'L', 'Large'),
(5, 'XL', 'Extra Large');

-- --------------------------------------------------------

--
-- Table structure for table `colors`
--

CREATE TABLE `colors` (
  `idcolor` int(11) NOT NULL,
  `color_name` varchar(50) NOT NULL,
  `color_hex` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `colors` (`idcolor`, `color_name`, `color_hex`) VALUES
(1, 'Đen', '#111111'),
(2, 'Trắng', '#ffffff'),
(3, 'Xanh navy', '#1b2a41'),
(4, 'Đỏ đô', '#7a1f2b'),
(5, 'Be', '#e7dccb');

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size_id` int(11) NOT NULL,
  `color_id` int(11) NOT NULL,
  `sku` varchar(50) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `price` decimal(6,2) DEFAULT NULL,
  `img_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `product_variants` (`id`, `product_id`, `size_id`, `color_id`, `sku`, `stock`, `price`, `img_url`) VALUES
(1, 3, 2, 1, 'TS-BASIC-S-BLK', 25, NULL, NULL),
(2, 3, 3, 1, 'TS-BASIC-M-BLK', 22, NULL, NULL),
(3, 3, 4, 2, 'TS-BASIC-L-WHT', 18, NULL, NULL),
(4, 4, 3, 2, 'SH-OXF-M-WHT', 15, NULL, NULL),
(5, 4, 4, 3, 'SH-OXF-L-NAV', 10, NULL, NULL),
(6, 6, 3, 1, 'JEAN-SLIM-M-BLK', 12, NULL, NULL),
(7, 6, 4, 3, 'JEAN-SLIM-L-NAV', 8, NULL, NULL),
(8, 8, 2, 4, 'DR-MIDI-S-RED', 9, NULL, NULL),
(9, 8, 3, 5, 'DR-MIDI-M-BGE', 11, NULL, NULL),
(10, 9, 3, 1, 'HD-NI-M-BLK', 20, NULL, NULL),
(11, 9, 4, 2, 'HD-NI-L-WHT', 14, NULL, NULL),
(12, 12, 3, 3, 'JEAN-WIDE-M-NAV', 7, NULL, NULL),
(13, 12, 4, 5, 'JEAN-WIDE-L-BGE', 6, NULL, NULL),
(14, 15, 2, 2, 'HD-KID-S-WHT', 10, NULL, NULL),
(15, 16, 2, 3, 'SHORT-KID-S-NAV', 10, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `address` varchar(255) NOT NULL,
  `note` text DEFAULT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(3, 'wefewhf', 'wefeiuwf@gmail.com', '$2a$10$43F6yQOIbQ3/aER/XB2d4OP9qsV1K988Y4/OOE5OWVFDHk6pB7AY2'),
(4, 'amin', 'admin@admin.com', '$2a$10$HQYJU216Wu3RtKPdbR8aqu/04gNUdxn6EpcWc73vn5BiHoVCFCnES'),
(5, 'rafael', 'rafaelgoulartb@gmail.com', '$2a$10$nxrkZIRafbTsgtJTcFfgleVkuuH/MmzwGUvbIhH0VKb4AdUgDJawq'),
(6, 'opresor', 'opresor@protonmail.com', '$2a$10$RgS9EYuOxhwODKmTgBlK9OOUbDE8bmcRRf8Yi4kraLzfVpdkW5lT.'),
(7, 'ewfwf', 'wfewefw@ewfwfw.com', '$2a$10$OWbDkDphF.L11kIGiz1YzuXj7tYzs9b1hh/yHp9UkY2ciMlQ1CHqW'),
(8, 'wfgewfgwegrhgol', 'rafael@gmail.com', '$2a$10$alIXffXgTI7nWm.5Nlcnnuhq8EvZOxMGoR8IHK.48iPB/bEXvCae.'),
(9, 'test', 'test@test.com', '$2a$10$G6k09m2y3kLkaNRV4K0.POKsZYaYIaEb86VJWGBYtXZ2FOF6iptKW'),
(10, 'rafaell', 'rafael@gmail.comm', '$2a$10$ozcBdNwEdS6q2I1NqFdRdeFwPbDKQJHkOce3.f3G3rLjxU82I9nrS'),
(11, 'rafaelll', 'rafael@gmail.commmmm', '$2a$10$WtFCu09VzN6Y9B.lhiklCuNFGPiu5CFwXyUtPLWByGfNrsrziyEeK'),
(12, 'rafael_f', 'rafael_f@eu.com', '$2a$10$2tp5oXwOTTx9cYw27ztIF.bU/fNDixmLyVqB3Jrfd32AVrHuQgS4G');

--
-- Indexes for dumped tables
--

ALTER TABLE `product_genders`
  ADD PRIMARY KEY (`idgender`);

ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`idcategory`);

ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category` (`category`),
  ADD KEY `gender_id` (`gender_id`);

ALTER TABLE `sizes`
  ADD PRIMARY KEY (`idsize`);

ALTER TABLE `colors`
  ADD PRIMARY KEY (`idcolor`);

ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `size_id` (`size_id`),
  ADD KEY `color_id` (`color_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `variant_id` (`variant_id`);

--
-- AUTO_INCREMENT for dumped tables
--

ALTER TABLE `product_genders`
  MODIFY `idgender` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `product_categories`
  MODIFY `idcategory` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

ALTER TABLE `sizes`
  MODIFY `idsize` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `colors`
  MODIFY `idcolor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category`) REFERENCES `product_categories` (`idcategory`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`gender_id`) REFERENCES `product_genders` (`idgender`);

ALTER TABLE `product_variants`
  ADD CONSTRAINT `variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `variants_ibfk_2` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`idsize`),
  ADD CONSTRAINT `variants_ibfk_3` FOREIGN KEY (`color_id`) REFERENCES `colors` (`idcolor`);

ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
