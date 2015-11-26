
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 11/25/2015 14:19:38
-- Generated from EDMX file: C:\Users\SAFI\Desktop\ProductionPlan\ProductionPlan\DAL\AppDBM.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [ProductionPlan];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_Order_Buyer]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Order] DROP CONSTRAINT [FK_Order_Buyer];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[Bundle]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Bundle];
GO
IF OBJECT_ID(N'[dbo].[Buyer]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Buyer];
GO
IF OBJECT_ID(N'[dbo].[Employee]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Employee];
GO
IF OBJECT_ID(N'[dbo].[Machine]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Machine];
GO
IF OBJECT_ID(N'[dbo].[Materials]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Materials];
GO
IF OBJECT_ID(N'[dbo].[Order]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Order];
GO
IF OBJECT_ID(N'[dbo].[Role]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Role];
GO
IF OBJECT_ID(N'[dbo].[Seller]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Seller];
GO
IF OBJECT_ID(N'[dbo].[Status]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Status];
GO
IF OBJECT_ID(N'[dbo].[Store]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Store];
GO
IF OBJECT_ID(N'[dbo].[Style]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Style];
GO
IF OBJECT_ID(N'[AppDBModelStoreContainer].[MaterialSeller]', 'U') IS NOT NULL
    DROP TABLE [AppDBModelStoreContainer].[MaterialSeller];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'Bundles'
CREATE TABLE [dbo].[Bundles] (
    [Id] uniqueidentifier  NOT NULL,
    [BarCode] nvarchar(15)  NOT NULL,
    [StyleId] uniqueidentifier  NOT NULL,
    [Quantity] int  NOT NULL,
    [Status] int  NOT NULL,
    [LinkingStartAt] datetime  NULL,
    [LinkingBy] uniqueidentifier  NULL,
    [LinkingEndAt] datetime  NULL,
    [KnittingMachine] nvarchar(50)  NOT NULL,
    [OperatorId] uniqueidentifier  NOT NULL,
    [CreatedAt] datetime  NOT NULL,
    [CreatedBy] uniqueidentifier  NOT NULL,
    [UpdatedBy] uniqueidentifier  NULL,
    [UpdateInfo] nvarchar(max)  NULL
);
GO

-- Creating table 'Buyers'
CREATE TABLE [dbo].[Buyers] (
    [Id] uniqueidentifier  NOT NULL,
    [Name] nvarchar(100)  NOT NULL,
    [Email] nvarchar(150)  NULL,
    [Phone] nvarchar(100)  NULL,
    [Description] nvarchar(max)  NULL,
    [CreatedBy] uniqueidentifier  NOT NULL,
    [UpdatedBy] uniqueidentifier  NULL,
    [UpdateInfo] nvarchar(max)  NULL,
    [CreatedAt] datetime  NOT NULL,
    [Address] nvarchar(300)  NULL
);
GO

-- Creating table 'Employees'
CREATE TABLE [dbo].[Employees] (
    [Id] uniqueidentifier  NOT NULL,
    [Name] nvarchar(100)  NOT NULL,
    [UserName] nvarchar(20)  NOT NULL,
    [Password] nvarchar(200)  NOT NULL,
    [BarCode] nvarchar(15)  NOT NULL,
    [Phone] nvarchar(15)  NOT NULL,
    [Email] nvarchar(70)  NULL,
    [Role] nvarchar(12)  NOT NULL,
    [CreatedBy] uniqueidentifier  NOT NULL,
    [UpdatedBy] uniqueidentifier  NULL,
    [UpdateInfo] nvarchar(max)  NULL,
    [IsActive] bit  NOT NULL,
    [CreatedAt] datetime  NULL,
    [Address] nvarchar(300)  NULL
);
GO

-- Creating table 'Machines'
CREATE TABLE [dbo].[Machines] (
    [Id] uniqueidentifier  NOT NULL,
    [Model] nvarchar(50)  NULL,
    [Speed] int  NOT NULL,
    [Status] int  NOT NULL,
    [CreatedBy] uniqueidentifier  NOT NULL,
    [UpdatedBy] uniqueidentifier  NULL,
    [UpdateInfo] nvarchar(max)  NULL
);
GO

-- Creating table 'Materials'
CREATE TABLE [dbo].[Materials] (
    [Id] uniqueidentifier  NOT NULL,
    [SellerId] uniqueidentifier  NOT NULL,
    [OrderId] uniqueidentifier  NOT NULL,
    [Amount] float  NOT NULL,
    [Description] nvarchar(max)  NULL,
    [OrderDate] datetime  NOT NULL,
    [DeliveryDate] datetime  NOT NULL,
    [CreatedBy] uniqueidentifier  NOT NULL,
    [UpdatedBy] uniqueidentifier  NULL,
    [ReceivedDate] datetime  NULL,
    [UpdateInfo] nvarchar(max)  NULL,
    [CreatedAt] datetime  NOT NULL
);
GO

-- Creating table 'Orders'
CREATE TABLE [dbo].[Orders] (
    [Id] uniqueidentifier  NOT NULL,
    [CodeNumber] nvarchar(10)  NOT NULL,
    [BuyerId] uniqueidentifier  NOT NULL,
    [OrderDate] datetime  NOT NULL,
    [DeliveryDate] datetime  NOT NULL,
    [TotalQuantity] decimal(10,0)  NOT NULL,
    [TotalCompleted] decimal(10,0)  NULL,
    [ProductionStartAT] datetime  NULL,
    [Style] nvarchar(50)  NOT NULL,
    [Color] nvarchar(50)  NOT NULL,
    [Size] nvarchar(50)  NOT NULL,
    [Description] nvarchar(max)  NULL,
    [CreatedBy] uniqueidentifier  NOT NULL,
    [UpdatedBy] uniqueidentifier  NULL,
    [UpdateInfo] nvarchar(max)  NULL,
    [Status] int  NOT NULL
);
GO

-- Creating table 'Roles'
CREATE TABLE [dbo].[Roles] (
    [Id] uniqueidentifier  NOT NULL,
    [Name] nvarchar(100)  NOT NULL,
    [Code] nvarchar(3)  NOT NULL,
    [AccessRole] varchar(30)  NULL,
    [Description] nvarchar(max)  NULL,
    [Priority] int  NOT NULL,
    [CreatedBy] uniqueidentifier  NOT NULL,
    [UpdatedBy] uniqueidentifier  NULL,
    [UpdateInfo] nvarchar(max)  NULL
);
GO

-- Creating table 'Sellers'
CREATE TABLE [dbo].[Sellers] (
    [Id] uniqueidentifier  NOT NULL,
    [Name] nvarchar(100)  NOT NULL,
    [Email] nvarchar(150)  NULL,
    [Phone] nvarchar(100)  NULL,
    [Address] nvarchar(500)  NULL,
    [Description] nvarchar(max)  NULL,
    [CreatedBy] uniqueidentifier  NOT NULL,
    [UpdatedBy] uniqueidentifier  NULL,
    [UpdateInfo] nvarchar(max)  NULL,
    [CreatedAt] datetime  NULL
);
GO

-- Creating table 'Status'
CREATE TABLE [dbo].[Status] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Code] nvarchar(3)  NOT NULL,
    [Name] nvarchar(100)  NOT NULL,
    [Description] nvarchar(max)  NULL,
    [CreatedBy] uniqueidentifier  NOT NULL,
    [UpdateInfo] nvarchar(max)  NULL
);
GO

-- Creating table 'Stores'
CREATE TABLE [dbo].[Stores] (
    [Id] uniqueidentifier  NOT NULL,
    [OrderId] uniqueidentifier  NOT NULL,
    [MaterialId] uniqueidentifier  NOT NULL,
    [UsedAmount] float  NULL,
    [UseableAmount] float  NOT NULL,
    [CreatedBy] uniqueidentifier  NOT NULL,
    [UpdatedBy] uniqueidentifier  NULL,
    [UpdateInfo] nvarchar(max)  NULL,
    [StatusId] int  NOT NULL,
    [ReadyToUseAt] datetime  NULL
);
GO

-- Creating table 'Styles'
CREATE TABLE [dbo].[Styles] (
    [Id] uniqueidentifier  NOT NULL,
    [BarCode] nvarchar(13)  NOT NULL,
    [Name] nvarchar(20)  NOT NULL,
    [BuyerId] uniqueidentifier  NOT NULL,
    [YarnType] nvarchar(50)  NULL,
    [Size] nchar(10)  NOT NULL,
    [Description] nvarchar(max)  NULL,
    [ProductionStartAt] datetime  NULL,
    [ProductionEndAt] datetime  NULL,
    [ShippingDate] datetime  NOT NULL,
    [ShippedAt] datetime  NULL,
    [CreatedAt] datetime  NOT NULL,
    [CreatedBy] uniqueidentifier  NOT NULL,
    [UpdatedBy] uniqueidentifier  NULL,
    [UpdateInfo] nvarchar(max)  NULL,
    [Quantity] decimal(10,0)  NOT NULL,
    [Status] int  NOT NULL
);
GO

-- Creating table 'MaterialSellers'
CREATE TABLE [dbo].[MaterialSellers] (
    [Id] uniqueidentifier  NOT NULL,
    [Name] nvarchar(100)  NOT NULL,
    [Email] nvarchar(150)  NULL,
    [Phone] nvarchar(100)  NULL,
    [Description] nvarchar(max)  NULL,
    [CreatedBy] uniqueidentifier  NOT NULL,
    [UpdatedBy] uniqueidentifier  NULL,
    [UpdateInfo] nvarchar(max)  NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'Bundles'
ALTER TABLE [dbo].[Bundles]
ADD CONSTRAINT [PK_Bundles]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Buyers'
ALTER TABLE [dbo].[Buyers]
ADD CONSTRAINT [PK_Buyers]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Employees'
ALTER TABLE [dbo].[Employees]
ADD CONSTRAINT [PK_Employees]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Machines'
ALTER TABLE [dbo].[Machines]
ADD CONSTRAINT [PK_Machines]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Materials'
ALTER TABLE [dbo].[Materials]
ADD CONSTRAINT [PK_Materials]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Orders'
ALTER TABLE [dbo].[Orders]
ADD CONSTRAINT [PK_Orders]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Roles'
ALTER TABLE [dbo].[Roles]
ADD CONSTRAINT [PK_Roles]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Sellers'
ALTER TABLE [dbo].[Sellers]
ADD CONSTRAINT [PK_Sellers]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Status'
ALTER TABLE [dbo].[Status]
ADD CONSTRAINT [PK_Status]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Stores'
ALTER TABLE [dbo].[Stores]
ADD CONSTRAINT [PK_Stores]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Styles'
ALTER TABLE [dbo].[Styles]
ADD CONSTRAINT [PK_Styles]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id], [Name], [CreatedBy] in table 'MaterialSellers'
ALTER TABLE [dbo].[MaterialSellers]
ADD CONSTRAINT [PK_MaterialSellers]
    PRIMARY KEY CLUSTERED ([Id], [Name], [CreatedBy] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [BuyerId] in table 'Orders'
ALTER TABLE [dbo].[Orders]
ADD CONSTRAINT [FK_Order_Buyer]
    FOREIGN KEY ([BuyerId])
    REFERENCES [dbo].[Buyers]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Creating non-clustered index for FOREIGN KEY 'FK_Order_Buyer'
CREATE INDEX [IX_FK_Order_Buyer]
ON [dbo].[Orders]
    ([BuyerId]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------