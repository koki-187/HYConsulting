CREATE TABLE `aggregated_real_estate_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyType` varchar(50) NOT NULL,
	`prefecture` varchar(50) NOT NULL,
	`city` varchar(100) NOT NULL,
	`district` varchar(100) NOT NULL,
	`buildingAgeGroup` varchar(50) NOT NULL,
	`totalPriceYen` decimal(20,2) NOT NULL,
	`totalAreaM2` decimal(15,2) NOT NULL,
	`transactionCount` int NOT NULL,
	`pricePerTsubo` int NOT NULL,
	`averagePriceYen` int NOT NULL,
	`averageAreaM2` decimal(10,2) NOT NULL,
	`datasetVersionId` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aggregated_real_estate_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessment_error_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`errorType` varchar(100) NOT NULL,
	`input` text NOT NULL,
	`errorMessage` text,
	`stackTrace` text,
	`userMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessment_error_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_agg_lookup` ON `aggregated_real_estate_data` (`propertyType`,`prefecture`,`city`,`district`,`buildingAgeGroup`);--> statement-breakpoint
CREATE INDEX `idx_agg_prefecture` ON `aggregated_real_estate_data` (`prefecture`);--> statement-breakpoint
CREATE INDEX `idx_agg_city` ON `aggregated_real_estate_data` (`city`);--> statement-breakpoint
CREATE INDEX `idx_agg_property_type` ON `aggregated_real_estate_data` (`propertyType`);--> statement-breakpoint
CREATE INDEX `idx_agg_pref_city` ON `aggregated_real_estate_data` (`prefecture`,`city`);