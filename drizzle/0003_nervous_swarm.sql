CREATE TABLE `dataset_versions` (
	`id` varchar(100) NOT NULL,
	`source` varchar(255) NOT NULL,
	`description` text,
	`publishedDate` varchar(50),
	`ingestedAt` timestamp NOT NULL DEFAULT (now()),
	`checksum` varchar(255),
	`notes` text,
	CONSTRAINT `dataset_versions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `regions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`prefecture` varchar(50) NOT NULL,
	`city` varchar(100) NOT NULL,
	`ward` varchar(100),
	`district` varchar(100),
	`geoCode` varchar(20),
	`lat` decimal(10,6),
	`lon` decimal(10,6),
	CONSTRAINT `regions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`datasetVersionId` varchar(100) NOT NULL,
	`transactionYm` varchar(50) NOT NULL,
	`prefecture` varchar(50) NOT NULL,
	`city` varchar(100) NOT NULL,
	`ward` varchar(100),
	`district` varchar(100),
	`propertyType` varchar(50) NOT NULL,
	`landAreaM2` decimal(12,2),
	`buildingAreaM2` decimal(12,2),
	`buildingYear` int,
	`structure` varchar(100),
	`floorPlan` varchar(100),
	`floor` int,
	`nearestStation` varchar(100),
	`stationDistanceMin` int,
	`priceYen` int NOT NULL,
	`unitPriceYenPerM2` decimal(15,2),
	`lat` decimal(10,6),
	`lon` decimal(10,6),
	`remarks` text,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `valuation_requests` (
	`id` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`inputPrefecture` varchar(50) NOT NULL,
	`inputCity` varchar(100) NOT NULL,
	`inputWard` varchar(100),
	`inputDistrict` varchar(100),
	`propertyType` varchar(50) NOT NULL,
	`landAreaM2` decimal(12,2),
	`buildingAreaM2` decimal(12,2),
	`buildingYear` int,
	`stationDistanceMin` int,
	`ownershipType` varchar(50),
	`inheritanceFlag` int DEFAULT 0,
	`ownerName` varchar(255),
	`email` varchar(320),
	`phone` varchar(20),
	`notes` text,
	`status` varchar(50) DEFAULT 'pending',
	CONSTRAINT `valuation_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `valuation_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestId` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`estimatedLowYen` int NOT NULL,
	`estimatedHighYen` int NOT NULL,
	`estimatedMidYen` int,
	`compsUsedCount` int NOT NULL,
	`method` varchar(100) NOT NULL,
	`methodVersion` varchar(50) NOT NULL,
	`explanation` text,
	`marketAnalysis` text,
	`adjustmentFactors` text,
	`forecastAnalysis` text,
	`status` varchar(50) DEFAULT 'completed',
	`errorMessage` text,
	CONSTRAINT `valuation_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_dataset_source` ON `dataset_versions` (`source`);--> statement-breakpoint
CREATE INDEX `idx_region_prefecture` ON `regions` (`prefecture`);--> statement-breakpoint
CREATE INDEX `idx_region_city` ON `regions` (`city`);--> statement-breakpoint
CREATE INDEX `idx_region_pref_city` ON `regions` (`prefecture`,`city`);--> statement-breakpoint
CREATE INDEX `idx_tx_dataset` ON `transactions` (`datasetVersionId`);--> statement-breakpoint
CREATE INDEX `idx_tx_prefecture` ON `transactions` (`prefecture`);--> statement-breakpoint
CREATE INDEX `idx_tx_city` ON `transactions` (`city`);--> statement-breakpoint
CREATE INDEX `idx_tx_property_type` ON `transactions` (`propertyType`);--> statement-breakpoint
CREATE INDEX `idx_tx_transaction_ym` ON `transactions` (`transactionYm`);--> statement-breakpoint
CREATE INDEX `idx_tx_pref_city_type` ON `transactions` (`prefecture`,`city`,`propertyType`);--> statement-breakpoint
CREATE INDEX `idx_valuation_req_created` ON `valuation_requests` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_valuation_req_prefecture` ON `valuation_requests` (`inputPrefecture`);--> statement-breakpoint
CREATE INDEX `idx_valuation_req_property_type` ON `valuation_requests` (`propertyType`);--> statement-breakpoint
CREATE INDEX `idx_valuation_result_request` ON `valuation_results` (`requestId`);--> statement-breakpoint
CREATE INDEX `idx_valuation_result_created` ON `valuation_results` (`createdAt`);