namespace ImageCorner.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateModels2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Images", "HasAlbum", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Images", "HasAlbum");
        }
    }
}
