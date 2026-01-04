CREATE TABLE `assessment_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assessmentRequestId` int NOT NULL,
	`surroundingPrice` int,
	`transactionCount` int,
	`avgPricePerSqm` decimal(10,2),
	`vacancyRate` varchar(50),
	`marketTrend` varchar(50),
	`estimatedPrice` int,
	`priceRangeMin` int,
	`priceRangeMax` int,
	`evaluationPoints` text,
	`investmentValue` varchar(50),
	`forecast1Year` int,
	`forecast3Year` int,
	`forecast5Year` int,
	`forecastReasoning` text,
	`status` enum('pending','completed','error') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`retryCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessment_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assessmentRequestId` int,
	`action` varchar(100) NOT NULL,
	`details` text,
	`status` varchar(50) NOT NULL,
	`errorCode` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `property_database` MODIFY COLUMN `pricePerSqm` decimal(10,2) NOT NULL;--> statement-breakpoint
ALTER TABLE `assessment_requests` ADD `prefecture` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `assessment_requests` ADD `city` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `assessment_requests` ADD `errorMessage` text;--> statement-breakpoint
ALTER TABLE `property_database` ADD `prefecture` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `property_database` ADD `city` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `property_database` ADD `transactionDate` varchar(50);--> statement-breakpoint
ALTER TABLE `property_database` ADD `source` varchar(100) DEFAULT 'MLIT';