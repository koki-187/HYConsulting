CREATE TABLE `assessment_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyType` varchar(50) NOT NULL,
	`location` varchar(255) NOT NULL,
	`buildingAge` int,
	`floorArea` int,
	`landArea` int,
	`condition` varchar(50),
	`ownerName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`estimatedPrice` int,
	`assessmentStatus` varchar(50) DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessment_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `property_database` (
	`id` int AUTO_INCREMENT NOT NULL,
	`propertyType` varchar(50) NOT NULL,
	`location` varchar(255) NOT NULL,
	`buildingAge` int NOT NULL,
	`floorArea` int NOT NULL,
	`condition` varchar(50) NOT NULL,
	`soldPrice` int NOT NULL,
	`pricePerSqm` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `property_database_id` PRIMARY KEY(`id`)
);
