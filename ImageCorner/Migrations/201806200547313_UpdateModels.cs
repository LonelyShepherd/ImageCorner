namespace ImageCorner.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateModels : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Images", "AlbumId", "dbo.Albums");
            DropIndex("dbo.Images", new[] { "AlbumId" });
            DropColumn("dbo.Images", "AlbumId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Images", "AlbumId", c => c.Int(nullable: false));
            CreateIndex("dbo.Images", "AlbumId");
            AddForeignKey("dbo.Images", "AlbumId", "dbo.Albums", "Id", cascadeDelete: true);
        }
    }
}
