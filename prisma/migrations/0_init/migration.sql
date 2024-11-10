
> pizza_today@1.0.0 npx
> prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script

-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `password` VARCHAR(255) NOT NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `area_payment_modes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `area_id` INTEGER NOT NULL,
    `city_id` INTEGER NOT NULL,
    `payment_mode_id` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `area_products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` VARCHAR(255) NULL,
    `category_id` INTEGER NOT NULL,
    `area_id` VARCHAR(255) NULL,
    `city_id` INTEGER NULL,
    `default_price` INTEGER NOT NULL,
    `default_crust_id` VARCHAR(3) NOT NULL,
    `default_size_id` VARCHAR(3) NOT NULL,
    `user_display` INTEGER NOT NULL DEFAULT 1,
    `sale_on` VARCHAR(200) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `areas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city_id` INTEGER NOT NULL,
    `name` TEXT NOT NULL,
    `address` TEXT NOT NULL,
    `footer_note` TEXT NOT NULL,
    `contact_no` VARCHAR(200) NOT NULL,
    `email` VARCHAR(200) NOT NULL,
    `latitude` VARCHAR(200) NOT NULL DEFAULT '',
    `longitude` VARCHAR(200) NOT NULL DEFAULT '',
    `store_open` TIME(0) NOT NULL,
    `store_close` TIME(0) NOT NULL,
    `is_store_open` INTEGER NOT NULL DEFAULT 1,
    `is_vk_on` INTEGER NOT NULL DEFAULT 0,
    `kot_bill` INTEGER NOT NULL DEFAULT 0,
    `is_loggedin` INTEGER NULL DEFAULT 0,
    `status` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bank_name` VARCHAR(200) NOT NULL,
    `ifsc_code` VARCHAR(200) NOT NULL,
    `account_number` VARCHAR(100) NOT NULL,
    `branch_name` VARCHAR(200) NOT NULL,
    `address` TEXT NOT NULL,
    `status` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` TEXT NOT NULL,
    `title` TEXT NULL,
    `mobile` VARCHAR(20) NULL,
    `order` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `billings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city_id` INTEGER NOT NULL,
    `area_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `password` VARCHAR(255) NOT NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `category_image` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(100) NOT NULL,
    `order_by` FLOAT NULL DEFAULT 0,
    `status` TINYINT NOT NULL DEFAULT 1,
    `allow_size` INTEGER NOT NULL DEFAULT 0,
    `type` VARCHAR(12) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `status` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contactus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `mobile` VARCHAR(12) NOT NULL,
    `subject` VARCHAR(100) NOT NULL,
    `message` TEXT NOT NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coupons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city_id` INTEGER NOT NULL,
    `area_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    `coupon_for` VARCHAR(100) NOT NULL,
    `users` TEXT NOT NULL,
    `product_ids` TEXT NULL,
    `menulistOffer` TEXT NULL,
    `payment_modes` TEXT NOT NULL,
    `max_discount` INTEGER NOT NULL DEFAULT 0,
    `coupon_code` VARCHAR(200) NOT NULL,
    `coupon_name` VARCHAR(200) NOT NULL,
    `coupon_type` INTEGER NOT NULL,
    `discount` INTEGER NULL,
    `condition` INTEGER NOT NULL,
    `user_count` INTEGER NOT NULL DEFAULT 0,
    `valid_to` DATE NOT NULL,
    `valid_from` DATE NOT NULL,
    `term` TEXT NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crusts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `crust_name` LONGTEXT NOT NULL,
    `crust_icon` LONGTEXT NOT NULL,
    `order_by` FLOAT NOT NULL,
    `status` TINYINT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `store_id` INTEGER NOT NULL,
    `obo_user_key` VARCHAR(20) NULL,
    `is_obo_user` INTEGER NULL,
    `first_name` VARCHAR(200) NULL,
    `last_name` VARCHAR(200) NULL,
    `email` VARCHAR(200) NULL,
    `mobile` VARCHAR(200) NULL,
    `state_id` VARCHAR(200) NULL,
    `city_id` VARCHAR(200) NULL,
    `rl_status` INTEGER NULL,
    `rl_date` DATE NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery_charges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `area_id` INTEGER NOT NULL,
    `city_id` INTEGER NOT NULL,
    `single_category_id` TEXT NOT NULL,
    `single_category_min_amount` INTEGER NOT NULL,
    `multiple_categories_id` TEXT NOT NULL,
    `multiple_categories_min_amount` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery_charges_ranges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `delivery_charges_id` INTEGER NOT NULL,
    `min` INTEGER NOT NULL,
    `max` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `failed_jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(255) NOT NULL,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `failed_jobs_uuid_unique`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `franchise` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city_id` INTEGER NOT NULL,
    `area_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `password` VARCHAR(255) NOT NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `franchise_request` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `mobile` VARCHAR(12) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `comment` VARCHAR(250) NOT NULL,
    `address` TEXT NOT NULL,
    `location` TEXT NOT NULL,
    `brochure_pdf` VARCHAR(250) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city_id` INTEGER NOT NULL,
    `area_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `password` VARCHAR(255) NOT NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu_crust_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `area_product_id` INTEGER NOT NULL,
    `area_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `size_id` VARCHAR(11) NOT NULL,
    `crust_id` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` VARCHAR(255) NOT NULL,
    `batch` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_access_tokens` (
    `id` VARCHAR(100) NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `client_id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NULL,
    `scopes` TEXT NULL,
    `revoked` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `expires_at` DATETIME(0) NULL,

    INDEX `oauth_access_tokens_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_auth_codes` (
    `id` VARCHAR(100) NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `scopes` TEXT NULL,
    `revoked` BOOLEAN NOT NULL,
    `expires_at` DATETIME(0) NULL,

    INDEX `oauth_auth_codes_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_clients` (
    `id` CHAR(36) NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(255) NOT NULL,
    `secret` VARCHAR(100) NULL,
    `provider` VARCHAR(255) NULL,
    `redirect` TEXT NOT NULL,
    `personal_access_client` BOOLEAN NOT NULL,
    `password_client` BOOLEAN NOT NULL,
    `revoked` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `oauth_clients_user_id_index`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_personal_access_clients` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `client_id` CHAR(36) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_refresh_tokens` (
    `id` VARCHAR(100) NOT NULL,
    `access_token_id` VARCHAR(100) NOT NULL,
    `revoked` BOOLEAN NOT NULL,
    `expires_at` DATETIME(0) NULL,

    INDEX `oauth_refresh_tokens_access_token_id_index`(`access_token_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offer_item_menus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `offer_id` INTEGER NOT NULL,
    `offer_item_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `default_size_id` VARCHAR(100) NOT NULL,
    `default_crust_id` VARCHAR(100) NOT NULL,
    `qty` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offer_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `offer_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NULL,
    `number` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offer_menu_crust_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `offer_item_menu_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `size_id` VARCHAR(11) NOT NULL,
    `crust_id` INTEGER NOT NULL,
    `price` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `offers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city_id` INTEGER NOT NULL,
    `area_id` INTEGER NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `amount` INTEGER NULL DEFAULT 0,
    `image` VARCHAR(200) NOT NULL,
    `status` INTEGER NOT NULL,
    `offer_type` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `city_id` INTEGER NOT NULL DEFAULT 0,
    `area_id` INTEGER NOT NULL DEFAULT 0,
    `area_product_id` INTEGER NULL DEFAULT 0,
    `product_id` INTEGER NOT NULL,
    `category_id` INTEGER NULL DEFAULT 0,
    `price` INTEGER NOT NULL DEFAULT 0,
    `qty` INTEGER NOT NULL,
    `total` INTEGER NOT NULL,
    `size_id` TEXT NULL,
    `size_name` TEXT NULL,
    `crust_id` TEXT NULL,
    `crust_name` TEXT NULL,
    `topping_id` TEXT NULL,
    `topping_name` TEXT NULL,
    `topping_amount` INTEGER NOT NULL,
    `special_notes` VARCHAR(250) NULL,
    `offer_id` INTEGER NOT NULL,
    `offer_items` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_froms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_histories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `area_id` INTEGER NOT NULL,
    `message` TEXT NOT NULL,
    `discount_type` VARCHAR(100) NOT NULL,
    `discount_amount` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `user_by` VARCHAR(100) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_return_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_return_id` INTEGER NOT NULL,
    `store_id` INTEGER NOT NULL,
    `store_stock_id` INTEGER NOT NULL,
    `qty` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_returns` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_number` VARCHAR(100) NOT NULL,
    `store_id` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_number` VARCHAR(200) NOT NULL,
    `razorpay_order_id` VARCHAR(200) NULL,
    `clone_order_id` INTEGER NOT NULL DEFAULT 0,
    `kot_no` INTEGER NOT NULL,
    `table_no` INTEGER NOT NULL DEFAULT 0,
    `cust_id` TEXT NOT NULL,
    `area_id` INTEGER NOT NULL,
    `city_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `coupon_code` VARCHAR(100) NULL,
    `discount` VARCHAR(100) NULL,
    `discount_amount` INTEGER NULL,
    `discount_type` VARCHAR(10) NULL,
    `discount_reason` TEXT NULL,
    `delivery_fee` INTEGER NULL DEFAULT 0,
    `container_charge` INTEGER NOT NULL DEFAULT 0,
    `sub_total` FLOAT NOT NULL,
    `tax` FLOAT NOT NULL,
    `tax_amount` FLOAT NOT NULL,
    `total` INTEGER NOT NULL,
    `grand_total` FLOAT NOT NULL,
    `order_type` VARCHAR(100) NOT NULL,
    `variant` INTEGER NOT NULL DEFAULT 1,
    `reprint` INTEGER NOT NULL DEFAULT 0,
    `order_from_id` INTEGER NOT NULL DEFAULT 4,
    `payment_mode` VARCHAR(100) NOT NULL,
    `payment_status` INTEGER NULL DEFAULT 0,
    `pg_status` VARCHAR(200) NOT NULL,
    `order_accepted` INTEGER NULL DEFAULT 1,
    `order_accepted_by` VARCHAR(10) NULL,
    `order_accepted_by_id` INTEGER NULL,
    `status` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mobile` VARCHAR(12) NOT NULL,
    `otp` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_resets` (
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,

    INDEX `password_resets_email_index`(`email`(191))
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_modes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(10) NOT NULL,
    `icon` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `PG_partner` VARCHAR(10) NULL,
    `transaction_id` VARCHAR(200) NULL,
    `merchant_txn_id` VARCHAR(200) NULL,
    `bank_txn_id` VARCHAR(300) NULL,
    `order_id` INTEGER NULL,
    `status` VARCHAR(100) NULL,
    `status_code` INTEGER NULL,
    `message` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personal_access_tokens` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `token` VARCHAR(64) NOT NULL,
    `abilities` TEXT NULL,
    `last_used_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `personal_access_tokens_token_unique`(`token`),
    INDEX `personal_access_tokens_tokenable_type_tokenable_id_index`(`tokenable_type`, `tokenable_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_stocks_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `txn_type` INTEGER NOT NULL,
    `qty` INTEGER NOT NULL,
    `available_qty` INTEGER NOT NULL,
    `remarks` VARCHAR(200) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` VARCHAR(100) NOT NULL,
    `product_name` VARCHAR(500) NOT NULL,
    `type` INTEGER NOT NULL,
    `image` LONGTEXT NOT NULL,
    `bg_image` VARCHAR(200) NOT NULL,
    `description` LONGTEXT NULL,
    `sale_on` VARCHAR(250) NOT NULL,
    `order_by` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productsold` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(255) NULL,
    `code` VARCHAR(255) NULL,
    `product_description` TEXT NOT NULL,
    `status` INTEGER NULL DEFAULT 0,
    `category_id` INTEGER NOT NULL,
    `user_display` INTEGER NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `head_office_address` TEXT NOT NULL,
    `corporate_office_address` TEXT NOT NULL,
    `facebook` TEXT NOT NULL,
    `twitter` TEXT NOT NULL,
    `instagram` TEXT NOT NULL,
    `page_background_image` TEXT NOT NULL,
    `menu_background_image` TEXT NOT NULL,
    `map_location` TEXT NOT NULL,
    `head_office_no` VARCHAR(100) NOT NULL,
    `corporate_office_no` VARCHAR(100) NOT NULL,
    `brochure_pdf` VARCHAR(200) NOT NULL,
    `terms_conditions` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sizes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `value` VARCHAR(11) NOT NULL,
    `serves` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `states` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(40) NOT NULL,
    `country_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `store_payouts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `store_id` INTEGER NOT NULL,
    `store_sell_order_id` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `commission` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `type` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATE NOT NULL,
    `initiated_at` DATETIME(0) NOT NULL,
    `paid_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `store_sell_order_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `store_sell_order_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `qty` VARCHAR(200) NOT NULL,
    `price` VARCHAR(200) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `store_sell_orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `store_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `order_number` VARCHAR(200) NOT NULL,
    `customer_id` VARCHAR(200) NOT NULL,
    `obo_tracking_id` VARCHAR(200) NOT NULL,
    `coupon_code` VARCHAR(200) NULL,
    `employee_code` VARCHAR(200) NULL,
    `amount` VARCHAR(200) NOT NULL,
    `discount` VARCHAR(200) NULL,
    `grand_total` VARCHAR(200) NOT NULL,
    `bv_total` INTEGER NOT NULL,
    `payment_mode` VARCHAR(200) NOT NULL,
    `card_ref_no` VARCHAR(200) NOT NULL DEFAULT '0',
    `carry_bag` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `store_stocks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `store_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `qty` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `store_code` VARCHAR(200) NOT NULL,
    `store_name` VARCHAR(200) NOT NULL,
    `managed_by` VARCHAR(200) NOT NULL,
    `mobile` VARCHAR(12) NOT NULL,
    `email` VARCHAR(200) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `address` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `taxes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city_id` INTEGER NOT NULL,
    `area_id` INTEGER NOT NULL,
    `exclud_items` TEXT NOT NULL,
    `gst_no` VARCHAR(100) NOT NULL,
    `tax` DOUBLE NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `created_by` VARCHAR(100) NOT NULL,
    `sale_on` VARCHAR(20) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `toppings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `topping_name` LONGTEXT NOT NULL,
    `topping_type` VARCHAR(150) NOT NULL,
    `topping_price_medium` VARCHAR(200) NOT NULL,
    `topping_price_large` VARCHAR(400) NOT NULL,
    `topping_price_regular` VARCHAR(400) NOT NULL,
    `topping_price_extra_large` INTEGER NOT NULL,
    `topping_image` VARCHAR(250) NOT NULL,
    `topping_icon` VARCHAR(300) NOT NULL,
    `city_id` INTEGER NOT NULL,
    `area_id` INTEGER NOT NULL,
    `order_by` FLOAT NULL,
    `status` TINYINT NOT NULL,
    `date_time` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `address` TEXT NOT NULL,
    `locality` TEXT NULL,
    `email_id` VARCHAR(299) NOT NULL,
    `full_name` VARCHAR(200) NOT NULL,
    `mobile` VARCHAR(12) NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_coupons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `area_id` INTEGER NOT NULL,
    `coupon_id` INTEGER NOT NULL,
    `count` INTEGER NOT NULL,
    `valid_to` DATE NOT NULL,
    `type` VARCHAR(20) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_order_cancelations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `area_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `order_id` INTEGER NOT NULL,
    `type` VARCHAR(10) NOT NULL,
    `amount` INTEGER NOT NULL,
    `date` INTEGER NOT NULL,
    `order_from_id` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `mobile` VARCHAR(10) NOT NULL,
    `dob` DATE NULL,
    `image` TEXT NOT NULL,
    `is_email_verified` BOOLEAN NULL DEFAULT false,
    `is_mobile_verified` BOOLEAN NULL DEFAULT false,
    `mobile_otp` INTEGER NULL,
    `email_otp` INTEGER NULL,
    `deviceId` VARCHAR(255) NULL,
    `device_type` VARCHAR(255) NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `password` VARCHAR(255) NOT NULL,
    `fcm_token` VARCHAR(255) NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `about_us` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `heading` VARCHAR(50) NOT NULL,
    `paragraph` VARCHAR(10000) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `terms_and_conditions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `heading` VARCHAR(50) NOT NULL,
    `paragraph` VARCHAR(10000) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `privacy_policy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `heading` VARCHAR(50) NOT NULL,
    `paragraph` VARCHAR(10000) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

