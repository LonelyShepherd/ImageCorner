namespace ImageCorner.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateModels1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Images", "Album_Id", c => c.Int());
            CreateIndex("dbo.Images", "Album_Id");
            AddForeignKey("dbo.Images", "Album_Id", "dbo.Albums", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Images", "Album_Id", "dbo.Albums");
            DropIndex("dbo.Images", new[] { "Album_Id" });
            DropColumn("dbo.Images", "Album_Id");
        }
    }
}
